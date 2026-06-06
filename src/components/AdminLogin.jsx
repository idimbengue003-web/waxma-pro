import { useState } from 'react';
import { loginSiteAdmin, getAuthUser } from '../utils/storage';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 500));

    const success = loginSiteAdmin(password);
    if (success) {
      window.location.hash = '#/admin';
    } else {
      setError('Mot de passe incorrect');
    }
    setLoading(false);
  };

  const authUser = getAuthUser();

  if (authUser && authUser.role === 'admin') {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-black text-white mb-3">Connecté en tant qu'admin</h1>
          <a href="#/admin" className="inline-block bg-gradient-to-r from-pro-highlight to-emerald-600 text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg transition">
            Accéder au Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔐</div>
          <h1 className="text-2xl font-black text-white">Connexion Admin</h1>
          <p className="text-gray-400 text-sm mt-2">Réservé à l'administrateur</p>
        </div>
        <div className="bg-pro-secondary rounded-2xl shadow-xl p-6 space-y-4 border border-pro-accent/30">
          {error && (
            <div className="bg-red-900/50 border border-red-500/50 text-red-300 p-4 rounded-xl text-sm text-center font-semibold">
              {error}
            </div>
          )}
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe admin" autoFocus
            className="w-full px-5 py-4 rounded-xl border-2 bg-pro-primary border-pro-accent/40 text-white placeholder:text-gray-500 focus:border-pro-highlight focus:outline-none text-sm" />
          <button type="button" onClick={handleSubmit} disabled={loading || !password}
            className="w-full bg-gradient-to-r from-pro-highlight to-emerald-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition disabled:opacity-50">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
        <p className="text-center text-xs text-gray-500 mt-4">
          Accès réservé à l'administrateur du site
        </p>
      </div>
    </div>
  );
}
