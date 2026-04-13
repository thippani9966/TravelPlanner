const React = require('react');
const e = React.createElement;
const { C } = require('../constants');

function Field(props) {
  var base = { width: '100%', borderRadius: 10, border: '1px solid #ddd', padding: '10px 12px', fontSize: 14, transition: 'border-color 0.2s', background: '#fff', fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box' };
  var onF = function(ev) { ev.target.style.borderColor = C.terra; };
  var onB = function(ev) { ev.target.style.borderColor = '#ddd'; };
  var input = props.rows
    ? e('textarea', { value: props.value, onChange: function(ev) { props.onChange(ev.target.value); }, placeholder: props.placeholder || '', rows: props.rows, style: Object.assign({}, base, { resize: 'vertical', display: 'block' }), onFocus: onF, onBlur: onB })
    : e('input',    { type: props.type || 'text', value: props.value, onChange: function(ev) { props.onChange(ev.target.value); }, placeholder: props.placeholder || '', style: Object.assign({}, base, { display: 'block' }), onFocus: onF, onBlur: onB });
  return e('div', { style: { marginBottom: '1rem' } },
    e('label', { style: { display: 'block', fontSize: 12, color: C.ash, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' } }, props.label),
    input
  );
}

module.exports = Field;
