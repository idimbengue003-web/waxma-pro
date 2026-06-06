import { CATEGORIES_PRO } from '../utils/storage';

export default function CategoryFilter({ selected, onChange, isKing, isDiambar, categories }) {
  const cats = ['Toutes', ...(categories || CATEGORIES_PRO)];
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {cats.map(cat => (
        <button key={cat} onClick={() => onChange(cat)}
          className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition ${
            selected === cat
              ? isKing ? 'bg-pro-king-gold text-pro-king-dark shadow-lg shadow-pro-king-gold/20'
                : isDiambar ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'bg-pro-highlight text-white shadow-lg shadow-pro-highlight/20'
              : isKing
                ? 'bg-gray-800 text-gray-300 border-2 border-gray-700 hover:border-pro-king-gold/40 hover:text-pro-king-gold'
                : isDiambar
                  ? 'bg-pro-secondary text-gray-300 border-2 border-blue-500/20 hover:border-blue-400/40 hover:text-blue-400'
                  : 'bg-pro-secondary text-gray-300 border-2 border-pro-accent/40 hover:border-pro-highlight/40 hover:text-pro-highlight'
          }`}>
          {cat}
        </button>
      ))}
    </div>
  );
}
