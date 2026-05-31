// =========================
// Silveira's Club · #BUMBA
// =========================

const SHOP = {
  name: "Silveira's Club",
  tagline: "#BUMBA",
  emoji: "🧸",
  about: "Mais que uma barbearia, um clube. Corte na régua, barba na navalha e a melhor energia da praia. 🎪💈✂️",
  address: "Rua Eduardo Salgado, 156",
  city: "Fortaleza - CE",
  phone: "(85) 99673-0211",
  whatsapp: "5585996730211",
  instagram: "@silveirasclub",
  hours: "Todos os dias · 09h às 20h",
  rating: 4.9,
  reviews: 542,

  services: [
    { id: 's1', name: 'Corte Masculino', duration: 40, price: 45, icon: '✂️', desc: 'Corte na régua com acabamento perfeito' },
    { id: 's2', name: 'Barba Navalha', duration: 30, price: 35, icon: '🪒', desc: 'Barba tradicional com toalha quente' },
    { id: 's3', name: 'Corte + Barba', duration: 65, price: 70, icon: '💈', desc: 'O combo clássico do clube' },
    { id: 's4', name: 'Corte Infantil', duration: 30, price: 35, icon: '🧒', desc: 'Corte especial para os mini clubbers' },
    { id: 's5', name: 'Sobrancelha', duration: 15, price: 15, icon: '👁️', desc: 'Design de sobrancelha masculino' },
    { id: 's6', name: 'Pezinho', duration: 10, price: 10, icon: '💇', desc: 'Acabamento de nuca e costeletas' },
    { id: 's7', name: 'Pigmentação', duration: 60, price: 90, icon: '🎨', desc: 'Disfarce de falhas na barba' },
    { id: 's8', name: 'Hidratação', duration: 40, price: 50, icon: '💧', desc: 'Tratamento capilar completo' },
    { id: 's9', name: 'Combo Premium', duration: 90, price: 120, icon: '👑', desc: 'Corte + barba + sobrancelha + hidratação' }
  ],

  barbers: [
    { id: 'b1', name: 'Silveira', role: 'Master Barber', emoji: '🧔', rating: 5.0, bookings: 1280 },
    { id: 'b2', name: 'Léo', role: 'Barbeiro Sênior', emoji: '👨‍🦲', rating: 4.9, bookings: 876 },
    { id: 'b3', name: 'Diego', role: 'Barbeiro', emoji: '🧑‍🎤', rating: 4.8, bookings: 542 },
    { id: 'b4', name: 'Jão', role: 'Barbeiro', emoji: '👨‍🦱', rating: 4.9, bookings: 634 }
  ],

  gallery: [
    { emoji: '💈', caption: 'Tradição e estilo' },
    { emoji: '✂️', caption: 'Corte na régua' },
    { emoji: '🪒', caption: 'Barba na navalha' },
    { emoji: '🧸', caption: '#BUMBA' },
    { emoji: '🎪', caption: 'O clube' },
    { emoji: '🏆', caption: 'Nota 10' }
  ],

  reviewsList: [
    { name: 'Lucas M.', stars: 5, text: 'Melhor barbearia de Fortaleza! Silveira é mestre na navalha.' },
    { name: 'Rafael S.', stars: 5, text: 'Ambiente top, atendimento nota 10. Virei cliente fiel.' },
    { name: 'João P.', stars: 5, text: 'O #BUMBA é real! Saio de lá sempre renovado.' },
    { name: 'Felipe R.', stars: 4, text: 'Corte excelente, preço justo, recomendo muito.' }
  ],

  perks: [
    { icon: '🧸', label: 'Mascote #BUMBA' },
    { icon: '🏖️', label: 'Vibe praiana' },
    { icon: '🍺', label: 'Cervejinha cortesia' },
    { icon: '🎵', label: 'Som na medida' }
  ]
};

// Horários disponíveis
function generateTimeSlots() {
  const slots = [];
  for (let h = 9; h <= 19; h++) {
    slots.push(`${String(h).padStart(2,'0')}:00`);
    slots.push(`${String(h).padStart(2,'0')}:30`);
  }
  return slots;
}

// Próximos 14 dias
function generateDates() {
  const days = [];
  const dowNames = ['DOM','SEG','TER','QUA','QUI','SEX','SAB'];
  const monthNames = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      iso: d.toISOString().split('T')[0],
      day: d.getDate(),
      dow: dowNames[d.getDay()],
      month: monthNames[d.getMonth()],
      full: d
    });
  }
  return days;
}

function getAvailableSlots(dateIso) {
  const all = generateTimeSlots();
  const seed = parseInt(dateIso.split('-').join(''));
  return all.map((t, i) => ({
    time: t,
    available: ((seed + i * 7) % 5) !== 0
  }));
}
