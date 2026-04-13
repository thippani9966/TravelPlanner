const React = require('react');
const e = React.createElement;
const { useState } = React;
const { C, EMOJIS } = require('../constants');
const Modal  = require('./Modal');
const Field  = require('./Field');
const { suggestBudget } = require('../ai');
const CAT_ICONS_B = { Flight:'✈️', Hotel:'🏨', Food:'🍽️', Transport:'🚌', Activities:'🎭', Shopping:'🛍️' };

function AddTripModal(props) {
  var fArr = useState({ name:'', destination:'', startDate:'', endDate:'', budget:'', emoji:'✈️' });
  var form = fArr[0]; var setForm = fArr[1];
  var aiArr = useState(false);  var aiLoad = aiArr[0]; var setAiLoad = aiArr[1];
  var suggArr = useState(null); var sugg = suggArr[0]; var setSugg = suggArr[1];
  var errArr  = useState('');   var err  = errArr[0];  var setErr  = errArr[1];

  function set(k){ return function(v){ setForm(function(f){ var n=Object.assign({},f); n[k]=v; return n; }); }; }

  function handleSuggest() {
    if (!form.destination) { setErr('Please enter a destination first.'); return; }
    var days = 7;
    if (form.startDate && form.endDate) days = Math.max(1, Math.ceil((new Date(form.endDate)-new Date(form.startDate))/86400000));
    setAiLoad(true); setErr(''); setSugg(null);
    suggestBudget(form.destination, days)
      .then(function(d){ setSugg(d); })
      .catch(function(e2){ setErr('AI error: '+(e2&&e2.message?e2.message:'Unknown error')); setAiLoad(false); })
      .then(function(){ setAiLoad(false); });
  }

  return e(Modal, { title:'✈️ Plan New Trip', onClose: props.onClose },
    e(Field, { label:'Trip Name',   value:form.name,        onChange:set('name'),        placeholder:'e.g. Bali Escape' }),
    e(Field, { label:'Destination', value:form.destination, onChange:set('destination'), placeholder:'e.g. Bali, Indonesia' }),
    e('div', { style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'} },
      e(Field, { label:'Start Date', value:form.startDate, onChange:set('startDate'), type:'date' }),
      e(Field, { label:'End Date',   value:form.endDate,   onChange:set('endDate'),   type:'date' })
    ),
    e('div', { style:{marginBottom:'1rem'} },
      e('label', { style:{display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:12,color:C.ash,marginBottom:6,textTransform:'uppercase',letterSpacing:'0.08em'} },
        'Budget ($)',
        e('button', { onClick:handleSuggest, disabled:aiLoad, style:{background:'none',border:'1px solid '+C.ocean,color:C.ocean,borderRadius:20,padding:'3px 10px',cursor:aiLoad?'not-allowed':'pointer',fontSize:11,fontWeight:600,textTransform:'none',letterSpacing:0} }, aiLoad?'⏳ Loading…':'🤖 AI Suggest Budget')
      ),
      e('input', { type:'number', value:form.budget, onChange:function(ev){set('budget')(ev.target.value);}, placeholder:'0.00', style:{width:'100%',borderRadius:10,border:'1px solid #ddd',padding:'10px 12px',fontSize:14,outline:'none',boxSizing:'border-box',fontFamily:'DM Sans,sans-serif'}, onFocus:function(ev){ev.target.style.borderColor=C.terra;}, onBlur:function(ev){ev.target.style.borderColor='#ddd';} })
    ),
    err && e('div', { style:{background:'#fef0f0',border:'1px solid #fcc',borderRadius:8,padding:'8px 12px',marginBottom:'0.75rem',fontSize:13,color:'#c0392b'} }, err),
    sugg && e('div', { style:{background:'#f0f6ff',border:'1px solid #c8d8f0',borderRadius:12,padding:'1rem',marginBottom:'1rem'} },
      e('div', { style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10} },
        e('div', { style:{fontSize:13,fontWeight:700,color:C.ocean} }, '🤖 AI Estimate: $'+sugg.total.toLocaleString()),
        e('button', { onClick:function(){setForm(function(f){return Object.assign({},f,{budget:String(sugg.total)});});setSugg(null);}, style:{background:C.ocean,color:'#fff',border:'none',borderRadius:16,padding:'5px 14px',cursor:'pointer',fontSize:12,fontWeight:600} }, '✓ Use This')
      ),
      e('div', { style:{display:'flex',flexDirection:'column',gap:4,marginBottom:10} },
        sugg.breakdown.map(function(item){ return e('div',{key:item.category,style:{display:'flex',justifyContent:'space-between',fontSize:12}}, e('span',null,(CAT_ICONS_B[item.category]||'💳')+' '+item.category+' — '+item.note), e('span',{style:{fontWeight:600}},'$'+item.amount.toLocaleString())); })
      ),
      sugg.tip && e('div', { style:{background:'#e8f4f0',borderRadius:8,padding:'8px 10px',fontSize:12,color:'#0f6e56',fontStyle:'italic'} }, '💡 '+sugg.tip)
    ),
    e('div', { style:{marginBottom:'1.25rem'} },
      e('label', { style:{display:'block',fontSize:12,color:C.ash,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.08em'} }, 'Emoji'),
      e('div', { style:{display:'flex',gap:'0.5rem',flexWrap:'wrap'} },
        EMOJIS.map(function(em){ return e('button',{key:em,onClick:function(){set('emoji')(em);},style:{fontSize:22,background:form.emoji===em?C.sand:'none',border:'2px solid '+(form.emoji===em?C.terra:'#ddd'),borderRadius:8,padding:5,cursor:'pointer'}},em); })
      )
    ),
    e('button', { onClick:function(){if(form.name&&form.destination)props.onAdd(form);}, className:'btn-hover', style:{width:'100%',background:C.terra,color:'#fff',border:'none',borderRadius:12,padding:'12px',cursor:'pointer',fontSize:15,fontWeight:600} }, 'Create Trip')
  );
}

module.exports = AddTripModal;
