import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ formId: string }> }
) {
  try {
    const params = await context.params;
    const rawParam = params['formId'] || '';
    const formId = rawParam.replace(/\.js$/, '');

    if (!formId || !supabaseAdmin) {
      return new NextResponse('console.error("BestEmail: Form not found");', {
        headers: { 'Content-Type': 'application/javascript', 'Cache-Control': 'public, max-age=300' },
      });
    }

    const { data: form } = await supabaseAdmin
      .from('forms')
      .select('*')
      .eq('id', formId)
      .maybeSingle();

    if (!form) {
      return new NextResponse('console.error("BestEmail: Form not found");', {
        headers: { 'Content-Type': 'application/javascript', 'Cache-Control': 'public, max-age=60' },
      });
    }

    const status = form.status || form.settings?.status || 'draft';
    if (status !== 'active') {
      return new NextResponse('console.error("BestEmail: Form is not active");', {
        headers: { 'Content-Type': 'application/javascript', 'Cache-Control': 'public, max-age=60' },
      });
    }

    const settings = form.settings || {};
    const fields: Array<{ name: string; label: string; type: string; required: boolean }> = Array.isArray(form.fields) ? form.fields : [
      { name: 'email', label: 'Email', type: 'email', required: true },
    ];
    const formName = (form.name || 'Subscribe').replace(/'/g, "\\'").replace(/"/g, '\\"');
    const successMessage = (settings.success_message || 'Thanks for signing up!').replace(/'/g, "\\'").replace(/"/g, '\\"');
    const redirectUrl = (settings.redirect_url || '').replace(/'/g, "\\'").replace(/"/g, '\\"');
    const stylePreset = settings.style_preset || 'minimal_white';

    // Build style variables based on preset
    let bgColor = '#ffffff';
    let textColor = '#1a1a2e';
    let inputBg = '#f8f9ff';
    let inputBorder = '#E0F7FA';
    let btnBg = '#00B4D8';
    let btnText = '#ffffff';
    let borderColor = '#E0F7FA';

    if (stylePreset === 'dark') {
      bgColor = '#1a1a2e';
      textColor = '#ffffff';
      inputBg = '#2a2a4e';
      inputBorder = '#3a3a5e';
      btnBg = '#00B4D8';
      btnText = '#ffffff';
      borderColor = '#3a3a5e';
    } else if (stylePreset === 'full_width') {
      bgColor = '#F8F9FF';
      borderColor = 'transparent';
    }

    // Build field HTML
    const fieldInputs = fields.map((f) => {
      const escapedLabel = f.label.replace(/'/g, "\\'").replace(/"/g, '\\"');
      const escapedName = f.name.replace(/'/g, "\\'").replace(/"/g, '\\"');
      const inputType = f.type === 'email' ? 'email' : 'text';
      const required = f.required ? 'required' : '';
      return `
        '<div style="margin-bottom:12px;">' +
        '<label style="display:block;font-size:13px;font-weight:600;color:${textColor};margin-bottom:4px;">${escapedLabel}${f.required ? " *" : ""}</label>' +
        '<input type="${inputType}" name="${escapedName}" placeholder="${escapedLabel}" ${required} ' +
        'style="width:100%;padding:10px 14px;border-radius:8px;border:1px solid ${inputBorder};background:${inputBg};color:${textColor};font-size:14px;box-sizing:border-box;outline:none;" />' +
        '</div>'`;
    }).join(' +\n        ');

    const js = `(function() {
  var containerId = 'bestemail-${formId}';
  var container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.currentScript.parentNode.insertBefore(container, document.currentScript.nextSibling);
  }

  var formHtml =
    '<div style="background:${bgColor};border:1px solid ${borderColor};border-radius:16px;padding:24px;max-width:480px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;">' +
    '<h3 style="margin:0 0 16px;font-size:18px;font-weight:700;color:${textColor};">${formName}</h3>' +
    '<form id="bestemail-form-${formId}">' +
    ${fieldInputs} +
    '<button type="submit" style="width:100%;padding:12px;background:${btnBg};color:${btnText};border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;margin-top:4px;">Subscribe</button>' +
    '</form>' +
    '<div id="bestemail-msg-${formId}" style="display:none;padding:16px;text-align:center;color:${textColor};font-size:14px;"></div>' +
    '</div>';

  container.innerHTML = formHtml;

  var form = document.getElementById('bestemail-form-${formId}');
  var msg = document.getElementById('bestemail-msg-${formId}');

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var formData = new FormData(form);
      var payload = {};
      formData.forEach(function(value, key) {
        payload[key] = value;
      });

      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Submitting...';
      }

      fetch('${request.nextUrl.origin}/api/forms/${formId}/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.success) {
          form.style.display = 'none';
          msg.style.display = 'block';
          msg.textContent = data.message || '${successMessage}';
          var redirectUrl = data.redirect_url || '${redirectUrl}';
          if (redirectUrl) {
            setTimeout(function() { window.location.href = redirectUrl; }, 1500);
          }
        } else {
          if (btn) {
            btn.disabled = false;
            btn.textContent = 'Subscribe';
          }
          msg.style.display = 'block';
          msg.style.color = '#e53e3e';
          msg.textContent = data.error || 'Something went wrong. Please try again.';
          setTimeout(function() { msg.style.display = 'none'; msg.style.color = '${textColor}'; }, 3000);
        }
      })
      .catch(function() {
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Subscribe';
        }
        msg.style.display = 'block';
        msg.style.color = '#e53e3e';
        msg.textContent = 'Subscription temporarily unavailable. Please try again later.';
        setTimeout(function() { msg.style.display = 'none'; msg.style.color = '${textColor}'; }, 3000);
      });
    });
  }
})();`;

    return new NextResponse(js, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=300',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Embed script error:', error);
    return new NextResponse('console.error("BestEmail: Failed to load form");', {
      headers: { 'Content-Type': 'application/javascript' },
    });
  }
}
