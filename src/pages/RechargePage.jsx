import { useState } from 'react';
import {
  getVendeur, getPoints, addPoints, TARIFS_RECHARGE, ABONNEMENTS,
  getRevealsFromPoints, getRevealCost, generateRef, updateVendeurRole,
  checkSubscriptionExpiry, getSubscriptionRemainingDays, ABONNEMENT_DURATION_DAYS,
  POINTS_PAR_REVELATION, POINTS_REVELATION_DIAMBAR, POINTS_REVELATION_KING
} from '../utils/storage';

export default function RechargePage() {
  // Check subscription expiry on load
  checkSubscriptionExpiry();

  const vendeur = getVendeur();
  const [selectedTier, setSelectedTier] = useState(null);
  const [method, setMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('choose'); // choose | paying | success | upgraded
  const [phone, setPhone] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [error, setError] = useState('');
  const [upgradedRole, setUpgradedRole] = useState(null);

  if (!vendeur) { window.location.hash = '#/vendeur'; return null; }

  const isKing = vendeur.role === 'king';
  const isDiambar = vendeur.role === 'diambar';
  const isFree = vendeur.role === 'free';
  const currentPoints = getPoints(vendeur.numero);
  const revealsFromPoints = getRevealsFromPoints(vendeur.numero, vendeur.role);
  const revealCost = getRevealCost(vendeur.role);
  const remainingDays = getSubscriptionRemainingDays();

  const processPayment = () => {
    if (selectedTier) {
      addPoints(vendeur.numero, selectedTier.points);
      // Auto-upgrade role if tier grants one
      if (selectedTier.role && selectedTier.role !== vendeur.role) {
        // Only upgrade, never downgrade
        const rolePriority = { free: 0, diambar: 1, king: 2 };
        if (rolePriority[selectedTier.role] > rolePriority[vendeur.role]) {
          updateVendeurRole(vendeur.numero, selectedTier.role);
          vendeur.role = selectedTier.role;
          setUpgradedRole(selectedTier.role);
        }
      }
      // If same role subscription (renewal), update subscription date
      if (selectedTier.role && selectedTier.role === vendeur.role) {
        updateVendeurRole(vendeur.numero, selectedTier.role);
      }
    }
    if (upgradedRole || (selectedTier?.role && selectedTier.role !== 'free' && selectedTier.role !== vendeur.role)) {
      setStep('upgraded');
    } else {
      setStep('success');
    }
  };

  const getRoleLabel = (role) => {
    if (role === 'king') return '👑 KING VIP';
    if (role === 'diambar') return '⚡ Diambar';
    return 'Free';
  };

  // ── Section: Abonnements (shown for free users or expired) ──
  const ShowAbonnements = isFree;

  // Section: Choose tier
  if (step === 'choose' && !selectedTier) {
    return (
      <div className={`py-16 px-4 ${isKing ? 'bg-pro-king-dark' : isDiambar ? 'bg-pro-primary' : 'bg-pro-primary'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-5xl mb-3">💎</div>
            <h1 className="text-2xl font-black text-white">Recharger des Points</h1>
            <p className="text-gray-300 mt-2">1 numéro WhatsApp = {revealCost.toLocaleString('fr-FR')} pts {isKing ? '(tarif KING 👑)' : isDiambar ? '(tarif Diambar ⚡)' : '(tarif standard)'}</p>
            <p className="text-gray-400 text-sm">Solde actuel : <span className="font-bold text-white">{currentPoints.toLocaleString('fr-FR')} pts</span> ({revealsFromPoints} révélations)</p>
            {isDiambar && (
              <p className="text-blue-400 font-bold text-sm mt-1">
                ⚡ Abonnement Diambar actif
                {remainingDays > 0 && <span className="text-gray-400 font-normal"> — {remainingDays}j restants</span>}
              </p>
            )}
            {isKing && (
              <p className="text-yellow-400 font-bold text-sm mt-1">
                👑 Abonnement KING VIP actif
                {remainingDays > 0 && <span className="text-gray-400 font-normal"> — {remainingDays}j restants</span>}
              </p>
            )}
          </div>

          {/* ── Abonnements Diambar & KING ── */}
          {ShowAbonnements && (
            <div className="mb-12">
              <h2 className="text-xl font-black text-white text-center mb-6">🚀 Passe en abonnement premium</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ABONNEMENTS.map(ab => (
                  <div key={ab.role} className={`rounded-2xl p-6 border-2 transition hover:shadow-xl ${
                    ab.role === 'king'
                      ? 'bg-pro-king-gold/10 border-pro-king-gold/40 hover:border-pro-king-gold'
                      : 'bg-blue-500/10 border-blue-500/40 hover:border-blue-500'
                  }`}>
                    <div className="text-center mb-4">
                      <span className="text-4xl">{ab.emoji}</span>
                      <h3 className={`text-xl font-black mt-2 ${ab.role === 'king' ? 'text-pro-king-gold' : 'text-blue-400'}`}>{ab.label}</h3>
                      <p className="text-white text-2xl font-black mt-1">{ab.prix.toLocaleString('fr-FR')} <span className="text-sm text-gray-400">FCFA/mois</span></p>
                    </div>
                    <ul className="space-y-2 mb-5">
                      {ab.perks.map((perk, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="text-green-400 mt-0.5">✓</span>
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-center text-xs text-gray-400 mb-3">+ {ab.points.toLocaleString('fr-FR')} pts inclus — Durée : {ABONNEMENT_DURATION_DAYS} jours</p>
                    <button onClick={() => {
                      const tier = TARIFS_RECHARGE.find(t => t.role === ab.role);
                      if (tier) setSelectedTier(tier);
                    }} className={`w-full font-bold py-3.5 rounded-xl transition hover:shadow-lg ${
                      ab.role === 'king'
                        ? 'bg-gradient-to-r from-pro-king-gold to-yellow-500 text-pro-king-dark'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    }`}>
                      Devenir {ab.label} {ab.emoji}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Renewal notice for premium users ── */}
          {isKing && remainingDays <= 10 && (
            <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">⏳</span>
                <h3 className="font-bold text-yellow-400">Abonnement KING VIP expire dans {remainingDays} jours</h3>
              </div>
              <p className="text-sm text-gray-300 mb-3">Tes points resteront, mais le prix de révélation redeviendra {POINTS_PAR_REVELATION.toLocaleString('fr-FR')} pts au lieu de {POINTS_REVELATION_KING.toLocaleString('fr-FR')} pts.</p>
              <p className="text-xs text-gray-400">Renouvelle en achetant à nouveau le pack KING VIP ci-dessous.</p>
            </div>
          )}

          {isDiambar && remainingDays <= 10 && (
            <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 to-orange-500/10 border border-blue-500/30">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">⏳</span>
                <h3 className="font-bold text-blue-400">Abonnement Diambar expire dans {remainingDays} jours</h3>
              </div>
              <p className="text-sm text-gray-300 mb-3">Tes points resteront, mais le prix de révélation redeviendra {POINTS_PAR_REVELATION.toLocaleString('fr-FR')} pts au lieu de {POINTS_REVELATION_DIAMBAR.toLocaleString('fr-FR')} pts.</p>
              <p className="text-xs text-gray-400">Renouvelle en achetant à nouveau le pack Diambar ci-dessous.</p>
            </div>
          )}

          {/* ── Recharges simples ── */}
          <h2 className="text-xl font-black text-white text-center mb-6">{ShowAbonnements ? 'Ou recharge simple' : '💎 Recharger des points'}</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {TARIFS_RECHARGE.filter(t => !t.role || t.role === vendeur.role).map((tier, idx) => {
              const tierRevealCost = tier.role ? getRevealCost(tier.role) : revealCost;
              const reveals = Math.floor(tier.points / tierRevealCost);
              const isAbonnement = !!tier.role;
              const isRenewal = isAbonnement && ((isKing && tier.role === 'king') || (isDiambar && tier.role === 'diambar'));
              return (
                <button key={tier.prix} onClick={() => setSelectedTier(tier)}
                  className={`w-full rounded-2xl p-5 flex items-center gap-5 transition-all hover:shadow-xl active:scale-[0.99] border-2 text-left ${
                    isKing
                      ? isAbonnement ? 'bg-pro-king-gold/10 border-pro-king-gold/40 hover:border-pro-king-gold' : 'bg-gray-800/50 border-gray-700 hover:border-gray-500'
                      : isAbonnement
                        ? tier.role === 'king' ? 'bg-pro-king-gold/10 border-pro-king-gold/40 hover:border-pro-king-gold' : 'bg-blue-500/10 border-blue-500/40 hover:border-blue-500'
                        : 'bg-pro-secondary border-pro-accent/40 hover:border-pro-accent'
                  }`}>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black flex-shrink-0 ${
                    isAbonnement && tier.role === 'king' ? 'bg-pro-king-gold/20 text-pro-king-gold'
                      : isAbonnement && tier.role === 'diambar' ? 'bg-blue-500/20 text-blue-400'
                      : isKing ? 'bg-gray-700 text-gray-300' : 'bg-pro-accent/30 text-gray-300'
                  }`}>{(tier.points / 1000).toFixed(0)}k</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-white text-lg">{tier.prix.toLocaleString('fr-FR')} FCFA</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                        isAbonnement && tier.role === 'king' ? 'bg-pro-king-gold text-pro-king-dark'
                          : isAbonnement && tier.role === 'diambar' ? 'bg-blue-500 text-white'
                          : isKing ? 'bg-gray-700 text-gray-300' : 'bg-pro-accent/30 text-gray-300'
                      }`}>{isRenewal ? 'Renouvellement' : tier.label}</span>
                      {isAbonnement && tier.role === 'king' && !isRenewal && <span className="text-xs font-bold bg-pro-king-gold text-pro-king-dark px-2 py-0.5 rounded-lg">MEILLEUR</span>}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      <span className="font-bold text-white">{tier.points.toLocaleString('fr-FR')} points</span> — {reveals} numéro{reveals > 1 ? 's' : ''} WhatsApp
                      {isAbonnement && <span className="text-gray-500"> — {ABONNEMENT_DURATION_DAYS} jours</span>}
                    </p>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Section: Choose payment method
  if (step === 'choose' && selectedTier && !method) {
    const isAbonnement = !!selectedTier.role;
    return (
      <div className={`py-16 px-4 ${isKing ? 'bg-pro-king-dark' : 'bg-pro-primary'}`}>
        <div className="max-w-lg mx-auto">
          <button onClick={() => setSelectedTier(null)} className="text-gray-400 text-sm mb-6 hover:text-white">← Retour</button>
          <div className="text-center mb-10">
            <div className="text-5xl mb-3">{isAbonnement ? (selectedTier.role === 'king' ? '👑' : '⚡') : '💎'}</div>
            <h1 className="text-2xl font-black text-white">{selectedTier.points.toLocaleString('fr-FR')} Points</h1>
            {isAbonnement && (
              <p className={`font-bold mt-2 ${selectedTier.role === 'king' ? 'text-pro-king-gold' : 'text-blue-400'}`}>
                {selectedTier.role === 'king' ? '👑 Abonnement KING VIP' : '⚡ Abonnement Diambar'} — {ABONNEMENT_DURATION_DAYS} jours
              </p>
            )}
            <div className={`mt-3 inline-flex items-center gap-2 px-6 py-3 rounded-xl border ${
              isKing ? 'bg-gray-800 border-gray-700' : 'bg-pro-secondary border-pro-accent/30'
            }`}>
              <span className="text-2xl font-black text-white">{selectedTier.prix.toLocaleString('fr-FR')}</span>
              <span className="text-gray-400 font-bold text-sm">FCFA</span>
            </div>
          </div>
          <h3 className="font-bold text-white mb-5 text-center">Choisis ton moyen de paiement</h3>
          <div className="space-y-4">
            <button onClick={() => { setMethod('wave'); setError(''); }}
              className="w-full bg-[#1DC3E0] hover:bg-[#17a8c4] text-white rounded-2xl p-5 flex items-center gap-5 transition-all hover:shadow-lg">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🌊</div>
              <div className="text-left"><p className="font-bold text-lg">Wave</p><p className="text-white/80 text-xs">Paiement instantané</p></div>
              <span className="ml-auto text-xl">→</span>
            </button>
            <button onClick={() => { setMethod('orange'); setError(''); }}
              className="w-full bg-[#FF6600] hover:bg-[#e55c00] text-white rounded-2xl p-5 flex items-center gap-5 transition-all hover:shadow-lg">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🟠</div>
              <div className="text-left"><p className="font-bold text-lg">Orange Money</p><p className="text-white/80 text-xs">Paiement mobile</p></div>
              <span className="ml-auto text-xl">→</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Section: Phone input + payment
  if (step === 'choose' && method) {
    return (
      <div className={`py-16 px-4 ${isKing ? 'bg-pro-king-dark' : 'bg-pro-primary'}`}>
        <div className="max-w-md mx-auto">
          <button onClick={() => { setMethod(null); setError(''); }} className="text-gray-400 text-sm mb-6 hover:text-white">← Retour</button>
          <div className={`rounded-2xl p-8 text-white text-center mb-8 ${method === 'wave' ? 'bg-[#1DC3E0]' : 'bg-[#FF6600]'}`}>
            <div className="text-5xl mb-3">{method === 'wave' ? '🌊' : '🟠'}</div>
            <h2 className="text-xl font-bold">Payer avec {method === 'wave' ? 'Wave' : 'Orange Money'}</h2>
            <p className="text-white/80 text-sm mt-2">{selectedTier.prix.toLocaleString('fr-FR')} FCFA</p>
          </div>
          <div className={`rounded-2xl shadow-xl p-8 space-y-6 ${isKing ? 'bg-gray-800' : 'bg-pro-secondary'}`}>
            {error && <div className="bg-red-900/50 border border-red-500/50 text-red-300 p-4 rounded-xl text-sm text-center">{error}</div>}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">Ton numéro {method === 'wave' ? 'Wave' : 'Orange Money'} *</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="77 000 00 00"
                className={`w-full px-5 py-4 rounded-xl border-2 focus:border-pro-highlight focus:outline-none text-sm ${isKing ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500' : 'bg-pro-primary border-pro-accent/40 text-white placeholder:text-gray-500'}`} />
            </div>
            <button onClick={() => { if (!phone.trim() || phone.trim().length < 9) { setError('Entre ton numéro'); return; } setPaymentRef(generateRef()); setStep('paying'); }}
              className={`w-full text-white font-bold py-4 rounded-xl transition ${method === 'wave' ? 'bg-[#1DC3E0] hover:bg-[#17a8c4]' : 'bg-[#FF6600] hover:bg-[#e55c00]'}`}>
              Payer {selectedTier.prix.toLocaleString('fr-FR')} FCFA
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Section: Manual payment instructions
  if (step === 'paying') {
    const isWave = method === 'wave';
    const color = isWave ? '#1DC3E0' : '#FF6600';
    return (
      <div className={`py-16 px-4 ${isKing ? 'bg-pro-king-dark' : 'bg-pro-primary'}`}>
        <div className="max-w-md mx-auto">
          <div className="rounded-2xl p-8 text-white text-center mb-8" style={{ background: color }}>
            <div className="text-5xl mb-3">{isWave ? '🌊' : '🟠'}</div>
            <h2 className="text-xl font-bold">Envoie le paiement</h2>
          </div>
          <div className={`rounded-2xl shadow-xl p-8 space-y-6 ${isKing ? 'bg-gray-800' : 'bg-pro-secondary'}`}>
            <div className={`rounded-xl p-5 text-center ${isKing ? 'bg-gray-700' : 'bg-pro-primary'}`}>
              <p className="text-xs text-gray-400 mb-2">Ta référence</p>
              <p className="text-2xl font-mono font-black text-white tracking-wider">{paymentRef}</p>
            </div>
            <div className="space-y-5">
              {[
                { n: '1', t: `Ouvre ${isWave ? 'Wave' : 'Orange Money'}`, d: 'Sur ton téléphone' },
                { n: '2', t: `Envoie ${selectedTier.prix.toLocaleString('fr-FR')} FCFA`, d: isWave ? 'Au numéro : 221 77 000 00 00' : 'Via #144#' },
                { n: '3', t: 'Mets la référence', d: `Ajoute ${paymentRef} dans le motif` },
              ].map(s => (
                <div key={s.n} className="flex gap-4">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0" style={{ background: color }}>{s.n}</div>
                  <div><p className="font-semibold text-sm text-white">{s.t}</p><p className="text-xs text-gray-400 mt-0.5">{s.d}</p></div>
                </div>
              ))}
            </div>
            <button onClick={processPayment}
              className="w-full bg-gradient-to-r from-pro-highlight to-emerald-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition">
              ✅ J'ai fait le paiement
            </button>
            <p className="text-xs text-gray-500 text-center">Mode démo : activation instantanée</p>
          </div>
        </div>
      </div>
    );
  }

  // Section: Upgraded (new subscription)
  if (step === 'upgraded') {
    const newRole = upgradedRole || selectedTier?.role;
    const isUpKing = newRole === 'king';
    const newPoints = getPoints(vendeur.numero);
    const newRevealCost = getRevealCost(newRole);
    return (
      <div className={`min-h-[60vh] flex items-center justify-center px-4 ${isUpKing ? 'bg-pro-king-dark' : 'bg-pro-primary'}`}>
        <div className="max-w-sm text-center">
          <div className="text-7xl mb-5 animate-bounce">{isUpKing ? '👑' : '⚡'}</div>
          <h2 className={`text-2xl font-black mb-3 ${isUpKing ? 'text-pro-king-gold' : 'text-blue-400'}`}>
            {isUpKing ? 'KING VIP activé !' : 'Diambar activé !'}
          </h2>
          <p className="text-gray-300 mb-2">Tu es maintenant <span className={`font-bold ${isUpKing ? 'text-pro-king-gold' : 'text-blue-400'}`}>{isUpKing ? '👑 KING VIP' : '⚡ Diambar'}</span></p>
          <p className="text-gray-300 mb-2">Ton solde : <span className="font-bold text-pro-highlight">{newPoints.toLocaleString('fr-FR')} points</span></p>
          <p className={`text-sm font-semibold mb-2 ${isUpKing ? 'text-pro-king-gold' : 'text-blue-400'}`}>
            1 numéro WhatsApp = {newRevealCost.toLocaleString('fr-FR')} pts {isUpKing ? '(tarif KING 👑)' : '(tarif Diambar ⚡)'}
          </p>
          <p className="text-xs text-gray-400 mb-6">Abonnement valable {ABONNEMENT_DURATION_DAYS} jours. Tes points restent si l'abonnement expire, mais le tarif redevient {POINTS_PAR_REVELATION.toLocaleString('fr-FR')} pts.</p>
          <a href="#/dashboard" className={`inline-block font-bold px-10 py-4 rounded-xl hover:shadow-xl transition ${
            isUpKing ? 'bg-gradient-to-r from-pro-king-gold to-yellow-500 text-pro-king-dark' : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
          }`}>
            💎 Mon Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Section: Success (simple recharge)
  if (step === 'success') {
    const newPoints = getPoints(vendeur.numero);
    return (
      <div className={`min-h-[60vh] flex items-center justify-center px-4 ${isKing ? 'bg-pro-king-dark' : isDiambar ? 'bg-pro-primary' : 'bg-pro-primary'}`}>
        <div className="max-w-sm text-center">
          <div className="text-7xl mb-5 animate-bounce">💎</div>
          <h2 className="text-2xl font-black text-white mb-3">Points ajoutés !</h2>
          <p className="text-gray-300 mb-2">Ton solde est maintenant de <span className="font-bold text-pro-highlight">{newPoints.toLocaleString('fr-FR')} points</span>.</p>
          <p className="text-sm text-pro-highlight font-semibold mb-6">
            1 numéro WhatsApp = {revealCost.toLocaleString('fr-FR')} pts {isKing ? '(tarif KING 👑)' : isDiambar ? '(tarif Diambar ⚡)' : '(tarif standard)'}
          </p>
          <a href="#/dashboard" className="inline-block bg-gradient-to-r from-pro-highlight to-emerald-600 text-white font-bold px-10 py-4 rounded-xl hover:shadow-xl transition">
            💎 Mon Dashboard
          </a>
        </div>
      </div>
    );
  }

  return null;
}
