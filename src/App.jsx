import { useEffect, useRef, useState } from 'react'
import Wheel from './components/Wheel'
import FoodList from './components/FoodList'
import ResultModal from './components/ResultModal'
import { supabase } from './lib/supabase'

const SPIN_DURATION_MS = 4200 // phải khớp với thời gian transition trong Wheel.jsx
const EXTRA_SPINS = 6 // số vòng quay thêm để tạo cảm giác quay thật
const LOCAL_STORAGE_KEY = 'vong-quay-mon-an:foods'

function loadLocalFoods() {
  try {
    const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveLocalFoods(foods) {
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(foods))
  } catch {
    // Bỏ qua nếu trình duyệt không cho phép dùng localStorage
  }
}

export default function App() {
  const [foods, setFoods] = useState([]) // [{ id, name }]
  const [loading, setLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(false) // true = đang đồng bộ realtime qua Supabase
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const timeoutRef = useRef(null)

  // Tải danh sách món ăn: ưu tiên Supabase để đồng bộ chung, nếu lỗi/không cấu hình
  // thì rơi về localStorage để app vẫn dùng được (chỉ trên máy này).
  useEffect(() => {
    // Cờ chống race-condition khi React StrictMode chạy effect 2 lần lúc dev:
    // nếu effect này đã bị cleanup (unmount) trước khi fetch xong thì bỏ qua,
    // tránh tạo 2 channel realtime trùng tên gây lỗi "subscribe() called twice".
    let isActive = true
    let channel

    async function init() {
      if (!supabase) {
        setFoods(loadLocalFoods())
        setIsOnline(false)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('foods')
        .select('id, name')
        .order('created_at', { ascending: true })

      if (!isActive) return

      if (error) {
        console.error('Không kết nối được Supabase, chuyển sang chế độ offline:', error.message)
        setFoods(loadLocalFoods())
        setIsOnline(false)
        setLoading(false)
        return
      }

      setFoods(data)
      setIsOnline(true)
      setLoading(false)

      // Lắng nghe thay đổi realtime để tự động cập nhật khi người khác thêm/xóa món
      channel = supabase
        .channel('foods-realtime')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'foods' }, (payload) => {
          setFoods((prev) => (prev.some((f) => f.id === payload.new.id) ? prev : [...prev, payload.new]))
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'foods' }, (payload) => {
          setFoods((prev) => prev.filter((f) => f.id !== payload.old.id))
        })
        .subscribe()
    }

    init()

    return () => {
      isActive = false
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  const canSpin = foods.length >= 2 && !spinning

  const addFood = async (name) => {
    if (isOnline) {
      const { data, error } = await supabase.from('foods').insert({ name }).select().single()
      if (error) {
        console.error('Lỗi khi thêm món:', error.message)
        return
      }
      // Cập nhật ngay cho người vừa thêm, không cần chờ event realtime dội lại
      setFoods((prev) => (prev.some((f) => f.id === data.id) ? prev : [...prev, data]))
    } else {
      const newFood = { id: crypto.randomUUID(), name }
      setFoods((prev) => {
        const next = [...prev, newFood]
        saveLocalFoods(next)
        return next
      })
    }
  }

  const removeFood = async (id) => {
    if (isOnline) {
      setFoods((prev) => prev.filter((f) => f.id !== id))
      const { error } = await supabase.from('foods').delete().eq('id', id)
      if (error) console.error('Lỗi khi xóa món:', error.message)
    } else {
      setFoods((prev) => {
        const next = prev.filter((f) => f.id !== id)
        saveLocalFoods(next)
        return next
      })
    }
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
      setResult(foods[winnerIndex].name)
    }, SPIN_DURATION_MS)
  }

  const closeModal = () => setResult(null)

  // Vòng quay giữ chỗ khi chưa đủ món để quay
  const displayItems = foods.length > 0 ? foods.map((f) => f.name) : ['???', '???', '???', '???']

  return (
    <div className="pastel-bg min-h-screen w-full px-4 py-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8">
        <header className="text-center">
          <h1 className="font-display text-3xl font-extrabold text-[#6B4E71] sm:text-4xl">
            Húi Ơi Ăn Gì? 🎡
          </h1>
          <p className="mt-2 text-sm text-[#8B6F94] sm:text-base">
            Phân vân không biết ăn gì? Để vòng quay may mắn quyết định giúp bạn nhé! 🍜🍕🍣
          </p>
          {!loading && (
            <p className="mt-1 text-xs text-[#B399BD]">
              {isOnline ? '🔄 Đã đồng bộ chung với mọi người' : '📴 Chế độ ngoại tuyến (chỉ lưu trên máy này)'}
            </p>
          )}
        </header>

        <div className="flex w-full flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center">
          <div className="flex flex-col items-center gap-6">
            <Wheel items={displayItems} rotation={rotation} spinning={spinning} />

            <button
              onClick={handleSpin}
              disabled={!canSpin}
              className="font-display rounded-full bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 px-12 py-4 text-xl font-extrabold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              {spinning ? 'Đang quay... 🎡' : 'QUAY CHO HÚI 🎰'}
            </button>

            {!loading && foods.length < 2 && (
              <p className="text-center text-sm text-orange-400">
                Thêm ít nhất 2 món ăn ở bên dưới để bắt đầu quay nhé! 👇
              </p>
            )}
          </div>

          <FoodList items={foods} onAdd={addFood} onRemove={removeFood} disabled={spinning} loading={loading} />
        </div>

        <footer className="pt-4 text-center text-xs text-[#8B6F94]">
          Made with 💕 cho những bữa ăn không còn phải phân vân
        </footer>
      </div>

      <ResultModal result={result} onClose={closeModal} />
    </div>
  )
}
