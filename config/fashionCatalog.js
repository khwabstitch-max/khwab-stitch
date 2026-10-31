/**
 * KHWAB STITCH - MASTER FASHION CATALOG & REGISTRY
 * 
 * Single Source of Truth for:
 * 1. Outfits (परिधान) -> public/images/outfits/
 * 2. Design Codes (डिज़ाइन कोड) -> public/images/design_codes/
 * 3. Front Necklines (गले का अगला डिज़ाइन) -> public/images/neck_front/
 * 4. Back Necklines (गले का पिछला डिज़ाइन) -> public/images/neck_back/
 * 5. Sleeve Lengths (बाज़ू की लंबाई) -> public/images/sleeve_lengths/
 * 6. Sleeve Designs (बाज़ू का डिज़ाइन) -> public/images/sleeve_designs/
 * 7. Measurement Configs (नाप के बिंदु)
 * 
 * 💡 TO ADD A NEW STYLE IN FUTURE:
 * Simply add a new item to the corresponding array below and place the photo
 * in the designated folder. ZERO changes needed anywhere else in the code!
 */

// =============================================================================
// 1. OUTFITS (मूल परिधान) -> public/images/outfits/
// =============================================================================
export const OUTFITS = [
  {
    id: "Blouse",
    number: 1,
    en: "Blouse (Saree / Lehenga)",
    hi: "ब्लाउज़ / चोली",
    desc: "साड़ी और लहंगे के लिए डिज़ाइनर ब्लाउज़",
    popular: true,
    badge: "🔥 Most Popular · सर्वाधिक पसंदीदा",
    image: "./images/outfits/01_blouse.jpg",
    defaultPieces: "1",
    designCodePrefix: "B",
  },
  {
    id: "Kurti",
    number: 2,
    en: "Kurti",
    hi: "कुर्ती / कुर्ती टॉप",
    desc: "स्ट्रेट, ए-लाइन व फ़ेस्टिव कुर्ती",
    popular: false,
    badge: "✨ Daily & Festive",
    image: "./images/outfits/02_kurti.jpg",
    defaultPieces: "1",
    designCodePrefix: "K",
  },
  {
    id: "Suit Upper",
    number: 3,
    en: "Suit Upper / Kameez",
    hi: "कमीज़ / सूट अपर",
    desc: "सलवार सूट व पंजाबी कमीज़ अपर",
    popular: false,
    badge: "🌸 Classic Traditional",
    image: "./images/outfits/03_suit_upper.jpg",
    defaultPieces: "1",
    designCodePrefix: "SU",
  },
];

// =============================================================================
// 2. DESIGN CODES (डिज़ाइन कोड कैटलॉग) -> public/images/design_codes/
// =============================================================================
export const DESIGN_CODES = [
  // --- BLOUSE CODES (B-...) ---
  {
    code: "B-01",
    number: 1,
    outfit: "Blouse",
    prefix: "B",
    name: "Royal Velvet Embroidered Blouse",
    hi: "रॉयल वेलवेट एम्ब्रॉयडर्ड ब्लाउज़",
    image: "./images/design_codes/B-01.jpg",
    details: "Sweetheart neckline, golden zardozi embroidery, elbow sleeves, dori back",
    tag: "Bridal & Festive / लोकप्रिय",
    popular: true,
  },
  {
    code: "B-02",
    number: 2,
    outfit: "Blouse",
    prefix: "B",
    name: "Classic Saree Designer Choli",
    hi: "क्लासिक साड़ी डिज़ाइनर चोली",
    image: "./images/design_codes/B-02.jpg",
    details: "Deep round back with tassels, fitted bust cup padding, clean finish",
    tag: "Partywear / पार्टीवियर",
    popular: false,
  },

  // --- KURTI CODES (K-...) ---
  {
    code: "K-01",
    number: 1,
    outfit: "Kurti",
    prefix: "K",
    name: "Classic Cotton Printed Kurti",
    hi: "क्लासिक कॉटन प्रिंटेड कुर्ती",
    image: "./images/design_codes/K-01.jpg",
    details: "Mandarin collar, button placket, 3/4 sleeves, straight side-slit cut",
    tag: "Studio Signature / सर्वाधिक लोकप्रिय",
    popular: true,
  },
  {
    code: "K-02",
    number: 2,
    outfit: "Kurti",
    prefix: "K",
    name: "Festive Embroidered Straight Kurti",
    hi: "फ़ेस्टिव एम्ब्रॉयडर्ड स्ट्रेट कुर्ती",
    image: "./images/design_codes/K-02.jpg",
    details: "Round neck with V-slit, quarter sleeves, elegant side-slit hem",
    tag: "Designer Choice / डिज़ाइनर पसंद",
    popular: false,
  },

  // --- SUIT UPPER CODES (SU-...) ---
  {
    code: "SU-01",
    number: 1,
    outfit: "Suit Upper",
    prefix: "SU",
    name: "Traditional Punjabi Straight Kameez",
    hi: "पारंपरिक पंजाबी स्ट्रेट कमीज़",
    image: "./images/design_codes/SU-01.jpg",
    details: "Boat neck with lace border, full sleeves, side chak open slits",
    tag: "Popular / लोकप्रिय",
    popular: true,
  },
  {
    code: "SU-02",
    number: 2,
    outfit: "Suit Upper",
    prefix: "SU",
    name: "Embroidered Festive A-Line Kameez",
    hi: "कशीदाकारी फ़ेस्टिव ए-लाइन कमीज़",
    image: "./images/design_codes/SU-02.jpg",
    details: "Mandarin collar with neck slit, quarter sleeves with border, flared hem",
    tag: "Festive / उत्सव",
    popular: false,
  },
];

// =============================================================================
// 3. FRONT NECKLINES (अगला गला) -> public/images/neck_front/
// =============================================================================
export const FRONT_NECKLINES = [
  { id: "round", number: 1, en: "Round Neck", hi: "गोल गला", hiScript: "गोल गला", photo: "./images/neck_front/01_round.jpg" },
  { id: "vneck", number: 2, en: "V-Neck", hi: "वी गला", hiScript: "वी गला", photo: "./images/neck_front/02_vneck.jpg" },
  { id: "boat", number: 3, en: "Boat Neck", hi: "नाव गला", hiScript: "नाव गला", photo: "./images/neck_front/03_boat.jpg" },
  { id: "collar", number: 4, en: "Collar Neck", hi: "कॉलर वाला", hiScript: "कॉलर वाला", photo: "./images/neck_front/04_collar.jpg" },
  { id: "square", number: 5, en: "Square Neck", hi: "चौकोर गला", hiScript: "चौकोर गला", photo: "./images/neck_front/05_square.jpg" },
  { id: "sweetheart", number: 6, en: "Sweetheart", hi: "दिल वाला गला", hiScript: "दिल वाला गला", photo: "./images/neck_front/06_sweetheart.jpg" },
  { id: "high", number: 7, en: "High Neck", hi: "बंद गला", hiScript: "बंद गला", photo: "./images/neck_front/07_high.jpg" },
  { id: "mandarin", number: 8, en: "Mandarin Collar", hi: "चाइनीज़ गला", hiScript: "चाइनीज़ गला", photo: "./images/neck_front/08_mandarin.jpg" },
];

// =============================================================================
// 4. BACK NECKLINES (पिछला गला) -> public/images/neck_back/
// =============================================================================
export const BACK_NECKLINES = [
  { id: "simple", number: 1, en: "Simple Back", hi: "सीधा बैक", hiScript: "सीधा बैक", photo: "./images/neck_back/01_simple.jpg" },
  { id: "round-back", number: 2, en: "Round Back", hi: "गोल बैक", hiScript: "गोल बैक", photo: "./images/neck_back/02_round_back.jpg" },
  { id: "v-back", number: 3, en: "V-Back", hi: "वी बैक", hiScript: "वी बैक", photo: "./images/neck_back/03_v_back.jpg" },
  { id: "square-back", number: 4, en: "Square Back", hi: "चौकोर बैक", hiScript: "चौकोर बैक", photo: "./images/neck_back/04_square_back.jpg" },
  { id: "deep", number: 5, en: "Deep Back", hi: "गहरा बैक", hiScript: "गहरा बैक", photo: "./images/neck_back/05_deep.jpg" },
  { id: "button", number: 6, en: "Button Back", hi: "बटन वाला", hiScript: "बटन वाला", photo: "./images/neck_back/06_button.jpg" },
  { id: "cutout", number: 7, en: "Cut-out Back", hi: "जाली वाला", hiScript: "जाली वाला", photo: "./images/neck_back/07_cutout.jpg" },
];

// =============================================================================
// 5. SLEEVE LENGTHS (बाज़ू की लंबाई) -> public/images/sleeve_lengths/
// =============================================================================
export const SLEEVE_LENGTHS = [
  {
    id: "sleeveless",
    number: 1,
    en: "Sleeveless",
    hi: "बिना बाज़ू",
    hiScript: "बिना बाज़ू",
    cm: "0 cm (0\")",
    desc: "Length: 0 cm · Shoulder: 38 cm",
    front: "./images/sleeve_lengths/01_sleeveless_front.jpg",
    side: "./images/sleeve_lengths/01_sleeveless_side.jpg",
  },
  {
    id: "quarter",
    number: 2,
    en: "1/4 Sleeve",
    hi: "चौथाई बाज़ू",
    hiScript: "चौथाई बाज़ू",
    cm: "10 cm (4\")",
    desc: "Length: 10 cm · Opening: 28 cm",
    front: "./images/sleeve_lengths/02_quarter_front.jpg",
    side: "./images/sleeve_lengths/02_quarter_side.jpg",
  },
  {
    id: "half",
    number: 3,
    en: "1/2 Sleeve",
    hi: "आधी बाज़ू",
    hiScript: "आधी बाज़ू",
    cm: "20 cm (7.9\")",
    desc: "Length: 20 cm · Opening: 30 cm",
    front: "./images/sleeve_lengths/03_half_front.jpg",
    side: "./images/sleeve_lengths/03_half_side.jpg",
  },
  {
    id: "three-quarter",
    number: 4,
    en: "3/4 Sleeve",
    hi: "पौनी बाज़ू",
    hiScript: "पौनी बाज़ू",
    cm: "38 cm (15\")",
    desc: "Length: 38 cm · Opening: 24 cm",
    front: "./images/sleeve_lengths/04_three_quarter_front.jpg",
    side: "./images/sleeve_lengths/04_three_quarter_side.jpg",
  },
  {
    id: "full",
    number: 5,
    en: "Full Sleeve",
    hi: "पूरी बाज़ू",
    hiScript: "पूरी बाज़ू",
    cm: "55 cm (21.7\")",
    desc: "Length: 55 cm · Opening: 22 cm",
    front: "./images/sleeve_lengths/05_full_front.jpg",
    side: "./images/sleeve_lengths/05_full_side.jpg",
  },
];

// =============================================================================
// 6. SLEEVE DESIGNS (बाज़ू का डिज़ाइन) -> public/images/sleeve_designs/
// =============================================================================
export const SLEEVE_DESIGNS = [
  {
    id: "straight",
    number: 1,
    en: "Straight Plain",
    hi: "सीधी बाज़ू",
    hiScript: "सीधी बाज़ू",
    front: "./images/sleeve_designs/01_straight_front.jpg",
    side: "./images/sleeve_designs/01_straight_side.jpg",
  },
  {
    id: "puff",
    number: 2,
    en: "Puff Sleeve",
    hi: "फूली बाज़ू",
    hiScript: "फूली बाज़ू",
    front: "./images/sleeve_designs/02_puff_front.jpg",
    side: "./images/sleeve_designs/02_puff_side.jpg",
  },
  {
    id: "bell",
    number: 3,
    en: "Bell Sleeve",
    hi: "घंटी बाज़ू",
    hiScript: "घंटी बाज़ू",
    front: "./images/sleeve_designs/03_bell_front.jpg",
    side: "./images/sleeve_designs/03_bell_side.jpg",
  },
  {
    id: "ruffle",
    number: 4,
    en: "Ruffle",
    hi: "झालर बाज़ू",
    hiScript: "झालर बाज़ू",
    front: "./images/sleeve_designs/04_ruffle_front.jpg",
    side: "./images/sleeve_designs/04_ruffle_side.jpg",
  },
  {
    id: "cap",
    number: 5,
    en: "Cap Sleeve",
    hi: "छोटी टोपी",
    hiScript: "छोटी टोपी",
    front: "./images/sleeve_designs/05_cap_front.jpg",
    side: "./images/sleeve_designs/05_cap_side.jpg",
  },
  {
    id: "bishop",
    number: 6,
    en: "Bishop Balloon",
    hi: "गुब्बारे जैसी",
    hiScript: "गुब्बारे जैसी",
    front: "./images/sleeve_designs/06_bishop_front.jpg",
    side: "./images/sleeve_designs/06_bishop_side.jpg",
  },
  {
    id: "butterfly",
    number: 7,
    en: "Butterfly",
    hi: "तितली बाज़ू",
    hiScript: "तितली बाज़ू",
    front: "./images/sleeve_designs/07_butterfly_front.jpg",
    side: "./images/sleeve_designs/07_butterfly_side.jpg",
  },
  {
    id: "cold",
    number: 8,
    en: "Cold Shoulder",
    hi: "कंधा खुला",
    hiScript: "कंधा खुला",
    front: "./images/sleeve_designs/08_cold_front.jpg",
    side: "./images/sleeve_designs/08_cold_side.jpg",
  },
  {
    id: "flutter",
    number: 9,
    en: "Flutter",
    hi: "लहर बाज़ू",
    hiScript: "लहर बाज़ू",
    front: "./images/sleeve_designs/09_flutter_front.jpg",
    side: "./images/sleeve_designs/09_flutter_side.jpg",
  },
  {
    id: "bell-cuff",
    number: 10,
    en: "Bell-Cuff",
    hi: "कफ़ वाली",
    hiScript: "कफ़ वाली",
    front: "./images/sleeve_designs/10_bell_cuff_front.jpg",
    side: "./images/sleeve_designs/10_bell_cuff_side.jpg",
  },
  {
    id: "pleated",
    number: 11,
    en: "Pleated",
    hi: "चुन्नट वाली",
    hiScript: "चुन्नट वाली",
    front: "./images/sleeve_designs/11_pleated_front.jpg",
    side: "./images/sleeve_designs/11_pleated_side.jpg",
  },
];

// =============================================================================
// 7. MEASUREMENT CONFIGURATIONS (नाप के बिंदु)
// =============================================================================
export const MEASUREMENT_CONFIGS = {
  Blouse: [
    { key: "blouseLength", num: "1", en: "Blouse Length", hi: "ब्लाउज़ लंबाई", help: "कंधे से नीचे तक (Point 1 on sketch)" },
    { key: "bust", num: "2", en: "Around Bust", hi: "छाती / चेस्ट", help: "छाती की पूरी गोलाई (Point 2 on sketch)" },
    { key: "underBust", num: "3", en: "Under Bust", hi: "छाती के नीचे (ब्रा लाइन)", help: "ब्रा लाइन की गोलाई (Point 3 on sketch)" },
    { key: "waist", num: "4", en: "Waist", hi: "कमर", help: "कमर का निचला भाग (Point 4 on sketch)" },
    { key: "armhole", num: "5", en: "Armhole", hi: "कांख / आर्महोल", help: "कांख की पूरी गोलाई (Point 5 on sketch)" },
    { key: "shoulder", num: "6", en: "Shoulder Width", hi: "कंधा चौड़ाई", help: "कंधे की चौड़ाई (Point 6 on sketch)" },
    { key: "sleeveLength", num: "7", en: "Sleeve Length", hi: "बाज़ू लंबाई", help: "कंधे से आस्तीन तक (Point 7 on sketch)" },
    { key: "frontNeck", num: "8", en: "Front Neck Depth", hi: "आगे गले की गहराई", help: "कंधे से आगे गले तक (Point 8 on sketch)" },
    { key: "backNeck", num: "9", en: "Back Neck Depth", hi: "पीछे गले की गहराई", help: "कंधे से पीछे गले तक (Point 9 on sketch)" },
  ],
  Kurti: [
    { key: "kurtiLength", num: "1", en: "Kurti Length", hi: "कुर्ती लंबाई", help: "कंधे से नीचे पूरी लंबाई (Point 1 on sketch)" },
    { key: "bust", num: "2", en: "Around Bust", hi: "छाती / चेस्ट", help: "छाती की पूरी गोलाई (Point 2 on sketch)" },
    { key: "waist", num: "3", en: "Around Above Waist", hi: "कमर की गोलाई", help: "नाभि के ऊपर कमर की गोलाई (Point 3 on sketch)" },
    { key: "hip", num: "4", en: "Around Hip", hi: "हिप की गोलाई", help: "कूल्हे / हिप की पूरी गोलाई (Point 4 on sketch)" },
    { key: "armhole", num: "5", en: "Around Armhole", hi: "आर्महोल / कांख", help: "कांख की पूरी गोलाई (Point 5 on sketch)" },
    { key: "shoulder", num: "6", en: "Shoulder Width", hi: "कंधा चौड़ाई", help: "एक कंधे से दूसरे कंधे तक (Point 6 on sketch)" },
    { key: "sleeveLength", num: "7", en: "Sleeve Length", hi: "बाज़ू लंबाई", help: "कंधे से आस्तीन तक (Point 7 on sketch)" },
    { key: "bottomOpening", num: "8", en: "Around Arm / Bottom Opening", hi: "बाज़ू की मोरी / घेर", help: "बाज़ू का निचला भाग (Point 8 on sketch)" },
    { key: "frontNeck", num: "9", en: "Front Neck Deep", hi: "आगे गले की गहराई", help: "कंधे से आगे गले की गहराई (Point 9 on sketch)" },
    { key: "backNeck", num: "10", en: "Back Neck Deep", hi: "पीछे गले की गहराई", help: "कंधे से पीछे गले की गहराई (Point 10 on sketch)" },
  ],
  "Suit Upper": [
    { key: "kameezLength", num: "1", en: "Kameez Length", hi: "कमीज़ लंबाई", help: "कंधे से नीचे तक (Point 1 on sketch)" },
    { key: "bust", num: "2", en: "Around Bust", hi: "छाती / चेस्ट", help: "छाती की पूरी गोलाई (Point 2 on sketch)" },
    { key: "waist", num: "3", en: "Around Waist", hi: "कमर", help: "कमर की गोलाई (Point 3 on sketch)" },
    { key: "hip", num: "4", en: "Around Hip", hi: "हिप की गोलाई", help: "कूल्हे / हिप की पूरी गोलाई (Point 4 on sketch)" },
    { key: "shoulder", num: "5", en: "Shoulder Width", hi: "कंधा चौड़ाई", help: "एक कंधे से दूसरे कंधे तक (Point 5 on sketch)" },
    { key: "armhole", num: "6", en: "Armhole", hi: "आर्महोल / कांख", help: "कांख की पूरी गोलाई (Point 6 on sketch)" },
    { key: "sleeveLength", num: "7", en: "Sleeve Length", hi: "बाज़ू लंबाई", help: "कंधे से आस्तीन तक (Point 7 on sketch)" },
    { key: "sleeveBottom", num: "8", en: "Sleeve Bottom (Mori)", hi: "बाज़ू मोरी", help: "बाज़ू का निचला भाग (Point 8 on sketch)" },
    { key: "frontNeck", num: "9", en: "Front Neck Deep", hi: "आगे गले की गहराई", help: "कंधे से आगे गले तक (Point 9 on sketch)" },
    { key: "backNeck", num: "10", en: "Back Neck Deep", hi: "पीछे गले की गहराई", help: "कंधे से पीछे गले तक (Point 10 on sketch)" },
  ],
};

// =============================================================================
// 8. AUTO-GENERATED LOOKUP MAPS (Zero-maintenance)
// =============================================================================
export const FRONT_NECK_PHOTOS = {
  ...Object.fromEntries(FRONT_NECKLINES.map((n) => [n.id, n.photo])),
  "as-photo": "./images/neck_front/01_round.jpg",
};

export const BACK_NECK_PHOTOS = {
  ...Object.fromEntries(BACK_NECKLINES.map((n) => [n.id, n.photo])),
  "as-photo": "./images/neck_back/01_simple.jpg",
};

export const SLEEVE_LENGTH_PHOTOS = {
  ...Object.fromEntries(SLEEVE_LENGTHS.map((s) => [s.id, { front: s.front, side: s.side, measurements: s.desc }])),
};

export const SLEEVE_DESIGN_PHOTOS = {
  ...Object.fromEntries(SLEEVE_DESIGNS.map((s) => [s.id, { front: s.front, side: s.side }])),
  "as-photo": {
    front: "./images/sleeve_designs/01_straight_front.jpg",
    side: "./images/sleeve_designs/01_straight_side.jpg",
  },
};

export const OUTFIT_PHOTOS = Object.fromEntries(
  OUTFITS.map((o) => [o.id, o.image])
);

export const DESIGN_CODE_PHOTOS = Object.fromEntries(
  DESIGN_CODES.map((d) => [d.code, d.image])
);

// Catalog maps for receipts and summary lookups
export const FRONT_NECK_MAP = {
  ...Object.fromEntries(FRONT_NECKLINES.map((n) => [n.id, n])),
  "as-photo": { en: "As per Photo", hi: "फ़ोटो जैसा गला", photo: "./images/neck_front/01_round.jpg" },
};

export const BACK_NECK_MAP = {
  ...Object.fromEntries(BACK_NECKLINES.map((n) => [n.id, n])),
  "as-photo": { en: "As per Photo", hi: "फ़ोटो जैसा बैक", photo: "./images/neck_back/01_simple.jpg" },
};

export const SLEEVE_LENGTH_MAP = Object.fromEntries(
  SLEEVE_LENGTHS.map((s) => [s.id, { ...s, photo: s.front, length: s.cm }])
);

export const SLEEVE_DESIGN_MAP = {
  ...Object.fromEntries(SLEEVE_DESIGNS.map((s) => [s.id, { ...s, photo: s.front }])),
  "as-photo": { en: "As per Photo", hi: "फ़ोटो जैसी बाज़ू", photo: "./images/sleeve_designs/01_straight_front.jpg" },
};

export const DESIGN_CODE_MAP = Object.fromEntries(
  DESIGN_CODES.map((d) => [d.code, d])
);

export const OUTFIT_MAP = Object.fromEntries(
  OUTFITS.map((o) => [o.id, { en: o.en, hi: o.hi, photo: o.image }])
);

// =============================================================================
// 9. HELPER FUNCTIONS
// =============================================================================
export const getOutfitById = (id) => OUTFITS.find((o) => o.id === id) || null;
export const getDesignByCode = (code) => DESIGN_CODES.find((d) => d.code === code) || null;
export const getDesignCodesForOutfit = (outfitId) => DESIGN_CODES.filter((d) => d.outfit === outfitId);
export const getFrontNeckById = (id) => FRONT_NECK_MAP[id] || null;
export const getBackNeckById = (id) => BACK_NECK_MAP[id] || null;
export const getSleeveLengthById = (id) => SLEEVE_LENGTH_MAP[id] || null;
export const getSleeveDesignById = (id) => SLEEVE_DESIGN_MAP[id] || null;

export const DEFAULT_SLEEVE_LENGTH_BY_OUTFIT = {
  Blouse: "half",
  Kurti: "three-quarter",
  "Suit Upper": "full",
};

export const resolveSleeveLength = (key, outfitType = "Kurti") => {
  const defaultId = DEFAULT_SLEEVE_LENGTH_BY_OUTFIT[outfitType] || "three-quarter";
  const defaultItem = SLEEVE_LENGTHS.find((s) => s.id === defaultId) || SLEEVE_LENGTHS[3];

  if (!key || String(key).trim() === "" || String(key).trim().toLowerCase() === "standard") {
    return { ...defaultItem, photo: defaultItem.front, length: defaultItem.cm };
  }

  const raw = String(key).trim();
  const k = raw.toLowerCase().replace(/[_s]+/g, "-");

  const byId = SLEEVE_LENGTHS.find((s) => s.id === k);
  if (byId) return { ...byId, photo: byId.front, length: byId.cm };

  const byName = SLEEVE_LENGTHS.find(
    (s) => s.en.toLowerCase() === raw.toLowerCase() || s.hi === raw || s.hiScript === raw
  );
  if (byName) return { ...byName, photo: byName.front, length: byName.cm };

  if (k.includes("three") || k.includes("3/4") || k.includes("pauni") || k.includes("पौनी")) {
    const item = SLEEVE_LENGTHS.find((s) => s.id === "three-quarter");
    return { ...item, photo: item.front, length: item.cm };
  }
  if (k.includes("full") || k.includes("puri") || k.includes("पूरी")) {
    const item = SLEEVE_LENGTHS.find((s) => s.id === "full");
    return { ...item, photo: item.front, length: item.cm };
  }
  if (k.includes("half") || k.includes("1/2") || k.includes("aadhi") || k.includes("आधी") || k.includes("elbow")) {
    const item = SLEEVE_LENGTHS.find((s) => s.id === "half");
    return { ...item, photo: item.front, length: item.cm };
  }
  if (k.includes("quarter") || k.includes("1/4") || k.includes("chauthai") || k.includes("चौथाई") || k.includes("short")) {
    const item = SLEEVE_LENGTHS.find((s) => s.id === "quarter");
    return { ...item, photo: item.front, length: item.cm };
  }
  if (k.includes("sleeveless") || k.includes("bina") || k.includes("बिना") || k.includes("zero") || k.includes("cut")) {
    const item = SLEEVE_LENGTHS.find((s) => s.id === "sleeveless");
    return { ...item, photo: item.front, length: item.cm };
  }

  return { ...defaultItem, photo: defaultItem.front, length: defaultItem.cm };
};

export const resolveSleeveDesign = (key, customPhoto = null, outfitType = "Kurti") => {
  if (key === "as-photo" || key === "custom") {
    return {
      id: "as-photo",
      en: "As per Photo",
      hi: "फ़ोटो जैसा",
      hiScript: "फ़ोटो जैसा",
      photo: customPhoto || "./images/sleeve_designs/01_straight_front.jpg",
    };
  }

  const defaultItem = SLEEVE_DESIGNS[0];
  if (!key || String(key).trim() === "" || String(key).trim().toLowerCase() === "standard") {
    return { ...defaultItem, photo: defaultItem.front };
  }

  const raw = String(key).trim();
  const k = raw.toLowerCase().replace(/[_s]+/g, "-");

  const byId = SLEEVE_DESIGNS.find((s) => s.id === k);
  if (byId) return { ...byId, photo: byId.front };

  const byName = SLEEVE_DESIGNS.find(
    (s) => s.en.toLowerCase() === raw.toLowerCase() || s.hi === raw || s.hiScript === raw
  );
  if (byName) return { ...byName, photo: byName.front };

  for (const s of SLEEVE_DESIGNS) {
    if (k.includes(s.id) || s.id.includes(k)) {
      return { ...s, photo: s.front };
    }
  }

  return { ...defaultItem, photo: defaultItem.front };
};

export const resolveFrontNeck = (key, customPhoto = null, outfitType = "Kurti") => {
  if (key === "as-photo" || key === "custom") {
    return {
      id: "as-photo",
      en: "As per Photo",
      hi: "फ़ोटो जैसा",
      hiScript: "फ़ोटो जैसा",
      photo: customPhoto || "./images/neck_front/01_round.jpg",
    };
  }

  const defaultItem = FRONT_NECKLINES[0];
  if (!key || String(key).trim() === "" || String(key).trim().toLowerCase() === "standard") {
    return { ...defaultItem, photo: defaultItem.photo };
  }

  const raw = String(key).trim();
  const k = raw.toLowerCase().replace(/[_s]+/g, "-");

  const byId = FRONT_NECKLINES.find((n) => n.id === k);
  if (byId) return byId;

  const byName = FRONT_NECKLINES.find(
    (n) => n.en.toLowerCase() === raw.toLowerCase() || n.hi === raw || n.hiScript === raw
  );
  if (byName) return byName;

  for (const n of FRONT_NECKLINES) {
    if (k.includes(n.id) || n.id.includes(k)) {
      return n;
    }
  }

  return defaultItem;
};

export const resolveBackNeck = (key, customPhoto = null, outfitType = "Kurti") => {
  if (key === "as-photo" || key === "custom") {
    return {
      id: "as-photo",
      en: "As per Photo",
      hi: "फ़ोटो जैसा",
      hiScript: "फ़ोटो जैसा",
      photo: customPhoto || "./images/neck_back/01_simple.jpg",
    };
  }

  const defaultItem = BACK_NECKLINES[0];
  if (!key || String(key).trim() === "" || String(key).trim().toLowerCase() === "standard") {
    return { ...defaultItem, photo: defaultItem.photo };
  }

  const raw = String(key).trim();
  const k = raw.toLowerCase().replace(/[_s]+/g, "-");

  const byId = BACK_NECKLINES.find((n) => n.id === k);
  if (byId) return byId;

  const byName = BACK_NECKLINES.find(
    (n) => n.en.toLowerCase() === raw.toLowerCase() || n.hi === raw || n.hiScript === raw
  );
  if (byName) return byName;

  for (const n of BACK_NECKLINES) {
    if (k.includes(n.id) || n.id.includes(k)) {
      return n;
    }
  }

  return defaultItem;
};
