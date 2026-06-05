import { useState } from 'react';
import { getVendeur, getPoints, addPoints, TARIFS_RECHARGE, getRevealsFromPoints, getRevealCost, generateRef, POINTS_PAR_REVELATION, POINTS_REVELATION_KING } from '../utils/storage';

export default function RechargePage() {
  const vendeur = getVendeur();
  const [selectedTier, setSelectedTier] = useState(null);
  const [method, setMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('choose'); // choose | paying | success
  const [phone, setPhone] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [error, setError] = useState('');

  if (!vendeur) { window.location.hash = '#/vendeur'; return null; }

  const isKing = vendeur.role === 'king';
  const currentPoints = getPoints(vendeur.numero);
  const revealsFromPoints = getRevealsFromPoints(vendeur.numero, vendeur.role);
  const revealCost = getRevealCost(vendeur.role);

  const processPayment = () => {
    if (selectedTier) {
      addPoints(vendeur.numero, selectedTier.points);
    }
    setStep('success');
  };

  // Section: Choose tier
  if (step === 'choose' && !selectedTier) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-5xl mb-3">💎</div>
            <h1 className="text-2xl font-black gradient-text">Recharger des Points</h1>
            <p className="text-gray-500 mt-2">1 numéro WhatsApp = {revealCost.toLocaleString('fr-FR')} pts {isKing ? '(tarif KING 👑)' : ''}</p>
            <p className="text-gray-500 text-sm">Solde actuel : <span className="font-bold">{currentPoints.toLocaleString('fr-FR')} pts</span> ({revealsFromPoints} révélations)</p>
          </div>

          <div className="space-y-4">
            {TARIFS_RECHARGE.map((tier, idx) => {
              const reveals = Math.floor(tier.points / revealCost);
              const isBest = idx === 4;
              const isPopular = idx === 2;
              return (
                <button key={tier.prix} onClick={() => setSelectedTier(tier)}
                  className={`w-full bg-white rounded-2xl p-5 flex items-center gap-5 transition-all hover:shadow-xl active:scale-[0.99] border-2 text-left ${
                    isBest ? 'border-pro-king-gold/50' : isPopular ? 'border-pro-highlight/50' : 'border-gray-200 hover:border-pro-highlight/30'
                  }`}>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black flex-shrink-0 ${
                    isBest ? 'bg-pro-king-gold/20 text-pro-king-dark' : isPopular ? 'bg-pro-highlight/10 text-pro-highlight' : 'bg-gray-100 text-gray-500'
                  }`}>{(tier.points / 1000).toFixed(0)}k</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-800 text-lg">{tier.prix.toLocaleString('fr-FR')} FCFA</p>
                      <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg">{tier.label}</span>
                      {isPopular && <span className="text-xs font-bold bg-pro-highlight text-white px-2 py-0.5 rounded-lg">POPULAIRE</span>}
                      {isBest && <span className="text-xs font-bold bg-pro-king-gold text-pro-king-dark px-2 py-0.5 rounded-lg">MEILLEUR</span>}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="font-bold text-gray-800">{tier.points.toLocaleString('fr-FR')} points</span> — {reveals} numéro{reveals > 1 ? 's' : ''} WhatsApp
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
    return (
      <div className="py-16 px-4">
        <div className="max-w-lg mx-auto">
          <button onClick={() => setSelectedTier(null)} className="text-gray-500 text-sm mb-6 hover:text-gray-800">← Retour</button>
          <div className="text-center mb-10">
            <div className="text-5xl mb-3">💎</div>
            <h1 className="text-2xl font-black gradient-text">{selectedTier.points.toLocaleString('fr-FR')} Points</h1>
            <div className="mt-3 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200">
              <span className="text-2xl font-black text-gray-800">{selectedTier.prix.toLocaleString('fr-FR')}</span>
              <span className="text-gray-500 font-bold text-sm">FCFA</span>
            </div>
          </div>
          <h3 className="font-bold text-gray-800 mb-5 text-center">Choisis ton moyen de paiement</h3>
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
      <div className="py-16 px-4">
        <div className="max-w-md mx-auto">
          <button onClick={() => { setMethod(null); setError(''); }} className="text-gray-500 text-sm mb-6 hover:text-gray-800">← Retour</button>
          <div className={`rounded-2xl p-8 text-white text-center mb-8 ${method === 'wave' ? 'bg-[#1DC3E0]' : 'bg-[#FF6600]'}`}>
            <div className="text-5xl mb-3">{method === 'wave' ? '🌊' : '🟠'}</div>
            <h2 className="text-xl font-bold">Payer avec {method === 'wave' ? 'Wave' : 'Orange Money'}</h2>
            <p className="text-white/80 text-sm mt-2">{selectedTier.prix.toLocaleString('fr-FR')} FCFA</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            {error && <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl text-sm text-center">{error}</div>}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Ton numéro {method === 'wave' ? 'Wave' : 'Orange Money'} *</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="77 000 00 00"
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-pro-highlight focus:outline-none text-sm" />
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
      <div className="py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="rounded-2xl p-8 text-white text-center mb-8" style={{ background: color }}>
            <div className="text-5xl mb-3">{isWave ? '🌊' : '🟠'}</div>
            <h2 className="text-xl font-bold">Envoie le paiement</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="bg-gray-50 rounded-xl p-5 text-center">
              <p className="text-xs text-gray-500 mb-2">Ta référence</p>
              <p className="text-2xl font-mono font-black text-gray-800 tracking-wider">{paymentRef}</p>
            </div>
            <div className="space-y-5">
              {[
                { n: '1', t: `Ouvre ${isWave ? 'Wave' : 'Orange Money'}`, d: 'Sur ton téléphone' },
                { n: '2', t: `Envoie ${selectedTier.prix.toLocaleString('fr-FR')} FCFA`, d: isWave ? 'Au numéro : 221 77 000 00 00' : 'Via #144#' },
                { n: '3', t: 'Mets la référence', d: `Ajoute ${paymentRef} dans le motif` },
              ].map(s => (
                <div key={s.n} className="flex gap-4">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0" style={{ background: color }}>{s.n}</div>
                  <div><p className="font-semibold text-sm text-gray-800">{s.t}</p><p className="text-xs text-gray-500 mt-0.5">{s.d}</p></div>
                </div>
              ))}
            </div>
            <button onClick={processPayment}
              className="w-full bg-gradient-to-r from-pro-highlight to-emerald-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition">
              ✅ J'ai fait le paiement
            </button>
            <p className="text-xs text-gray-400 text-center">Mode démo : activation instantanée</p>
          </div>
        </div>
      </div>
    );
  }

  // Section: Success
  if (step === 'success') {
    const newPoints = getPoints(vendeur.numero);
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <div className="text-7xl mb-5 animate-bounce">💎</div>
          <h2 className="text-2xl font-black gradient-text mb-3">Points ajoutés !</h2>
          <p className="text-gray-600 mb-2">Ton solde est maintenant de {newPoints.toLocaleString('fr-FR')} points.</p>
          <p className="text-sm text-pro-highlight font-semibold mb-6">
            1 numéro WhatsApp = {revealCost.toLocaleString('fr-FR')} pts {isKing ? '(tarif KING 👑)' : ''}
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
