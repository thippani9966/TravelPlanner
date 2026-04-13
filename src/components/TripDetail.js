const React = require('react');
const e = React.createElement;
const { useState } = React;
const { C } = require('../constants');
const Progress      = require('./Progress');
const ItineraryTab  = require('./ItineraryTab');
const ExpensesTab   = require('./ExpensesTab');
const { tripSpent, pct, fmtDate, barColor } = require('../utils');

function TripDetail(props) {
  var trip         = props.trip;
  var onAddExpense = props.onAddExpense;
  var onAddDay     = props.onAddDay;

  var tabArr = useState('itinerary'); var tab = tabArr[0]; var setTab = tabArr[1];
  var spent  = tripSpent(trip);
  var p      = pct(trip);
  var color  = barColor(p, C);

  return e('div', { className:'fade-in' },
    // Hero banner
    e('div', { style:{ background:trip.color, borderRadius:20, padding:'2rem', marginBottom:'1.5rem', position:'relative', overflow:'hidden' } },
      e('div', { style:{ position:'absolute', right:20, top:-20, fontSize:150, opacity:0.09, pointerEvents:'none' } }, trip.emoji),
      e('div', { style:{ fontSize:50, marginBottom:8 } }, trip.emoji),
      e('h1', { style:{ margin:'0 0 4px', color:'#fff', fontSize:30, fontFamily:"'Playfair Display', serif", fontStyle:'italic' } }, trip.name),
      e('div', { style:{ color:'rgba(255,255,255,0.8)', fontSize:14 } }, '📍 ' + trip.destination + '  ·  📅 ' + fmtDate(trip.startDate) + ' → ' + fmtDate(trip.endDate)),
      e('div', { style:{ marginTop:'1.25rem', display:'flex', gap:'2.5rem', flexWrap:'wrap' } },
        [['Budget','$'+trip.budget.toLocaleString()],['Spent','$'+spent.toLocaleString()],['Remaining','$'+(trip.budget-spent).toLocaleString()]].map(function(pair) {
          return e('div', { key:pair[0] },
            e('div', { style:{ color:'rgba(255,255,255,0.65)', fontSize:11, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:2 } }, pair[0]),
            e('div', { style:{ color:'#fff', fontWeight:700, fontSize:22, fontFamily:"'Playfair Display', serif" } }, pair[1])
          );
        })
      ),
      e('div', { style:{ marginTop:'1rem' } }, e(Progress, { value:p, color:color }))
    ),

    // Tabs
    e('div', { style:{ display:'flex', gap:'0.5rem', marginBottom:'1.5rem' } },
      [['itinerary','🗓 Itinerary'],['expenses','💳 Expenses']].map(function(pair) {
        var active = tab === pair[0];
        return e('button', { key:pair[0], onClick:function(){ setTab(pair[0]); },
          style:{ background:active?'#1A1208':'#fff', color:active?'#fff':'#1A1208', border:'1px solid '+(active?'#1A1208':'#ddd'), borderRadius:24, padding:'8px 22px', cursor:'pointer', fontSize:14, fontWeight:600, transition:'all 0.2s' }
        }, pair[1]);
      })
    ),

    tab === 'itinerary'
      ? e(ItineraryTab, { trip:trip, onAddDay:onAddDay })
      : e(ExpensesTab,  { trip:trip, onAddExpense:onAddExpense })
  );
}

module.exports = TripDetail;
