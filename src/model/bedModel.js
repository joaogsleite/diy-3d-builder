function makeInfo(title, desc, dimensions, link, productName, partGroup) {
  return { title, desc, dimensions, link, productName, partGroup }
}

export function buildBedAssembly() {
  const parts = []
  const joints = []

  const t = 18
  const innerX = 1010
  const innerZ = 640
  const outerX = innerX + 2 * t
  const outerZ = innerZ + 2 * t

  // Board max width is 200 mm, so rear height must stay below that.
  const frontH = 60
  const backH = 190

  const legH = 160
  const frameSec = 32
  const frameTopY = legH + frameSec
  const frameY = frameTopY - frameSec / 2
  const sideRailLength = innerZ - 2 * frameSec
  const borderBaseY = frameTopY - frameSec

  const toM = (mm) => mm / 1000
  const id = (() => {
    let n = 0
    return (prefix) => {
      n += 1
      return `${prefix}-${n}`
    }
  })()

  const ids = {
    rails: [],
    slats: [],
    legs: [],
  }

  const frontRailZ = outerZ / 2 - frameSec / 2 - t
  const backRailZ = -outerZ / 2 + frameSec / 2 + t

  function addPart(part) {
    parts.push(part)
    return part.id
  }

  ids.rails.push(
    addPart({
      id: 'rail-front',
      product: 'RIPA_2400x32x32',
      cut: { lengthMm: innerX, widthMm: 32, thicknessMm: 32, axis: 'x' },
      position: [0, toM(frameY), toM(frontRailZ)],
      rotation: [0, 0, 0],
      color: '#d8b777',
      info: makeInfo(
        'Support rail (front) - corte de ripa 2400x32x32',
        'Travessa frontal cortada da ripa 2400x32x32.',
        '101 x 3.2 x 3.2 cm',
        'https://www.leroymerlin.pt/produtos/ripa-de-madeira-tosca-casquinha-branca-32x32x2400mm-14133014.html',
        'Ripa de madeira 2400x32x32',
        'Estrutura de suporte',
      ),
    }),
  )

  ids.rails.push(
    addPart({
      id: 'rail-back',
      product: 'RIPA_2400x32x32',
      cut: { lengthMm: innerX, widthMm: 32, thicknessMm: 32, axis: 'x' },
      position: [0, toM(frameY), toM(backRailZ)],
      rotation: [0, 0, 0],
      color: '#d8b777',
      info: makeInfo(
        'Support rail (back) - corte de ripa 2400x32x32',
        'Travessa traseira cortada da ripa 2400x32x32.',
        '101 x 3.2 x 3.2 cm',
        'https://www.leroymerlin.pt/produtos/ripa-de-madeira-tosca-casquinha-branca-32x32x2400mm-14133014.html',
        'Ripa de madeira 2400x32x32',
        'Estrutura de suporte',
      ),
    }),
  )

  ids.rails.push(
    addPart({
      id: 'rail-left',
      product: 'RIPA_2400x32x32',
      cut: { lengthMm: sideRailLength, widthMm: 32, thicknessMm: 32, axis: 'z' },
      position: [toM(-outerX / 2 + frameSec / 2 + t), toM(frameY), 0],
      rotation: [0, 0, 0],
      color: '#d8b777',
      info: makeInfo(
        'Support rail (left) - corte de ripa 2400x32x32',
        'Ripa lateral entre travessas frontal/traseira (sem intersecao).',
        '57.6 x 3.2 x 3.2 cm',
        'https://www.leroymerlin.pt/produtos/ripa-de-madeira-tosca-casquinha-branca-32x32x2400mm-14133014.html',
        'Ripa de madeira 2400x32x32',
        'Estrutura de suporte',
      ),
    }),
  )

  ids.rails.push(
    addPart({
      id: 'rail-right',
      product: 'RIPA_2400x32x32',
      cut: { lengthMm: sideRailLength, widthMm: 32, thicknessMm: 32, axis: 'z' },
      position: [toM(outerX / 2 - frameSec / 2 - t), toM(frameY), 0],
      rotation: [0, 0, 0],
      color: '#d8b777',
      info: makeInfo(
        'Support rail (right) - corte de ripa 2400x32x32',
        'Ripa lateral entre travessas frontal/traseira (sem intersecao).',
        '57.6 x 3.2 x 3.2 cm',
        'https://www.leroymerlin.pt/produtos/ripa-de-madeira-tosca-casquinha-branca-32x32x2400mm-14133014.html',
        'Ripa de madeira 2400x32x32',
        'Estrutura de suporte',
      ),
    }),
  )

  const slatCount = 10
  const slatY = 13
  const slatLength = 620
  const slatTopY = frameTopY + slatY / 2
  const slatScrewInsetFromRail = 12
  const xStart = -innerX / 2 + 70
  const xEnd = innerX / 2 - 70
  const xStep = (xEnd - xStart) / (slatCount - 1)

  for (let i = 0; i < slatCount; i += 1) {
    const sx = xStart + i * xStep
    const slatId = addPart({
      id: id('slat'),
      product: 'RIPA_2400x48x13',
      cut: { lengthMm: slatLength, widthMm: 48, thicknessMm: 13, axis: 'z' },
      position: [toM(sx), toM(slatTopY), 0],
      rotation: [0, 0, 0],
      color: '#e3c58d',
      info: makeInfo(
        'Base slat - corte de ripa 2400x48x13',
        'Ripa 48x13 cortada para estrado ventilado.',
        '62 x 4.8 x 1.3 cm',
        'https://www.leroymerlin.pt/produtos/ripa-de-madeira-tosca-casquinha-branca-13x48x2400mm-14131502.html',
        'Ripa de madeira 2400x48x13',
        'Ripas horizontais da base',
      ),
    })
    ids.slats.push({ id: slatId, xMm: sx })
  }

  addPart({
    id: 'board-front',
    product: 'TABUA_1250x200x18',
    cut: { kind: 'rect', lengthMm: outerX, heightMm: frontH },
    position: [0, toM(borderBaseY + frontH / 2), toM(outerZ / 2 - t / 2)],
    rotation: [0, 0, 0],
    color: '#e4c186',
    info: makeInfo(
      'Front border board - corte de tabua 1250x200x18',
      'Corte da tabua 1250x200x18 para frente da cama.',
      '104.6 x 6 x 1.8 cm',
      'https://www.leroymerlin.pt/produtos/ripa-de-madeira-aplainado-18x200x1250-mm-77078723.html',
      'Tabua de madeira 1250x200x18',
      'Bordas',
    ),
  })

  addPart({
    id: 'board-back',
    product: 'TABUA_1250x200x18',
    cut: { kind: 'rect', lengthMm: outerX, heightMm: backH },
    position: [0, toM(borderBaseY + backH / 2), toM(-outerZ / 2 + t / 2)],
    rotation: [0, 0, 0],
    color: '#e4c186',
    info: makeInfo(
      'Back border board - corte de tabua 1250x200x18',
      'Tabua traseira alta, respeitando o limite de 200 mm de largura de origem.',
      '104.6 x 19 x 1.8 cm',
      'https://www.leroymerlin.pt/produtos/ripa-de-madeira-aplainado-18x200x1250-mm-77078723.html',
      'Tabua de madeira 1250x200x18',
      'Bordas',
    ),
  })

  addPart({
    id: 'board-left',
    product: 'TABUA_1250x200x18',
    cut: { kind: 'ramp', depthMm: innerZ, frontHeightMm: frontH, backHeightMm: backH },
    position: [toM(-outerX / 2 + t / 2), toM(borderBaseY), 0],
    rotation: [0, Math.PI / 2, 0],
    color: '#e4c186',
    info: makeInfo(
      'Left side board - corte de tabua 1250x200x18',
      'Recorte em rampa de uma tabua 1250x200x18.',
      '64 cm profundidade, 6->19 cm altura, 1.8 cm esp.',
      'https://www.leroymerlin.pt/produtos/ripa-de-madeira-aplainado-18x200x1250-mm-77078723.html',
      'Tabua de madeira 1250x200x18',
      'Bordas',
    ),
  })

  addPart({
    id: 'board-right',
    product: 'TABUA_1250x200x18',
    cut: { kind: 'ramp', depthMm: innerZ, frontHeightMm: frontH, backHeightMm: backH },
    position: [toM(outerX / 2 - t / 2), toM(borderBaseY), 0],
    rotation: [0, Math.PI / 2, 0],
    color: '#e4c186',
    info: makeInfo(
      'Right side board - corte de tabua 1250x200x18',
      'Recorte em rampa de uma tabua 1250x200x18.',
      '64 cm profundidade, 6->19 cm altura, 1.8 cm esp.',
      'https://www.leroymerlin.pt/produtos/ripa-de-madeira-aplainado-18x200x1250-mm-77078723.html',
      'Tabua de madeira 1250x200x18',
      'Bordas',
    ),
  })

  addPart({
    id: 'mattress',
    product: 'COLCHAO_REFERENCIA',
    cut: { lengthMm: 1000, heightMm: 80, depthMm: 630 },
    position: [0, toM(frameTopY + slatY + 40), 0],
    rotation: [0, 0, 0],
    color: '#8a9c89',
    info: makeInfo(
      'Mattress (existing)',
      'Colchao/cama existente usado como referencia de encaixe.',
      '100 x 63 cm',
      'https://www.leroymerlin.pt/search?q=cama%20para%20c%C3%A3o',
      'Colchao/cama para cao (referencia)',
      'Colchao',
    ),
  })

  const legX = 56
  const legZ = 56
  const recess = 22

  function addLeg(cornerName, px, pz) {
    const legId = addPart({
      id: id(`leg-${cornerName}`),
      product: 'RIPA_900x56x56',
      cut: { lengthMm: legH, widthMm: 56, thicknessMm: 56, axis: 'y' },
      position: [toM(px), toM(legH / 2), toM(pz)],
      rotation: [0, 0, 0],
      color: '#cfa86f',
      info: makeInfo(
        'Leg - corte de ripa 900x56x56',
        'Pe em peca unica cortado da ripa 900x56x56.',
        '16 x 5.6 x 5.6 cm',
        'https://www.leroymerlin.pt/produtos/ripa-de-madeira-aplainada-casquinha-branca-56x56x900mm-14131586.html',
        'Ripa de madeira 900x56x56',
        'Pes',
      ),
    })
    ids.legs.push(legId)
  }

  addLeg('fr', outerX / 2 - recess - legX / 2, outerZ / 2 - recess - legZ / 2)
  addLeg('fl', -outerX / 2 + recess + legX / 2, outerZ / 2 - recess - legZ / 2)
  addLeg('br', outerX / 2 - recess - legX / 2, -outerZ / 2 + recess + legZ / 2)
  addLeg('bl', -outerX / 2 + recess + legX / 2, -outerZ / 2 + recess + legZ / 2)

  // Cola D3 recomendada para reforco nas superficies madeira-madeira de contacto.
  joints.push({
    id: 'glued-wood-contacts',
    type: 'glued',
    parts: [...ids.rails, ...ids.legs],
    spec: {
      glueType: 'D3',
      spreadGm2: 170,
      seamThicknessMm: 0.3,
      clampMinutes: 35,
      cureHours: 24,
    },
    seams: [],
  })

  joints.push({
    id: 'screwed-slats',
    type: 'screwed',
    parts: ['rail-front', 'rail-back', ...ids.slats.map((s) => s.id)],
    spec: {
      screwType: 'Parafuso madeira 4x40',
      screwDiameterMm: 4,
      pilotHoleMm: 3,
      minEdgeDistanceMm: 18,
      minSpacingMm: 70,
    },
    screws: ids.slats.flatMap((slat, idx) => {
      const spacing = idx < ids.slats.length - 1 ? xStep : xStep
      return [
        {
          id: `sc-slat-f-${idx}`,
          position: [toM(slat.xMm), toM(slatTopY + slatY / 2 + 1.2), toM(frontRailZ - slatScrewInsetFromRail)],
          axis: 'y',
          edgeDistanceMm: 22,
          spacingToNextMm: spacing,
          cut: { diameterMm: 4, lengthMm: 40, headHeightMm: 2.2 },
        },
        {
          id: `sc-slat-b-${idx}`,
          position: [toM(slat.xMm), toM(slatTopY + slatY / 2 + 1.2), toM(backRailZ + slatScrewInsetFromRail)],
          axis: 'y',
          edgeDistanceMm: 22,
          spacingToNextMm: spacing,
          cut: { diameterMm: 4, lengthMm: 40, headHeightMm: 2.2 },
        },
      ]
    }),
  })

  return { parts, joints }
}
