'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface CampaignAnalytics {
  id: string;
  name: string;
  subject: string;
  status: string;
  created_at: string;
  started_at: string;
  completed_at: string;
  total_recipients: number;
  sent_count: number;
  open_count: number;
  click_count: number;
  unsubscribe_count: number;
  bounce_count: number;
  open_rate: number;
  click_rate: number;
  unsubscribe_rate: number;
}

interface CampaignAnalyticsProps {
  campaignId: string;
}

export function CampaignAnalytics({ campaignId }: CampaignAnalyticsProps) {
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [deviceStats, setDeviceStats] = useState<any[]>([]);
  const [clickedLinks, setClickedLinks] = useState<any[]>([]);


  useEffect(() => {
    loadAnalytics();
  }, [campaignId]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        console.log('Supabase not configured');
        setLoading(false);
        return;
      }
      
      // Load campaign analytics
      const { data: campaign } = await supabase
        .from('campaign_analytics')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (campaign) {
        setAnalytics(campaign);
      }

      // Load device stats
      const { data: opens } = await supabase
        .from('campaign_opens')
        .select('device_type, email_client')
        .eq('campaign_id', campaignId);

      if (opens) {
        const deviceCounts = opens.reduce((acc: any, open) => {
          acc[open.device_type] = (acc[open.device_type] || 0) + 1;
          return acc;
        }, {});
        
        setDeviceStats(Object.entries(deviceCounts).map(([device, count]) => ({
          device,
          count,
        })));
      }

      // Load top clicked links
      const { data: clicks } = await supabase
        .from('campaign_clicks')
        .select('url')
        .eq('campaign_id', campaignId);

      if (clicks) {
        const linkCounts = clicks.reduce((acc: any, click) => {
          acc[click.url] = (acc[click.url] || 0) + 1;
          return acc;
        }, {});
        
        const topLinks = Object.entries(linkCounts)
          .map(([url, count]) => ({ url, count }))
          .sort((a: any, b: any) => b.count - a.count)
          .slice(0, 5);
          
        setClickedLinks(topLinks);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (!analytics) {
    return <div>No analytics data available</div>;
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-green-600';
      case 'sending': return 'text-blue-600';
      case 'scheduled': return 'text-yellow-600';
      case 'draft': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Campaign Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{analytics.name}</h2>
            <p className="text-gray-600 mt-1">{analytics.subject}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(analytics.status)}`}>
            {analytics.status}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Created:</span>
            <span className="ml-2">{formatDate(analytics.created_at)}</span>
          </div>
          {analytics.completed_at && (
            <div>
              <span className="text-gray-500">Completed:</span>
              <span className="ml-2">{formatDate(analytics.completed_at)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Sent"
          value={analytics.sent_count}
          total={analytics.total_recipients}
          icon="📧"
          color="blue"
        />
        <MetricCard
          title="Opened"
          value={analytics.open_count}
          percentage={analytics.open_rate}
          icon="👁"
          color="green"
        />
        <MetricCard
          title="Clicked"
          value={analytics.click_count}
          percentage={analytics.click_rate}
          icon="🖱"
          color="purple"
        />
        <MetricCard
          title="Unsubscribed"
          value={analytics.unsubscribe_count}
          percentage={analytics.unsubscribe_rate}
          icon="🚫"
          color="red"
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Opens by Device</h3>
          {deviceStats.length > 0 ? (
            <div className="space-y-3">
              {deviceStats.map((stat: any) => (
                <div key={stat.device} className="flex justify-between items-center">
                  <span className="capitalize">{stat.device}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(stat.count / analytics.open_count) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {stat.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No device data available yet</p>
          )}
        </div>

        {/* Top Clicked Links */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Top Clicked Links</h3>
          {clickedLinks.length > 0 ? (
            <div className="space-y-3">
              {clickedLinks.map((link: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm truncate max-w-xs" title={link.url}>
                    {new URL(link.url).hostname}
                  </span>
                  <span className="text-sm font-medium">{link.count} clicks</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No clicks recorded yet</p>
          )}
        </div>
      </div>

      {/* Engagement Timeline (placeholder for future) */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Engagement Timeline</h3>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">Coming soon: Hourly engagement chart</p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  total, 
  percentage, 
  icon, 
  color 
}: { 
  title: string;
  value: number;
  total?: number;
  percentage?: number;
  icon: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-500 text-sm">{title}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">
        {value.toLocaleString()}
      </div>
      {total !== undefined && (
        <p className="text-sm text-gray-500">of {total.toLocaleString()}</p>
      )}
      {percentage !== undefined && (
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClasses[color as keyof typeof colorClasses]}`}>
          {percentage}%
        </div>
      )}
    </div>
  );
}