'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function CorporateHomePage() {
  const [activeTab, setActiveTab] = useState('features');

  const features = [
    {
      icon: '📧',
      title: 'Enterprise Email Campaigns',
      description: 'Create, manage, and track professional email campaigns at scale with advanced analytics.',
    },
    {
      icon: '🔒',
      title: 'Bank-Grade Security',
      description: 'AES-256 encryption, role-based access control, and comprehensive audit trails.',
    },
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Real-time insights, conversion tracking, and custom reporting dashboards.',
    },
    {
      icon: '🌐',
      title: 'Multi-Tenant Architecture',
      description: 'White-label ready platform supporting unlimited brands and sub-accounts.',
    },
    {
      icon: '🚀',
      title: 'Infinite Scalability',
      description: 'Handle millions of emails monthly with 99.9% uptime guarantee.',
    },
    {
      icon: '💰',
      title: '90% Cost Reduction',
      description: 'Enterprise features at startup prices. Pay only for what you use.',
    },
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'CEO, TechStart India',
      content: 'Bestemail transformed our email marketing. We saved 85% on costs while improving deliverability.',
      rating: 5,
    },
    {
      name: 'Priya Sharma',
      role: 'Marketing Director, E-Commerce Plus',
      content: 'The white-label feature lets us offer email marketing to our clients seamlessly.',
      rating: 5,
    },
    {
      name: 'Amit Patel',
      role: 'CTO, Digital Solutions',
      content: 'Rock-solid delivery infrastructure. Best decision for our business.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Professional Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">B</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Bestemail</h1>
                  <p className="text-xs text-gray-500">Enterprise Email Platform</p>
                </div>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#security" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">Security</a>
              <a href="#about" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">About</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Enterprise Email Marketing
              <span className="block text-blue-600">Built for reliable delivery</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Professional email platform trusted by 1000+ Indian businesses. 
              Save 90% on email costs while scaling infinitely.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/signup" className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 text-lg font-medium shadow-lg">
                Start Free Trial
              </Link>
              <Link href="/demo" className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 transition-all border-2 border-blue-600 text-lg font-medium">
                Book Demo
              </Link>
            </div>
            
            <div className="mt-12 flex justify-center items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No Credit Card Required
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                14-Day Free Trial
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Cancel Anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">1000+</div>
              <div className="text-sm text-gray-600">Active Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">50M+</div>
              <div className="text-sm text-gray-600">Emails Sent Monthly</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">99.9%</div>
              <div className="text-sm text-gray-600">Uptime Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">90%</div>
              <div className="text-sm text-gray-600">Cost Savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to run professional email campaigns at scale
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-blue-200"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Scale & Reliability
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise architecture designed for millions of emails
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Powered by Industry Leaders
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Reliable delivery infrastructure</h4>
                      <p className="text-gray-600">Delivery infrastructure designed for control and consistency</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Global delivery network</h4>
                      <p className="text-gray-600">Built for dependable sending at scale</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Global performance network</h4>
                      <p className="text-gray-600">Lightning-fast global performance</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-100 rounded-xl p-8">
                <div className="text-center space-y-6">
                  <div className="text-6xl font-bold text-blue-600">₹0.10</div>
                  <div className="text-xl text-gray-700">per 1,000 emails</div>
                  <div className="pt-4 border-t border-gray-300">
                    <p className="text-sm text-gray-600 mb-2">Compare to:</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Typical email suite:</span>
                        <span className="font-semibold">₹15-30</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Typical API-first tool:</span>
                        <span className="font-semibold">₹20-40</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Constant Contact:</span>
                        <span className="font-semibold">₹25-50</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our customers say about Bestemail
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Email Marketing?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 1000+ businesses saving 90% on email costs with enterprise features
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/signup" className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 text-lg font-medium shadow-lg">
              Start Free Trial
            </Link>
            <Link href="/contact" className="px-8 py-4 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-all border-2 border-blue-500 text-lg font-medium">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Bestemail</h3>
              <p className="text-sm">Enterprise email platform built for reliable delivery and efficient operations.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/security" className="hover:text-white">Security</Link></li>
                <li><Link href="/api" className="hover:text-white">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/gdpr" className="hover:text-white">GDPR</Link></li>
                <li><Link href="/sla" className="hover:text-white">SLA</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>&copy; 2024 Bestemail. All rights reserved. Built with ❤️ in India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}