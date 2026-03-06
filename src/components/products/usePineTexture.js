import { useMemo } from 'react'
import * as THREE from 'three'

export function pineSeedFromId(id = '') {
  let hash = 2166136261
  for (let i = 0; i < id.length; i += 1) {
    hash ^= id.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return Math.abs(hash) || 1
}

function makeRand(seed) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function createPineCanvas(seed) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  const rand = makeRand(seed)
  const gradient = ctx.createLinearGradient(0, 0, 512, 0)
  gradient.addColorStop(0, '#f6eddc')
  gradient.addColorStop(0.45, '#efe1c8')
  gradient.addColorStop(1, '#e8d3b2')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 512, 512)

  // Long soft grain lines.
  for (let i = 0; i < 160; i += 1) {
    const y = rand() * 512
    const amp = 2 + rand() * 6
    const phase = rand() * Math.PI * 2
    const width = 0.4 + rand() * 1.5
    ctx.beginPath()
    for (let x = 0; x <= 512; x += 8) {
      const yy = y + Math.sin(x * 0.02 + phase) * amp
      if (x === 0) ctx.moveTo(x, yy)
      else ctx.lineTo(x, yy)
    }
    ctx.strokeStyle = `rgba(166, 126, 92, ${0.04 + rand() * 0.07})`
    ctx.lineWidth = width
    ctx.stroke()
  }

  // A few knots, typical in pine.
  for (let i = 0; i < 9; i += 1) {
    const x = 60 + rand() * 392
    const y = 40 + rand() * 432
    const rx = 10 + rand() * 24
    const ry = 5 + rand() * 13

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rand() * Math.PI)

    const knotGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, rx)
    knotGrad.addColorStop(0, 'rgba(176, 136, 98, 0.24)')
    knotGrad.addColorStop(0.6, 'rgba(160, 120, 84, 0.11)')
    knotGrad.addColorStop(1, 'rgba(160, 120, 84, 0)')

    ctx.fillStyle = knotGrad
    ctx.beginPath()
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }

  return canvas
}

export function usePineTexture({ seed = 1 } = {}) {
  return useMemo(() => {
    const texture = new THREE.CanvasTexture(createPineCanvas(seed))
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.colorSpace = THREE.SRGBColorSpace
    texture.needsUpdate = true
    return texture
  }, [seed])
}
