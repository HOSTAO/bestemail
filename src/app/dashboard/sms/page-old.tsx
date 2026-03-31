'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SMSCampaign {
  id: string;
  name: string;
  message: string;
  recipients: number;
  sent: number;
  delivered: number;
  cost: number;
  status: 'draft' | 'scheduled' | 'sending' | 'sent';
  scheduledAt?: string;
  createdAt: string;
}

export default function SMSPage() {
  const [campaigns] = useState<SMSCampaign[]>([
    {
      id: '1',
      name: 'Diwali Flash Sale SMS',
      message: 'Happy Diwali! 🪔 Flash sale TODAY only - 50% off everything! Shop now: bit.ly/diwali50',
      recipients: 1250,
      sent: 1250,
      delivered: 1198,
      cost: 375, // ₹0.30 per SMS
      status: 'sent',
      createdAt: '2025-02-28',
    },
    {
      id: '2',
      name: 'Order Confirmation',
      message: 'Your order #12345 is confirmed and will be delivered by tomorrow. Track: bit.ly/track',
      recipients: 85,
      sent: 85,
      delivered: 84,
      cost: 25.50,
      status: 'sent',
      createdAt: '2025-03-01',
    },
  ]);

  const [showComposer, setShowComposer] = useState(false);
  const [message, setMessage] = useState('');
  const [sendType, setSendType] = useState<'now' | 'scheduled'>('now');

  const characterCount = message.length;
  const smsCount = Math.ceil(characterCount / 160) || 1;
  const estimatedCost = smsCount * 0.30 * 100; // ₹0.30 per SMS * recipients

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">SMS Marketing</h1>
          <p className="text-gray-600 mt-2">
            Send instant text messages to your customers
          </p>
        </div>
        <button
          onClick={() => setShowComposer(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          + Send SMS Campaign
        </button>
      </div>

      {/* SMS Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg p-6 border">
          <p className="text-gray-600 text-sm">SMS Balance</p>
          <p className="text-3xl font-bold mt-2">₹2,450</p>
          <p className="text-sm text-gray-500 mt-1">~8,166 SMS</p>
        </div>
        <div className="bg-white rounded-lg p-6 border">
          <p className="text-gray-600 text-sm">Sent This Month</p>
          <p className="text-3xl font-bold mt-2">3,420</p>
        </div>
        <div className="bg-white rounded-lg p-6 border">
          <p className="text-gray-600 text-sm">Delivery Rate</p>
          <p className="text-3xl font-bold mt-2">96.2%</p>
        </div>
        <div className="bg-white rounded-lg p-6 border">
          <p className="text-gray-600 text-sm">Click Rate</p>
          <p className="text-3xl font-bold mt-2">18.5%</p>
        </div>
        <div className="bg-white rounded-lg p-6 border">
          <p className="text-gray-600 text-sm">Opt-outs</p>
          <p className="text-3xl font-bold mt-2">0.8%</p>
        </div>
      </div>

      {/* Pricing Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-2">
          <span className="text-yellow-600">ℹ️</span>
          <div className="text-sm">
            <p className="font-medium text-yellow-800">SMS Pricing</p>
            <p className="text-yellow-700">
              Transactional: ₹0.15/SMS • Promotional: ₹0.13/SMS • International: ₹0.75/SMS
            </p>
          </div>
        </div>
      </div>

      {!showComposer ? (
        <>
          {/* Quick Templates */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Quick SMS Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border rounded-lg p-4 hover:shadow-md cursor-pointer">
                <h3 className="font-medium mb-2">🎉 Festival Greeting</h3>
                <p className="text-sm text-gray-600">
                  Happy [Festival]! Celebrate with [discount]% off. Shop now: [link]
                </p>
                <button className="text-blue-600 text-sm mt-2">Use Template</button>
              </div>
              <div className="bg-white border rounded-lg p-4 hover:shadow-md cursor-pointer">
                <h3 className="font-medium mb-2">📦 Order Update</h3>
                <p className="text-sm text-gray-600">
                  Your order #[order_id] is [status]. Track: [link]
                </p>
                <button className="text-blue-600 text-sm mt-2">Use Template</button>
              </div>
              <div className="bg-white border rounded-lg p-4 hover:shadow-md cursor-pointer">
                <h3 className="font-medium mb-2">🛒 Abandoned Cart</h3>
                <p className="text-sm text-gray-600">
                  You left items in your cart! Complete order: [link]
                </p>
                <button className="text-blue-600 text-sm mt-2">Use Template</button>
              </div>
            </div>
          </div>

          {/* Recent Campaigns */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent SMS Campaigns</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipients
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivered
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campaigns.map(campaign => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {campaign.message}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {campaign.recipients}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p>{campaign.delivered}</p>
                          <p className="text-sm text-gray-500">
                            {((campaign.delivered / campaign.sent) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{campaign.cost.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          campaign.status === 'sent'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/dashboard/sms/${campaign.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View Report
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* SMS Composer */
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Compose SMS Campaign</h2>
            <button
              onClick={() => setShowComposer(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Message Composer */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Weekend Sale SMS"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipients
                </label>
                <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>All SMS Subscribers (2,450)</option>
                  <option>Active Customers (1,850)</option>
                  <option>VIP Customers (320)</option>
                  <option>Custom Segment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your SMS message here..."
                  rows={6}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="flex justify-between mt-2 text-sm">
                  <span className={characterCount > 160 ? 'text-red-600' : 'text-gray-600'}>
                    {characterCount}/160 characters
                  </span>
                  <span className="text-gray-600">
                    {smsCount} SMS × ₹0.30 = ₹{(smsCount * 0.30).toFixed(2)}/recipient
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-700 font-medium mb-2">
                  💡 SMS Best Practices
                </p>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• Keep it under 160 characters for single SMS</li>
                  <li>• Include clear CTA and shortened links</li>
                  <li>• Add opt-out instructions (required by law)</li>
                  <li>• Avoid ALL CAPS and excessive punctuation</li>
                </ul>
              </div>

              {/* Send Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  When to Send
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="now"
                      checked={sendType === 'now'}
                      onChange={(e) => setSendType(e.target.value as 'now' | 'scheduled')}
                      className="mr-2"
                    />
                    <span>Send immediately</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="scheduled"
                      checked={sendType === 'scheduled'}
                      onChange={(e) => setSendType(e.target.value as 'now' | 'scheduled')}
                      className="mr-2"
                    />
                    <span>Schedule for later</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Preview & Cost */}
            <div>
              <h3 className="font-medium mb-4">Preview</h3>
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm max-w-sm mx-auto">
                  <div className="bg-green-600 text-white px-4 py-2 rounded-t-lg text-sm">
                    SMS from Bestemail
                  </div>
                  <div className="p-4">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {message || 'Your message will appear here...'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium">Campaign Cost Estimate</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Recipients:</span>
                    <span className="font-medium">2,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SMS per recipient:</span>
                    <span className="font-medium">{smsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost per SMS:</span>
                    <span className="font-medium">₹0.30</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Total Cost:</span>
                    <span className="text-lg">₹{estimatedCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium">
                  Send SMS Campaign
                </button>
                <button className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50">
                  Save as Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}