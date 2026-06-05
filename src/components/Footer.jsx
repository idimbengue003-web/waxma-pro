export default function Footer() {
  return (
    <footer className="bg-pro-primary border-t border-pro-accent/20 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-pro-highlight to-emerald-600 text-white font-extrabold text-lg px-4 py-1.5 rounded-lg">WAXMA</div>
          <span className="text-gray-400 text-sm">Le marché rapide de Dakar</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="https://waxma.lu" target="_blank" rel="noopener noreferrer" className="text-pro-highlight text-sm font-bold hover:underline">WAXMA Free →</a>
          <span className="text-gray-500 text-xs">© 2024 WAXMA</span>
        </div>
      </div>
    </footer>
  );
}
