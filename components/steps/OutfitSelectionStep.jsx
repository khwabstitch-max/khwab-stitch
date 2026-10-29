import { useState, useRef } from "react";
import { Check, Wand2, UploadCloud, Camera, Trash2, RefreshCw, Eye, X } from "lucide-react";

const REFERENCE_OPTIONS = [
  { value: "I have the photo (Upload Design Photo)", label: "I have the photo / मेरे पास फ़ोटो है (Upload Photo)" },
  { value: "As per design selection", label: "Design selection / अगले स्टेप में डिज़ाइन चुनूँगी" },
  { value: "WhatsApp karungi", label: "Send on WhatsApp / फ़ोटो वॉट्सऐप पर भेजूँगी" },
  { value: "Mujhe guidance chahiye", label: "Need guidance / मास्टर जी से सलाह चाहिए" },
  { value: "No reference", label: "No reference photo / कोई रेफ़रेंस फ़ोटो नहीं" },
];

export default function OutfitSelectionStep({ outfitTypes, outfit, setOutfit, selectOutfit, selectionError }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [compressing, setCompressing] = useState(false);

  // Compress and convert image file to high-efficiency dataURL
  const handleFileProcess = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file (JPG, PNG, WEBP) / कृपया इमेज फ़ाइल ही चुनें।");
      return;
    }

    setCompressing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        try {
          const maxDimension = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.82);
          const sizeKb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);

          setOutfit((prev) => ({
            ...prev,
            refPhoto: "I have the photo (Upload Design Photo)",
            uploadedPhoto: compressedDataUrl,
            uploadedPhotoName: file.name,
            uploadedPhotoSize: `${sizeKb} KB`,
          }));
        } catch (err) {
          console.error("Image processing error:", err);
          setOutfit((prev) => ({
            ...prev,
            refPhoto: "I have the photo (Upload Design Photo)",
            uploadedPhoto: e.target.result,
            uploadedPhotoName: file.name,
            uploadedPhotoSize: `${Math.round(file.size / 1024)} KB`,
          }));
        } finally {
          setCompressing(false);
        }
      };
      img.onerror = () => {
        setCompressing(false);
        alert("Could not load image / इमेज लोड नहीं हो सकी, कृपया दूसरी फ़ोटो आज़माएं।");
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];
    if (file) handleFileProcess(file);
    event.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFileProcess(file);
  };

  const removePhoto = () => {
    setOutfit((prev) => ({
      ...prev,
      uploadedPhoto: "",
      uploadedPhotoName: "",
      uploadedPhotoSize: "",
      refPhoto: "As per design selection",
    }));
  };

  const isUploadMode = outfit.refPhoto === "I have the photo (Upload Design Photo)" || !!outfit.uploadedPhoto;

  return (
    <section className="step-card rounded-[28px] border bg-white p-6 md:p-8">
      {/* Header */}
      <div className="mb-7 flex items-center gap-3">
        <span className="step-icon"><Wand2 size={18} /></span>
        <div>
          <p className="step-eyebrow">STEP 03 · YOUR OUTFIT / आपका परिधान</p>
          <h2 className="text-[25px] font-semibold">What shall we stitch? / क्या सिलवाना चाहते हैं?</h2>
          <p className="text-[13px] text-[var(--text-light)]">
            Choose an outfit to see the right design and measurement options / सही डिज़ाइन और नाप के विकल्प देखने के लिए परिधान चुनें।
          </p>
        </div>
      </div>

      {/* Outfit Cards (3 Options) */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {outfitTypes.map((item) => {
          const selected = outfit.type === item.id;
          return (
            <button
              type="button"
              key={item.id}
              aria-pressed={selected}
              onClick={() => selectOutfit(item.id)}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 text-left transition-all duration-200 bg-white ${
                selected
                  ? "border-[var(--primary)] ring-4 ring-[var(--primary)]/15 shadow-lg transform -translate-y-1"
                  : "border-[#e9ddd3] hover:border-[var(--primary)]/50 hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              {/* Image Container */}
              <div className="relative h-56 w-full overflow-hidden bg-[#f7efdf]">
                <img
                  src={item.image}
                  alt={item.en}
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Badge */}
                {item.badge && (
                  <span
                    className={`absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-md backdrop-blur-sm ${
                      item.popular
                        ? "bg-[var(--primary)] text-white"
                        : "bg-white/95 text-[var(--text)] border border-[var(--border)]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Selection Checkmark */}
                <span
                  className={`absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full transition-all shadow-md ${
                    selected
                      ? "bg-[var(--primary)] text-white ring-2 ring-white"
                      : "bg-white/80 text-transparent border border-gray-300"
                  }`}
                >
                  <Check size={15} strokeWidth={3} />
                </span>
              </div>

              {/* Content Details */}
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <h3 className="font-serif text-[16px] font-bold text-[var(--primary-dark)] group-hover:text-[var(--primary)] transition-colors">
                    {item.en} / {item.hi}
                  </h3>
                  <p className="mt-1 text-[12px] text-[var(--text-light)] leading-snug">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f2e9e2]">
                  <span
                    className={`flex items-center justify-center gap-1.5 w-full rounded-xl py-2 text-[12px] font-bold transition-all ${
                      selected
                        ? "bg-[var(--primary)] text-white shadow-sm"
                        : "bg-[var(--primary-light)] text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white"
                    }`}
                  >
                    {selected ? (
                      <>
                        <Check size={14} strokeWidth={3} /> Selected / चयनित
                      </>
                    ) : (
                      "Select Outfit / चुनें"
                    )}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectionError && <p role="alert" className="mt-3 text-[13px] text-red-600 font-semibold">{selectionError}</p>}

      {/* Outfit Configuration Fields */}
      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <label className="form-field">
          <span>Number of pieces / कपड़ों की संख्या</span>
          <select value={outfit.pieces} onChange={(event) => setOutfit({ ...outfit, pieces: event.target.value })}>
            {["1", "2", "3", "4", "5+"].map((piece) => <option key={piece}>{piece}</option>)}
          </select>
        </label>

        <label className="form-field">
          <span>Design code / डिज़ाइन कोड <small className="text-[11px] font-normal text-stone-500">(Optional / वैकल्पिक)</small></span>
          <input
            value={outfit.designCode}
            onChange={(event) => setOutfit({ ...outfit, designCode: event.target.value })}
            placeholder="e.g. K-01 / जैसे K-01"
          />
        </label>

        {/* Reference Photo Selection */}
        <label className="form-field md:col-span-2">
          <div className="flex items-center justify-between">
            <span className="font-bold">Reference photo / डिज़ाइन रेफ़रेंस</span>
            {outfit.uploadedPhoto && (
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <Check size={13} strokeWidth={3} /> Photo uploaded / फ़ोटो अपलोड हो गई
              </span>
            )}
          </div>
          <select
            value={outfit.refPhoto}
            onChange={(event) => {
              const val = event.target.value;
              setOutfit({ ...outfit, refPhoto: val });
              if (val === "I have the photo (Upload Design Photo)" && !outfit.uploadedPhoto) {
                setTimeout(() => fileInputRef.current?.click(), 100);
              }
            }}
            className="font-medium"
          >
            {REFERENCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>

        {/* PHOTO UPLOAD & PREVIEW AREA */}
        <div className="md:col-span-2">
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInputChange}
          />

          {outfit.uploadedPhoto ? (
            /* Uploaded Photo Preview Card */
            <div className="rounded-2xl border-2 border-[var(--primary)] bg-[var(--card-bg)] p-4 sm:p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Clickable Thumbnail */}
                  <div
                    onClick={() => setModalImage(outfit.uploadedPhoto)}
                    className="group/thumb relative h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border border-[var(--border)] bg-stone-100 shadow-inner"
                    title="Click to view full size / बड़ी देखने के लिए क्लिक करें"
                  >
                    <img
                      src={outfit.uploadedPhoto}
                      alt="Uploaded reference"
                      className="h-full w-full object-cover transition-transform group-hover/thumb:scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover/thumb:opacity-100">
                      <Eye size={18} className="text-white" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                        <Check size={12} strokeWidth={3} /> Photo Attached / फ़ोटो जुड़ गई
                      </span>
                      {outfit.uploadedPhotoSize && (
                        <span className="text-[11px] text-[var(--text-light)]">
                          {outfit.uploadedPhotoSize}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-semibold text-[14px] text-[var(--text)] line-clamp-1">
                      {outfit.uploadedPhotoName || "Design Reference Photo"}
                    </p>
                    <p className="text-[12px] text-[var(--text-light)]">
                      This photo will be shown to the boutique master during stitching / यह फ़ोटो सिलाई के समय बुटीक मास्टर जी को दिखाई जाएगी।
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex w-full sm:w-auto items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalImage(outfit.uploadedPhoto)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] bg-white px-3.5 py-2 text-[12px] font-semibold text-[var(--text)] hover:bg-stone-50 transition-colors shadow-sm"
                  >
                    <Eye size={14} /> Full View / बड़ी देखें
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--primary)] bg-[var(--primary-light)] px-3.5 py-2 text-[12px] font-semibold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors"
                  >
                    <RefreshCw size={13} /> Change / बदलें
                  </button>
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    title="Remove Photo / फ़ोटो हटाएं"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ) : isUploadMode ? (
            /* Dropzone / Upload Prompt Box */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                isDragging
                  ? "border-[var(--primary)] bg-[var(--primary-light)]/40 scale-[1.01]"
                  : "border-[var(--primary)]/40 bg-[var(--primary-light)]/15 hover:border-[var(--primary)] hover:bg-[var(--primary-light)]/30"
              }`}
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] shadow-sm">
                {compressing ? (
                  <RefreshCw size={24} className="animate-spin" />
                ) : (
                  <UploadCloud size={26} />
                )}
              </div>

              <h4 className="mt-3 font-semibold text-[15px] text-[var(--primary-dark)]">
                {compressing
                  ? "Processing photo... / फ़ोटो तैयार हो रही है..."
                  : "Upload your design photo / अपनी पसंद की फ़ोटो अपलोड करें"}
              </h4>
              <p className="mt-1 text-[12px] text-[var(--text-light)]">
                Click to browse or take a photo / क्लिक करके गैलरी या कैमरे से फ़ोटो चुनें (JPG, PNG, WEBP)
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[12px] font-bold text-[var(--primary)] border border-[var(--border)] shadow-sm">
                <Camera size={14} /> Choose Photo / फ़ोटो चुनें
              </div>
            </div>
          ) : (
            /* Helper prompt if another option is selected */
            <div className="flex items-center justify-between rounded-xl border border-dashed border-[#e3d7cf] bg-[#fbf9f6] px-4 py-2.5 text-[12px] text-[var(--text-light)]">
              <span>Do you have a design photo? / क्या आपके पास डिज़ाइन की फ़ोटो है?</span>
              <button
                type="button"
                onClick={() => {
                  setOutfit((prev) => ({ ...prev, refPhoto: "I have the photo (Upload Design Photo)" }));
                  setTimeout(() => fileInputRef.current?.click(), 100);
                }}
                className="font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1"
              >
                <Camera size={13} /> Upload Photo / फ़ोटो अपलोड करें
              </button>
            </div>
          )}
        </div>

        {/* Special Requests */}
        <label className="form-field md:col-span-2">
          <span>Special requests / कोई विशेष निर्देश <small className="text-[11px] font-normal text-stone-500">(Optional / वैकल्पिक)</small></span>
          <textarea
            value={outfit.specialReq}
            onChange={(event) => setOutfit({ ...outfit, specialReq: event.target.value })}
            placeholder="Latkan, piping, border, deep gala, or finishing details / लटकन, पाइपिंग, बॉर्डर, या कोई विशेष काम..."
            rows={3}
          />
        </label>
      </div>

      {/* FULL PHOTO LIGHTBOX MODAL */}
      {modalImage && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setModalImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-[560px] overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-4 py-3 bg-stone-50">
              <span className="font-bold text-[14px] text-[var(--text)]">Design Reference Photo / डिज़ाइन रेफ़रेंस फ़ोटो</span>
              <button
                type="button"
                onClick={() => setModalImage(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-200 text-stone-700 hover:bg-stone-300"
              >
                <X size={16} />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto bg-stone-950 p-2 flex items-center justify-center">
              <img
                src={modalImage}
                alt="Design Reference full view"
                className="max-h-[70vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
