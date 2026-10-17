/* catalogo.js — dibuja las tarjetas y filtra por categoría */
const PRODUCTOS = [
  {id:'camiseta', cat:'camisetas', icon:'shirt', clase:'category-shirt', nombre:'Camiseta personalizada', desc:'Con tu fotografía, logo o diseño.', precio:35000},
  {id:'gorra', cat:'gorras', icon:'hat-cowboy', clase:'category-cap', nombre:'Gorra personalizada', desc:'Una gorra completamente a tu estilo.', precio:30000},
  {id:'taza', cat:'tazas', icon:'mug-hot', clase:'category-mug', nombre:'Taza personalizada', desc:'Convierte tus fotos en recuerdos.', precio:20000},
  {id:'llavero', cat:'llaveros', icon:'key', clase:'category-key', nombre:'Llavero personalizado', desc:'Un detalle hecho para ti.', precio:10000},
  {id:'termo', cat:'termos', icon:'bottle-water', clase:'category-mug', nombre:'Termo personalizado', desc:'Tu diseño te acompaña a todas partes.', precio:38000},
  {id:'mousepad', cat:'hogar', icon:'computer-mouse', clase:'category-shirt', nombre:'Mouse pad personalizado', desc:'Para un escritorio con personalidad.', precio:25000},
  {id:'cojin', cat:'hogar', icon:'couch', clase:'category-key', nombre:'Cojín personalizado', desc:'Suave, decorativo y único.', precio:45000},
  {id:'rompecabezas', cat:'hogar', icon:'puzzle-piece', clase:'category-cap', nombre:'Rompecabezas personalizado', desc:'Tu foto favorita en mil piezas.', precio:28000}
];
const grid = document.getElementById('productGrid');
const money = n => '$' + n.toLocaleString('es-CO');

function pintar(filtro) {
  grid.innerHTML = PRODUCTOS.filter(p => filtro === 'todos' || p.cat === filtro).map(p => `
    <article class="product-card">
      <div class="product-photo ${p.clase}"><i class="fa-solid fa-${p.icon}"></i></div>
      <div class="product-info">
        <small>${p.cat.toUpperCase()}</small>
        <h3>${p.nombre}</h3>
        <p>${p.desc}</p>
        <div class="product-price">
          <strong>Desde ${money(p.precio)}</strong>
          <a href="personalizador.html?producto=${p.id}" aria-label="Personalizar ${p.nombre}"><i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </div>
    </article>`).join('');
}
document.querySelectorAll('.filter-btn').forEach(b => b.onclick = () => {
  document.querySelectorAll('.filter-btn').forEach(x => x.classList.remove('active'));
  b.classList.add('active'); pintar(b.dataset.filter);
});
pintar('todos');
