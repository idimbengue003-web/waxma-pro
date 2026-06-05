import { CATEGORIES_PRO } from '../utils/storage';

export default function CategoryFilter({ selected, onChange }) {
  const cats = ['Toutes', ...CATEGORIES_PRO];
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {cats.map(cat => (
        <button key={cat} onClick={() => onChange(cat)}
          className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition ${
            selected === cat
              ? 'bg-pro-highlight text-white shadow-lg shadow-pro-highlight/20'
              : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-pro-highlight/30'
          }`}>
          {cat}
        </button>
      ))}
    </div>
  );
}
