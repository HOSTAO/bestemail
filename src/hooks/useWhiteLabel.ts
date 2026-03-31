'use client';

import { useState, useEffect } from 'react';
import { WhiteLabelConfig, DEFAULT_CONFIG } from '@/lib/white-label';

export function useWhiteLabel() {
  const [config, setConfig] = useState<WhiteLabelConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadConfig() {
      try {
        const response = await fetch('/api/white-label');
        if (response.ok) {
          const data = await response.json();
          setConfig(data);
        }
      } catch (error) {
        console.error('Failed to load white label config:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadConfig();
  }, []);
  
  return { config, loading };
}