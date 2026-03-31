'use client';

import { useState, useEffect } from 'react';
import { getSendyListCount } from '@/lib/sendy';

export function SendyStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [subscriberCount, setSubscriberCount] = useState<number>(0);
  
  useEffect(() => {
    checkSendyConnection();
  }, []);
  
  const checkSendyConnection = async () => {
    try {
      if (process.env.NEXT_PUBLIC_USE_SENDY !== 'true') {
        setStatus('error');
        return;
      }
      
      const count = await getSendyListCount();
      setSubscriberCount(count);
      setStatus('connected');
    } catch (error) {
      console.error('Sendy connection error:', error);
      setStatus('error');
    }
  };
  
  if (status === 'checking') {
    return (
      <div className="bg-gray-100 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-32"></div>
      </div>
    );
  }
  
  if (status === 'error') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <span className="text-red-600">⚠️</span>
          <div>
            <p className="font-medium text-red-800">Sendy Not Connected</p>
            <p className="text-sm text-red-600">Configure Sendy API in settings</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-green-600">✅</span>
          <div>
            <p className="font-medium text-green-800">Sendy Connected</p>
            <p className="text-sm text-green-600">
              {subscriberCount.toLocaleString()} active subscribers
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Powered by</p>
          <p className="font-semibold text-gray-700">Sendy + Amazon SES</p>
        </div>
      </div>
    </div>
  );
}