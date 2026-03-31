import { createClientServer } from '@/lib/supabase';

export interface WhiteLabelConfig {
  id: string;
  accountName: string;
  subdomain: string;
  customDomain?: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo?: string;
    favicon?: string;
    companyName: string;
  };
  features: {
    smsMarketing: boolean;
    whatsappIntegration: boolean;
    customIntegrations: boolean;
    apiAccess: boolean;
    maxContacts?: number;
    maxEmailsPerMonth?: number;
  };
  email: {
    fromName: string;
    fromEmail: string;
    replyToEmail: string;
  };
  urls: {
    support?: string;
    terms?: string;
    privacy?: string;
  };
}

export const DEFAULT_CONFIG: WhiteLabelConfig = {
  id: 'default',
  accountName: 'Bestemail',
  subdomain: 'app',
  branding: {
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    companyName: 'Bestemail',
    logo: '/logo-wide.png',
    favicon: '/favicon.ico',
  },
  features: {
    smsMarketing: false,
    whatsappIntegration: false,
    customIntegrations: true,
    apiAccess: true,
  },
  email: {
    fromName: 'Bestemail',
    fromEmail: 'hello@bestemail.in',
    replyToEmail: 'support@bestemail.in',
  },
  urls: {
    support: '/support',
    terms: '/terms',
    privacy: '/privacy',
  },
};

export async function getWhiteLabelConfig(hostname: string): Promise<WhiteLabelConfig> {
  // Extract subdomain from hostname
  const subdomain = hostname.split('.')[0];
  
  // If it's the main domain or www, return default
  if (subdomain === 'bestemail' || subdomain === 'www' || subdomain === 'app') {
    return DEFAULT_CONFIG;
  }
  
  const supabase = createClientServer();
  
  if (!supabase) {
    return DEFAULT_CONFIG;
  }
  
  // Try to find by subdomain first
  let { data: account, error } = await supabase
    .from('white_label_accounts')
    .select('*')
    .eq('subdomain', subdomain)
    .eq('is_active', true)
    .single();
  
  // If not found by subdomain, try custom domain
  if (!account && hostname !== 'bestemail.in') {
    const { data: customAccount } = await supabase
      .from('white_label_accounts')
      .select('*')
      .eq('custom_domain', hostname)
      .eq('is_active', true)
      .single();
    
    account = customAccount;
  }
  
  // If no white label account found, return default
  if (!account) {
    return DEFAULT_CONFIG;
  }
  
  // Merge account data with default config
  return {
    id: account.id,
    accountName: account.account_name,
    subdomain: account.subdomain,
    customDomain: account.custom_domain,
    branding: {
      ...DEFAULT_CONFIG.branding,
      ...account.branding_config,
      companyName: account.account_name,
    },
    features: {
      ...DEFAULT_CONFIG.features,
      ...account.features_config,
    },
    email: {
      fromName: account.from_name || account.account_name,
      fromEmail: account.from_email || DEFAULT_CONFIG.email.fromEmail,
      replyToEmail: account.reply_to_email || account.from_email || DEFAULT_CONFIG.email.replyToEmail,
    },
    urls: {
      support: account.support_url || DEFAULT_CONFIG.urls.support,
      terms: account.terms_url || DEFAULT_CONFIG.urls.terms,
      privacy: account.privacy_url || DEFAULT_CONFIG.urls.privacy,
    },
  };
}

// CSS variables generator
export function generateCSSVariables(config: WhiteLabelConfig): string {
  return `
    :root {
      --primary-color: ${config.branding.primaryColor};
      --secondary-color: ${config.branding.secondaryColor};
      --primary-rgb: ${hexToRgb(config.branding.primaryColor)};
      --secondary-rgb: ${hexToRgb(config.branding.secondaryColor)};
    }
  `;
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 123, 255'; // Default blue
}