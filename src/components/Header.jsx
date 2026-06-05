import { useState } from 'react';
import { getVendeur, getPoints, getRevealsFromPoints, getRevealCost, POINTS_PAR_REVELATION, POINTS_REVELATION_KING } from '../utils/storage';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const vendeur = getVendeur();
  const isKing = vendeur?.role === 'king';

  const phone = vendeur?.numero || '';
  const points = phone ? getPoints(phone) : 0;
  const revealsFromPoints = phone ? getRevealsFromPoints(phone, vendeur?.role || 'free') : 0;
  const revealCost = vendeur ? getRevealCost(vendeur.role) : POINTS_PAR_REVEAL;

  return (
    <header className={`sticky top-0 z-50 border-b ${isKing ? 'bg-pro-king-dark border-pro-king-gold/20' : 'bg-pro-primary/95 backdrop-blur-md border-pro-accent/20'}`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`font-extrabold text-xl px-4 py-2 rounded-xl tracking-tight ${
            isKing ? 'bg-pro-king-gold text-pro-king-dark' : 'bg-gradient-to-br from-pro-highlight to-emerald-600 text-white shadow-lg shadow-pro-highlight/20'
          }`}>WAXMA</div>
          <span className={`font-bold text-xs px-3 py-1 rounded-lg uppercase tracking-wider ${
            isKing ? 'text-pro-king-gold bg-pro-king-gold/10 border border-pro-king-gold/20' : 'text-pro-highlight bg-pro-highlight/10 border border-pro-highlight/20'
          }`}>PRO</span>
          {isKing && <span className="text-lg">👑</span>}
        </div>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-5">
          <a href="#/" className={`font-medium text-sm ${isKing ? 'text-gray-300 hover:text-pro-king-gold' : 'text-pro-text hover:text-pro-highlight'}`}>Accueil</a>
          <a href="#/demandes" className={`font-medium text-sm ${isKing ? 'text-gray-300 hover:text-pro-king-gold' : 'text-pro-text hover:text-pro-highlight'}`}>Demandes</a>
          {vendeur && (
            <a href="#/recharge" className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
              isKing ? 'bg-pro-king-gold/10 text-pro-king-gold border border-pro-king-gold/20' : 'bg-pro-highlight/10 text-pro-highlight border border-pro-highlight/20'
            }`}>
              <span>💎</span>
              <span>{points.toLocaleString('fr-FR')}</span>
              <span className={`text-xs font-normal ${isKing ? 'text-gray-400' : 'text-pro-muted'}`}>pts</span>
              {revealsFromPoints > 0 && (
                <span className={`text-xs ml-1 px-2 py-0.5 rounded-lg ${isKing ? 'bg-pro-king-gold/20 text-pro-king-gold' : 'bg-pro-highlight/20 text-pro-highlight'}`}>
                  {revealsFromPoints} dispo
                </span>
              )}
            </a>
          )}
          {vendeur ? (
            <a href="#/dashboard" className="bg-gradient-to-r from-pro-highlight to-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm">Dashboard</a>
          ) : (
            <a href="#/vendeur" className="bg-gradient-to-r from-pro-blue to-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm">Espace Vendeur</a>
          )}
          <a href="#/admin" className={`text-xs ${isKing ? 'text-gray-500 hover:text-pro-king-gold' : 'text-pro-muted hover:text-pro-text'}`}>Admin</a>
        </nav>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-3">
          {vendeur && (
            <a href="#/recharge" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
              isKing ? 'bg-pro-king-gold/10 text-pro-king-gold border border-pro-king-gold/20' : 'bg-pro-highlight/10 text-pro-highlight border border-pro-highlight/20'
            }`}>💎 {points.toLocaleString('fr-FR')}</a>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} className={`p-2 ${isKing ? 'text-pro-king-gold' : 'text-pro-text'}`}>
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      <div className={`text-center py-2.5 text-sm font-medium tracking-wide border-y ${
        isKing ? 'bg-pro-king-gold/10 text-pro-king-gold border-pro-king-gold/10' : 'bg-pro-secondary/80 text-pro-text border-pro-accent/10'
      }`}>
        {isKing && '👑 KING — '}
        <span className={isKing ? '' : 'text-pro-highlight'}>Le marché rapide</span> de Dakar
      </div>

      {menuOpen && (
        <div className={`md:hidden border-t animate-fade-in-up ${isKing ? 'bg-pro-king-dark border-gray-800' : 'bg-pro-secondary border-pro-accent/20'}`}>
          <nav className="flex flex-col p-6 gap-3">
            <a href="#/" onClick={() => setMenuOpen(false)} className={`font-medium py-3 px-5 rounded-xl text-sm ${isKing ? 'text-gray-300 hover:bg-gray-900' : 'text-pro-text hover:bg-pro-accent/10'}`}>Accueil</a>
            <a href="#/demandes" onClick={() => setMenuOpen(false)} className={`font-medium py-3 px-5 rounded-xl text-sm ${isKing ? 'text-gray-300 hover:bg-gray-900' : 'text-pro-text hover:bg-pro-accent/10'}`}>Demandes</a>

            {vendeur && (
              <div className={`rounded-xl p-4 mt-1 ${isKing ? 'bg-pro-king-gold/10 border border-pro-king-gold/20' : 'bg-pro-highlight/5 border border-pro-highlight/15'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💎</span>
                    <span className={`font-bold text-sm ${isKing ? 'text-pro-king-gold' : 'text-pro-highlight'}`}>{points.toLocaleString('fr-FR')} points</span>
                  </div>
                  <a href="#/recharge" onClick={() => setMenuOpen(false)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg ${isKing ? 'bg-pro-king-gold text-pro-king-dark' : 'bg-pro-highlight text-white'}`}>+ Recharger</a>
                </div>
                <div className="flex gap-3 mb-2">
                  <div className={`flex-1 rounded-lg p-2 text-center ${isKing ? 'bg-gray-800/50' : 'bg-pro-primary/50'}`}>
                    <p className={`text-base font-bold ${isKing ? 'text-white' : 'text-pro-text'}`}>{revealsFromPoints}</p>
                    <p className={`text-[10px] ${isKing ? 'text-gray-400' : 'text-pro-muted'}`}>Révélations</p>
                  </div>
                </div>
                <p className={`text-[10px] ${isKing ? 'text-gray-500' : 'text-pro-muted'}`}>
                  1 numéro = {revealCost.toLocaleString('fr-FR')} pts {isKing ? '(tarif KING 👑)' : ''}
                </p>
              </div>
            )}

            {vendeur ? (
              <a href="#/dashboard" onClick={() => setMenuOpen(false)} className="bg-gradient-to-r from-pro-highlight to-emerald-600 text-white font-bold py-3.5 px-5 rounded-xl text-center text-sm">Dashboard</a>
            ) : (
              <a href="#/vendeur" onClick={() => setMenuOpen(false)} className="bg-gradient-to-r from-pro-blue to-blue-600 text-white font-bold py-3.5 px-5 rounded-xl text-center text-sm">Espace Vendeur</a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
