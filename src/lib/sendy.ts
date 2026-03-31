// SENDY INTEGRATION FOR my.bestemail.in
// =====================================
import { getSendySettingsServer } from './settings';

type SendyConfig = {
  apiUrl: string;
  apiKey: string;
  listId: string;
  brandId?: string;
};

type SendyResult = {
  ok: boolean;
  text: string;
  status?: number;
  reason?: 'config_missing' | 'network_error' | 'sendy_error';
};

// Cache for settings to avoid repeated database calls
let cachedConfig: SendyConfig | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function normalizeApiUrl(value: string) {
  return value.replace(/\/+$/, '');
}

function isConfigured(config: SendyConfig | null | undefined): config is SendyConfig {
  return !!config?.apiUrl && !!config.apiKey && !!config.listId;
}

async function getConfig(userId?: string, override?: Partial<SendyConfig>): Promise<SendyConfig | null> {
  if (isConfigured(override as SendyConfig)) {
    return {
      apiUrl: normalizeApiUrl(String(override!.apiUrl)),
      apiKey: String(override!.apiKey),
      listId: String(override!.listId),
      brandId: override!.brandId ? String(override!.brandId) : undefined,
    };
  }

  // Check cache first
  if (cachedConfig && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedConfig;
  }

  // Get settings from database or environment
  const settings = await getSendySettingsServer(userId);
  const config = {
    apiUrl: normalizeApiUrl(settings.apiUrl),
    apiKey: settings.apiKey,
    listId: settings.listId,
    brandId: settings.brandId,
  };

  if (!isConfigured(config)) {
    console.error('Missing Sendy configuration. Please configure in Settings or .env.local');
    return null;
  }

  cachedConfig = config;
  cacheTimestamp = Date.now();
  return config;
}

// Add subscriber to your Sendy list
export async function addSubscriberToSendy(input: { 
  email: string; 
  name?: string;
  customFields?: Record<string, string>;
  userId?: string;
}) {
  const config = await getConfig(input.userId);

  if (!config) {
    return { ok: false, text: 'Sendy is not configured yet', reason: 'config_missing' } satisfies SendyResult;
  }

  const { apiUrl, apiKey, listId } = config;
  const body = new URLSearchParams({
    api_key: apiKey,
    list: listId,
    email: input.email,
    name: input.name || '',
    boolean: 'true',
    ...input.customFields
  });

  try {
    const res = await fetch(`${apiUrl}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const text = (await res.text()).trim();
    return { ok: text === '1' || text === 'Already subscribed.', text, status: res.status } satisfies SendyResult;
  } catch (error) {
    console.error('Sendy subscribe error:', error);
    return { ok: false, text: 'Network error', reason: 'network_error' } satisfies SendyResult;
  }
}

// Create and send campaign via your Sendy
export async function createSendyCampaign(input: {
  fromName: string;
  fromEmail: string;
  replyTo: string;
  subject: string;
  plainText: string;
  htmlText: string;
  title: string;
  listIds?: string;
  scheduleDate?: string;
  trackOpens?: boolean;
  trackClicks?: boolean;
  userId?: string;
  configOverride?: Partial<SendyConfig>;
}) {
  const config = await getConfig(input.userId, input.configOverride);

  if (!config) {
    return { ok: false, text: 'Sendy is not configured yet', reason: 'config_missing' } satisfies SendyResult;
  }

  const { apiUrl, apiKey, listId, brandId } = config;
  const body = new URLSearchParams({
    api_key: apiKey,
    from_name: input.fromName,
    from_email: input.fromEmail,
    reply_to: input.replyTo,
    subject: input.subject,
    plain_text: input.plainText,
    html_text: input.htmlText,
    title: input.title,
    list_ids: input.listIds || listId,
    brand_id: brandId || process.env.SENDY_BRAND_ID || '1',
    query_string: '',
    send_campaign: input.scheduleDate ? '0' : '1',
    track_opens: input.trackOpens !== false ? '1' : '0',
    track_clicks: input.trackClicks !== false ? '1' : '0',
  });

  if (input.scheduleDate) {
    body.append('send_date', input.scheduleDate);
    body.append('schedule', '1');
  }

  try {
    const res = await fetch(`${apiUrl}/api/campaigns/create.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const text = (await res.text()).trim();
    const ok = res.ok && (
      text.includes('Campaign created') ||
      text.includes('Campaign scheduled') ||
      text.includes('Campaign created and sent')
    );

    return { ok, text, status: res.status, reason: ok ? undefined : 'sendy_error' } satisfies SendyResult;
  } catch (error) {
    console.error('Sendy campaign error:', error);
    return { ok: false, text: 'Network error', reason: 'network_error' } satisfies SendyResult;
  }
}

// Get subscriber count from your Sendy list
export async function getSendyListCount(userId?: string): Promise<number> {
  const config = await getConfig(userId);
  if (!config) return 0;

  const { apiUrl, apiKey, listId } = config;
  const body = new URLSearchParams({
    api_key: apiKey,
    list_id: listId,
  });

  try {
    const res = await fetch(`${apiUrl}/api/subscribers/active-subscriber-count.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const text = await res.text();
    return res.ok ? parseInt(text) || 0 : 0;
  } catch (error) {
    console.error('Sendy list count error:', error);
    return 0;
  }
}

// Unsubscribe from your Sendy list
export async function unsubscribeFromSendy(email: string, userId?: string): Promise<boolean> {
  const config = await getConfig(userId);
  if (!config) return false;

  const { apiUrl, apiKey, listId } = config;
  const body = new URLSearchParams({ 
    api_key: apiKey,
    list: listId,
    email: email,
    boolean: 'true',
  });

  try {
    const res = await fetch(`${apiUrl}/unsubscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const text = await res.text();
    return text === '1' || text === 'Unsubscribed';
  } catch (error) {
    console.error('Sendy unsubscribe error:', error);
    return false;
  }
}

// Check subscriber status in your Sendy
export async function getSendySubscriberStatus(email: string, userId?: string): Promise<string> {
  const config = await getConfig(userId);
  if (!config) return 'Not configured';

  const { apiUrl, apiKey, listId } = config;
  const body = new URLSearchParams({
    api_key: apiKey,
    list_id: listId,
    email: email,
  });

  try {
    const res = await fetch(`${apiUrl}/api/subscribers/subscription-status.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const text = await res.text();
    // Returns: Subscribed, Unsubscribed, Bounced, Soft bounced, Complained, Not in list
    return text;
  } catch (error) {
    console.error('Sendy status error:', error);
    return 'Error';
  }
}

// Delete subscriber from your Sendy (GDPR compliance)
export async function deleteFromSendy(email: string, userId?: string): Promise<boolean> {
  const config = await getConfig(userId);
  if (!config) return false;

  const { apiUrl, apiKey, listId } = config;
  const body = new URLSearchParams({
    api_key: apiKey,
    list_id: listId,
    email: email,
  });

  try {
    const res = await fetch(`${apiUrl}/api/subscribers/delete.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const text = await res.text();
    return text === '1' || text === 'Deleted';
  } catch (error) {
    console.error('Sendy delete error:', error);
    return false;
  }
}