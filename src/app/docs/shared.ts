export type DocArticle = {
  slug: string;
  title: string;
  time: string;
  desc: string;
};

export type DocCategory = {
  title: string;
  icon: string;
  articles: DocArticle[];
};

export const documentation: Record<string, DocCategory> = {
  'getting-started': {
    title: 'Getting Started',
    icon: '🚀',
    articles: [
      { slug: 'quick-start-guide', title: 'Quick Start Guide', time: '5 min', desc: 'Start with the currently available core workflows' },
      { slug: 'account-setup', title: 'Account Setup', time: '3 min', desc: 'Configure your account and basic workspace settings' },
      { slug: 'first-campaign', title: 'First Campaign', time: '10 min', desc: 'Create and send a basic campaign' },
      { slug: 'import-contacts', title: 'Import Contacts', time: '5 min', desc: 'Import existing contacts carefully' },
      { slug: 'email-authentication', title: 'Email Authentication', time: '8 min', desc: 'Set up SPF, DKIM, and DMARC for better deliverability' }
    ]
  },
  'email-campaigns': {
    title: 'Email Campaigns',
    icon: '📧',
    articles: [
      { slug: 'campaign-types', title: 'Campaign Types', time: '7 min', desc: 'Understand the campaign flows supported today' },
      { slug: 'email-templates', title: 'Email Templates', time: '6 min', desc: 'Use and customize available templates' },
      { slug: 'personalization', title: 'Personalization', time: '8 min', desc: 'Dynamic content and merge tag basics' },
      { slug: 'ab-testing', title: 'A/B Testing', time: '10 min', desc: 'Planned / partial area — verify current support before relying on it' },
      { slug: 'send-time-planning', title: 'Send Time Planning', time: '5 min', desc: 'Practical guidance for scheduling and send timing' }
    ]
  },
  automation: {
    title: 'Automation',
    icon: '🤖',
    articles: [
      { slug: 'automation-status', title: 'Automation Status', time: '4 min', desc: 'What is planned vs what is currently available' },
      { slug: 'welcome-series-planning', title: 'Welcome Series Planning', time: '10 min', desc: 'Outline a simple onboarding sequence' },
      { slug: 'trigger-ideas', title: 'Trigger Ideas', time: '8 min', desc: 'Examples of common trigger logic to plan for' },
      { slug: 'cart-recovery-planning', title: 'Cart Recovery Planning', time: '9 min', desc: 'How teams often structure reminder sequences' },
      { slug: 're-engagement-planning', title: 'Re-engagement Planning', time: '7 min', desc: 'Ideas for win-back campaigns while automation matures' }
    ]
  },
  contacts: {
    title: 'Contact Management',
    icon: '👥',
    articles: [
      { slug: 'list-management', title: 'List Management', time: '6 min', desc: 'Organize contacts with lists and tags' },
      { slug: 'segmentation', title: 'Segmentation', time: '10 min', desc: 'Create focused audience groups' },
      { slug: 'custom-fields', title: 'Custom Fields', time: '5 min', desc: 'Store additional data about contacts' },
      { slug: 'preference-center', title: 'Preference Center', time: '7 min', desc: 'Plan subscriber preference workflows' },
      { slug: 'privacy-consent', title: 'Privacy & Consent', time: '8 min', desc: 'Manage consent and data privacy carefully' }
    ]
  },
  analytics: {
    title: 'Analytics & Reports',
    icon: '📊',
    articles: [
      { slug: 'campaign-analytics', title: 'Campaign Analytics', time: '8 min', desc: 'Read the reporting that is available today' },
      { slug: 'custom-reports', title: 'Custom Reports', time: '10 min', desc: 'Roadmap-oriented reporting ideas and future needs' },
      { slug: 'revenue-attribution', title: 'Revenue Attribution', time: '12 min', desc: 'Treat as advanced / future-facing unless confirmed live' },
      { slug: 'engagement-metrics', title: 'Engagement Metrics', time: '6 min', desc: 'Monitor opens, clicks, and related metrics' },
      { slug: 'list-health', title: 'List Health', time: '7 min', desc: 'Keep contact data cleaner and more useful' }
    ]
  },
  integrations: {
    title: 'Integrations',
    icon: '🔌',
    articles: [
      { slug: 'integration-status', title: 'Integration Status', time: '5 min', desc: 'Which integrations are planned, partial, or custom' },
      { slug: 'api-overview', title: 'API Overview', time: '15 min', desc: 'High-level API and integration direction' },
      { slug: 'webhooks', title: 'Webhooks', time: '10 min', desc: 'Event-driven ideas and expected workflow patterns' },
      { slug: 'e-commerce-planning', title: 'E-commerce Planning', time: '12 min', desc: 'Plan Shopify, WooCommerce, and similar workflows' },
      { slug: 'crm-planning', title: 'CRM Planning', time: '10 min', desc: 'Think through sync needs before implementation' }
    ]
  },
  deliverability: {
    title: 'Deliverability',
    icon: '📬',
    articles: [
      { slug: 'deliverability-best-practices', title: 'Deliverability Best Practices', time: '15 min', desc: 'Improve inbox placement using solid basics' },
      { slug: 'domain-authentication', title: 'Domain Authentication', time: '10 min', desc: 'SPF, DKIM, and DMARC setup guide' },
      { slug: 'ip-warming', title: 'IP Warming', time: '12 min', desc: 'Reputation guidance when scaling sending' },
      { slug: 'spam-testing', title: 'Spam Testing', time: '8 min', desc: 'Pre-send checks and content review ideas' },
      { slug: 'reputation-monitoring', title: 'Reputation Monitoring', time: '6 min', desc: 'Track sender reputation over time' }
    ]
  },
  troubleshooting: {
    title: 'Troubleshooting',
    icon: '🔧',
    articles: [
      { slug: 'common-issues', title: 'Common Issues', time: '5 min', desc: 'Quick fixes for frequent problems' },
      { slug: 'email-not-sending', title: 'Email Not Sending', time: '7 min', desc: 'Diagnose and fix sending issues' },
      { slug: 'import-errors', title: 'Import Errors', time: '6 min', desc: 'Resolve contact import problems' },
      { slug: 'api-errors', title: 'API Errors', time: '8 min', desc: 'Understand and debug common API issues' },
      { slug: 'contact-support', title: 'Contact Support', time: '3 min', desc: 'How to reach the team for help' }
    ]
  }
};

export const popularArticles = [
  'quick-start-guide',
  'first-campaign',
  'automation-status',
  'campaign-analytics',
  'integration-status'
];

export const articleMeta: Record<string, { title: string; description: string; category: string; status?: string }> = {
  'quick-start-guide': {
    title: 'Quick Start Guide',
    description: 'Start with the currently available core workflows: settings, contacts, campaign drafting, and reliable sending.',
    category: 'Getting Started',
  },
  'account-setup': {
    title: 'Account Setup',
    description: 'Configure your workspace basics and verify the environment-backed defaults before saving settings into the database.',
    category: 'Getting Started',
  },
  'first-campaign': {
    title: 'First Campaign',
    description: 'Create a draft campaign, review content, then send through a configured delivery setup.',
    category: 'Getting Started',
  },
  'import-contacts': {
    title: 'Import Contacts',
    description: 'Bring in your contact list carefully and verify tags, segmentation assumptions, and consent status.',
    category: 'Getting Started',
  },
  'email-authentication': {
    title: 'Email Authentication',
    description: 'Set up SPF, DKIM, and DMARC before large-volume sending to improve deliverability and trust.',
    category: 'Getting Started',
  },
  'api-overview': {
    title: 'API Overview',
    description: 'Current API coverage focuses on auth, contacts, campaigns, settings, forms, and tracking endpoints.',
    category: 'Integrations',
  },
  'getting-started': {
    title: 'Getting Started',
    description: 'Bestemail is currently strongest in core campaign workflows. Treat advanced areas as beta or planned unless verified.',
    category: 'Getting Started',
  },
  'automation-status': {
    title: 'Automation Status',
    description: 'Automation screens exist, but the backend should still be treated as planned or partial rather than launch-complete.',
    category: 'Automation',
    status: 'Planned / partial',
  },
  'campaign-analytics': {
    title: 'Campaign Analytics',
    description: 'Current reporting is basic. Validate exact metrics available before selling deeper analytics promises.',
    category: 'Analytics',
    status: 'Basic only',
  },
  'integration-status': {
    title: 'Integration Status',
    description: 'Reliable delivery is available today. Broader native integrations remain roadmap-level.',
    category: 'Integrations',
    status: 'Core delivery live',
  },
};
