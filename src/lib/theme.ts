// Corporate Theme Configuration
export const corporateTheme = {
  // Brand Colors
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
  },
  
  // Typography
  fonts: {
    heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  },
  
  // Spacing Scale
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
    '3xl': '6rem',
  },
  
  // Border Radius
  radius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  
  // Shadows (Professional and subtle)
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    base: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    md: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
  
  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',
    slower: '500ms ease-in-out',
  },
};

// Professional Component Styles
export const componentStyles = {
  // Buttons
  button: {
    base: 'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    sizes: {
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-4 py-2 text-base rounded-lg',
      lg: 'px-6 py-3 text-lg rounded-lg',
      xl: 'px-8 py-4 text-xl rounded-xl',
    },
    variants: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus:ring-secondary-500',
      outline: 'border-2 border-current hover:bg-gray-50 focus:ring-current',
      ghost: 'hover:bg-gray-100 focus:ring-gray-500',
      danger: 'bg-danger text-white hover:bg-red-700 focus:ring-danger',
    },
  },
  
  // Cards
  card: {
    base: 'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden',
    hover: 'transition-shadow hover:shadow-md',
    padding: {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  
  // Forms
  input: {
    base: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all',
    error: 'border-red-500 focus:ring-red-500',
    disabled: 'bg-gray-100 cursor-not-allowed opacity-75',
  },
  
  // Tables (Professional data display)
  table: {
    wrapper: 'overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg',
    base: 'min-w-full divide-y divide-gray-300',
    header: 'bg-gray-50',
    headerCell: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
    body: 'bg-white divide-y divide-gray-200',
    cell: 'px-6 py-4 whitespace-nowrap text-sm',
  },
  
  // Navigation
  nav: {
    base: 'bg-white shadow-sm border-b border-gray-200',
    item: 'px-3 py-2 rounded-md text-sm font-medium transition-colors',
    itemActive: 'bg-blue-100 text-blue-700',
    itemInactive: 'text-gray-700 hover:bg-gray-100',
  },
};

// Scalability Configuration
export const scalabilityConfig = {
  // Performance
  performance: {
    lazyLoadImages: true,
    optimizeBundle: true,
    enableCDN: true,
    cacheStrategy: 'stale-while-revalidate',
  },
  
  // API Rate Limits
  rateLimits: {
    api: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100,
    },
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5,
    },
  },
  
  // Database Optimization
  database: {
    connectionPoolSize: 20,
    queryTimeout: 30000, // 30 seconds
    enableQueryCache: true,
  },
  
  // Multi-tenancy Support
  multiTenancy: {
    enabled: true,
    isolationLevel: 'schema', // schema-based isolation
    maxTenantsPerInstance: 1000,
  },
  
  // Internationalization
  i18n: {
    enabled: true,
    defaultLocale: 'en',
    supportedLocales: ['en', 'hi', 'ta', 'te', 'mr', 'gu', 'bn'],
  },
};

// Enterprise Features
export const enterpriseFeatures = {
  // SSO Configuration
  sso: {
    enabled: true,
    providers: ['google', 'microsoft', 'okta', 'saml'],
  },
  
  // Audit Logging
  audit: {
    enabled: true,
    retentionDays: 90,
    events: ['login', 'logout', 'data_access', 'settings_change', 'campaign_send'],
  },
  
  // Compliance
  compliance: {
    gdpr: true,
    ccpa: true,
    hipaa: false, // Can be enabled if needed
    dataRetention: {
      emails: 365, // days
      logs: 90, // days
      analytics: 730, // days
    },
  },
  
  // Analytics & Reporting
  analytics: {
    realTimeTracking: true,
    customDashboards: true,
    exportFormats: ['pdf', 'excel', 'csv'],
    scheduledReports: true,
  },
};