const React = require('react');
const e = React.createElement;
const { useState } = React;
const { C } = require('../constants');
const Modal = require('./Modal');
const Field = require('./Field');
const { generateItinerary } = require('../ai');

function AddDayModal(props) {
  var dayNum      = props.dayNum;
  var onClose     = props.onClose;
  var onAdd       = props.onAdd;
  var destination = props.destination || '';

  var tabArr  = useState('manual'); var tab  = tabArr[0];  var setTab  = tabArr[1];
  var fArr    = useState({ title:'', activities:'' }); var form = fArr[0]; var setForm = fArr[1];
  var aiArr   = useState({ days:'3', interests:'culture, food, sightseeing' }); var aiForm = aiArr[0]; var setAiForm = aiArr[1];
  var loadArr = useState(false); var loading = loadArr[0]; var setLoading = loadArr[1];
  var errArr  = useState('');    var err     = errArr[0];  var setErr     = errArr[1];
  var prevArr = useState([]);    var preview = prevArr[0]; var setPreview = prevArr[1];

  function handleGenerate() {
    if (!destination) { setErr('No destination set for this trip.'); return; }
    setLoading(true); setErr(''); setPreview([]);
    generateItinerary(destination, parseInt(aiForm.days)||3, aiForm.interests)
      .then(function(days){ setPreview(days); })
      .catch(function(e2){ setErr('AI error: '+(e2&&e2.message?e2.message:'Unknown error')); setLoading(false); })
      .then(function(){ setLoading(false); });
  }

  function addDay(day) { onAdd({ title: day.title, activities: day.activities.join('\n') }); }
  function addAll()    { preview.forEach(function(d){ onAdd({ title: d.title, activities: d.activities.join('\n') }); }); }

  var tabBtn = function(active) {
    return { flex:1, padding:'8px', border:'none', cursor:'pointer', borderRadius:8, fontSize:13, fontWeight:600,
      background: active ? C.ocean : C.smoke, color: active ? '#fff' : C.ash, transition:'all 0.2s' };
  };

  return e(Modal, { title: '🗓 Add Itinerary', onClose: onClose },
    // Tab toggle
    e('div', { style:{ display:'flex', gap:6, marginBottom:'1.25rem', background:C.smoke, padding:4, borderRadius:10 } },
      e('button', { onClick:function(){setTab('manual');}, style:tabBtn(tab==='manual') }, '✏️  Manual'),
      e('button', { onClick:function(){setTab('ai');},     style:tabBtn(tab==='ai')     }, '🤖  AI Planner')
    ),

    // ── MANUAL TAB ──────────────────────────────────────────────────────────
    tab === 'manual' && e('div', null,
      e(Field, { label:'Day Title',                  value:form.title,      onChange:function(v){setForm(function(f){return Object.assign({},f,{title:v});});},      placeholder:'e.g. Temple Hopping' }),
      e(Field, { label:'Activities (one per line)',  value:form.activities, onChange:function(v){setForm(function(f){return Object.assign({},f,{activities:v});});}, placeholder:'Visit Senso-ji\nHave sushi lunch\nExplore Harajuku', rows:5 }),
      e('button', { onClick:function(){if(form.title)onAdd(form);}, className:'btn-hover',
        style:{ width:'100%', background:C.ocean, color:'#fff', border:'none', borderRadius:12, padding:'12px', cursor:'pointer', fontSize:15, fontWeight:600 }
      }, 'Add Day')
    ),

    // ── AI PLANNER TAB ───────────────────────────────────────────────────────
    tab === 'ai' && e('div', null,
      e('div', { style:{ background:'#f0f6ff', border:'1px solid #c8d8f0', borderRadius:10, padding:'10px 14px', marginBottom:'1rem', fontSize:13, color:C.ocean } },
        e('strong', null, '🤖 AI Trip Planner'),
        e('span',   null, ' — Enter your interests and AI will generate a full itinerary for ' + (destination || 'your destination') + '.')
      ),
      e(Field, { label:'Number of days', value:aiForm.days,      onChange:function(v){setAiForm(function(f){return Object.assign({},f,{days:v});});},      type:'number', placeholder:'3' }),
      e(Field, { label:'Interests',      value:aiForm.interests, onChange:function(v){setAiForm(function(f){return Object.assign({},f,{interests:v});});}, placeholder:'e.g. temples, street food, hiking, art museums' }),
      err && e('div', { style:{ background:'#fef0f0', border:'1px solid #fcc', borderRadius:8, padding:'8px 12px', marginBottom:'0.75rem', fontSize:13, color:'#c0392b' } }, err),
      e('button', { onClick:handleGenerate, disabled:loading, className:'btn-hover',
        style:{ width:'100%', background:loading?C.ash:C.ocean, color:'#fff', border:'none', borderRadius:12, padding:'12px', cursor:loading?'not-allowed':'pointer', fontSize:15, fontWeight:600, marginBottom:'1rem' }
      }, loading ? '⏳ Generating itinerary…' : '✨ Generate Itinerary'),

      // Preview cards
      preview.length > 0 && e('div', null,
        e('div', { style:{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 } },
          e('div', { style:{ fontSize:13, fontWeight:600, color:C.deep } }, preview.length + ' days generated'),
          e('button', { onClick:addAll, style:{ background:C.terra, color:'#fff', border:'none', borderRadius:20, padding:'6px 16px', cursor:'pointer', fontSize:13, fontWeight:600 } }, '+ Add All Days')
        ),
        e('div', { style:{ display:'flex', flexDirection:'column', gap:8, maxHeight:320, overflowY:'auto' } },
          preview.map(function(day) {
            return e('div', { key:day.day, style:{ background:C.smoke, borderRadius:10, padding:'10px 14px', borderLeft:'3px solid '+C.ocean } },
              e('div', { style:{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 } },
                e('div', null,
                  e('div', { style:{ fontSize:12, color:C.ash, marginBottom:2 } }, 'Day ' + day.day),
                  e('div', { style:{ fontWeight:700, fontSize:14 } }, day.title)
                ),
                e('button', { onClick:function(){ addDay(day); }, style:{ background:C.ocean, color:'#fff', border:'none', borderRadius:16, padding:'4px 12px', cursor:'pointer', fontSize:12, fontWeight:600 } }, '+ Add')
              ),
              e('div', { style:{ display:'flex', flexDirection:'column', gap:3 } },
                day.activities.map(function(act, i) {
                  return e('div', { key:i, style:{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:C.deep } },
                    e('div', { style:{ width:4, height:4, borderRadius:'50%', background:C.ocean, flexShrink:0 } }),
                    act
                  );
                })
              )
            );
          })
        )
      )
    )
  );
}

module.exports = AddDayModal;
