const React = require('react');
const e = React.createElement;
const { useState, useEffect } = React;

const { C, SAMPLE_TRIPS } = require('./constants');
const { tripSpent }       = require('./utils');
const { getSession, logout } = require('./auth');

const Header       = require('./components/Header');
const StatCard     = require('./components/StatCard');
const TripCard     = require('./components/TripCard');
const TripDetail   = require('./components/TripDetail');
const ReportsView  = require('./components/ReportsView');
const AddTripModal = require('./components/AddTripModal');
const LoginPage    = require('./components/LoginPage');
const SignupPage   = require('./components/SignupPage');

// Per-user localStorage key
function tripsKey(userId) { return 'voyage_trips_' + userId; }

function loadTrips(userId) {
  try {
    var raw = localStorage.getItem(tripsKey(userId));
    if (raw) return JSON.parse(raw);
  } catch(ex) {}
  return SAMPLE_TRIPS;
}

function saveTrips(userId, trips) {
  localStorage.setItem(tripsKey(userId), JSON.stringify(trips));
}

function App() {
  // ── auth ──────────────────────────────────────────────────────────────────
  var userArr    = useState(null); var user    = userArr[0]; var setUser    = userArr[1];
  var pageArr    = useState('login'); var authPage = pageArr[0]; var setAuthPage = pageArr[1];

  // ── app state ──────────────────────────────────────────────────────────────
  var tripsArr   = useState([]); var trips      = tripsArr[0]; var setTrips      = tripsArr[1];
  var viewArr    = useState('dashboard'); var view = viewArr[0]; var setView      = viewArr[1];
  var idArr      = useState(null); var selectedId = idArr[0];  var setSelectedId = idArr[1];
  var modalArr   = useState(false); var showAdd  = modalArr[0]; var setShowAdd    = modalArr[1];

  // Restore session on mount
  useEffect(function() {
    var session = getSession();
    if (session) { setUser(session); setTrips(loadTrips(session.id)); }
  }, []);

  // Persist trips whenever they change
  useEffect(function() {
    if (user) saveTrips(user.id, trips);
  }, [trips, user]);

  var liveTrip    = trips.find(function(t){ return t.id === selectedId; });
  var totalBudget = trips.reduce(function(s,t){ return s+t.budget; }, 0);
  var totalSpent  = trips.reduce(function(s,t){ return s+tripSpent(t); }, 0);

  function handleLogin(u) { setUser(u); setTrips(loadTrips(u.id)); setView('dashboard'); }

  function handleLogout() {
    logout(); setUser(null); setTrips([]); setView('dashboard'); setSelectedId(null); setAuthPage('login');
  }

  function openTrip(trip) { setSelectedId(trip.id); setView('trip'); }

  function handleNavChange(key) { setView(key); setSelectedId(null); }

  function handleAddTrip(form) {
    var trip = Object.assign({}, form, { id:Date.now(), budget:parseFloat(form.budget)||0, itinerary:[], expenses:[], color:C.terra });
    setTrips(function(prev){ return prev.concat([trip]); });
    setShowAdd(false);
  }

  function handleAddExpense(form) {
    var expense = Object.assign({}, form, { id:Date.now(), amount:parseFloat(form.amount) });
    setTrips(function(prev){ return prev.map(function(t){ return t.id!==selectedId?t:Object.assign({},t,{expenses:t.expenses.concat([expense])}); }); });
  }

  function handleAddDay(form) {
    var dayEntry = { day:(liveTrip.itinerary.length+1), title:form.title, activities:form.activities.split('\n').filter(Boolean) };
    setTrips(function(prev){ return prev.map(function(t){ return t.id!==selectedId?t:Object.assign({},t,{itinerary:t.itinerary.concat([dayEntry])}); }); });
  }

  // ── Auth screens ────────────────────────────────────────────────────────────
  if (!user) {
    if (authPage === 'signup') return e(SignupPage, { onSignup:handleLogin, onGoLogin:function(){ setAuthPage('login'); } });
    return e(LoginPage, { onLogin:handleLogin, onGoSignup:function(){ setAuthPage('signup'); } });
  }

  // ── Main app ─────────────────────────────────────────────────────────────────
  return e('div', { style:{ minHeight:'100vh', background:C.smoke } },
    e(Header, { view:view, selectedTrip:liveTrip||null, onBack:function(){ setView('dashboard'); setSelectedId(null); }, onNavChange:handleNavChange, user:user, onLogout:handleLogout }),

    e('main', { style:{ maxWidth:1100, margin:'0 auto', padding:'2rem 1.5rem' } },

      // ── DASHBOARD ──────────────────────────────────────────────────────────
      view === 'dashboard' && e('div', null,
        // Welcome
        e('div', { className:'fade-up', style:{ marginBottom:'1.5rem' } },
          e('h2', { style:{ fontFamily:"'Playfair Display', serif", fontStyle:'italic', fontSize:26, margin:0 } }, 'Welcome back, ' + user.name + ' 👋')
        ),
        // Stats
        e('div', { style:{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'2rem' } },
          e(StatCard, { icon:'🗺️', label:'Total Trips',  value:trips.length,                       sub:'adventures planned',  delay:'0s' }),
          e(StatCard, { icon:'💰', label:'Total Budget', value:'$'+totalBudget.toLocaleString(),   sub:'across all trips',    delay:'0.07s' }),
          e(StatCard, { icon:'💸', label:'Total Spent',  value:'$'+totalSpent.toLocaleString(),    sub:Math.round((totalSpent/Math.max(1,totalBudget))*100)+'% of budget', delay:'0.14s' })
        ),
        // Heading + New Trip
        e('div', { style:{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' } },
          e('h2', { style:{ margin:0, fontSize:22, fontFamily:"'Playfair Display', serif", fontStyle:'italic' } }, 'Your Journeys'),
          e('button', { onClick:function(){ setShowAdd(true); }, className:'btn-hover',
            style:{ background:C.terra, color:'#fff', border:'none', borderRadius:24, padding:'10px 22px', cursor:'pointer', fontSize:14, fontWeight:600 }
          }, '＋ New Trip')
        ),
        // Empty state
        trips.length === 0 && e('div', { style:{ textAlign:'center', padding:'4rem', color:C.ash } },
          e('div', { style:{ fontSize:48, marginBottom:12 } }, '🗺️'),
          e('div', { style:{ fontSize:18, fontFamily:"'Playfair Display', serif", fontStyle:'italic', marginBottom:8 } }, 'No trips yet'),
          e('div', { style:{ fontSize:14 } }, 'Click "+ New Trip" to start planning your next adventure!')
        ),
        // Trip grid
        e('div', { style:{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.25rem' } },
          trips.map(function(trip, i) {
            return e(TripCard, { key:trip.id, trip:trip, onClick:function(){ openTrip(trip); }, delay:(i*0.07)+'s' });
          })
        )
      ),

      // ── TRIP DETAIL ────────────────────────────────────────────────────────
      view === 'trip' && liveTrip && e(TripDetail, { trip:liveTrip, onAddExpense:handleAddExpense, onAddDay:handleAddDay }),

      // ── REPORTS ───────────────────────────────────────────────────────────
      view === 'report' && e(ReportsView, { trips:trips })
    ),

    showAdd && e(AddTripModal, { onClose:function(){ setShowAdd(false); }, onAdd:handleAddTrip })
  );
}

module.exports = App;
