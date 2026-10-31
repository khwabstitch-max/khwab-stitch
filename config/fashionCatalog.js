/**
 * KHWAB STITCH - MASTER FASHION CATALOG REGISTRY
 * 
 * 100% Data-Driven Architecture:
 * All catalog items (outfits, design codes, necklines, sleeves, measurements, brand)
 * are cleanly configured in the `/catalog/*.json` files.
 * 
 * 💡 TO ADD A NEW ITEM IN THE FUTURE:
 * 1. Place the image in `public/images/<folder>/`
 * 2. Add an entry in the matching `catalog/<name>.json` file
 * That's it! ZERO changes needed in any React or JSX file.
 */

import brandData from "../catalog/brand.json";
import outfitsData from "../catalog/outfits.json";
import designCodesData from "../catalog/designCodes.json";
import neckFrontData from "../catalog/neckFront.json";
import neckBackData from "../catalog/neckBack.json";
import sleeveLengthsData from "../catalog/sleeveLengths.json";
import sleeveDesignsData from "../catalog/sleeveDesigns.json";
import measurementConfigsData from "../catalog/measurementConfigs.json";

// 1. BRAND CONFIG
export const BRAND_CONFIG = brandData;

// 2. CORE CATALOG DATA ARRAYS
export const OUTFITS = outfitsData;
export const DESIGN_CODES = designCodesData;
export const FRONT_NECKLINES = neckFrontData;
export const BACK_NECKLINES = neckBackData;
export const SLEEVE_LENGTHS = sleeveLengthsData;
export const SLEEVE_DESIGNS = sleeveDesignsData;

// 3. MEASUREMENT CONFIGS & GUIDE IMAGES
export const MEASUREMENT_CONFIGS = Object.fromEntries(
  Object.entries(measurementConfigsData).map(([key, data]) => {
    const fields = Array.isArray(data) ? data : (data.fields || []);
    fields.guideImage = data.guideImage || "./images/measurement_guides/measurement_guide_kurti.png";
    return [key, fields];
  })
);

export const MEASUREMENT_GUIDES = Object.fromEntries(
  Object.entries(measurementConfigsData).map(([key, data]) => [
    key,
    Array.isArray(data) ? "./images/measurement_guides/measurement_guide_kurti.png" : (data.guideImage || "./images/measurement_guides/measurement_guide_kurti.png"),
  ])
);

// 4. PHOTO LOOKUP MAPS
export const FRONT_NECK_PHOTOS = Object.fromEntries(
  FRONT_NECKLINES.map((n) => [n.id, n.photo])
);

export const BACK_NECK_PHOTOS = Object.fromEntries(
  BACK_NECKLINES.map((n) => [n.id, n.photo])
);

export const SLEEVE_LENGTH_PHOTOS = Object.fromEntries(
  SLEEVE_LENGTHS.map((s) => [s.id, { front: s.front, side: s.side }])
);

export const SLEEVE_DESIGN_PHOTOS = Object.fromEntries(
  SLEEVE_DESIGNS.map((s) => [s.id, { front: s.front, side: s.side }])
);

export const OUTFIT_PHOTOS = Object.fromEntries(
  OUTFITS.map((o) => [o.id, o.image])
);

export const DESIGN_CODE_PHOTOS = Object.fromEntries(
  DESIGN_CODES.map((d) => [d.code, d.image])
);

// 5. DICTIONARY MAPS FOR FAST O(1) LOOKUPS
export const FRONT_NECK_MAP = Object.fromEntries(
  FRONT_NECKLINES.map((n) => [n.id, n])
);

export const BACK_NECK_MAP = Object.fromEntries(
  BACK_NECKLINES.map((n) => [n.id, n])
);

export const SLEEVE_LENGTH_MAP = Object.fromEntries(
  SLEEVE_LENGTHS.map((s) => [s.id, s])
);

export const SLEEVE_DESIGN_MAP = Object.fromEntries(
  SLEEVE_DESIGNS.map((s) => [s.id, s])
);

export const DESIGN_CODE_MAP = Object.fromEntries(
  DESIGN_CODES.map((d) => [d.code, d])
);

export const OUTFIT_MAP = Object.fromEntries(
  OUTFITS.map((o) => [o.id, o])
);

// 6. HELPER FINDERS
export const getOutfitById = (id) => OUTFIT_MAP[id] || null;
export const getDesignByCode = (code) => DESIGN_CODE_MAP[code] || null;
export const getDesignCodesForOutfit = (outfitId) =>
  DESIGN_CODES.filter((d) => d.outfit === outfitId);
export const getFrontNeckById = (id) => FRONT_NECK_MAP[id] || null;
export const getBackNeckById = (id) => BACK_NECK_MAP[id] || null;
export const getSleeveLengthById = (id) => SLEEVE_LENGTH_MAP[id] || null;
export const getSleeveDesignById = (id) => SLEEVE_DESIGN_MAP[id] || null;

export const DEFAULT_SLEEVE_LENGTH_BY_OUTFIT = Object.fromEntries(
  OUTFITS.map((o) => [o.id, "full"])
);

// 7. ROBUST RESOLVER UTILITIES (ENSURING ZERO BLANK PHOTOS ACROSS ALL DEVICES)
export const resolveOutfit = (outfitType) => {
  if (!outfitType) return OUTFITS[1] || OUTFITS[0];
  const found = OUTFIT_MAP[outfitType];
  if (found) return found;
  const match = OUTFITS.find(
    (o) => o.id.toLowerCase() === String(outfitType).toLowerCase() || o.en.toLowerCase() === String(outfitType).toLowerCase()
  );
  return match || OUTFITS[1] || OUTFITS[0];
};

export const resolveSleeveLength = (key, outfitType = "Kurti") => {
  const defaultItem = SLEEVE_LENGTHS.find((s) => s.id === "full") || SLEEVE_LENGTHS[4] || SLEEVE_LENGTHS[0];

  if (!key || String(key).trim() === "" || String(key).trim().toLowerCase() === "standard") {
    return { ...defaultItem, photo: defaultItem.front, length: defaultItem.cm };
  }

  const raw = String(key).trim();
  const k = raw.toLowerCase().replace(/[_s]+/g, "-");

  const byId = SLEEVE_LENGTH_MAP[k];
  if (byId) return { ...byId, photo: byId.front, length: byId.cm };

  const byName = SLEEVE_LENGTHS.find(
    (s) => s.en.toLowerCase() === raw.toLowerCase() || s.hi === raw || s.hiScript === raw
  );
  if (byName) return { ...byName, photo: byName.front, length: byName.cm };

  if (k.includes("full") || k.includes("puri") || k.includes("पूरी")) {
    const item = SLEEVE_LENGTHS.find((s) => s.id === "full");
    if (item) return { ...item, photo: item.front, length: item.cm };
  }
  if (k.includes("three") || k.includes("3/4") || k.includes("pauni") || k.includes("पौनी")) {
    const item = SLEEVE_LENGTHS.find((s) => s.id === "three-quarter");
    if (item) return { ...item, photo: item.front, length: item.cm };
  }
  if (k.includes("half") || k.includes("1/2") || k.includes("aadhi") || k.includes("आधी") || k.includes("elbow")) {
    const item = SLEEVE_LENGTHS.find((s) => s.id === "half");
    if (item) return { ...item, photo: item.front, length: item.cm };
  }
  if (k.includes("quarter") || k.includes("1/4") || k.includes("chauthai") || k.includes("चौथाई") || k.includes("short")) {
    const item = SLEEVE_LENGTHS.find((s) => s.id === "quarter");
    if (item) return { ...item, photo: item.front, length: item.cm };
  }
  if (k.includes("sleeveless") || k.includes("bina") || k.includes("बिना") || k.includes("zero") || k.includes("cut")) {
    const item = SLEEVE_LENGTHS.find((s) => s.id === "sleeveless");
    if (item) return { ...item, photo: item.front, length: item.cm };
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

  const byId = SLEEVE_DESIGN_MAP[k];
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

  const byId = FRONT_NECK_MAP[k];
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

  const byId = BACK_NECK_MAP[k];
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
