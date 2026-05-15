/* ===== PRODUCT DETAIL PAGE JS ===== */
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id'));
  const product = (typeof PRODUCTS !== 'undefined' ? PRODUCTS : []).find(p => p.id === productId);

  if (!product) {
    document.getElementById('detail-root').innerHTML = `<div style="text-align:center;padding:80px"><h2>Product not found</h2><p>The product you are looking for does not exist.</p><a href="products.html" style="color:var(--blue)">← Back to products</a></div>`;
    return;
  }

  // Title & Meta
  document.title = product.name + ' - AA Mart';
  const bcProduct = document.getElementById('bc-product');
  if (bcProduct) bcProduct.textContent = product.name.slice(0, 40) + '...';
  const bcCat = document.getElementById('bc-cat');
  if (bcCat) { bcCat.textContent = product.category; bcCat.href = `products.html?cat=${encodeURIComponent(product.category)}`; }

  // Main image
  const mainImg = document.getElementById('main-img');
  if (mainImg) {
    mainImg.src = product.img;
    mainImg.alt = product.name;
    mainImg.onerror = function() { this.style.display = 'none'; document.getElementById('main-img-placeholder').style.display = 'flex'; };
  }

  // Thumbnails — show different images per product subcategory
  const thumbContainer = document.getElementById('thumbnails');
  if (thumbContainer) {
    const galleryPool = {
      'Smartphones': [
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80&auto=format&fit=crop',
      ],
      'Laptops': [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&q=80&auto=format&fit=crop',
      ],
      'Wearables': [
        'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1617625802912-cde586faf4c3?w=400&q=80&auto=format&fit=crop',
      ],
      'Audio': [
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1599669454699-248893623440?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&q=80&auto=format&fit=crop',
      ],
      'Cameras': [
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1617483786823-6bb7f46ccf98?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1547954575-855750c57bd3?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1601758065893-25c11c2a1a9d?w=400&q=80&auto=format&fit=crop',
      ],
      'Tablets': [
        'https://images.unsplash.com/photo-1589739900579-59bb5b33e1be?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1623126908029-58cb08a2b272?w=400&q=80&auto=format&fit=crop',
      ],
      "Men's Clothing": [
        'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&auto=format&fit=crop',
      ],
      "Women's Clothing": [
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&auto=format&fit=crop',
      ],
      'Footwear': [
        'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80&auto=format&fit=crop',
      ],
      'Accessories': [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1591348122449-02525d70379b?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1505022610485-0249ba5b3675?w=400&q=80&auto=format&fit=crop',
      ],
      'Furniture': [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&q=80&auto=format&fit=crop',
      ],
      'Kitchen': [
        'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1481671703460-040cb8a2d909?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1607877361964-d8a3e332b9b0?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400&q=80&auto=format&fit=crop',
      ],
      'Yoga': [
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&q=80&auto=format&fit=crop',
      ],
      'Fitness': [
        'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80&auto=format&fit=crop',
      ],
    };

    const pool = (galleryPool[product.sub] || []).filter(u => u !== product.img);
    const thumbImgs = [product.img, ...pool].slice(0, 4);
    while (thumbImgs.length < 4) thumbImgs.push(product.img);

    thumbContainer.innerHTML = thumbImgs.map((src, i) => `
      <div class="thumbnail ${i === 0 ? 'active' : ''}" onclick="switchImage('${src}',this)">
        <img src="${src}" alt="thumbnail ${i+1}" onerror="this.parentElement.style.background='#f0f0f0'">
      </div>
    `).join('');
  }

  // Title
  const titleEl = document.getElementById('detail-title');
  if (titleEl) titleEl.textContent = product.name;

  // Rating
  const ratingEl = document.getElementById('detail-rating');
  if (ratingEl) ratingEl.innerHTML = `
    <span class="stars">★★★★★</span>
    <span class="rating-score">${product.rating}</span>
    <span class="rating-count">|</span>
    <span class="rating-reviews">${Math.floor(Math.random()*800+200)} reviews</span>
    <span class="rating-count">|</span>
    <span>${product.sold} orders</span>
    <span class="rating-count">|</span>
    <span style="color:var(--green)">● In Stock</span>
  `;

  // Price
  const priceEl = document.getElementById('detail-price');
  const discountVal = Math.round((1 - product.price / product.oldPrice) * 100);
  if (priceEl) priceEl.innerHTML = `
    <span class="detail-price-current">$${product.price}</span>
    <span class="detail-price-old">$${product.oldPrice}</span>
    <span class="detail-price-badge">-${discountVal}%</span>
    <div class="detail-price-note">Price for 1-10 pieces. Bulk pricing available below.</div>
  `;

  // Bulk pricing
  const bulkEl = document.getElementById('bulk-pricing');
  if (bulkEl) {
    const p1 = product.price, p2 = (product.price * 0.93).toFixed(2), p3 = (product.price * 0.87).toFixed(2);
    bulkEl.innerHTML = `
      <div class="bulk-pricing"><h4>Bulk Pricing</h4><div class="bulk-grid">
        <div class="bulk-item"><div class="bulk-qty">1-9 pcs</div><div class="bulk-price">$${p1}</div></div>
        <div class="bulk-item"><div class="bulk-qty">10-49 pcs</div><div class="bulk-price">$${p2}</div></div>
        <div class="bulk-item"><div class="bulk-qty">50+ pcs</div><div class="bulk-price">$${p3}</div></div>
      </div></div>
    `;
  }

  // Options
  const optionsEl = document.getElementById('detail-options');
  if (optionsEl) {
    const isFashion = product.category === 'Fashion';
    const isShirt = product.sub && (product.sub.includes('Clothing') || product.sub === 'Footwear');

    const colorMap = {
      'Black':  { hex: '#1c1c1c', border: 'none' },
      'White':  { hex: '#f5f5f5', border: '1.5px solid #ccc' },
      'Navy':   { hex: '#1a237e', border: 'none' },
      'Gray':   { hex: '#9e9e9e', border: 'none' },
      'Red':    { hex: '#c62828', border: 'none' },
      'Blue':   { hex: '#1565c0', border: 'none' },
      'Green':  { hex: '#2e7d32', border: 'none' },
      'Pink':   { hex: '#e91e8c', border: 'none' },
      'Yellow': { hex: '#f9a825', border: 'none' },
      'Purple': { hex: '#6a1b9a', border: 'none' },
      'Orange': { hex: '#e65100', border: 'none' },
      'Brown':  { hex: '#6d4c41', border: 'none' },
      'Silver': { hex: '#bdbdbd', border: '1.5px solid #aaa' },
      'Gold':   { hex: '#FFD700', border: '1.5px solid #ccc' },
    };

    function colorChip(name, idx, groupId) {
      const c = colorMap[name] || { hex: '#999', border: 'none' };
      return `<span class="option-chip color-chip ${idx===0?'active':''}" onclick="selectChip(this,'${groupId}')"><span class="color-swatch-dot" style="background:${c.hex};border:${c.border}"></span>${name}</span>`;
    }

    let html = '';
    if (isFashion && isShirt) {
      if (product.sub !== 'Footwear') {
        html += `<div class="option-label">Size:</div>
          <div class="option-chips" id="size-chips">
            ${['XS','S','M','L','XL','2XL','3XL'].map((s,i) => `<span class="option-chip ${i===2?'active':''}" onclick="selectChip(this,'size-chips')">${s}</span>`).join('')}
          </div>`;
      } else {
        html += `<div class="option-label">Size (EU):</div>
          <div class="option-chips" id="size-chips">
            ${['36','37','38','39','40','41','42','43','44'].map((s,i) => `<span class="option-chip ${i===3?'active':''}" onclick="selectChip(this,'size-chips')">${s}</span>`).join('')}
          </div>`;
      }
      const fashionColors = ['Black','White','Navy','Gray','Red','Blue','Green','Pink'];
      html += `<div class="option-label">Color:</div>
        <div class="option-chips" id="color-chips">
          ${fashionColors.map((c,i) => colorChip(c, i, 'color-chips')).join('')}
        </div>`;
    } else {
      const generalColors = ['Black','White','Gray','Blue','Red','Silver','Gold','Green'];
      html += `<div class="option-label">Color:</div>
        <div class="option-chips" id="color-chips">
          ${generalColors.map((c,i) => colorChip(c, i, 'color-chips')).join('')}
        </div>`;
      html += `<div class="option-label" style="margin-top:12px">Variant:</div>
        <div class="option-chips" id="variant-chips">
          ${['Standard','Bundle x2','Bundle x3'].map((v,i) => `<span class="option-chip ${i===0?'active':''}" onclick="selectChip(this,'variant-chips')">${v}</span>`).join('')}
        </div>`;
    }
    optionsEl.innerHTML = html;
  }

  // Wishlist btn
  const wishBtn = document.getElementById('wish-btn');
  if (wishBtn) {
    const wished = (store.get('aamart_wishlist') || []).includes(product.id);
    wishBtn.textContent = wished ? '♥' : '♡';
    wishBtn.classList.toggle('active', wished);
    wishBtn.onclick = () => toggleWishlist(product.id, wishBtn);
  }

  // Add to Cart
  document.getElementById('add-cart-btn')?.addEventListener('click', () => {
    const qty = parseInt(document.querySelector('.qty-input')?.value || '1');
    for (let i = 0; i < qty; i++) addToCart(product.id, product.name, product.price, product.emoji, product.img);
  });

  // Buy Now
  document.getElementById('buy-btn')?.addEventListener('click', () => {
    const qty = parseInt(document.querySelector('.qty-input')?.value || '1');
    for (let i = 0; i < qty; i++) addToCart(product.id, product.name, product.price, product.emoji, product.img);
    openCart();
  });

  // Related products
  const relGrid = document.getElementById('related-grid');
  if (relGrid) {
    const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 5);
    relGrid.innerHTML = related.map(p => `
      <div class="related-card" onclick="location.href='product-detail.html?id=${p.id}'">
        <div class="related-thumb">
          <img src="${p.img}" alt="${p.name}" onerror="this.style.display='none';this.parentElement.innerHTML='<div style=\\"display:flex;align-items:center;justify-content:center;height:100%;font-size:40px\\">${p.emoji}</div>'">
        </div>
        <div class="related-info">
          <div class="related-price">$${p.price}</div>
          <div class="related-name">${p.name}</div>
        </div>
      </div>
    `).join('');
  }

  // Description
  const descEl = document.getElementById('desc-content');
  if (descEl) descEl.innerHTML = `
    <p style="margin-bottom:12px">High-quality ${product.name} available at competitive wholesale prices. Perfect for B2B buyers looking for reliable supply.</p>
    <ul style="list-style:disc;padding-left:24px;line-height:2;color:#555">
      <li>Category: ${product.category} › ${product.sub}</li>
      <li>Original Price: $${product.oldPrice} — Your Price: $${product.price}</li>
      <li>Rating: ${product.rating}/5 from ${product.sold} verified buyers</li>
      <li>Ships within 3–7 business days</li>
      <li>Minimum order quantity: 1 piece (bulk discounts from 10 pcs)</li>
      <li>Quality inspected before shipment</li>
      <li>30-day return policy on all items</li>
    </ul>
  `;

  // Rating bars
  initRatingBars();

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab)?.classList.add('active');
    });
  });
});

function switchImage(src, thumb) {
  const mainImg = document.getElementById('main-img');
  if (mainImg) { mainImg.src = src; mainImg.style.display = ''; document.getElementById('main-img-placeholder').style.display = 'none'; }
  document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
}
window.switchImage = switchImage;

function selectChip(chip, groupId) {
  document.querySelectorAll(`#${groupId} .option-chip`).forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
}
window.selectChip = selectChip;

function initRatingBars() {
  const bars = document.querySelectorAll('.rating-bar-fill');
  const values = [72, 18, 6, 3, 1];
  bars.forEach((bar, i) => {
    setTimeout(() => { bar.style.width = values[i] + '%'; }, 300 + i * 80);
  });
}

// Quantity control
document.addEventListener('DOMContentLoaded', () => {
  const qtyInput = document.querySelector('.qty-input');
  document.querySelector('.qty-minus')?.addEventListener('click', () => {
    const v = parseInt(qtyInput?.value || '1');
    if (qtyInput && v > 1) qtyInput.value = v - 1;
  });
  document.querySelector('.qty-plus')?.addEventListener('click', () => {
    const v = parseInt(qtyInput?.value || '1');
    if (qtyInput) qtyInput.value = v + 1;
  });
});
