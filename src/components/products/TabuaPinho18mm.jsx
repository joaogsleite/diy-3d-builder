import { useMemo } from 'react'
import * as THREE from 'three'
import { pineSeedFromId, usePineTexture } from './usePineTexture'

export default function TabuaPinho18mm({ part, selected, onSelect }) {
  const cut = part.cut
  const pineMap = usePineTexture({ seed: pineSeedFromId(part.id) + 101 })

  if (cut.kind === 'rect') {
    return (
      <mesh
        position={part.position}
        rotation={part.rotation}
        castShadow
        receiveShadow
        onClick={(event) => {
          event.stopPropagation()
          onSelect(part.id)
        }}
      >
        <boxGeometry args={[cut.lengthMm / 1000, cut.heightMm / 1000, 0.018]} />
        <meshStandardMaterial
          color="#f3e4c7"
          map={pineMap}
          bumpMap={pineMap}
          bumpScale={0.0032}
          transparent
          opacity={selected ? 0.7 : 1}
          depthWrite={!selected}
          roughness={0.82}
          metalness={0.08}
          emissive={selected ? '#ad3c1f' : '#000000'}
          emissiveIntensity={selected ? 0.35 : 0}
        />
      </mesh>
    )
  }

  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.lineTo(cut.depthMm / 1000, 0)
    shape.lineTo(cut.depthMm / 1000, cut.backHeightMm / 1000)
    shape.lineTo(0, cut.frontHeightMm / 1000)
    shape.closePath()

    const g = new THREE.ExtrudeGeometry(shape, { depth: 0.018, bevelEnabled: false })
    g.translate(-(cut.depthMm / 1000) / 2, 0, -0.009)
    return g
  }, [cut.backHeightMm, cut.depthMm, cut.frontHeightMm])

  return (
    <mesh
      geometry={geometry}
      position={part.position}
      rotation={part.rotation}
      castShadow
      receiveShadow
      onClick={(event) => {
        event.stopPropagation()
        onSelect(part.id)
      }}
    >
      <meshStandardMaterial
        color="#f3e4c7"
        map={pineMap}
        bumpMap={pineMap}
        bumpScale={0.0032}
        transparent
        opacity={selected ? 0.7 : 1}
        depthWrite={!selected}
        roughness={0.82}
        metalness={0.08}
        emissive={selected ? '#ad3c1f' : '#000000'}
        emissiveIntensity={selected ? 0.35 : 0}
      />
    </mesh>
  )
}
