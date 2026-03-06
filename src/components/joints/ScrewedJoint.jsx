import ParafusoMadeira from '../products/ParafusoMadeira'

function isScrewLayoutRealistic(spec, screws) {
  if (!spec) return false
  const edgeOk = screws.every((screw) => (screw.edgeDistanceMm || 0) >= (spec.minEdgeDistanceMm || 0))
  const spacingOk = screws.every((screw) => (screw.spacingToNextMm || spec.minSpacingMm || 0) >= (spec.minSpacingMm || 0))
  const pilotOk = (spec.pilotHoleMm || 0) > 0 && (spec.pilotHoleMm || 0) < (spec.screwDiameterMm || 5)
  return edgeOk && spacingOk && pilotOk
}

export default function ScrewedJoint({ parts, spec, screws = [] }) {
  const realistic = isScrewLayoutRealistic(spec, screws)

  return (
    <group userData={{ parts: parts.map((p) => p.id), spec, realistic }}>
      {screws.map((screw) => (
        <ParafusoMadeira
          key={screw.id}
          screw={{
            ...screw,
            color: realistic ? '#474b52' : '#ff4d4d',
          }}
        />
      ))}
    </group>
  )
}
