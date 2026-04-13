const React = require('react');
const e = React.createElement;
const { useState } = React;
const { C } = require('../constants');
const { signup } = require('../auth');

function strength(p) {
  if (!p) return { level: 0, label: '', color: 'transparent' };
  var s = 0;
  if (p.length >= 6)  s++;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  if (s <= 1) return { level: s, label: 'Weak',   color: C.coral };
  if (s <= 3) return { level: s, label: 'Fair',   color: C.gold };
  return             { level: s, label: 'Strong', color: C.mint };
}

function SignupPage(props) {
  var nameArr    = useState(''); var name    = nameArr[0];    var setName    = nameArr[1];
  var userArr    = useState(''); var user    = userArr[0];    var setUser    = userArr[1];
  var passArr    = useState(''); var pass    = passArr[0];    var setPass    = passArr[1];
  var confArr    = useState(''); var conf    = confArr[0];    var setConf    = confArr[1];
  var errorArr   = useState(''); var error   = errorArr[0];   var setError   = errorArr[1];
  var loadArr    = useState(false); var load  = loadArr[0];   var setLoad    = loadArr[1];
  var showArr    = useState(false); var show  = showArr[0];   var setShow    = showArr[1];
  var str = strength(pass);

  function handleSubmit() {
    setError('');
    if (pass !== conf) { setError('Passwords do not match.'); return; }
    setLoad(true);
    setTimeout(function() {
      var r = signup(name, user, pass);
      setLoad(false);
      if (r.success) props.onSignup(r.user);
      else setError(r.error);
    }, 600);
  }
  function onKey(ev) { if (ev.key === 'Enter') handleSubmit(); }

  var inp = { width: '100%', borderRadius: 10, border: '1px solid #ddd', padding: '12px 14px', fontSize: 14, outline: 'none', fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box', transition: 'border-color 0.2s', display: 'block' };
  var onF = function(ev) { ev.target.style.borderColor = C.terra; ev.target.style.boxShadow = '0 0 0 3px rgba(193,122,58,0.12)'; };
  var onB = function(ev) { ev.target.style.borderColor = '#ddd'; ev.target.style.boxShadow = 'none'; };
  var lbl = { display: 'block', fontSize: 12, color: C.ash, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' };

  return e('div', { style: { minHeight: '100vh', background: '#1A1208', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', position: 'relative', overflow: 'hidden' } },
    e('div', { style: { position: 'absolute', width: 350, height: 350, borderRadius: '50%', background: 'rgba(27,79,114,0.15)', top: -80, left: -80 } }),
    e('div', { style: { position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(193,122,58,0.1)', bottom: -100, right: -100 } }),
    e('div', { className: 'fade-up', style: { background: '#fff', borderRadius: 24, padding: '2.5rem', maxWidth: 440, width: '100%', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' } },
      e('div', { style: { textAlign: 'center', marginBottom: '2rem' } },
        e('div', { style: { fontSize: 48, marginBottom: 8 } }, '🌍'),
        e('h1', { style: { fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 30, margin: 0, color: '#1A1208' } }, 'Join Voyage'),
        e('p',  { style: { color: C.ash, fontSize: 14, marginTop: 6 } }, 'Create your free travel account')
      ),
      error && e('div', { style: { background: '#fef0f0', border: '1px solid #fcc', borderRadius: 10, padding: '10px 14px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 } },
        e('span', { style: { fontSize: 16 } }, '⚠️'), e('span', { style: { fontSize: 13, color: '#c0392b' } }, error)
      ),
      e('div', { style: { marginBottom: '1rem' } }, e('label', { style: lbl }, 'Full Name'),    e('input', { type: 'text',     value: name, placeholder: 'e.g. Alex Rivera',  onChange: function(ev){setName(ev.target.value);},    onKeyDown: onKey, style: inp, onFocus: onF, onBlur: onB })),
      e('div', { style: { marginBottom: '1rem' } }, e('label', { style: lbl }, 'Username'),    e('input', { type: 'text',     value: user, placeholder: 'e.g. alexrivera',   onChange: function(ev){setUser(ev.target.value);},    onKeyDown: onKey, style: inp, onFocus: onF, onBlur: onB })),
      e('div', { style: { marginBottom: '0.5rem' } },
        e('label', { style: lbl }, 'Password'),
        e('div', { style: { position: 'relative' } },
          e('input', { type: show ? 'text' : 'password', value: pass, placeholder: 'Min. 6 characters', onChange: function(ev){setPass(ev.target.value);}, onKeyDown: onKey, style: Object.assign({}, inp, { paddingRight: 44 }), onFocus: onF, onBlur: onB }),
          e('button', { onClick: function(){setShow(!show);}, style: { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: C.ash } }, show ? '🙈' : '👁️')
        )
      ),
      pass && e('div', { style: { marginBottom: '1rem' } },
        e('div', { style: { display: 'flex', gap: 4, marginBottom: 4 } },
          [1,2,3,4,5].map(function(i) { return e('div', { key: i, style: { flex: 1, height: 4, borderRadius: 4, background: i <= str.level ? str.color : '#e8e0d4', transition: 'background 0.3s' } }); })
        ),
        e('div', { style: { fontSize: 11, color: str.color, fontWeight: 600 } }, str.label)
      ),
      e('div', { style: { marginBottom: '1.5rem' } },
        e('label', { style: lbl }, 'Confirm Password'),
        e('input', { type: 'password', value: conf, placeholder: 'Re-enter your password', onChange: function(ev){setConf(ev.target.value);}, onKeyDown: onKey, style: Object.assign({}, inp, { borderColor: conf && conf !== pass ? C.coral : '#ddd' }), onFocus: onF, onBlur: onB }),
        conf && conf !== pass && e('div', { style: { fontSize: 12, color: C.coral, marginTop: 4 } }, '⚠ Passwords do not match')
      ),
      e('button', { onClick: handleSubmit, disabled: load, className: 'btn-hover', style: { width: '100%', background: load ? C.ash : C.terra, color: '#fff', border: 'none', borderRadius: 12, padding: '14px', cursor: load ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 600, marginBottom: '1rem' } },
        load ? '⏳ Creating account…' : '🚀  Create Account'
      ),
      e('div', { style: { display: 'flex', alignItems: 'center', gap: 12, margin: '1rem 0', color: C.ash, fontSize: 13 } },
        e('div', { style: { flex: 1, height: 1, background: '#e8e0d4' } }), e('span', null, 'Have an account?'), e('div', { style: { flex: 1, height: 1, background: '#e8e0d4' } })
      ),
      e('button', { onClick: props.onGoLogin, style: { width: '100%', background: 'none', border: '1.5px solid ' + C.terra, color: C.terra, borderRadius: 12, padding: '13px', cursor: 'pointer', fontSize: 15, fontWeight: 600 },
        onMouseEnter: function(ev){ev.target.style.background=C.terra;ev.target.style.color='#fff';},
        onMouseLeave: function(ev){ev.target.style.background='none';ev.target.style.color=C.terra;}
      }, '✈️  Sign In Instead')
    )
  );
}

module.exports = SignupPage;
