(() => {
const WHATSAPP = '573000000000'; // ← cambia por tu número con indicativo (57 = Colombia)
const $ = id => document.getElementById(id);
const money = n => '$' + n.toLocaleString('es-CO');
let cart = JSON.parse(localStorage.getItem('muviCart') || '[]');
const save = () => { localStorage.setItem('muviCart', JSON.stringify(cart)); render(); };

function render(){
  const n = cart.reduce((a,i) => a + (i.qty||1), 0);
  const total = cart.reduce((a,i) => a + i.precio * (i.qty||1), 0);
  document.querySelectorAll('#cartCount').forEach(c => c.textContent = n);
  $('cartLayout').style.display = cart.length ? 'grid' : 'none';
  $('emptyCart').style.display = cart.length ? 'none' : 'block';
  $('sumCount').textContent = n; $('sumTotal').textContent = money(total);
  $('items').innerHTML = cart.map(i => `
    <div class="cart-item">
      <img src="${i.img}" alt="${i.producto}">
      <div>
        <h3>${i.producto}</h3>
        <small><span class="dot" style="background:${i.color}"></span> ${[i.colorName,i.talla,i.zona].filter(Boolean).join(' · ')}</small>
        <div class="price">${money(i.precio * (i.qty||1))}</div>
        <div class="qty"><button data-a="-" data-id="${i.id}">−</button><b>${i.qty||1}</b><button data-a="+" data-id="${i.id}">+</button></div>
      </div>
      <button class="rm" data-a="x" data-id="${i.id}" aria-label="Quitar"><i class="fa-solid fa-trash"></i></button>
    </div>`).join('');
}
$('items').onclick = e => {
  const b = e.target.closest('button'); if(!b) return;
  const it = cart.find(i => i.id == b.dataset.id); if(!it) return;
  if(b.dataset.a === 'x') cart = cart.filter(i => i !== it);
  else it.qty = Math.max(1, (it.qty||1) + (b.dataset.a === '+' ? 1 : -1));
  save();
};
$('sendWa').onclick = () => {
  const lines = cart.map(i => `• ${i.producto} (${[i.talla,i.colorName,i.zona].filter(Boolean).join(', ')}) x${i.qty||1} — ${money(i.precio*(i.qty||1))}`);
  const total = cart.reduce((a,i) => a + i.precio*(i.qty||1), 0);
  const note = $('notes').value.trim();
  const msg = `¡Hola MUVI! Quiero hacer este pedido personalizado:\n${lines.join('\n')}\nTotal estimado: ${money(total)}${note ? '\nNota: ' + note : ''}\n\nTe envío mis diseños por este chat.`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
};
render();
})();
