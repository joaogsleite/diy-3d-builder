import { useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import ProductInstance from './components/products/ProductInstance'
import Glued from './components/joints/Glued'
import ScrewedJoint from './components/joints/ScrewedJoint'
import { buildBedAssembly } from './model/bedModel'

const UNIT_PRICE_EUR_BY_CODE = {
  RIPA_2400x32x32: 5.25,
  RIPA_2400x48x13: 3.65,
  RIPA_900x56x56: 8.19,
  TABUA_1250x200x18: 7.89,
  SCREWS: 11.19,
  GLUE: 9.69,
}

function formatEuro(value) {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}

function computePurchaseList(parts, joints) {
  const linearProducts = {
    RIPA_2400x32x32: {
      label: 'Ripa de madeira 2400x32x32',
      stockLengthMm: 2400,
      link: 'https://www.leroymerlin.pt/produtos/ripa-de-madeira-tosca-casquinha-branca-32x32x2400mm-14133014.html',
    },
    RIPA_2400x48x13: {
      label: 'Ripa de madeira 2400x48x13',
      stockLengthMm: 2400,
      link: 'https://www.leroymerlin.pt/produtos/ripa-de-madeira-tosca-casquinha-branca-13x48x2400mm-14131502.html',
    },
    RIPA_900x56x56: {
      label: 'Ripa de madeira 900x56x56',
      stockLengthMm: 900,
      link: 'https://www.leroymerlin.pt/produtos/ripa-de-madeira-aplainada-casquinha-branca-56x56x900mm-14131586.html',
    },
  }

  const list = []

  Object.entries(linearProducts).forEach(([productCode, def]) => {
    const cuts = parts.filter((part) => part.product === productCode)
    if (!cuts.length) return

    const totalCutLength = cuts.reduce((sum, part) => sum + (part.cut.lengthMm || 0), 0)
    const quantity = Math.ceil(totalCutLength / def.stockLengthMm)
    list.push({
      code: productCode,
      label: def.label,
      quantity,
      detail: `${cuts.length} cortes / ${Math.round(totalCutLength)} mm total`,
      link: def.link,
      unitPriceEur: UNIT_PRICE_EUR_BY_CODE[productCode],
    })
  })

  const boardCuts = parts.filter((part) => part.product === 'TABUA_1250x200x18')
  if (boardCuts.length) {
    list.push({
      code: 'TABUA_1250x200x18',
      label: 'Tabua de madeira 1250x200x18',
      quantity: boardCuts.length,
      detail: `${boardCuts.length} cortes principais`,
      link: 'https://www.leroymerlin.pt/produtos/ripa-de-madeira-aplainado-18x200x1250-mm-77078723.html',
      unitPriceEur: UNIT_PRICE_EUR_BY_CODE.TABUA_1250x200x18,
    })
  }

  const screwCount = joints
    .filter((joint) => joint.type === 'screwed')
    .reduce((sum, joint) => sum + (joint.screws?.length || 0), 0)

  if (screwCount > 0) {
    list.push({
      code: 'SCREWS',
      label: 'Parafusos para madeira 4x40 mm',
      quantity: 1,
      detail: `min. ${screwCount} unid (1 caixa)`,
      link: 'https://www.leroymerlin.pt/produtos/500-parafusos-standers-plano-oval-pz-cromado-4x40-82231879.html',
      unitPriceEur: UNIT_PRICE_EUR_BY_CODE.SCREWS,
    })
  }

  const hasGlue = joints.some((joint) => joint.type === 'glued')
  if (hasGlue) {
    list.push({
      code: 'GLUE',
      label: 'Cola de madeira D3',
      quantity: 1,
      detail: '1 frasco (~250 g)',
      link: 'https://www.leroymerlin.pt/produtos/cola-branca-para-madeira-uhu-resist-agua-750gr-82010107.html',
      unitPriceEur: UNIT_PRICE_EUR_BY_CODE.GLUE,
    })
  }

  return list
}

function BedScene({ parts, joints, partById, selectedId, onSelect, onDeselect, isMobile }) {
  const cameraPosition = isMobile ? [0, 1.08, 2.05] : [2.2, 1.1, 1.95]
  const orbitTarget = isMobile ? [0, 0.18, 0] : [0.28, 0.18, 0]

  return (
    <Canvas
      shadows
      camera={{ position: cameraPosition, fov: 48, near: 0.1, far: 30 }}
      onPointerMissed={onDeselect}
    >
      <color attach="background" args={['#eaf4ff']} />
      <hemisphereLight intensity={0.7} color="#fff4d8" groundColor="#a2988a" />
      <directionalLight position={[2.2, 3.6, 2.5]} intensity={1.05} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#aeb9c8" roughness={0.96} />
      </mesh>

      <ContactShadows
        position={[0, 0.001, 0]}
        scale={3}
        opacity={0.45}
        blur={2.2}
        far={1.2}
        resolution={512}
        color="#5f4d3a"
      />

      {parts.map((part) => (
        part.product === 'COLCHAO_REFERENCIA'
          ? null
          : <ProductInstance key={part.id} part={part} selected={selectedId === part.id} onSelect={onSelect} />
      ))}

      {joints.map((joint) => {
        const jointParts = joint.parts.map((partId) => partById.get(partId)).filter(Boolean)

        if (joint.type === 'glued') {
          return <Glued key={joint.id} parts={jointParts} spec={joint.spec} seams={joint.seams} />
        }

        if (joint.type === 'screwed') {
          return <ScrewedJoint key={joint.id} parts={jointParts} spec={joint.spec} screws={joint.screws} />
        }

        return null
      })}

      <OrbitControls
        target={orbitTarget}
        minPolarAngle={0.05}
        maxPolarAngle={Math.PI - 0.05}
        minDistance={0.7}
        maxDistance={4}
      />
    </Canvas>
  )
}

function App() {
  const assembly = useMemo(() => buildBedAssembly(), [])
  const parts = assembly.parts
  const joints = assembly.joints
  const byId = useMemo(() => new Map(parts.map((part) => [part.id, part])), [parts])
  const purchaseList = useMemo(() => computePurchaseList(parts, joints), [parts, joints])
  const purchaseTotalEur = useMemo(
    () => purchaseList.reduce((sum, item) => sum + (item.unitPriceEur ?? 0) * item.quantity, 0),
    [purchaseList],
  )
  const missingPriceCount = useMemo(
    () => purchaseList.filter((item) => item.unitPriceEur == null).length,
    [purchaseList],
  )
  const [selectedId, setSelectedId] = useState(null)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const selected = selectedId ? byId.get(selectedId) : null

  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_20%_10%,#efe6d6_0%,#d9cbb6_45%,#c5b6a0_100%)] text-[#2c2117]">
      <main className="relative h-[54vh] overflow-hidden md:h-screen">
        <div className="h-full w-full">
          <BedScene
            parts={parts}
            joints={joints}
            partById={byId}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDeselect={() => setSelectedId(null)}
            isMobile={isMobile}
          />
        </div>
      </main>

      <aside className="max-h-[54vh] overflow-auto border-t border-[#34495e33] bg-[#f7fbfff2] px-3 py-3 md:absolute md:right-0 md:top-0 md:z-20 md:h-screen md:w-65 md:max-h-none md:border-l md:border-t-0 md:bg-[#f7fbff66] md:backdrop-blur-[2px]">
        <section className="px-0.5 py-0.5">
          <h3 className="m-0 text-[0.92rem] font-semibold text-[#304357]">Peca Selecionada</h3>
          {selected ? (
            <>
              <p className="mb-0 mt-1 text-[0.78rem] font-semibold text-[#2d3d4c]">{selected.info.productName}</p>
              <p className="my-1 text-[0.75rem] leading-[1.3] text-[#5b6f83]">Aplicacao: {selected.info.desc}</p>
              <p className="my-1 text-[0.75rem] leading-[1.3] text-[#5b6f83]">Dimensoes da peca: {selected.info.dimensions}</p>
            </>
          ) : (
            <p className="mb-0 mt-1 text-[0.74rem] text-[#6a7f96]">Clica numa peca no modelo para ver os detalhes aqui.</p>
          )}
        </section>

        <hr className="my-3 border-0 border-t border-[#6d839833]" />

        <h3 className="m-0 text-[0.92rem] font-semibold text-[#304357]">Lista de Pecas a Comprar</h3>
        <p className="mb-2 mt-1 text-[0.74rem] text-[#4d6379]">Pecas em bruto (antes dos cortes).</p>
        <div className="space-y-1.5">
          {purchaseList.map((item) => (
            <div key={item.code} className="rounded-lg border border-[#6d83981f] bg-white/70 px-2 py-1.5">
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="m-0 text-[0.78rem] font-semibold text-[#2d3d4c] hover:underline"
              >
                {item.quantity}x {item.label}
              </a>
              <p className="m-0 mt-0.5 text-[0.72rem] text-[#62788f]">{item.detail}</p>
              <p className="m-0 mt-0.5 text-[0.72rem] text-[#4d6379]">
                {item.unitPriceEur == null
                  ? 'Preco por definir'
                  : `${formatEuro(item.unitPriceEur)} / unid. - Subtotal: ${formatEuro(item.unitPriceEur * item.quantity)}`}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-2 rounded-lg border border-[#6d839833] bg-[#eef4fb] px-2 py-1.5">
          <p className="m-0 text-[0.78rem] font-semibold text-[#2d3d4c]">
            Total estimado: {formatEuro(purchaseTotalEur)}
          </p>
          {missingPriceCount > 0 ? (
            <p className="m-0 mt-0.5 text-[0.7rem] text-[#62788f]">
              Faltam definir precos em {missingPriceCount} item(ns).
            </p>
          ) : null}
        </div>
      </aside>
    </div>
  )
}

export default App
