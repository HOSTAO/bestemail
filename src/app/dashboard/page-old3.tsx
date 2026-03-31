'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Import new page components
import AutomationPage from './automation/page';
import FormsPage from './forms/page';
import ABTestingPage from './ab-testing/page';
import IntegrationsPage from './integrations/page';
import TeamPage from './team/page';
import SMSPage from './sms/page';
import SettingsPage from './settings/page';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const router = useRouter();

  const loadData = async () => {
    try {
      const [cRes, ctRes] = await Promise.all([fetch('/api/campaigns'), fetch('/api/contacts')]);
      if (cRes.ok) setCampaigns(await cRes.json());
      if (ctRes.ok) setContacts(await ctRes.json());
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createCampaign = () => {
    router.push('/dashboard/campaigns/new');
  };

  const addQuickContact = async () => {
    const email = prompt('Contact email');
    if (!email) return;
    const name = prompt('Contact name', '') || '';

    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, tags: [] }),
    });
    if (res.ok) {
      await loadData();
      alert('Contact added');
    } else {
      alert('Failed to add contact');
    }
  };

  const importSampleCsv = async () => {
    const csv = 'email,name,city,businessType,tags\npriya@example.com,Priya,Mumbai,Boutique,customer|vip\nrajesh@example.com,Rajesh,Ahmedabad,Restaurant,customer';
    const res = await fetch('/api/contacts/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csv, syncToSendy: false }),
    });
    const data = await res.json();
    if (res.ok) {
      await loadData();
      alert(`Imported ${data.imported} contacts`);
    } else {
      alert('Import failed');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  // Render different content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'automation':
        return <AutomationPage />;
      case 'forms':
        return <FormsPage />;
      case 'sms':
        return <SMSPage />;
      case 'ab-testing':
        return <ABTestingPage />;
      case 'integrations':
        return <IntegrationsPage />;
      case 'team':
        return <TeamPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <img src="/logo-wide.png" alt="Bestemail.in" className="h-10" />
              </Link>
              <span className="ml-8 text-sm text-gray-500">Email Marketing Platform</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, Demo User</span>
              <button 
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm border-r">
          <nav className="p-4">
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all ${
                    activeTab === 'overview' 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">📊</span>
                  <span>Overview</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('campaigns')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all ${
                    activeTab === 'campaigns' 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">📧</span>
                  <span>Campaigns</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('automation')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all ${
                    activeTab === 'automation' 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">🤖</span>
                  <span>Automation</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('contacts')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all ${
                    activeTab === 'contacts' 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">👥</span>
                  <span>Contacts</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('forms')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all ${
                    activeTab === 'forms' 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">📋</span>
                  <span>Forms & Landing</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('sms')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all ${
                    activeTab === 'sms' 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">💬</span>
                  <span>SMS Marketing</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('ab-testing')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all ${
                    activeTab === 'ab-testing' 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">🧪</span>
                  <span>A/B Testing</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('integrations')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all ${
                    activeTab === 'integrations' 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">🔗</span>
                  <span>Integrations</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all ${
                    activeTab === 'reports' 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">📈</span>
                  <span>Reports</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('team')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all ${
                    activeTab === 'team' 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">👥</span>
                  <span>Team</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push('/dashboard/quick-start')}
                  className="w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all text-gray-700 hover:bg-gray-50"
                >
                  <span className="text-xl">🚀</span>
                  <span>Quick Start</span>
                </button>
              </li>
              <li className="pt-4 mt-4 border-t">
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all ${
                    activeTab === 'settings' 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">⚙️</span>
                  <span>Settings</span>
                </button>
              </li>
            </ul>
          </nav>

          {/* Upgrade Section */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg p-4">
              <h4 className="font-semibold mb-1">Upgrade to Pro</h4>
              <p className="text-sm mb-3 opacity-90">Get unlimited contacts and advanced features</p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded text-sm font-medium hover:bg-blue-50 transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Use new components for new tabs */}
          {['automation', 'forms', 'sms', 'ab-testing', 'integrations', 'team'].includes(activeTab) ? (
            renderContent()
          ) : (
            <div className="p-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div>
                  <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your email marketing.</p>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 mb-8 text-white">
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="flex flex-wrap gap-3">
                      <Link 
                        href="/dashboard/campaigns/new" 
                        className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center font-medium"
                      >
                        📧 Create Campaign
                      </Link>
                      <Link 
                        href="/dashboard/contacts" 
                        className="bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors inline-flex items-center font-medium border border-white/30"
                      >
                        👥 Import Contacts
                      </Link>
                      <Link 
                        href="/dashboard/quick-start" 
                        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors inline-flex items-center font-medium"
                      >
                        🚀 Quick Start Guide
                      </Link>
                      <Link 
                        href="/dashboard/settings" 
                        className="bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors inline-flex items-center font-medium border border-white/30"
                      >
                        ⚙️ Configure Sendy
                      </Link>
                    </div>
                    <div className="mt-4 text-sm opacity-90">
                      💡 Tip: Use the Quick Start Guide to integrate email sending for all your 65 websites in just 2 minutes!
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Total Campaigns</h3>
                        <span className="text-2xl">📧</span>
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{campaigns.length}</p>
                      <p className="text-sm text-green-600 mt-2">+12% from last month</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Total Contacts</h3>
                        <span className="text-2xl">👥</span>
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{contacts.length}</p>
                      <p className="text-sm text-green-600 mt-2">+8% from last month</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Open Rate</h3>
                        <span className="text-2xl">📊</span>
                      </div>
                      <p className="text-3xl font-bold text-gray-900">24.8%</p>
                      <p className="text-sm text-green-600 mt-2">+2.3% from last month</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Click Rate</h3>
                        <span className="text-2xl">🎯</span>
                      </div>
                      <p className="text-3xl font-bold text-gray-900">3.4%</p>
                      <p className="text-sm text-red-600 mt-2">-0.5% from last month</p>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b">
                      <h2 className="text-lg font-semibold">Recent Activity</h2>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm">📧</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Welcome Series campaign sent</p>
                            <p className="text-xs text-gray-500">2 hours ago • 145 recipients</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm">👥</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">12 new contacts added</p>
                            <p className="text-xs text-gray-500">5 hours ago • Via signup form</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm">🤖</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Automation workflow activated</p>
                            <p className="text-xs text-gray-500">1 day ago • Abandoned cart recovery</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Campaigns Tab */}
              {activeTab === 'campaigns' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Campaigns</h1>
                    <button
                      onClick={createCampaign}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      + Create Campaign
                    </button>
                  </div>

                  {campaigns.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                      <div className="text-6xl mb-4">📧</div>
                      <h3 className="text-xl font-semibold mb-2">No campaigns yet</h3>
                      <p className="text-gray-600 mb-4">Start engaging with your audience by creating your first campaign.</p>
                      <button
                        onClick={createCampaign}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Create Your First Campaign
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opens</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {campaigns.map((campaign) => (
                            <tr key={campaign.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div>
                                  <p className="font-medium">{campaign.name}</p>
                                  <p className="text-sm text-gray-500">{campaign.subject}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                                  campaign.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {campaign.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm">{campaign.sent_count || 0}</td>
                              <td className="px-6 py-4 text-sm">{campaign.open_count || 0}</td>
                              <td className="px-6 py-4 text-sm">{campaign.click_count || 0}</td>
                              <td className="px-6 py-4 text-sm">
                                <button className="text-blue-600 hover:text-blue-800">View</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Contacts Tab */}
              {activeTab === 'contacts' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Contacts</h1>
                    <div className="flex space-x-3">
                      <button
                        onClick={importSampleCsv}
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Import Sample
                      </button>
                      <button
                        onClick={addQuickContact}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        + Add Contact
                      </button>
                    </div>
                  </div>

                  {contacts.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                      <div className="text-6xl mb-4">👥</div>
                      <h3 className="text-xl font-semibold mb-2">No contacts yet</h3>
                      <p className="text-gray-600 mb-4">Import your contacts or add them manually to get started.</p>
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={importSampleCsv}
                          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Import Sample Contacts
                        </button>
                        <button
                          onClick={addQuickContact}
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add Your First Contact
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {contacts.map((contact) => (
                            <tr key={contact.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm">{contact.email}</td>
                              <td className="px-6 py-4 text-sm">{contact.first_name || '-'}</td>
                              <td className="px-6 py-4 text-sm">{contact.city || '-'}</td>
                              <td className="px-6 py-4 text-sm">
                                {contact.tags?.length ? contact.tags.join(', ') : '-'}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <button className="text-blue-600 hover:text-blue-800">Edit</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Reports Tab */}
              {activeTab === 'reports' && (
                <div>
                  <h1 className="text-2xl font-bold mb-6">Email Performance Reports</h1>
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-xl font-semibold mb-2">Analytics Coming Soon</h3>
                    <p className="text-gray-600">Detailed reports and analytics will be available here.</p>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h1 className="text-2xl font-bold mb-6">Settings</h1>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                    <p className="text-gray-600">Configure your account preferences and integrations.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}