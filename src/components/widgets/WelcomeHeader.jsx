export default function WelcomeHeader() {
  return (
    <div className="flex justify-between items-center w-full">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
          BENVENUTO, DAVIDE 👋
        </h2>
        <p className="text-textSecondary text-xs">
          Ecco il riepilogo del tuo portafoglio oggi.
        </p>
      </div>
      <button className="border border-primary text-primary px-4 py-2 rounded text-[10px] uppercase font-mono font-bold tracking-widest hover:bg-primary/10 transition-colors">
        Esporta Report
      </button>
    </div>
  )
}
