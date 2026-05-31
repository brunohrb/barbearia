// ===========================
// Painel do Gestor · Silveira's Club
// ===========================

const MANAGER_PASS = 'bumba2024';
const STORAGE_MGR = 'bumba_mgr';

const mgrState = {
  auth: false,
  tab: 'hoje',
  dateFilter: new Date().toISOString().split('T')[0],
  barberFilter: 'all'
};

function loadMgrAuth() {
  mgrState.auth = localStorage.getItem(STORAGE_MGR) === '1';
}

function saveMgrAuth(v) {
  mgrState.auth = v;
  if (v) localStorage.setItem(STORAGE_MGR, '1');
  else localStorage.removeItem(STORAGE_MGR);
}

function getAllAppts() {
  try { return JSON.parse(localStorage.getItem(STORAGE.appts) || '[]'); } catch { return []; }
}

function saveAllAppts(appts) {
  localStorage.setItem(STORAGE.appts, JSON.stringify(appts));
  state.appts = appts;
}

// ===========================
// ENTRY POINT (link na tela de auth)
// ===========================
function renderManagerLink() {
  return $('div', {
    class: 'mgr-link',
    onclick: () => {
      loadMgrAuth();
      renderManagerFlow();
    }
  }, '🔑 Área do Gestor');
}

function renderManagerFlow() {
  $app.innerHTML = '';
  if (!mgrState.auth) renderManagerLogin();
  else { seedMgrData(); renderManagerPanel(); }
}

// ===========================
// LOGIN DO GESTOR
// ===========================
function renderManagerLogin() {
  const wrap = $('div', { class: 'auth fade-in' });

  wrap.appendChild($('img', { class: 'auth-mascot', src: 'logobumba.jpg', alt: 'Bumba' }));
  wrap.appendChild($('div', { class: 'auth-brand' }, "Silveira's Club"));
  wrap.appendChild($('div', { class: 'auth-slogan' }, 'Área do Gestor'));
  wrap.appendChild($('h2', {}, 'Acesso restrito'));
  wrap.appendChild($('p', { class: 'auth-desc' }, 'Entre com a senha do gestor para acessar o painel'));

  const pass = $('input', { type: 'password', class: 'input', placeholder: 'Senha do gestor' });
  wrap.appendChild(group('Senha', pass));

  pass.addEventListener('keydown', (e) => { if (e.key === 'Enter') doMgrLogin(); });

  function doMgrLogin() {
    if (pass.value === MANAGER_PASS) {
      saveMgrAuth(true);
      seedMgrData();
      renderManagerPanel();
    } else {
      toast('Senha incorreta');
    }
  }

  wrap.appendChild($('button', {
    class: 'btn btn-primary',
    style: 'margin-top: 12px',
    onclick: doMgrLogin
  }, 'Entrar no painel'));

  wrap.appendChild($('button', {
    class: 'btn btn-ghost',
    style: 'margin-top: 8px; width: 100%',
    onclick: () => render()
  }, '← Voltar'));

  $app.appendChild(wrap);
}

// ===========================
// DADOS DE DEMONSTRAÇÃO
// ===========================
function seedMgrData() {
  const existing = getAllAppts();
  if (existing.length > 0) return;

  const today = new Date();
  const seed = [];

  const items = [
    { off: -2, time: '09:30', sid: 's1', bid: 'b1', client: 'Lucas Mendes', st: 'done' },
    { off: -2, time: '10:30', sid: 's3', bid: 'b2', client: 'Rafael Costa', st: 'done' },
    { off: -2, time: '14:00', sid: 's7', bid: 'b1', client: 'Pedro Alves', st: 'done' },
    { off: -2, time: '15:30', sid: 's2', bid: 'b4', client: 'Caio Faria', st: 'done' },
    { off: -1, time: '09:00', sid: 's1', bid: 'b2', client: 'Diego Carvalho', st: 'done' },
    { off: -1, time: '10:00', sid: 's9', bid: 'b1', client: 'Renato Souza', st: 'done' },
    { off: -1, time: '11:00', sid: 's2', bid: 'b3', client: 'André Lima', st: 'done' },
    { off: -1, time: '14:30', sid: 's4', bid: 'b2', client: 'Felipe Santos', st: 'done' },
    { off: -1, time: '16:00', sid: 's5', bid: 'b4', client: 'Bruno Ferreira', st: 'cancelled' },
    { off: 0, time: '09:00', sid: 's3', bid: 'b1', client: 'João Paulo', st: 'done' },
    { off: 0, time: '09:30', sid: 's1', bid: 'b2', client: 'Marcos Oliveira', st: 'done' },
    { off: 0, time: '10:00', sid: 's2', bid: 'b3', client: 'Thiago Rocha', st: 'done' },
    { off: 0, time: '10:30', sid: 's5', bid: 'b4', client: 'Eduardo Pinto', st: 'confirmed' },
    { off: 0, time: '11:00', sid: 's1', bid: 'b1', client: 'Gustavo Nunes', st: 'confirmed' },
    { off: 0, time: '11:30', sid: 's8', bid: 'b2', client: 'Ricardo Melo', st: 'confirmed' },
    { off: 0, time: '14:00', sid: 's9', bid: 'b1', client: 'Carlos Lima', st: 'confirmed' },
    { off: 0, time: '14:30', sid: 's2', bid: 'b3', client: 'Vinicius Torres', st: 'confirmed' },
    { off: 0, time: '15:00', sid: 's1', bid: 'b4', client: 'Daniel Castro', st: 'confirmed' },
    { off: 0, time: '16:00', sid: 's3', bid: 'b2', client: 'Rodrigo Freitas', st: 'confirmed' },
    { off: 1, time: '09:00', sid: 's1', bid: 'b1', client: 'Mateus Cunha', st: 'confirmed' },
    { off: 1, time: '10:00', sid: 's3', bid: 'b2', client: 'Paulo Vieira', st: 'confirmed' },
    { off: 1, time: '11:00', sid: 's7', bid: 'b1', client: 'Alex Monteiro', st: 'confirmed' },
    { off: 2, time: '14:00', sid: 's9', bid: 'b1', client: 'Igor Campos', st: 'confirmed' },
    { off: 2, time: '15:00', sid: 's2', bid: 'b3', client: 'Leandro Barbosa', st: 'confirmed' },
  ];

  items.forEach((it, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + it.off);
    const dateStr = d.toISOString().split('T')[0];
    const svc = SHOP.services.find(s => s.id === it.sid);
    const barber = SHOP.barbers.find(b => b.id === it.bid);
    seed.push({
      id: 'seed_' + i,
      date: dateStr,
      time: it.time,
      serviceName: svc.name,
      serviceId: svc.id,
      price: svc.price,
      barberName: barber.name,
      clientName: it.client,
      status: it.st,
      createdAt: new Date().toISOString()
    });
  });

  saveAllAppts(seed);
}

// ===========================
// PAINEL PRINCIPAL
// ===========================
function renderManagerPanel() {
  $app.innerHTML = '';
  const wrap = $('div', { class: 'fade-in mgr-wrap' });

  // Header
  const header = $('div', { class: 'mgr-header' });
  const left = $('div', { class: 'mgr-header-left' },
    $('img', { class: 'mgr-logo', src: 'logobumba.jpg', alt: 'Bumba' }),
    $('div', {},
      $('div', { class: 'mgr-title' }, 'Painel do Gestor'),
      $('div', { class: 'mgr-sub' }, "Silveira's Club · #BUMBA")
    )
  );
  const logoutBtn = $('button', { class: 'mgr-logout-btn' }, 'Sair');
  logoutBtn.onclick = () => {
    if (confirm('Deseja sair do painel do gestor?')) {
      saveMgrAuth(false);
      render();
    }
  };
  header.appendChild(left);
  header.appendChild(logoutBtn);
  wrap.appendChild(header);

  // Tabs
  const tabBar = $('div', { class: 'mgr-tabs' });
  [
    { id: 'hoje', label: '📅 Hoje' },
    { id: 'agenda', label: '🗓️ Agenda' },
    { id: 'relatorios', label: '📊 Relatórios' }
  ].forEach(t => {
    const btn = $('button', {
      class: 'mgr-tab' + (mgrState.tab === t.id ? ' active' : ''),
    }, t.label);
    btn.onclick = () => { mgrState.tab = t.id; renderManagerPanel(); };
    tabBar.appendChild(btn);
  });
  wrap.appendChild(tabBar);

  // Content
  const content = $('div', { class: 'mgr-content' });
  if (mgrState.tab === 'hoje') content.appendChild(renderMgrHoje());
  else if (mgrState.tab === 'agenda') content.appendChild(renderMgrAgenda());
  else if (mgrState.tab === 'relatorios') content.appendChild(renderMgrRelatorios());
  wrap.appendChild(content);

  $app.appendChild(wrap);
}

// ===========================
// ABA: HOJE
// ===========================
function renderMgrHoje() {
  const wrap = $('div', {});
  const todayStr = new Date().toISOString().split('T')[0];
  const all = getAllAppts();
  const today = all.filter(a => a.date === todayStr);

  const ativos = today.filter(a => a.status !== 'cancelled');
  const concluidos = today.filter(a => a.status === 'done').length;
  const aguardando = today.filter(a => a.status === 'confirmed').length;
  const receita = ativos.reduce((s, a) => s + a.price, 0);

  // Stats
  const stats = $('div', { class: 'mgr-stats' });
  stats.innerHTML = `
    <div class="mgr-stat">
      <div class="mgr-stat-val">${ativos.length}</div>
      <div class="mgr-stat-lbl">Agendados</div>
    </div>
    <div class="mgr-stat green">
      <div class="mgr-stat-val">${concluidos}</div>
      <div class="mgr-stat-lbl">Concluídos</div>
    </div>
    <div class="mgr-stat orange">
      <div class="mgr-stat-val">${fmtMoney(receita)}</div>
      <div class="mgr-stat-lbl">Receita est.</div>
    </div>
  `;
  wrap.appendChild(stats);

  // Próximo horário
  const now = new Date();
  const nowTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const proximo = today
    .filter(a => a.status === 'confirmed' && a.time >= nowTime)
    .sort((a, b) => a.time.localeCompare(b.time))[0];

  if (proximo) {
    const nextCard = $('div', { class: 'mgr-next-card' });
    nextCard.innerHTML = `
      <div class="mgr-next-label">⏰ Próximo atendimento</div>
      <div class="mgr-next-time">${proximo.time}</div>
      <div class="mgr-next-client">${proximo.clientName || 'Cliente'}</div>
      <div class="mgr-next-service">${proximo.serviceName} · com ${proximo.barberName}</div>
    `;
    wrap.appendChild(nextCard);
  }

  // Lista do dia
  wrap.appendChild($('div', { class: 'mgr-section-head' }, '📋 Agenda de hoje'));

  if (today.length === 0) {
    wrap.appendChild($('div', { class: 'empty' },
      $('div', { class: 'ico' }, '📅'),
      $('div', { class: 'ttl' }, 'Sem agendamentos hoje'),
      $('div', { class: 'sub' }, 'Aproveite para descansar!')
    ));
  } else {
    // Barbeiros com agendamentos hoje
    const barberSet = [...new Set(ativos.map(a => a.barberName))];
    if (barberSet.length > 1) {
      wrap.appendChild($('div', { class: 'mgr-summary-line' },
        `✂️ Barbeiros escalados: ${barberSet.join(', ')}`
      ));
    }

    today.sort((a, b) => a.time.localeCompare(b.time))
      .forEach(a => wrap.appendChild(mgrApptCard(a)));
  }

  return wrap;
}

// ===========================
// ABA: AGENDA (por data)
// ===========================
function renderMgrAgenda() {
  const wrap = $('div', {});

  const dateInput = $('input', {
    type: 'date',
    class: 'mgr-date-input',
    value: mgrState.dateFilter
  });
  dateInput.onchange = (e) => {
    mgrState.dateFilter = e.target.value;
    renderManagerPanel();
  };

  const barberSel = $('select', { class: 'mgr-select' });
  barberSel.appendChild($('option', { value: 'all' }, 'Todos os barbeiros'));
  SHOP.barbers.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b.name;
    opt.textContent = `${b.emoji} ${b.name}`;
    if (mgrState.barberFilter === b.name) opt.selected = true;
    barberSel.appendChild(opt);
  });
  barberSel.onchange = (e) => {
    mgrState.barberFilter = e.target.value;
    renderManagerPanel();
  };

  wrap.appendChild($('div', { class: 'mgr-filters' }, dateInput, barberSel));

  const all = getAllAppts();
  let lista = all.filter(a => a.date === mgrState.dateFilter);
  if (mgrState.barberFilter !== 'all') {
    lista = lista.filter(a => a.barberName === mgrState.barberFilter);
  }
  lista.sort((a, b) => a.time.localeCompare(b.time));

  const ativos = lista.filter(a => a.status !== 'cancelled');
  if (ativos.length > 0) {
    const rev = ativos.reduce((s, a) => s + a.price, 0);
    wrap.appendChild($('div', { class: 'mgr-summary-line' },
      `${ativos.length} agendamento${ativos.length > 1 ? 's' : ''} · ${fmtMoney(rev)} estimado`
    ));
  }

  if (lista.length === 0) {
    wrap.appendChild($('div', { class: 'empty' },
      $('div', { class: 'ico' }, '🗓️'),
      $('div', { class: 'ttl' }, 'Nenhum agendamento'),
      $('div', { class: 'sub' }, 'Selecione outra data ou barbeiro')
    ));
  } else {
    lista.forEach(a => wrap.appendChild(mgrApptCard(a)));
  }

  return wrap;
}

// ===========================
// ABA: RELATÓRIOS
// ===========================
function renderMgrRelatorios() {
  const wrap = $('div', {});
  const all = getAllAppts();
  const today = new Date();

  // Receita dos últimos 7 dias
  const last7 = [];
  const todayStr = today.toISOString().split('T')[0];
  let totalRev7 = 0;
  let totalAppts7 = 0;

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const ds = d.toISOString().split('T')[0];
    const dayAppts = all.filter(a => a.date === ds && a.status !== 'cancelled');
    const rev = dayAppts.reduce((s, a) => s + a.price, 0);
    totalRev7 += rev;
    totalAppts7 += dayAppts.length;
    last7.push({
      label: i === 0 ? 'Hoje' : d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
      count: dayAppts.length,
      revenue: rev,
      isToday: ds === todayStr
    });
  }

  const ticketMedio = totalAppts7 > 0 ? totalRev7 / totalAppts7 : 0;

  const stats = $('div', { class: 'mgr-stats' });
  stats.innerHTML = `
    <div class="mgr-stat">
      <div class="mgr-stat-val">${totalAppts7}</div>
      <div class="mgr-stat-lbl">Atend. (7d)</div>
    </div>
    <div class="mgr-stat green">
      <div class="mgr-stat-val">${fmtMoney(totalRev7)}</div>
      <div class="mgr-stat-lbl">Receita (7d)</div>
    </div>
    <div class="mgr-stat orange">
      <div class="mgr-stat-val">${fmtMoney(ticketMedio)}</div>
      <div class="mgr-stat-lbl">Ticket médio</div>
    </div>
  `;
  wrap.appendChild(stats);

  // Gráfico de barras
  wrap.appendChild($('div', { class: 'mgr-section-head' }, '📈 Receita — últimos 7 dias'));

  const maxRev = Math.max(...last7.map(d => d.revenue), 1);
  const chart = $('div', { class: 'mgr-chart' });
  last7.forEach(d => {
    const pct = Math.max((d.revenue / maxRev) * 100, d.revenue > 0 ? 6 : 0);
    const col = $('div', { class: 'mgr-chart-col' });
    col.innerHTML = `
      <div class="mgr-chart-bar-wrap">
        <div class="mgr-chart-bar${d.isToday ? ' today' : ''}" style="height:${pct.toFixed(0)}%"></div>
      </div>
      <div class="mgr-chart-val">${d.revenue > 0 ? 'R$' + d.revenue : '—'}</div>
      <div class="mgr-chart-lbl">${d.label}</div>
    `;
    chart.appendChild(col);
  });
  wrap.appendChild(chart);

  // Serviços mais populares
  wrap.appendChild($('div', { class: 'mgr-section-head' }, '🏆 Serviços mais agendados'));

  const svcCount = {};
  all.filter(a => a.status !== 'cancelled').forEach(a => {
    svcCount[a.serviceName] = (svcCount[a.serviceName] || 0) + 1;
  });
  const topSvcs = Object.entries(svcCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxSvc = topSvcs[0]?.[1] || 1;

  if (topSvcs.length === 0) {
    wrap.appendChild($('div', { class: 'mgr-empty-small' }, 'Nenhum dado disponível'));
  } else {
    const rankList = $('div', { class: 'mgr-rank-list' });
    topSvcs.forEach(([name, count], i) => {
      const svc = SHOP.services.find(s => s.name === name);
      const pct = ((count / maxSvc) * 100).toFixed(0);
      const item = $('div', { class: 'mgr-rank-item' });
      item.innerHTML = `
        <div class="mgr-rank-num">${svc ? svc.icon : '#' + (i + 1)}</div>
        <div class="mgr-rank-info">
          <div class="mgr-rank-name">${name}</div>
          <div class="mgr-rank-bar-wrap">
            <div class="mgr-rank-bar" style="width:${pct}%"></div>
          </div>
        </div>
        <div class="mgr-rank-count">${count}x</div>
      `;
      rankList.appendChild(item);
    });
    wrap.appendChild(rankList);
  }

  // Desempenho por barbeiro
  wrap.appendChild($('div', { class: 'mgr-section-head' }, '✂️ Desempenho dos barbeiros'));

  const barberMap = {};
  SHOP.barbers.forEach(b => {
    barberMap[b.name] = { count: 0, revenue: 0, emoji: b.emoji, role: b.role };
  });
  all.filter(a => a.status !== 'cancelled').forEach(a => {
    if (barberMap[a.barberName]) {
      barberMap[a.barberName].count++;
      barberMap[a.barberName].revenue += a.price;
    }
  });

  const barberList = $('div', { class: 'mgr-barber-stats' });
  Object.entries(barberMap)
    .sort((a, b) => b[1].count - a[1].count)
    .forEach(([name, data]) => {
      const item = $('div', { class: 'mgr-barber-stat-item' });
      item.innerHTML = `
        <div class="mgr-barber-emoji">${data.emoji}</div>
        <div class="mgr-barber-info">
          <div class="mgr-barber-name">${name}</div>
          <div class="mgr-barber-details">${data.role} · ${data.count} atendimentos</div>
        </div>
        <div class="mgr-barber-rev">${fmtMoney(data.revenue)}</div>
      `;
      barberList.appendChild(item);
    });
  wrap.appendChild(barberList);

  return wrap;
}

// ===========================
// CARD DE AGENDAMENTO (gestor)
// ===========================
function mgrApptCard(a) {
  const statusMap = {
    confirmed: { cls: 'status-confirmed', label: 'Confirmado' },
    done: { cls: 'status-done', label: 'Concluído' },
    cancelled: { cls: 'status-cancelled', label: 'Cancelado' }
  };
  const st = statusMap[a.status] || statusMap.confirmed;

  const card = $('div', { class: 'mgr-appt-card' });

  const main = $('div', { class: 'mgr-appt-main' });
  main.innerHTML = `
    <div class="mgr-appt-time">${a.time}</div>
    <div class="mgr-appt-info">
      <div class="mgr-appt-client">${a.clientName || 'Cliente'}</div>
      <div class="mgr-appt-service">${a.serviceName}</div>
      <div class="mgr-appt-barber">✂️ ${a.barberName} · ${fmtMoney(a.price)}</div>
    </div>
    <div class="appt-status ${st.cls}">${st.label}</div>
  `;
  card.appendChild(main);

  if (a.status !== 'cancelled') {
    const actions = $('div', { class: 'mgr-appt-actions' });

    if (a.status === 'confirmed') {
      const btnDone = $('button', { class: 'mgr-btn-done' }, '✓ Concluir');
      btnDone.onclick = () => mgrUpdateStatus(a.id, 'done');
      actions.appendChild(btnDone);
    }

    const btnCancel = $('button', { class: 'mgr-btn-cancel' }, '✕ Cancelar');
    btnCancel.onclick = () => {
      if (confirm(`Cancelar o agendamento de ${a.clientName || 'cliente'}?`)) {
        mgrUpdateStatus(a.id, 'cancelled');
      }
    };
    actions.appendChild(btnCancel);
    card.appendChild(actions);
  }

  return card;
}

function mgrUpdateStatus(id, newStatus) {
  const appts = getAllAppts();
  const idx = appts.findIndex(a => a.id === id);
  if (idx >= 0) {
    appts[idx].status = newStatus;
    saveAllAppts(appts);
    const msg = newStatus === 'done' ? 'Atendimento concluído!' : 'Agendamento cancelado';
    toast(msg);
    renderManagerPanel();
  }
}
