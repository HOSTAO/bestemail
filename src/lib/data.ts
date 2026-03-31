/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
/**
 * Data service layer for BestEmail Platform
 * 
 * This service provides a unified interface for data operations with:
 * 1. Primary: Appwrite backend
 * 2. Fallback: localStorage for offline/development mode
 */

import { createServerClient, DATABASE_ID, COLLECTIONS, mapDocument, isAppwriteConfigured } from './appwrite';

// ── Types ───────────────────────────────────────────────────────────────────

export interface User extends Record<string, unknown> {
  id: string;
  email: string;
  name: string;
  password?: string;
  password_hash?: string;
  role?: 'admin' | 'member';
  created_at?: string;
  updated_at?: string;
}

export interface Campaign extends Record<string, unknown> {
  id: string;
  name: string;
  subject: string;
  content: string;
  html_content?: string;
  user_id?: string;
  segment_id?: string;
  status: 'draft' | 'scheduled' | 'sent';
  sent_count?: number;
  open_count?: number;
  click_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Contact extends Record<string, unknown> {
  id: string;
  email: string;
  name?: string;
  user_id?: string;
  status: 'subscribed' | 'unsubscribed';
  list_id?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Template extends Record<string, unknown> {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'email' | 'sms';
  created_at?: string;
  updated_at?: string;
}

export interface ContactList extends Record<string, unknown> {
  id: string;
  name: string;
  description?: string;
  subscriber_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Form extends Record<string, unknown> {
  id: string;
  user_id?: string;
  name: string;
  type: 'popup' | 'embedded' | 'landing';
  status: 'draft' | 'active';
  target_list?: string;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'email' | 'select';
    required: boolean;
    options?: string[];
  }>;
  settings: {
    success_message?: string;
    redirect_url?: string;
    status?: 'draft' | 'active';
    trackingEnabled?: boolean;
  };
  embed_code?: string;
  submissions_count?: number;
  created_at?: string;
  updated_at?: string;
}

// ── Helper Functions ───────────────────────────────────────────────────────

function createErrorResponse(message: string): { data: null; error: { message: string } } {
  return { data: null, error: { message } };
}

// ── Data Service Class ─────────────────────────────────────────────────────

class DataService {
  private useAppwrite: boolean;
  private allowLocalFallback: boolean;

  constructor() {
    this.useAppwrite = isAppwriteConfigured();
    this.allowLocalFallback = process.env.NODE_ENV !== 'production' || process.env.ALLOW_LOCAL_DATA_FALLBACK === 'true';
  }

  // ── Generic Operations ──────────────────────────────────────────────────

  private getLocalStorageKey(collection: string): string {
    return `bestemail_${collection}`;
  }

  private getFromLocalStorage<T>(collection: string): T[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.getLocalStorageKey(collection));
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveToLocalStorage<T>(collection: string, data: T[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.getLocalStorageKey(collection), JSON.stringify(data));
    } catch {
      // Ignore localStorage errors
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private async executeWithFallback<T>(
    appwriteOperation: () => Promise<{ data: T | null; error: any }>,
    fallbackOperation: () => T | null,
    fallbackError?: string
  ): Promise<{ data: T | null; error: any }> {
    if (this.useAppwrite) {
      try {
        return await appwriteOperation();
      } catch (error) {
        if (this.allowLocalFallback) {
          console.warn('Appwrite operation failed, falling back to localStorage:', error);
          try {
            const data = fallbackOperation();
            return { data, error: null };
          } catch (localError) {
            return { data: null, error: { message: fallbackError || 'Both Appwrite and localStorage operations failed' } };
          }
        }
        return { data: null, error: { message: error instanceof Error ? error.message : 'Appwrite operation failed' } };
      }
    } else if (this.allowLocalFallback) {
      try {
        const data = fallbackOperation();
        return { data, error: null };
      } catch (localError) {
        return { data: null, error: { message: fallbackError || 'localStorage operation failed' } };
      }
    } else {
      return { data: null, error: { message: 'No data backend configured' } };
    }
  }

  // ── User Operations ─────────────────────────────────────────────────────

  async getUsers(): Promise<{ data: any[] | null; error: any }> {
    if (this.useAppwrite) {
      try {
        const serverClient = createServerClient();
        if (!serverClient) {
          return this.allowLocalFallback ? 
            { data: this.getFromLocalStorage<User>(COLLECTIONS.users), error: null } :
            createErrorResponse('Appwrite not configured');
        }
        const { databases } = serverClient;
        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.users);
        const users = response.documents.map(doc => mapDocument<Record<string, unknown>>(doc as Record<string, unknown>));
        return { data: users, error: null };
      } catch (error) {
        if (this.allowLocalFallback) {
          console.warn('Appwrite operation failed, falling back to localStorage:', error);
          return { data: this.getFromLocalStorage<User>(COLLECTIONS.users), error: null };
        }
        return createErrorResponse(error instanceof Error ? error.message : 'Appwrite operation failed');
      }
    } else if (this.allowLocalFallback) {
      return { data: this.getFromLocalStorage<User>(COLLECTIONS.users), error: null };
    } else {
      return createErrorResponse('No data backend configured');
    }
  }

  async getUserByEmail(email: string): Promise<{ data: any | null; error: any }> {
    return this.executeWithFallback(
      async () => {
        const { databases, Query } = createServerClient();
        const response = await databases.listDocuments(
          DATABASE_ID, 
          COLLECTIONS.users,
          [Query.equal('email', [email]), Query.limit(1)]
        );
        const user = response.documents.length > 0 ? mapDocument<Record<string, unknown>>(response.documents[0]) : null;
        return { data: user, error: null };
      },
      () => {
        const users = this.getFromLocalStorage<User>(COLLECTIONS.users);
        return users.find(user => user.email === email) || null;
      },
      'Failed to fetch user'
    );
  }

  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: any | null; error: any }> {
    return this.executeWithFallback(
      async () => {
        const { databases, ID } = createServerClient();
        const doc = await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.users,
          ID.unique(),
          userData
        );
        const user = mapDocument<Record<string, unknown>>(doc as Record<string, unknown>);
        return { data: user, error: null };
      },
      () => {
        const users = this.getFromLocalStorage<User>(COLLECTIONS.users);
        const newUser: User = {
          ...userData,
          id: this.generateId(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        users.push(newUser);
        this.saveToLocalStorage(COLLECTIONS.users, users);
        return newUser;
      },
      'Failed to create user'
    );
  }

  // ── Campaign Operations ─────────────────────────────────────────────────

  async getCampaigns(): Promise<{ data: any[] | null; error: any }> {
    return this.executeWithFallback(
      async () => {
        const { databases } = createServerClient();
        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.campaigns);
        const campaigns = response.documents.map(doc => mapDocument<Record<string, unknown>>(doc as Record<string, unknown>));
        return { data: campaigns, error: null };
      },
      () => {
        return this.getFromLocalStorage<Campaign>(COLLECTIONS.campaigns);
      },
      'Failed to fetch campaigns'
    );
  }

  async getCampaign(id: string): Promise<{ data: any | null; error: any }> {
    return this.executeWithFallback(
      async () => {
        const { databases } = createServerClient();
        const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.campaigns, id);
        const campaign = mapDocument<Record<string, unknown>>(doc as Record<string, unknown>);
        return { data: campaign, error: null };
      },
      () => {
        const campaigns = this.getFromLocalStorage<Campaign>(COLLECTIONS.campaigns);
        return campaigns.find(campaign => campaign.id === id) || null;
      },
      'Failed to fetch campaign'
    );
  }

  async createCampaign(campaignData: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: any | null; error: any }> {
    return this.executeWithFallback(
      async () => {
        const { databases, ID } = createServerClient();
        const doc = await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.campaigns,
          ID.unique(),
          campaignData
        );
        const campaign = mapDocument<Record<string, unknown>>(doc as Record<string, unknown>);
        return { data: campaign, error: null };
      },
      () => {
        const campaigns = this.getFromLocalStorage<Campaign>(COLLECTIONS.campaigns);
        const newCampaign: Campaign = {
          ...campaignData,
          id: this.generateId(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        campaigns.push(newCampaign);
        this.saveToLocalStorage(COLLECTIONS.campaigns, campaigns);
        return newCampaign;
      },
      'Failed to create campaign'
    );
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<{ data: any | null; error: any }> {
    return this.executeWithFallback(
      async () => {
        const { databases } = createServerClient();
        const doc = await databases.updateDocument(DATABASE_ID, COLLECTIONS.campaigns, id, updates);
        const campaign = mapDocument<Record<string, unknown>>(doc as Record<string, unknown>);
        return { data: campaign, error: null };
      },
      () => {
        const campaigns = this.getFromLocalStorage<Campaign>(COLLECTIONS.campaigns);
        const index = campaigns.findIndex(campaign => campaign.id === id);
        if (index === -1) return null;
        
        campaigns[index] = {
          ...campaigns[index],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        this.saveToLocalStorage(COLLECTIONS.campaigns, campaigns);
        return campaigns[index];
      },
      'Failed to update campaign'
    );
  }

  async deleteCampaign(id: string): Promise<{ data: any; error: any }> {
    return this.executeWithFallback(
      async () => {
        const { databases } = createServerClient();
        await databases.deleteDocument(DATABASE_ID, COLLECTIONS.campaigns, id);
        return { data: true, error: null };
      },
      () => {
        const campaigns = this.getFromLocalStorage<Campaign>(COLLECTIONS.campaigns);
        const filteredCampaigns = campaigns.filter(campaign => campaign.id !== id);
        this.saveToLocalStorage(COLLECTIONS.campaigns, filteredCampaigns);
        return true;
      },
      'Failed to delete campaign'
    );
  }

  // ── Contact Operations ──────────────────────────────────────────────────

  async getContacts(): Promise<{ data: any[] | null; error: any }> {
    return this.executeWithFallback(
      async () => {
        const { databases } = createServerClient();
        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.contacts);
        const contacts = response.documents.map(doc => mapDocument<Record<string, unknown>>(doc as Record<string, unknown>));
        return { data: contacts, error: null };
      },
      () => {
        return this.getFromLocalStorage<Contact>(COLLECTIONS.contacts);
      },
      'Failed to fetch contacts'
    );
  }

  async createContact(contactData: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: any | null; error: any }> {
    return this.executeWithFallback(
      async () => {
        const { databases, ID } = createServerClient();
        const doc = await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.contacts,
          ID.unique(),
          contactData
        );
        const contact = mapDocument<Record<string, unknown>>(doc as Record<string, unknown>);
        return { data: contact, error: null };
      },
      () => {
        const contacts = this.getFromLocalStorage<Contact>(COLLECTIONS.contacts);
        const newContact: Contact = {
          ...contactData,
          id: this.generateId(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        contacts.push(newContact);
        this.saveToLocalStorage(COLLECTIONS.contacts, contacts);
        return newContact;
      },
      'Failed to create contact'
    );
  }

  // ── Template Operations ─────────────────────────────────────────────────

  async getTemplates(): Promise<{ data: any[] | null; error: any }> {
    return this.executeWithFallback(
      async () => {
        const { databases } = createServerClient();
        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.templates);
        const templates = response.documents.map(doc => mapDocument<Record<string, unknown>>(doc as Record<string, unknown>));
        return { data: templates, error: null };
      },
      () => {
        return this.getFromLocalStorage<Template>(COLLECTIONS.templates);
      },
      'Failed to fetch templates'
    );
  }

  async createTemplate(templateData: Omit<Template, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: any | null; error: any }> {
    return this.executeWithFallback(
      async () => {
        const { databases, ID } = createServerClient();
        const doc = await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.templates,
          ID.unique(),
          templateData
        );
        const template = mapDocument<Record<string, unknown>>(doc as Record<string, unknown>);
        return { data: template, error: null };
      },
      () => {
        const templates = this.getFromLocalStorage<Template>(COLLECTIONS.templates);
        const newTemplate: Template = {
          ...templateData,
          id: this.generateId(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        templates.push(newTemplate);
        this.saveToLocalStorage(COLLECTIONS.templates, templates);
        return newTemplate;
      },
      'Failed to create template'
    );
  }

  // ── List Operations ─────────────────────────────────────────────────────

  async getLists(): Promise<{ data: any[] | null; error: any }> {
    return this.executeWithFallback(
      async () => {
        const { databases } = createServerClient();
        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.lists);
        const lists = response.documents.map(doc => mapDocument<Record<string, unknown>>(doc as Record<string, unknown>));
        return { data: lists, error: null };
      },
      () => {
        return this.getFromLocalStorage<ContactList>(COLLECTIONS.lists);
      },
      'Failed to fetch lists'
    );
  }

  async createList(listData: Omit<ContactList, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: any | null; error: any }> {
    return this.executeWithFallback(
      async () => {
        const { databases, ID } = createServerClient();
        const doc = await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.lists,
          ID.unique(),
          listData
        );
        const list = mapDocument<Record<string, unknown>>(doc as Record<string, unknown>);
        return { data: list, error: null };
      },
      () => {
        const lists = this.getFromLocalStorage<ContactList>(COLLECTIONS.lists);
        const newList: ContactList = {
          ...listData,
          id: this.generateId(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        lists.push(newList);
        this.saveToLocalStorage(COLLECTIONS.lists, lists);
        return newList;
      },
      'Failed to create list'
    );
  }

  // ── Form Operations ─────────────────────────────────────────────────────

  async getForms(userId?: string): Promise<{ data: any[] | null; error: any }> {
    return this.executeWithFallback(
      async () => {
        const { databases, Query } = createServerClient();
        let queries = [];
        if (userId) {
          queries.push(Query.equal('user_id', [userId]));
        }
        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.forms || 'forms', queries);
        const forms = response.documents.map(doc => mapDocument<Record<string, unknown>>(doc as Record<string, unknown>));
        return { data: forms, error: null };
      },
      () => {
        let forms = this.getFromLocalStorage<Form>('forms');
        if (userId) {
          forms = forms.filter(form => form.user_id === userId);
        }
        return forms;
      },
      'Failed to fetch forms'
    );
  }

  async createForm(userId: string, formData: Partial<Form>): Promise<{ data: any | null; error: any }> {
    return this.executeWithFallback(
      async () => {
        const { databases, ID } = createServerClient();
        
        // Generate embed code
        const embedCode = `<script>
  (function(d,s,id){
    var js=d.createElement(s);js.id=id;js.src='https://bestemail.in/embed.js';
    var fjs=d.getElementsByTagName(s)[0];fjs.parentNode.insertBefore(js,fjs);
  }(document,'script','bestemail-embed'));
</script>
<div data-bestemail-form="${formData.name || 'form'}" data-bestemail-type="${formData.type || 'embedded'}"></div>`;

        const doc = await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.forms || 'forms',
          ID.unique(),
          {
            ...formData,
            user_id: userId,
            embed_code: embedCode,
            submissions_count: 0,
            fields: formData.fields || [
              { name: 'email', label: 'Email', type: 'email', required: true },
              { name: 'name', label: 'Name', type: 'text', required: false }
            ],
          }
        );
        const form = mapDocument<Record<string, unknown>>(doc as Record<string, unknown>);
        return { data: form, error: null };
      },
      () => {
        const forms = this.getFromLocalStorage<Form>('forms');
        const embedCode = `<script>
  (function(d,s,id){
    var js=d.createElement(s);js.id=id;js.src='https://bestemail.in/embed.js';
    var fjs=d.getElementsByTagName(s)[0];fjs.parentNode.insertBefore(js,fjs);
  }(document,'script','bestemail-embed'));
</script>
<div data-bestemail-form="${formData.name || 'form'}" data-bestemail-type="${formData.type || 'embedded'}"></div>`;

        const newForm: Form = {
          id: this.generateId(),
          user_id: userId,
          name: formData.name || 'Untitled Form',
          type: formData.type || 'embedded',
          status: formData.status || 'draft',
          target_list: formData.target_list || 'main',
          fields: formData.fields || [
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'name', label: 'Name', type: 'text', required: false }
          ],
          settings: formData.settings || { success_message: 'Thanks for signing up!' },
          embed_code: embedCode,
          submissions_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        forms.push(newForm);
        this.saveToLocalStorage('forms', forms);
        return newForm;
      },
      'Failed to create form'
    );
  }

  async getPublicForm(formId: string): Promise<{ data: any | null; error: any }> {
    return this.executeWithFallback(
      async () => {
        const { databases } = createServerClient();
        const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.forms || 'forms', formId);
        const form = mapDocument<Record<string, unknown>>(doc as Record<string, unknown>);
        return { data: form, error: null };
      },
      () => {
        const forms = this.getFromLocalStorage<Form>('forms');
        return forms.find(form => form.id === formId) || null;
      },
      'Failed to fetch form'
    );
  }

  async submitPublicForm(formId: string, submission: Record<string, string>): Promise<{ data: any; error: any }> {
    return this.executeWithFallback(
      async () => {
        const { databases, ID, Query } = createServerClient();
        
        // Get the form
        const form = await databases.getDocument(DATABASE_ID, COLLECTIONS.forms || 'forms', formId);
        
        // Create contact if email provided
        if (submission.email) {
          const contactData = {
            email: submission.email.toLowerCase(),
            name: submission.name || '',
            status: 'subscribed',
            list_id: (form as any).target_list || 'main',
          };

          // Check if contact already exists
          const existingContacts = await databases.listDocuments(
            DATABASE_ID, 
            COLLECTIONS.contacts,
            [Query.equal('email', [submission.email.toLowerCase()]), Query.limit(1)]
          );

          if (existingContacts.documents.length === 0) {
            await databases.createDocument(
              DATABASE_ID,
              COLLECTIONS.contacts,
              ID.unique(),
              contactData
            );
          }
        }

        // Update form submission count
        const currentCount = ((form as any).submissions_count as number) || 0;
        await databases.updateDocument(DATABASE_ID, COLLECTIONS.forms || 'forms', formId, {
          submissions_count: currentCount + 1,
        });

        return { data: true, error: null };
      },
      () => {
        const forms = this.getFromLocalStorage<Form>('forms');
        const contacts = this.getFromLocalStorage<Contact>(COLLECTIONS.contacts);
        
        const formIndex = forms.findIndex(form => form.id === formId);
        if (formIndex === -1) {
          throw new Error('Form not found');
        }

        // Create contact if email provided
        if (submission.email) {
          const existingContactIndex = contacts.findIndex(
            contact => contact.email.toLowerCase() === submission.email.toLowerCase()
          );

          if (existingContactIndex === -1) {
            const newContact: Contact = {
              id: this.generateId(),
              email: submission.email.toLowerCase(),
              name: submission.name || '',
              status: 'subscribed',
              list_id: forms[formIndex].target_list || 'main',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            contacts.push(newContact);
            this.saveToLocalStorage(COLLECTIONS.contacts, contacts);
          }
        }

        // Update form submission count
        forms[formIndex].submissions_count = (forms[formIndex].submissions_count || 0) + 1;
        forms[formIndex].updated_at = new Date().toISOString();
        this.saveToLocalStorage('forms', forms);

        return true;
      },
      'Failed to submit form'
    );
  }

  // ── Analytics Operations ────────────────────────────────────────────────

  async trackCampaignOpen(campaignId: string): Promise<{ data: any; error: any }> {
    return this.executeWithFallback(
      async () => {
        const { databases, ID } = createServerClient();
        
        // Record the open event
        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.analytics,
          ID.unique(),
          {
            campaign_id: campaignId,
            event_type: 'open',
            timestamp: new Date().toISOString(),
          }
        );

        // Update campaign open count
        const campaign = await databases.getDocument(DATABASE_ID, COLLECTIONS.campaigns, campaignId);
        const currentCount = (campaign.open_count as number) || 0;
        await databases.updateDocument(DATABASE_ID, COLLECTIONS.campaigns, campaignId, {
          open_count: currentCount + 1,
        });

        return { data: true, error: null };
      },
      () => {
        // Local storage fallback for tracking
        const analytics = this.getFromLocalStorage<any>(COLLECTIONS.analytics);
        analytics.push({
          id: this.generateId(),
          campaign_id: campaignId,
          event_type: 'open',
          timestamp: new Date().toISOString(),
        });
        this.saveToLocalStorage(COLLECTIONS.analytics, analytics);

        // Update local campaign
        const campaigns = this.getFromLocalStorage<Campaign>(COLLECTIONS.campaigns);
        const campaignIndex = campaigns.findIndex(c => c.id === campaignId);
        if (campaignIndex !== -1) {
          campaigns[campaignIndex].open_count = (campaigns[campaignIndex].open_count || 0) + 1;
          this.saveToLocalStorage(COLLECTIONS.campaigns, campaigns);
        }

        return true;
      },
      'Failed to track campaign open'
    );
  }

  async trackCampaignClick(campaignId: string, url?: string): Promise<{ data: any; error: any }> {
    return this.executeWithFallback(
      async () => {
        const { databases, ID } = createServerClient();
        
        // Record the click event
        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.analytics,
          ID.unique(),
          {
            campaign_id: campaignId,
            event_type: 'click',
            url: url || '',
            timestamp: new Date().toISOString(),
          }
        );

        // Update campaign click count
        const campaign = await databases.getDocument(DATABASE_ID, COLLECTIONS.campaigns, campaignId);
        const currentCount = (campaign.click_count as number) || 0;
        await databases.updateDocument(DATABASE_ID, COLLECTIONS.campaigns, campaignId, {
          click_count: currentCount + 1,
        });

        return { data: true, error: null };
      },
      () => {
        // Local storage fallback for tracking
        const analytics = this.getFromLocalStorage<any>(COLLECTIONS.analytics);
        analytics.push({
          id: this.generateId(),
          campaign_id: campaignId,
          event_type: 'click',
          url: url || '',
          timestamp: new Date().toISOString(),
        });
        this.saveToLocalStorage(COLLECTIONS.analytics, analytics);

        // Update local campaign
        const campaigns = this.getFromLocalStorage<Campaign>(COLLECTIONS.campaigns);
        const campaignIndex = campaigns.findIndex(c => c.id === campaignId);
        if (campaignIndex !== -1) {
          campaigns[campaignIndex].click_count = (campaigns[campaignIndex].click_count || 0) + 1;
          this.saveToLocalStorage(COLLECTIONS.campaigns, campaigns);
        }

        return true;
      },
      'Failed to track campaign click'
    );
  }
}

// ── Export singleton instance ──────────────────────────────────────────────

export const dataService = new DataService();
export default dataService;