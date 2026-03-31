"use client"

import { useState } from "react"

const sections = [
  { status: "done", title: "Completed", items: [
    { title: "Email Campaigns", desc: "Create and send email campaigns" },
    { title: "Contact Management", desc: "Import and manage contacts" },
    { title: "Segments", desc: "Target specific audiences" },
    { title: "Signup Forms", desc: "Collect subscribers from your site" },
    { title: "Rich Text Editor", desc: "Beautiful email composition" },
    { title: "Authentication", desc: "Secure user accounts" }
  ]},
  { status: "progress", title: "In Progress", items: [
    { title: "Email Templates Library", desc: "Welcome, Festival, Business templates" },
    { title: "Campaign Scheduling", desc: "Schedule sends for optimal times" },
    { title: "Personalization Tokens", desc: "Dynamic content per subscriber" },
    { title: "Analytics Dashboard", desc: "Opens, clicks, bounces tracking" },
    { title: "A/B Testing", desc: "Test subject lines and content" }
  ]},
  { status: "planned", title: "Planned", items: [
    { title: "Automation Workflows", desc: "Drip campaigns and triggers" },
    { title: "WhatsApp Integration", desc: "Send via WhatsApp alongside email" },
    { title: "Multi-Language", desc: "Hindi and English support" },
    { title: "White-Label", desc: "Rebrand for your agency" },
    { title: "Team Collaboration", desc: "Multi-user workspace" },
    { title: "API & Webhooks", desc: "Developer integration tools" },
    { title: "SMS Campaigns", desc: "Send SMS alongside emails" },
    { title: "AI Subject Lines", desc: "AI-generated subject line suggestions" }
  ]}
]

export default function RoadmapPage() {
  const [filter, setFilter] = useState("all")
  const filtered = filter === "all" ? sections : sections.filter(s => s.status === filter)

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#f1f5f9", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 10 }}>Product Roadmap</h1>
          <p style={{ color: "#94a3b8", fontSize: 16, marginBottom: 24 }}>See what we have built, what we are working on, and what is coming next.</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {["all", "done", "progress", "planned"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "8px 18px", borderRadius: 20, border: filter === f ? "2px solid #10b981" : "1px solid #334155",
                background: filter === f ? "#10b98122" : "#1e293b", color: filter === f ? "#10b981" : "#94a3b8",
                fontWeight: 600, fontSize: 13, cursor: "pointer"
              }}>
                {{ all: "All", done: "✅ Completed", progress: "🚧 In Progress", planned: "📋 Planned" }[f]}
              </button>
            ))}
          </div>
        </div>

        {filtered.map((section, si) => (
          <div key={si} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
              <span>{{ done: "✅", progress: "🚧", planned: "📋" }[section.status]}</span>
              <span>{section.title}</span>
              <span style={{ background: "#334155", padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>{section.items.length}</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
              {section.items.map((item, i) => (
                <div key={i} style={{
                  background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: "14px 16px",
                  borderLeft: `3px solid ${{ done: "#22c55e", progress: "#10b981", planned: "#64748b" }[section.status]}`
                }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{item.title}</div>
                  <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>{item.desc}</div>
                  {section.status === "planned" && (
                    <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                      <span style={{ background: "#334155", padding: "2px 8px", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>👍 Upvote</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 14, padding: "28px", textAlign: "center", marginTop: 20 }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>💡</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Suggest a Feature</h2>
          <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 16 }}>Have an idea that would make BestEmail better? We would love to hear it.</p>
          <a href="mailto:support@bestemail.in?subject=Feature%20Suggestion" style={{ display: "inline-block", background: "#10b981", color: "white", padding: "12px 28px", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Send Suggestion</a>
        </div>
      </div>
    </div>
  )
}
