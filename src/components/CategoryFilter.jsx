import { CATEGORIES_PRO } from '../utils/storage';

export default function CategoryFilter({ selected, onChange, isKing }) {
  const cats = ['Toutes', ...CATEGORIES_PRO];
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {cats.map(cat => (
        <button key={cat} onClick={() => onChange(cat)}
          className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition ${
            selected === cat
              ? 'bg-pro-highlight text-white shadow-lg shadow-pro-highlight/20'
              : isKing
                ? 'bg-gray-800 text-gray-300 border-2 border-gray-700 hover:border-pro-king-gold/40 hover:text-pro-king-gold'
                : 'bg-pro-secondary text-gray-300 border-2 border-pro-accent/40 hover:border-pro-highlight/40 hover:text-pro-highlight'
          }`}>
          {cat}
        </button>
      ))}
    </div>
  );
}
