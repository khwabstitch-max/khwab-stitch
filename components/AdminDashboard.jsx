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
} from "lucide-react";

export default function AdminDashboard({
  orders,
  adminToken,
  onRefresh,
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

  // Auto-refresh polling every 8 seconds for real-time live incoming orders
  useEffect(() => {
    if (!autoRefresh || !adminToken) return;
    const interval = setInterval(() => {
      onRefresh(adminToken);
    }, 8000);
    return () => clearInterval(interval);
  }, [autoRefresh, adminToken, onRefresh]);

  // Filter orders
  const filteredOrders = orders.filter((o) => {
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

  const photoOrdersCount = orders.filter((o) => Boolean(o.outfit?.uploadedPhoto)).length;
  const urgentOrdersCount = orders.filter((o) =>
    o.delivery?.deliveryType?.toLowerCase().includes("urgent") ||
    o.delivery?.deliveryType?.toLowerCase().includes("48")
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

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => onRefresh(true)}
              disabled={adminBusy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-[12px] font-bold backdrop-blur-sm border border-white/20 transition-colors"
              title="Refresh Orders / ऑर्डर ताज़ा करें"
            >
              <RefreshCw size={13} className={adminBusy ? "animate-spin" : ""} />
              Refresh / ताज़ा करें
            </button>

            <button
              type="button"
              onClick={onExportCsv}
              disabled={adminBusy || orders.length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f4e2d2] hover:bg-white text-[var(--primary-dark)] text-[12px] font-bold shadow transition-colors"
            >
              <Download size={13} />
              Export CSV / एक्सेल
            </button>

            <button
              type="button"
              onClick={onSwitchToCustomer}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-[12px] font-bold border border-white/25 transition-colors"
            >
              👤 Customer View / ग्राहक फ़ॉर्म
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white text-[11.5px] font-medium transition-colors"
            >
              Logout / बाहर निकलें
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="rounded-2xl bg-white/10 border border-white/15 p-4 backdrop-blur-xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">
              Total Orders / कुल ऑर्डर
            </p>
            <p className="text-[28px] font-serif font-bold text-white mt-0.5">
              {orders.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 border border-white/15 p-4 backdrop-blur-xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">
              📷 With Photo / फ़ोटो संलग्न
            </p>
            <p className="text-[28px] font-serif font-bold text-white mt-0.5">
              {photoOrdersCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 border border-white/15 p-4 backdrop-blur-xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">
              ⚡ Urgent Orders / अर्जेंट
            </p>
            <p className="text-[28px] font-serif font-bold text-amber-200 mt-0.5">
              {urgentOrdersCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 border border-white/15 p-4 backdrop-blur-xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">
              ⏱️ Auto Refresh / लाइव
            </p>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`text-[12px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                  autoRefresh
                    ? "bg-emerald-500 text-white"
                    : "bg-white/20 text-white/70"
                }`}
              >
                {autoRefresh ? "ON (8s)" : "PAUSED"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER & SEARCH CONTROLS */}
      <section className="rounded-2xl border border-[#ebdcd0] bg-white p-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, WhatsApp, city, or order ID... / ग्राहक का नाम, फ़ोन, शहर खोजें..."
              className="w-full rounded-xl border border-stone-200 bg-[#fbf9f6] pl-10 pr-4 py-2.5 text-[13px] text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                ✕ Clear
              </button>
            )}
          </div>

          {/* Outfit Filters */}
          <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
            {["All", "Blouse", "Kurti", "Suit Upper"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedOutfit(tab)}
                className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all ${
                  selectedOutfit === tab
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "bg-[#f5ece3] text-stone-700 hover:bg-[#ede0d4]"
                }`}
              >
                {tab === "All" ? "All Outfits / सभी" : tab}
              </button>
            ))}

            {/* Photo filter toggle */}
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
            Showing {filteredOrders.length} of {orders.length} orders
          </span>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#e6dacd] bg-white p-12 text-center text-stone-500">
            <span className="text-[44px]">🧵</span>
            <h4 className="font-serif text-[18px] font-bold text-stone-700 mt-2">
              No matching orders found / कोई ऑर्डर नहीं मिला
            </h4>
            <p className="text-[13px] text-stone-500 mt-1 max-w-[420px] mx-auto">
              New customer orders submitted through the boutique form will appear here automatically in real time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOrders.map((order) => {
              const deliveryAddress =
                order.delivery?.address || order.customer?.address || "Address not provided";
              const landmark =
                order.delivery?.landmark || order.customer?.landmark || "";
              const hasPhoto = Boolean(order.outfit?.uploadedPhoto);
              const isUrgent =
                order.delivery?.deliveryType?.toLowerCase().includes("urgent") ||
                order.delivery?.deliveryType?.toLowerCase().includes("48");

              const whatsappClean = (order.customer?.whatsapp || "").replace(/\D/g, "");
              const whatsappUrl = `https://wa.me/91${whatsappClean}?text=${encodeURIComponent(
                `Namaste ${order.customer?.name || "Customer"} ji, we received your order #${order.orderId} for ${order.outfit?.type} at Khwab Stitch Boutique!`
              )}`;

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
                          {new Date(order.createdAt || Date.now()).toLocaleString("en-IN")}
                        </p>
                      </div>

                      {isUrgent && (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-extrabold bg-red-100 text-red-800 px-2 py-0.5 rounded-md border border-red-200">
                          ⚡ Urgent / 48 hrs
                        </span>
                      )}
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
                          <MapPin size={13} className="text-[var(--primary)] flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium">{deliveryAddress}</span>
                            {landmark && (
                              <span className="block text-stone-500 text-[11px]">
                                Landmark: {landmark}
                              </span>
                            )}
                            <span className="block text-stone-800 font-semibold text-[11.5px] mt-0.5">
                              {order.customer?.cityState} — PIN: {order.customer?.pin}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

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
                            ✓ Customer Design Photo Attached
                          </span>
                          <p className="text-[11.5px] font-medium text-stone-800 truncate mt-0.5">
                            {order.outfit.uploadedPhotoName || "design-reference.jpg"}
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
                            <Eye size={12} /> View Full Photo / फ़ोटो देखें
                          </button>
                        </div>
                      </div>
                    )}

                    {/* DESIGN CHOICES BREAKDOWN */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11.5px]">
                      <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                        <span className="text-[10px] text-stone-500 font-bold uppercase block">Necklines</span>
                        <span className="font-semibold text-stone-800 truncate block">
                          F: {order.design?.neckFront || "Classic"}
                        </span>
                        <span className="text-stone-600 truncate block">
                          B: {order.design?.neckBack || "Classic"}
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                        <span className="text-[10px] text-stone-500 font-bold uppercase block">Sleeves & Fit</span>
                        <span className="font-semibold text-stone-800 truncate block">
                          {order.design?.sleeveLength || "Standard"}
                        </span>
                        <span className="text-stone-600 truncate block">
                          {order.design?.sleeveDesign || "Straight"} · {order.design?.fit || "Fitted"}
                        </span>
                      </div>
                    </div>

                    {order.design?.additionalInstructions && (
                      <p className="mt-2 text-[11px] text-stone-600 bg-[#faf7f2] p-1.5 rounded-md border border-[#eee2d6] italic">
                        Note: {order.design.additionalInstructions}
                      </p>
                    )}
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
    </div>
  );
}

