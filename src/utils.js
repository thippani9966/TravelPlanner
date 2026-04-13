var tripSpent = function(trip) {
  return trip.expenses.reduce(function(s, x) { return s + x.amount; }, 0);
};

var pct = function(trip) {
  return Math.min(100, Math.round((tripSpent(trip) / trip.budget) * 100));
};

var catTotals = function(trip) {
  var map = {};
  trip.expenses.forEach(function(x) {
    map[x.category] = (map[x.category] || 0) + x.amount;
  });
  return Object.entries(map).sort(function(a, b) { return b[1] - a[1]; });
};

var fmtDate = function(d) { return d || 'TBD'; };

var tripDays = function(trip) {
  if (!trip.startDate || !trip.endDate) return '–';
  return Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / 86400000);
};

var barColor = function(p, C) {
  return p > 90 ? C.coral : p > 70 ? C.gold : C.mint;
};

module.exports = { tripSpent, pct, catTotals, fmtDate, tripDays, barColor };
