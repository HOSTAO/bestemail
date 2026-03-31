import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import StandardFooter from '@/components/StandardFooter';

export const metadata: Metadata = {
  title: 'Data Processing Agreement (DPA) | BestEmail',
  description: 'BestEmail Data Processing Agreement for business customers — GDPR, DPDPA, and international compliance.',
};

export default function DPAPage() {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#0B0F14',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      color: '#F9FAFB',
    }}>
      <Navigation />

      <main style={{ flex: 1, maxWidth: 860, margin: '0 auto', padding: '80px 24px 60px', width: '100%' }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8, color: '#ffffff' }}>Data Processing Agreement</h1>
        <p style={{ color: '#9CA3AF', marginBottom: 40, fontSize: 14 }}>Last updated: March 2026 — Hostao LLC</p>

        <div style={{
          background: '#111827',
          border: '1px solid #4F46E5',
          borderRadius: 12,
          padding: '20px 24px',
          marginBottom: 40,
        }}>
          <p style={{ margin: 0, color: '#EEF2FF', fontSize: 14 }}>
            <strong>📋 Note:</strong> This Data Processing Agreement (&quot;DPA&quot;) is entered into between Hostao LLC (&quot;Data Processor&quot;) and the Customer (&quot;Data Controller&quot;) and is incorporated by reference into the BestEmail Terms of Service. By using BestEmail, you agree to the terms of this DPA.
          </p>
        </div>

        <div style={{ lineHeight: 1.8, color: '#D1D5DB' }}>

          <h2 style={{ color: '#ffffff', fontSize: 22, marginTop: 40, marginBottom: 12 }}>1. Definitions</h2>
          <ul>
            <li><strong>&quot;Controller&quot;</strong> means the Customer (you), who determines the purposes and means of processing personal data.</li>
            <li><strong>&quot;Processor&quot;</strong> means Hostao LLC, which processes personal data on behalf of the Controller.</li>
            <li><strong>&quot;Personal Data&quot;</strong> means any information relating to an identified or identifiable natural person as defined under applicable data protection laws including GDPR, DPDPA 2023, and CCPA.</li>
            <li><strong>&quot;Processing&quot;</strong> means any operation or set of operations performed on personal data (collection, storage, use, disclosure, erasure, etc.).</li>
            <li><strong>&quot;Sub-processor&quot;</strong> means any third party engaged by Hostao LLC to process personal data on behalf of the Controller.</li>
          </ul>

          <h2 style={{ color: '#ffffff', fontSize: 22, marginTop: 40, marginBottom: 12 }}>2. Scope and Purpose</h2>
          <p>This DPA applies to the processing of personal data by Hostao LLC in connection with the provision of BestEmail services. Hostao LLC will process personal data only:</p>
          <ul>
            <li>For the purpose of providing the BestEmail email marketing platform</li>
            <li>In accordance with the Customer&apos;s documented instructions</li>
            <li>As necessary to comply with applicable law</li>
          </ul>

          <h2 style={{ color: '#ffffff', fontSize: 22, marginTop: 40, marginBottom: 12 }}>3. Nature of Personal Data Processed</h2>
          <p>The personal data processed under this DPA may include:</p>
          <ul>
            <li>Email addresses and contact information of your subscribers</li>
            <li>Names, phone numbers, and demographic data you upload</li>
            <li>Email engagement data (opens, clicks, bounces)</li>
            <li>IP addresses and device information for tracking purposes</li>
            <li>Custom fields and tags you add to subscriber profiles</li>
          </ul>

          <h2 style={{ color: '#ffffff', fontSize: 22, marginTop: 40, marginBottom: 12 }}>4. Processor Obligations</h2>
          <p>Hostao LLC shall:</p>
          <ul>
            <li>Process personal data only on documented instructions from the Controller</li>
            <li>Ensure that persons authorised to process data are bound by confidentiality obligations</li>
            <li>Implement appropriate technical and organisational security measures (Article 32 GDPR / Section 8 DPDPA)</li>
            <li>Not engage sub-processors without prior written authorisation from the Controller</li>
            <li>Assist the Controller in responding to data subject requests (access, erasure, portability, rectification)</li>
            <li>Notify the Controller of any personal data breach without undue delay and within 72 hours where feasible</li>
            <li>Delete or return all personal data upon termination of services</li>
            <li>Provide all information necessary to demonstrate compliance with this DPA</li>
          </ul>

          <h2 style={{ color: '#ffffff', fontSize: 22, marginTop: 40, marginBottom: 12 }}>5. Controller Obligations</h2>
          <p>The Customer (Controller) agrees to:</p>
          <ul>
            <li>Have a lawful basis for collecting and processing subscriber personal data</li>
            <li>Obtain necessary consents from data subjects before uploading data to BestEmail</li>
            <li>Ensure that your use of BestEmail complies with all applicable laws including CAN-SPAM, GDPR, DPDPA 2023</li>
            <li>Not upload sensitive personal data (health, financial, biometric) without explicit consent</li>
          </ul>

          <h2 style={{ color: '#ffffff', fontSize: 22, marginTop: 40, marginBottom: 12 }}>6. Sub-Processors</h2>
          <p>Hostao LLC currently uses the following categories of sub-processors:</p>
          <ul>
            <li><strong>Cloud Infrastructure:</strong> AWS / Supabase (data storage and compute)</li>
            <li><strong>Email Delivery:</strong> SMTP providers for email dispatch</li>
            <li><strong>Analytics:</strong> Privacy-friendly analytics tools (no personal data shared)</li>
            <li><strong>Payment Processing:</strong> Stripe / Razorpay (no subscriber data shared)</li>
          </ul>
          <p>We will notify you of any changes to sub-processors with at least 14 days&apos; notice.</p>

          <h2 style={{ color: '#ffffff', fontSize: 22, marginTop: 40, marginBottom: 12 }}>7. Security Measures</h2>
          <p>Hostao LLC implements the following security measures:</p>
          <ul>
            <li>Encryption of data in transit (TLS 1.2+) and at rest (AES-256)</li>
            <li>Access controls and role-based permissions</li>
            <li>Regular security assessments and penetration testing</li>
            <li>SOC 2-aligned operational security practices</li>
            <li>Incident response procedures</li>
          </ul>

          <h2 style={{ color: '#ffffff', fontSize: 22, marginTop: 40, marginBottom: 12 }}>8. International Data Transfers</h2>
          <p>BestEmail is operated by Hostao LLC, a US company. Data may be processed in the United States. For transfers from the EU/EEA, UK, or India, we rely on appropriate safeguards including Standard Contractual Clauses (SCCs) where required. By using BestEmail from these jurisdictions, you consent to this transfer.</p>

          <h2 style={{ color: '#ffffff', fontSize: 22, marginTop: 40, marginBottom: 12 }}>9. Compliance with Indian DPDPA 2023</h2>
          <p>For Indian customers, Hostao LLC acknowledges its obligations under the Digital Personal Data Protection Act 2023:</p>
          <ul>
            <li>We will act as a &quot;Data Fiduciary&quot; with respect to your account data and as a &quot;Data Processor&quot; for your subscriber data</li>
            <li>We maintain a Grievance Officer for Indian data principals</li>
            <li>Grievance Officer: <a href="mailto:grievance@bestemail.in" style={{ color: '#818CF8' }}>grievance@bestemail.in</a></li>
          </ul>

          <h2 style={{ color: '#ffffff', fontSize: 22, marginTop: 40, marginBottom: 12 }}>10. Term and Termination</h2>
          <p>This DPA is effective for the duration of your BestEmail subscription. Upon termination, Hostao LLC will delete your personal data within 90 days unless retention is required by law.</p>

          <h2 style={{ color: '#ffffff', fontSize: 22, marginTop: 40, marginBottom: 12 }}>11. Governing Law</h2>
          <p>This DPA is governed by the laws of the State of Wyoming, USA, consistent with the BestEmail Terms of Service.</p>

          <h2 style={{ color: '#ffffff', fontSize: 22, marginTop: 40, marginBottom: 12 }}>12. Contact</h2>
          <div style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: 12, padding: '20px 24px', marginTop: 12 }}>
            <p style={{ margin: 0 }}><strong style={{ color: '#ffffff' }}>Hostao LLC — Data Protection</strong></p>
            <p style={{ margin: '4px 0' }}>30 N Gould St, Ste 4000, Sheridan, Wyoming 82801, USA</p>
            <p style={{ margin: '4px 0' }}>Email: <a href="mailto:privacy@bestemail.in" style={{ color: '#818CF8' }}>privacy@bestemail.in</a></p>
            <p style={{ margin: '4px 0' }}>DPA Requests: <a href="mailto:dpa@bestemail.in" style={{ color: '#818CF8' }}>dpa@bestemail.in</a></p>
          </div>
        </div>
      </main>

      <StandardFooter />
    </div>
  );
}
