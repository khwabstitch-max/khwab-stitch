# Khwab Stitch — How to Add New Outfits, Designs & Sleeves
### नया परिधान, डिज़ाइन कोड, गला या बाज़ू कैसे जोड़ें

Khwab Stitch का पूरा कैटलॉग अब **एक ही केंद्रीय फ़ाइल (`data/fashionCatalog.js`)** से नियंत्रित होता है। भविष्य में जब भी आपको कोई नया आइटम जोड़ना हो, तो आपको किसी भी कंपोनेंट या कोड में बदलाव करने की आवश्यकता नहीं होगी। केवल फ़ोटो संबंधित फ़ोल्डर में डालें और `data/fashionCatalog.js` में एक लाइन जोड़ें।

---

## 📁 फ़ोल्डर्स की संरचना (Folder Structure for Images)

सभी इमेज फ़ाइलें `public/images/` के अंदर अलग-अलग क्रमबद्ध (Numbered) फ़ोल्डर्स में रखी गई हैं:

| श्रेणी (Category) | फ़ोल्डर पाथ (Folder Path) | फ़ाइल नाम का नियम (Naming Example) |
|---|---|---|
| **1. मूल परिधान (Outfits)** | `public/images/outfits/` | `01_blouse.jpg`, `02_kurti.jpg`, `03_suit_upper.jpg`, `04_lehenga.jpg` |
| **2. डिज़ाइन कोड (Design Codes)** | `public/images/design_codes/` | `B-01.jpg`, `K-01.jpg`, `SU-01.jpg`, `L-01.jpg` |
| **3. अगला गला (Front Neck)** | `public/images/neck_front/` | `01_round.jpg`, `02_vneck.jpg`, `03_boat.jpg`, `09_sweetheart_deep.jpg` |
| **4. पिछला गला (Back Neck)** | `public/images/neck_back/` | `01_simple.jpg`, `02_round_back.jpg`, `08_dori_back.jpg` |
| **5. बाज़ू की लंबाई (Sleeve Lengths)** | `public/images/sleeve_lengths/` | `01_sleeveless_front.jpg`, `01_sleeveless_side.jpg` |
| **6. बाज़ू का डिज़ाइन (Sleeve Designs)** | `public/images/sleeve_designs/` | `01_straight_front.jpg`, `12_bell_mesh_front.jpg` |

---

## 🛠️ नया आइटम जोड़ने के आसान चरण (Step-by-Step Instructions)

### 1. नया परिधान जोड़ना (Add a New Outfit, e.g. Lehenga Choli):
1. फ़ोटो को `public/images/outfits/04_lehenga.jpg` में रखें।
2. `data/fashionCatalog.js` में `OUTFITS` ऐरे के अंदर जोड़ें:
```javascript
{
  id: "Lehenga",
  number: 4,
  en: "Lehenga Choli",
  hi: "लहंगा चोली",
  desc: "डिज़ाइनर ब्राइडल व पार्टीवियर लहंगा",
  popular: true,
  badge: "👑 Royal Bridal",
  image: "./images/outfits/04_lehenga.jpg",
  defaultPieces: "1",
  designCodePrefix: "L",
}
```

### 2. नया डिज़ाइन कोड जोड़ना (Add a New Design Code, e.g. K-03):
1. फ़ोटो को `public/images/design_codes/K-03.jpg` में रखें।
2. `data/fashionCatalog.js` में `DESIGN_CODES` ऐरे के अंदर जोड़ें:
```javascript
{
  code: "K-03",
  number: 3,
  outfit: "Kurti",
  prefix: "K",
  name: "Chanderi Silk Anarkali Kurti",
  hi: "चंदेरी सिल्क अनारकली कुर्ती",
  image: "./images/design_codes/K-03.jpg",
  details: "Angrakha overlap neck, full flare hem, tassel tie-up",
  tag: "Festive Collection / उत्सव",
  popular: true,
}
```

### 3. नया बाज़ू डिज़ाइन जोड़ना (Add a New Sleeve Design):
1. फ़ोटो को `public/images/sleeve_designs/12_umbrella_front.jpg` और `12_umbrella_side.jpg` में रखें।
2. `data/fashionCatalog.js` में `SLEEVE_DESIGNS` ऐरे के अंदर जोड़ें:
```javascript
{
  id: "umbrella",
  number: 12,
  en: "Umbrella Sleeve",
  hi: "अम्ब्रेला बाज़ू",
  hiScript: "अम्ब्रेला बाज़ू",
  front: "./images/sleeve_designs/12_umbrella_front.jpg",
  side: "./images/sleeve_designs/12_umbrella_side.jpg",
}
```

---

## ✨ मुख्य फ़ायदे (Key Advantages)
- **शून्य कोड संपादन (Zero Code Changes):** आपको `App.jsx`, `DesignSelectionStep`, `OrderReceiptModal`, या `DeliveryAddressStep` में कुछ भी बदलने की आवश्यकता नहीं है।
- **स्वतः सिंक (Auto Sync):** नया डिज़ाइन तुरंत कस्टमर विज़ार्ड, एडमिन डैशबोर्ड, रसीद (PDF/Print) और WhatsApp समरी में स्वतः दिखने लगता है।
- **साफ़ नामकरण (Clean Numbered Names):** सभी फ़ोटो नंबर के साथ हैं, जिससे भविष्य में खोजना और व्यवस्थित रखना बेहद आसान है।
