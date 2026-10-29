import React from "react";

// Color palette matching the Khwab Stitch natural beige cotton tailoring studio
const FABRIC_BASE = "#f7f2eb";
const FABRIC_BORDER = "#ded3c6";
const FABRIC_SHADOW = "#ece3d7";
const STITCH_COLOR = "#b29b87";
const SKIN_TONE = "#eeddcb";
const SKIN_SHADOW = "#dfc8b3";
const ACCENT_GOLD = "#c29b61";

export default function DesignArt({ type, id, view = "front", className = "" }) {
  // 1. FRONT NECKLINE ILLUSTRATIONS
  if (type === "neckFront") {
    return (
      <svg viewBox="0 0 100 100" className={`w-full h-full ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#faf7f2" rx="10" />
        {/* Subtle fabric weave texture lines */}
        <path d="M0,0 L100,100 M20,0 L100,80 M0,20 L80,100" stroke="#f0e9df" strokeWidth="0.5" strokeDasharray="1,4" />

        {/* Mannequin neck and collarbone */}
        <path d="M42,12 L42,32 C42,38 46,42 50,42 C54,42 58,38 58,32 L58,12 Z" fill={SKIN_TONE} />
        <path d="M42,28 C45,34 55,34 58,28" stroke={SKIN_SHADOW} strokeWidth="1" />
        <path d="M44,40 Q50,44 56,40" stroke={SKIN_SHADOW} strokeWidth="0.8" />

        {/* Garment Shoulders & Torso */}
        <path d="M12,62 L28,34 L40,32 C40,32 50,32 50,32 C50,32 60,32 60,32 L72,34 L88,62 L82,96 L18,96 Z" fill={FABRIC_BASE} stroke={FABRIC_BORDER} strokeWidth="1.2" />

        {/* Tailored seam lines on bust */}
        <path d="M30,96 Q32,70 38,52" stroke={STITCH_COLOR} strokeWidth="0.7" strokeDasharray="2,2" />
        <path d="M70,96 Q68,70 62,52" stroke={STITCH_COLOR} strokeWidth="0.7" strokeDasharray="2,2" />

        {/* Specific Neckline Cuts */}
        {id === "round" && (
          <>
            <path d="M38,32 Q50,60 62,32" fill={SKIN_TONE} stroke={FABRIC_BORDER} strokeWidth="1.5" />
            <path d="M36,33 Q50,64 64,33" stroke={STITCH_COLOR} strokeWidth="0.9" strokeDasharray="2,2" />
          </>
        )}

        {id === "vneck" && (
          <>
            <path d="M38,32 L50,62 L62,32" fill={SKIN_TONE} stroke={FABRIC_BORDER} strokeWidth="1.5" />
            <path d="M36,33 L50,66 L64,33" stroke={STITCH_COLOR} strokeWidth="0.9" strokeDasharray="2,2" />
          </>
        )}

        {id === "boat" && (
          <>
            <path d="M30,32 Q50,43 70,32" fill={SKIN_TONE} stroke={FABRIC_BORDER} strokeWidth="1.5" />
            <path d="M29,34 Q50,46 71,34" stroke={STITCH_COLOR} strokeWidth="0.9" strokeDasharray="2,2" />
          </>
        )}

        {id === "square" && (
          <>
            <path d="M38,32 L38,56 L62,56 L62,32" fill={SKIN_TONE} stroke={FABRIC_BORDER} strokeWidth="1.5" />
            <path d="M36,33 L36,58 L64,58 L64,33" stroke={STITCH_COLOR} strokeWidth="0.9" strokeDasharray="2,2" />
          </>
        )}

        {id === "sweetheart" && (
          <>
            <path d="M38,32 Q44,48 48,50 L50,60 L52,50 Q56,48 62,32" fill={SKIN_TONE} stroke={FABRIC_BORDER} strokeWidth="1.5" />
            <path d="M36,33 Q43,50 47,52 L50,63 L53,52 Q57,50 64,33" stroke={STITCH_COLOR} strokeWidth="0.9" strokeDasharray="2,2" />
          </>
        )}

        {id === "collar" && (
          <>
            <path d="M40,32 L50,54 L60,32" fill={SKIN_TONE} />
            <path d="M40,32 L48,46 L38,44 Z" fill="#fffdfa" stroke={FABRIC_BORDER} strokeWidth="1.2" />
            <path d="M60,32 L52,46 L62,44 Z" fill="#fffdfa" stroke={FABRIC_BORDER} strokeWidth="1.2" />
            <path d="M50,54 L50,96" stroke={FABRIC_BORDER} strokeWidth="1.2" />
            <circle cx="50" cy="62" r="1.3" fill={STITCH_COLOR} />
            <circle cx="50" cy="72" r="1.3" fill={STITCH_COLOR} />
            <circle cx="50" cy="82" r="1.3" fill={STITCH_COLOR} />
          </>
        )}

        {id === "high" && (
          <>
            <path d="M40,24 L60,24 L60,34 L40,34 Z" fill={FABRIC_BASE} stroke={FABRIC_BORDER} strokeWidth="1.2" />
            <path d="M41,26 L59,26" stroke={STITCH_COLOR} strokeWidth="0.8" strokeDasharray="2,2" />
            <path d="M41,32 L59,32" stroke={STITCH_COLOR} strokeWidth="0.8" strokeDasharray="2,2" />
            <circle cx="50" cy="29" r="1.2" fill={ACCENT_GOLD} />
          </>
        )}

        {id === "mandarin" && (
          <>
            <path d="M40,24 L48,24 L48,34 L40,34 Z" fill={FABRIC_BASE} stroke={FABRIC_BORDER} strokeWidth="1.2" />
            <path d="M52,24 L60,24 L60,34 L52,34 Z" fill={FABRIC_BASE} stroke={FABRIC_BORDER} strokeWidth="1.2" />
            <path d="M48,34 L50,52 L52,34" fill={SKIN_TONE} stroke={FABRIC_BORDER} strokeWidth="1" />
            <path d="M50,52 L50,96" stroke={FABRIC_BORDER} strokeWidth="1.2" />
          </>
        )}
      </svg>
    );
  }

  // 2. BACK NECKLINE ILLUSTRATIONS
  if (type === "neckBack") {
    return (
      <svg viewBox="0 0 100 100" className={`w-full h-full ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#faf7f2" rx="10" />
        <path d="M0,0 L100,100 M20,0 L100,80 M0,20 L80,100" stroke="#f0e9df" strokeWidth="0.5" strokeDasharray="1,4" />

        {/* Back of mannequin neck */}
        <path d="M43,12 L43,32 C43,38 46,40 50,40 C54,40 57,38 57,32 L57,12 Z" fill={SKIN_TONE} />
        {/* Subtle spine line */}
        <path d="M50,30 L50,88" stroke={SKIN_SHADOW} strokeWidth="0.8" strokeDasharray="3,3" />

        {/* Garment Shoulders & Back Torso */}
        <path d="M12,62 L28,34 L40,32 C40,32 50,32 50,32 C50,32 60,32 60,32 L72,34 L88,62 L82,96 L18,96 Z" fill={FABRIC_BASE} stroke={FABRIC_BORDER} strokeWidth="1.2" />

        {/* Back dart seam lines */}
        <path d="M34,96 L36,60" stroke={STITCH_COLOR} strokeWidth="0.7" strokeDasharray="2,2" />
        <path d="M66,96 L64,60" stroke={STITCH_COLOR} strokeWidth="0.7" strokeDasharray="2,2" />

        {/* Specific Back Cuts */}
        {id === "simple" && (
          <>
            <path d="M38,32 Q50,42 62,32" fill={SKIN_TONE} stroke={FABRIC_BORDER} strokeWidth="1.5" />
            <path d="M37,34 Q50,45 63,34" stroke={STITCH_COLOR} strokeWidth="0.9" strokeDasharray="2,2" />
          </>
        )}

        {id === "round-back" && (
          <>
            <path d="M38,32 Q50,68 62,32" fill={SKIN_TONE} stroke={FABRIC_BORDER} strokeWidth="1.5" />
            <path d="M36,34 Q50,71 64,34" stroke={STITCH_COLOR} strokeWidth="0.9" strokeDasharray="2,2" />
          </>
        )}

        {id === "v-back" && (
          <>
            <path d="M38,32 L50,68 L62,32" fill={SKIN_TONE} stroke={FABRIC_BORDER} strokeWidth="1.5" />
            <path d="M36,33 L50,71 L64,33" stroke={STITCH_COLOR} strokeWidth="0.9" strokeDasharray="2,2" />
          </>
        )}

        {id === "square-back" && (
          <>
            <path d="M38,32 L38,64 L62,64 L62,32" fill={SKIN_TONE} stroke={FABRIC_BORDER} strokeWidth="1.5" />
            <path d="M36,33 L36,66 L64,66 L64,33" stroke={STITCH_COLOR} strokeWidth="0.9" strokeDasharray="2,2" />
          </>
        )}

        {id === "deep" && (
          <>
            <path d="M36,32 Q50,82 64,32" fill={SKIN_TONE} stroke={FABRIC_BORDER} strokeWidth="1.5" />
            <path d="M34,33 Q50,85 66,33" stroke={STITCH_COLOR} strokeWidth="0.9" strokeDasharray="2,2" />
            {/* Dori cord & Latkan bells */}
            <path d="M36,36 Q50,42 64,36" stroke={ACCENT_GOLD} strokeWidth="1.2" />
            <path d="M48,40 Q46,55 45,62" stroke={ACCENT_GOLD} strokeWidth="0.9" />
            <path d="M52,40 Q54,55 55,62" stroke={ACCENT_GOLD} strokeWidth="0.9" />
            <polygon points="43,62 47,62 45,66" fill={ACCENT_GOLD} />
            <polygon points="53,62 57,62 55,66" fill={ACCENT_GOLD} />
          </>
        )}

        {id === "button" && (
          <>
            <path d="M38,32 Q50,42 62,32" fill={SKIN_TONE} stroke={FABRIC_BORDER} strokeWidth="1.5" />
            <path d="M50,42 L50,96" stroke={FABRIC_BORDER} strokeWidth="1.5" />
            {[48, 56, 64, 72, 80, 88].map((y) => (
              <circle key={y} cx="50" cy={y} r="2" fill="#fff" stroke={STITCH_COLOR} strokeWidth="0.8" />
            ))}
          </>
        )}

        {id === "cutout" && (
          <>
            <path d="M40,32 Q50,40 60,32" fill={SKIN_TONE} stroke={FABRIC_BORDER} strokeWidth="1.2" />
            {/* Teardrop cutout window */}
            <path d="M50,44 C41,44 41,68 50,74 C59,68 59,44 50,44 Z" fill={SKIN_TONE} stroke={FABRIC_BORDER} strokeWidth="1.4" />
            {/* Tie bow at top */}
            <circle cx="50" cy="40" r="1.5" fill={ACCENT_GOLD} />
            <path d="M50,74 L50,86" stroke={ACCENT_GOLD} strokeWidth="0.8" />
            <polygon points="48,86 52,86 50,90" fill={ACCENT_GOLD} />
          </>
        )}

        {id === "as-photo" && (
          <>
            <rect x="30" y="38" width="40" height="32" rx="4" fill="#fffdfa" stroke={FABRIC_BORDER} strokeWidth="1.2" />
            <circle cx="50" cy="54" r="7" stroke={STITCH_COLOR} strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="62" cy="45" r="2" fill={ACCENT_GOLD} />
            <text x="50" y="80" textAnchor="middle" fontSize="7" fill={STITCH_COLOR} fontWeight="bold">AS PER PHOTO</text>
          </>
        )}
      </svg>
    );
  }

  // 3. SLEEVE LENGTH ILLUSTRATIONS (FRONT VIEW vs SIDE VIEW)
  if (type === "sleeveLength") {
    const isSide = view === "side";
    const lengthMap = {
      sleeveless: { y: 35, cm: "0cm" },
      quarter: { y: 48, cm: "10cm" },
      half: { y: 62, cm: "20cm" },
      "three-quarter": { y: 78, cm: "38cm" },
      full: { y: 92, cm: "55cm" },
    };
    const sleeve = lengthMap[id] || lengthMap.half;

    if (isSide) {
      // SIDE VIEW: Arm seen from side profile with sleeve hem & measurements
      return (
        <svg viewBox="0 0 100 100" className={`w-full h-full ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="#faf7f2" rx="10" />
          <path d="M0,0 L100,100 M20,0 L100,80 M0,20 L80,100" stroke="#f0e9df" strokeWidth="0.5" strokeDasharray="1,4" />

          {/* Side view shoulder & arm */}
          <path d="M42,12 Q48,16 52,24 Q56,36 54,60 Q52,80 50,96" stroke={SKIN_SHADOW} strokeWidth="1" strokeDasharray="2,2" />
          <path d="M34,26 Q54,18 64,28 Q68,44 65,65 Q62,84 57,96 L45,96 Q46,80 44,65 Q42,44 34,26 Z" fill={SKIN_TONE} stroke={SKIN_SHADOW} strokeWidth="1" />

          {/* Side View Garment Shoulder & Sleeve */}
          <path d="M22,30 Q36,20 54,20 Q64,22 68,30" stroke={FABRIC_BORDER} strokeWidth="1.5" />
          <path d="M22,30 Q36,20 54,20 Q64,22 68,30 L67,35 L22,42 Z" fill={FABRIC_BASE} />

          {id !== "sleeveless" ? (
            <>
              {/* Sleeve fabric extending down to sleeve.y */}
              <path
                d={`M24,35 Q44,22 66,32 L${56 + (sleeve.y > 60 ? 4 : 8)},${sleeve.y} L${42 - (sleeve.y > 60 ? 1 : 3)},${sleeve.y} Z`}
                fill={FABRIC_BASE}
                stroke={FABRIC_BORDER}
                strokeWidth="1.3"
              />
              {/* Embroidered hem stitching */}
              <line x1={42 - (sleeve.y > 60 ? 1 : 3)} y1={sleeve.y - 2} x2={56 + (sleeve.y > 60 ? 4 : 8)} y2={sleeve.y - 2} stroke={STITCH_COLOR} strokeWidth="1" strokeDasharray="2,2" />
              <line x1={42 - (sleeve.y > 60 ? 1 : 3)} y1={sleeve.y} x2={56 + (sleeve.y > 60 ? 4 : 8)} y2={sleeve.y} stroke={FABRIC_BORDER} strokeWidth="1.2" />
            </>
          ) : (
            // Sleeveless armhole piping
            <path d="M32,24 Q52,18 64,28 Q56,40 46,38 Z" fill={FABRIC_BASE} stroke={FABRIC_BORDER} strokeWidth="1.2" />
          )}

          {/* Side Indicator Marker */}
          <rect x="74" y="8" width="22" height="13" rx="4" fill="#ede5db" />
          <text x="85" y="17" textAnchor="middle" fontSize="6.5" fill="#7d6a5c" fontWeight="bold">SIDE</text>
          {/* Measurement Indicator badge */}
          <text x="85" y="90" textAnchor="middle" fontSize="8" fill="var(--primary)" fontWeight="bold">{sleeve.cm}</text>
        </svg>
      );
    }

    // FRONT VIEW: Mannequin torso & arm seen from front
    return (
      <svg viewBox="0 0 100 100" className={`w-full h-full ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#faf7f2" rx="10" />
        <path d="M0,0 L100,100 M20,0 L100,80 M0,20 L80,100" stroke="#f0e9df" strokeWidth="0.5" strokeDasharray="1,4" />

        {/* Torso & Arm Skin */}
        <path d="M62,32 Q72,50 74,70 Q75,85 73,96 L63,96 Q65,80 63,65 L56,48 Z" fill={SKIN_TONE} stroke={SKIN_SHADOW} strokeWidth="1" />
        <path d="M18,96 L18,50 L34,34 L56,32 L56,96 Z" fill={FABRIC_BASE} stroke={FABRIC_BORDER} strokeWidth="1.2" />

        {/* Sleeve on right arm */}
        {id !== "sleeveless" ? (
          <>
            <path
              d={`M46,32 L60,34 L${64 + (sleeve.y > 60 ? 4 : 7)},${sleeve.y} L${48 + (sleeve.y > 60 ? 7 : 6)},${sleeve.y} Z`}
              fill={FABRIC_BASE}
              stroke={FABRIC_BORDER}
              strokeWidth="1.3"
            />
            <line x1={48 + (sleeve.y > 60 ? 7 : 6)} y1={sleeve.y - 2} x2={64 + (sleeve.y > 60 ? 4 : 7)} y2={sleeve.y - 2} stroke={STITCH_COLOR} strokeWidth="0.9" strokeDasharray="2,2" />
            <line x1={48 + (sleeve.y > 60 ? 7 : 6)} y1={sleeve.y} x2={64 + (sleeve.y > 60 ? 4 : 7)} y2={sleeve.y} stroke={FABRIC_BORDER} strokeWidth="1.2" />
          </>
        ) : (
          <path d="M46,32 L58,34 Q54,46 48,46 Z" fill={FABRIC_BASE} stroke={FABRIC_BORDER} strokeWidth="1.2" />
        )}

        {/* Front Indicator Marker */}
        <rect x="70" y="8" width="26" height="13" rx="4" fill="#ede5db" />
        <text x="83" y="17" textAnchor="middle" fontSize="6.5" fill="#7d6a5c" fontWeight="bold">FRONT</text>
        <text x="83" y="90" textAnchor="middle" fontSize="8" fill="var(--primary)" fontWeight="bold">{sleeve.cm}</text>
      </svg>
    );
  }

  // 4. SLEEVE DESIGN ILLUSTRATIONS (FRONT VIEW vs SIDE VIEW)
  if (type === "sleeveDesign") {
    const isSide = view === "side";

    // Check if we have cropped studio photo for this sleeve
    const photoMap = {
      straight: "/images/sleeves/straight_side.jpg",
      puff: "/images/sleeves/puff_front.jpg",
      bell: "/images/sleeves/bell_front.jpg",
      ruffle: "/images/sleeves/ruffle_side.jpg",
      bishop: "/images/sleeves/bishop_side.jpg",
      cap: "/images/sleeves/cap_side.jpg",
      butterfly: "/images/sleeves/butterfly_side.jpg",
      cold: "/images/sleeves/cold_side.jpg",
    };

    // If viewing side and photo exists, or viewing front, let's render either real studio photo or tailored vector illustration!
    return (
      <div className="relative w-full h-full overflow-hidden rounded-xl bg-[#faf7f2] flex items-center justify-center">
        {/* Render Vector Illustration with Beige Fabric Tailoring Details */}
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="#faf7f2" />
          <path d="M0,0 L100,100 M20,0 L100,80 M0,20 L80,100" stroke="#f0e9df" strokeWidth="0.5" strokeDasharray="1,4" />

          {/* Base Mannequin Arm */}
          <path d="M45,20 Q56,18 64,28 Q66,50 63,70 Q60,86 56,96 L44,96 Q46,75 44,55 Q43,35 36,25 Z" fill={SKIN_TONE} stroke={SKIN_SHADOW} strokeWidth="1" />

          {/* Shoulder Top */}
          <path d="M26,26 Q42,16 64,22" stroke={FABRIC_BORDER} strokeWidth="1.5" />

          {/* 1. Straight Plain */}
          {id === "straight" && (
            <>
              <path d={isSide ? "M30,26 L64,24 L60,84 L40,84 Z" : "M34,26 L66,28 L62,84 L42,84 Z"} fill={FABRIC_BASE} stroke={FABRIC_BORDER} strokeWidth="1.3" />
              <line x1="40" y1="80" x2="60" y2="80" stroke={STITCH_COLOR} strokeWidth="1" strokeDasharray="2,2" />
              {/* Subtle floral cuff embroidery */}
              <circle cx="50" cy="76" r="1.5" fill={ACCENT_GOLD} />
              <path d="M46,76 Q50,73 54,76" stroke={ACCENT_GOLD} strokeWidth="0.6" />
            </>
          )}

          {/* 2. Puff Sleeve */}
          {id === "puff" && (
            <>
              {isSide ? (
                <path d="M30,26 C18,34 16,56 34,60 L62,58 C78,54 78,32 64,24 Z" fill={FABRIC_BASE} stroke={FABRIC_BORDER} strokeWidth="1.3" />
              ) : (
                <path d="M34,26 C20,35 20,55 36,60 L60,60 C76,55 76,35 62,26 Z" fill={FABRIC_BASE} stroke={FABRIC_BORDER} strokeWidth="1.3" />
              )}
              {/* Puff Gathers at Shoulder & Cuff */}
              <path d="M36,28 Q48,34 60,28" stroke={STITCH_COLOR} strokeWidth="0.8" strokeDasharray="2,1" />
              {/* Fitted Cuff band */}
              <rect x="36" y="58" width="24" height="6" rx="1.5" fill="#fffdfa" stroke={FABRIC_BORDER} strokeWidth="1.1" />
              <circle cx="48" cy="61" r="1" fill={ACCENT_GOLD} />
            </>
          )}

          {/* 3. Bell Sleeve */}
          {id === "bell" && (
            <>
              {/* Upper arm straight */}
              <path d="M32,25 L64,24 L61,50 L42,50 Z" fill={FABRIC_BASE} stroke={FABRIC_BORDER} strokeWidth="1.2" />
              {/* Flared Bell from elbow downwards */}
              <path d={isSide ? "M42,50 Q22,76 16,84 Q50,86 78,84 Q72,74 61,50 Z" : "M42,50 Q24,76 18,84 Q50,86 82,84 Q76,74 61,50 Z"} fill={FABRIC_BASE} stroke={FABRIC_BORDER} strokeWidth="1.3" />
              {/* Scalloped embroidered hem */}
              <path d="M18,84 Q26,82 34,84 Q42,82 50,84 Q58,82 66,84 Q74,82 82,84" stroke={ACCENT_GOLD} strokeWidth="1" />
            </>
          )}

          {/* 4. Ruffle Frill */}
          {id === "ruffle" && (
            <>
              <path d="M32,25 L64,24 L62,44 L41,44 Z" fill={FABRIC_BASE} stroke={FABRIC_BORDER} strokeWidth="1.2" />
              {/* Tier 1 frill */}
              <path d="M38,44 Q28,58 24,62 Q50,65 74,62 Q70,56 64,44 Z" fill={FABRIC_BASE} stroke={FABRIC_BORDER} strokeWidth="1.2" />
              {/* Tier 2 frill */}
              <path d="M34,58 Q24,72 20,76 Q50,79 78,76 Q74,70 68,58 Z" fill={FABRIC_BASE} stroke={FABRIC_BORDER} strokeWidth="1.2" />
              {/* Tier 3 frill */}
              <path d="M30,72 Q20,86 16,90 Q50,93 82,90 Q78,84 72,72 Z" fill={FABRIC_BASE} stroke={FABRIC_BORDER} strokeWidth="1.2" />
            </>
          )}

          {/* 5. Bishop Balloon */}
          {id === "bishop" && (
            <>
              {/* Long billowing sleeve gathered into tight wrist cuff */}
              <path d="M32,25 Q18,52 24,78 L42,82 L58,82 Q78,76 64,24 Z" fill={FABRIC_BASE} stroke={FABRIC_BORDER} strokeWidth="1.3" />
              <path d="M30,78 Q50,84 64,78" stroke={STITCH_COLOR} strokeWidth="0.8" strokeDasharray="2,1" />
              {/* Tailored wrist cuff with button */}
              <rect x="42" y="80" width="16" height="8" rx="1.5" fill="#fffdfa" stroke={FABRIC_BORDER} strokeWidth="1.2" />
              <circle cx="50" cy="84" r="1.2" fill={ACCENT_GOLD} />
            </>
          )}

          {/* 6. Cap Sleeve */}
          {id === "cap" && (
            <>
              {/* Short delicate cap curved over shoulder */}
              <path d={isSide ? "M30,24 Q48,16 66,22 Q68,36 54,42 Q40,40 30,24 Z" : "M32,24 Q50,18 68,24 Q66,38 52,42 Q38,40 32,24 Z"} fill={FABRIC_BASE} stroke={FABRIC_BORDER} strokeWidth="1.3" />
              <path d="M34,36 Q50,42 64,36" stroke={STITCH_COLOR} strokeWidth="0.8" strokeDasharray="2,2" />
              {/* Delicate embroidery border */}
              <circle cx="50" cy="38" r="1" fill={ACCENT_GOLD} />
            </>
          )}

          {/* 7. Butterfly Sleeve */}
          {id === "butterfly" && (
            <>
              {/* Flared wing-like drape */}
              <path d={isSide ? "M32,24 Q48,16 66,22 Q86,45 80,68 Q54,64 36,52 Z" : "M32,24 Q50,18 68,24 Q86,46 82,70 Q52,66 34,50 Z"} fill={FABRIC_BASE} stroke={FABRIC_BORDER} strokeWidth="1.3" />
              <path d="M36,50 Q60,65 80,68" stroke={ACCENT_GOLD} strokeWidth="1" strokeDasharray="3,1" />
            </>
          )}

          {/* 8. Cold Shoulder */}
          {id === "cold" && (
            <>
              {/* Sleeve with oval cutout exposing shoulder skin */}
              <path d="M32,25 L64,24 L60,74 L40,74 Z" fill={FABRIC_BASE} stroke={FABRIC_BORDER} strokeWidth="1.3" />
              {/* Cutout exposing skin */}
              <ellipse cx="50" cy="38" rx="9" ry="7" fill={SKIN_TONE} stroke={FABRIC_BORDER} strokeWidth="1.2" />
              <ellipse cx="50" cy="38" rx="10.5" ry="8.5" stroke={STITCH_COLOR} strokeWidth="0.7" strokeDasharray="2,2" />
              <line x1="40" y1="70" x2="60" y2="70" stroke={STITCH_COLOR} strokeWidth="0.9" strokeDasharray="2,2" />
            </>
          )}

        </svg>
      </div>
    );
  }

  return null;
}
