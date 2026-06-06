interface ThemePreviewProps {
  primaryColor: string
  brandName?: string
}

export function SummitPreview({ primaryColor, brandName }: ThemePreviewProps) {
  return (
    <div className="text-[7px] w-full">
      <div className="px-2 py-1.5 flex justify-between" style={{ backgroundColor: primaryColor }}>
        <div>
          <span className="text-white font-bold text-[8px]">INVOICE</span>
          {brandName && <span className="text-white/70 ml-1 text-[6px]">{brandName}</span>}
        </div>
        <span className="text-white/70">#001</span>
      </div>
      <div className="bg-white px-2 py-1">
        <div className="flex justify-between py-0.5 border-b border-slate-100">
          <span className="text-slate-400">Description</span>
          <span className="text-slate-400">Amount</span>
        </div>
        <div className="flex justify-between py-0.5">
          <span className="text-slate-600">Service</span>
          <span className="text-slate-700">$500</span>
        </div>
        <div className="flex justify-between pt-1 border-t border-slate-200 mt-0.5">
          <span className="font-bold text-slate-800">Total</span>
          <span className="font-bold" style={{ color: primaryColor }}>$500</span>
        </div>
      </div>
    </div>
  )
}

export function AuroraPreview({ primaryColor, brandName }: ThemePreviewProps) {
  return (
    <div className="text-[7px] w-full">
      <div className="px-2 py-1.5 flex justify-between" style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, #14b8a6 100%)` }}>
        <div>
          <span className="text-white font-bold text-[8px]">INVOICE</span>
          {brandName && <span className="text-white/70 ml-1 text-[6px]">{brandName}</span>}
        </div>
        <span className="text-white/80">#001</span>
      </div>
      <div className="bg-white px-2 py-1">
        <div className="flex justify-between py-0.5 bg-[#F0EFFF] px-1 rounded" style={{ backgroundColor: `${primaryColor}18` }}>
          <span style={{ color: primaryColor }}>Description</span>
          <span style={{ color: primaryColor }}>Amount</span>
        </div>
        <div className="flex justify-between py-0.5">
          <span className="text-slate-600">Service</span>
          <span className="text-slate-700">$500</span>
        </div>
        <div className="rounded px-1 py-0.5 mt-0.5 flex justify-between border" style={{ backgroundColor: `${primaryColor}18`, borderColor: `${primaryColor}30` }}>
          <span className="font-bold" style={{ color: primaryColor }}>Total</span>
          <span className="font-bold" style={{ color: primaryColor }}>$500</span>
        </div>
      </div>
    </div>
  )
}

export function LedgerPreview({ primaryColor, brandName }: ThemePreviewProps) {
  return (
    <div className="text-[7px] w-full">
      <div className="bg-[#111827] px-2 py-1.5 flex justify-between">
        <div>
          <span className="text-white font-bold text-[8px]">INVOICE</span>
          {brandName && <span className="text-gray-400 ml-1 text-[6px]">{brandName}</span>}
        </div>
        <span className="text-gray-400">#001</span>
      </div>
      <div className="bg-white">
        <div className="flex border-b border-[#111827] bg-[#1f2937]">
          <span className="text-white px-2 py-0.5 flex-1 border-r border-gray-600">Description</span>
          <span className="text-white px-2 py-0.5 w-12 text-right">Amount</span>
        </div>
        <div className="flex border-b border-slate-200">
          <span className="text-slate-700 px-2 py-0.5 flex-1 border-r border-slate-200">Service</span>
          <span className="text-slate-700 px-2 py-0.5 w-12 text-right">$500</span>
        </div>
        <div className="flex border-t-2 border-slate-800">
          <span className="font-bold text-slate-900 px-2 py-0.5 flex-1">Total</span>
          <span className="font-bold px-2 py-0.5 w-12 text-right" style={{ color: primaryColor }}>$500</span>
        </div>
      </div>
    </div>
  )
}

export function SlatePreview({ primaryColor, brandName }: ThemePreviewProps) {
  return (
    <div className="text-[7px] w-full">
      <div className="px-2 py-1.5 flex justify-between" style={{ backgroundColor: primaryColor }}>
        <div>
          <span className="text-white font-bold text-[9px]">{brandName || 'Your Business'}</span>
        </div>
        <span className="text-white/70 font-semibold text-[6px] self-end">INVOICE</span>
      </div>
      <div className="bg-white">
        <div className="flex px-2 py-0.5" style={{ backgroundColor: primaryColor }}>
          <span className="text-white flex-1">Description</span>
          <span className="text-white w-12 text-right">Amount</span>
        </div>
        <div className="flex border-b border-slate-100 px-2 py-0.5">
          <span className="text-slate-700 flex-1">Service</span>
          <span className="text-slate-700 w-12 text-right">$500</span>
        </div>
        <div className="flex border-t border-slate-300 px-2 py-0.5 mt-0.5">
          <span className="font-bold text-slate-900 flex-1">Total</span>
          <span className="font-bold w-12 text-right" style={{ color: primaryColor }}>$500</span>
        </div>
      </div>
    </div>
  )
}

export function IvoryPreview({ primaryColor, brandName }: ThemePreviewProps) {
  return (
    <div className="text-[7px] w-full">
      <div className="px-2 py-1.5 flex justify-between bg-white" style={{ borderTop: `3px solid ${primaryColor}` }}>
        <span className="text-slate-800 font-bold text-[8px]">{brandName || 'Your Business'}</span>
        <span className="font-bold text-[8px]" style={{ color: primaryColor }}>INVOICE</span>
      </div>
      <div className="bg-white px-2 py-1">
        <div className="flex justify-between py-0.5 border-b border-slate-200">
          <span className="text-slate-500">Description</span>
          <span className="text-slate-500">Amount</span>
        </div>
        <div className="flex justify-between py-0.5 border-b border-slate-100">
          <span className="text-slate-600">Service</span>
          <span className="text-slate-700">$500</span>
        </div>
        <div className="flex justify-between pt-0.5 mt-0.5">
          <span className="font-bold text-slate-900">Total</span>
          <span className="font-bold" style={{ color: primaryColor }}>$500</span>
        </div>
      </div>
    </div>
  )
}
