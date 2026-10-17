/* vista3d.js — visor 3D real (Three.js se descarga solo al abrirlo) */
window.MUVI3D = (() => {
  let renderer, scene, camera, group, raf, drag = null, auto = true, host, onResize;
  const load = () => new Promise((ok, err) => {
    if (window.THREE) return ok();
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s.onload = ok; s.onerror = () => err(new Error('three')); document.head.appendChild(s);
  });
  const tex = c => { const t = new THREE.CanvasTexture(c); t.anisotropy = 8; t.encoding = THREE.sRGBEncoding; return t; };
  const CURVE = {camiseta:.35, gorra:.9, cojin:1.1, mousepad:.05, rompecabezas:.05, llavero:.12};
  const GAP = {camiseta:.5, cojin:.35};

  function plane(c, flip, d) {
    const geo = new THREE.PlaneGeometry(7, 7, 48, 48), pos = geo.attributes.position, k = CURVE[d.id] ?? .1;
    for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i); pos.setZ(i, k * (Math.cos(x / 3.5 * Math.PI / 2) * .8 + .2 - y * y / 60)); }
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({map: tex(c), transparent: true, alphaTest: .08, roughness: d.kind === 'gloss' ? .3 : .85, metalness: 0}));
    const gp = (GAP[d.id] ?? .15) / 2;
    if (flip) { m.rotation.y = Math.PI; m.position.z = -gp; } else m.position.z = gp;
    return m;
  }
  function cylinder(d) {
    const R = d.R, H = d.H;
    const side = new THREE.MeshStandardMaterial({map: tex(d.side), roughness: .25, metalness: 0});
    const cap = new THREE.MeshStandardMaterial({color: d.color, roughness: .4});
    const body = new THREE.Mesh(new THREE.CylinderGeometry(R, d.id === 'termo' ? R * .96 : R, H, 96, 1), [side, cap, cap]);
    body.rotation.y = Math.PI; group.add(body);
    if (d.id === 'taza') {
      const h = new THREE.Mesh(new THREE.TorusGeometry(H * .26, H * .07, 16, 40, Math.PI), new THREE.MeshStandardMaterial({color: d.color, roughness: .25}));
      h.rotation.z = -Math.PI / 2; h.position.x = R - .02; group.add(h);
    } else {
      const lid = new THREE.Mesh(new THREE.CylinderGeometry(R * .82, R * .82, .5, 48), new THREE.MeshStandardMaterial({color: 0x2a2330, roughness: .4, metalness: .5}));
      lid.position.y = H / 2 + .25; group.add(lid);
    }
  }
  function start(d) {
    host = document.getElementById('m3view'); host.innerHTML = '';
    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    host.appendChild(renderer.domElement); renderer.domElement.style.touchAction = 'none';
    scene = new THREE.Scene(); camera = new THREE.PerspectiveCamera(35, 1, .1, 100); camera.position.z = 15;
    scene.add(new THREE.HemisphereLight(0xffffff, 0xd9c3e0, .95));
    const l1 = new THREE.DirectionalLight(0xffffff, .9); l1.position.set(4, 6, 8); scene.add(l1);
    const l2 = new THREE.DirectionalLight(0xffffff, .4); l2.position.set(-5, 2, 4); scene.add(l2);
    group = new THREE.Group(); scene.add(group);
    if (d.wrap) cylinder(d); else { group.add(plane(d.front, false, d)); group.add(plane(d.back, true, d)); }
    reset(d);
    const size = () => { const w = host.clientWidth, h = host.clientHeight; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); };
    onResize = size; size(); addEventListener('resize', size);
    const el = renderer.domElement;
    el.onpointerdown = e => { drag = {x: e.clientX, y: e.clientY}; auto = false; el.setPointerCapture(e.pointerId); };
    el.onpointermove = e => { if (!drag) return; group.rotation.y += (e.clientX - drag.x) * .01; group.rotation.x = Math.max(-.7, Math.min(.7, group.rotation.x + (e.clientY - drag.y) * .01)); drag = {x: e.clientX, y: e.clientY}; };
    el.onpointerup = el.onpointercancel = () => drag = null;
    el.onwheel = e => { e.preventDefault(); camera.position.z = Math.max(8, Math.min(24, camera.position.z + e.deltaY * .01)); };
    const loop = () => { raf = requestAnimationFrame(loop); if (auto && !drag) group.rotation.y += .006; renderer.render(scene, camera); };
    loop();
  }
  function reset(d) { group.rotation.set(.1, d && d.wrap ? 0 : .4, 0); camera.position.z = 15; auto = true; }
  let last;
  async function open(d) {
    last = d; document.getElementById('modal3d').classList.add('show');
    try { await load(); start(d); } catch (e) { close(); throw e; }
  }
  function close() {
    cancelAnimationFrame(raf); removeEventListener('resize', onResize);
    if (renderer) { renderer.dispose(); renderer.domElement.remove(); renderer = null; }
    document.getElementById('modal3d').classList.remove('show');
  }
  document.addEventListener('click', e => {
    if (e.target.id === 'close3d' || e.target.id === 'modal3d') close();
    if (e.target.id === 'm3auto') auto = !auto;
    if (e.target.id === 'm3reset' && group) reset(last);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  return {open, close};
})();
