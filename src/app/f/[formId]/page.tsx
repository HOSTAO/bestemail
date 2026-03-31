'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type FormField = {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
};

type FormConfig = {
  id: string;
  name: string;
  type: string;
  fields: FormField[];
  successMessage: string;
  redirectUrl: string;
};

export default function PublicFormPage() {
  const params = useParams();
  const formId = params.formId as string;

  const [form, setForm] = useState<FormConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!formId) return;

    fetch(`/api/forms/public/${formId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Form not found');
        return res.json();
      })
      .then((data) => {
        setForm(data);
        const initialValues: Record<string, string> = {};
        (data.fields || []).forEach((f: FormField) => {
          initialValues[f.name] = '';
        });
        setFormValues(initialValues);
      })
      .catch(() => {
        setError('This form is not available.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [formId]);

  const handleChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form) return;

    // Validate required fields
    const errors: Record<string, string> = {};
    form.fields.forEach((f) => {
      if (f.required && !formValues[f.name]?.trim()) {
        errors[f.name] = `${f.label} is required`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/forms/${formId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setSuccessMsg(data.message || form.successMessage || 'Thank you for signing up!');

        if (data.redirect_url) {
          setTimeout(() => {
            window.location.href = data.redirect_url;
          }, 1500);
        }
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
        setTimeout(() => setError(''), 4000);
      }
    } catch {
      setError('Network error. Please try again.');
      setTimeout(() => setError(''), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #F8F9FF 0%, #E0F7FA 50%, #E0F7FA 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
      }}>
        <div style={{ color: '#8b8ba7', fontSize: 16 }}>Loading...</div>
      </div>
    );
  }

  if (!form || (error && !submitted)) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #F8F9FF 0%, #E0F7FA 50%, #E0F7FA 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #E0F7FA',
          padding: '48px 32px',
          maxWidth: 440,
          width: '90%',
          textAlign: 'center' as const,
          boxShadow: '0 4px 24px rgba(0,180,216,0.08)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>404</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px' }}>
            Form Not Available
          </h1>
          <p style={{ color: '#8b8ba7', fontSize: 14, margin: 0 }}>
            {error || 'This form does not exist or is no longer accepting submissions.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      background: 'linear-gradient(135deg, #F8F9FF 0%, #E0F7FA 50%, #E0F7FA 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        border: '1px solid #E0F7FA',
        padding: '40px 32px',
        maxWidth: 480,
        width: '100%',
        boxShadow: '0 4px 24px rgba(0,180,216,0.08)',
      }}>
        {submitted ? (
          <div style={{ textAlign: 'center' as const, padding: '24px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#10003;</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px' }}>
              Success!
            </h2>
            <p style={{ color: '#64648b', fontSize: 15, margin: 0 }}>
              {successMsg}
            </p>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e', margin: '0 0 6px', textAlign: 'center' as const }}>
              {form.name}
            </h1>
            <p style={{ color: '#8b8ba7', fontSize: 14, textAlign: 'center' as const, margin: '0 0 28px' }}>
              Fill in the details below to get started.
            </p>

            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 8,
                padding: '10px 14px',
                marginBottom: 16,
                color: '#dc2626',
                fontSize: 13,
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {form.fields.map((field) => (
                <div key={field.name} style={{ marginBottom: 16 }}>
                  <label style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#1a1a2e',
                    marginBottom: 4,
                  }}>
                    {field.label}{field.required ? ' *' : ''}
                  </label>
                  {field.type === 'select' && field.options ? (
                    <select
                      value={formValues[field.name] || ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: fieldErrors[field.name] ? '1px solid #dc2626' : '1px solid #E0F7FA',
                        fontSize: 14,
                        boxSizing: 'border-box' as const,
                        outline: 'none',
                        background: '#fff',
                        color: '#1a1a2e',
                      }}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type === 'email' ? 'email' : 'text'}
                      placeholder={field.label}
                      value={formValues[field.name] || ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      required={field.required}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: fieldErrors[field.name] ? '1px solid #dc2626' : '1px solid #E0F7FA',
                        fontSize: 14,
                        boxSizing: 'border-box' as const,
                        outline: 'none',
                        color: '#1a1a2e',
                      }}
                    />
                  )}
                  {fieldErrors[field.name] && (
                    <div style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>
                      {fieldErrors[field.name]}
                    </div>
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  borderRadius: 10,
                  background: submitting ? '#a78bfa' : '#00B4D8',
                  color: '#fff',
                  border: 'none',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  marginTop: 4,
                }}
              >
                {submitting ? 'Submitting...' : 'Subscribe'}
              </button>
            </form>
          </>
        )}

        <div style={{ textAlign: 'center' as const, marginTop: 24 }}>
          <span style={{ color: '#c4c4d4', fontSize: 11 }}>
            Powered by BestEmail
          </span>
        </div>
      </div>
    </div>
  );
}
