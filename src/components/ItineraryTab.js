const React = require('react');
const e = React.createElement;
const { useState } = React;
const { C } = require('../constants');
const AddDayModal = require('./AddDayModal');

function ItineraryTab(props) {
  var trip     = props.trip;
  var onAddDay = props.onAddDay;

  var showArr = useState(false); var showAdd = showArr[0]; var setShowAdd = showArr[1];

  function handleAdd(form) { onAddDay(form); }

  return e('div', null,
    // Add Day button
    e('div', { style:{ display:'flex', justifyContent:'flex-end', marginBottom:'1rem' } },
      e('button', { onClick:function(){setShowAdd(true);}, className:'btn-hover',
        style:{ background:C.ocean, color:'#fff', border:'none', borderRadius:24, padding:'8px 20px', cursor:'pointer', fontSize:13, fontWeight:600 }
      }, '＋ Add Day')
    ),

    // Empty state
    trip.itinerary.length === 0
      ? e('div', { style:{ textAlign:'center', padding:'3rem', color:C.ash } },
          e('div', { style:{ fontSize:40, marginBottom:12 } }, '🗓'),
          e('div', { style:{ fontSize:15 } }, 'No itinerary yet — start planning your days!')
        )
      : e('div', { style:{ display:'flex', flexDirection:'column', gap:'0.75rem' } },
          trip.itinerary.map(function(day, i) {
            return e('div', { key:i, className:'fade-up',
              style:{ background:'#fff', borderRadius:16, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:'1px solid rgba(0,0,0,0.06)', display:'flex', animationDelay:(i*0.05)+'s' }
            },
              // Day number panel
              e('div', { style:{ background:'#1A1208', color:C.sand, padding:'1.5rem 1.25rem', minWidth:74, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' } },
                e('div', { style:{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.12em', opacity:0.7, marginBottom:4 } }, 'Day'),
                e('div', { style:{ fontSize:30, fontWeight:700, fontFamily:"'Playfair Display', serif" } }, day.day)
              ),
              // Activities
              e('div', { style:{ padding:'1.25rem 1.5rem', flex:1 } },
                e('div', { style:{ fontWeight:700, fontSize:17, marginBottom:'0.75rem', fontFamily:"'Playfair Display', serif", fontStyle:'italic' } }, day.title),
                e('div', { style:{ display:'flex', flexDirection:'column', gap:6 } },
                  day.activities.map(function(act, j) {
                    return e('div', { key:j, style:{ display:'flex', alignItems:'center', gap:10, fontSize:14, color:C.deep } },
                      e('div', { style:{ width:6, height:6, borderRadius:'50%', background:C.terra, flexShrink:0 } }),
                      act
                    );
                  })
                )
              )
            );
          })
        ),

    showAdd && e(AddDayModal, {
      dayNum:      trip.itinerary.length + 1,
      destination: trip.destination,
      onClose:     function(){ setShowAdd(false); },
      onAdd:       handleAdd,
    })
  );
}

module.exports = ItineraryTab;
