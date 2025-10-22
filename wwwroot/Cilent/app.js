// Client copy of app.js
// (trimmed to core functions used by the index.html)

// Minimal stubs to avoid errors when opening the page
const STORAGE_KEY_PREFIX = 'cookieBakery_';
let state = { cookies: 0, totalCookies: 0 };
let lastTick = Date.now();

function format(n){ return Math.floor(n).toLocaleString(); }
function getCps(){ return 0; }

function saveLocal(){
  try{ localStorage.setItem(STORAGE_KEY_PREFIX + 'default', JSON.stringify(state)); }
  catch(e){ console.warn('save failed', e); }
}

function popCookieEffect(text){
  const el = document.createElement('div'); el.className = 'cookieEffect'; el.textContent = text;
  document.getElementById('cookieEffects')?.appendChild(el);
  setTimeout(()=>el.remove(), 1500);
}

// Simple click handler for demo
document.addEventListener('DOMContentLoaded', ()=>{
  const big = document.getElementById('bigCookie');
  const count = document.getElementById('cookieCount');
  big?.addEventListener('click', ()=>{
    state.cookies += 1; state.totalCookies +=1; count.textContent = state.cookies;
    popCookieEffect('+1');
    saveLocal();
  });
});

// Exported for debugging
window._CK = { state };
