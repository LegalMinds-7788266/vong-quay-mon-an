const CONFETTI_EMOJIS = ['🎉', '🎊', '✨', '🥳', '💖', '⭐']
const PIECE_COUNT = 28

// Sinh sẵn thuộc tính ngẫu nhiên cho từng mảnh confetti (chỉ tính 1 lần khi module load)
const pieces = Array.from({ length: PIECE_COUNT }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 0.6,
  duration: 1.6 + Math.random() * 1.2,
  size: 14 + Math.random() * 14,
  emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
}))

export default function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 animate-confetti-fall"
          style={{
            left: `${p.left}%`,
            fontSize: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  )
}
