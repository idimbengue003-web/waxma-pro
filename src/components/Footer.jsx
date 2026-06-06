export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-extrabold text-lg px-4 py-1.5 rounded-lg">Wakhma</div>
          <span className="text-gray-400 text-sm">Le marché rapide de Dakar</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="https://wakhma-store.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 text-sm font-bold hover:underline">Wakhma Free →</a>
          <span className="text-gray-300 text-xs">© 2024 Wakhma</span>
        </div>
      </div>
    </footer>
  );
}
