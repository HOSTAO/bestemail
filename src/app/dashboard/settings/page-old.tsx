// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
// Supabase removed
const createClient = () => null;
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface SendySettings {
  api_url: string;
  api_key: string;
  list_id: string;
  brand_id: string;
  from_email: string;
  from_name: string;
  smsApiToken?: string;
  smsSenderId?: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SendySettings>({
    api_url: '',
    api_key: '',
    list_id: '',
    brand_id: '1',
    from_email: '',
    from_name: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSmsApiKey, setShowSmsApiKey] = useState(false);
  const [smsTestResult, setSmsTestResult] = useState('');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
  const router = useRouter();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      if (!supabase) {
        // If no Supabase, load from environment
        setSettings({
          api_url: process.env.NEXT_PUBLIC_SENDY_API_URL || 'https://my.bestemail.in',
          api_key: '',
          list_id: '',
          brand_id: '1',
          from_email: 'hello@bestemail.in',
          from_name: 'Bestemail'
        });
        setLoading(false);
        return;
      }
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Load settings from database
      const { data: existingSettings, error } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (existingSettings) {
        setSettings({
          api_url: existingSettings.sendy_api_url || '',
          api_key: existingSettings.sendy_api_key || '',
          list_id: existingSettings.sendy_list_id || '',
          brand_id: existingSettings.sendy_brand_id || '1',
          from_email: existingSettings.default_from_email || '',
          from_name: existingSettings.default_from_name || ''
        });
      } else {
        // Load from environment variables as defaults
        setSettings({
          api_url: process.env.NEXT_PUBLIC_SENDY_API_URL || 'https://my.bestemail.in',
          api_key: '',
          list_id: '',
          brand_id: '1',
          from_email: 'hello@bestemail.in',
          from_name: 'Bestemail'
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      if (!supabase) {
        toast.error('Database not configured. Settings would be saved to environment variables in production.');
        setSaving(false);
        return;
      }
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Not authenticated');
        return;
      }

      const settingsData = {
        user_id: user.id,
        sendy_api_url: settings.api_url,
        sendy_api_key: settings.api_key,
        sendy_list_id: settings.list_id,
        sendy_brand_id: settings.brand_id,
        default_from_email: settings.from_email,
        default_from_name: settings.from_name,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('settings')
        .upsert(settingsData);

      if (error) throw error;

      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const response = await fetch('/api/settings/test-sendy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_url: settings.api_url,
          api_key: settings.api_key,
          list_id: settings.list_id
        })
      });

      const result = await response.json();
      
      setTestResult({
        success: response.ok,
        message: result.message || (response.ok ? 'Connection successful!' : 'Connection failed')
      });
      
      if (response.ok) {
        toast.success('Sendy connection test passed!');
      } else {
        toast.error('Sendy connection test failed');
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Network error: Could not reach Sendy'
      });
      toast.error('Failed to test connection');
    } finally {
      setTesting(false);
    }
  };

  const handleTestSmsConnection = async () => {
    if (!settings.smsApiToken) {
      toast.error('Please enter SMS API token first');
      return;
    }
    
    try {
      const response = await fetch('/api/settings/test-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_token: settings.smsApiToken
        })
      });

      const result = await response.json();
      setSmsTestResult(result.message);
      
      if (result.success) {
        toast.success('SMS connection successful!');
      } else {
        toast.error('SMS connection failed');
      }
    } catch (error) {
      setSmsTestResult('Failed to test SMS connection');
      toast.error('SMS test failed');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Sendy Configuration */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span>📧</span> Sendy Email Configuration
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sendy API URL
            </label>
            <input
              type="url"
              value={settings.api_url}
              onChange={(e) => setSettings({ ...settings, api_url: e.target.value })}
              placeholder="https://my.bestemail.in"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Your Sendy installation URL</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <input
              type="password"
              value={settings.api_key}
              onChange={(e) => setSettings({ ...settings, api_key: e.target.value })}
              placeholder="Your Sendy API key"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Get from Sendy Settings → API</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              List ID
            </label>
            <input
              type="text"
              value={settings.list_id}
              onChange={(e) => setSettings({ ...settings, list_id: e.target.value })}
              placeholder="Your default list ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Found in list URL after l= parameter</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand ID
            </label>
            <input
              type="text"
              value={settings.brand_id}
              onChange={(e) => setSettings({ ...settings, brand_id: e.target.value })}
              placeholder="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Usually 1 for main brand</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={testConnection}
            disabled={testing || !settings.api_key || !settings.list_id}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
        </div>

        {testResult && (
          <div className={`mt-4 p-3 rounded-lg ${testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <p className="font-medium">{testResult.success ? '✅' : '❌'} {testResult.message}</p>
          </div>
        )}
      </div>

      {/* Default Sender Configuration */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span>✉️</span> Default Sender Information
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Email
            </label>
            <input
              type="email"
              value={settings.from_email}
              onChange={(e) => setSettings({ ...settings, from_email: e.target.value })}
              placeholder="hello@bestemail.in"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Name
            </label>
            <input
              type="text"
              value={settings.from_name}
              onChange={(e) => setSettings({ ...settings, from_name: e.target.value })}
              placeholder="Your Company Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">📚 How to get Sendy credentials:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
          <li>Login to your Sendy installation at {settings.api_url || 'my.bestemail.in'}</li>
          <li>Go to Settings → API and copy your API key</li>
          <li>Click on your subscriber list and copy the ID from the URL (after l=)</li>
          <li>Brand ID is usually 1 for the main brand</li>
        </ol>
      </div>
    </div>
  );
}