import { useState } from 'react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [demands, setDemands] = useState([]);
  const [vendeurs, setVendeurs] = useState([]);
  const [tab, setTab] = useState('demands');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (password !== 'waxma2024') return;
    setAuthenticated(true);
    loadData();
  };

  const loadData = async () => {
    try {
      const res = await fetch('/api/get-demandes');
      const data = await res.json();
      if (data.demands) setDemands(data.demands);
    } catch {}
    setVendeurs(JSON.parse(localStorage.getItem('waxma_pro_vendeurs') || '[]'));
  };

  if (!authenticated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe admin" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pro-highlight focus:outline-none text-sm" />
            <button type="submit" className="w-full bg-pro-primary text-white font-bold py-3 rounded-xl">Connexion</button>
          </form>
          <p className="text-center text-gray-400 text-xs mt-3">Défaut: waxma2024</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-gray-800">🔧 Admin WAXMA PRO</h1>
          <button onClick={loadData} className="text-sm text-pro-highlight font-semibold hover:underline">Rafraîchir</button>
        </div>
        <div className="flex gap-2 mb-4 overflow-x-auto">
          <button onClick={() => setTab('demands')} className={`px-4 py-2 rounded-full text-sm font-bold ${tab === 'demands' ? 'bg-pro-blue text-white' : 'bg-white text-gray-800 border-2 border-gray-200'}`}>Demandes</button>
          <button onClick={() => setTab('vendeurs')} className={`px-4 py-2 rounded-full text-sm font-bold ${tab === 'vendeurs' ? 'bg-pro-green text-white' : 'bg-white text-gray-800 border-2 border-gray-200'}`}>Vendeurs</button>
        </div>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {tab === 'demands' ? (
            <>
              <div className="p-4 border-b"><h2 className="font-bold text-gray-800">Demandes ({demands.length})</h2></div>
              {demands.length === 0 ? <div className="p-8 text-center text-gray-400">Aucune demande</div> : (
                <div className="divide-y">{demands.map(d => (
                  <div key={d.id} className="p-4 flex items-start gap-3 hover:bg-gray-50">
                    <div className="flex-1"><p className="font-semibold text-sm text-gray-800">{d.title}</p><p className="text-xs text-gray-500">{d.quartier} · {d.category} · {d.whatsapp}</p></div>
                  </div>
                ))}</div>
              )}
            </>
          ) : (
            <>
              <div className="p-4 border-b"><h2 className="font-bold text-gray-800">Vendeurs ({vendeurs.length})</h2></div>
              {vendeurs.length === 0 ? <div className="p-8 text-center text-gray-400">Aucun vendeur</div> : (
                <div className="divide-y">{vendeurs.map(v => (
                  <div key={v.numero} className="p-4 flex items-center gap-3 hover:bg-gray-50">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-pro-blue/10 text-pro-blue">{v.nom?.charAt(0)?.toUpperCase()}</div>
                    <div className="flex-1"><p className="font-semibold text-sm text-gray-800">{v.nom}</p><p className="text-xs text-gray-500">{v.numero} · {v.points} pts · {v.role}</p></div>
                  </div>
                ))}</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
