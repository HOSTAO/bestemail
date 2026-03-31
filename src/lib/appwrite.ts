/**
 * Appwrite client setup for BestEmail Platform.
 *
 * Browser client: uses public endpoint + project ID (no API key).
 * Server client: uses API key for database queries in API routes / SSR.
 * Also exports a Supabase-compatible query builder (AppwriteClientWrapper)
 * so that supabase.ts can re-export `appwriteAdmin` without any changes to
 * the hundreds of API routes that still import from './supabase'.
 */

import { Client as BrowserClient, Account, Databases as BrowserDatabases } from 'appwrite';
import { Client, Databases, Query, ID } from 'node-appwrite';
import { runtimeConfig } from './runtime-config';

// ── Config ─────────────────────────────────────────────────────────────────
const APPWRITE_ENDPOINT = runtimeConfig.appwriteEndpoint;
const APPWRITE_PROJECT  = runtimeConfig.appwriteProject;
const APPWRITE_KEY      = runtimeConfig.appwriteKey;
export const DATABASE_ID = runtimeConfig.appwriteDatabase || 'main';

export const COLLECTIONS = {
  users:         'users',
  campaigns:     'campaigns',
  templates:     'templates',
  contacts:      'contacts',
  lists:         'lists',
  sends:         'sends',
  analytics:     'analytics',
  domains:       'domains',
  subscriptions: 'subscriptions',
  forms:         'forms',
} as const;

// ── Browser client (React components / auth) ───────────────────────────────
const browserClient = new BrowserClient();
browserClient
  .setEndpoint(APPWRITE_ENDPOINT || 'https://cloud.hostao.com/v1')
  .setProject(APPWRITE_PROJECT || 'bestemail-app');

export const account   = new Account(browserClient);
export const databases = new BrowserDatabases(browserClient);
export { browserClient as client };

// ── Server client ──────────────────────────────────────────────────────────
let serverClient: Client | null = null;
let serverDatabases: Databases | null = null;

if (APPWRITE_ENDPOINT && APPWRITE_PROJECT && APPWRITE_KEY) {
  serverClient = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT)
    .setKey(APPWRITE_KEY);
  serverDatabases = new Databases(serverClient);
} else {
  console.warn('[appwrite] Server env vars missing – database writes disabled.');
}

/** Returns server-side Appwrite primitives for use in API routes / data.ts */
export function createServerClient() {
  const { Client: SC, Databases: SD, Users: SU, Query: SQ, ID: SID } =
    require('node-appwrite') as typeof import('node-appwrite');

  const sc = new SC()
    .setEndpoint(APPWRITE_ENDPOINT || 'https://cloud.hostao.com/v1')
    .setProject(APPWRITE_PROJECT || 'bestemail-app')
    .setKey(APPWRITE_KEY || '');

  return {
    client:    sc,
    databases: new SD(sc),
    users:     new SU(sc),
    Query:     SQ,
    ID:        SID,
  };
}

export { serverDatabases, serverClient, ID, Query };

// ── Helpers ────────────────────────────────────────────────────────────────
export function mapDocument<T extends Record<string, unknown>>(
  doc: Record<string, unknown>,
): T {
  const { $id, $createdAt, $updatedAt, $permissions, $databaseId, $collectionId, ...rest } = doc;
  return {
    ...rest,
    id: $id as string,
    ...(rest.createdAt  === undefined && $createdAt  ? { createdAt:  $createdAt  as string } : {}),
    ...(rest.updatedAt  === undefined && $updatedAt  ? { updatedAt:  $updatedAt  as string } : {}),
    ...(rest.created_at === undefined && $createdAt  ? { created_at: $createdAt  as string } : {}),
    ...(rest.updated_at === undefined && $updatedAt  ? { updated_at: $updatedAt  as string } : {}),
  } as unknown as T;
}

export function isAppwriteConfigured(): boolean {
  return !!(APPWRITE_ENDPOINT && APPWRITE_PROJECT && APPWRITE_KEY);
}

// ── Map field name: `id` → `$id` ──────────────────────────────────────────
function qField(field: string): string {
  return field === 'id' ? '$id' : field;
}

// ── Parse Supabase-style OR expression ─────────────────────────────────────
function parseOrExpression(expression: string): string[] {
  const queries: string[] = [];
  for (const part of expression.split(',')) {
    const dotIdx = part.indexOf('.');
    if (dotIdx < 0) continue;
    const field = part.slice(0, dotIdx);
    const rest  = part.slice(dotIdx + 1);
    const opIdx = rest.indexOf('.');
    if (opIdx < 0) continue;
    const operator = rest.slice(0, opIdx);
    const value    = rest.slice(opIdx + 1);
    const f = qField(field);
    switch (operator) {
      case 'ilike': queries.push(Query.search(f, value.replace(/%/g, ''))); break;
      case 'eq':    queries.push(Query.equal(f, [value]));                  break;
      case 'neq':   queries.push(Query.notEqual(f, [value]));               break;
      case 'gt':    queries.push(Query.greaterThan(f, value));               break;
      case 'gte':   queries.push(Query.greaterThanEqual(f, value));          break;
      case 'lt':    queries.push(Query.lessThan(f, value));                  break;
      case 'lte':   queries.push(Query.lessThanEqual(f, value));             break;
      case 'is':    if (value === 'null') queries.push(Query.isNull(f));     break;
    }
  }
  return queries;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QResult = { data: any; error: { message: string; code?: string; details?: string } | null; count?: number | null };

// ── Supabase-compatible query builder backed by Appwrite ───────────────────
class AppwriteQueryBuilder {
  private col: string;
  private filters: string[] = [];
  private _insert: Record<string, unknown> | Record<string, unknown>[] | null = null;
  private _update: Record<string, unknown> | null = null;
  private _del    = false;
  private _upsert: Record<string, unknown> | Record<string, unknown>[] | null = null;
  private _upsertOpts: { onConflict?: string; ignoreDuplicates?: boolean } | null = null;
  private _sel    = false;
  private _single = false;
  private _maybe  = false;
  private _countMode: string | null = null;
  private _head   = false;

  constructor(col: string) { this.col = col; }

  // ── Builders ──────────────────────────────────────────────────────────────
  select(fields?: string, opts?: { count?: string; head?: boolean }): this {
    this._sel = true;
    if (opts?.count) this._countMode = opts.count;
    if (opts?.head)  this._head = true;
    return this;
  }
  insert(data: Record<string, unknown> | Record<string, unknown>[]): this { this._insert = data; return this; }
  update(data: Record<string, unknown>): this { this._update = data; return this; }
  delete(): this { this._del = true; return this; }
  upsert(data: Record<string, unknown> | Record<string, unknown>[], opts?: { onConflict?: string; ignoreDuplicates?: boolean }): this {
    this._upsert = data; this._upsertOpts = opts || null; return this;
  }

  // ── Filters ───────────────────────────────────────────────────────────────
  eq(field: string, value: unknown): this  { this.filters.push(Query.equal(qField(field), [value as string]));       return this; }
  neq(field: string, value: unknown): this { this.filters.push(Query.notEqual(qField(field), [value as string]));    return this; }
  gt(field: string, value: unknown): this  { this.filters.push(Query.greaterThan(qField(field), value as string));   return this; }
  gte(field: string, value: unknown): this { this.filters.push(Query.greaterThanEqual(qField(field), value as string)); return this; }
  lt(field: string, value: unknown): this  { this.filters.push(Query.lessThan(qField(field), value as string));      return this; }
  lte(field: string, value: unknown): this { this.filters.push(Query.lessThanEqual(qField(field), value as string)); return this; }
  ilike(field: string, pattern: string): this { this.filters.push(Query.search(qField(field), pattern.replace(/%/g, ''))); return this; }
  contains(field: string, value: unknown): this {
    this.filters.push(Query.contains(qField(field), Array.isArray(value) ? value : [value as string])); return this;
  }
  in(field: string, values: unknown[]): this { this.filters.push(Query.equal(qField(field), values as string[])); return this; }
  or(expression: string): this {
    const orQ = parseOrExpression(expression);
    if (orQ.length > 0) {
      try { this.filters.push(Query.or(orQ)); } catch { this.filters.push(...orQ); }
    }
    return this;
  }
  is(field: string, value: unknown): this {
    if (value === null) this.filters.push(Query.isNull(qField(field)));
    return this;
  }
  order(field: string, opts?: { ascending?: boolean }): this {
    this.filters.push(opts?.ascending ? Query.orderAsc(field) : Query.orderDesc(field)); return this;
  }
  limit(n: number): this  { this.filters.push(Query.limit(n));  return this; }
  single(): this      { this._single = true; return this; }
  maybeSingle(): this { this._maybe  = true; return this; }

  // ── Thenable ──────────────────────────────────────────────────────────────
  then<T1 = QResult, T2 = never>(
    onOk?:  ((v: QResult) => T1 | PromiseLike<T1>) | null,
    onErr?: ((e: unknown) => T2 | PromiseLike<T2>) | null,
  ): Promise<T1 | T2> {
    return this._exec().then(onOk, onErr);
  }

  // ── Execution ─────────────────────────────────────────────────────────────
  private async _exec(): Promise<QResult> {
    if (!serverDatabases) return { data: null, error: { message: 'Appwrite not configured', code: 'NOT_CONFIGURED' } };
    try {
      if (this._insert)  return await this._doInsert();
      if (this._update)  return await this._doUpdate();
      if (this._del)     return await this._doDelete();
      if (this._upsert)  return await this._doUpsert();
      return await this._doSelect();
    } catch (err: unknown) {
      const e = err as { message?: string; code?: number | string };
      return { data: null, error: { message: e.message || String(err), code: String(e.code || '') } };
    }
  }

  private async _doInsert(): Promise<QResult> {
    if (Array.isArray(this._insert)) {
      const results: unknown[] = [];
      for (const item of this._insert) {
        const raw = { ...item }; delete raw.id;
        for (const k of Object.keys(raw)) if (raw[k] === undefined) delete raw[k];
        const doc = await serverDatabases!.createDocument(DATABASE_ID, this.col, ID.unique(), raw);
        results.push(mapDocument(doc as unknown as Record<string, unknown>));
      }
      return { data: this._single || this._maybe ? results[0] || null : results, error: null };
    }
    const raw = { ...this._insert! }; delete raw.id;
    for (const k of Object.keys(raw)) if (raw[k] === undefined) delete raw[k];
    const doc = await serverDatabases!.createDocument(DATABASE_ID, this.col, ID.unique(), raw);
    return { data: mapDocument(doc as unknown as Record<string, unknown>), error: null };
  }

  private async _doUpdate(): Promise<QResult> {
    const docs = await this._findDocs();
    if (docs.length === 0) {
      if (this._single) return { data: null, error: { message: 'No rows found', code: 'PGRST116' } };
      return { data: null, error: null };
    }
    const raw = { ...this._update! }; delete raw.id;
    for (const k of Object.keys(raw)) if (raw[k] === undefined) delete raw[k];
    const results: unknown[] = [];
    for (const d of docs) {
      const updated = await serverDatabases!.updateDocument(DATABASE_ID, this.col, d.$id as string, raw);
      results.push(mapDocument(updated as unknown as Record<string, unknown>));
    }
    if (this._single || this._maybe) return { data: results[0] || null, error: null };
    if (this._sel) return { data: results as unknown as Record<string, unknown>, error: null };
    return { data: null, error: null };
  }

  private async _doDelete(): Promise<QResult> {
    const docs = await this._findDocs();
    for (const d of docs) await serverDatabases!.deleteDocument(DATABASE_ID, this.col, d.$id as string);
    return { data: null, error: null };
  }

  private async _doUpsert(): Promise<QResult> {
    const items = Array.isArray(this._upsert) ? this._upsert : [this._upsert!];
    const conflictFields = this._upsertOpts?.onConflict?.split(',').map(f => f.trim()) || [];
    const results: unknown[] = [];
    for (const item of items) {
      let existing: Record<string, unknown> | null = null;
      if (conflictFields.length > 0) {
        const cq = conflictFields
          .filter(f => item[f] !== undefined && item[f] !== null)
          .map(f => Query.equal(qField(f), [item[f] as string]));
        if (cq.length > 0) {
          try {
            const res = await serverDatabases!.listDocuments(DATABASE_ID, this.col, [...cq, Query.limit(1)]);
            if (res.documents.length > 0) existing = res.documents[0] as unknown as Record<string, unknown>;
          } catch { /* not found */ }
        }
      }
      const raw = { ...item }; delete raw.id;
      for (const k of Object.keys(raw)) if (raw[k] === undefined) delete raw[k];
      const doc = existing
        ? await serverDatabases!.updateDocument(DATABASE_ID, this.col, (existing as Record<string, unknown>).$id as string, raw)
        : await serverDatabases!.createDocument(DATABASE_ID, this.col, ID.unique(), raw);
      results.push(mapDocument(doc as unknown as Record<string, unknown>));
    }
    if (this._single || this._maybe) return { data: results[0] || null, error: null };
    if (this._sel) return { data: results as unknown as Record<string, unknown>, error: null };
    return { data: results.length === 1 ? results[0] : results as unknown as Record<string, unknown>, error: null };
  }

  private async _doSelect(): Promise<QResult> {
    if (this._head) {
      const res = await serverDatabases!.listDocuments(DATABASE_ID, this.col, [...this.filters, Query.limit(1)]);
      return { data: null, error: null, count: res.total };
    }
    const res = await serverDatabases!.listDocuments(DATABASE_ID, this.col, this.filters);
    const mapped = res.documents.map(d => mapDocument(d as unknown as Record<string, unknown>));
    if (this._single) {
      if (mapped.length === 0) return { data: null, error: { message: 'No rows found', code: 'PGRST116' } };
      return { data: mapped[0], error: null };
    }
    if (this._maybe) return { data: mapped[0] || null, error: null };
    return { data: mapped as unknown as Record<string, unknown>, error: null, count: res.total };
  }

  private async _findDocs(): Promise<Record<string, unknown>[]> {
    const filterOnly = this.filters.filter(q => {
      const s = String(q);
      return !s.startsWith('orderAsc') && !s.startsWith('orderDesc') && !s.startsWith('limit') && !s.startsWith('offset');
    });
    const res = await serverDatabases!.listDocuments(DATABASE_ID, this.col, [...filterOnly, Query.limit(100)]);
    return res.documents as unknown as Record<string, unknown>[];
  }
}

// ── Top-level wrapper mimicking Supabase JS client ─────────────────────────
class AppwriteClientWrapper {
  from(collection: string): AppwriteQueryBuilder {
    return new AppwriteQueryBuilder(collection);
  }

  async rpc(functionName: string, params: Record<string, unknown>): Promise<QResult> {
    if (!serverDatabases) return { data: null, error: { message: 'Appwrite not configured' } };
    try {
      if (functionName === 'increment_campaign_opens') {
        const cid = params.campaign_id_param as string;
        const res = await serverDatabases.listDocuments(DATABASE_ID, 'campaigns', [Query.equal('$id', [cid]), Query.limit(1)]);
        if (res.documents.length > 0) {
          const c = res.documents[0] as Record<string, unknown>;
          await serverDatabases.updateDocument(DATABASE_ID, 'campaigns', c.$id as string, { open_count: ((c.open_count as number) || 0) + 1 });
        }
        return { data: null, error: null };
      }
      if (functionName === 'increment_campaign_clicks') {
        const cid = params.campaign_id_param as string;
        const res = await serverDatabases.listDocuments(DATABASE_ID, 'campaigns', [Query.equal('$id', [cid]), Query.limit(1)]);
        if (res.documents.length > 0) {
          const c = res.documents[0] as Record<string, unknown>;
          await serverDatabases.updateDocument(DATABASE_ID, 'campaigns', c.$id as string, { click_count: ((c.click_count as number) || 0) + 1 });
        }
        return { data: null, error: null };
      }
      console.warn(`[appwrite] Unknown RPC: ${functionName}`);
      return { data: null, error: null };
    } catch (err: unknown) {
      const e = err as { message?: string };
      return { data: null, error: { message: e.message || String(err) } };
    }
  }
}

// ── Public exports ─────────────────────────────────────────────────────────
export const appwriteAdmin: AppwriteClientWrapper | null =
  APPWRITE_ENDPOINT && APPWRITE_PROJECT && APPWRITE_KEY
    ? new AppwriteClientWrapper()
    : null;

export const appwritePublic: AppwriteClientWrapper | null = appwriteAdmin;
export function createAppwriteServer(): AppwriteClientWrapper | null { return appwriteAdmin; }
