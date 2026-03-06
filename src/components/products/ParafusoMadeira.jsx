export default function ParafusoMadeira({ screw, onSelect }) {
  const cut = screw.cut || { diameterMm: 4, lengthMm: 40, headHeightMm: 2.2 }
  const radius = cut.diameterMm / 2000

  const rotation =
    screw.axis === 'x'
      ? [0, 0, Math.PI / 2]
      : screw.axis === 'z'
        ? [Math.PI / 2, 0, 0]
        : [0, 0, 0]

  return (
    <mesh
      position={screw.position}
      rotation={rotation}
      castShadow
      receiveShadow
      onClick={(event) => {
        event.stopPropagation()
        if (onSelect) onSelect(screw.id)
      }}
    >
      <cylinderGeometry args={[radius, radius, cut.headHeightMm / 1000, 16]} />
      <meshStandardMaterial color={screw.color || '#474b52'} roughness={0.35} metalness={0.65} />
    </mesh>
  )
}
