import { useState } from 'react';
import { getVendeur, getPoints, getRevealsFromPoints, getRevealCost, getAuthUser, isSiteAdmin, logoutSiteAdmin, POINTS_PAR_REVELATION, POINTS_REVELATION_KING } from '../utils/storage';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const vendeur = getVendeur();
  const isKing = vendeur?.role === 'king';
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
    <header className={`sticky top-0 z-50 border-b shadow-sm ${isKing ? 'bg-[#1A1A2E]/95 backdrop-blur-md border-[#FFD700]/20' : 'bg-[#0F1B2D]/95 backdrop-blur-md border-blue-500/20'}`}>
      <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="#/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`font-extrabold text-xl px-5 py-2.5 rounded-xl tracking-tight cursor-pointer transition-shadow ${
            isKing ? 'bg-[#FFD700] text-[#1A1A2E] shadow-md shadow-yellow-500/20' : 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-md shadow-blue-500/20'
          }`}>Wakhma</a>
          <span className={`font-bold text-xs px-3 py-1.5 rounded-lg uppercase tracking-wider ${
            isKing ? 'text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/20' : 'text-blue-400 bg-blue-500/10 border border-blue-500/20'
          }`}>PRO</span>
          {isKing && <span className="text-lg">👑</span>}
        </div>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-7">
          <a href="#/" className={`font-medium text-sm transition-colors ${isKing ? 'text-gray-300 hover:text-[#FFD700]' : 'text-gray-300 hover:text-blue-400'}`}>Accueil</a>
          <a href="#/demandes" className={`font-medium text-sm transition-colors ${isKing ? 'text-gray-300 hover:text-[#FFD700]' : 'text-gray-300 hover:text-blue-400'}`}>📋 Annonces</a>
          {vendeur && (
            <a href="#/recharge" className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
              isKing ? 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
            }`}>
              <span>💎</span>
              <span>{points.toLocaleString('fr-FR')}</span>
              <span className={`text-xs font-normal ${isKing ? 'text-gray-400' : 'text-gray-400'}`}>pts</span>
              {revealsFromPoints > 0 && (
                <span className={`text-xs ml-1 px-2 py-0.5 rounded-lg ${isKing ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'bg-blue-500/20 text-blue-400'}`}>
                  {revealsFromPoints} dispo
                </span>
              )}
            </a>
          )}
          {vendeur ? (
            <a href="#/dashboard" className={`font-bold px-6 py-2.5 rounded-xl text-sm ${isKing ? 'bg-gradient-to-r from-[#FFD700] to-yellow-500 text-[#1A1A2E]' : 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'}`}>Dashboard</a>
          ) : (
            <a href="#/vendeur" className="bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm">Espace Vendeur</a>
          )}
          {showAdmin ? (
            <>
              <a href="#/admin" className={`font-bold text-sm px-4 py-2 rounded-xl transition ${isKing ? 'text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/20 hover:bg-[#FFD700]/20' : 'text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20'}`}>ADMIN 🔒</a>
              <button onClick={handleLogout} className={`text-xs hover:text-red-400 transition-colors ${isKing ? 'text-gray-500' : 'text-gray-400'}`}>Déconnexion</button>
            </>
          ) : (
            <a href="#/login" className={`text-xs transition-colors ${isKing ? 'text-gray-500 hover:text-[#FFD700]' : 'text-gray-400 hover:text-blue-400'}`}>Se connecter</a>
          )}
        </nav>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-3">
          <a href="#/demandes" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
            isKing ? 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
          }`}>📋 Annonces</a>
          {vendeur && (
            <a href="#/recharge" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
              isKing ? 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
            }`}>💎 {points.toLocaleString('fr-FR')}</a>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} className={`p-2 ${isKing ? 'text-[#FFD700]' : 'text-blue-400'}`}>
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      <div className={`text-center py-2.5 text-sm font-medium tracking-wide border-y ${
        isKing ? 'bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/10' : 'bg-blue-500/10 text-blue-400 border-blue-500/10'
      }`}>
        {isKing && '👑 KING — '}
        Le marché rapide de Dakar
      </div>

      {menuOpen && (
        <div className={`md:hidden border-t animate-fade-in-up shadow-lg ${isKing ? 'bg-[#1A1A2E] border-gray-800' : 'bg-[#0F1B2D] border-blue-500/20'}`}>
          <nav className="flex flex-col p-6 gap-3">
            <a href="#/" onClick={() => setMenuOpen(false)} className={`font-medium py-3 px-5 rounded-xl text-sm transition-colors ${isKing ? 'text-gray-300 hover:bg-gray-900' : 'text-gray-300 hover:bg-blue-500/10'}`}>🏠 Accueil</a>
            <a href="#/demandes" onClick={() => setMenuOpen(false)} className={`font-medium py-3 px-5 rounded-xl text-sm transition-colors ${isKing ? 'text-gray-300 hover:bg-gray-900' : 'text-gray-300 hover:bg-blue-500/10'}`}>📋 Annonces</a>

            {vendeur && (
              <div className={`rounded-xl p-4 mt-1 ${isKing ? 'bg-[#FFD700]/10 border border-[#FFD700]/20' : 'bg-blue-500/10 border border-blue-500/20'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💎</span>
                    <span className={`font-bold text-sm ${isKing ? 'text-[#FFD700]' : 'text-blue-400'}`}>{points.toLocaleString('fr-FR')} points</span>
                  </div>
                  <a href="#/recharge" onClick={() => setMenuOpen(false)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg ${isKing ? 'bg-[#FFD700] text-[#1A1A2E]' : 'bg-blue-500 text-white'}`}>+ Recharger</a>
                </div>
                <div className="flex gap-3 mb-2">
                  <div className={`flex-1 rounded-lg p-2 text-center ${isKing ? 'bg-gray-800/50' : 'bg-[#0A1628]/80'}`}>
                    <p className="text-base font-bold text-white">{revealsFromPoints}</p>
                    <p className="text-[10px] text-gray-400">Révélations</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400">
                  1 numéro = {revealCost.toLocaleString('fr-FR')} pts {isKing ? '(tarif KING 👑)' : ''}
                </p>
              </div>
            )}

            {vendeur ? (
              <a href="#/dashboard" onClick={() => setMenuOpen(false)} className={`font-bold py-3.5 px-5 rounded-xl text-center text-sm ${isKing ? 'bg-gradient-to-r from-[#FFD700] to-yellow-500 text-[#1A1A2E]' : 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'}`}>📊 Dashboard</a>
            ) : (
              <a href="#/vendeur" onClick={() => setMenuOpen(false)} className="bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold py-3.5 px-5 rounded-xl text-center text-sm">🏪 Espace Vendeur</a>
            )}

            {showAdmin ? (
              <>
                <a href="#/admin" onClick={() => setMenuOpen(false)} className={`font-bold py-3 px-5 rounded-xl text-sm ${isKing ? 'text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/20' : 'text-blue-400 bg-blue-500/10 border border-blue-500/20'}`}>ADMIN 🔒</a>
                <button onClick={handleLogout} className="text-red-400 font-medium py-3 px-5 rounded-xl hover:bg-red-500/10 transition text-sm text-left">Déconnexion</button>
              </>
            ) : (
              <a href="#/login" onClick={() => setMenuOpen(false)} className={`py-3 px-5 rounded-xl text-sm transition-colors ${isKing ? 'text-gray-500 hover:text-[#FFD700]' : 'text-gray-400 hover:text-blue-400'}`}>Se connecter</a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
