import Confetti from './Confetti'

export default function ResultModal({ result, onClose }) {
  if (!result) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-sm animate-pop-in overflow-hidden rounded-3xl bg-gradient-to-b from-white to-pastel-pink p-8 text-center shadow-2xl">
        <Confetti />

        <p className="font-display text-sm font-semibold uppercase tracking-wide text-pink-400">
          Hôm nay ăn gì? 🎡
        </p>

        <div className="my-4 animate-wiggle text-6xl">🎉</div>

        <p className="font-display mb-1 text-base text-gray-500">Kết quả là...</p>
        <h3 className="font-display mb-6 break-words text-3xl font-bold text-[#6B4E71]">
          {result}
        </h3>

        <button
          onClick={onClose}
          className="w-full rounded-full bg-gradient-to-r from-pink-400 to-purple-400 px-6 py-3 font-display text-lg font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          Quay lại 🔄
        </button>
      </div>
    </div>
  )
}
