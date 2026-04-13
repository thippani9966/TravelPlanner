const React = require('react');
const e = React.createElement;
const { useState } = React;
const { C, CAT_ICONS } = require('../constants');
const Progress = require('./Progress');
const { tripSpent, pct, catTotals, barColor } = require('../utils');
const { generateTripSummary } = require('../ai');

function TripSummaryCard(props) {
  var trip  = props.trip;
  var spent = tripSpent(trip);
  var cats  = catTotals(trip);
  var p     = pct(trip);
  var color = barColor(p, C);

  var sumArr  = useState('');    var summary = sumArr[0];  var setSummary = sumArr[1];
  var loadArr = useState(false); var loading = loadArr[0]; var setLoading = loadArr[1];

  function handleGenerate() {
    setLoading(true);
    generateTripSummary(trip, spent, trip.budget, cats)
      .then(function(text){ setSummary(text); })
      .catch(function(err){ setSummary('Error: '+(err&&err.message?err.message:'Could not generate summary. Check your API key in .env file.')); setLoading(false); })
      .then(function(){ setLoading(false); });
  }

  return e('div', { className:'fade-up', style:{ background:'#fff', borderRadius:20, overflow:'hidden', boxShadow:'0 2px 16px rgba(0,0,0,0.07)' } },
    // Header
    e('div', { style:{ background:trip.color, padding:'1.25rem 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between' } },
      e('div', { style:{ color:'#fff' } },
        e('span', { style:{ fontSize:20 } }, trip.emoji),
        e('span', { style:{ fontFamily:"'Playfair Display', serif", fontStyle:'italic', fontWeight:700, fontSize:18, marginLeft:10 } }, trip.name),
        e('span', { style:{ opacity:0.75, fontSize:13, marginLeft:8 } }, '· ' + trip.destination)
      ),
      e('div', { style:{ color:'#fff', textAlign:'right' } },
        e('div', { style:{ fontWeight:700, fontSize:20, fontFamily:"'Playfair Display', serif" } }, '$' + spent.toLocaleString()),
        e('div', { style:{ opacity:0.75, fontSize:12 } }, 'of $' + trip.budget.toLocaleString())
      )
    ),
    // Body
    e('div', { style:{ padding:'1.25rem 1.5rem' } },
      e('div', { style:{ marginBottom:'1rem' } }, e(Progress, { value:p, color:color })),
      cats.length === 0
        ? e('div', { style:{ color:C.ash, fontSize:14 } }, 'No expenses yet.')
        : e('div', { style:{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:'0.75rem', marginBottom:'1rem' } },
            cats.map(function(entry) {
              var cat = entry[0]; var amt = entry[1];
              return e('div', { key:cat, style:{ background:C.smoke, borderRadius:12, padding:'0.75rem 1rem' } },
                e('div', { style:{ fontSize:20, marginBottom:4 } }, CAT_ICONS[cat]||'💳'),
                e('div', { style:{ fontWeight:700, fontSize:16, fontFamily:"'Playfair Display', serif" } }, '$' + amt.toLocaleString()),
                e('div', { style:{ color:C.ash, fontSize:12 } }, cat)
              );
            })
          ),
      // AI Summary section
      e('div', { style:{ borderTop:'1px solid '+C.smoke, paddingTop:'1rem' } },
        summary
          ? e('div', { style:{ background:'#f0f6ff', border:'1px solid #c8d8f0', borderRadius:10, padding:'12px 14px' } },
              e('div', { style:{ display:'flex', alignItems:'center', gap:6, marginBottom:8 } },
                e('span', { style:{ fontSize:16 } }, '🤖'),
                e('span', { style:{ fontSize:12, fontWeight:700, color:C.ocean } }, 'AI Trip Summary')
              ),
              e('p', { style:{ fontSize:13, lineHeight:1.7, color:C.deep, margin:0 } }, summary),
              e('button', { onClick:function(){ setSummary(''); }, style:{ marginTop:8, background:'none', border:'none', color:C.ash, fontSize:11, cursor:'pointer', padding:0 } }, 'Regenerate')
            )
          : e('button', { onClick:handleGenerate, disabled:loading || cats.length === 0,
              style:{ background:'none', border:'1px dashed '+(cats.length===0?'#ddd':C.ocean), color:cats.length===0?C.ash:C.ocean, borderRadius:10, padding:'10px 16px', cursor:cats.length===0?'default':'pointer', fontSize:13, fontWeight:600, width:'100%', transition:'all 0.2s' }
            }, loading ? '⏳ Generating AI summary…' : '🤖 Generate AI Trip Summary')
      )
    )
  );
}

function ReportsView(props) {
  var trips       = props.trips;
  var totalBudget = trips.reduce(function(s,t){ return s+t.budget; }, 0);
  var totalSpent  = trips.reduce(function(s,t){ return s+tripSpent(t); }, 0);
  var overallPct  = totalBudget > 0 ? Math.min(100, Math.round((totalSpent/totalBudget)*100)) : 0;

  return e('div', { className:'fade-in' },
    e('h2', { style:{ fontFamily:"'Playfair Display', serif", fontStyle:'italic', fontSize:26, marginBottom:'1.5rem' } }, '📊 Expense Reports'),
    // Overall summary bar
    e('div', { style:{ background:'#fff', borderRadius:16, padding:'1.5rem', marginBottom:'1.5rem', boxShadow:'0 2px 12px rgba(0,0,0,0.07)' } },
      e('div', { style:{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:14 } },
        e('span', { style:{ fontWeight:600 } }, 'All Trips · $' + totalSpent.toLocaleString() + ' spent'),
        e('span', { style:{ color:C.ash } }, '$' + totalBudget.toLocaleString() + ' total budget')
      ),
      e(Progress, { value:overallPct, color:C.terra })
    ),
    e('div', { style:{ display:'flex', flexDirection:'column', gap:'1.25rem' } },
      trips.map(function(trip) { return e(TripSummaryCard, { key:trip.id, trip:trip }); })
    )
  );
}

module.exports = ReportsView;
// Reports view
