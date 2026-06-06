// ══════════════════════════════════════════════
// Wakhma PRO — Storage & Business Logic
// ══════════════════════════════════════════════

export const POINTS_PAR_REVELATION = 1500;  // Default cost per reveal
export const POINTS_REVELATION_KING = 1000;  // KING VIP pay 1000 per reveal
export const KYC_INSCRIPTION_PRIX = 300;
export const POINTS_KYC = 3000;
export const DEMAND_LIMIT_PER_WEEK = 3;
export const FREE_URL = 'https://wakhma-store.com';

export const CATEGORIES_PRO = ["Téléphones", "TV Frigo Congélateur", "Clim Ventilateur"];

export const QUARTIERS = [
  'Médina', 'Plateau', 'Almadies', 'Dakar-Plateau', 'Fann', 'Point E',
  'Mermoz', 'Sacre-Coeur', 'Ouakam', 'Ngor', 'Yoff', 'Parcelles Assainies',
  'Grand Yoff', 'Hann', 'Bel Air', 'Colobane', 'Gueule Tapée', 'Fass',
  'Dieuppeul', 'Sicap Liberte', 'Patte d\'Oie', 'Cambérène', 'Ndiarème',
  'Grand Dakar', 'Biscuiterie', 'HLM', 'Sahm', 'Thiaroye', 'Keur Massar',
];

export const TARIFS_RECHARGE = [
  { prix: 1000, points: 9000, label: 'Découverte' },
  { prix: 2000, points: 18000, label: 'Pro' },
  { prix: 5000, points: 52000, label: 'Boss' },
  { prix: 8000, points: 86000, label: 'King' },
  { prix: 10000, points: 110000, label: 'VIP' },
];

// ── Dynamic reveal cost ──
export function getRevealCost(role) {
  return role === 'king' ? POINTS_REVELATION_KING : POINTS_PAR_REVELATION;
}

// ── Vendor storage ──
const VENDEUR_KEY = 'wakhma_pro_vendeur';

export function getVendeur() {
  try { return JSON.parse(localStorage.getItem(VENDEUR_KEY) || 'null'); }
  catch { return null; }
}

export function setVendeur(v) {
  localStorage.setItem(VENDEUR_KEY, JSON.stringify(v));
}

export function logoutVendeur() {
  localStorage.removeItem(VENDEUR_KEY);
}

export function updateVendeurRole(phone, newRole) {
  const v = getVendeur();
  if (v && v.numero === phone) {
    v.role = newRole;
    setVendeur(v);
  }
  // Also update vendeurs list
  const vendeurs = JSON.parse(localStorage.getItem('wakhma_pro_vendeurs') || '[]');
  const idx = vendeurs.findIndex(vv => vv.numero === phone);
  if (idx >= 0) { vendeurs[idx].role = newRole; localStorage.setItem('wakhma_pro_vendeurs', JSON.stringify(vendeurs)); }
}

// ── Points ──
export function getPoints(phone) {
  const v = getVendeur();
  if (v && v.numero === phone) return v.points || 0;
  return 0;
}

export function addPoints(phone, amount) {
  const v = getVendeur();
  if (v && v.numero === phone) {
    v.points = (v.points || 0) + amount;
    setVendeur(v);
  }
}

export function deductPoints(phone, amount) {
  const v = getVendeur();
  if (v && v.numero === phone && v.points >= amount) {
    v.points -= amount;
    setVendeur(v);
    return true;
  }
  return false;
}

export function canReveal(phone, role) {
  return getPoints(phone) >= getRevealCost(role);
}

export function getRevealsFromPoints(phone, role) {
  return Math.floor(getPoints(phone) / getRevealCost(role));
}

// ── Reveal tracking ──
const REVEALS_KEY = 'wakhma_pro_reveals';

export function getRevealsThisMonth(phone) {
  const reveals = JSON.parse(localStorage.getItem(REVEALS_KEY) || '[]');
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0,0,0,0);
  return reveals.filter(r => r.phone === phone && new Date(r.date) >= monthStart).length;
}

export function recordReveal(phone, demandId) {
  const reveals = JSON.parse(localStorage.getItem(REVEALS_KEY) || '[]');
  reveals.push({ phone, demandId, date: new Date().toISOString() });
  localStorage.setItem(REVEALS_KEY, JSON.stringify(reveals));
}

// ── Weekly demand limit ──
export function getWeekKey() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now - start) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + start.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

export function getWeeklyCount(phone) {
  const key = `wakhma_pro_weekly_${phone}_${getWeekKey()}`;
  return parseInt(localStorage.getItem(key) || '0', 10);
}

export function isLimitReached(phone) {
  return getWeeklyCount(phone) >= DEMAND_LIMIT_PER_WEEK;
}

export function incrementWeeklyCount(phone) {
  const key = `wakhma_pro_weekly_${phone}_${getWeekKey()}`;
  localStorage.setItem(key, String(getWeeklyCount(phone) + 1));
}

// ── Phone storage ──
export function getStoredPhone() { return localStorage.getItem('wakhma_pro_phone') || ''; }
export function setStoredPhone(p) { localStorage.setItem('wakhma_pro_phone', p); }

// ── Demand storage ──
const DEMANDS_KEY = 'wakhma_pro_demands';

export function saveDemandLocal(d) {
  const demands = getDemandsLocal();
  demands.unshift(d);
  localStorage.setItem(DEMANDS_KEY, JSON.stringify(demands));
}

export function getDemandsLocal() {
  try { return JSON.parse(localStorage.getItem(DEMANDS_KEY) || '[]'); }
  catch { return []; }
}

// ── WhatsApp link ──
export function getWhatsAppLink(phone, text) {
  return `https://wa.me/221${phone}?text=${encodeURIComponent(text)}`;
}

// ── Format helpers ──
export function formatFCFA(n) {
  if (!n) return '0 FCFA';
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

export function timeAgo(dateStr) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}j`;
  return new Date(dateStr).toLocaleDateString('fr-FR');
}

export function maskPhone(phone) {
  if (!phone || phone.length < 8) return phone || '';
  return phone.slice(0, 2) + ' *** ** ' + phone.slice(-2);
}

export function generateId() {
  return 'DEM-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
}

export function generateRef() {
  return 'WKH-' + Date.now().toString(36).toUpperCase();
}
