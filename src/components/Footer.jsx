export default function Footer() {
  return (
    <footer className="bg-pro-primary border-t-4 border-blue-500 py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white font-extrabold text-lg px-4 py-1.5 rounded-lg">Wakhma</div>
          <div className="flex flex-col">
            <span className="text-blue-400 font-black text-xs uppercase tracking-widest">PRO</span>
            <span className="text-gray-400 text-xs">Pour les vendeurs</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <a href="https://wakhma-store.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-lg hover:bg-orange-500/20 transition">
            🛒 Wakhma FREE → <span className="text-xs font-normal text-gray-400">Pour les acheteurs</span>
          </a>
          <span className="text-gray-500 text-xs">© 2024 Wakhma</span>
        </div>
      </div>
    </footer>
  );
}
