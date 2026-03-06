import { pineSeedFromId, usePineTexture } from './usePineTexture'

export default function Ripa30x30({ part, selected, onSelect }) {
  const length = (part.cut.lengthMm || 0) / 1000
  const axis = part.cut.axis || 'x'
  const pineMap = usePineTexture({ seed: pineSeedFromId(part.id) + 31 })

  let size = [length, 0.03, 0.03]
  if (axis === 'y') size = [0.03, length, 0.03]
  if (axis === 'z') size = [0.03, 0.03, length]

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
        bumpScale={0.0035}
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
