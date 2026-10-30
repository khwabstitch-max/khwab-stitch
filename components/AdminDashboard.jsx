import React, { useState, useEffect } from "react";
import {
  Download,
  RefreshCw,
  Search,
  Trash2,
  Eye,
  FileText,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
  Scissors,
  CheckCircle2,
  Clock,
  Layers,
  ExternalLink,
  MessageCircle,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Ruler,
  Tag,
  Check,
} from "lucide-react";

const STATUS_PIPELINE = [
  { key: "New", label: "New / नया", bg: "bg-blue-100 text-blue-800 border-blue-200" },
  { key: "Cutting", label: "In Cutting / कटिंग जारी", bg: "bg-amber-100 text-amber-800 border-amber-200" },
  { key: "Stitching", label: "Stitching / सिलाई जारी", bg: "bg-purple-100 text-purple-800 border-purple-200" },
  { key: "Ready", label: "Ready / तैयार", bg: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  { key: "Delivered", label: "Delivered / सुपुर्द", bg: "bg-stone-100 text-stone-700 border-stone-300" },
];

function parseWhatsAppOrder(text) {
  if (!text || typeof text !== "string") return null;

  const orderIdMatch = text.match(/#?([A-Z0-9]{6,16})/i);
  const nameMatch = text.match(/(?:Customer|Name|नाम)[:\s*]+([^\n(]+)/i);
  const phoneMatch =
    text.match(/(?:WhatsApp|Phone|फ़ोन|Mobile)[:\s*]+([0-9+\s-]{10,15})/i) ||
    text.match(/\(?(\+?[0-9]{10,13})\)?/);
  const outfitMatch = text.match(/(?:Outfit|परिधान|Dress)[:\s*]+([^\n(]+)/i);
  const addressMatch = text.match(/(?:Delivery Address|Address|पता)[:\s*]+([^\n]+)/i);

  // Extract measurements if present
  const measurementsValues = {};
  const measureKeys = [
    "chest",
    "waist",
    "hips",
    "length",
    "shoulder",
    "armhole",
    "sleeveLength",
    "sleeveRound",
    "frontNeckDepth",
    "backNeckDepth",
    "bustPoint",
    "bottomLength",
    "thigh",
    "knee",
    "bottomOpening",
  ];
  measureKeys.forEach((key) => {
    const rx = new RegExp(`(?:${key})[:\\s*]+([0-9.]+)`, "i");
    const m = text.match(rx);
    if (m) measurementsValues[key] = m[1];
  });

  const parsedOutfit = (outfitMatch ? outfitMatch[1].trim() : "") || "Blouse";
  const parsedName = (nameMatch ? nameMatch[1].trim() : "") || "Customer";
  const parsedPhone = (phoneMatch ? phoneMatch[1].trim() : "") || "";
  const parsedAddress = (addressMatch ? addressMatch[1].trim() : "") || "";
  const orderId = orderIdMatch
    ? orderIdMatch[1].replace("#", "")
    : `KS${Date.now().toString(36).toUpperCase()}`;

  return {
    orderId,
    status: "New",
    createdAt: new Date().toISOString(),
    customer: {
      name: parsedName,
      whatsapp: parsedPhone,
      email: "",
      address: parsedAddress,
      landmark: "",
      cityState: "",
      pin: "",
    },
    outfit: {
      type: parsedOutfit,
      pieces: "1",
      uploadedPhoto: "",
      uploadedPhotoName: "",
    },
    design: {
      neckFront: "Standard",
      neckBack: "Standard",
      sleeveLength: "Standard",
      fit: "Fitted",
      additionalInstructions: "Imported via Atelier Hub",
    },
    measurements: {
      unit: "inch",
      provideMethod: Object.keys(measurementsValues).length > 0 ? "custom" : "sample",
      values: measurementsValues,
    },
    delivery: {
      deliveryType: "Standard Delivery (5-7 Days)",
      address: parsedAddress,
      landmark: "",
    },
  };
}

export default function AdminDashboard({
  orders = [],
  adminToken,
  onRefresh,
  onSaveOrder,
  onDeleteOrder,
  onExportCsv,
  onOpenReceipt,
  onOpenLightbox,
  onSwitchToCustomer,
  onLogout,
  adminBusy,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOutfit, setSelectedOutfit] = useState("All");
  const [onlyWithPhoto, setOnlyWithPhoto] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [expandedMeasurements, setExpandedMeasurements] = useState({});
  const [showImportModal, setShowImportModal] = useState(false);
  const [importTab, setImportTab] = useState("whatsapp"); // 'whatsapp' | 'manual'
  const [whatsappText, setWhatsappText] = useState("");
  const [manualForm, setManualForm] = useState({
    orderId: "",
    name: "",
    whatsapp: "",
    outfit: "Blouse",
    pieces: "1",
    chest: "",
    waist: "",
    length: "",
    address: "",
    notes: "",
  });

  // Auto-refresh polling for real-time live incoming orders
  useEffect(() => {
    if (!autoRefresh || !adminToken) return;
    const interval = setInterval(() => {
      if (onRefresh) onRefresh(adminToken);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, adminToken, onRefresh]);

  // Toggle measurements expansion
  const toggleMeasurements = (orderId) => {
    setExpandedMeasurements((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Advance or change order status
  const cycleStatus = (order) => {
    if (!onSaveOrder) return;
    const current = order.status || "New";
    const currentIndex = STATUS_PIPELINE.findIndex((s) => s.key === current);
    const nextIndex = (currentIndex + 1) % STATUS_PIPELINE.length;
    const nextStatus = STATUS_PIPELINE[nextIndex].key;
    const updated = { ...order, status: nextStatus };
    onSaveOrder(updated);
  };

  // Handle WhatsApp import
  const handleImportWhatsApp = (e) => {
    e.preventDefault();
    if (!whatsappText.trim()) return;
    const parsed = parseWhatsAppOrder(whatsappText);
    if (!parsed) {
      alert("Could not parse order details. Please check the text.");
      return;
    }
    if (onSaveOrder) {
      onSaveOrder(parsed);
      setWhatsappText("");
      setShowImportModal(false);
      alert(`Order #${parsed.orderId} successfully imported! / ऑर्डर जोड़ दिया गया!`);
    }
  };

  // Handle Manual Form submit
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualForm.name.trim() || !manualForm.whatsapp.trim()) {
      alert("Please enter customer name and WhatsApp number.");
      return;
    }

    const orderId = manualForm.orderId?.trim() ? manualForm.orderId.trim().toUpperCase() : `KS${Date.now().toString(36).toUpperCase()}`;
    const newOrder = {
      orderId,
      status: "New",
      createdAt: new Date().toISOString(),
      customer: {
        name: manualForm.name.trim(),
        whatsapp: manualForm.whatsapp.trim(),
        email: "",
        address: manualForm.address.trim(),
        landmark: "",
        cityState: "",
        pin: "",
      },
      outfit: {
        type: manualForm.outfit,
        pieces: manualForm.pieces || "1",
        uploadedPhoto: "",
        uploadedPhotoName: "",
      },
      design: {
        neckFront: "Standard",
        neckBack: "Standard",
        sleeveLength: "Standard",
        fit: "Fitted",
        additionalInstructions: manualForm.notes.trim() || "Manual walk-in order",
      },
      measurements: {
        unit: "inch",
        provideMethod:
          manualForm.chest || manualForm.waist ? "custom" : "sample",
        values: {
          ...(manualForm.chest ? { chest: manualForm.chest } : {}),
          ...(manualForm.waist ? { waist: manualForm.waist } : {}),
          ...(manualForm.length ? { length: manualForm.length } : {}),
        },
      },
      delivery: {
        deliveryType: "Standard Delivery (5-7 Days)",
        address: manualForm.address.trim(),
        landmark: "",
      },
    };

    if (onSaveOrder) {
      onSaveOrder(newOrder);
      setManualForm({
        orderId: "",
        name: "",
        whatsapp: "",
        outfit: "Blouse",
        pieces: "1",
        chest: "",
        waist: "",
        length: "",
        address: "",
        notes: "",
      });
      setShowImportModal(false);
      alert(`Order #${orderId} saved successfully! / नया ऑर्डर जोड़ दिया गया!`);
    }
  };

  // Filter orders safely
  const validOrders = (orders || []).filter(
    (o) => o && typeof o === "object" && o.orderId
  );

  const filteredOrders = validOrders.filter((o) => {
    const s = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !s ||
      o.orderId?.toLowerCase().includes(s) ||
      o.customer?.name?.toLowerCase().includes(s) ||
      o.customer?.whatsapp?.includes(s) ||
      o.customer?.cityState?.toLowerCase().includes(s);

    const matchesOutfit =
      selectedOutfit === "All" || o.outfit?.type === selectedOutfit;

    const matchesPhoto = !onlyWithPhoto || Boolean(o.outfit?.uploadedPhoto);

    return matchesSearch && matchesOutfit && matchesPhoto;
  });

  const photoOrdersCount = validOrders.filter((o) =>
    Boolean(o.outfit?.uploadedPhoto)
  ).length;

  return (
    <div className="space-y-6">
      {/* ATELIER TOP HERO BAR */}
      <section className="rounded-[28px] border border-[#ebdcd0] bg-gradient-to-br from-[#4e2433] via-[#652d42] to-[#7d3652] text-white p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/15">
          <div className="flex items-center gap-3.5">
            <div className="relative flex-shrink-0">
              <img
                src="./images/khwabstitch_logo.jpg"
                alt="Khwab Stitch Logo"
                className="h-14 w-14 rounded-full object-cover border-2 border-[#f5d7b5] shadow-md"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#f5d7b5] bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                  Atelier Live Hub
                </span>
                <span className="flex items-center gap-1 text-[11.5px] text-emerald-300 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync Active
                </span>
              </div>
              <h2 className="font-serif text-[24px] sm:text-[27px] font-bold mt-1 text-white leading-tight">
                Master Tailor Dashboard / कारीगर ऑर्डर पोर्टल
              </h2>
            </div>
          </div>

          {/* TOP ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowImportModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-400 hover:bg-emerald-300 text-stone-950 text-[12.5px] font-extrabold shadow-md transition-transform hover:scale-102"
              title="Add or import customer order"
            >
              <Plus size={15} />
              <span>+ Add / Import Order / नया ऑर्डर</span>
            </button>

            <button
              type="button"
              onClick={() => onRefresh && onRefresh(adminToken)}
              disabled={adminBusy}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-[12px] font-bold backdrop-blur-sm border border-white/20 transition-colors"
              title="Refresh Orders / ऑर्डर ताज़ा करें"
            >
              <RefreshCw size={13} className={adminBusy ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={onExportCsv}
              disabled={adminBusy || validOrders.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#f4e2d2] hover:bg-white text-[var(--primary-dark)] text-[12px] font-bold shadow transition-colors"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={onSwitchToCustomer}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-[12px] font-bold border border-white/25 transition-colors"
            >
              <span>Customer View</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white text-[11.5px] font-medium transition-colors"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="rounded-2xl bg-white/10 border border-white/15 p-4 backdrop-blur-xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">
              Total Orders / कुल ऑर्डर
            </p>
            <p className="font-serif text-[28px] font-bold mt-1 text-white">
              {validOrders.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 border border-white/15 p-4 backdrop-blur-xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">
              With Photo / फ़ोटो संलग्न
            </p>
            <p className="font-serif text-[28px] font-bold mt-1 text-emerald-300">
              {photoOrdersCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 border border-white/15 p-4 backdrop-blur-xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">
              Blouse Orders / ब्लाउज़
            </p>
            <p className="font-serif text-[28px] font-bold mt-1 text-rose-200">
              {validOrders.filter((o) => o.outfit?.type === "Blouse").length}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 border border-white/15 p-4 backdrop-blur-xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">
              Kurti / Suits / कुर्ती व सूट
            </p>
            <p className="font-serif text-[28px] font-bold mt-1 text-amber-200">
              {
                validOrders.filter((o) =>
                  ["Kurti", "Suit Upper", "Top", "Tunic"].includes(
                    o.outfit?.type
                  )
                ).length
              }
            </p>
          </div>
        </div>
      </section>

      {/* FILTER & SEARCH BAR */}
      <section className="rounded-2xl border border-[#ebdcd0] bg-white p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, phone, order ID, city... (ऑर्डर खोजें)"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-[13px] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)] transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {["All", "Blouse", "Kurti", "Suit Upper"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedOutfit(tab)}
                className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all ${
                  selectedOutfit === tab
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {tab === "All" ? "All / सभी" : tab}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setOnlyWithPhoto(!onlyWithPhoto)}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all border ${
                onlyWithPhoto
                  ? "bg-emerald-700 text-white border-emerald-800 shadow-xs"
                  : "bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50"
              }`}
            >
              📷 Photo Only {onlyWithPhoto && "✓"}
            </button>
          </div>
        </div>
      </section>

      {/* ORDERS LIST */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-serif text-[17px] font-bold text-[var(--primary-dark)]">
            Incoming Tailoring Orders / आने वाले ऑर्डर ({filteredOrders.length})
          </h3>
          <span className="text-[12px] text-stone-500 font-medium">
            Showing {filteredOrders.length} of {validOrders.length} orders
          </span>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#e6dacd] bg-white p-12 text-center text-stone-500">
            <span className="text-[44px]">🧵</span>
            <h4 className="font-serif text-[18px] font-bold text-stone-700 mt-2">
              No matching orders found / कोई ऑर्डर नहीं मिला
            </h4>
            <p className="text-[13px] text-stone-500 mt-1 max-w-[420px] mx-auto">
              Customer orders placed on the website will appear here automatically. You can also click "+ Add / Import Order" above to add walk-in orders.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOrders.map((order) => {
              const deliveryAddress =
                order.delivery?.address ||
                order.customer?.address ||
                "Address in slip";
              const landmark =
                order.delivery?.landmark || order.customer?.landmark || "";
              const hasPhoto = Boolean(order.outfit?.uploadedPhoto);
              const isUrgent =
                order.delivery?.deliveryType?.toLowerCase().includes("urgent") ||
                order.delivery?.deliveryType?.toLowerCase().includes("48");

              const whatsappClean = (order.customer?.whatsapp || "").replace(
                /\D/g,
                ""
              );
              const whatsappUrl = `https://wa.me/91${whatsappClean}?text=${encodeURIComponent(
                `Namaste ${order.customer?.name || "Customer"} ji, we received your order #${order.orderId} for ${order.outfit?.type} at Khwab Stitch Boutique!`
              )}`;

              const currentStatus = order.status || "New";
              const currentStatusCfg =
                STATUS_PIPELINE.find((s) => s.key === currentStatus) ||
                STATUS_PIPELINE[0];

              const isExpanded = Boolean(expandedMeasurements[order.orderId]);
              const measureVals = order.measurements?.values || {};
              const hasMeasurements = Object.keys(measureVals).length > 0;

              return (
                <div
                  key={order.orderId}
                  className="rounded-[24px] border border-[#ebdcd0] bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* CARD TOP BAR */}
                    <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#f0e7df]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[14px] font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-lg border border-stone-200">
                            #{order.orderId}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                              order.outfit?.type === "Blouse"
                                ? "bg-[#fbe9ee] text-[#8e2e4b]"
                                : order.outfit?.type === "Kurti"
                                ? "bg-[#e8f3ee] text-[#2b7152]"
                                : "bg-[#f8f0e5] text-[#8c572b]"
                            }`}
                          >
                            {order.outfit?.type} × {order.outfit?.pieces || 1}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
                          <Calendar size={11} />
                          {new Date(order.createdAt || Date.now()).toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* CLICKABLE STATUS PILL */}
                        <button
                          type="button"
                          onClick={() => cycleStatus(order)}
                          className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border shadow-2xs transition-all hover:opacity-85 ${currentStatusCfg.bg}`}
                          title="Click to advance order status / स्थिति बदलें"
                        >
                          {currentStatusCfg.label}
                        </button>

                        {isUrgent && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-red-100 text-red-800 px-2 py-0.5 rounded-md border border-red-200">
                            ⚡ Urgent
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CUSTOMER & DELIVERY INFO */}
                    <div className="mt-3.5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[15px] text-stone-900">
                          {order.customer?.name}
                        </span>
                        {/* 1-Click WhatsApp Button */}
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300 transition-colors"
                          title="Open WhatsApp chat with customer"
                        >
                          <MessageCircle size={13} className="text-emerald-600" />
                          Chat / वॉट्सऐप
                        </a>
                      </div>

                      <p className="text-[12.5px] text-stone-600 flex items-center gap-1.5">
                        <Phone size={12} className="text-stone-400" />
                        <span>{order.customer?.whatsapp}</span>
                      </p>

                      <div className="rounded-xl bg-[#faf7f2] p-2.5 border border-[#ede3d8] text-[12px] text-stone-700 leading-snug">
                        <div className="flex items-start gap-1.5">
                          <MapPin
                            size={13}
                            className="text-[var(--primary)] flex-shrink-0 mt-0.5"
                          />
                          <div>
                            <span className="font-medium">{deliveryAddress}</span>
                            {landmark && (
                              <span className="block text-stone-500 text-[11px]">
                                Landmark: {landmark}
                              </span>
                            )}
                            <span className="block text-stone-800 font-semibold text-[11.5px] mt-0.5">
                              {order.customer?.cityState}
                              {order.customer?.pin && ` — PIN: ${order.customer?.pin}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DESIGN CHOICES BREAKDOWN */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11.5px]">
                      <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                        <span className="text-[10px] text-stone-500 font-bold uppercase block">
                          Necklines
                        </span>
                        <span className="font-semibold text-stone-800 truncate block">
                          F: {order.design?.neckFront || "Classic"}
                        </span>
                        <span className="text-stone-600 truncate block">
                          B: {order.design?.neckBack || "Classic"}
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                        <span className="text-[10px] text-stone-500 font-bold uppercase block">
                          Sleeves & Fit
                        </span>
                        <span className="font-semibold text-stone-800 truncate block">
                          {order.design?.sleeveLength || "Standard"}
                        </span>
                        <span className="text-stone-600 truncate block">
                          {order.design?.sleeveDesign || "Straight"} ·{" "}
                          {order.design?.fit || "Fitted"}
                        </span>
                      </div>
                    </div>

                    {order.design?.additionalInstructions && (
                      <p className="mt-2 text-[11px] text-stone-600 bg-[#faf7f2] p-1.5 rounded-md border border-[#eee2d6] italic">
                        Note: {order.design.additionalInstructions}
                      </p>
                    )}

                    {/* CUSTOMER REFERENCE PHOTO (IF ATTACHED) */}
                    {hasPhoto && (
                      <div className="mt-3 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-3">
                        <img
                          src={order.outfit.uploadedPhoto}
                          alt="Customer ref"
                          className="h-14 w-14 rounded-lg object-cover border border-emerald-300 cursor-pointer hover:opacity-90 flex-shrink-0 shadow-xs"
                          onClick={() =>
                            onOpenLightbox({
                              open: true,
                              image: order.outfit.uploadedPhoto,
                              title: `Order #${order.orderId} Design Photo`,
                              subtitle: `${order.customer?.name} · ${order.outfit?.type}`,
                            })
                          }
                          title="Click to view full photo / बड़ी फ़ोटो देखें"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="inline-block text-[10px] font-bold text-emerald-800 bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                            ✓ Design Photo Attached
                          </span>
                          <p className="text-[11.5px] font-medium text-stone-800 truncate mt-0.5">
                            {order.outfit.uploadedPhotoName || "reference.jpg"}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              onOpenLightbox({
                                open: true,
                                image: order.outfit.uploadedPhoto,
                                title: `Order #${order.orderId} Design Photo`,
                                subtitle: `${order.customer?.name} · ${order.outfit?.type}`,
                              })
                            }
                            className="text-[11px] font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1 mt-0.5"
                          >
                            <Eye size={12} /> View Full Photo
                          </button>
                        </div>
                      </div>
                    )}

                    {/* EXPANDABLE MEASUREMENTS SECTION */}
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => toggleMeasurements(order.orderId)}
                        className="w-full flex items-center justify-between p-2 rounded-xl bg-[#f8f5f0] hover:bg-[#f1eae2] border border-[#e8ded2] text-[12px] font-bold text-stone-800 transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <Ruler size={13} className="text-[var(--primary)]" />
                          <span>Measurements & Fit / शारीरिक नाप</span>
                        </span>
                        {isExpanded ? (
                          <ChevronUp size={15} />
                        ) : (
                          <ChevronDown size={15} />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="mt-2 p-3 rounded-xl bg-white border border-[#e5d9cd] text-[12px]">
                          <div className="flex items-center justify-between pb-1.5 border-b border-stone-200 mb-2">
                            <span className="font-semibold text-stone-600">
                              Method: {order.measurements?.provideMethod || "Standard"}
                            </span>
                            <span className="font-bold text-[var(--primary)] uppercase text-[11px]">
                              Unit: {order.measurements?.unit || "inch"}
                            </span>
                          </div>

                          {hasMeasurements ? (
                            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                              {Object.entries(measureVals).map(([k, v]) => (
                                <div
                                  key={k}
                                  className="flex items-center justify-between py-0.5 border-b border-stone-100"
                                >
                                  <span className="capitalize text-stone-600 text-[11.5px]">
                                    {k.replace(/([A-Z])/g, " $1")}:
                                  </span>
                                  <span className="font-bold text-stone-900 text-[12px]">
                                    {v} {order.measurements?.unit || '"'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="py-2 text-center text-stone-600">
                              <span className="text-[20px] block mb-1">📦</span>
                              <p className="font-medium text-[12px]">
                                Customer selected: Courier Sample Garment / पुराना नाप कूरियर करेंगे
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CARD ACTIONS FOOTER */}
                  <div className="mt-4 pt-3 border-t border-[#f0e7df] flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenReceipt(order)}
                      className="flex-1 h-9 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-[11.5px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <FileText size={13} />
                      View & Print Slip / रसीद
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteOrder(order.orderId)}
                      className="h-9 w-9 rounded-full border border-stone-300 bg-white hover:bg-red-50 text-stone-600 hover:text-red-700 flex items-center justify-center transition-colors"
                      title="Delete Order / हटाएं"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ADD / IMPORT ORDER MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-[550px] bg-white rounded-[28px] shadow-2xl border border-stone-200 p-6 sm:p-7">
            <button
              type="button"
              onClick={() => setShowImportModal(false)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)] text-white text-xs font-bold">
                +
              </span>
              <h3 className="font-serif text-[20px] font-bold text-stone-900">
                Add / Import Customer Order (नया ऑर्डर जोड़ें)
              </h3>
            </div>
            <p className="text-[12.5px] text-stone-500 mb-4">
              Add walk-in orders or paste messages received on WhatsApp directly into the atelier database.
            </p>

            {/* MODAL TABS */}
            <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-xl mb-4 text-[12px] font-bold">
              <button
                type="button"
                onClick={() => setImportTab("whatsapp")}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  importTab === "whatsapp"
                    ? "bg-white text-[var(--primary)] shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                📲 Paste WhatsApp Text / वॉट्सऐप से
              </button>
              <button
                type="button"
                onClick={() => setImportTab("manual")}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  importTab === "manual"
                    ? "bg-white text-[var(--primary)] shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                ✍ Manual Entry / फ़ॉर्म भरें
              </button>
            </div>

            {/* TAB 1: WHATSAPP IMPORT */}
            {importTab === "whatsapp" ? (
              <form onSubmit={handleImportWhatsApp} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-bold text-stone-700 mb-1">
                    Paste WhatsApp Message / ऑर्डर का टेक्स्ट यहाँ पेस्ट करें:
                  </label>
                  <textarea
                    rows={6}
                    value={whatsappText}
                    onChange={(e) => setWhatsappText(e.target.value)}
                    placeholder="🧵 *New Order from Khwab Stitch* 🧵&#10;Order ID: #KS123&#10;Customer: Priya Sharma (9876543210)&#10;Outfit: Blouse&#10;Address: C-12, Malviya Nagar, Jaipur..."
                    className="w-full rounded-xl border-2 border-stone-200 p-3 text-[12.5px] font-mono outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowImportModal(false)}
                    className="px-4 py-2 rounded-full border border-stone-300 text-stone-600 text-[12.5px] font-bold hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-[12.5px] font-bold shadow-md"
                  >
                    ✓ Parse & Add Order / जोड़ें
                  </button>
                </div>
              </form>
            ) : (
              /* TAB 2: MANUAL ENTRY */
              <form onSubmit={handleManualSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Order ID / ऑर्डर आईडी (Optional · Slip / PDF se daalein)
                  </label>
                  <input
                    type="text"
                    value={manualForm.orderId}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, orderId: e.target.value })
                    }
                    placeholder="e.g. KS-XXXXXX (or leave blank to auto-generate)"
                    className="w-full rounded-lg border border-stone-300 p-2 text-[12.5px] font-mono outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Customer Name / नाम *
                    </label>
                    <input
                      type="text"
                      required
                      value={manualForm.name}
                      onChange={(e) =>
                        setManualForm({ ...manualForm, name: e.target.value })
                      }
                      placeholder="e.g. Priya Sharma"
                      className="w-full rounded-lg border border-stone-300 p-2 text-[12.5px] outline-none focus:border-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      WhatsApp / फ़ोन *
                    </label>
                    <input
                      type="text"
                      required
                      value={manualForm.whatsapp}
                      onChange={(e) =>
                        setManualForm({
                          ...manualForm,
                          whatsapp: e.target.value,
                        })
                      }
                      placeholder="e.g. 9876543210"
                      className="w-full rounded-lg border border-stone-300 p-2 text-[12.5px] outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Outfit / परिधान
                    </label>
                    <select
                      value={manualForm.outfit}
                      onChange={(e) =>
                        setManualForm({ ...manualForm, outfit: e.target.value })
                      }
                      className="w-full rounded-lg border border-stone-300 p-2 text-[12.5px] outline-none focus:border-[var(--primary)] bg-white"
                    >
                      <option value="Blouse">Blouse / ब्लाउज़</option>
                      <option value="Kurti">Kurti / कुर्ती</option>
                      <option value="Suit Upper">Suit Upper / सूट</option>
                      <option value="Top">Top / टॉप</option>
                      <option value="Tunic">Tunic / ट्यूनिक</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Pieces / पीस संख्या
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={manualForm.pieces}
                      onChange={(e) =>
                        setManualForm({ ...manualForm, pieces: e.target.value })
                      }
                      className="w-full rounded-lg border border-stone-300 p-2 text-[12.5px] outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10.5px] font-bold text-stone-700 mb-1">
                      Chest / सीना
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 36"
                      value={manualForm.chest}
                      onChange={(e) =>
                        setManualForm({ ...manualForm, chest: e.target.value })
                      }
                      className="w-full rounded-lg border border-stone-300 p-1.5 text-[12px] outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-stone-700 mb-1">
                      Waist / कमर
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 30"
                      value={manualForm.waist}
                      onChange={(e) =>
                        setManualForm({ ...manualForm, waist: e.target.value })
                      }
                      className="w-full rounded-lg border border-stone-300 p-1.5 text-[12px] outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-stone-700 mb-1">
                      Length / लंबाई
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 14.5"
                      value={manualForm.length}
                      onChange={(e) =>
                        setManualForm({ ...manualForm, length: e.target.value })
                      }
                      className="w-full rounded-lg border border-stone-300 p-1.5 text-[12px] outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Delivery Address / पता
                  </label>
                  <input
                    type="text"
                    value={manualForm.address}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, address: e.target.value })
                    }
                    placeholder="e.g. Flat 204, Jaipur, Rajasthan"
                    className="w-full rounded-lg border border-stone-300 p-2 text-[12.5px] outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Special Notes / विशेष निर्देश
                  </label>
                  <input
                    type="text"
                    value={manualForm.notes}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, notes: e.target.value })
                    }
                    placeholder="e.g. Sweetheart front neck, elbow sleeves"
                    className="w-full rounded-lg border border-stone-300 p-2 text-[12.5px] outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowImportModal(false)}
                    className="px-4 py-2 rounded-full border border-stone-300 text-stone-600 text-[12.5px] font-bold hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-[12.5px] font-bold shadow-md"
                  >
                    ✓ Save Order / सुरक्षित करें
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
