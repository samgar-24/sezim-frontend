export default function OrderTracker({ status }) {
  const steps = [
    { id: 'pending', label: 'Оплата' },
    { id: 'paid', label: 'Оплачен' },
    { id: 'processing', label: 'Сборка' },
    { id: 'shipped', label: 'В пути' },
    { id: 'delivered', label: 'Доставлен' }
  ];

  const currentIndex = steps.findIndex(s => s.id === status);

  return (
    <div className="w-full py-6">
      <div className="flex justify-between relative">
        {/* Линия на фоне */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 -translate-y-1/2"></div>
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-black -translate-y-1/2 transition-all duration-500"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, index) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center">
            <div className={`w-4 h-4 rounded-full border-4 ${
              index <= currentIndex ? 'bg-black border-black' : 'bg-white border-zinc-200'
            }`}></div>
            <span className={`text-[10px] mt-2 font-bold uppercase tracking-tighter ${
              index <= currentIndex ? 'text-black' : 'text-zinc-400'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}