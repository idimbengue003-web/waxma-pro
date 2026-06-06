import { useState } from 'react';
import { getVendeur, getPoints, getRevealsFromPoints, getRevealCost, getAuthUser, isSiteAdmin, logoutSiteAdmin, checkSubscriptionExpiry, getSubscriptionRemainingDays, POINTS_PAR_REVELATION, POINTS_REVELATION_KING } from '../utils/storage';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  // Check subscription expiry on load
  checkSubscriptionExpiry();
  const vendeur = getVendeur();
  const isKing = vendeur?.role === 'king';
  const remainingDays = getSubscriptionRemainingDays();
  const authUser = getAuthUser();
  const showAdmin = authUser && authUser.role === 'admin';

  const phone = vendeur?.numero || '';
  const points = phone ? getPoints(phone) : 0;
  const revealsFromPoints = phone ? getRevealsFromPoints(phone, vendeur?.role || 'free') : 0;
  const revealCost = vendeur ? getRevealCost(vendeur.role) : POINTS_PAR_REVELATION;

  const handleLogout = () => {
    logoutSiteAdmin();
    setMenuOpen(false);
    window.location.hash = '#/';
  };

  return (
    <header className={`backdrop-blur-md sticky top-0 z-50 border-b shadow-sm ${isKing ? 'bg-white/80 border-yellow-300' : 'bg-white/80 border-gray-200'}`}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 md:py-4 flex items-center justify-between gap-4 md:gap-8">
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <a href="#/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`font-extrabold text-lg md:text-xl px-3 md:px-5 py-2 md:py-2.5 rounded-xl tracking-tight cursor-pointer transition-shadow ${
            isKing ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-md shadow-yellow-500/20 hover:shadow-lg hover:shadow-yellow-500/30' : 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30'
          }`}>Wakhma</a>
          <span className={`font-bold text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-lg uppercase tracking-wider ${
            isKing ? 'text-yellow-600 bg-yellow-50 border border-yellow-200' : 'text-emerald-600 bg-emerald-50 border border-emerald-200'
          }`}>PRO</span>
          {isKing && <span className="text-lg">👑</span>}
        </div>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-7 ml-8">
          <a href="#/" className={`font-medium text-sm transition-colors ${isKing ? 'text-gray-600 hover:text-yellow-600' : 'text-gray-600 hover:text-emerald-600'}`}>Accueil</a>
          <a href="#/demandes" className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition ${isKing ? 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'}`}>📋 Annonces</a>
          {vendeur && (
            <a href="#/recharge" className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
              isKing ? 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
            }`}>
              <span>💎</span>
              <span>{points.toLocaleString('fr-FR')}</span>
              <span className="text-xs font-normal text-gray-400">pts</span>
              {revealsFromPoints > 0 && (
                <span className={`text-xs ml-1 px-2 py-0.5 rounded-lg ${isKing ? 'bg-yellow-100 text-yellow-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {revealsFromPoints} dispo
                </span>
              )}
            </a>
          )}
          {vendeur ? (
            <a href="#/dashboard" className={`font-bold px-6 py-2.5 rounded-xl text-sm ${isKing ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' : 'bg-gradient-to-r from-emerald-500 to-emerald-700 text-white'}`}>Dashboard</a>
          ) : (
            <a href="#/vendeur" className="bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm">Espace Vendeur</a>
          )}
          {showAdmin ? (
            <>
              <a href="#/admin" className={`font-bold text-sm px-4 py-2 rounded-xl transition ${isKing ? 'text-yellow-600 bg-yellow-50 border border-yellow-200 hover:bg-yellow-100' : 'text-emerald-600 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100'}`}>ADMIN 🔒</a>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors text-sm font-medium">Déconnexion</button>
            </>
          ) : (
            <a href="#/login" className="text-gray-400 hover:text-gray-700 transition-colors text-sm font-medium">Se connecter</a>
          )}
        </nav>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-1.5">
          <a href="#/demandes" className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-bold ${
            isKing ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>📋</a>
          {vendeur && (
            <a href="#/recharge" className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-bold ${
              isKing ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>💎</a>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-600 p-1.5">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      <div className={`text-center py-2.5 text-sm font-medium tracking-wide border-y ${
        isKing ? 'bg-gradient-to-r from-yellow-50 to-yellow-100/50 text-yellow-600 border-yellow-200/50' : 'bg-gradient-to-r from-emerald-50 to-emerald-100/50 text-emerald-600 border-emerald-200/50'
      }`}>
        {isKing && '👑 KING — '}
        {vendeur && remainingDays > 0 && remainingDays <= 5 && (
          <span className="text-red-500 font-bold mr-2">⏳ {remainingDays}j restants — </span>
        )}
        Le marché rapide de Dakar
      </div>

      {menuOpen && (
        <div className={`md:hidden border-t animate-fade-in-up shadow-lg ${isKing ? 'bg-white border-yellow-200' : 'bg-white border-gray-200'}`}>
          <nav className="flex flex-col p-6 gap-3">
            <a href="#/" onClick={() => setMenuOpen(false)} className={`font-medium py-3 px-5 rounded-xl text-sm transition-colors ${isKing ? 'text-gray-600 hover:bg-yellow-50' : 'text-gray-600 hover:bg-gray-50'}`}>🏠 Accueil</a>
            <a href="#/demandes" onClick={() => setMenuOpen(false)} className={`font-medium py-3 px-5 rounded-xl text-sm transition-colors ${isKing ? 'text-gray-600 hover:bg-yellow-50' : 'text-gray-600 hover:bg-gray-50'}`}>📋 Annonces</a>

            {vendeur && (
              <div className={`rounded-xl p-4 mt-1 ${isKing ? 'bg-yellow-50 border border-yellow-200' : 'bg-emerald-50 border border-emerald-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💎</span>
                    <span className={`font-bold text-sm ${isKing ? 'text-yellow-700' : 'text-emerald-700'}`}>{points.toLocaleString('fr-FR')} points</span>
                  </div>
                  <a href="#/recharge" onClick={() => setMenuOpen(false)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg ${isKing ? 'bg-yellow-500 text-white' : 'bg-emerald-600 text-white'}`}>+ Recharger</a>
                </div>
                <div className="flex gap-3 mb-2">
                  <div className="flex-1 rounded-lg p-2 text-center bg-white">
                    <p className={`text-base font-bold ${isKing ? 'text-yellow-600' : 'text-emerald-600'}`}>{revealsFromPoints}</p>
                    <p className="text-[10px] text-gray-400">Révélations</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400">
                  1 numéro = {revealCost.toLocaleString('fr-FR')} pts {isKing ? '(tarif KING 👑)' : ''}
                </p>
              </div>
            )}

            {vendeur ? (
              <a href="#/dashboard" onClick={() => setMenuOpen(false)} className={`font-bold py-3.5 px-5 rounded-xl text-center text-sm ${isKing ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' : 'bg-gradient-to-r from-emerald-500 to-emerald-700 text-white'}`}>📊 Dashboard</a>
            ) : (
              <a href="#/vendeur" onClick={() => setMenuOpen(false)} className="bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold py-3.5 px-5 rounded-xl text-center text-sm">🏪 Espace Vendeur</a>
            )}

            {showAdmin ? (
              <>
                <a href="#/admin" onClick={() => setMenuOpen(false)} className={`font-bold py-3 px-5 rounded-xl text-sm ${isKing ? 'text-yellow-600 bg-yellow-50 border border-yellow-200' : 'text-emerald-600 bg-emerald-50 border border-emerald-200'}`}>ADMIN 🔒</a>
                <button onClick={handleLogout} className="text-red-500 font-medium py-3 px-5 rounded-xl hover:bg-red-50 transition text-sm text-left">Déconnexion</button>
              </>
            ) : (
              <a href="#/login" onClick={() => setMenuOpen(false)} className="text-gray-400 py-3 px-5 rounded-xl hover:text-gray-700 hover:bg-gray-50 transition text-sm">Se connecter</a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
