import { useState, useEffect } from 'react';
import DemandCard from '../components/DemandCard';
import CategoryFilter from '../components/CategoryFilter';
import { getVendeur, getDemandsLocal, getPoints, getRevealsFromPoints, getRevealCost, FREE_URL } from '../utils/storage';

export default function VendeurDashboard({ onLogout }) {
  const vendeur = getVendeur();
  const isKing = vendeur?.role === 'king';
  const isDiambar = vendeur?.role === 'diambar';
  const isFree = vendeur?.role === 'free';

  const [activeTab, setActiveTab] = useState('pro');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [demands, setDemands] = useState(getDemandsLocal());
  const [freeDemands, setFreeDemands] = useState([]);
  const [freeLoading, setFreeLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [contactRefresh, setContactRefresh] = useState(0);

  const phone = vendeur?.numero || '';
  const role = vendeur?.role || 'free';
  const points = getPoints(phone);
  const revealCost = getRevealCost(role);
  const revealsFromPoints = getRevealsFromPoints(phone, role);

  useEffect(() => {
    if (isKing && activeTab === 'king-free') {
      setFreeLoading(true);
      fetch(`${FREE_URL}/api/get-demandes`)
        .then(r => r.json())
        .then(data => { setFreeDemands(data.demands || []); setFreeLoading(false); })
        .catch(() => { setFreeLoading(false); });
    }
  }, [isKing, activeTab]);

  const source = activeTab === 'king-free' ? freeDemands : demands;
  const filtered = source.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !q || d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q) || (d.quartier && d.quartier.toLowerCase().includes(q));
    const matchCat = selectedCategory === 'Toutes' || d.category === selectedCategory;
    return matchSearch && matchCat && d.status !== 'rejected';
  });

  const handleContacted = () => setContactRefresh(prev => prev + 1);

  if (!vendeur) return null;

  return (
    <div className={isKing ? 'bg-pro-king-dark' : 'bg-pro-primary'}>
      {/* Profile */}
      <section className={`py-8 px-4 ${isKing ? 'bg-pro-king-gold/10 border-b border-pro-king-gold/20' : 'bg-pro-secondary border-b border-pro-accent/30'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${
                isKing ? 'bg-pro-king-gold text-pro-king-dark' : isDiambar ? 'bg-gradient-to-br from-pro-highlight to-emerald-600 text-white' : 'bg-pro-accent text-pro-text'
              }`}>{vendeur.nom?.charAt(0)?.toUpperCase() || 'V'}</div>
              <div>
                <h2 className={`font-bold text-xl ${isKing ? 'text-pro-king-gold' : 'text-white'}`}>
                  {vendeur.nom}{isKing && <span className="ml-2">👑</span>}{isDiambar && <span className="ml-2">⚡</span>}
                </h2>
                <p className={`text-sm ${isKing ? 'text-gray-400' : 'text-gray-300'}`}>{vendeur.numero}</p>
              </div>
            </div>
            <button onClick={() => { localStorage.removeItem('waxma_pro_vendeur'); onLogout?.(); }}
              className={`text-sm px-5 py-2.5 rounded-xl transition ${isKing ? 'text-gray-400 border border-gray-700 hover:bg-gray-800' : 'text-gray-300 border border-pro-accent/40 hover:bg-pro-accent/30'}`}>Déconnexion</button>
          </div>

          {/* Points Card */}
          <div className={`rounded-2xl p-6 mb-5 ${isKing ? 'bg-pro-king-gold/10 border border-pro-king-gold/20' : 'bg-pro-secondary border border-pro-accent/30'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${isKing ? 'bg-pro-king-gold/20' : 'bg-pro-highlight/20'}`}>💎</div>
                <div>
                  <p className={`text-xs font-medium ${isKing ? 'text-gray-400' : 'text-gray-300'}`}>Solde de points</p>
                  <p className={`text-2xl font-black ${isKing ? 'text-pro-king-gold' : 'text-pro-highlight'}`}>
                    {points.toLocaleString('fr-FR')} <span className="text-sm font-medium">pts</span>
                  </p>
                </div>
              </div>
              <a href="#/recharge" className={`px-5 py-2.5 rounded-xl text-sm font-bold ${
                isKing ? 'bg-pro-king-gold text-pro-king-dark' : 'bg-gradient-to-r from-pro-highlight to-emerald-600 text-white'
              }`}>+ Recharger</a>
            </div>
            <div className="flex gap-4">
              <div className={`flex-1 rounded-xl p-3 text-center ${isKing ? 'bg-gray-800/50' : 'bg-pro-primary/80'}`}>
                <p className={`text-lg font-bold ${isKing ? 'text-white' : 'text-white'}`}>{revealsFromPoints}</p>
                <p className={`text-xs ${isKing ? 'text-gray-400' : 'text-gray-400'}`}>Révélations</p>
              </div>
            </div>
            <p className={`text-xs mt-3 ${isKing ? 'text-gray-500' : 'text-gray-400'}`}>
              1 numéro WhatsApp = {revealCost.toLocaleString('fr-FR')} pts {isKing ? '(tarif KING 👑)' : ''} — WAXMA ne rembourse PAS les points.
            </p>
          </div>
        </div>
      </section>

      {/* KING tabs */}
      {isKing && (
        <div className="bg-pro-king-dark border-b border-gray-800 px-6 py-4">
          <div className="max-w-6xl mx-auto flex gap-3">
            <button onClick={() => setActiveTab('pro')}
              className={`flex-1 py-3 px-6 text-sm font-bold rounded-xl transition ${activeTab === 'pro' ? 'bg-pro-king-gold/15 text-pro-king-gold border border-pro-king-gold/30' : 'text-gray-500 border border-transparent'}`}>
              📋 Demandes PRO
            </button>
            <button onClick={() => setActiveTab('king-free')}
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
            <h2 className={`text-2xl font-extrabold ${isKing ? 'text-white' : 'text-white'}`}>
              {activeTab === 'king-free' ? '👑 Demandes WAXMA FREE' : '📋 Demandes PRO'}
            </h2>
            <p className={`mt-2 text-sm ${isKing ? 'text-gray-400' : 'text-gray-300'}`}>
              Achète des points pour révéler les numéros WhatsApp des clients.
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
                  : 'bg-pro-secondary border-pro-accent/40 text-white placeholder:text-gray-400 focus:border-pro-highlight'
              }`} />
          </div>

          <div className="mb-8">
            <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} isKing={isKing} />
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
                  vendeurPhone={phone} vendeurRole={role} onContacted={handleContacted} />
              ))}
            </div>
          ) : !freeLoading && (
            <div className="text-center py-20">
              <div className="text-6xl mb-5">📋</div>
              <h3 className={`text-xl font-bold mb-3 ${isKing ? 'text-white' : 'text-white'}`}>Aucune demande</h3>
              <p className={isKing ? 'text-gray-400' : 'text-gray-300'}>Les demandes apparaîtront ici quand des clients posteront.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
