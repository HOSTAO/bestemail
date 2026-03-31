'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import SimpleFooter from '@/components/SimpleFooter';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: 'general',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for contacting us! We will get back to you within 24 hours.');
      setLoading(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: 'general',
        message: ''
      });
    }, 1000);
  };

  const offices = [
    {
      location: 'Mumbai (Headquarters)',
      address: [
        'Hostao L.L.C.',
        '123, Tech Park, Sector 5',
        'Andheri East',
        'Mumbai, Maharashtra 400093',
        'India'
      ],
      phone: '+91 747 0111 222',
      email: 'contact@hostao.com',
      hours: 'Monday - Saturday: 9:00 AM - 7:00 PM IST'
    },
    {
      location: 'Bangalore Office',
      address: [
        'Hostao L.L.C.',
        '456, IT Hub, Whitefield',
        'Bangalore, Karnataka 560066',
        'India'
      ],
      phone: '+91 80 4567 8900',
      email: 'bangalore@hostao.com',
      hours: 'Monday - Friday: 9:00 AM - 6:00 PM IST'
    }
  ];

  const contactReasons = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'sales', label: 'Sales & Pricing' },
    { value: 'support', label: 'Technical Support' },
    { value: 'partnership', label: 'Partnership Opportunities' },
    { value: 'media', label: 'Media & Press' },
    { value: 'careers', label: 'Careers' }
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
              <Link href="/features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Pricing
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                About
              </Link>
              <Link href="/contact" className="text-blue-600 font-medium">
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
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Have questions about Bestemail? We're here to help. Reach out to our team 
              and we'll get back to you within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {contactReasons.map((reason) => (
                        <option key={reason.value} value={reason.value}>
                          {reason.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Quick Contact */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Contact</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Sales Inquiries</p>
                    <a href="mailto:sales@bestemail.in" className="text-blue-600 font-medium hover:text-blue-700">
                      sales@bestemail.in
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Technical Support</p>
                    <a href="mailto:support@bestemail.in" className="text-blue-600 font-medium hover:text-blue-700">
                      support@bestemail.in
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone Support</p>
                    <a href="tel:+917470111222" className="text-blue-600 font-medium hover:text-blue-700">
                      +91 747 0111 222
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">WhatsApp Business</p>
                    <a href="https://wa.me/917470111222" className="text-blue-600 font-medium hover:text-blue-700">
                      +91 747 0111 222
                    </a>
                  </div>
                </div>
              </div>

              {/* Support Hours */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Support Hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 7:00 PM IST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium">9:00 AM - 5:00 PM IST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium">Emergency Only</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  24/7 support available for Enterprise customers
                </p>
              </div>

              {/* Response Time */}
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Response Time</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Email: Within 24 hours</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Phone: Immediate</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>WhatsApp: Within 2 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Offices</h2>
            <p className="text-xl text-gray-600">Visit us at our offices across India</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {offices.map((office, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{office.location}</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Address</p>
                    {office.address.map((line, i) => (
                      <p key={i} className="text-gray-700">{line}</p>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="text-blue-600 hover:text-blue-700">
                      {office.phone}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <a href={`mailto:${office.email}`} className="text-blue-600 hover:text-blue-700">
                      {office.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Office Hours</p>
                    <p className="text-gray-700">{office.hours}</p>
                  </div>
                </div>
                <button className="mt-6 text-blue-600 font-medium hover:text-blue-700">
                  Get Directions →
                </button>
              </div>
            ))}
          </div>

          {/* Map Placeholder */}
          <div className="mt-12 bg-white rounded-xl p-4 shadow-sm">
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Interactive Map Coming Soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What is Bestemail?
              </h3>
              <p className="text-gray-600">
                Bestemail is India's most affordable email marketing platform, developed by Hostao L.L.C. 
                We help businesses send professional email campaigns at just ₹0.10 per 1000 emails.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you provide customer support in Hindi?
              </h3>
              <p className="text-gray-600">
                Yes! We provide full customer support in Hindi, English, and several regional languages. 
                Our support team is available 24/7 to assist you.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial available?
              </h3>
              <p className="text-gray-600">
                Yes, we offer a 14-day free trial with full access to all features. 
                No credit card required to start your trial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of businesses already growing with Bestemail
          </p>
          <Link 
            href="/signup" 
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all inline-block"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <SimpleFooter />
    </>
  );
}