import { useState, useEffect } from 'react'

// Hook lưu state vào localStorage để không mất dữ liệu khi reload trang
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Bỏ qua lỗi nếu localStorage không khả dụng
    }
  }, [key, value])

  return [value, setValue]
}
