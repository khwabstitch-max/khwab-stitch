# 🪡 Khwab Stitch — Fashion Catalog & Assets Management Guide
*(आसानी से नया परिधान, डिज़ाइन कोड, गला, बाज़ू या लोगो जोड़ने की गाइड)*

इस पूरे प्रोजेक्ट को **100% Data-Driven** बनाया गया है। इसका अर्थ यह है कि भविष्य में जब भी आप कोई नया परिधान, डिज़ाइन कोड, गले का डिज़ाइन, बाज़ू का डिज़ाइन, या नाप का चित्र जोड़ना चाहें, तो आपको **React या JavaScript कोड में एक लाइन भी बदलने की आवश्यकता नहीं है**।

आपको केवल:
1. अपनी फ़ोटो को संबंधित फ़ोल्डर में डालना है।
2. इस `catalog/` फ़ोल्डर की संबंधित JSON फ़ाइल में एक नई एंट्री जोड़नी है।

---

## 📁 फ़ोल्डर स्ट्रक्चर (Folder Structure Overview)

```
khwabStitch/
├── catalog/                          <-- सभी डेटा फ़ाइलें यहाँ हैं (JSON)
│   ├── brand.json                    <-- ब्रांड लोगो, नाम, हेल्पलाइन, वेबसाइट
│   ├── outfits.json                  <-- उपलब्ध परिधान (कुर्ती, ब्लाउज़, सूट आदि)
│   ├── designCodes.json              <-- कैटलॉग डिज़ाइन कोड्स (K-01, B-01 आदि)
│   ├── neckFront.json                <-- आगे के गले के डिज़ाइन
│   ├── neckBack.json                 <-- पीछे के गले के डिज़ाइन
│   ├── sleeveLengths.json            <-- बाज़ू की लंबाई (Half, Full आदि)
│   ├── sleeveDesigns.json            <-- बाज़ू के प्रकार (Puff, Bell आदि)
│   ├── measurementConfigs.json       <-- हर परिधान के नाप फ़ील्ड्स व गाइड फ़ोटो
│   └── README.md                     <-- यह गाइड
│
└── public/images/                    <-- सभी फ़ोटो यहाँ हैं
    ├── brand/                        <-- लोगो फ़ाइलें (logo.jpg)
    ├── outfits/                      <-- परिधानों की फ़ोटो (01_blouse.jpg, 02_kurti.jpg...)
    ├── design_codes/                 <-- डिज़ाइन कोड फ़ोटो (K-01.jpg, B-01.jpg...)
    ├── neck_front/                   <-- आगे गले की फ़ोटो (01_round.jpg, 02_v_neck.jpg...)
    ├── neck_back/                    <-- पीछे गले की फ़ोटो (01_simple.jpg, 02_round_back.jpg...)
    ├── sleeve_lengths/               <-- बाज़ू लंबाई फ़ोटो (01_sleeveless_front.jpg...)
    ├── sleeve_designs/               <-- बाज़ू डिज़ाइन फ़ोटो (01_straight_front.jpg...)
    └── measurement_guides/           <-- नाप रेखाचित्र (measurement_guide_kurti.png...)
```

---

## 1. नया परिधान कैसे जोड़ें? (How to Add a New Outfit)
*उदाहरण: नया परिधान "Lehenga Choli" जोड़ना*

1. **फ़ोटो डालें**: `public/images/outfits/04_lehenga.jpg`
2. **`catalog/outfits.json`** खोलें और अंत में जोड़ें:
```json
{
  "id": "Lehenga",
  "en": "Lehenga Choli",
  "hi": "लहँगा चोली",
  "image": "./images/outfits/04_lehenga.jpg",
  "desc": "Traditional bridal & festive flare / पारंपरिक घेरदार लहंगा व चोली",
  "badge": "Bridal Special / शादी-विवाह",
  "popular": true,
  "designCodePrefix": "L"
}
```
3. बस! यह परिधान Step 03 में अपने आप दिखने लगेगा, उसका कोड फ़िल्टर काम करेगा, और रसीद व एडमिन में सही नाम व फ़ोटो के साथ आएगा।

---

## 2. नया डिज़ाइन कोड कैसे जोड़ें? (How to Add a New Design Code)
*उदाहरण: कुर्ती के लिए नया कोड `K-11` जोड़ना*

1. **फ़ोटो डालें**: `public/images/design_codes/K-11.jpg`
2. **`catalog/designCodes.json`** खोलें और अंत में जोड़ें:
```json
{
  "code": "K-11",
  "outfit": "Kurti",
  "name": "Velvet Zardozi Kurti",
  "hi": "वेलवेट ज़रदोज़ी कुर्ती",
  "image": "./images/design_codes/K-11.jpg",
  "tag": "Bridal Exclusive / नया",
  "details": "Royal hand zardozi work on wine velvet"
}
```
3. बस! यह डिज़ाइन कोड तुरंत Step 03 ड्रॉपडाउन में फ़ोटो और ज़ूम के साथ प्रदर्शित हो जाएगा।

---

## 3. नया गला डिज़ाइन कैसे जोड़ें? (How to Add a New Neckline)
*उदाहरण: आगे का नया गला "Halter Neck" जोड़ना*

1. **फ़ोटो डालें**: `public/images/neck_front/09_halter.jpg`
2. **`catalog/neckFront.json`** खोलें और अंत में जोड़ें:
```json
{
  "id": "halter",
  "number": 9,
  "en": "Halter Neck",
  "hi": "हॉल्टर गला",
  "hiScript": "हॉल्टर गला",
  "photo": "./images/neck_front/09_halter.jpg"
}
```
*(पीछे के गले के लिए `public/images/neck_back/` में फ़ोटो डालें और `catalog/neckBack.json` में जोड़ें)*

---

## 4. नया बाज़ू स्टाइल कैसे जोड़ें? (How to Add a New Sleeve Design)
*उदाहरण: नया बाज़ू स्टाइल "Tulip Sleeve" जोड़ना*

1. **फ़ोटो डालें**:
   - फ्रंट व्यू: `public/images/sleeve_designs/12_tulip_front.jpg`
   - साइड व्यू: `public/images/sleeve_designs/12_tulip_side.jpg`
2. **`catalog/sleeveDesigns.json`** खोलें और अंत में जोड़ें:
```json
{
  "id": "tulip",
  "number": 12,
  "en": "Tulip Sleeve",
  "hi": "ट्यूलिप बाज़ू",
  "hiScript": "ट्यूलिप बाज़ू",
  "front": "./images/sleeve_designs/12_tulip_front.jpg",
  "side": "./images/sleeve_designs/12_tulip_side.jpg"
}
```

---

## 5. नाप गाइड या रेखाचित्र कैसे बदलें / जोड़ें? (How to Extend Measurement Guide)

1. अपनी नई गाइड इमेज डालें: `public/images/measurement_guides/measurement_guide_lehenga.png`
2. **`catalog/measurementConfigs.json`** में उस परिधान की `guideImage` सेट करें:
```json
"Lehenga": {
  "guideImage": "./images/measurement_guides/measurement_guide_lehenga.png",
  "fields": [
    { "key": "choliLength", "num": 1, "en": "Choli Length", "hi": "चोली लंबाई", "hint": "Shoulder to waist", "defaultInch": "14.5", "defaultCm": "37" },
    { "key": "skirtLength", "num": 2, "en": "Lehenga Length", "hi": "लहँगा लंबाई", "hint": "Navel to floor", "defaultInch": "42", "defaultCm": "107" }
  ]
}
```

---

## 6. लोगो और ब्रांडिंग कैसे बदलें? (How to Update Logo & Brand Details)

1. अपना नया लोगो यहाँ सेव करें: `public/images/brand/logo.jpg`
2. **`catalog/brand.json`** खोलें और विवरण अपडेट करें:
```json
{
  "name": "Khwab Stitch",
  "hindiName": "ख़्वाब स्टिच",
  "tagline": "Custom Stitching · Your Style · Our Stitches / हमारी कारीगरी",
  "subTagline": "Where Fabric Becomes Art · Bespoke Atelier",
  "logo": "./images/brand/logo.jpg",
  "logoFallback": "./images/khwabstitch_logo.jpg",
  "helpline": "+91 98765 43210",
  "website": "khwabstitch.com"
}
```
बस! पूरी वेबसाइट, हेडर, फुटर, पीडीएफ रसीद और एडमिन में नया लोगो और ब्रांड जानकारी अपने आप अपडेट हो जाएगी।

