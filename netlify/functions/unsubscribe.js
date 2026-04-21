// Redwood Digital unsubscribe endpoint.
//
// Handles two flows:
//   GET  /api/unsubscribe?e=<base64url-email>
//     → renders a confirmation page; user sees "You're unsubscribed." Logs the
//       email into the Netlify Forms "unsubscribes" form for Matt to review.
//   POST /api/unsubscribe (with List-Unsubscribe-Post=List-Unsubscribe=One-Click)
//     → Gmail's built-in "Unsubscribe" button. Returns 200, logs the email.
//
// The outreach sender should include BOTH forms in SMTP headers:
//   List-Unsubscribe: <https://www.redwooddigitalfrederick.com/api/unsubscribe?e=XYZ>,
//                    <mailto:matthew@redwooddigitalfrederick.com?subject=unsubscribe>
//   List-Unsubscribe-Post: List-Unsubscribe=One-Click
//
// And before sending, check the Netlify Forms "unsubscribes" submissions to
// filter any previously-opted-out addresses. Suppression list is maintained
// server-side in Netlify's UI (Site → Forms → unsubscribes).

const b64urlDecode = (s) => {
  try {
    const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
    return Buffer.from((s + pad).replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
  } catch { return null; }
};

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const isPlausibleEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

async function logSuppression(email, source) {
  // Submit to the hidden Netlify Form named "unsubscribes" so it shows up in
  // Netlify Forms. Free tier, no external dependency, Matt can export CSV.
  try {
    const body = new URLSearchParams({
      'form-name': 'unsubscribes',
      email,
      source,
      timestamp: new Date().toISOString(),
    }).toString();
    await fetch('https://www.redwooddigitalfrederick.com/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
  } catch (err) {
    console.error('Failed to log suppression to Netlify Forms:', err);
  }
}

function confirmationPage(email) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex">
<title>Unsubscribed · Redwood Digital</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%23b44a2d'/><text x='16' y='22' font-size='18' font-weight='bold' text-anchor='middle' fill='white'>R</text></svg>">
<style>
  html,body { margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; background:#f4eee2; color:#3d3a36; -webkit-font-smoothing:antialiased; }
  .wrap { max-width: 520px; margin: 14vh auto 0; padding: 40px 28px; background:#fbf7ef; border:1px solid #e8e4df; border-radius:16px; box-shadow: 0 1px 2px rgba(20,18,14,.04), 0 12px 40px rgba(20,18,14,.06); }
  .mark { display:inline-flex; align-items:center; gap:10px; font-weight:700; color:#1a1a1a; letter-spacing:-.018em; margin-bottom:26px; text-decoration:none; }
  .mark-sq { width:26px; height:26px; background:#b44a2d; border-radius:6px; color:#fff; font-weight:700; font-size:14px; line-height:26px; text-align:center; }
  .mark em { font-style:normal; color:#b44a2d; font-weight:700; }
  h1 { margin: 0 0 12px; font-size: 1.6rem; font-weight:800; letter-spacing:-.028em; color:#1a1a1a; line-height: 1.1; }
  .check {
    display:inline-flex; align-items:center; justify-content:center;
    width:44px; height:44px; border-radius:50%;
    background: rgba(32, 104, 80, 0.14);
    color: #206850; margin-bottom: 20px;
    box-shadow: inset 0 0 0 1px rgba(32,104,80,.24);
  }
  .check svg { width:22px; height:22px; }
  p { margin: 0 0 14px; line-height:1.6; font-size: 0.98rem; color:#3d3a36; }
  p.muted { color:#6a645a; font-size:.88rem; }
  code { background:#f4eee2; padding:2px 7px; border-radius:5px; font-size:.88em; font-family: ui-monospace, Menlo, monospace; color:#1a1a1a; }
  a.home { display:inline-block; margin-top:8px; padding:11px 22px; background: linear-gradient(180deg,#c2654a,#b44a2d 55%,#a3421f); color:#fff; border-radius:10px; text-decoration:none; font-size:.94rem; font-weight:600; box-shadow: inset 0 1px 0 rgba(255,255,255,.2), 0 1px 2px rgba(180,74,45,.3); transition: filter .2s, transform .2s; }
  a.home:hover { filter: brightness(1.06); transform: translateY(-1px); }
  footer { max-width: 520px; margin: 16px auto; padding: 0 16px; font-size:.78rem; color:#6a645a; text-align:center; line-height:1.5; }
  @media (max-width: 540px) { .wrap { margin: 8vh 12px 0; padding: 32px 22px; } }
</style>
</head>
<body>
  <main class="wrap">
    <a class="mark" href="/">
      <span class="mark-sq">R</span>
      <span>Redwood <em>Digital</em></span>
    </a>
    <div class="check" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    </div>
    <h1>You're unsubscribed.</h1>
    ${email ? `<p>We've removed <code>${escapeHtml(email)}</code> from the outreach list. You won't hear from us again.</p>` : `<p>You've been removed from the outreach list. You won't hear from us again.</p>`}
    <p class="muted">If you changed your mind later, just reply to any past email and Matthew will re-add you personally. No automated resubscribe.</p>
    <a class="home" href="/">Back to redwooddigitalfrederick.com</a>
  </main>
  <footer>
    Redwood Digital Frederick LLC · 3406B Keats Terrace · Ijamsville, MD 21754
  </footer>
</body>
</html>`;
}

export default async (req) => {
  const url = new URL(req.url);
  const raw = url.searchParams.get('e') || '';
  const decoded = raw ? b64urlDecode(raw) : '';
  const email = decoded && isPlausibleEmail(decoded.trim()) ? decoded.trim().toLowerCase() : '';

  // One-click POST (RFC 8058): Gmail's "Unsubscribe" button fires this.
  // Response must be 200 with no body content requirement.
  if (req.method === 'POST') {
    if (email) { await logSuppression(email, 'one-click-post'); }
    return new Response('', { status: 200 });
  }

  if (req.method === 'GET') {
    if (email) {
      await logSuppression(email, 'link-click');
    }
    return new Response(confirmationPage(email), {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  return new Response('Method not allowed', { status: 405 });
};

export const config = {
  path: '/api/unsubscribe',
};
