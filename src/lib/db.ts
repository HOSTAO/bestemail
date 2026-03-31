import { query } from './postgres';
import { hashPassword, verifyPassword as verifyPasswordLocal } from './auth';

export type { Contact, Campaign, Segment, Form, Template, User } from './supabase';

function slugifyTag(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function uniqueTags(tags: Array<string | undefined | null>) {
  return Array.from(new Set(tags.map((tag) => String(tag || '').trim()).filter(Boolean)));
}

export const db = {
  async createUser(data: { email: string; name: string; password: string; role?: 'admin' | 'member' }) {
    const passwordHash = await hashPassword(data.password);
    const normalizedEmail = data.email.toLowerCase();

    try {
      const result = await query(
        `INSERT INTO users (email, name, password_hash, role, email_verified, is_active)
         VALUES ($1, $2, $3, $4, false, true)
         RETURNING *`,
        [normalizedEmail, data.name, passwordHash, data.role || 'member']
      );
      return result.rows[0];
    } catch (err: any) {
      if (err.code === '23505') {
        throw new Error('An account with this email already exists');
      }
      throw err;
    }
  },

  async getUserByEmail(email: string) {
    const result = await query(
      `SELECT * FROM users WHERE email = $1 LIMIT 1`,
      [email.toLowerCase()]
    );
    return result.rows[0] || null;
  },

  async getUserById(id: string) {
    const result = await query(
      `SELECT * FROM users WHERE id = $1 LIMIT 1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async updateUser(userId: string, data: Record<string, any>) {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = $${idx}`);
        values.push(value);
        idx++;
      }
    }

    if (fields.length === 0) return null;

    values.push(userId);
    const result = await query(
      `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  async verifyPassword(password: string, hash: string) {
    return verifyPasswordLocal(password, hash);
  },

  async createContact(userId: string, data: any) {
    const email = data.email!.toLowerCase();
    const tags = data.tags || [];

    const result = await query(
      `INSERT INTO contacts (user_id, email, name, city, business_type, tags, status, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       ON CONFLICT (user_id, email) DO UPDATE SET
         name = COALESCE(EXCLUDED.name, contacts.name),
         city = COALESCE(EXCLUDED.city, contacts.city),
         business_type = COALESCE(EXCLUDED.business_type, contacts.business_type),
         tags = EXCLUDED.tags,
         updated_at = NOW()
       RETURNING *`,
      [userId, email, data.name || null, data.city || null, data.business_type || null, JSON.stringify(tags), data.status || 'active']
    );
    return result.rows[0];
  },

  async getContacts(userId: string, limit = 100) {
    const result = await query(
      `SELECT * FROM contacts WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  },

  async getContact(userId: string, contactId: string) {
    const result = await query(
      `SELECT * FROM contacts WHERE id = $1 AND user_id = $2 LIMIT 1`,
      [contactId, userId]
    );
    return result.rows[0] || null;
  },

  async updateContact(userId: string, contactId: string, data: Record<string, any>) {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        if (key === 'tags') {
          fields.push(`${key} = $${idx}`);
          values.push(JSON.stringify(value));
        } else {
          fields.push(`${key} = $${idx}`);
          values.push(value);
        }
        idx++;
      }
    }

    if (fields.length === 0) return null;

    values.push(contactId, userId);
    const result = await query(
      `UPDATE contacts SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${idx} AND user_id = $${idx + 1} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  async deleteContact(userId: string, contactId: string) {
    await query(
      `DELETE FROM contacts WHERE id = $1 AND user_id = $2`,
      [contactId, userId]
    );
  },

  async importContacts(userId: string, contacts: Array<any>) {
    const formatted = contacts.map((c) => ({
      user_id: userId,
      email: c.email!.toLowerCase(),
      name: c.name || null,
      city: c.city || null,
      business_type: c.business_type || null,
      tags: c.tags || [],
    }));

    for (const c of formatted) {
      await query(
        `INSERT INTO contacts (user_id, email, name, city, business_type, tags, status, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, 'active', NOW())
         ON CONFLICT (user_id, email) DO UPDATE SET
           name = COALESCE(EXCLUDED.name, contacts.name),
           city = COALESCE(EXCLUDED.city, contacts.city),
           business_type = COALESCE(EXCLUDED.business_type, contacts.business_type),
           tags = EXCLUDED.tags,
           updated_at = NOW()`,
        [c.user_id, c.email, c.name, c.city, c.business_type, JSON.stringify(c.tags)]
      );
    }

    return formatted.length;
  },

  async createCampaign(userId: string, data: any) {
    const result = await query(
      `INSERT INTO campaigns (user_id, name, subject, content, html_content, segment_id, status, scheduled_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        userId,
        data.name,
        data.subject,
        data.content || '',
        data.html_content || null,
        data.segment_id || null,
        data.status || 'draft',
        data.scheduled_at || null,
      ]
    );
    return result.rows[0];
  },

  async getCampaigns(userId: string, limit = 50) {
    const result = await query(
      `SELECT * FROM campaigns WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  },

  async getCampaign(userId: string, campaignId: string) {
    const result = await query(
      `SELECT * FROM campaigns WHERE id = $1 AND user_id = $2 LIMIT 1`,
      [campaignId, userId]
    );
    return result.rows[0] || null;
  },

  async updateCampaign(userId: string, campaignId: string, data: any) {
    const result = await query(
      `UPDATE campaigns SET
         name = COALESCE($1, name),
         subject = COALESCE($2, subject),
         content = COALESCE($3, content),
         html_content = $4,
         segment_id = $5,
         status = COALESCE($6, status),
         scheduled_at = $7,
         updated_at = NOW()
       WHERE id = $8 AND user_id = $9
       RETURNING *`,
      [
        data.name,
        data.subject,
        data.content,
        data.html_content || null,
        data.segment_id || null,
        data.status,
        data.scheduled_at || null,
        campaignId,
        userId,
      ]
    );
    return result.rows[0] || null;
  },

  async deleteCampaign(userId: string, campaignId: string) {
    await query(
      `DELETE FROM campaigns WHERE id = $1 AND user_id = $2`,
      [campaignId, userId]
    );
  },

  async updateCampaignStatus(userId: string, campaignId: string, status: string) {
    const sentAt = status === 'sent' ? new Date().toISOString() : null;
    await query(
      `UPDATE campaigns SET status = $1, sent_at = COALESCE($2, sent_at), updated_at = NOW() WHERE id = $3 AND user_id = $4`,
      [status, sentAt, campaignId, userId]
    );
  },

  async createSegment(userId: string, data: any) {
    const result = await query(
      `INSERT INTO segments (user_id, name, rules) VALUES ($1, $2, $3) RETURNING *`,
      [userId, data.name, JSON.stringify(data.rules || [])]
    );
    return result.rows[0];
  },

  async getSegments(userId: string) {
    const result = await query(
      `SELECT * FROM segments WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  },

  async getSegment(userId: string, segmentId: string) {
    const result = await query(
      `SELECT * FROM segments WHERE id = $1 AND user_id = $2 LIMIT 1`,
      [segmentId, userId]
    );
    return result.rows[0] || null;
  },

  async updateSegment(userId: string, segmentId: string, data: any) {
    const result = await query(
      `UPDATE segments SET name = COALESCE($1, name), rules = COALESCE($2, rules), updated_at = NOW()
       WHERE id = $3 AND user_id = $4 RETURNING *`,
      [data.name, data.rules ? JSON.stringify(data.rules) : null, segmentId, userId]
    );
    return result.rows[0] || null;
  },

  async deleteSegment(userId: string, segmentId: string) {
    await query(
      `DELETE FROM segments WHERE id = $1 AND user_id = $2`,
      [segmentId, userId]
    );
  },

  async createForm(userId: string, data: {
    name: string;
    type?: 'popup' | 'embedded' | 'landing';
    targetList?: string;
    fields?: any[];
    settings?: {
      success_message?: string;
      redirect_url?: string;
    };
    status?: 'draft' | 'active';
  }) {
    const formType = data.type || 'embedded';
    const formFields = data.fields && data.fields.length > 0
      ? data.fields
      : [
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'name', label: 'Name', type: 'text', required: false },
        ];

    const settings = {
      type: formType,
      target_list: data.targetList || 'main',
      status: data.status || 'draft',
      success_message: data.settings?.success_message || 'Thanks for signing up.',
      redirect_url: data.settings?.redirect_url || null,
      tracking_enabled: true,
      submitted_contact_tags: uniqueTags([
        `form:${formType}`,
        `list:${data.targetList || 'main'}`,
        `source:form`,
      ]),
    };

    const result = await query(
      `INSERT INTO forms (user_id, name, fields, settings, embed_code, submissions_count)
       VALUES ($1, $2, $3, $4, '', 0)
       RETURNING *`,
      [userId, data.name, JSON.stringify(formFields), JSON.stringify(settings)]
    );

    const form = result.rows[0];
    const embedCode = `<script async src="https://bestemail.in/embed/${form.id}.js"></script><div id="bestemail-${form.id}"></div>`;

    const updateResult = await query(
      `UPDATE forms SET embed_code = $1 WHERE id = $2 AND user_id = $3 RETURNING *`,
      [embedCode, form.id, userId]
    );

    return updateResult.rows[0];
  },

  async getForms(userId: string, limit = 50) {
    const result = await query(
      `SELECT * FROM forms WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  },

  async getForm(userId: string, formId: string) {
    const result = await query(
      `SELECT * FROM forms WHERE id = $1 AND user_id = $2 LIMIT 1`,
      [formId, userId]
    );
    return result.rows[0] || null;
  },

  async updateForm(userId: string, formId: string, data: Record<string, any>) {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        if (key === 'fields' || key === 'settings') {
          fields.push(`${key} = $${idx}`);
          values.push(JSON.stringify(value));
        } else {
          fields.push(`${key} = $${idx}`);
          values.push(value);
        }
        idx++;
      }
    }

    if (fields.length === 0) return null;

    values.push(formId, userId);
    const result = await query(
      `UPDATE forms SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${idx} AND user_id = $${idx + 1} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  async deleteForm(userId: string, formId: string) {
    await query(
      `DELETE FROM forms WHERE id = $1 AND user_id = $2`,
      [formId, userId]
    );
  },

  async getPublicForm(formId: string) {
    const result = await query(
      `SELECT * FROM forms WHERE id = $1 LIMIT 1`,
      [formId]
    );

    const form = result.rows[0];
    if (!form) return null;

    const status = form.status || form.settings?.status;
    if (status !== 'active') return null;

    return form;
  },

  async submitPublicForm(formId: string, submission: {
    email: string;
    name?: string;
    city?: string;
    businessType?: string;
    tags?: string[];
  }) {
    const form = await this.getPublicForm(formId);
    if (!form) return null;

    const targetList = form.settings?.target_list || 'main';
    const formName = form.name || 'form';
    const formType = form.settings?.type || 'embedded';

    const derivedTags = uniqueTags([
      'source:form',
      `list:${targetList}`,
      `form:${formId}`,
      `form-type:${formType}`,
      `form-name:${slugifyTag(formName)}`,
      ...((Array.isArray(submission.tags) ? submission.tags : [])),
      ...(Array.isArray(form.settings?.submitted_contact_tags) ? form.settings.submitted_contact_tags : []),
    ]);

    const userId = form.user_id;
    if (!userId) throw new Error('Form owner missing');

    const contact = await this.createContact(userId, {
      email: submission.email,
      name: submission.name || '',
      city: submission.city || '',
      business_type: submission.businessType || '',
      tags: derivedTags,
      status: 'active',
    });

    const submittedAt = new Date().toISOString();
    const currentCount = typeof form.submissions_count === 'number' ? form.submissions_count : 0;
    const currentSettings = form.settings || {};

    await query(
      `UPDATE forms SET submissions_count = $1, settings = $2, updated_at = NOW() WHERE id = $3 AND user_id = $4`,
      [
        currentCount + 1,
        JSON.stringify({
          ...currentSettings,
          last_submission_at: submittedAt,
          last_submission_target_list: targetList,
          last_submission_source: 'public-api',
        }),
        formId,
        userId,
      ]
    );

    return {
      formId,
      ownerUserId: userId,
      targetList,
      redirectUrl: typeof currentSettings.redirect_url === 'string' ? currentSettings.redirect_url : '',
      successMessage: typeof currentSettings.success_message === 'string' ? currentSettings.success_message : 'Thanks for signing up.',
      contact,
    };
  },

  async getPublicTemplates() {
    const result = await query(
      `SELECT * FROM templates WHERE is_public = true ORDER BY created_at DESC`
    );
    return result.rows;
  },

  async createTemplate(userId: string, data: any) {
    const result = await query(
      `INSERT INTO templates (user_id, name, subject, content, html_content, category, is_public)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, data.name, data.subject || null, data.content || null, data.html_content || null, data.category || null, data.is_public || false]
    );
    return result.rows[0];
  },

  async getTemplates(userId: string) {
    const result = await query(
      `SELECT * FROM templates WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  },

  async getTemplate(userId: string, templateId: string) {
    const result = await query(
      `SELECT * FROM templates WHERE id = $1 AND user_id = $2 LIMIT 1`,
      [templateId, userId]
    );
    return result.rows[0] || null;
  },

  async getSettings(userId: string) {
    const result = await query(
      `SELECT * FROM settings WHERE user_id = $1 LIMIT 1`,
      [userId]
    );
    return result.rows[0] || null;
  },

  async updateSettings(userId: string, data: Record<string, any>) {
    const result = await query(
      `INSERT INTO settings (user_id, data) VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE SET data = $2, updated_at = NOW()
       RETURNING *`,
      [userId, JSON.stringify(data)]
    );
    return result.rows[0];
  },
};
