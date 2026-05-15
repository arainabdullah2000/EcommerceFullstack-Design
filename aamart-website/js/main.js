/* ===== AA MART MAIN.JS ===== */

/* ---------- STORAGE HELPERS ---------- */
const store = {
  get: k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v))
};

/* ---------- STATE ---------- */
let cart = store.get('aamart_cart') || [];
let wishlist = store.get('aamart_wishlist') || [];
let currentUser = store.get('aamart_user') || null;

/* ---------- TOAST ---------- */
function showToast(msg, type = '') {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.className = 'toast ' + type;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2800);
}
window.showToast = showToast;

/* ---------- COUNTDOWN ---------- */
function initCountdown() {
  const els = { d: document.querySelector('.cd-days'), h: document.querySelector('.cd-hours'), m: document.querySelector('.cd-mins'), s: document.querySelector('.cd-secs') };
  if (!els.d) return;
  const target = new Date(); target.setDate(target.getDate() + 4); target.setHours(13, 34, 56, 0);
  function tick() {
    let diff = Math.max(0, Math.floor((target - Date.now()) / 1000));
    const d = Math.floor(diff / 86400); diff -= d * 86400;
    const h = Math.floor(diff / 3600); diff -= h * 3600;
    const m = Math.floor(diff / 60), s = diff % 60;
    els.d.textContent = String(d).padStart(2,'0');
    els.h.textContent = String(h).padStart(2,'0');
    els.m.textContent = String(m).padStart(2,'0');
    els.s.textContent = String(s).padStart(2,'0');
  }
  tick(); setInterval(tick, 1000);
}

/* ---------- CART ---------- */
function saveCart() { store.set('aamart_cart', cart); }
function cartCount() { return cart.reduce((s, i) => s + i.qty, 0); }
function cartTotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }

function updateCartBadge() {
  const count = cartCount();
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.classList.toggle('show', count > 0);
  });
}

function addToCart(id, name, price, emoji, img) {
  const existing = cart.find(i => i.id === id);
  if (existing) { existing.qty++; } else { cart.push({ id, name, price, emoji, img: img || '', qty: 1 }); }
  saveCart(); updateCartBadge();
  showToast('Added to cart! 🛒', 'success');
}
window.addToCart = addToCart;

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart(); updateCartBadge(); renderCartItems();
}

function renderCartItems() {
  const el = document.querySelector('.cart-items');
  const totalEl = document.querySelector('.cart-total-val');
  if (!el) return;
  if (!cart.length) {
    el.innerHTML = '<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>Your cart is empty</p></div>';
  } else {
    el.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-thumb" style="background:#f5f5f5;border-radius:8px;overflow:hidden;width:70px;height:70px;flex-shrink:0;display:flex;align-items:center;justify-content:center;">
          ${item.img
            ? `<img src="${item.img}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span style="display:none;font-size:28px;align-items:center;justify-content:center;width:100%;height:100%;">${item.emoji}</span>`
            : `<span style="font-size:28px;">${item.emoji}</span>`
          }
        </div>
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
          <div class="cart-item-qty">Qty: ${item.qty} × $${item.price.toFixed(2)}</div>
          <span class="cart-item-remove" onclick="removeFromCart(${item.id})">✕ Remove</span>
        </div>
        <button class="cart-item-del" onclick="removeFromCart(${item.id})">×</button>
      </div>
    `).join('');
  }
  if (totalEl) totalEl.textContent = '$' + cartTotal().toFixed(2);
  updateCartBadge();
}

function openCart() {
  document.querySelector('.cart-overlay')?.classList.add('open');
  document.querySelector('.cart-sidebar')?.classList.add('open');
  renderCartItems();
}
function closeCart() {
  document.querySelector('.cart-overlay')?.classList.remove('open');
  document.querySelector('.cart-sidebar')?.classList.remove('open');
}
window.openCart = openCart;

/* ---------- WISHLIST ---------- */
function toggleWishlist(id, btn) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(w => w !== id);
    if (btn) { btn.textContent = '♡'; btn.classList.remove('active'); }
    showToast('Removed from wishlist');
  } else {
    wishlist.push(id);
    if (btn) { btn.textContent = '♥'; btn.classList.add('active'); }
    showToast('Added to wishlist! ♥', 'success');
  }
  store.set('aamart_wishlist', wishlist);
}
window.toggleWishlist = toggleWishlist;

/* ---------- USER PANEL ---------- */
function updateUserPanel() {
  const firstName = currentUser ? currentUser.name.split(' ')[0] : '';
  const initial   = currentUser ? currentUser.name[0].toUpperCase() : '';

  /* ---- 1. Hero side panel (index.html) ---- */
  const panel = document.querySelector('.user-panel');
  if (panel) {
    const avatar   = panel.querySelector('.avatar');
    const greeting = panel.querySelector('p');
    const joinBtn  = panel.querySelector('.btn-join');
    const loginBtn = panel.querySelector('.btn-login');
    const logoutBtn= panel.querySelector('.btn-logout');
    if (currentUser) {
      if (avatar)   avatar.textContent = initial;
      if (greeting) greeting.innerHTML = `<strong>Hi, ${firstName}!</strong>`;
      if (joinBtn)  joinBtn.style.display  = 'none';
      if (loginBtn) loginBtn.style.display = 'none';
      if (logoutBtn){ logoutBtn.style.display = ''; logoutBtn.onclick = doLogout; }
    } else {
      if (avatar)   avatar.textContent = '👤';
      if (greeting) greeting.innerHTML = 'Hi, user';
      if (joinBtn)  { joinBtn.style.display  = ''; joinBtn.onclick  = () => openModal('register'); }
      if (loginBtn) { loginBtn.style.display = ''; loginBtn.onclick = () => openModal('login'); }
      if (logoutBtn) logoutBtn.style.display = 'none';
    }
  }

  /* ---- 2. Header "Account" action button (all pages) ---- */
  const profileItem = document.querySelector('.action-profile');
  if (profileItem) {
    if (currentUser) {
      profileItem.innerHTML = `
        <div class="user-avatar-btn">${initial}</div>
        <span>${firstName}</span>
        <div class="user-dropdown">
          <div class="user-dropdown-header">
            <div class="user-dropdown-avatar">${initial}</div>
            <div>
              <div class="user-dropdown-name">${currentUser.name}</div>
              <div class="user-dropdown-email">${currentUser.email}</div>
            </div>
          </div>
          <a href="orders.html" class="user-dropdown-item">📦 My Orders</a>
          <a href="#" class="user-dropdown-item" onclick="event.preventDefault();doLogout()">🚪 Sign Out</a>
        </div>`;
      profileItem.style.color = 'var(--blue)';
      profileItem.classList.add('logged-in');
    } else {
      profileItem.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        <span>Account</span>`;
      profileItem.style.color = '';
      profileItem.classList.remove('logged-in');
      profileItem.onclick = () => openModal('login');
    }
  }

  /* ---- 3. Nav-right "Sign in / Join Free" links (all pages) ---- */
  const navRight = document.querySelector('.nav-right');
  if (navRight) {
    if (currentUser) {
      navRight.innerHTML = `
        <span style="color:var(--blue);font-weight:600">👤 ${currentUser.name}</span>
        <span onclick="doLogout()" style="color:var(--red)">Sign Out</span>`;
    } else {
      navRight.innerHTML = `
        <span onclick="openModal('login')">Sign in</span>
        <span onclick="openModal('register')">Join Free</span>`;
    }
  }
}

function doLogout() {
  currentUser = null;
  store.set('aamart_user', null);
  showToast('You have been signed out');
  updateUserPanel();
}
window.doLogout = doLogout;

/* ---------- LOGIN MODAL ---------- */
function openModal(tab = 'login') {
  document.querySelector('.modal-overlay')?.classList.add('open');
  document.querySelector('.modal-box')?.classList.add('open');
  switchTab(tab);
}
function closeModal() {
  document.querySelector('.modal-overlay')?.classList.remove('open');
  document.querySelector('.modal-box')?.classList.remove('open');
  clearModalAlerts();
}
window.openModal = openModal;

function switchTab(tab) {
  document.querySelectorAll('.modal-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.modal-form').forEach(f => f.style.display = f.dataset.form === tab ? '' : 'none');
  clearModalAlerts();
}

function clearModalAlerts() {
  document.querySelectorAll('.modal-alert').forEach(a => { a.style.display = 'none'; a.textContent = ''; });
}

function showModalAlert(formId, msg, type = 'error') {
  const alertEl = document.querySelector(`#${formId} .modal-alert`);
  if (alertEl) { alertEl.className = `modal-alert ${type}`; alertEl.textContent = msg; alertEl.style.display = 'block'; }
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.querySelector('#login-email').value.trim();
  const password = document.querySelector('#login-password').value;
  clearModalAlerts();
  if (!email.includes('@')) { showModalAlert('login-form', 'Please enter a valid email.'); return; }
  if (password.length < 6) { showModalAlert('login-form', 'Password must be at least 6 characters.'); return; }
  const users = store.get('aamart_users') || [];
  const found = users.find(u => u.email === email && u.password === password);
  if (!found) { showModalAlert('login-form', 'Invalid email or password.'); return; }
  currentUser = { name: found.name, email: found.email };
  store.set('aamart_user', currentUser);
  showModalAlert('login-form', `Welcome back, ${found.name.split(' ')[0]}! 🎉`, 'success');
  setTimeout(() => { closeModal(); updateUserPanel(); showToast('Login successful!', 'success'); }, 1200);
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.querySelector('#reg-name').value.trim();
  const email = document.querySelector('#reg-email').value.trim();
  const password = document.querySelector('#reg-password').value;
  clearModalAlerts();
  if (!name) { showModalAlert('register-form', 'Please enter your full name.'); return; }
  if (!email.includes('@')) { showModalAlert('register-form', 'Please enter a valid email.'); return; }
  if (password.length < 6) { showModalAlert('register-form', 'Password must be at least 6 characters.'); return; }
  const users = store.get('aamart_users') || [];
  if (users.find(u => u.email === email)) { showModalAlert('register-form', 'An account with this email already exists.'); return; }
  users.push({ name, email, password });
  store.set('aamart_users', users);
  currentUser = { name, email };
  store.set('aamart_user', currentUser);
  showModalAlert('register-form', `Account created! Welcome, ${name.split(' ')[0]}! 🎉`, 'success');
  setTimeout(() => { closeModal(); updateUserPanel(); showToast('Account created successfully!', 'success'); }, 1200);
}

/* ---------- SEARCH ---------- */
function initSearch() {
  const input = document.querySelector('.search-input');
  const sugBox = document.querySelector('.suggestions-box');
  const btn = document.querySelector('.search-btn');
  if (!input || !sugBox) return;

  input.addEventListener('input', () => {
    const q = input.value.trim();
    if (q.length < 2) { sugBox.classList.remove('show'); return; }
    const matches = (typeof PRODUCTS !== 'undefined' ? PRODUCTS : [])
      .filter(p => p.name.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 6);
    if (!matches.length) { sugBox.classList.remove('show'); return; }
    sugBox.innerHTML = matches.map(p => `<div class="suggestion-item" onclick="doSearch('${p.name.replace(/'/g,"\\'")}')">🔍 ${p.name}</div>`).join('');
    sugBox.classList.add('show');
  });

  input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
  btn && btn.addEventListener('click', () => doSearch());
  document.addEventListener('click', e => { if (!e.target.closest('.search-wrap')) sugBox.classList.remove('show'); });
}

function doSearch(q) {
  const input = document.querySelector('.search-input');
  const catSelect = document.querySelector('.search-cat-select');
  const query = q || (input ? input.value.trim() : '');
  const cat = catSelect ? catSelect.value : 'All category';
  document.querySelector('.suggestions-box')?.classList.remove('show');
  if (query) { window.location.href = `products.html?q=${encodeURIComponent(query)}&cat=${encodeURIComponent(cat)}`; }
  else if (cat && cat !== 'All category') { window.location.href = `products.html?cat=${encodeURIComponent(cat)}`; }
  else { window.location.href = 'products.html'; }
}
window.doSearch = doSearch;

/* ---------- NAV CATEGORY DROPDOWN ---------- */
function initNavDropdown() {
  const allCat = document.querySelector('.nav-all-cat');
  const dropdown = document.querySelector('.cat-dropdown');
  if (!allCat || !dropdown) return;
  allCat.addEventListener('click', () => dropdown.classList.toggle('show'));
  document.addEventListener('click', e => { if (!e.target.closest('.nav-all-cat') && !e.target.closest('.cat-dropdown')) dropdown.classList.remove('show'); });
}

/* ---------- HERO CATEGORIES ---------- */
function initHeroCategories() {
  document.querySelectorAll('.hero-cats ul li').forEach(li => {
    li.addEventListener('click', () => {
      document.querySelectorAll('.hero-cats ul li').forEach(l => l.classList.remove('active'));
      li.classList.add('active');
    });
  });
}

/* ---------- CART SIDEBAR INIT ---------- */
function initCart() {
  document.querySelector('.cart-overlay')?.addEventListener('click', closeCart);
  document.querySelector('.cart-close')?.addEventListener('click', closeCart);
  document.querySelectorAll('.cart-icon').forEach(el => el.addEventListener('click', openCart));
  const checkoutBtn = document.querySelector('.btn-checkout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (!cart.length) { showToast('Your cart is empty', 'error'); return; }
      closeCart();
      window.location.href = 'checkout.html';
    });
  }
  updateCartBadge();
}

/* ---------- LOGIN MODAL INIT ---------- */
function initModal() {
  const overlay = document.querySelector('.modal-overlay');
  const closeBtn = document.querySelector('.modal-close');
  overlay?.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  closeBtn?.addEventListener('click', closeModal);
  document.querySelectorAll('.modal-tab').forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));
  document.querySelectorAll('.btn-join').forEach(btn => btn.addEventListener('click', () => openModal('register')));
  document.querySelectorAll('.btn-login').forEach(btn => btn.addEventListener('click', () => openModal('login')));
  const loginForm = document.querySelector('#login-form form');
  const regForm = document.querySelector('#register-form form');
  loginForm?.addEventListener('submit', handleLogin);
  regForm?.addEventListener('submit', handleRegister);
}

/* ---------- ACTION ITEMS (profile/message/orders) ---------- */
function initHeaderActions() {
  document.querySelector('.action-profile')?.addEventListener('click', () => {
    if (currentUser) showToast(`Logged in as ${currentUser.name}`, 'success');
    else openModal('login');
  });
  document.querySelector('.action-message')?.addEventListener('click', () => {
    if (!currentUser) { openModal('login'); return; }
    showToast('Messaging coming soon!');
  });
  document.querySelector('.action-orders')?.addEventListener('click', () => {
    if (!currentUser) { openModal('login'); return; }
    window.location.href = 'orders.html';
  });
}

/* ---------- NEWSLETTER ---------- */
function initNewsletter() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (input?.value.includes('@')) { showToast('Subscribed successfully! 🎉', 'success'); form.reset(); }
      else showToast('Please enter a valid email.', 'error');
    });
  });
}

/* ---------- QUOTE FORM ---------- */
function initQuoteForm() {
  document.querySelector('.quote-form-el')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Quote sent to suppliers! 🎉', 'success');
    e.target.reset();
  });
}

/* ---------- SCROLL ANIMATIONS ---------- */
function initScrollAnimations() {
  const els = document.querySelectorAll('.product-card-2, .product-card, .deal-card, .service-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.style.opacity = 1; e.target.style.transform = 'translateY(0)'; }
    });
  }, { threshold: 0.08 });
  els.forEach(el => {
    el.style.opacity = 0; el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity .4s ease, transform .4s ease, box-shadow .2s, border-color .2s';
    observer.observe(el);
  });
}

/* ---------- BOOT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initSearch();
  initNavDropdown();
  initHeroCategories();
  initCart();
  initModal();
  initHeaderActions();
  initNewsletter();
  initQuoteForm();
  updateUserPanel();
  setTimeout(initScrollAnimations, 100);
});
