var USERS_KEY   = 'voyage_users';
var SESSION_KEY = 'voyage_session';

function getUsers() {
  try { var r = localStorage.getItem(USERS_KEY); return r ? JSON.parse(r) : []; }
  catch(e) { return []; }
}
function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }
function getSession() {
  try { var r = localStorage.getItem(SESSION_KEY); return r ? JSON.parse(r) : null; }
  catch(e) { return null; }
}
function saveSession(u) { localStorage.setItem(SESSION_KEY, JSON.stringify(u)); }
function clearSession()  { localStorage.removeItem(SESSION_KEY); }

function signup(name, username, password) {
  if (!name || !username || !password) return { success: false, error: 'All fields are required.' };
  if (username.length < 3)  return { success: false, error: 'Username must be at least 3 characters.' };
  if (password.length < 6)  return { success: false, error: 'Password must be at least 6 characters.' };
  var users = getUsers();
  if (users.find(function(u) { return u.username.toLowerCase() === username.toLowerCase(); }))
    return { success: false, error: 'Username already taken. Please choose another.' };
  var user = { id: Date.now(), name: name, username: username.toLowerCase(), password: password, avatar: name.charAt(0).toUpperCase(), createdAt: new Date().toISOString() };
  users.push(user);
  saveUsers(users);
  var session = { id: user.id, name: user.name, username: user.username, avatar: user.avatar };
  saveSession(session);
  return { success: true, user: session };
}

function login(username, password) {
  if (!username || !password) return { success: false, error: 'Please enter your username and password.' };
  var users = getUsers();
  var user  = users.find(function(u) { return u.username.toLowerCase() === username.toLowerCase(); });
  if (!user)              return { success: false, error: 'No account found with that username.' };
  if (user.password !== password) return { success: false, error: 'Incorrect password. Please try again.' };
  var session = { id: user.id, name: user.name, username: user.username, avatar: user.avatar };
  saveSession(session);
  return { success: true, user: session };
}

function logout() { clearSession(); }

module.exports = { signup, login, logout, getSession };
