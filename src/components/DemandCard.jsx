import { useState } from 'react';
import {
  getWhatsAppLink, formatFCFA, timeAgo, maskPhone,
  getPoints, canReveal, deductPoints, recordReveal, getRevealCost, getVendeur,
  POINTS_PAR_REVELATION, POINTS_REVELATION_DIAMBAR, POINTS_REVELATION_KING,
} from '../utils/storage';

export default function DemandCard({ demand, isKing, isDiambar, isFree, vendeurPhone, vendeurRole, onContacted }) {
  const [revealed, setRevealed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const phone = vendeurPhone || '';
  const role = vendeurRole || 'free';
  const points = getPoints(phone);
  const revealCost = getRevealCost(role);
  const revealsFromPoints = Math.floor(points / revealCost);
  const canDoReveal = points >= revealCost;

  // Build WhatsApp message with VIP badge
  const vendeur = getVendeur();
  const vendeurName = vendeur?.nom || '';
  const vipBadge = isKing ? '★ KING VIP Wakhma ★' : isDiambar ? '★ Diambar Wakhma ★' : '';
  const waMessage = isKing
    ? `★ KING VIP Wakhma ★\nBonjour ! Je suis ${vendeurName}, vendeur certifié KING VIP sur Wakhma PRO 👑\n\nJ'ai vu ta demande : "${demand.title}"\nJe peux te proposer quelque chose !`
    : isDiambar
    ? `★ Diambar Wakhma ★\nBonjour ! Je suis ${vendeurName}, vendeur Diambar sur Wakhma PRO ⚡\n\nJ'ai vu ta demande : "${demand.title}"\nJe peux te proposer quelque chose !`
    : `Bonjour ! J'ai vu ta demande sur Wakhma PRO : "${demand.title}". Je peux te proposer quelque chose !`;

  const waLink = getWhatsAppLink(demand.whatsapp, waMessage);

  const confirmReveal = () => {
    if (deductPoints(phone, revealCost)) {
      recordReveal(phone, demand.id);
      setRevealed(true);
      setShowConfirm(false);
      onContacted?.();
    }
  };

  const roleLabel = isKing ? ' KING' : isDiambar ? ' Diambar' : '';
  const roleTarif = isKing ? '(tarif KING 👑)' : isDiambar ? '(tarif Diambar ⚡)' : '';
  const btnClass = isKing ? 'bg-gradient-to-r from-pro-king-gold to-yellow-500 text-pro-king-dark'
    : isDiambar ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
    : 'bg-gradient-to-r from-pro-highlight to-emerald-600 text-white';

  return (
    <>
      <article className={`bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in-up card-hover ${
        isKing ? 'ring-2 ring-pro-king-gold shadow-yellow-500/10' : isDiambar ? 'ring-2 ring-blue-400 shadow-blue-500/10' : ''
      }`}>
        {demand.photo && (
          <div className="relative">
            <img src={demand.photo} alt={demand.title} className="w-full h-48 object-cover" />
            <span className={`absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-lg ${
              isKing ? 'bg-pro-king-gold text-pro-king-dark' : isDiambar ? 'bg-blue-500 text-white' : 'bg-pro-highlight'
            }`}>{demand.category}</span>
          </div>
        )}

        <div className="p-5">
          {!demand.photo && (
            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-lg mb-3 ${
              isKing ? 'bg-pro-king-gold/20 text-pro-king-dark' : isDiambar ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' : 'bg-pro-highlight/10 text-pro-highlight border border-pro-highlight/20'
            }`}>{demand.category}</span>
          )}

          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">{demand.title}</h3>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-gray-400 text-xs">{timeAgo(demand.createdAt)}</span>
            {demand.quartier && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-pro-highlight/10 text-pro-highlight">📍 {demand.quartier}</span>
            )}
          </div>

          <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">{demand.description}</p>

          {demand.budget > 0 && (
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <span className="text-base">💰</span>
              <span className="font-bold text-emerald-700">{formatFCFA(demand.budget)}</span>
            </div>
          )}

          {/* Reveal Zone */}
          {revealed ? (
            <div className="space-y-3">
              <div className="p-4 rounded-xl text-center bg-pro-highlight/10 border border-pro-highlight/20">
                <p className="text-xs text-gray-500 mb-1">Révélé avec {revealCost.toLocaleString('fr-FR')} pts {roleTarif}</p>
                <p className="text-lg font-bold text-green-600">{demand.whatsapp}</p>
              </div>
              <a href={waLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg transition text-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Envoyer sur WhatsApp
              </a>
            </div>
          ) : !phone ? (
            <div className="space-y-3">
              <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <p className="text-sm font-bold text-gray-600 mb-1">🔒 Numéro verrouillé</p>
                <p className="text-xs text-gray-500">Connecte-toi pour révéler</p>
              </div>
              <a href="#/vendeur" className="block text-center bg-gradient-to-r from-pro-highlight to-emerald-600 text-white font-bold py-3 rounded-xl text-sm">Se connecter</a>
            </div>
          ) : canDoReveal ? (
            <button onClick={() => setShowConfirm(true)}
              className={`w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl hover:shadow-lg active:scale-[0.98] transition-all text-sm ${btnClass}`}>
              🔓 Voir numéro WhatsApp
              <span className="text-xs opacity-80 ml-1">({revealCost.toLocaleString('fr-FR')} pts{roleLabel})</span>
            </button>
          ) : (
            <div className="space-y-3">
              <div className="text-center p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm font-bold text-red-600 mb-1">🔒 Points insuffisants</p>
                <p className="text-xs text-red-500">Il te faut {revealCost.toLocaleString('fr-FR')} pts</p>
              </div>
              <a href="#/recharge" className={`block text-center font-bold py-3 rounded-xl text-sm ${btnClass}`}>💎 Acheter des points</a>
            </div>
          )}
        </div>
      </article>

      {/* ── CONFIRMATION MODAL ── */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-5">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-2xl flex items-center justify-center text-3xl mb-3">⚠️</div>
              <h3 className="text-lg font-black text-gray-800">Confirmer révélation</h3>
              <p className="text-xl font-black text-red-600 mt-1">-{revealCost.toLocaleString('fr-FR')} Points {roleTarif}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Demande</span>
                <span className="font-bold text-gray-800">{demand.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Budget</span>
                <span className="font-bold text-emerald-700">{formatFCFA(demand.budget)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Quartier</span>
                <span className="font-bold text-gray-800">{demand.quartier || '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Posté il y a</span>
                <span className="font-bold text-gray-800">{timeAgo(demand.createdAt)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Solde actuel</span>
                  <span className="font-bold text-pro-highlight">{points.toLocaleString('fr-FR')} Points</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Révélations restantes</span>
                  <span className="font-bold text-gray-800">{revealsFromPoints}</span>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 mb-5">
              <p className="text-xs font-bold text-red-700 leading-relaxed">
                ⚠️ Wakhma ne rembourse PAS les Points. Vérifiez budget + quartier avant de confirmer. Si client pas sérieux, c'est votre choix.
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)}
                className="flex-1 py-3.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition text-sm">
                Annuler
              </button>
              <button onClick={confirmReveal}
                className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition ${btnClass} hover:shadow-lg`}>
                Confirmer -{revealCost.toLocaleString('fr-FR')}pts
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
