import { useState } from 'react';
import { setVendeur, KYC_INSCRIPTION_PRIX, POINTS_KYC } from '../utils/storage';

export default function VendeurLogin({ onLogin }) {
  const [step, setStep] = useState(1); // 1=form, 2=OTP, 3=payment, 4=success
  const [nom, setNom] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = () => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(code);
    setStep(2);
    setOtpCountdown(60);
    const timer = setInterval(() => {
      setOtpCountdown(prev => { if (prev <= 1) { clearInterval(timer); return 0; } return prev - 1; });
    }, 1000);
    // In demo mode, show OTP on screen
  };

  const handleStep1 = (e) => {
    e.preventDefault();
    setError('');
    if (!nom.trim()) { setError('Nom de boutique obligatoire'); return; }
    if (!phone.trim() || !/^7[0-8]\d{7}$/.test(phone.trim())) { setError('Numéro WhatsApp invalide (77/78/76/70...)'); return; }
    // Check duplicate
    const existing = JSON.parse(localStorage.getItem('waxma_pro_vendeurs') || '[]');
    if (existing.find(v => v.numero === phone.trim())) { setError('Numéro déjà inscrit sur WAXMA'); return; }
    sendOtp();
  };

  const handleStep2 = (e) => {
    e.preventDefault();
    setError('');
    if (otp !== generatedOtp) { setError('Code OTP incorrect'); return; }
    setStep(3);
  };

  const handleStep3 = () => {
    setError('');
    // Create vendor
    const vendeur = {
      numero: phone.trim(),
      nom: nom.trim(),
      points: POINTS_KYC,
      role: 'free',
      date_inscription: new Date().toISOString(),
      revelations_total: 0,
      ventes_total: 0,
    };
    setVendeur(vendeur);
    // Save to list
    const vendeurs = JSON.parse(localStorage.getItem('waxma_pro_vendeurs') || '[]');
    vendeurs.push(vendeur);
    localStorage.setItem('waxma_pro_vendeurs', JSON.stringify(vendeurs));
    setStep(4);
  };

  const handleLogin = () => {
    const existing = JSON.parse(localStorage.getItem('waxma_pro_vendeurs') || '[]');
    const found = existing.find(v => v.numero === phone.trim());
    if (found) { setVendeur(found); onLogin?.(found); window.location.hash = '#/dashboard'; }
    else { setError('Numéro non trouvé. Inscris-toi d\'abord.'); }
  };

  if (step === 4) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <div className="text-7xl mb-5 animate-bounce">🎉</div>
          <h2 className="text-2xl font-black gradient-text mb-3">Bienvenue Pro !</h2>
          <p className="text-gray-600 mb-2">{KYC_INSCRIPTION_PRIX}F = {POINTS_KYC.toLocaleString('fr-FR')} Points = {Math.floor(POINTS_KYC / 1500)} révélations test.</p>
          <p className="text-red-600 font-bold text-sm mb-6">Choisis bien. WAXMA ne rembourse PAS les Points.</p>
          <a href="#/dashboard" className="inline-block bg-gradient-to-r from-pro-highlight to-emerald-600 text-white font-bold px-10 py-4 rounded-xl hover:shadow-lg transition">
            💎 Mon Dashboard
          </a>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">📱</div>
            <h1 className="text-2xl font-black gradient-text">Vérification WhatsApp</h1>
            <p className="text-gray-500 mt-2">Code envoyé au {phone}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-5">
            {error && <div className="bg-red-50 border-2 border-red-300 text-red-700 p-4 rounded-xl text-sm text-center">{error}</div>}
            {/* Demo: show OTP */}
            <div className="bg-green-50 border-2 border-green-300 text-green-800 p-4 rounded-xl text-center">
              <p className="text-xs mb-1">Mode démo — Code OTP :</p>
              <p className="text-3xl font-black font-mono tracking-widest">{generatedOtp}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Code OTP (6 chiffres)</label>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000" className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-pro-highlight focus:outline-none text-center text-2xl font-mono tracking-widest" />
            </div>
            <button onClick={handleStep2} className="w-full bg-gradient-to-r from-pro-highlight to-emerald-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition text-sm">
              Vérifier
            </button>
            <button disabled={otpCountdown > 0} onClick={sendOtp}
              className="w-full py-3 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-40">
              {otpCountdown > 0 ? `Renvoyer dans ${otpCountdown}s` : 'Renvoyer le code'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🟠</div>
            <h1 className="text-2xl font-black gradient-text">Caution Pro WAXMA</h1>
            <p className="text-gray-500 mt-2">{KYC_INSCRIPTION_PRIX}F crédités {POINTS_KYC.toLocaleString('fr-FR')} Points</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-5">
            <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-5 text-center">
              <p className="text-sm text-orange-700 mb-2">Envoie {KYC_INSCRIPTION_PRIX}F via Orange Money</p>
              <p className="text-xs text-orange-600">Au numéro : #144#</p>
              <p className="text-xs text-orange-500 mt-1">Motif : Caution Pro WAXMA - {KYC_INSCRIPTION_PRIX}F</p>
            </div>
            <button onClick={handleStep3}
              className="w-full bg-gradient-to-r from-pro-highlight to-emerald-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition text-sm">
              ✅ J'ai fait le paiement ({KYC_INSCRIPTION_PRIX}F)
            </button>
            <p className="text-xs text-gray-400 text-center">Mode démo : activation instantanée</p>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Registration / Login
  return (
    <div className="py-16 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏪</div>
          <h1 className="text-2xl font-black gradient-text">Espace Vendeur</h1>
          <p className="text-gray-500 mt-2">Inscris-toi pour révéler les numéros des clients</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-5">
          {error && <div className="bg-red-50 border-2 border-red-300 text-red-700 p-4 rounded-xl text-sm text-center">{error}</div>}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Nom de boutique *</label>
            <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex: Chez Moustapha"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pro-highlight focus:outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Numéro WhatsApp *</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="77 000 00 00"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pro-highlight focus:outline-none text-sm" />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600">
            <p className="font-bold mb-2">💡 Inscription = {KYC_INSCRIPTION_PRIX}F</p>
            <p>{KYC_INSCRIPTION_PRIX}F = {POINTS_KYC.toLocaleString('fr-FR')} Points = {Math.floor(POINTS_KYC / 1500)} révélations test</p>
            <p className="text-red-600 font-semibold mt-2 text-xs">WAXMA ne rembourse PAS les Points.</p>
          </div>

          <button onClick={handleStep1}
            className="w-full bg-gradient-to-r from-pro-highlight to-emerald-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition text-sm">
            S'inscrire ({KYC_INSCRIPTION_PRIX}F)
          </button>

          <div className="relative my-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div><div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">ou</span></div></div>

          <button onClick={handleLogin}
            className="w-full bg-gray-100 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-200 transition text-sm">
            Se connecter (déjà inscrit)
          </button>
        </div>
      </div>
    </div>
  );
}
