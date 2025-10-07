// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('navMenu');
navToggle?.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});

// LocalStorage cart helpers
const CART_KEY = 'efm_cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartCount();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  flashCart();
}

function updateCartCount() {
  const countEl = document.getElementById('cartCount');
  if (!countEl) return;
  const total = getCart().reduce((s, i) => s + i.qty, 0);
  countEl.textContent = total;
}

function flashCart() {
  const el = document.getElementById('cartCount');
  if (!el) return;
  el.classList.add('pulse');
  setTimeout(() => el.classList.remove('pulse'), 600);
}

// Attach add-to-cart listeners
document.querySelectorAll('.card .add-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const card = e.target.closest('.card');
    if (!card) return;
    const product = {
      id: card.dataset.id,
      name: card.dataset.name,
      price: parseFloat(card.dataset.price)
    };
    addToCart(product);
  });
});

// Search (redirect to products page with query)
document.getElementById('siteSearch')?.addEventListener('submit', e => {
  e.preventDefault();
  const q = (e.target.q.value || '').trim();
  if (q) {
    window.location.href = `products.html?search=${encodeURIComponent(q)}`;
  }
});

// Category click tracking (optional)
document.querySelectorAll('.categories a').forEach(a => {
  a.addEventListener('click', () => {
    localStorage.setItem('lastCategory', a.dataset.category);
  });
});

// Initialize
updateCartCount();

// Optional small style injection for pulse if not in CSS
const stylePulse = document.createElement('style');
stylePulse.textContent = `
  .cart-count.pulse { animation: cartPulse .6s ease; }
  @keyframes cartPulse {
    0% { transform: scale(1); background:transparent; }
    40% { transform: scale(1.35); background:#ff9d25; color:#000; border-radius:12px; padding:0 .3rem; }
    100% { transform: scale(1); background:transparent; }
  }
`;
document.head.appendChild(stylePulse);