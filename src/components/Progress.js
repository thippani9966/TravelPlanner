const React = require('react');
const e = React.createElement;
const { C } = require('../constants');

function Progress(props) {
  return e('div', { style: { background: C.smoke, borderRadius: 8, height: 8, overflow: 'hidden' } },
    e('div', { style: { width: props.value + '%', height: '100%', background: props.color, borderRadius: 8, transition: 'width 0.6s ease' } })
  );
}

module.exports = Progress;
