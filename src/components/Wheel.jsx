import { getSliceColor } from '../utils/wheelColors'

const SIZE = 320 // kích thước viewBox của SVG
const CENTER = SIZE / 2
const RADIUS = SIZE / 2 - 8

// Chuyển đổi từ (góc tính theo chiều kim đồng hồ, 0 độ = hướng 12 giờ) sang tọa độ x,y
function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: cx + r * Math.sin(rad),
    y: cy - r * Math.cos(rad),
  }
}

// Vẽ path hình quạt (1 miếng bánh) từ góc bắt đầu tới góc kết thúc
function describeSlice(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, startAngle)
  const end = polarToCartesian(cx, cy, r, endAngle)
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`
}

export default function Wheel({ items, rotation, spinning }) {
  const sliceAngle = items.length > 0 ? 360 / items.length : 0

  return (
    <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }}>
      {/* Mũi tên chỉ kết quả, cố định ở đỉnh vòng quay */}
      <div className="absolute left-1/2 -top-3 z-20 -translate-x-1/2">
        <div
          className="h-8 w-8 rotate-180 drop-shadow-md"
          style={{
            clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
            background: 'linear-gradient(180deg, #FF6FA0, #FF3D77)',
          }}
        />
      </div>

      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        className="drop-shadow-xl"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning
            ? 'transform 4.2s cubic-bezier(0.17, 0.67, 0.1, 0.99)'
            : 'none',
        }}
      >
        {/* Viền ngoài dễ thương */}
        <circle cx={CENTER} cy={CENTER} r={RADIUS + 6} fill="#fff" stroke="#FFD6E8" strokeWidth="4" />

        {items.map((item, i) => {
          const startAngle = i * sliceAngle
          const endAngle = startAngle + sliceAngle
          const midAngle = startAngle + sliceAngle / 2
          const path = describeSlice(CENTER, CENTER, RADIUS, startAngle, endAngle)

          // Lật chữ thêm 180 độ nếu nằm ở nửa dưới vòng quay để chữ luôn đọc xuôi
          const textFlip = midAngle > 90 && midAngle < 270 ? 180 : 0
          const textY = CENTER - RADIUS * 0.62

          return (
            <g key={i}>
              <path
                d={path}
                fill={getSliceColor(i)}
                stroke="#fff"
                strokeWidth="2"
              />
              {/* Xoay chữ theo góc của lát cắt để hướng ra ngoài tâm vòng quay */}
              <g transform={`rotate(${midAngle} ${CENTER} ${CENTER})`}>
                <text
                  x={CENTER}
                  y={textY}
                  transform={textFlip ? `rotate(180 ${CENTER} ${textY})` : undefined}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-display font-semibold"
                  fill="#4A3B52"
                  fontSize={items.length > 8 ? 10 : 13}
                >
                  {truncate(item, 12)}
                </text>
              </g>
            </g>
          )
        })}

        {/* Tâm vòng quay */}
        <circle cx={CENTER} cy={CENTER} r={22} fill="#fff" stroke="#FFB3C6" strokeWidth="4" />
        <text x={CENTER} y={CENTER + 7} textAnchor="middle" fontSize="20">
          🍽️
        </text>
      </svg>
    </div>
  )
}

function truncate(text, max) {
  return text.length > max ? text.slice(0, max - 1) + '…' : text
}
