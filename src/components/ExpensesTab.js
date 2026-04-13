const React = require('react');
const e = React.createElement;
const { useState } = React;
const { C, CAT_ICONS } = require('../constants');
const Progress       = require('./Progress');
const AddExpenseModal = require('./AddExpenseModal');
const { tripSpent, catTotals } = require('../utils');

function ExpensesTab(props) {
  var trip          = props.trip;
  var onAddExpense  = props.onAddExpense;

  var showArr = useState(false); var showAdd = showArr[0]; var setShowAdd = showArr[1];
  var spent = tripSpent(trip);

  function handleAdd(form) { onAddExpense(form); setShowAdd(false); }

  return e('div', null,
    // Add Expense button
    e('div', { style:{ display:'flex', justifyContent:'flex-end', marginBottom:'1rem' } },
      e('button', { onClick:function(){ setShowAdd(true); }, className:'btn-hover',
        style:{ background:C.terra, color:'#fff', border:'none', borderRadius:24, padding:'8px 20px', cursor:'pointer', fontSize:13, fontWeight:600 }
      }, '＋ Add Expense')
    ),

    // Category breakdown card
    e('div', { className:'fade-up', style:{ background:'#fff', borderRadius:16, padding:'1.5rem', marginBottom:'1rem', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' } },
      e('h3', { style:{ margin:'0 0 1rem', fontSize:17, fontFamily:"'Playfair Display', serif", fontStyle:'italic' } }, 'Category Breakdown'),
      spent === 0
        ? e('div', { style:{ color:C.ash, fontSize:14 } }, 'No expenses logged yet.')
        : e('div', { style:{ display:'flex', flexDirection:'column', gap:10 } },
            catTotals(trip).map(function(entry) {
              var cat = entry[0]; var amt = entry[1];
              var p = Math.round((amt / spent) * 100);
              return e('div', { key:cat },
                e('div', { style:{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:4 } },
                  e('span', null, (CAT_ICONS[cat]||'💳') + ' ' + cat),
                  e('span', { style:{ fontWeight:600 } }, '$' + amt.toLocaleString() + ' ',
                    e('span', { style:{ color:C.ash, fontWeight:400 } }, '(' + p + '%)')
                  )
                ),
                e(Progress, { value:p, color:C.terra })
              );
            })
          )
    ),

    // Expense list
    e('div', { style:{ display:'flex', flexDirection:'column', gap:'0.5rem' } },
      trip.expenses.map(function(ex, i) {
        return e('div', { key:ex.id, className:'fade-up',
          style:{ background:'#fff', borderRadius:12, padding:'1rem 1.25rem', display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'0 1px 6px rgba(0,0,0,0.05)', animationDelay:(i*0.04)+'s' }
        },
          e('div', { style:{ display:'flex', alignItems:'center', gap:12 } },
            e('div', { style:{ fontSize:24 } }, CAT_ICONS[ex.category]||'💳'),
            e('div', null,
              e('div', { style:{ fontWeight:600, fontSize:14 } }, ex.note || ex.category),
              e('div', { style:{ color:C.ash, fontSize:12 } }, ex.category + ' · ' + ex.date)
            )
          ),
          e('div', { style:{ fontWeight:700, fontSize:16, color:C.terra } }, '$' + ex.amount.toLocaleString())
        );
      })
    ),

    showAdd && e(AddExpenseModal, {
      onClose: function(){ setShowAdd(false); },
      onAdd:   handleAdd,
    })
  );
}

module.exports = ExpensesTab;
