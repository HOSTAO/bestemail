'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import SimpleFooter from '@/components/SimpleFooter';
import { useState } from 'react';

export default function FeaturesPage() {
  const [activeFeature, setActiveFeature] = useState<keyof typeof features>('campaigns');

  const features = {
    campaigns: {
      title: 'Smart Email Campaigns',
      icon: '📧',
      description: 'Create, send, and track professional email campaigns with ease.',
      details: [
        'Drag-and-drop email builder with 100+ templates',
        'Mobile-responsive designs automatically',
        'A/B testing for subject lines and content',
        'Schedule campaigns for optimal delivery times',
        'Real-time analytics and reporting',
        'Personalization with merge tags',
        'Multi-language support (Hindi, English, Regional)',
        'Preview emails before sending'
      ],
      image: '/features/campaigns-preview.png'
    },
    automation: {
      title: 'Marketing Automation',
      icon: '🤖',
      description: 'Set up intelligent workflows that run on autopilot.',
      details: [
        'Welcome series for new subscribers',
        'Abandoned cart recovery sequences',
        'Birthday and anniversary campaigns',
        'Re-engagement campaigns for inactive users',
        'Post-purchase follow-ups',
        'Lead nurturing workflows',
        'Behavior-based triggers',
        'Custom automation rules'
      ],
      image: '/features/automation-preview.png'
    },
    analytics: {
      title: 'Advanced Analytics',
      icon: '📊',
      description: 'Get actionable insights to improve your campaigns.',
      details: [
        'Real-time open and click tracking',
        'Conversion tracking with e-commerce integration',
        'Geographic performance data',
        'Device and email client statistics',
        'Subscriber growth trends',
        'Campaign comparison reports',
        'ROI calculator',
        'Export reports in multiple formats'
      ],
      image: '/features/analytics-preview.png'
    },
    whitelabel: {
      title: 'White Label Solution',
      icon: '🏷️',
      description: 'Offer email marketing under your own brand.',
      details: [
        'Custom domain setup',
        'Branded email headers and footers',
        'Custom login portal',
        'Your logo throughout the platform',
        'Custom pricing for your clients',
        'Multi-tenant architecture',
        'API access for integration',
        'Dedicated support channel'
      ],
      image: '/features/whitelabel-preview.png'
    },
    segmentation: {
      title: 'Smart Segmentation',
      icon: '🎯',
      description: 'Target the right audience with precision.',
      details: [
        'Behavior-based segmentation',
        'Demographic filtering',
        'Purchase history segments',
        'Engagement level grouping',
        'Custom field segmentation',
        'Dynamic segments that update automatically',
        'Tag-based organization',
        'Import segments from CRM'
      ],
      image: '/features/segmentation-preview.png'
    },
    integrations: {
      title: 'Powerful Integrations',
      icon: '🔗',
      description: 'Connect with your favorite tools and platforms.',
      details: [
        'WordPress plugin',
        'Shopify integration',
        'WooCommerce sync',
        'Zapier connectivity',
        'API for custom integrations',
        'CRM synchronization',
        'Social media integration',
        '65+ website platforms supported'
      ],
      image: '/features/integrations-preview.png'
    }
  };

  const additionalFeatures = [
    {
      icon: '📱',
      title: 'SMS Marketing',
      description: 'Combine email with SMS for maximum reach. Send targeted text campaigns.'
    },
    {
      icon: '📝',
      title: 'Forms & Landing Pages',
      description: 'Create signup forms and landing pages without coding.'
    },
    {
      icon: '👥',
      title: 'Team Collaboration',
      description: 'Multi-user access with role-based permissions.'
    },
    {
      icon: '🔒',
      title: 'Enterprise Security',
      description: 'Bank-level encryption and GDPR compliance.'
    },
    {
      icon: '🎨',
      title: 'Template Library',
      description: '100+ professionally designed templates for every industry.'
    },
    {
      icon: '📞',
      title: '24/7 Support',
      description: 'Round-the-clock customer support in multiple languages.'
    }
  ];

  const comparisons = [
    { feature: 'Email Cost', bestemail: '₹0.10/1000', others: '₹100-500/1000' },
    { feature: 'Setup Time', bestemail: '2 minutes', others: '2-3 hours' },
    { feature: 'Hindi Support', bestemail: '✓ Full support', others: '✗ Limited/None' },
    { feature: 'White Label', bestemail: '✓ Included', others: '₹50,000+ extra' },
    { feature: 'API Access', bestemail: '✓ All plans', others: 'Enterprise only' },
    { feature: 'Support', bestemail: '24/7 Free', others: 'Business hours only' }
  ];

  return (
    <>
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Logo size="md" />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Home
              </Link>
              <Link href="/features" className="text-blue-600 font-medium">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Pricing
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Contact
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/working-dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Login
              </Link>
              <Link href="/signup" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-md">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Email Marketing Success</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Powerful features designed specifically for Indian businesses. 
              Save 99% on costs while getting enterprise-grade capabilities.
            </p>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Feature Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Core Features</h3>
                <nav className="space-y-2">
                  {(Object.entries(features) as [keyof typeof features, typeof features[keyof typeof features]][]).map(([key, feature]) => (
                    <button
                      key={key}
                      onClick={() => setActiveFeature(key)}
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all ${
                        activeFeature === key
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="text-2xl">{feature.icon}</span>
                      <span>{feature.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Feature Details */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <span className="text-5xl mr-4">{features[activeFeature].icon}</span>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      {features[activeFeature].title}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {features[activeFeature].description}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {features[activeFeature].details.map((detail, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span className="text-gray-700">{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Feature Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              More Powerful Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need in one platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Bestemail?
            </h2>
            <p className="text-xl text-gray-600">
              See how we compare with international platforms
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Feature</th>
                  <th className="px-6 py-4 text-center">Bestemail</th>
                  <th className="px-6 py-4 text-center">Others</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {comparisons.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-6 py-4 font-medium">{item.feature}</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">{item.bestemail}</td>
                    <td className="px-6 py-4 text-center text-gray-500">{item.others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Integration Showcase */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Seamless Integrations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect Bestemail with your existing tools and platforms
            </p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8">
            {['WordPress', 'Shopify', 'WooCommerce', 'Zapier', 'Google', 'Facebook'].map((platform, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-3"></div>
                <p className="text-sm font-medium text-gray-700">{platform}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/integrations" className="text-blue-600 font-medium hover:text-blue-700">
              View all 65+ integrations →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Experience the Power of Bestemail
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Start your 14-day free trial and see why thousands of Indian businesses trust us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup" 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all"
            >
              Start Free Trial
            </Link>
            <Link 
              href="/demo" 
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <SimpleFooter />
    </>
  );
}