import { useState, useEffect } from 'react';
import DemandCard from '../components/DemandCard';
import CategoryFilter from '../components/CategoryFilter';
import {
  getVendeur, getDemandsLocal, getPoints, getRevealsFromPoints, getRevealCost,
  FREE_URL, POINTS_PAR_REVELATION, checkSubscriptionExpiry, getSubscriptionRemainingDays,
  CATEGORIES_PRO, ABONNEMENT_DURATION_DAYS
} from '../utils/storage';

// FREE site categories (needed when viewing FREE demands)
const CATEGORIES_FREE = [
  'Téléphones', 'TV & Écrans', 'Frigo & Congélateur', 'Climatiseur & Ventilateur',
  'Ordinateurs', 'Tablettes', 'Audio & Son', 'Électroménager', 'Plomberie',
  'Électricité', 'Meubles', 'Mode & Vetements', 'Cosmétiques', 'Alimentation',
  'Services', 'Transport', 'Immobilier', 'Autre',
];

export default function VendeurDashboard({ onLogout }) {
  // Check subscription expiry on load
  checkSubscriptionExpiry();

  const vendeur = getVendeur();
  const isKing = vendeur?.role === 'king';
  const isDiambar = vendeur?.role === 'diambar';
  const isFree = vendeur?.role === 'free';
  const isPremium = isKing || isDiambar;

  const [activeTab, setActiveTab] = useState(isKing ? 'king-free' : 'pro');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [demands, setDemands] = useState(getDemandsLocal());
  const [freeDemands, setFreeDemands] = useState([]);
  const [freeLoading, setFreeLoading] = useState(false);
  const [proLoading, setProLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [contactRefresh, setContactRefresh] = useState(0);
  const [expiredNotice, setExpiredNotice] = useState(false);

  const phone = vendeur?.numero || '';
  const role = vendeur?.role || 'free';
  const points = getPoints(phone);
  const revealCost = getRevealCost(role);
  const revealsFromPoints = getRevealsFromPoints(phone, role);
  const normalCost = POINTS_PAR_REVELATION;
  const saving = normalCost - revealCost;
  const remainingDays = getSubscriptionRemainingDays();

  // Handle tab switch — reset category when switching
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setSelectedCategory('Toutes');
  };

  // Fetch FREE demands for KING
  useEffect(() => {
    if (isKing && activeTab === 'king-free') {
      setFreeLoading(true);
      fetch(`${FREE_URL}/api/get-demandes`)
        .then(r => r.json())
        .then(data => { setFreeDemands(data.demands || []); setFreeLoading(false); })
        .catch(() => { setFreeDemands([]); setFreeLoading(false); });
    }
  }, [isKing, activeTab]);

  // Fetch PRO demands from API on load
  useEffect(() => {
    if (activeTab === 'pro') {
      setProLoading(true);
      fetch('/api/get-demandes')
        .then(r => r.json())
        .then(data => {
          const apiDemands = data.demands || [];
          if (apiDemands.length > 0) setDemands(apiDemands);
          setProLoading(false);
        })
        .catch(() => { setProLoading(false); });
    }
  }, [activeTab]);

  const source = activeTab === 'king-free' ? freeDemands : demands;
  const filtered = source.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !q || d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q) || (d.quartier && d.quartier.toLowerCase().includes(q));
    const matchCat = selectedCategory === 'Toutes' || d.category === selectedCategory;
    return matchSearch && matchCat && d.status !== 'rejected';
  });

  // Determine which categories to show based on active tab
  const activeCategories = activeTab === 'king-free' ? CATEGORIES_FREE : CATEGORIES_PRO;

  const handleContacted = () => setContactRefresh(prev => prev + 1);

  if (!vendeur) return null;

  return (
    <div className={isKing ? 'bg-pro-king-dark' : 'bg-pro-primary'}>
      {/* Expired subscription notice */}
      {isFree && (
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-b border-orange-500/30 py-3 px-4 text-center">
          <p className="text-sm font-bold text-orange-300">
            ⚠️ Abonnement expiré — 1 numéro = {POINTS_PAR_REVELATION.toLocaleString('fr-FR')} pts (tarif standard)
          </p>
          <a href="#/recharge" className="text-xs font-bold text-white underline ml-2">Renouveler →</a>
        </div>
      )}

      {/* Profile */}
      <section className={`py-8 px-4 ${isKing ? 'bg-pro-king-gold/10 border-b border-pro-king-gold/20' : isDiambar ? 'bg-blue-500/10 border-b border-blue-500/20' : 'bg-pro-secondary border-b border-pro-accent/30'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${
                isKing ? 'bg-pro-king-gold text-pro-king-dark' : isDiambar ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white' : 'bg-pro-accent text-pro-text'
              }`}>{vendeur.nom?.charAt(0)?.toUpperCase() || 'V'}</div>
              <div>
                <h2 className={`font-bold text-xl ${isKing ? 'text-pro-king-gold' : isDiambar ? 'text-blue-400' : 'text-white'}`}>
                  {vendeur.nom}
                  {isKing && <span className="ml-2">👑</span>}
                  {isDiambar && <span className="ml-2">⚡</span>}
                </h2>
                <p className={`text-sm ${isKing ? 'text-gray-400' : 'text-gray-300'}`}>{vendeur.numero}</p>
                {isPremium && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-lg ${
                      isKing ? 'bg-pro-king-gold/20 text-pro-king-gold border border-pro-king-gold/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {isKing ? '👑 KING VIP' : '⚡ Diambar'}
                    </span>
                    {remainingDays > 0 && (
                      <span className={`text-[10px] font-medium ${
                        remainingDays <= 5 ? 'text-red-400' : isKing ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {remainingDays}j restants
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <button onClick={() => { localStorage.removeItem('wakhma_pro_vendeur'); onLogout?.(); }}
              className={`text-sm px-5 py-2.5 rounded-xl transition ${isKing ? 'text-gray-400 border border-gray-700 hover:bg-gray-800' : 'text-gray-300 border border-pro-accent/40 hover:bg-pro-accent/30'}`}>Déconnexion</button>
          </div>

          {/* Points Card */}
          <div className={`rounded-2xl p-6 mb-5 ${isKing ? 'bg-pro-king-gold/10 border border-pro-king-gold/20' : isDiambar ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-pro-secondary border border-pro-accent/30'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${isKing ? 'bg-pro-king-gold/20' : isDiambar ? 'bg-blue-500/20' : 'bg-pro-highlight/20'}`}>💎</div>
                <div>
                  <p className={`text-xs font-medium ${isKing ? 'text-gray-400' : 'text-gray-300'}`}>Solde de points</p>
                  <p className={`text-2xl font-black ${isKing ? 'text-pro-king-gold' : isDiambar ? 'text-blue-400' : 'text-pro-highlight'}`}>
                    {points.toLocaleString('fr-FR')} <span className="text-sm font-medium">pts</span>
                  </p>
                </div>
              </div>
              <a href="#/recharge" className={`px-5 py-2.5 rounded-xl text-sm font-bold ${
                isKing ? 'bg-pro-king-gold text-pro-king-dark' : isDiambar ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 'bg-gradient-to-r from-pro-highlight to-emerald-600 text-white'
              }`}>+ Recharger</a>
            </div>
            <div className="flex gap-4">
              <div className={`flex-1 rounded-xl p-3 text-center ${isKing ? 'bg-gray-800/50' : isDiambar ? 'bg-pro-primary/80' : 'bg-pro-primary/80'}`}>
                <p className="text-lg font-bold text-white">{revealsFromPoints}</p>
                <p className="text-xs text-gray-400">Révélations</p>
              </div>
              {isPremium && (
                <div className={`flex-1 rounded-xl p-3 text-center ${isKing ? 'bg-pro-king-gold/10' : 'bg-blue-500/10'}`}>
                  <p className={`text-lg font-bold ${isKing ? 'text-pro-king-gold' : 'text-blue-400'}`}>-{saving}</p>
                  <p className="text-xs text-gray-400">Économie/numéro</p>
                </div>
              )}
            </div>
            <p className={`text-xs mt-3 ${isKing ? 'text-gray-500' : 'text-gray-400'}`}>
              1 numéro WhatsApp = {revealCost.toLocaleString('fr-FR')} pts
              {isKing ? ' (tarif KING 👑)' : isDiambar ? ' (tarif Diambar ⚡)' : ' (tarif standard)'}
              {' — '}Wakhma ne rembourse PAS les points.
            </p>

            {/* CTA Upgrade for free users */}
            {isFree && (
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-pro-king-gold/10 border border-pro-highlight/20">
                <p className="text-sm font-bold text-white mb-1">🚀 Économise sur chaque révélation</p>
                <p className="text-xs text-gray-400 mb-3">Passe Diambar (1 200 pts) ou KING VIP (1 000 pts) pour payer moins cher par numéro.</p>
                <a href="#/recharge" className="inline-block bg-gradient-to-r from-pro-highlight to-emerald-600 text-white font-bold px-5 py-2 rounded-xl text-sm hover:shadow-lg transition">
                  Voir les abonnements →
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* KING tabs */}
      {isKing && (
        <div className="bg-pro-king-dark border-b border-gray-800 px-6 py-4">
          <div className="max-w-6xl mx-auto flex gap-3">
            <button onClick={() => handleTabSwitch('pro')}
              className={`flex-1 py-3 px-6 text-sm font-bold rounded-xl transition ${activeTab === 'pro' ? 'bg-pro-king-gold/15 text-pro-king-gold border border-pro-king-gold/30' : 'text-gray-500 border border-transparent'}`}>
              📋 Demandes PRO
            </button>
            <button onClick={() => handleTabSwitch('king-free')}
              className={`flex-1 py-3 px-6 text-sm font-bold rounded-xl transition ${activeTab === 'king-free' ? 'bg-pro-king-gold/15 text-pro-king-gold border border-pro-king-gold/30' : 'text-gray-500 border border-transparent'}`}>
              👑 Demandes FREE
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-white">
              {activeTab === 'king-free' ? '👑 Demandes Wakhma FREE' : '📋 Demandes PRO'}
            </h2>
            <p className={`mt-2 text-sm ${isKing ? 'text-gray-400' : 'text-gray-300'}`}>
              {activeTab === 'king-free'
                ? 'Annonces postées par les acheteurs sur Wakhma FREE. Révèle leurs numéros WhatsApp !'
                : 'Achète des points pour révéler les numéros WhatsApp des clients.'
              }
            </p>
          </div>

          <div className="relative mb-8">
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className={`w-full pl-14 pr-5 py-4 rounded-xl border-2 focus:outline-none text-base ${
                isKing ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-pro-king-gold'
                  : isDiambar ? 'bg-pro-secondary border-blue-500/30 text-white placeholder:text-gray-400 focus:border-blue-400'
                  : 'bg-pro-secondary border-pro-accent/40 text-white placeholder:text-gray-400 focus:border-pro-highlight'
              }`} />
          </div>

          <div className="mb-8">
            <CategoryFilter
              selected={selectedCategory}
              onChange={setSelectedCategory}
              isKing={isKing}
              isDiambar={isDiambar}
              categories={activeCategories}
            />
          </div>

          {freeLoading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pro-king-gold border-t-transparent mb-5" />
              <p className="text-gray-400">Chargement des demandes FREE...</p>
            </div>
          )}

          {!freeLoading && filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(d => (
                <DemandCard key={d.id} demand={d} isKing={isKing} isDiambar={isDiambar} isFree={isFree}
                  vendeurPhone={phone} vendeurRole={role} onContacted={handleContacted}
                  source={activeTab} />
              ))}
            </div>
          ) : !freeLoading && (
            <div className="text-center py-20">
              <div className="text-6xl mb-5">📋</div>
              <h3 className="text-xl font-bold text-white">Aucune demande</h3>
              <p className="text-gray-300">
                {activeTab === 'king-free'
                  ? 'Les demandes FREE apparaîtront ici. Vérifie que le site FREE est bien en ligne.'
                  : 'Les demandes apparaîtront ici quand des clients posteront.'
                }
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
