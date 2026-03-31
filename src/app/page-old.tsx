'use client';

import Link from 'next/link';
import { useState } from 'react';
import Logo from '@/components/Logo';
import SimpleFooter from '@/components/SimpleFooter';

export default function Home() {
  const [email, setEmail] = useState('');

  const stats = [
    { value: '5000+', label: 'Active Businesses' },
    { value: '10M+', label: 'Emails Sent Monthly' },
    { value: '99%', label: 'Delivery Rate' },
    { value: '24/7', label: 'Support Available' }
  ];

  const features = [
    {
      icon: '📧',
      title: 'Smart Email Campaigns',
      description: 'Create beautiful, responsive emails with our drag-and-drop editor. No coding required.',
      link: '/features#campaigns'
    },
    {
      icon: '🤖',
      title: 'Marketing Automation',
      description: 'Set up automated workflows for welcome series, abandoned carts, and customer re-engagement.',
      link: '/features#automation'
    },
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Track opens, clicks, and conversions with real-time reporting and actionable insights.',
      link: '/features#analytics'
    },
    {
      icon: '🏷️',
      title: 'White Label Solution',
      description: 'Offer email marketing under your brand with our fully customizable white-label platform.',
      link: '/features#whitelabel'
    },
    {
      icon: '🌐',
      title: 'Multi-Language Support',
      description: 'Connect with customers in their language. Full support for Hindi, English, and regional languages.',
      link: '/features#languages'
    },
    {
      icon: '🔒',
      title: 'Enterprise Security',
      description: 'Bank-level encryption, GDPR compliance, and ISO 27001 certified infrastructure.',
      link: '/features#security'
    }
  ];

  const testimonials = [
    {
      name: "Amit Sharma",
      role: "CEO, TechStart Mumbai",
      company: "Technology",
      message: "Bestemail transformed our customer engagement. The ROI has been incredible - we've seen a 3x increase in conversions.",
      image: "/testimonials/amit.jpg",
      rating: 5
    },
    {
      name: "Priya Patel",
      role: "Marketing Director, Fashion Forward",
      company: "E-commerce",
      message: "The automation features save us 20 hours per week. Festival campaigns are now effortless with their templates.",
      image: "/testimonials/priya.jpg",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Founder, Organic India Foods",
      company: "Food & Beverage",
      message: "Finally, an email platform that understands Indian businesses. The Hindi support was a game-changer for us.",
      image: "/testimonials/rajesh.jpg",
      rating: 5
    }
  ];

  const plans = [
    {
      name: 'Starter',
      price: '₹499',
      period: 'per month',
      description: 'Perfect for small businesses just getting started',
      features: [
        'Up to 1,000 contacts',
        '10,000 emails/month',
        'Basic templates',
        'Email support',
        'Campaign analytics',
        'Mobile app access'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Professional',
      price: '₹1,499',
      period: 'per month',
      description: 'For growing businesses ready to scale',
      features: [
        'Up to 5,000 contacts',
        '50,000 emails/month',
        'Premium templates',
        'Priority support',
        'Advanced analytics',
        'Marketing automation',
        'A/B testing',
        'API access'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact sales',
      description: 'Tailored solutions for large organizations',
      features: [
        'Unlimited contacts',
        'Custom email volume',
        'White-label option',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantee',
        'Training & onboarding',
        'Multi-user accounts'
      ],
      cta: 'Contact Sales',
      popular: false
    }
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
              <Link href="/features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
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
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6">
                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium inline-flex items-center">
                  <span className="mr-2">🚀</span> Trusted by 5000+ Indian Businesses
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Email Marketing
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Simplified</span>
                <br />for Indian Businesses
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Send targeted campaigns, automate customer journeys, and grow your business with India's most affordable email marketing platform. Save 99% on costs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg text-center">
                  Start 14-Day Free Trial
                </Link>
                <Link href="/demo" className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all text-center">
                  Watch Demo
                </Link>
              </div>
              <p className="mt-4 text-sm text-gray-500">No credit card required • Setup in 2 minutes</p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 shadow-2xl">
                <img 
                  src="/dashboard-preview.png" 
                  alt="Bestemail Dashboard" 
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-xl p-4 hidden lg:block">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm font-semibold">Live Dashboard</p>
                    <p className="text-xs text-gray-500">2,847 emails sent today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-blue-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From campaign creation to advanced analytics, we provide all the tools you need to run successful email marketing campaigns.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link 
                key={index} 
                href={feature.link}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Indian Businesses
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of businesses already growing with Bestemail
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">&ldquo;{testimonial.message}&rdquo;</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transparent Pricing, Incredible Value
            </h2>
            <p className="text-xl text-gray-600">
              Save 99% compared to international platforms. No hidden fees.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${
                  plan.popular ? 'ring-2 ring-blue-600' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  <Link 
                    href={plan.name === 'Enterprise' ? '/contact' : '/signup'}
                    className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Email Marketing?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of Indian businesses already saving money and growing faster with Bestemail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup" 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all"
            >
              Start Your Free Trial
            </Link>
            <Link 
              href="/contact" 
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <SimpleFooter />
    </>
  );
}