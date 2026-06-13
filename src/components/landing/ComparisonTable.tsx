import { Check, X } from '@phosphor-icons/react/dist/ssr'

// value can be a string, or a boolean rendered as a check/x mark.
type Cell = string | boolean

interface Row {
  feature: string
  fc: Cell
  bonsai: Cell
  honeybook: Cell
}

const ROWS: Row[] = [
  { feature: 'Monthly price', fc: '$15 flat', bonsai: '$15–25 / user', honeybook: '$36+' },
  { feature: 'Takes a cut of payments', fc: false, bonsai: 'Via processor', honeybook: 'Yes (~2.9%)' },
  { feature: 'Per-user pricing', fc: 'No, ever', bonsai: 'Yes', honeybook: 'On higher tiers' },
  { feature: 'Uncapped reminders', fc: true, bonsai: 'Limited', honeybook: 'Limited' },
  { feature: 'Profession contracts', fc: '7 templates', bonsai: 'Generic', honeybook: 'Generic' },
  { feature: 'Recent price change', fc: 'None', bonsai: 'Acquisition pending', honeybook: '+89% in 2025' },
]

function CellValue({ value }: { value: Cell }) {
  if (value === true) return <Check size={18} weight="bold" className="mx-auto text-[#1DB954]" />
  if (value === false) return <X size={18} weight="bold" className="mx-auto text-[#DF1B41]" />
  return <span>{value}</span>
}

export function ComparisonTable() {
  return (
    <section id="compare" className="bg-[#F6F9FC] px-4 py-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-[-0.02em] text-[#0A2540] md:text-4xl">
          Honest math vs the big names.
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-[#E6EBF1] bg-white shadow-sm">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-[#E6EBF1] bg-[#F6F9FC]">
                <th className="p-4 text-left font-semibold text-[#8898AA]">Feature</th>
                <th className="bg-[#635BFF] p-4 text-center font-bold text-white">FileCurrent</th>
                <th className="p-4 text-center font-medium text-[#425466]">Bonsai</th>
                <th className="p-4 text-center font-medium text-[#425466]">HoneyBook</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={row.feature} className={i % 2 === 1 ? 'bg-[#FBFCFE]' : 'bg-white'}>
                  <td className="p-4 font-medium text-[#0A2540]">{row.feature}</td>
                  <td className="bg-[#F0EFFF] p-4 text-center font-semibold text-[#0A2540]">
                    <CellValue value={row.fc} />
                  </td>
                  <td className="p-4 text-center text-[#425466]">
                    <CellValue value={row.bonsai} />
                  </td>
                  <td className="p-4 text-center text-[#425466]">
                    <CellValue value={row.honeybook} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-[#8898AA]">
          Competitor pricing as of mid-2026, verify current plans.
        </p>
      </div>
    </section>
  )
}
