import { supabaseAdmin, Contact, Campaign, Segment, Form } from './supabase';
import { readDb, writeDb, id as localId } from './store';
import { hashPassword, verifyPassword as verifyPasswordLocal } from './auth';
import { assertDataWriteAllowed, runtimeConfig } from './runtime-config';

const useSupabase = !!supabaseAdmin;
const useLocalFallback = !useSupabase && runtimeConfig.allowLocalDataFallback;

function ensureConfigured(feature: string) {
  if (!useSupabase && !useLocalFallback) {
    assertDataWriteAllowed(feature);
  }
}

function getFormStatus(form: {
  status?: 'draft' | 'active';
  settings?: {
    status?: 'draft' | 'active';
  };
}) {
  return form.status || form.settings?.status || 'draft';
}

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

    if (useSupabase) {
      const normalizedEmail = data.email.toLowerCase();

      // Try inserting with both password_hash and password columns (schema-agnostic)
      const insert = await supabaseAdmin!
        .from('users')
        .insert({
          email: normalizedEmail,
          name: data.name,
          password_hash: passwordHash,
          password: passwordHash,
          role: data.role || 'member',
          email_verified: false,
          is_active: true,
        })
        .select()
        .single();

      if (!insert.error) {
        return insert.data;
      }

      // If error is duplicate email, surface it clearly
      const msg = `${insert.error.message || ''} ${insert.error.details || ''}`.toLowerCase();
      if (msg.includes('duplicate') || msg.includes('unique') || msg.includes('already exists')) {
        throw new Error('An account with this email already exists');
      }

      // Last resort: minimal insert
      const minimalInsert = await supabaseAdmin!
        .from('users')
        .insert({
          email: normalizedEmail,
          name: data.name,
          password: passwordHash,
          role: 'member',
        })
        .select()
        .single();

      if (minimalInsert.error) {
        console.error('createUser minimal insert error:', minimalInsert.error);
        throw minimalInsert.error;
      }
      return minimalInsert.data;
    }

    ensureConfigured('User creation');
    const localDb = readDb();
    const user = {
      id: localId('usr'),
      email: data.email.toLowerCase(),
      name: data.name,
      passwordHash,
      role: (data.role || 'member') as 'admin' | 'member',
      createdAt: new Date().toISOString(),
    };
    localDb.users.push(user);
    writeDb(localDb);
    return user;
  },

  async getUserByEmail(email: string) {
    if (useSupabase) {
      const { data, error } = await supabaseAdmin!
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }

    ensureConfigured('User lookup');
    const localDb = readDb();
    return localDb.users.find((u) => u.email === email.toLowerCase());
  },

  async verifyPassword(password: string, hash: string) {
    return verifyPasswordLocal(password, hash);
  },

  async createContact(userId: string, data: Partial<Contact>) {
    if (useSupabase) {
      const email = data.email!.toLowerCase();
      const { error } = await supabaseAdmin!
        .from('contacts')
        .upsert({
          user_id: userId,
          email,
          name: data.name || null,
          city: data.city || null,
          business_type: data.business_type || null,
          tags: data.tags || [],
          status: data.status || 'active',
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,email',
          ignoreDuplicates: false,
        });

      if (error) throw error;

      const { data: contact, error: fetchError } = await supabaseAdmin!
        .from('contacts')
        .select('*')
        .eq('user_id', userId)
        .eq('email', email)
        .single();

      if (fetchError) throw fetchError;
      return contact;
    }

    ensureConfigured('Contact creation');
    const localDb = readDb();
    const now = new Date().toISOString();
    const email = data.email!.toLowerCase();
    const existing = localDb.contacts.find((contact) => contact.userId === userId && contact.email === email);

    if (existing) {
      existing.name = data.name || existing.name || '';
      existing.city = data.city || existing.city || '';
      existing.businessType = data.business_type || existing.businessType || '';
      existing.tags = Array.from(new Set([...(existing.tags || []), ...(data.tags || [])]));
      existing.status = existing.status || 'active';
      existing.updatedAt = now;
      writeDb(localDb);
      return existing;
    }

    const contact = {
      id: localId('ct'),
      userId,
      email,
      name: data.name || '',
      city: data.city || '',
      businessType: data.business_type || '',
      tags: data.tags || [],
      status: 'active' as const,
      createdAt: now,
      updatedAt: now,
    };
    localDb.contacts.push(contact);
    writeDb(localDb);
    return contact;
  },

  async getContacts(userId: string, limit = 100) {
    if (useSupabase) {
      const { data, error } = await supabaseAdmin!
        .from('contacts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    }

    ensureConfigured('Contact access');
    const localDb = readDb();
    return localDb.contacts
      .filter((contact) => !contact.userId || contact.userId === userId)
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      .slice(0, limit);
  },

  async importContacts(userId: string, contacts: Array<Partial<Contact>>) {
    if (useSupabase) {
      const formatted = contacts.map((c) => ({
        user_id: userId,
        email: c.email!.toLowerCase(),
        name: c.name || null,
        city: c.city || null,
        business_type: c.business_type || null,
        tags: c.tags || [],
      }));

      const { error } = await supabaseAdmin!.from('contacts').upsert(formatted, {
        onConflict: 'user_id,email',
        ignoreDuplicates: false,
      });

      if (error) throw error;
      return formatted.length;
    }

    ensureConfigured('Contact import');
    const localDb = readDb();
    const now = new Date().toISOString();
    let imported = 0;

    for (const incoming of contacts) {
      const email = incoming.email!.toLowerCase();
      const existing = localDb.contacts.find((contact) => contact.userId === userId && contact.email === email);

      if (existing) {
        existing.name = incoming.name || existing.name || '';
        existing.city = incoming.city || existing.city || '';
        existing.businessType = incoming.business_type || existing.businessType || '';
        existing.tags = Array.from(new Set([...(existing.tags || []), ...(incoming.tags || [])]));
        existing.status = existing.status || 'active';
        existing.updatedAt = now;
      } else {
        localDb.contacts.push({
          id: localId('ct'),
          userId,
          email,
          name: incoming.name || '',
          city: incoming.city || '',
          businessType: incoming.business_type || '',
          tags: incoming.tags || [],
          status: 'active',
          createdAt: now,
          updatedAt: now,
        });
      }

      imported += 1;
    }

    writeDb(localDb);
    return imported;
  },

  async createCampaign(userId: string, data: Partial<Campaign>) {
    if (useSupabase) {
      const { data: campaign, error } = await supabaseAdmin!
        .from('campaigns')
        .insert({
          user_id: userId,
          name: data.name!,
          subject: data.subject!,
          content: data.content || '',
          html_content: data.html_content || null,
          segment_id: data.segment_id || null,
          status: data.status || 'draft',
          scheduled_at: data.scheduled_at || null,
        })
        .select()
        .single();

      if (error) throw error;
      return campaign;
    }

    ensureConfigured('Campaign creation');
    const localDb = readDb();
    const now = new Date().toISOString();
    const campaign = {
      id: localId('cp'),
      name: data.name!,
      subject: data.subject!,
      content: data.content || '',
      html_content: data.html_content || data.content || '',
      segmentId: data.segment_id,
      scheduled_at: data.scheduled_at || undefined,
      status: ((data.status === 'sent' || data.status === 'scheduled' || data.status === 'sending') ? 'queued' : 'draft') as 'draft' | 'queued',
      createdAt: now,
      updatedAt: now,
    };
    localDb.campaigns.push(campaign);
    writeDb(localDb);
    return campaign;
  },

  async updateCampaign(userId: string, campaignId: string, data: Partial<Campaign>) {
    if (useSupabase) {
      const { data: campaign, error } = await supabaseAdmin!
        .from('campaigns')
        .update({
          name: data.name,
          subject: data.subject,
          content: data.content,
          html_content: data.html_content || null,
          segment_id: data.segment_id || null,
          status: data.status,
          scheduled_at: data.scheduled_at || null,
        })
        .eq('id', campaignId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return campaign;
    }

    ensureConfigured('Campaign update');
    const localDb = readDb();
    const campaign = localDb.campaigns.find((c) => c.id === campaignId);
    if (!campaign) return null;

    campaign.name = data.name ?? campaign.name;
    campaign.subject = data.subject ?? campaign.subject;
    campaign.content = data.content ?? campaign.content;
    campaign.html_content = data.html_content ?? campaign.html_content ?? campaign.content;
    campaign.segmentId = data.segment_id ?? campaign.segmentId;
    campaign.scheduled_at = data.scheduled_at ?? campaign.scheduled_at;
    campaign.status = ((data.status === 'sent' || data.status === 'scheduled' || data.status === 'sending') ? 'queued' : (data.status || campaign.status)) as 'draft' | 'queued';
    campaign.updatedAt = new Date().toISOString();
    writeDb(localDb);
    return campaign;
  },

  async getCampaigns(userId: string, limit = 50) {
    if (useSupabase) {
      const { data, error } = await supabaseAdmin!
        .from('campaigns')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    }

    ensureConfigured('Campaign access');
    const localDb = readDb();
    return localDb.campaigns.slice(0, limit);
  },

  async getCampaign(userId: string, campaignId: string) {
    if (useSupabase) {
      const { data, error } = await supabaseAdmin!
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    }

    ensureConfigured('Campaign access');
    const localDb = readDb();
    return localDb.campaigns.find((c) => c.id === campaignId);
  },

  async updateCampaignStatus(userId: string, campaignId: string, status: Campaign['status']) {
    if (useSupabase) {
      const { error } = await supabaseAdmin!
        .from('campaigns')
        .update({
          status,
          sent_at: status === 'sent' ? new Date().toISOString() : undefined,
        })
        .eq('id', campaignId)
        .eq('user_id', userId);

      if (error) throw error;
      return;
    }

    ensureConfigured('Campaign status updates');
    const localDb = readDb();
    const campaign = localDb.campaigns.find((c) => c.id === campaignId);
    if (campaign) {
      campaign.status = status === 'sent' ? 'queued' : 'draft';
      writeDb(localDb);
    }
  },

  async createSegment(userId: string, data: Partial<Segment>) {
    if (useSupabase) {
      const { data: segment, error } = await supabaseAdmin!
        .from('segments')
        .insert({
          user_id: userId,
          name: data.name!,
          rules: data.rules || [],
        })
        .select()
        .single();

      if (error) throw error;
      return segment;
    }

    ensureConfigured('Segment creation');
    const localDb = readDb();
    const now = new Date().toISOString();
    const segment = {
      id: localId('sg'),
      userId,
      name: data.name!,
      rules: (data.rules || []).map((r) => ({
        field: r.field === 'business_type' ? ('businessType' as const) : (r.field as 'city' | 'tag'),
        value: r.value,
      })),
      createdAt: now,
      updatedAt: now,
    };
    localDb.segments.push(segment);
    writeDb(localDb);
    return segment;
  },

  async getSegments(userId: string) {
    if (useSupabase) {
      const { data, error } = await supabaseAdmin!
        .from('segments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }

    ensureConfigured('Segment access');
    const localDb = readDb();
    return localDb.segments
      .filter((segment) => !segment.userId || segment.userId === userId)
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  },

  async createForm(userId: string, data: {
    name: string;
    type?: 'popup' | 'embedded' | 'landing';
    targetList?: string;
    fields?: Form['fields'];
    settings?: {
      success_message?: string;
      redirect_url?: string;
    };
    status?: 'draft' | 'active';
  }) {
    const formType = data.type || 'embedded';
    const formFields: Form['fields'] = data.fields && data.fields.length > 0
      ? data.fields
      : [
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'name', label: 'Name', type: 'text', required: false },
        ];

    if (useSupabase) {
      const { data: form, error } = await supabaseAdmin!
        .from('forms')
        .insert({
          user_id: userId,
          name: data.name,
          fields: formFields,
          settings: {
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
          },
          embed_code: '',
          submissions_count: 0,
        })
        .select('*')
        .single();

      if (error) throw error;

      const embedCode = `<script async src="https://bestemail.in/embed/${form.id}.js"></script><div id="bestemail-${form.id}"></div>`;
      const { data: updatedForm, error: updateError } = await supabaseAdmin!
        .from('forms')
        .update({ embed_code: embedCode })
        .eq('id', form.id)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (updateError) throw updateError;
      return updatedForm;
    }

    ensureConfigured('Form creation');
    const localDb = readDb();
    const formId = localId('fm');
    const now = new Date().toISOString();
    const form = {
      id: formId,
      userId,
      name: data.name,
      type: formType,
      targetList: data.targetList || 'main',
      fields: formFields,
      settings: {
        successMessage: data.settings?.success_message || 'Thanks for signing up.',
        redirectUrl: data.settings?.redirect_url || '',
        status: data.status || 'draft',
        trackingEnabled: true,
        submittedContactTags: uniqueTags([
          `form:${formType}`,
          `list:${data.targetList || 'main'}`,
          'source:form',
        ]),
      },
      embedCode: `<script async src="https://bestemail.in/embed/${formId}.js"></script><div id="bestemail-${formId}"></div>`,
      submissionsCount: 0,
      status: data.status || 'draft',
      createdAt: now,
      updatedAt: now,
    };
    localDb.forms.unshift(form);
    writeDb(localDb);
    return form;
  },

  async getForms(userId: string, limit = 50) {
    if (useSupabase) {
      const { data, error } = await supabaseAdmin!
        .from('forms')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    }

    ensureConfigured('Form access');
    const localDb = readDb();
    return localDb.forms
      .filter((form) => !(form as { userId?: string }).userId || (form as { userId?: string }).userId === userId)
      .slice(0, limit);
  },

  async getPublicForm(formId: string) {
    if (useSupabase) {
      const { data, error } = await supabaseAdmin!
        .from('forms')
        .select('*')
        .eq('id', formId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      if (getFormStatus(data) !== 'active') {
        return null;
      }

      return data;
    }

    ensureConfigured('Public form access');
    const localDb = readDb();
    const form = localDb.forms.find((entry) => entry.id === formId);
    if (!form || getFormStatus(form) !== 'active') {
      return null;
    }
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
    if (!form) {
      return null;
    }

    const targetList = ('targetList' in form && form.targetList)
      || ('settings' in form && form.settings && typeof form.settings.target_list === 'string' && form.settings.target_list)
      || 'main';

    const formName = ('name' in form && typeof form.name === 'string') ? form.name : 'form';
    const formType = ('type' in form && form.type)
      || ('settings' in form && form.settings && typeof form.settings.type === 'string' && form.settings.type)
      || 'embedded';

    const derivedTags = uniqueTags([
      'source:form',
      `list:${targetList}`,
      `form:${formId}`,
      `form-type:${formType}`,
      `form-name:${slugifyTag(formName)}`,
      ...((Array.isArray(submission.tags) ? submission.tags : [])),
      ...(('settings' in form && form.settings && Array.isArray((form.settings as { submitted_contact_tags?: string[] }).submitted_contact_tags))
        ? ((form.settings as { submitted_contact_tags?: string[] }).submitted_contact_tags || [])
        : []),
      ...(('settings' in form && form.settings && Array.isArray((form.settings as { submittedContactTags?: string[] }).submittedContactTags))
        ? ((form.settings as { submittedContactTags?: string[] }).submittedContactTags || [])
        : []),
    ]);

    const userId = 'user_id' in form ? form.user_id : (form as { userId?: string }).userId;
    if (!userId) {
      throw new Error('Form owner missing');
    }

    const contact = await this.createContact(userId, {
      email: submission.email,
      name: submission.name || '',
      city: submission.city || '',
      business_type: submission.businessType || '',
      tags: derivedTags,
      status: 'active',
    });

    const submittedAt = new Date().toISOString();

    if (useSupabase) {
      const currentCount = typeof form.submissions_count === 'number' ? form.submissions_count : 0;
      const currentSettings = form.settings || {};
      const { error } = await supabaseAdmin!
        .from('forms')
        .update({
          submissions_count: currentCount + 1,
          settings: {
            ...currentSettings,
            last_submission_at: submittedAt,
            last_submission_target_list: targetList,
            last_submission_source: 'public-api',
          },
        })
        .eq('id', formId)
        .eq('user_id', userId);

      if (error) throw error;

      return {
        formId,
        ownerUserId: userId,
        targetList,
        redirectUrl: typeof currentSettings.redirect_url === 'string' ? currentSettings.redirect_url : '',
        successMessage: typeof currentSettings.success_message === 'string' ? currentSettings.success_message : 'Thanks for signing up.',
        contact,
      };
    }

    const localDb = readDb();
    const localForm = localDb.forms.find((entry) => entry.id === formId);
    if (localForm) {
      localForm.submissionsCount = (localForm.submissionsCount || 0) + 1;
      localForm.updatedAt = submittedAt;
      localForm.settings = {
        ...(localForm.settings || {}),
        lastSubmissionAt: submittedAt,
        lastSubmissionTargetList: targetList,
        lastSubmissionSource: 'public-api',
      };
      writeDb(localDb);
    }

    return {
      formId,
      ownerUserId: userId,
      targetList,
      redirectUrl: typeof localForm?.settings?.redirectUrl === 'string' ? localForm.settings.redirectUrl : '',
      successMessage: typeof localForm?.settings?.successMessage === 'string' ? localForm.settings.successMessage : 'Thanks for signing up.',
      contact,
    };
  },

  async getPublicTemplates() {
    if (useSupabase) {
      const { data, error } = await supabaseAdmin!
        .from('templates')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }

    ensureConfigured('Template access');
    return [
      {
        id: '1',
        name: 'Welcome Email',
        category: 'Onboarding',
        subject: 'Welcome to {{company_name}}!',
        content: 'Hi {{name}},\n\nWelcome aboard! We\'re excited to have you.',
      },
      {
        id: '2',
        name: 'Festival Greetings',
        category: 'Seasonal',
        subject: 'Happy Diwali from {{company_name}}',
        content: 'Wishing you a bright and prosperous Diwali!',
      },
    ];
  },
};
