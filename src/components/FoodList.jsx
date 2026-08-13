import { useState } from 'react'
import { getSliceColor } from '../utils/wheelColors'

export default function FoodList({ items, onAdd, onRemove, disabled }) {
  const [value, setValue] = useState('')

  const handleAdd = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <div className="w-full max-w-md rounded-3xl bg-white/70 p-5 shadow-lg backdrop-blur-sm">
      <h2 className="font-display mb-3 text-lg font-bold text-[#6B4E71]">
        🍱 Danh sách món ăn
      </h2>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Nhập món ăn, vd: Phở bò 🍜"
          className="flex-1 rounded-full border-2 border-pastel-pink bg-white px-4 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-pink-400 disabled:opacity-50"
        />
        <button
          onClick={handleAdd}
          disabled={disabled || !value.trim()}
          className="rounded-full bg-gradient-to-r from-pink-400 to-purple-400 px-4 py-2 text-sm font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          + Thêm
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-sm text-gray-400">
          Chưa có món nào cả, thêm ít nhất 2 món để bắt đầu quay nhé! 🎯
        </p>
      ) : (
        <ul className="flex max-h-56 flex-col gap-2 overflow-y-auto pr-1">
          {items.map((item, i) => (
            <li
              key={`${item}-${i}`}
              className="flex items-center justify-between rounded-full bg-white px-4 py-2 text-sm shadow-sm"
            >
              <span className="flex items-center gap-2 truncate">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: getSliceColor(i) }}
                />
                <span className="truncate">{item}</span>
              </span>
              <button
                onClick={() => onRemove(i)}
                disabled={disabled}
                aria-label={`Xóa ${item}`}
                className="ml-2 shrink-0 rounded-full px-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {items.length === 1 && (
        <p className="mt-2 text-center text-xs text-orange-400">
          Cần thêm ít nhất 1 món nữa để quay được! 🙏
        </p>
      )}
    </div>
  )
}
