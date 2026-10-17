/* app.js — se carga en TODAS las páginas */
(() => {
  const count = () => {
    let n = 0;
    try { n = JSON.parse(localStorage.getItem('muviCart') || '[]').reduce((a, i) => a + (i.qty || 1), 0); } catch {}
    document.querySelectorAll('#cartCount').forEach(c => c.textContent = n);
  };
  count();
  window.addEventListener('storage', count);
})();
