const React = require('react');
const e = React.createElement;
const { C } = require('../constants');
const Progress = require('./Progress');
const { tripSpent, pct, fmtDate, tripDays, barColor } = require('../utils');

function TripCard(props) {
  var trip  = props.trip;
  var spent = tripSpent(trip);
  var p     = pct(trip);
  var color = barColor(p, C);
  return e('div', { className: 'trip-card fade-up', onClick: props.onClick, style: { background: '#fff', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)', animationDelay: props.delay } },
    e('div', { style: { background: trip.color, padding: '1.5rem 1.5rem 1rem', position: 'relative', overflow: 'hidden' } },
      e('div', { style: { position: 'absolute', right: -10, top: -10, fontSize: 90, opacity: 0.12, pointerEvents: 'none' } }, trip.emoji),
      e('div', { style: { fontSize: 38 } }, trip.emoji),
      e('div', { style: { color: '#fff', fontWeight: 700, fontSize: 20, marginTop: 8, fontFamily: "'Playfair Display', serif", fontStyle: 'italic' } }, trip.name),
      e('div', { style: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 } }, '📍 ' + trip.destination)
    ),
    e('div', { style: { padding: '1.25rem 1.5rem' } },
      e('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: 13, color: C.ash } },
        e('span', null, '📅 ' + fmtDate(trip.startDate) + ' → ' + fmtDate(trip.endDate)),
        e('span', null, tripDays(trip) + ' days')
      ),
      e('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 } },
        e('span', { style: { fontWeight: 600 } }, '$' + spent.toLocaleString() + ' spent'),
        e('span', { style: { color: C.ash } }, '$' + trip.budget.toLocaleString() + ' budget')
      ),
      e(Progress, { value: p, color: color }),
      e('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: C.ash } },
        e('span', null, p + '% used'),
        e('span', null, '$' + (trip.budget - spent).toLocaleString() + ' left')
      )
    )
  );
}

module.exports = TripCard;
// Trip components
