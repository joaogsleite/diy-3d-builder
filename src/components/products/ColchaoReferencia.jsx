import * as THREE from 'three'

export default function ColchaoReferencia({ part, selected, onSelect }) {
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
      <boxGeometry args={[part.cut.lengthMm / 1000, part.cut.heightMm / 1000, part.cut.depthMm / 1000]} />
      <meshStandardMaterial
        color={part.color}
        transparent
        opacity={selected ? 0.22 : 0.35}
        depthWrite={false}
        depthTest
        roughness={0.95}
        metalness={0.02}
        emissive={selected ? '#3c6f5f' : '#000000'}
        emissiveIntensity={selected ? 0.25 : 0}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
