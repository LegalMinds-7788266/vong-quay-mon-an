import { useRef, useState } from 'react'
import Wheel from './components/Wheel'
import FoodList from './components/FoodList'
import ResultModal from './components/ResultModal'
import { useLocalStorage } from './hooks/useLocalStorage'

const SPIN_DURATION_MS = 4200 // phải khớp với thời gian transition trong Wheel.jsx
const EXTRA_SPINS = 6 // số vòng quay thêm để tạo cảm giác quay thật

export default function App() {
  const [foods, setFoods] = useLocalStorage('vong-quay-mon-an:foods', [])
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const timeoutRef = useRef(null)

  const canSpin = foods.length >= 2 && !spinning

  const addFood = (name) => {
    setFoods((prev) => [...prev, name])
  }

  const removeFood = (index) => {
    setFoods((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSpin = () => {
    if (!canSpin) return

    const sliceAngle = 360 / foods.length
    const winnerIndex = Math.floor(Math.random() * foods.length)

    // Random 1 điểm nằm trong lát cắt (tránh sát viền để kim luôn chỉ rõ ràng vào món)
    const margin = sliceAngle * 0.15
    const targetOffset = margin + Math.random() * (sliceAngle - margin * 2)

    // Góc (theo chiều kim đồng hồ, 0 độ = đỉnh vòng quay) của điểm cần đưa về vị trí kim chỉ
    const desiredFinalMod = (360 - (winnerIndex * sliceAngle + targetOffset)) % 360
    const currentMod = ((rotation % 360) + 360) % 360

    let delta = desiredFinalMod - currentMod
    if (delta < 0) delta += 360

    const newRotation = rotation + EXTRA_SPINS * 360 + delta

    setSpinning(true)
    setResult(null)
    setRotation(newRotation)

    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setSpinning(false)
      setResult(foods[winnerIndex])
    }, SPIN_DURATION_MS)
  }

  const closeModal = () => setResult(null)

  // Vòng quay giữ chỗ khi chưa đủ món để quay
  const displayItems = foods.length > 0 ? foods : ['???', '???', '???', '???']

  return (
    <div className="pastel-bg min-h-screen w-full px-4 py-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8">
        <header className="text-center">
          <h1 className="font-display text-3xl font-extrabold text-[#6B4E71] sm:text-4xl">
            Hôm Nay Ăn Gì? 🎡
          </h1>
          <p className="mt-2 text-sm text-[#8B6F94] sm:text-base">
            Phân vân không biết ăn gì? Để vòng quay may mắn quyết định giúp bạn nhé! 🍜🍕🍣
          </p>
        </header>

        <div className="flex w-full flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center">
          <div className="flex flex-col items-center gap-6">
            <Wheel items={displayItems} rotation={rotation} spinning={spinning} />

            <button
              onClick={handleSpin}
              disabled={!canSpin}
              className="font-display rounded-full bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 px-12 py-4 text-xl font-extrabold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              {spinning ? 'Đang quay... 🎡' : 'QUAY 🎯'}
            </button>

            {foods.length < 2 && (
              <p className="text-center text-sm text-orange-400">
                Thêm ít nhất 2 món ăn ở bên dưới để bắt đầu quay nhé! 👇
              </p>
            )}
          </div>

          <FoodList items={foods} onAdd={addFood} onRemove={removeFood} disabled={spinning} />
        </div>

        <footer className="pt-4 text-center text-xs text-[#8B6F94]">
          Made with 💕 cho những bữa ăn không còn phải phân vân
        </footer>
      </div>

      <ResultModal result={result} onClose={closeModal} />
    </div>
  )
}
