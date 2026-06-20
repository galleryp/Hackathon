import { useEffect, useRef } from 'react'

const CONTESTS = [
  'AMC', 'AIME', 'USAMO', 'USAPhO', 'USABO',
  'MATHCOUNTS', 'AMC 8', 'AMC 10', 'AMC 12',
  'USACO', 'Science Olympiad', 'ARML', 'HMMT',
  'PUMAC', 'BMMT', 'CMIMC', 'IYPT', 'IPhO',
  'IMO', 'IOI', 'IBO',
]

const COLORS = [
  '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1',
  '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E9', '#F1948A',
]

interface Piece {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  color: string
  label: string
  width: number
  height: number
  opacity: number
  wobble: number
  wobbleSpeed: number
  wobbleOffset: number
}

export default function TrophyConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const piecesRef = useRef<Piece[]>([])
  const rafRef = useRef<number>(0)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const spawn = (): Piece => {
      const label = CONTESTS[Math.floor(Math.random() * CONTESTS.length)]
      const side = Math.random()
      let x: number, y: number, vx: number, vy: number
      // spawn from edges or top
      if (side < 0.4) {
        x = Math.random() * canvas.width
        y = -20
        vx = (Math.random() - 0.5) * 1.5
        vy = Math.random() * 1.5 + 0.8
      } else if (side < 0.7) {
        x = -10
        y = Math.random() * canvas.height * 0.7
        vx = Math.random() * 1.5 + 0.5
        vy = Math.random() * 1.5 + 0.3
      } else {
        x = canvas.width + 10
        y = Math.random() * canvas.height * 0.7
        vx = -(Math.random() * 1.5 + 0.5)
        vy = Math.random() * 1.5 + 0.3
      }
      return {
        x, y, vx, vy,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        label,
        width: ctx.measureText(label).width + 16,
        height: 22,
        opacity: 0.9,
        wobble: 0,
        wobbleSpeed: Math.random() * 0.05 + 0.02,
        wobbleOffset: Math.random() * Math.PI * 2,
      }
    }

    // seed initial pieces
    for (let i = 0; i < 28; i++) {
      const p = spawn()
      p.x = Math.random() * (canvas.width || 400)
      p.y = Math.random() * (canvas.height || 400)
      piecesRef.current.push(p)
    }

    ctx.font = 'bold 11px Kanit, sans-serif'
    piecesRef.current.forEach(p => {
      p.width = ctx.measureText(p.label).width + 16
    })

    const animate = () => {
      frameRef.current++
      if (!canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.font = 'bold 11px Kanit, sans-serif'

      // spawn new piece every ~40 frames
      if (frameRef.current % 40 === 0 && piecesRef.current.length < 40) {
        const p = spawn()
        p.width = ctx.measureText(p.label).width + 16
        piecesRef.current.push(p)
      }

      piecesRef.current = piecesRef.current.filter(p => {
        p.wobble = Math.sin(frameRef.current * p.wobbleSpeed + p.wobbleOffset) * 1.2
        p.x += p.vx + p.wobble * 0.3
        p.y += p.vy
        p.rotation += p.rotationSpeed

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = p.opacity

        // pill background
        const w = p.width
        const h = p.height
        const r = h / 2
        ctx.beginPath()
        ctx.moveTo(-w / 2 + r, -h / 2)
        ctx.lineTo(w / 2 - r, -h / 2)
        ctx.arcTo(w / 2, -h / 2, w / 2, h / 2, r)
        ctx.lineTo(w / 2 - r, h / 2)
        ctx.arcTo(-w / 2, h / 2, -w / 2, -h / 2, r)
        ctx.closePath()
        ctx.fillStyle = p.color
        ctx.fill()

        // text
        ctx.fillStyle = '#0C0C0C'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(p.label, 0, 0)
        ctx.restore()

        // remove if off screen
        return p.y < canvas.height + 40 && p.x > -100 && p.x < canvas.width + 100
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      />
      <img
        src="https://em-content.zobj.net/source/twitter/376/trophy_1f3c6.png"
        alt="Trophy"
        className="relative w-full h-auto object-contain z-10"
        style={{ filter: 'drop-shadow(0 0 40px rgba(255,215,0,0.3))' }}
      />
    </div>
  )
}
