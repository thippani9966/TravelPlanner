const React = require('react');
const e = React.createElement;
const { C } = require('../constants');

function StatCard(props) {
  return e('div', { className: 'fade-up', style: { background: '#fff', borderRadius: 16, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid rgba(193,122,58,0.12)', animationDelay: props.delay } },
    e('div', { style: { fontSize: 28, marginBottom: 8 } }, props.icon),
    e('div', { style: { fontSize: 26, fontWeight: 700, color: C.terra, fontFamily: "'Playfair Display', serif" } }, props.value),
    e('div', { style: { fontSize: 12, color: C.ash, marginTop: 2 } }, props.label + ' · ' + props.sub)
  );
}

module.exports = StatCard;
