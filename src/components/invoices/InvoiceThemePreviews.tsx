interface ThemePreviewProps {
  primaryColor: string
  brandName?: string
}

export function SummitPreview({ primaryColor, brandName }: ThemePreviewProps) {
  return (
    <div className="text-[7px] w-full h-full bg-white" style={{ borderLeft: `3px solid ${primaryColor}` }}>
      <div className="px-2 py-1.5 flex justify-between bg-white border-b border-slate-100">
        <div>
          <span className="text-slate-800 font-bold text-[8px]">{brandName || 'Your Business'}</span>
          <p className="text-slate-400 text-[5px] mt-0.5">INVOICE</p>
        </div>
        <span className="text-slate-400 text-[6px]">#001</span>
      </div>
      <div className="bg-white px-2 py-1">
        <div className="flex justify-between py-0.5 bg-[#F3F4F6] px-1 rounded-sm">
          <span className="text-slate-500">Description</span>
          <span className="text-slate-500">Amount</span>
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
      <div className="px-2 py-1.5 flex justify-between" style={{ background: `linear-gradient(90deg, ${primaryColor} 0%, #14b8a6 100%)` }}>
        <div>
          <span className="text-white font-bold text-[8px]">{brandName || 'Your Business'}</span>
          <p className="text-white/70 text-[5px] mt-0.5">INVOICE</p>
        </div>
        <span className="text-white/80">#001</span>
      </div>
      <div className="px-2 py-0.5" style={{ backgroundColor: `${primaryColor}10` }}>
        <span className="text-[5px]" style={{ color: primaryColor }}>Bill To: Client Name</span>
      </div>
      <div className="bg-white px-2 py-1">
        <div className="flex justify-between py-0.5 px-1 rounded-sm" style={{ backgroundColor: `${primaryColor}18` }}>
          <span style={{ color: primaryColor }}>Description</span>
          <span style={{ color: primaryColor }}>Amount</span>
        </div>
        <div className="flex justify-between py-0.5">
          <span className="text-slate-600">Service</span>
          <span className="text-slate-700">$500</span>
        </div>
        <div className="flex justify-between pt-1 border-t mt-0.5" style={{ borderColor: `${primaryColor}30` }}>
          <span className="font-bold" style={{ color: primaryColor }}>Total</span>
          <span className="font-bold" style={{ color: primaryColor }}>$500</span>
        </div>
      </div>
    </div>
  )
}

export function LedgerPreview({ primaryColor, brandName }: ThemePreviewProps) {
  return (
    <div className="text-[7px] w-full h-full flex">
      {/* Left dark sidebar */}
      <div className="w-16 shrink-0 flex flex-col justify-between p-1.5" style={{ backgroundColor: '#111827' }}>
        <div>
          <p className="text-white font-bold text-[7px] leading-tight">{brandName || 'Studio'}</p>
          <p className="text-gray-400 text-[5px] mt-0.5">INVOICE</p>
        </div>
        <p className="text-gray-400 text-[5px]">#001</p>
      </div>
      {/* Right content */}
      <div className="flex-1 bg-white p-1.5">
        <div className="flex justify-between border-b border-slate-800 pb-0.5 mb-0.5">
          <span className="text-slate-600 text-[6px] font-semibold">Description</span>
          <span className="text-slate-600 text-[6px] font-semibold">Amount</span>
        </div>
        <div className="flex justify-between py-0.5">
          <span className="text-slate-600 text-[6px]">Service</span>
          <span className="text-slate-600 text-[6px]">$500</span>
        </div>
        <div className="flex justify-between border-t-2 border-slate-800 pt-0.5 mt-0.5">
          <span className="font-bold text-slate-800 text-[6px]">Total</span>
          <span className="font-bold text-[6px]" style={{ color: primaryColor }}>$500</span>
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
