import React from "react";

export default function BlouseMeasurementSketch({ activeField, onSelectField }) {
  return (
    <div className="relative mx-auto flex max-w-[420px] flex-col items-center rounded-2xl border border-[#eedfd6] bg-white p-4 shadow-sm">
      <div className="mb-2 text-center">
        <span className="inline-block rounded-full bg-[#fdf5f0] px-3 py-1 text-[11px] font-bold text-[#801b3a] border border-[#f3ddd1]">
          ✦ Blouse Measurement Guide / ब्लाउज़ नाप का रेखाचित्र
        </span>
      </div>

      <svg
        viewBox="0 0 500 520"
        className="h-auto w-full max-h-[380px] select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id="arrowpink"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#e06287" />
          </marker>
        </defs>

        {/* Blouse Outline */}
        <g fill="none" stroke="#222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Main Body */}
          {/* Neckline */}
          <path d="M 200 110 C 230 160 270 160 300 110" />
          {/* Shoulders */}
          <path d="M 200 110 L 120 135" />
          <path d="M 300 110 L 380 135" />
          {/* Left Sleeve */}
          <path d="M 120 135 L 80 230 L 130 245 L 165 190" />
          {/* Right Sleeve */}
          <path d="M 380 135 L 420 230 L 370 245 L 335 190" />
          {/* Armhole curves */}
          <path d="M 165 190 C 160 215 165 240 170 260" />
          <path d="M 335 190 C 340 215 335 240 330 260" />
          {/* Side seams */}
          <path d="M 170 260 L 175 360" />
          <path d="M 330 260 L 325 360" />
          {/* Bottom Hem */}
          <path d="M 175 360 C 220 365 280 365 325 360" />

          {/* Princess dart line / fit lines */}
          <path d="M 210 260 C 210 310 215 360 215 360" stroke="#bbb" strokeWidth="1.5" strokeDasharray="4 3" />
          <path d="M 290 260 C 290 310 285 360 285 360" stroke="#bbb" strokeWidth="1.5" strokeDasharray="4 3" />
        </g>

        {/* 1. Blouse Length Arrow (Vertical Left) */}
        <g>
          <line x1="60" y1="120" x2="60" y2="360" stroke="#e06287" strokeWidth="2" markerStart="url(#arrowpink)" markerEnd="url(#arrowpink)" />
          <rect x="10" y="225" width="45" height="30" rx="4" fill="white" stroke="#e06287" strokeWidth="1" />
          <text x="32" y="244" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#801b3a">1</text>
          <text x="32" y="270" textAnchor="middle" fontSize="10" fill="#333" fontWeight="600">Length</text>
        </g>

        {/* 6. Shoulder Width Arrow (Horizontal Top) */}
        <g>
          <line x1="130" y1="75" x2="370" y2="75" stroke="#e06287" strokeWidth="2" markerStart="url(#arrowpink)" markerEnd="url(#arrowpink)" />
          <rect x="225" y="60" width="50" height="26" rx="4" fill="white" stroke="#e06287" strokeWidth="1" />
          <text x="250" y="78" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#801b3a">6 Shoulder</text>
        </g>

        {/* 8. Front Neck Depth Arrow */}
        <g>
          <line x1="250" y1="110" x2="250" y2="155" stroke="#e06287" strokeWidth="2" markerEnd="url(#arrowpink)" />
          <rect x="220" y="125" width="60" height="20" rx="4" fill="white" stroke="#e06287" strokeWidth="1" />
          <text x="250" y="139" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#801b3a">8 Front Neck</text>
        </g>

        {/* 2. Bust (Chest) Arrow */}
        <g>
          <line x1="172" y1="230" x2="328" y2="230" stroke="#e06287" strokeWidth="2" markerStart="url(#arrowpink)" markerEnd="url(#arrowpink)" />
          <rect x="210" y="217" width="80" height="24" rx="4" fill="white" stroke="#e06287" strokeWidth="1" />
          <text x="250" y="233" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#801b3a">2 Around Bust</text>
        </g>

        {/* 3. Under Bust Arrow */}
        <g>
          <line x1="172" y1="290" x2="328" y2="290" stroke="#e06287" strokeWidth="2" markerStart="url(#arrowpink)" markerEnd="url(#arrowpink)" />
          <rect x="212" y="278" width="76" height="22" rx="4" fill="white" stroke="#e06287" strokeWidth="1" />
          <text x="250" y="293" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#801b3a">3 Under Bust</text>
        </g>

        {/* 4. Waist / Bottom Band Arrow */}
        <g>
          <line x1="175" y1="360" x2="325" y2="360" stroke="#e06287" strokeWidth="2" markerStart="url(#arrowpink)" markerEnd="url(#arrowpink)" />
          <rect x="225" y="348" width="50" height="22" rx="4" fill="white" stroke="#e06287" strokeWidth="1" />
          <text x="250" y="363" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#801b3a">4 Waist</text>
        </g>

        {/* 5. Armhole Curve Marker */}
        <g>
          <path d="M 145 155 C 135 180 155 200 170 200" fill="none" stroke="#e06287" strokeWidth="2" markerEnd="url(#arrowpink)" />
          <rect x="100" y="180" width="65" height="20" rx="4" fill="white" stroke="#e06287" strokeWidth="1" />
          <text x="132" y="194" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#801b3a">5 Armhole</text>
        </g>

        {/* 7. Sleeve Length Arrow (Diagonal on Right Sleeve) */}
        <g>
          <line x1="390" y1="140" x2="430" y2="225" stroke="#e06287" strokeWidth="2" markerStart="url(#arrowpink)" markerEnd="url(#arrowpink)" />
          <rect x="415" y="170" width="78" height="22" rx="4" fill="white" stroke="#e06287" strokeWidth="1" />
          <text x="454" y="185" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#801b3a">7 Sleeve L</text>
        </g>

        {/* 9. Back Neck Deep (Corner Callout) */}
        <g>
          <rect x="330" y="110" width="95" height="22" rx="4" fill="white" stroke="#e06287" strokeWidth="1" />
          <text x="377" y="125" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#801b3a">9 Back Neck Deep</text>
        </g>
      </svg>

      <div className="mt-2 text-center text-[11px] text-[var(--text-light)]">
        चित्र के अनुसार 1 से 9 तक के नाप इंची टेप से लेकर नीचे दिए गए बॉक्स में भरें।
      </div>
    </div>
  );
}

