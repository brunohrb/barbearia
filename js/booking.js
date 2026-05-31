// =========================
// BOOKING FLOW
// =========================
function startBooking(service = null) {
  state.booking = {
    service: service,
    barber: state.booking.barber || null,
    date: null,
    time: null,
    _flow: service ? 'barber' : 'service'
  };
  render();
}

function closeBooking() {
  state.booking = { service: null, barber: null, date: null, time: null, _flow: null };
  render();
}

function renderBooking() {
  const step = state.booking._flow;
  const steps = ['service', 'barber', 'date', 'summary'];
  const idx = steps.indexOf(step);

  const wrap = $('div', { class: 'booking fade-in' });

  const head = $('div', { class: 'booking-head' },
    $('button', {
      class: 'icon-btn', html: I.back,
      onclick: () => {
        if (idx === 0) { closeBooking(); return; }
        state.booking._flow = steps[idx - 1];
        render();
      }
    }),
    $('h2', {}, stepTitle(step))
  );
  wrap.appendChild(head);

  const prog = $('div', { class: 'steps' });
  steps.forEach((_, i) => {
    prog.appendChild($('div', { class: 'step-dot' + (i <= idx ? ' done' : '') }));
  });
  wrap.appendChild(prog);

  if (step === 'service') renderStepService(wrap);
  else if (step === 'barber') renderStepBarber(wrap);
  else if (step === 'date') renderStepDate(wrap);
  else if (step === 'summary') renderStepSummary(wrap);

  $app.appendChild(wrap);
}

function stepTitle(s) {
  return ({
    service: 'Escolha o serviço',
    barber: 'Escolha o barbeiro',
    date: 'Escolha data e hora',
    summary: 'Confirmar agendamento'
  })[s];
}

function renderStepService(wrap) {
  wrap.appendChild($('div', { class: 'step-title' }, 'Qual serviço você quer?'));
  const list = $('div', { class: 'option-list' });
  SHOP.services.forEach(s => {
    const sel = state.booking.service && state.booking.service.id === s.id;
    const item = $('div', {
      class: 'option-item' + (sel ? ' selected' : ''),
      onclick: () => {
        state.booking.service = s;
        state.booking._flow = 'barber';
        render();
      }
    });
    item.innerHTML = `
      <div class="opt-icon">${s.icon}</div>
      <div class="opt-info">
        <div class="opt-name">${s.name}</div>
        <div class="opt-sub">${s.duration} min · ${s.desc}</div>
      </div>
      <div class="opt-price">${fmtMoney(s.price)}</div>
    `;
    list.appendChild(item);
  });
  wrap.appendChild(list);
}

function renderStepBarber(wrap) {
  wrap.appendChild($('div', { class: 'step-title' }, 'Com qual barbeiro?'));
  const list = $('div', { class: 'option-list' });

  // Qualquer
  const selAny = state.booking.barber === 'any';
  const any = $('div', {
    class: 'option-item' + (selAny ? ' selected' : ''),
    onclick: () => { state.booking.barber = 'any'; state.booking._flow = 'date'; render(); }
  });
  any.innerHTML = `
    <div class="opt-icon">🎲</div>
    <div class="opt-info">
      <div class="opt-name">Qualquer barbeiro</div>
      <div class="opt-sub">O próximo disponível</div>
    </div>
    <div class="radio"></div>
  `;
  list.appendChild(any);

  SHOP.barbers.forEach(b => {
    const sel = state.booking.barber && state.booking.barber.id === b.id;
    const item = $('div', {
      class: 'option-item' + (sel ? ' selected' : ''),
      onclick: () => { state.booking.barber = b; state.booking._flow = 'date'; render(); }
    });
    item.innerHTML = `
      <div class="opt-icon">${b.emoji}</div>
      <div class="opt-info">
        <div class="opt-name">${b.name}</div>
        <div class="opt-sub">${b.role} · ★ ${b.rating.toFixed(1)} · ${b.bookings} cortes</div>
      </div>
      <div class="radio"></div>
    `;
    list.appendChild(item);
  });

  wrap.appendChild(list);
}

function renderStepDate(wrap) {
  wrap.appendChild($('div', { class: 'step-title' }, 'Qual o melhor dia pra você?'));

  const dates = generateDates();
  if (!state.booking.date) state.booking.date = dates[0].iso;

  const scroll = $('div', { class: 'date-scroll' });
  dates.forEach(d => {
    const sel = state.booking.date === d.iso;
    const chip = $('div', {
      class: 'date-chip' + (sel ? ' selected' : ''),
      onclick: () => { state.booking.date = d.iso; state.booking.time = null; render(); }
    });
    chip.innerHTML = `
      <div class="dow">${d.dow}</div>
      <div class="num">${d.day}</div>
      <div class="dow">${d.month}</div>
    `;
    scroll.appendChild(chip);
  });
  wrap.appendChild(scroll);

  wrap.appendChild($('div', { class: 'step-title', style: 'padding-top: 20px' }, 'Horários disponíveis'));

  const slots = getAvailableSlots(state.booking.date);
  const grid = $('div', { class: 'time-grid' });
  slots.forEach(s => {
    const sel = state.booking.time === s.time;
    const chip = $('button', {
      class: 'time-chip' + (sel ? ' selected' : '') + (s.available ? '' : ' disabled'),
      onclick: s.available ? () => {
        state.booking.time = s.time;
        state.booking._flow = 'summary';
        render();
      } : null
    }, s.time);
    grid.appendChild(chip);
  });
  wrap.appendChild(grid);
}

function renderStepSummary(wrap) {
  const b = state.booking;
  const barberName = b.barber === 'any' ? 'Qualquer barbeiro' : b.barber.name;

  wrap.appendChild($('div', { class: 'step-title' }, 'Confira os detalhes'));

  const card = $('div', { class: 'summary-card' },
    summaryRow('Barbearia', SHOP.name),
    summaryRow('Serviço', b.service.name),
    summaryRow('Barbeiro', barberName),
    summaryRow('Data', formatApptDate(b.date)),
    summaryRow('Horário', b.time),
    summaryRow('Duração', b.service.duration + ' min'),
    $('div', { class: 'summary-row total' },
      $('span', { class: 'label' }, 'Total'),
      $('span', { class: 'val' }, fmtMoney(b.service.price))
    )
  );
  wrap.appendChild(card);

  wrap.appendChild($('div', {
    class: 'policy-note'
  }, '⚠️ Cancelamentos com menos de 2h podem gerar taxa. Chegue com 5 minutos de antecedência.'));

  const cta = $('div', { class: 'cta-book' },
    $('button', {
      class: 'btn btn-primary btn-block',
      onclick: confirmBooking
    }, '✓ Confirmar agendamento')
  );
  wrap.appendChild(cta);
}

function summaryRow(label, val) {
  return $('div', { class: 'summary-row' },
    $('span', { class: 'label' }, label),
    $('span', {}, val)
  );
}

function confirmBooking() {
  const b = state.booking;
  const appt = {
    id: 'a' + Date.now(),
    shopName: SHOP.name,
    serviceName: b.service.name,
    serviceId: b.service.id,
    price: b.service.price,
    barberName: b.barber === 'any' ? 'Qualquer barbeiro' : b.barber.name,
    date: b.date,
    time: b.time,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  state.appts.push(appt);
  save();
  state.booking._flow = 'success';
  render();
}

function renderSuccess() {
  const b = state.booking;
  const wrap = $('div', { class: 'success-screen fade-in' });
  wrap.innerHTML = `
    <img class="success-mascot" src="logobumba.jpg" alt="Bumba" />
    <div class="success-icon">${I.check}</div>
    <h2>Agendamento confirmado!</h2>
    <p>Seu horário no ${SHOP.name} foi reservado. Te esperamos com uma cervejinha gelada. #BUMBA 🎪</p>
  `;

  const sumCard = $('div', { class: 'summary-card', style: 'width:100%;max-width:360px;margin:0 0 20px' },
    summaryRow('Data', formatApptDate(b.date) + ' · ' + b.time),
    summaryRow('Serviço', b.service.name),
    summaryRow('Valor', fmtMoney(b.service.price))
  );
  wrap.appendChild(sumCard);

  wrap.appendChild($('button', {
    class: 'btn btn-primary btn-block', style: 'max-width: 360px',
    onclick: () => {
      state.booking = { service: null, barber: null, date: null, time: null, _flow: null };
      state.currentTab = 'appts';
      state.apptTab = 'next';
      render();
    }
  }, 'Ver meus agendamentos'));

  wrap.appendChild($('button', {
    class: 'btn btn-ghost btn-block', style: 'max-width: 360px; margin-top: 10px',
    onclick: () => {
      state.booking = { service: null, barber: null, date: null, time: null, _flow: null };
      state.currentTab = 'home';
      render();
    }
  }, 'Voltar ao início'));

  $app.appendChild(wrap);
}
