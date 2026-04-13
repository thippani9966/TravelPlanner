const React = require('react');
const e = React.createElement;
const { useState } = React;
const { C, CATEGORIES, CAT_ICONS } = require('../constants');
const Modal = require('./Modal');
const Field = require('./Field');
const { categoriseExpense } = require('../ai');

function AddExpenseModal(props) {
  var fArr = useState({ category:'Food', amount:'', date:'', note:'' });
  var form = fArr[0]; var setForm = fArr[1];
  var aiArr = useState(false); var aiLoad = aiArr[0]; var setAiLoad = aiArr[1];
  var hintArr = useState('');  var hint   = hintArr[0]; var setHint = hintArr[1];

  function set(k){ return function(v){ setForm(function(f){ var n=Object.assign({},f); n[k]=v; return n; }); }; }

  function handleNoteBlur() {
    var note = form.note.trim();
    if (!note || note.length < 3) return;
    setAiLoad(true); setHint('');
    categoriseExpense(note)
      .then(function(cat) {
        var matched = CATEGORIES.find(function(c){ return c.toLowerCase()===cat.trim().toLowerCase(); });
        if (matched && matched !== form.category) {
          setHint(matched);
          setForm(function(f){ return Object.assign({},f,{category:matched}); });
        }
      })
      .catch(function(){ setAiLoad(false); })
      .then(function(){ setAiLoad(false); });
  }

  return e(Modal, { title:'💳 Add Expense', onClose:props.onClose },
    aiLoad && e('div', { style:{background:'#f0f6ff',border:'1px solid #c8d8f0',borderRadius:10,padding:'8px 12px',marginBottom:'0.75rem',display:'flex',alignItems:'center',gap:8,fontSize:13} },
      e('span',{style:{fontSize:16}},'🤖'), e('span',{style:{color:C.ocean}},'AI detecting category…')
    ),
    hint && !aiLoad && e('div', { style:{background:'#f0faf5',border:'1px solid #a8dfc8',borderRadius:10,padding:'8px 12px',marginBottom:'0.75rem',display:'flex',alignItems:'center',gap:8,fontSize:13} },
      e('span',{style:{fontSize:16}},'✨'), e('span',{style:{color:'#0f6e56'}},'AI suggested: '+(CAT_ICONS[hint]||'')+' '+hint)
    ),
    e('div', { style:{marginBottom:'1rem'} },
      e('label', { style:{display:'block',fontSize:12,color:C.ash,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.08em'} }, 'Category'),
      e('div', { style:{display:'flex',gap:'0.5rem',flexWrap:'wrap'} },
        CATEGORIES.map(function(cat){ var active=form.category===cat; return e('button',{key:cat,onClick:function(){set('category')(cat);setHint('');},style:{background:active?C.terra:C.smoke,color:active?'#fff':C.deep,border:active?'none':'1px solid #ddd',borderRadius:20,padding:'6px 14px',cursor:'pointer',fontSize:13,transition:'all 0.2s'}}, (CAT_ICONS[cat]||'💳')+' '+cat); })
      )
    ),
    e(Field, { label:'Amount ($)', value:form.amount, onChange:set('amount'), type:'number', placeholder:'0.00' }),
    e(Field, { label:'Date',       value:form.date,   onChange:set('date'),   type:'date' }),
    e('div', { style:{marginBottom:'1rem'} },
      e('label', { style:{display:'flex',alignItems:'center',gap:8,fontSize:12,color:C.ash,marginBottom:6,textTransform:'uppercase',letterSpacing:'0.08em'} },
        'Note', e('span',{style:{fontSize:11,color:C.ocean,fontWeight:400,textTransform:'none',letterSpacing:0}},'— AI auto-detects category')
      ),
      e('input', { type:'text', value:form.note, placeholder:'e.g. Ramen near Shibuya crossing', onChange:function(ev){set('note')(ev.target.value);}, onBlur:handleNoteBlur, style:{width:'100%',borderRadius:10,border:'1px solid #ddd',padding:'10px 12px',fontSize:14,outline:'none',boxSizing:'border-box',fontFamily:'DM Sans,sans-serif',transition:'border-color 0.2s'}, onFocus:function(ev){ev.target.style.borderColor=C.terra;} })
    ),
    e('button', { onClick:function(){if(form.amount)props.onAdd(form);}, className:'btn-hover', style:{width:'100%',background:C.terra,color:'#fff',border:'none',borderRadius:12,padding:'12px',cursor:'pointer',fontSize:15,fontWeight:600} }, 'Add Expense')
  );
}

module.exports = AddExpenseModal;
