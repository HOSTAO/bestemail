/**
 * SMS Marketing Integration
 * Using Instasent.com API
 */

import { runtimeConfig } from './runtime-config';

interface SMSConfig {
  apiToken: string;
  senderId?: string;
  sandbox?: boolean;
}

interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  cost?: number;
  balance?: number;
}

interface SMSCampaign {
  recipients: string[];
  message: string;
  senderId?: string;
  scheduledAt?: Date;
  unicode?: boolean;
}

class InstaSentSMS {
  private config: SMSConfig;
  private apiUrl = 'https://api.instasent.com/v1';

  constructor(config: SMSConfig) {
    this.config = config;
  }

  async sendSMS(to: string, message: string, from?: string): Promise<SMSResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/sms`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          text: message,
          from: from || this.config.senderId || 'Bestemail',
          sandbox: this.config.sandbox || false,
          unicode: this.detectUnicode(message),
        }),
      });

      const data = await response.json();

      if (response.ok && data.entity) {
        return {
          success: true,
          messageId: data.entity.id,
          cost: data.entity.clientPrice,
          balance: data.entity.accountBalance,
        };
      }

      return {
        success: false,
        error: data.message || 'SMS sending failed',
      };
    } catch (error) {
      console.error('SMS sending error:', error);
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  }

  async sendCampaign(campaign: SMSCampaign): Promise<{
    success: boolean;
    sent: number;
    failed: number;
    totalCost: number;
    errors: string[];
  }> {
    const results = {
      success: true,
      sent: 0,
      failed: 0,
      totalCost: 0,
      errors: [] as string[],
    };

    const batchSize = 100;
    for (let i = 0; i < campaign.recipients.length; i += batchSize) {
      const batch = campaign.recipients.slice(i, i + batchSize);

      if (i > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      await Promise.all(
        batch.map(async (recipient) => {
          const result = await this.sendSMS(recipient, campaign.message, campaign.senderId);

          if (result.success) {
            results.sent++;
            results.totalCost += result.cost || 0;
          } else {
            results.failed++;
            results.errors.push(`${recipient}: ${result.error}`);
          }
        })
      );
    }

    results.success = results.failed === 0;
    return results;
  }

  async getBalance(): Promise<{ balance?: number; error?: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/account`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.config.apiToken}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.entity) {
        return { balance: data.entity.balance };
      }

      return { error: data.message || 'Failed to get balance' };
    } catch {
      return { error: 'Network error occurred' };
    }
  }

  calculateCost(message: string, recipients: number) {
    const isUnicode = this.detectUnicode(message);
    const singleSegmentLimit = isUnicode ? 70 : 160;
    const multiSegmentLimit = isUnicode ? 67 : 153;

    const messageLength = message.length;
    let segments = 1;
    let charactersPerSegment = singleSegmentLimit;

    if (messageLength > singleSegmentLimit) {
      segments = Math.ceil(messageLength / multiSegmentLimit);
      charactersPerSegment = multiSegmentLimit;
    }

    const costPerSegment = 0.3;
    const totalSegments = segments * recipients;
    const estimatedCost = totalSegments * costPerSegment;

    return {
      segments,
      charactersPerSegment,
      totalSegments,
      estimatedCost,
    };
  }

  private detectUnicode(message: string): boolean {
    return /[^\u0000-\u007F]/.test(message);
  }

  static validatePhoneNumber(phone: string): boolean {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    const indianPattern = /^(?:\+91|91|0)?[6-9]\d{9}$/;
    const internationalPattern = /^\+\d{10,15}$/;
    return indianPattern.test(cleaned) || internationalPattern.test(cleaned);
  }

  static formatPhoneNumber(phone: string, defaultCountryCode: string = '91'): string {
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');
    cleaned = cleaned.replace(/^0+/, '');

    if (!cleaned.startsWith('+')) {
      if (!cleaned.startsWith(defaultCountryCode)) {
        cleaned = defaultCountryCode + cleaned;
      }
      cleaned = '+' + cleaned;
    }

    return cleaned;
  }
}

export class SMSService {
  private instasent: InstaSentSMS | null = null;

  async initialize(override?: Partial<SMSConfig>) {
    const apiToken = override?.apiToken || runtimeConfig.instasentApiToken || '';
    const senderId = override?.senderId || '';

    if (apiToken) {
      this.instasent = new InstaSentSMS({
        apiToken,
        senderId,
        sandbox: override?.sandbox ?? runtimeConfig.nodeEnv !== 'production',
      });
    } else {
      this.instasent = null;
    }

    return this;
  }

  async sendSMS(to: string, message: string): Promise<SMSResponse> {
    if (!this.instasent) {
      await this.initialize();
    }

    if (!this.instasent) {
      return { success: false, error: 'SMS service not configured' };
    }

    if (!InstaSentSMS.validatePhoneNumber(to)) {
      return { success: false, error: 'Invalid phone number format' };
    }

    const formattedPhone = InstaSentSMS.formatPhoneNumber(to);
    return this.instasent.sendSMS(formattedPhone, message);
  }

  async sendCampaign(campaign: SMSCampaign) {
    if (!this.instasent) {
      await this.initialize();
    }

    if (!this.instasent) {
      throw new Error('SMS service not configured');
    }

    campaign.recipients = campaign.recipients
      .filter((phone) => InstaSentSMS.validatePhoneNumber(phone))
      .map((phone) => InstaSentSMS.formatPhoneNumber(phone));

    return this.instasent.sendCampaign(campaign);
  }

  async getBalance() {
    if (!this.instasent) {
      await this.initialize();
    }

    if (!this.instasent) {
      return { error: 'SMS service not configured' };
    }

    return this.instasent.getBalance();
  }

  calculateCost(message: string, recipients: number) {
    if (!this.instasent) {
      this.instasent = new InstaSentSMS({ apiToken: '' });
    }

    return this.instasent.calculateCost(message, recipients);
  }

  static validatePhoneNumber = InstaSentSMS.validatePhoneNumber;
  static formatPhoneNumber = InstaSentSMS.formatPhoneNumber;
}

export const smsService = new SMSService();
