import ColchaoReferencia from './ColchaoReferencia'
import RipaCorte from './RipaCorte'
import TabuaPinho18mm from './TabuaPinho18mm'

export default function ProductInstance({ part, selected, onSelect }) {
  if (part.product.startsWith('RIPA_')) {
    return <RipaCorte part={part} selected={selected} onSelect={onSelect} />
  }

  if (part.product === 'TABUA_1250x200x18') {
    return <TabuaPinho18mm part={part} selected={selected} onSelect={onSelect} />
  }

  if (part.product === 'COLCHAO_REFERENCIA') {
    return <ColchaoReferencia part={part} selected={selected} onSelect={onSelect} />
  }

  return null
}
