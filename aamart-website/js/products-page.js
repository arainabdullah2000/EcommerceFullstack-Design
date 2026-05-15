/* ===== PRODUCTS PAGE JS ===== */
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  let currentQuery = params.get('q') || '';
  let currentCat = params.get('cat') || 'All category';
  let currentSort = 'Best Match';
  let priceMin = '', priceMax = '';
  let selectedSubs = [];

  // set search bar values
  const searchInput = document.querySelector('.search-input');
  const catSelect = document.querySelector('.search-cat-select');
  if (searchInput) searchInput.value = currentQuery;
  if (catSelect) catSelect.value = currentCat;

  // update breadcrumb
  const breadcrumb = document.getElementById('bc-cat');
  if (breadcrumb) breadcrumb.textContent = currentCat !== 'All category' ? currentCat : 'All Products';
  const breadSep = document.getElementById('bc-search');
  const breadTerm = document.getElementById('bc-search-term');
  if (currentQuery) {
    if (breadSep) breadSep.style.display = '';
    if (breadTerm) { breadTerm.style.display = ''; breadTerm.textContent = `"${currentQuery}"`; }
  }

  function getFiltered() {
    let items = [...PRODUCTS];
    if (currentQuery) items = items.filter(p => p.name.toLowerCase().includes(currentQuery.toLowerCase()));
    if (currentCat && currentCat !== 'All category') items = items.filter(p => p.category === currentCat);
    if (priceMin) items = items.filter(p => p.price >= parseFloat(priceMin));
    if (priceMax) items = items.filter(p => p.price <= parseFloat(priceMax));
    if (selectedSubs.length) items = items.filter(p => selectedSubs.includes(p.sub));
    switch (currentSort) {
      case 'Price ↑': items.sort((a,b) => a.price - b.price); break;
      case 'Price ↓': items.sort((a,b) => b.price - a.price); break;
      case 'Newest': items.sort((a,b) => b.id - a.id); break;
      case 'Orders': items.sort((a,b) => parseFloat(b.sold) - parseFloat(a.sold)); break;
    }
    return items;
  }

  function renderProducts() {
    const grid = document.getElementById('products-grid');
    const countEl = document.querySelector('.results-count');
    if (!grid) return;
    const items = getFiltered();
    if (countEl) countEl.textContent = items.length + ' results found';
    if (!items.length) {
      grid.innerHTML = `<div class="empty-results" style="grid-column:1/-1"><div class="icon">🔍</div><h3>No products found</h3><p>Try adjusting your search or filters</p><button class="filter-apply" onclick="clearAllFilters()">Clear filters</button></div>`;
      return;
    }
    grid.innerHTML = items.map(p => {
      const isWished = (store.get('aamart_wishlist') || []).includes(p.id);
      const badgeClass = p.badge === 'HOT' ? 'hot-badge' : p.badge === 'NEW' ? 'new-badge' : '';
      return `
        <div class="product-card-2" onclick="location.href='product-detail.html?id=${p.id}'">
          <div class="product-thumb">
            <img src="${p.img}" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <div class="product-thumb-placeholder" style="display:none">${p.emoji}</div>
          </div>
          ${p.badge ? `<span class="product-badge ${badgeClass}">${p.badge}</span>` : ''}
          <button class="product-wishlist ${isWished ? 'active' : ''}" onclick="event.stopPropagation();toggleWishlistBtn(${p.id},this)">${isWished ? '♥' : '♡'}</button>
          <div class="product-info">
            <div class="product-title">${p.name}</div>
            <div class="product-price-row">
              <span class="price-current">$${p.price}</span>
              <span class="price-old">$${p.oldPrice}</span>
            </div>
            <div class="product-meta">
              <span><span class="stars">★★★★★</span> ${p.rating}</span>
              <span>${p.sold} sold</span>
            </div>
          </div>
          <button class="add-to-cart" onclick="event.stopPropagation();addToCart(${p.id},'${p.name.replace(/'/g,"\\'")}',${p.price},'${p.emoji}','${p.img}')">Add to cart</button>
        </div>
      `;
    }).join('');
    setTimeout(() => initScrollAnimations(), 50);
  }

  function toggleWishlistBtn(id, btn) { toggleWishlist(id, btn); }
  window.toggleWishlistBtn = toggleWishlistBtn;

  function clearAllFilters() {
    currentQuery = ''; currentCat = 'All category'; priceMin = ''; priceMax = ''; selectedSubs = [];
    if (searchInput) searchInput.value = '';
    if (catSelect) catSelect.value = 'All category';
    document.querySelectorAll('.filter-option input[type=checkbox]').forEach(cb => cb.checked = false);
    renderProducts();
  }
  window.clearAllFilters = clearAllFilters;

  // Sort buttons
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSort = btn.textContent.trim();
      renderProducts();
    });
  });

  // Category filter checkboxes
  document.querySelectorAll('.filter-cat').forEach(cb => {
    cb.addEventListener('change', () => {
      currentCat = cb.checked ? cb.value : 'All category';
      document.querySelectorAll('.filter-cat').forEach(c => { if (c !== cb) c.checked = false; });
      renderProducts();
    });
  });

  // Sub-category checkboxes
  document.querySelectorAll('.filter-sub').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) { if (!selectedSubs.includes(cb.value)) selectedSubs.push(cb.value); }
      else { selectedSubs = selectedSubs.filter(s => s !== cb.value); }
      renderProducts();
    });
  });

  // Price range
  document.querySelector('.filter-apply')?.addEventListener('click', () => {
    priceMin = document.querySelector('#price-min')?.value || '';
    priceMax = document.querySelector('#price-max')?.value || '';
    renderProducts();
    showToast('Filters applied!', 'success');
  });

  // Price quick filters
  document.querySelectorAll('.price-quick').forEach(cb => {
    cb.addEventListener('change', () => {
      document.querySelectorAll('.price-quick').forEach(c => { if (c !== cb) c.checked = false; });
      if (cb.checked) { priceMin = cb.dataset.min || ''; priceMax = cb.dataset.max || ''; }
      else { priceMin = ''; priceMax = ''; }
      renderProducts();
    });
  });

  // View toggle
  document.querySelector('#view-grid')?.addEventListener('click', () => {
    document.querySelector('#view-grid').classList.add('active');
    document.querySelector('#view-list')?.classList.remove('active');
    const grid = document.getElementById('products-grid');
    if (grid) grid.style.gridTemplateColumns = 'repeat(4,1fr)';
  });
  document.querySelector('#view-list')?.addEventListener('click', () => {
    document.querySelector('#view-list').classList.add('active');
    document.querySelector('#view-grid')?.classList.remove('active');
    const grid = document.getElementById('products-grid');
    if (grid) grid.style.gridTemplateColumns = '1fr';
  });

  // Color dots
  document.querySelectorAll('.color-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      dot.closest('.color-options').querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });

  // set initial cat checkbox
  if (currentCat && currentCat !== 'All category') {
    const cb = document.querySelector(`.filter-cat[value="${currentCat}"]`);
    if (cb) cb.checked = true;
  }

  renderProducts();
});
