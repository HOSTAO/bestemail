"use client"
import { useState } from "react"

const quickLinks = [
  { icon: "🚀", title: "Getting Started", description: "Create your account and send your first campaign" },
  { icon: "📧", title: "Campaigns", description: "Create, schedule, and manage email campaigns" },
  { icon: "👥", title: "Contacts", description: "Import, segment, and manage your contact lists" },
  { icon: "🎨", title: "Templates", description: "Email templates for every occasion" },
  { icon: "📊", title: "Analytics", description: "Track opens, clicks, bounces, and conversions" },
  { icon: "💳", title: "Billing", description: "Plans, pricing, and subscription management" }
]

const topQuestions = [
  { q: "How do I create my first email campaign?", a: "Go to Campaigns → New Campaign. Choose a template or start blank, write your content using the rich text editor, select your audience, and hit Send or Schedule.", category: "Campaigns" },
  { q: "How do I import my contacts?", a: "Go to Contacts → Import. Upload a CSV file with email, name, and custom fields. We'll auto-map the columns and import your list.", category: "Contacts" },
  { q: "Can I use pre-built email templates?", a: "Yes! We offer templates for Welcome emails, Newsletters, Promotions, Festival greetings, and Business announcements. Customize colors, text, and images.", category: "Templates" },
  { q: "How do I track email open rates?", a: "After sending, go to Campaign → Analytics to see open rates, click rates, bounce rates, and unsubscribes in real-time.", category: "Analytics" },
  { q: "Can I segment my audience?", a: "Yes! Go to Contacts → Segments → Create. Build segments based on tags, signup date, engagement, location, or custom fields.", category: "Contacts" },
  { q: "What plans do you offer?", a: "Free plan: up to 500 contacts and 2,500 emails/month. Pro (₹999/mo): templates, scheduling, advanced analytics. Business (₹2,499/mo): automation and team features.", category: "Billing" }
]

const categories = [
  { icon: "🚀", name: "Getting Started", count: "6 articles" },
  { icon: "📧", name: "Campaigns", count: "10 articles" },
  { icon: "👥", name: "Contacts & Lists", count: "8 articles" },
  { icon: "🎨", name: "Templates", count: "5 articles" },
  { icon: "📊", name: "Analytics", count: "7 articles" },
  { icon: "💳", name: "Billing", count: "4 articles" }
]

export default function SupportPage() {
  const [search, setSearch] = useState("")
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const filtered = topQuestions.filter(q =>
    q.q.toLowerCase().includes(search.toLowerCase()) ||
    q.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#f1f5f9", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 10 }}>How can we help you?</h1>
          <p style={{ color: "#94a3b8", fontSize: 16, marginBottom: 24 }}>Find answers or contact our support team directly.</p>
          <div style={{ maxWidth: 500, margin: "0 auto" }}>
            <input type="text" placeholder="🔍 Search for help..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", padding: "14px 18px", borderRadius: 12, border: "1px solid #334155", background: "#1e293b", color: "#f1f5f9", fontSize: 15, outline: "none" }} />
          </div>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Quick links</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 12, marginBottom: 40 }}>
          {quickLinks.map((link, i) => (
            <div key={i} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{link.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{link.title}</div>
              <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>{link.description}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Frequently asked questions</h2>
        <div style={{ marginBottom: 40 }}>
          {filtered.map((faq, i) => (
            <div key={i} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 10, marginBottom: 8 }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: "none", border: "none", color: "#f1f5f9", cursor: "pointer", fontSize: 14, fontWeight: 600, textAlign: "left" }}>
                <span>{faq.q}</span>
                <span style={{ color: "#64748b", fontSize: 18 }}>▼</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 18px 14px", color: "#94a3b8", fontSize: 13, lineHeight: 1.6 }}>
                  <span style={{ display: "inline-block", background: "#334155", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, marginBottom: 8, color: "#10b981" }}>{faq.category}</span>
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Browse by category</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 12, marginBottom: 40 }}>
          {categories.map((cat, i) => (
            <div key={i} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{cat.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{cat.name}</div>
              <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>{cat.count}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 14, padding: "28px", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>💬</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Still need help?</h2>
          <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 16 }}>Our support team responds within a few hours during business hours.</p>
          <a href="mailto:support@bestemail.in" style={{ display: "inline-block", background: "#10b981", color: "white", padding: "12px 28px", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Contact Support</a>
          <p style={{ color: "#475569", fontSize: 12, marginTop: 12 }}>Business hours: Monday–Friday, 9 AM – 6 PM IST</p>
        </div>
      </div>
    </div>
  )
}
