import { TARIFS_RECHARGE, CATEGORIES_PRO, POINTS_PAR_REVELATION, POINTS_REVELATION_KING, KYC_INSCRIPTION_PRIX, POINTS_KYC } from '../utils/storage';

export default function Home({ onPosted }) {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-pro-primary via-pro-secondary to-pro-accent py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-pro-highlight/10 text-pro-highlight text-xs font-bold px-4 py-1.5 rounded-lg border border-pro-highlight/20 mb-6 uppercase tracking-wider">
            Vendeurs PRO
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Les clients te cherchent.<br />
            <span className="gradient-text">Révèle leurs numéros.</span>
          </h1>
          <p className="text-pro-muted text-lg max-w-2xl mx-auto mb-10">
            WAXMA PRO, le marché rapide de Dakar. Les acheteurs postent leurs besoins, tu révèles leurs WhatsApp et tu vends.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#/vendeur" className="bg-gradient-to-r from-pro-highlight to-emerald-600 text-white font-bold px-10 py-4 rounded-xl hover:shadow-xl hover:shadow-pro-highlight/20 transition-all text-lg animate-pulse-glow">
              Espace Vendeur
            </a>
            <a href="#/demandes" className="bg-white/10 text-white font-bold px-10 py-4 rounded-xl hover:bg-white/20 transition-all border border-white/20 text-lg">
              Poster une demande
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-12">Comment ça marche ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { emoji: '📝', title: '1. Inscris-toi', desc: `${KYC_INSCRIPTION_PRIX}F caution = ${POINTS_KYC.toLocaleString('fr-FR')} Points. Vérification WhatsApp obligatoire.` },
              { emoji: '👀', title: '2. Consulte les demandes', desc: `Les acheteurs postent ce qu'ils cherchent. Filtre par catégorie : ${CATEGORIES_PRO.join(', ')}.` },
              { emoji: '🔓', title: '3. Révèle & contacte', desc: `${POINTS_PAR_REVELATION.toLocaleString('fr-FR')} pts/révélation (KING : ${POINTS_REVELATION_KING.toLocaleString('fr-FR')} pts 👑). Contacte directement sur WhatsApp.` },
            ].map(step => (
              <div key={step.title} className="bg-white rounded-2xl p-8 text-center shadow-lg card-hover">
                <div className="text-5xl mb-4">{step.emoji}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-4">Tarifs Recharge</h2>
          <p className="text-gray-500 text-center mb-10">1 numéro WhatsApp = {POINTS_PAR_REVELATION.toLocaleString('fr-FR')} pts (KING : {POINTS_REVELATION_KING.toLocaleString('fr-FR')} pts)</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {TARIFS_RECHARGE.map((t, i) => (
              <div key={t.prix} className={`rounded-2xl p-5 text-center border-2 ${i === 2 ? 'border-pro-highlight bg-pro-highlight/5' : i === 4 ? 'border-pro-king-gold bg-pro-king-gold/5' : 'border-gray-200'}`}>
                <p className="text-xs font-bold text-gray-500 mb-1">{t.label}</p>
                <p className="text-xl font-black text-gray-800">{t.prix.toLocaleString('fr-FR')}f</p>
                <p className="text-sm font-bold text-pro-highlight mt-1">{t.points.toLocaleString('fr-FR')} pts</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warning */}
      <section className="py-10 px-4 bg-red-50">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg font-bold text-red-700 mb-2">⚠️ WAXMA ne rembourse PAS les Points</p>
          <p className="text-sm text-red-600">Vérifiez budget + quartier avant de révéler un numéro. Si le client n'est pas sérieux, c'est votre choix.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-pro-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">Prêt à vendre ?</h2>
          <p className="text-pro-muted mb-8">Inscris-toi pour {KYC_INSCRIPTION_PRIX}F et commence à contacter les clients.</p>
          <a href="#/vendeur" className="inline-block bg-gradient-to-r from-pro-highlight to-emerald-600 text-white font-bold px-10 py-4 rounded-xl hover:shadow-xl transition-all text-lg">
            Commencer maintenant
          </a>
        </div>
      </section>
    </div>
  );
}
