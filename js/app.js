// =========================
// Silveira's Club · #BUMBA
// =========================

const STORAGE = {
  user: 'bumba_user',
  appts: 'bumba_appts'
};

const state = {
  user: null,
  appts: [],
  currentTab: 'home',
  booking: { service: null, barber: null, date: null, time: null, _flow: null },
  apptTab: 'next'
};

const $app = document.getElementById('app');
const $toast = document.getElementById('toast');

// -------- helpers --------
function $(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const k in attrs) {
    if (k === 'class') el.className = attrs[k];
    else if (k === 'html') el.innerHTML = attrs[k];
    else if (k === 'style' && typeof attrs[k] === 'object') Object.assign(el.style, attrs[k]);
    else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
    else el.setAttribute(k, attrs[k]);
  }
  children.flat().forEach(c => {
    if (c == null || c === false) return;
    el.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(c) : c);
  });
  return el;
}

function toast(msg) {
  $toast.textContent = msg;
  $toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => $toast.classList.remove('show'), 2400);
}

function load() {
  try {
    state.user = JSON.parse(localStorage.getItem(STORAGE.user) || 'null');
    state.appts = JSON.parse(localStorage.getItem(STORAGE.appts) || '[]');
  } catch (e) {}
}

function save() {
  localStorage.setItem(STORAGE.user, JSON.stringify(state.user));
  localStorage.setItem(STORAGE.appts, JSON.stringify(state.appts));
}

function initials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

function fmtMoney(v) { return 'R$ ' + v.toFixed(2).replace('.', ','); }

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function formatApptDate(iso) {
  const d = new Date(iso);
  const today = new Date(); today.setHours(0,0,0,0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate()+1);
  const ds = new Date(iso); ds.setHours(0,0,0,0);
  if (ds.getTime() === today.getTime()) return 'Hoje';
  if (ds.getTime() === tomorrow.getTime()) return 'Amanhã';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

// -------- SVG icons --------
const I = {
  search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>',
  scissors: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12"/></svg>',
  back: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="m15 18-6-6 6-6"/></svg>',
  chev: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m9 18 6-6-6-6"/></svg>',
  star: '★',
  pin: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  clock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  phone: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  ig: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01"/></svg>',
  whats: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></svg>',
  card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>',
  check: '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
};

// =========================
// ROUTER
// =========================
function render() {
  $app.innerHTML = '';
  if (!state.user) return renderAuth();
  if (state.booking._flow === 'success') return renderSuccess();
  if (state.booking._flow) return renderBooking();
  renderMain();
}

// =========================
// SPLASH
// =========================
function renderSplash() {
  $app.innerHTML = '';
  const el = $('div', { class: 'splash' },
    $('img', { class: 'splash-mascot', src: 'logobumba.jpg', alt: 'Bumba' }),
    $('div', { class: 'splash-brand' }, "Silveira's Club"),
    $('div', { class: 'splash-slogan' }, '#BUMBA'),
    $('div', { class: 'spinner' })
  );
  $app.appendChild(el);
}

// =========================
// AUTH
// =========================
let authMode = 'login';

function renderAuth() {
  const wrap = $('div', { class: 'auth fade-in' });

  wrap.appendChild($('img', { class: 'auth-mascot', src: 'logobumba.jpg', alt: 'Bumba' }));
  wrap.appendChild($('div', { class: 'auth-brand' }, "Silveira's Club"));
  wrap.appendChild($('div', { class: 'auth-slogan' }, '#BUMBA'));

  if (authMode === 'login') {
    wrap.appendChild($('h2', {}, 'Seja bem-vindo'));
    wrap.appendChild($('p', { class: 'auth-desc' }, 'Entre e agende seu horário no clube'));

    const phone = $('input', { type: 'tel', class: 'input', placeholder: '(85) 99999-9999' });
    const pass = $('input', { type: 'password', class: 'input', placeholder: 'Senha' });
    wrap.appendChild(group('Telefone', phone));
    wrap.appendChild(group('Senha', pass));

    wrap.appendChild($('button', {
      class: 'btn btn-primary',
      style: 'margin-top: 12px',
      onclick: () => {
        if (!phone.value) return toast('Informe o telefone');
        state.user = { name: 'Cliente', phone: phone.value, email: '' };
        save(); render();
      }
    }, 'Entrar'));

    wrap.appendChild($('div', { class: 'auth-switch', html: 'Primeira vez aqui? <a id="go-signup">Criar conta</a>' }));
    wrap.querySelector('#go-signup').onclick = () => { authMode = 'signup'; render(); };
  } else {
    wrap.appendChild($('h2', {}, 'Criar conta'));
    wrap.appendChild($('p', { class: 'auth-desc' }, 'Cadastre-se pra entrar no clube do Bumba'));

    const name = $('input', { type: 'text', class: 'input', placeholder: 'Seu nome' });
    const phone = $('input', { type: 'tel', class: 'input', placeholder: '(85) 99999-9999' });
    const email = $('input', { type: 'email', class: 'input', placeholder: 'email@exemplo.com' });
    const pass = $('input', { type: 'password', class: 'input', placeholder: 'Crie uma senha' });

    wrap.appendChild(group('Nome completo', name));
    wrap.appendChild(group('Telefone', phone));
    wrap.appendChild(group('E-mail', email));
    wrap.appendChild(group('Senha', pass));

    wrap.appendChild($('button', {
      class: 'btn btn-primary',
      style: 'margin-top: 12px',
      onclick: () => {
        if (!name.value || !phone.value) return toast('Preencha nome e telefone');
        state.user = { name: name.value, phone: phone.value, email: email.value };
        save();
        toast('Bem-vindo ao clube! 🧸');
        render();
      }
    }, 'Entrar no clube'));

    wrap.appendChild($('div', { class: 'auth-switch', html: 'Já é do clube? <a id="go-login">Entrar</a>' }));
    wrap.querySelector('#go-login').onclick = () => { authMode = 'login'; render(); };
  }

  $app.appendChild(wrap);
}

function group(label, input) {
  return $('div', { class: 'input-group' },
    $('label', {}, label),
    input
  );
}

// =========================
// BOOT
// =========================
function bootBumba() {
  load();
  renderSplash();
  setTimeout(() => render(), 1000);
}
