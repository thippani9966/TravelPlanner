const React = require('react');
const e = React.createElement;
const { C } = require('../constants');

function Header(props) {
  return e('header', { style: { background: '#1A1208', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 20px rgba(0,0,0,0.3)' } },
    e('div', { style: { display: 'flex', alignItems: 'center', gap: '0.75rem' } },
      props.view === 'trip' && e('button', { onClick: props.onBack, style: { background: 'none', border: 'none', color: C.sand, cursor: 'pointer', fontSize: 20, padding: '4px 8px', borderRadius: 4 } }, '←'),
      e('span', { style: { fontSize: 22, fontWeight: 700, color: C.sand, letterSpacing: '0.05em', fontFamily: "'Playfair Display', serif" } }, '🌍 Voyage'),
      props.view === 'trip' && props.selectedTrip && e('span', { style: { color: C.ash, fontSize: 13, marginLeft: 6 } }, '/ ' + props.selectedTrip.emoji + ' ' + props.selectedTrip.name)
    ),
    e('div', { style: { display: 'flex', alignItems: 'center', gap: '0.75rem' } },
      [['dashboard', '📍 Trips'], ['report', '📊 Reports']].map(function(pair) {
        var active = props.view === pair[0];
        return e('button', { key: pair[0], onClick: function() { props.onNavChange(pair[0]); }, style: { background: active ? C.terra : 'none', border: '1px solid ' + (active ? C.terra : C.ash), color: active ? '#fff' : C.sand, cursor: 'pointer', padding: '6px 16px', borderRadius: 20, fontSize: 13, transition: 'all 0.2s' } }, pair[1]);
      }),
      e('div', { style: { width: 1, height: 28, background: 'rgba(255,255,255,0.15)', margin: '0 4px' } }),
      props.user && e('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
        e('div', { style: { width: 34, height: 34, borderRadius: '50%', background: C.terra, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, border: '2px solid rgba(255,255,255,0.2)' } }, props.user.avatar),
        e('div', null,
          e('div', { style: { color: C.sand, fontSize: 13, fontWeight: 600, lineHeight: 1.2 } }, props.user.name),
          e('div', { style: { color: C.ash, fontSize: 11 } }, '@' + props.user.username)
        )
      ),
      e('button', { onClick: props.onLogout, style: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: C.sand, cursor: 'pointer', padding: '6px 14px', borderRadius: 20, fontSize: 13, transition: 'all 0.2s' },
        onMouseEnter: function(ev) { ev.currentTarget.style.background = 'rgba(193,122,58,0.3)'; },
        onMouseLeave: function(ev) { ev.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }
      }, '⎋ Logout')
    )
  );
}

module.exports = Header;
