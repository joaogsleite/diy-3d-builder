export default function Glued({ parts, spec, seams = [] }) {
  const realistic =
    spec?.glueType === 'D3' &&
    (spec?.clampMinutes || 0) >= 30 &&
    (spec?.cureHours || 0) >= 12 &&
    (spec?.seamThicknessMm || 0.4) <= 0.6

  return (
    <group userData={{ parts: parts.map((p) => p.id), spec, realistic }}>
      {seams.map((seam) => (
        <mesh key={seam.id} position={seam.position} rotation={seam.rotation || [0, 0, 0]}>
          <boxGeometry args={seam.size} />
          <meshStandardMaterial
            color={realistic ? '#f4d17a' : '#ff4d4d'}
            transparent
            opacity={0.45}
            roughness={0.35}
            metalness={0.0}
          />
        </mesh>
      ))}
    </group>
  )
}
