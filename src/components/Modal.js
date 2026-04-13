const React = require('react');
const e = React.createElement;
const { C } = require('../constants');

function Modal(props) {
  return e('div', {
    style: { position: 'fixed', inset: 0, background: 'rgba(26,18,8,0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
    onClick: props.onClose
  },
    e('div', {
      className: 'fade-up',
      style: { background: '#fff', borderRadius: 20, padding: '2rem', maxWidth: 490, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.35)' },
      onClick: function(ev) { ev.stopPropagation(); }
    },
      e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' } },
        e('h3', { style: { margin: 0, fontSize: 20, fontFamily: "'Playfair Display', serif", fontStyle: 'italic' } }, props.title),
        e('button', { onClick: props.onClose, style: { background: C.smoke, border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16 } }, '✕')
      ),
      props.children
    )
  );
}

module.exports = Modal;
