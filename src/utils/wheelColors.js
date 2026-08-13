// Bảng màu pastel dễ thương, sẽ được lặp lại (cycle) nếu số món nhiều hơn số màu
export const WHEEL_COLORS = [
  '#FFB3C6', // hồng
  '#C9B8FF', // tím lavender
  '#B8FFDB', // xanh mint
  '#FFF3B0', // vàng nhạt
  '#FFCBA4', // cam peach
  '#B8E0FF', // xanh dương nhạt
  '#E3B8FF', // tím nhạt
  '#C6F7C1', // xanh lá nhạt
]

export function getSliceColor(index) {
  return WHEEL_COLORS[index % WHEEL_COLORS.length]
}
