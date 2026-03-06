import { pineSeedFromId, usePineTexture } from './usePineTexture'

export default function Ripa18x45({ part, selected, onSelect }) {
  const length = (part.cut.lengthMm || 0) / 1000
  const axis = part.cut.axis || 'z'
  const pineMap = usePineTexture({ seed: pineSeedFromId(part.id) + 71 })

  // 18x45 profile orientation chosen to match realistic cut placement.
  let size = [0.045, 0.018, length]
  if (axis === 'x') size = [length, 0.018, 0.045]
  if (axis === 'y') size = [0.018, length, 0.045]

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
      <boxGeometry args={size} />
      <meshStandardMaterial
        color="#f4e7cc"
        map={pineMap}
        bumpMap={pineMap}
        bumpScale={0.0038}
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
