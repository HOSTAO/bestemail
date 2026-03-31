'use client';

import { createContext, useContext, ReactNode, useEffect } from 'react';
import { WhiteLabelConfig, generateCSSVariables } from '@/lib/white-label';
import { useWhiteLabel } from '@/hooks/useWhiteLabel';

const WhiteLabelContext = createContext<{
  config: WhiteLabelConfig;
  loading: boolean;
} | null>(null);

export function WhiteLabelProvider({ children }: { children: ReactNode }) {
  const { config, loading } = useWhiteLabel();

  useEffect(() => {
    if (loading || !config) {
      return;
    }

    const style = document.createElement('style');
    style.setAttribute('data-bestemail-white-label', 'true');
    style.textContent = generateCSSVariables(config);
    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, [config, loading]);

  return (
    <WhiteLabelContext.Provider value={{ config, loading }}>
      {children}
    </WhiteLabelContext.Provider>
  );
}

export function useWhiteLabelContext() {
  const context = useContext(WhiteLabelContext);
  if (!context) {
    throw new Error('useWhiteLabelContext must be used within a WhiteLabelProvider');
  }
  return context;
}

export function BrandLogo({ className }: { className?: string }) {
  const { config, loading } = useWhiteLabelContext();

  if (loading) {
    return <div className={`${className} bg-gray-200 animate-pulse`} />;
  }

  return (
    <img
      src={config.branding.logo || '/logo-wide.png'}
      alt={config.branding.companyName}
      className={className}
    />
  );
}

export function BrandName({ className }: { className?: string }) {
  const { config } = useWhiteLabelContext();
  return <span className={className}>{config.branding.companyName}</span>;
}

export function BrandFavicon() {
  const { config, loading } = useWhiteLabelContext();

  if (!loading && config.branding.favicon) {
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) {
      link.href = config.branding.favicon;
    }
  }

  return null;
}
