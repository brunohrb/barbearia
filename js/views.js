// =========================
// Main + bottom nav
// =========================
function renderMain() {
  const wrap = $('div', { class: 'fade-in' });
  if (state.currentTab === 'home') wrap.appendChild(renderHome());
  else if (state.currentTab === 'services') wrap.appendChild(renderServices());
  else if (state.currentTab === 'appts') wrap.appendChild(renderAppts());
  else if (state.currentTab === 'profile') wrap.appendChild(renderProfile());
  wrap.appendChild(renderBottomNav());
  $app.appendChild(wrap);
}

function renderBottomNav() {
  const tabs = [
    { id: 'home', label: 'Início', icon: I.home },
    { id: 'services', label: 'Serviços', icon: I.scissors },
    { id: 'appts', label: 'Agenda', icon: I.calendar },
    { id: 'profile', label: 'Perfil', icon: I.user }
  ];
  const nav = $('nav', { class: 'bottom-nav' });
  tabs.forEach(t => {
    const item = $('button', {
      class: 'nav-item' + (state.currentTab === t.id ? ' active' : ''),
      onclick: () => { state.currentTab = t.id; render(); }
    });
    item.innerHTML = t.icon + `<span>${t.label}</span>`;
    nav.appendChild(item);
  });
  return nav;
}

// =========================
// HOME
// =========================
function renderHome() {
  const wrap = $('div', {});

  // Top bar (usuário)
  const topbar = $('div', { class: 'topbar' },
    $('div', { class: 'greeting' },
      $('div', { class: 'hi' }, `${greeting()},`),
      $('div', { class: 'name' }, state.user.name.split(' ')[0] + ' 👋')
    ),
    $('div', {
      class: 'avatar', onclick: () => { state.currentTab = 'profile'; render(); }
    }, initials(state.user.name))
  );
  wrap.appendChild(topbar);

  // Hero da barbearia
  const hero = $('div', { class: 'hero' });
  hero.innerHTML = `
    <div class="hero-deco"></div>
    <div class="hero-content">
      <img class="hero-mascot" src="logobumba.jpg" alt="Bumba" />
      <div class="hero-brand">
        <h1>${SHOP.name}</h1>
        <div class="hero-slogan">${SHOP.tagline}</div>
      </div>
      <div class="hero-meta">
        <span>${I.star} ${SHOP.rating} · ${SHOP.reviews} avaliações</span>
      </div>
    </div>
  `;
  wrap.appendChild(hero);

  // CTA principal
  wrap.appendChild($('div', { style: 'padding: 16px 20px 0' },
    $('button', {
      class: 'btn btn-primary btn-block',
      style: 'background: linear-gradient(135deg, #ff8152, #ff6b35); color: white; box-shadow: 0 8px 30px rgba(255,107,53,0.35);',
      onclick: () => startBooking()
    }, '💈  Agendar meu horário')
  ));

  // Próximo agendamento
  const next = state.appts
    .filter(a => a.status === 'confirmed' && new Date(a.date) >= new Date(new Date().toDateString()))
    .sort((a,b) => new Date(a.date) - new Date(b.date))[0];

  if (next) {
    const card = $('div', { class: 'next-appt', onclick: () => { state.currentTab = 'appts'; render(); } });
    card.innerHTML = `
      <div class="next-icon">📅</div>
      <div class="next-info">
        <div class="next-label">Seu próximo horário</div>
        <div class="next-title">${next.serviceName}</div>
        <div class="next-when">${formatApptDate(next.date)} às ${next.time} · com ${next.barberName}</div>
      </div>
      <div class="chev">${I.chev}</div>
    `;
    wrap.appendChild($('div', { class: 'section' }, card));
  }

  // Serviços em destaque
  const sec1 = $('div', { class: 'section' });
  sec1.appendChild($('div', { class: 'section-head' },
    $('h3', {}, 'Nossos serviços'),
    $('a', { onclick: () => { state.currentTab = 'services'; render(); } }, 'Ver todos')
  ));
  const svcGrid = $('div', { class: 'svc-grid' });
  SHOP.services.slice(0, 4).forEach(s => {
    const item = $('div', {
      class: 'svc-card', onclick: () => startBooking(s)
    });
    item.innerHTML = `
      <div class="svc-ico">${s.icon}</div>
      <div class="svc-name">${s.name}</div>
      <div class="svc-price">${fmtMoney(s.price)}</div>
    `;
    svcGrid.appendChild(item);
  });
  sec1.appendChild(svcGrid);
  wrap.appendChild(sec1);

  // Barbeiros
  const sec2 = $('div', { class: 'section' });
  sec2.appendChild($('div', { class: 'section-head' }, $('h3', {}, 'Nosso time')));
  const barbersRow = $('div', { class: 'carousel' });
  SHOP.barbers.forEach(b => {
    const c = $('div', { class: 'barber-chip', onclick: () => {
      state.booking.barber = b;
      startBooking();
    }});
    c.innerHTML = `
      <div class="barber-avatar-lg">${b.emoji}</div>
      <div class="barber-name">${b.name}</div>
      <div class="barber-role">${b.role}</div>
      <div class="barber-rating">${I.star} ${b.rating.toFixed(1)}</div>
    `;
    barbersRow.appendChild(c);
  });
  sec2.appendChild(barbersRow);
  wrap.appendChild(sec2);

  // Galeria
  const sec3 = $('div', { class: 'section' });
  sec3.appendChild($('div', { class: 'section-head' },
    $('h3', {}, 'Galeria'),
    $('a', { href: 'https://instagram.com/silveirasclub', target: '_blank' }, SHOP.instagram)
  ));
  const gal = $('div', { class: 'gallery' });
  SHOP.gallery.forEach(g => {
    gal.appendChild($('div', { class: 'gallery-item' },
      $('div', { class: 'gallery-emoji' }, g.emoji),
      $('div', { class: 'gallery-cap' }, g.caption)
    ));
  });
  sec3.appendChild(gal);
  wrap.appendChild(sec3);

  // Perks
  const sec4 = $('div', { class: 'section' });
  sec4.appendChild($('div', { class: 'section-head' }, $('h3', {}, 'Por que o clube?')));
  const perks = $('div', { class: 'perks' });
  SHOP.perks.forEach(p => {
    perks.appendChild($('div', { class: 'perk' },
      $('div', { class: 'perk-ico' }, p.icon),
      $('div', { class: 'perk-label' }, p.label)
    ));
  });
  sec4.appendChild(perks);
  wrap.appendChild(sec4);

  // Sobre / contato
  const about = $('div', { class: 'about-card' });
  about.innerHTML = `
    <h3>${SHOP.name}</h3>
    <p class="about-desc">${SHOP.about}</p>
    <div class="about-row">${I.pin}<span>${SHOP.address} · ${SHOP.city}</span></div>
    <div class="about-row">${I.clock}<span>${SHOP.hours}</span></div>
    <div class="about-actions">
      <a class="action-btn" href="https://wa.me/${SHOP.whatsapp}" target="_blank">${I.whats}<span>WhatsApp</span></a>
      <a class="action-btn" href="tel:+55${SHOP.whatsapp}">${I.phone}<span>Ligar</span></a>
      <a class="action-btn" href="https://instagram.com/silveirasclub" target="_blank">${I.ig}<span>Instagram</span></a>
    </div>
  `;
  wrap.appendChild($('div', { class: 'section' }, about));

  // Rodapé
  wrap.appendChild($('div', { class: 'footer' }, '🧸 #BUMBA · Silveira\'s Club'));

  return wrap;
}

// =========================
// SERVIÇOS (lista completa)
// =========================
function renderServices() {
  const wrap = $('div', {});
  wrap.appendChild($('div', { class: 'topbar' },
    $('div', { class: 'greeting' }, $('div', { class: 'name' }, 'Serviços'))
  ));

  wrap.appendChild($('div', { class: 'section-title' }, 'Escolha um serviço e agende já'));

  const list = $('div', { class: 'service-list' });
  SHOP.services.forEach(s => {
    const item = $('div', { class: 'service-row', onclick: () => startBooking(s) });
    item.innerHTML = `
      <div class="service-ico">${s.icon}</div>
      <div class="service-info">
        <div class="service-name">${s.name}</div>
        <div class="service-desc">${s.desc}</div>
        <div class="service-meta">${s.duration} min</div>
      </div>
      <div class="service-price">${fmtMoney(s.price)}</div>
    `;
    list.appendChild(item);
  });
  wrap.appendChild(list);

  return wrap;
}

// =========================
// AGENDAMENTOS
// =========================
function renderAppts() {
  const wrap = $('div', {});
  wrap.appendChild($('div', { class: 'topbar' },
    $('div', { class: 'greeting' }, $('div', { class: 'name' }, 'Meus agendamentos'))
  ));

  const tabs = $('div', { class: 'tabs' });
  ['next', 'past'].forEach(t => {
    tabs.appendChild($('button', {
      class: 'tab' + (state.apptTab === t ? ' active' : ''),
      onclick: () => { state.apptTab = t; render(); }
    }, t === 'next' ? 'Próximos' : 'Histórico'));
  });
  wrap.appendChild(tabs);

  const now = new Date(new Date().toDateString());
  let list;
  if (state.apptTab === 'next') {
    list = state.appts.filter(a => new Date(a.date) >= now && a.status !== 'cancelled');
  } else {
    list = state.appts.filter(a => new Date(a.date) < now || a.status === 'cancelled');
  }
  list.sort((a,b) => new Date(a.date) - new Date(b.date));
  if (state.apptTab === 'past') list.reverse();

  if (!list.length) {
    wrap.appendChild($('div', { class: 'empty' },
      $('div', { class: 'ico' }, '🧸'),
      $('div', { class: 'ttl' }, state.apptTab === 'next' ? 'Nenhum agendamento ainda' : 'Sem histórico por aqui'),
      $('div', { class: 'sub' }, 'Bora agendar seu próximo corte?'),
      $('button', {
        class: 'btn btn-primary', style: 'margin-top: 20px; max-width: 240px',
        onclick: () => startBooking()
      }, 'Agendar agora')
    ));
  } else {
    list.forEach(a => wrap.appendChild(apptCard(a)));
  }
  return wrap;
}

function apptCard(a) {
  const d = new Date(a.date);
  const monthNames = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
  const statusMap = {
    confirmed: { class: 'status-confirmed', label: 'Confirmado' },
    done: { class: 'status-done', label: 'Concluído' },
    cancelled: { class: 'status-cancelled', label: 'Cancelado' }
  };
  const st = statusMap[a.status] || statusMap.confirmed;
  const card = $('div', { class: 'appt-card' },
    $('div', { class: 'appt-date' },
      $('div', { class: 'month' }, monthNames[d.getMonth()]),
      $('div', { class: 'day' }, d.getDate()),
      $('div', { class: 'time' }, a.time)
    ),
    $('div', { class: 'appt-info' },
      $('div', { class: 'svc' }, a.serviceName),
      $('div', { class: 'pro' }, 'com ' + a.barberName),
      $('div', { class: 'price-line' }, fmtMoney(a.price)),
      $('div', { class: 'appt-status ' + st.class }, st.label)
    )
  );

  if (a.status === 'confirmed' && new Date(a.date) >= new Date(new Date().toDateString())) {
    const actions = $('div', { class: 'appt-actions' },
      $('button', {
        class: 'btn btn-ghost btn-sm',
        onclick: () => {
          if (confirm('Deseja cancelar este agendamento?')) {
            a.status = 'cancelled';
            save(); render();
            toast('Agendamento cancelado');
          }
        }
      }, 'Cancelar')
    );
    card.appendChild(actions);
  }
  return card;
}

// =========================
// PERFIL
// =========================
function renderProfile() {
  const wrap = $('div', {});
  wrap.appendChild($('div', { class: 'profile-head' },
    $('div', { class: 'profile-avatar' }, initials(state.user.name)),
    $('div', { class: 'name' }, state.user.name),
    $('div', { class: 'phone' }, state.user.phone || state.user.email || '')
  ));

  const total = state.appts.length;
  const done = state.appts.filter(a => a.status === 'done' || (a.status === 'confirmed' && new Date(a.date) < new Date())).length;

  const stats = $('div', { class: 'stats-row' });
  stats.innerHTML = `
    <div class="stat"><div class="stat-val">${total}</div><div class="stat-lbl">Agendamentos</div></div>
    <div class="stat"><div class="stat-val">${done}</div><div class="stat-lbl">Concluídos</div></div>
    <div class="stat"><div class="stat-val">🧸</div><div class="stat-lbl">Membro</div></div>
  `;
  wrap.appendChild(stats);

  const menu = $('div', { class: 'menu' });
  const items = [
    { icon: I.user, label: 'Dados pessoais', action: () => toast('Em breve!') },
    { icon: I.bell, label: 'Notificações', action: () => toast('Em breve!') },
    { icon: I.card, label: 'Formas de pagamento', action: () => toast('Em breve!') },
    { icon: I.gear, label: 'Configurações', action: () => toast('Em breve!') },
    { icon: I.whats, label: 'Falar no WhatsApp', action: () => window.open(`https://wa.me/${SHOP.whatsapp}`, '_blank') },
    { icon: I.help, label: 'Ajuda e suporte', action: () => toast('Fale com a gente no Instagram @silveirasclub') },
    { icon: I.logout, label: 'Sair', danger: true, action: () => {
      if (confirm('Deseja sair?')) {
        state.user = null; save(); render();
      }
    }}
  ];

  items.forEach(it => {
    const el = $('div', { class: 'menu-item' + (it.danger ? ' danger' : ''), onclick: it.action });
    el.innerHTML = `<div class="m-icon">${it.icon}</div><div class="m-label">${it.label}</div><div class="m-chev">${I.chev}</div>`;
    menu.appendChild(el);
  });

  wrap.appendChild(menu);
  wrap.appendChild($('div', { class: 'footer' }, '🧸 #BUMBA · v1.0'));
  return wrap;
}
