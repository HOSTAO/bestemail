import fs from 'fs';
import path from 'path';

export type User = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'admin' | 'member';
  createdAt: string;
};

export type Contact = {
  id: string;
  userId?: string;
  email: string;
  name?: string;
  city?: string;
  businessType?: string;
  tags: string[];
  status?: 'active' | 'unsubscribed' | 'bounced';
  createdAt: string;
  updatedAt?: string;
};

export type Segment = {
  id: string;
  userId?: string;
  name: string;
  rules: { field: 'city' | 'businessType' | 'tag'; value: string }[];
  createdAt: string;
  updatedAt?: string;
};

export type Campaign = {
  id: string;
  name: string;
  subject: string;
  content: string;
  html_content?: string;
  segmentId?: string;
  scheduled_at?: string;
  status: 'draft' | 'queued';
  createdAt: string;
  updatedAt?: string;
};

export type Form = {
  id: string;
  userId?: string;
  name: string;
  type: 'popup' | 'embedded' | 'landing';
  targetList: string;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'email' | 'select';
    required: boolean;
    options?: string[];
  }>;
  settings: {
    successMessage?: string;
    redirectUrl?: string;
    status?: 'draft' | 'active';
    trackingEnabled?: boolean;
    submittedContactTags?: string[];
    lastSubmissionAt?: string;
    lastSubmissionTargetList?: string;
    lastSubmissionSource?: string;
  };
  embedCode: string;
  submissionsCount: number;
  status: 'draft' | 'active';
  createdAt: string;
  updatedAt: string;
};

export type DB = {
  users: User[];
  contacts: Contact[];
  segments: Segment[];
  campaigns: Campaign[];
  forms: Form[];
};

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

const defaultDb: DB = {
  users: [],
  contacts: [],
  segments: [],
  campaigns: [],
  forms: [],
};

function normalizeDb(input: Partial<DB>): DB {
  return {
    users: Array.isArray(input.users) ? input.users : [],
    contacts: Array.isArray(input.contacts)
      ? input.contacts.map((contact) => ({
          ...contact,
          email: String(contact.email || '').toLowerCase(),
          tags: Array.isArray(contact.tags) ? contact.tags : [],
          status: contact.status || 'active',
          updatedAt: contact.updatedAt || contact.createdAt,
        }))
      : [],
    segments: Array.isArray(input.segments)
      ? input.segments.map((segment) => ({
          ...segment,
          rules: Array.isArray(segment.rules) ? segment.rules : [],
          updatedAt: segment.updatedAt || segment.createdAt,
        }))
      : [],
    campaigns: Array.isArray(input.campaigns) ? input.campaigns : [],
    forms: Array.isArray(input.forms) ? input.forms : [],
  };
}

export function readDb(): DB {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultDb, null, 2));
  }
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  const parsed = JSON.parse(raw) as Partial<DB>;
  const normalized = normalizeDb(parsed);

  // Self-heal old schema files missing new keys
  if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(normalized, null, 2));
  }

  return normalized;
}

export function writeDb(db: DB) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
