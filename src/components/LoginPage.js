const React = require('react');
const e = React.createElement;
const { useState } = React;
const { C } = require('../constants');
const { login } = require('../auth');

function LoginPage(props) {
  var usernameArr = useState(''); var username = usernameArr[0]; var setUsername = usernameArr[1];
  var passwordArr = useState(''); var password = passwordArr[0]; var setPassword = passwordArr[1];
  var errorArr    = useState(''); var error    = errorArr[0];    var setError    = errorArr[1];
  var loadingArr  = useState(false); var loading = loadingArr[0]; var setLoading = loadingArr[1];
  var showArr     = useState(false); var show    = showArr[0];    var setShow    = showArr[1];

  function handleSubmit() {
    setError(''); setLoading(true);
    setTimeout(function() {
      var r = login(username, password);
      setLoading(false);
      if (r.success) props.onLogin(r.user);
      else setError(r.error);
    }, 600);
  }
  function onKey(ev) { if (ev.key === 'Enter') handleSubmit(); }

  var inp = { width: '100%', borderRadius: 10, border: '1px solid #ddd', padding: '12px 14px', fontSize: 14, outline: 'none', fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box', transition: 'border-color 0.2s' };
  var onF = function(ev) { ev.target.style.borderColor = C.terra; ev.target.style.boxShadow = '0 0 0 3px rgba(193,122,58,0.12)'; };
  var onB = function(ev) { ev.target.style.borderColor = '#ddd'; ev.target.style.boxShadow = 'none'; };

  return e('div', { style: { minHeight: '100vh', background: '#1A1208', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', position: 'relative', overflow: 'hidden' } },
    e('div', { style: { position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(193,122,58,0.12)', top: -100, right: -100 } }),
    e('div', { style: { position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(27,79,114,0.15)', bottom: -80, left: -80 } }),
    e('div', { className: 'fade-up', style: { background: '#fff', borderRadius: 24, padding: '2.5rem', maxWidth: 420, width: '100%', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' } },
      e('div', { style: { textAlign: 'center', marginBottom: '2rem' } },
        e('div', { style: { fontSize: 48, marginBottom: 8 } }, '🌍'),
        e('h1', { style: { fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 32, margin: 0, color: '#1A1208' } }, 'Voyage'),
        e('p',  { style: { color: C.ash, fontSize: 14, marginTop: 6 } }, 'Sign in to your travel account')
      ),
      error && e('div', { style: { background: '#fef0f0', border: '1px solid #fcc', borderRadius: 10, padding: '10px 14px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 } },
        e('span', { style: { fontSize: 16 } }, '⚠️'),
        e('span', { style: { fontSize: 13, color: '#c0392b' } }, error)
      ),
      e('div', { style: { marginBottom: '1rem' } },
        e('label', { style: { display: 'block', fontSize: 12, color: C.ash, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' } }, 'Username'),
        e('input', { type: 'text', value: username, placeholder: 'Enter your username', onChange: function(ev) { setUsername(ev.target.value); }, onKeyDown: onKey, style: inp, onFocus: onF, onBlur: onB })
      ),
      e('div', { style: { marginBottom: '1.5rem' } },
        e('label', { style: { display: 'block', fontSize: 12, color: C.ash, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' } }, 'Password'),
        e('div', { style: { position: 'relative' } },
          e('input', { type: show ? 'text' : 'password', value: password, placeholder: 'Enter your password', onChange: function(ev) { setPassword(ev.target.value); }, onKeyDown: onKey, style: Object.assign({}, inp, { paddingRight: 44 }), onFocus: onF, onBlur: onB }),
          e('button', { onClick: function() { setShow(!show); }, style: { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: C.ash } }, show ? '🙈' : '👁️')
        )
      ),
      e('button', { onClick: handleSubmit, disabled: loading, className: 'btn-hover', style: { width: '100%', background: loading ? C.ash : C.terra, color: '#fff', border: 'none', borderRadius: 12, padding: '14px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 600, marginBottom: '1rem' } },
        loading ? '⏳ Signing in…' : '✈️  Sign In'
      ),
      e('div', { style: { display: 'flex', alignItems: 'center', gap: 12, margin: '1rem 0', color: C.ash, fontSize: 13 } },
        e('div', { style: { flex: 1, height: 1, background: '#e8e0d4' } }),
        e('span', null, 'New here?'),
        e('div', { style: { flex: 1, height: 1, background: '#e8e0d4' } })
      ),
      e('button', { onClick: props.onGoSignup, style: { width: '100%', background: 'none', border: '1.5px solid ' + C.terra, color: C.terra, borderRadius: 12, padding: '13px', cursor: 'pointer', fontSize: 15, fontWeight: 600 },
        onMouseEnter: function(ev) { ev.target.style.background = C.terra; ev.target.style.color = '#fff'; },
        onMouseLeave: function(ev) { ev.target.style.background = 'none'; ev.target.style.color = C.terra; }
      }, '🗺️  Create Account')
    )
  );
}

module.exports = LoginPage;
