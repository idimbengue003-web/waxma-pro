import { useState, useEffect } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import DemandForm from './components/DemandForm';
import VendeurLogin from './pages/VendeurLogin';
import VendeurDashboard from './pages/VendeurDashboard';
import RechargePage from './pages/RechargePage';
import AdminPage from './components/AdminPage';
import { getVendeur } from './utils/storage';

function getRoute() {
  const hash = window.location.hash || '#/';
  return hash.replace('#/', '').replace('#', '') || 'home';
}

export default function App() {
  const [route, setRoute] = useState(getRoute());
  const [vendeur, setVendeur] = useState(getVendeur());
  const [newDemand, setNewDemand] = useState(null);

  useEffect(() => {
    const onHash = () => setRoute(getRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const handleLogin = (v) => { setVendeur(v); window.location.hash = '#/dashboard'; };
  const handleLogout = () => { setVendeur(null); window.location.hash = '#/'; };

  const renderPage = () => {
    switch (route) {
      case 'demandes': return <DemandForm onPosted={setNewDemand} />;
      case 'vendeur':
        if (vendeur) return <VendeurDashboard onLogout={handleLogout} />;
        return <VendeurLogin onLogin={handleLogin} />;
      case 'dashboard':
        if (vendeur) return <VendeurDashboard onLogout={handleLogout} />;
        return <VendeurLogin onLogin={handleLogin} />;
      case 'recharge': return <RechargePage />;
      case 'admin': return <AdminPage />;
      default: return <Home onPosted={setNewDemand} />;
    }
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col bg-pro-primary">
        <Helmet>
          <title>Wakhma PRO — Le marché rapide de Dakar</title>
          <meta name="description" content="Wakhma PRO : révèle les numéros WhatsApp des clients à Dakar." />
        </Helmet>
        <Header />
        <main className="flex-1">{renderPage()}</main>
        <Footer />
      </div>
    </HelmetProvider>
  );
}
