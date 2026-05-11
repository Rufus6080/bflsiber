const SESSION_KEY = 'admin_session';
const CONTACTS_KEY = 'contact_entries';
const ADMIN_HASH_KEY = 'admin_pw_hash';

async function sha256(message) {
  const buf = new TextEncoder().encode(message);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');
}

async function getStoredHash() {
  const stored = localStorage.getItem(ADMIN_HASH_KEY);
  if (stored) return stored;
  return await sha256('francis');
}

async function checkLogin(username, password) {
  if (username !== 'admin') return false;
  const hash = await sha256(password);
  const stored = await getStoredHash();
  return hash === stored;
}

async function changePassword(newPassword) {
  const hash = await sha256(newPassword);
  localStorage.setItem(ADMIN_HASH_KEY, hash);
}

function setSession() { sessionStorage.setItem(SESSION_KEY, '1'); }
function isLoggedIn() { return sessionStorage.getItem(SESSION_KEY) === '1'; }
function logout() { sessionStorage.removeItem(SESSION_KEY); window.location.href = 'admin.html'; }

function saveContact(entry) {
  const entries = getContacts();
  entries.unshift({ ...entry, date: new Date().toISOString() });
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(entries));
}

function getContacts() {
  try { return JSON.parse(localStorage.getItem(CONTACTS_KEY)) || []; }
  catch { return []; }
}
