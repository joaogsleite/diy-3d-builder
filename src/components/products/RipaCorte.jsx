import { pineSeedFromId, usePineTexture } from './usePineTexture'

export default function RipaCorte({ part, selected, onSelect }) {
  const length = (part.cut.lengthMm || 0) / 1000
  const width = (part.cut.widthMm || 32) / 1000
  const thickness = (part.cut.thicknessMm || 32) / 1000
  const axis = part.cut.axis || 'x'

  const pineMap = usePineTexture({ seed: pineSeedFromId(part.id) + 51 })

  let size = [length, width, thickness]
  if (axis === 'y') size = [width, length, thickness]
  if (axis === 'z') size = [width, thickness, length]

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
