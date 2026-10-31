import { useState, useEffect } from "react";
import { Check, X, Heart, Search, Trash2, Download, FileText, ChevronRight, ChevronLeft, Star, Scissors, MessageCircle, Copy } from "lucide-react";
import "./styles.css";
import StepHeader from "./components/StepHeader.jsx";
import WelcomeStep from "./components/WelcomeStep.jsx";
import CustomerDetailsStep from "./components/steps/CustomerDetailsStep.jsx";
import OutfitSelectionStep from "./components/steps/OutfitSelectionStep.jsx";
import DesignSelectionStep from "./components/steps/DesignSelectionStep.jsx";
import MeasurementsStep from "./components/steps/MeasurementsStep.jsx";
import DeliveryAddressStep from "./components/steps/DeliveryAddressStep.jsx";
import OrderReceiptModal from "./components/OrderReceiptModal.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import AdminLoginPage from "./components/AdminLoginPage.jsx";

import {
  DEFAULT_SLEEVE_LENGTH_BY_OUTFIT,
  resolveSleeveLength,
  OUTFITS as outfitTypes,
  FRONT_NECKLINES as neckFront,
  BACK_NECKLINES as neckBack,
  SLEEVE_LENGTHS as sleeveLengthData,
  SLEEVE_DESIGNS as sleeveDesign,
  MEASUREMENT_CONFIGS as measurementConfigs,
  OUTFIT_PHOTOS,
  DESIGN_CODE_PHOTOS,
} from "./config/fashionCatalog.js";

const CLOUD_BRIDGE_TOPIC = "khwab_atelier_orders_v2_sync";
const CLOUD_BRIDGE_URL = `https://ntfy.sh/${CLOUD_BRIDGE_TOPIC}`;

// Strip heavy base64 strings so storage & cloud payloads never hit quota/payload limits
const stripPhotosFromOrder = (order, preservePhotos = false) => {
  if (!order) return order;
  if (preservePhotos) return order;
  return {
    ...order,
    outfit: {
      ...order.outfit,
      uploadedPhoto: "",
      hasUploadedPhoto: Boolean(order.outfit?.uploadedPhoto),
    },
    design: {
      ...order.design,
      frontPhoto: "",
      backPhoto: "",
      sleevePhoto: "",
      hasFrontPhoto: Boolean(order.design?.frontPhoto),
      hasBackPhoto: Boolean(order.design?.backPhoto),
      hasSleevePhoto: Boolean(order.design?.sleevePhoto),
    },
  };
};

const generateOrderWhatsAppText = (o) => {
  if (!o) return "";
  const cust = o.customer || {};
  const out = o.outfit || {};
  const des = o.design || {};
  const del = o.delivery || {};
  const meas = o.measurements?.values || {};

  const lines = [
    "🌸 *KHWAB STITCH - CUSTOM ORDER* 🌸",
    "━━━━━━━━━━━━━━━━━━━━━━━",
    `📋 *Order ID:* #${o.orderId || "NEW"}`,
    `👤 *Customer Name:* ${cust.name || "Customer"}`,
    `📞 *WhatsApp:* +91 ${cust.whatsapp || ""}`,
    `📍 *City/State:* ${cust.cityState || cust.city || ""}`,
    `🏠 *Address:* ${del.address || cust.address || ""} (PIN: ${cust.pin || ""})`,
    "━━━━━━━━━━━━━━━━━━━━━━━",
    "👗 *OUTFIT & STYLING:*",
    `• *Garment:* ${out.type || "Custom Outfit"} (${out.pieces || 1} Piece)`,
    out.designCode ? `• *Design Code:* ${out.designCode}` : "",
    out.uploadedPhotoName ? `• *Reference Photo:* ${out.uploadedPhotoName}` : "",
    `• *Front Neck:* ${des.neckFront === "as-photo" ? "As per Photo (फ़ोटो जैसा)" : des.neckFront || "Standard"}`,
    `• *Back Neck:* ${des.neckBack === "as-photo" ? "As per Photo (फ़ोटो जैसा)" : des.neckBack || "Standard"}`,
    `• *Sleeves:* ${des.sleeveLength || "Standard"} · ${des.sleeveDesign === "as-photo" ? "As per Photo (फ़ोटो जैसा)" : des.sleeveDesign || "Straight"}`,
    `• *Fit:* ${des.fit || "Regular"}`,
    des.additionalInstructions ? `• *Notes:* ${des.additionalInstructions}` : "",
    "━━━━━━━━━━━━━━━━━━━━━━━",
    `📐 *MEASUREMENTS (${o.measurements?.unit || "inch"}):*`,
  ];

  const measEntries = Object.entries(meas).filter(([_, v]) => v);
  if (measEntries.length > 0) {
    measEntries.forEach(([k, v]) => {
      lines.push(`• ${k}: ${v} ${o.measurements?.unit || "inch"}`);
    });
  } else {
    lines.push(`• Method: ${o.measurements?.provideMethod || "Self measurement"}`);
  }

  lines.push("━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push("✨ *Khwab Stitch Atelier - Bespoke Tailoring*");
  return lines.filter(Boolean).join("\n");
};

const syncOrderToCloud = async (order) => {
  if (!order) return;
  try {
    const hasPhotos = Boolean(
      order.outfit?.uploadedPhoto ||
      order.design?.frontPhoto ||
      order.design?.backPhoto ||
      order.design?.sleevePhoto
    );

    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 8000) : null;

    if (hasPhotos) {
      // Send complete order WITH full reference photos as attachment file via PUT
      await fetch(CLOUD_BRIDGE_URL, {
        method: "PUT",
        headers: {
          "Title": `Order #${order.orderId || "NEW"} - ${order.customer?.name || "Customer"} (${order.outfit?.type || "Custom Outfit"})`,
          "Filename": `order_${order.orderId || "new"}.json`,
          "Tags": "dress,sparkles,shopping_bags,camera",
          "Priority": "4",
        },
        body: JSON.stringify(order),
        signal: controller ? controller.signal : undefined,
      });
    } else {
      // Lightweight message when no custom photo uploaded
      await fetch(CLOUD_BRIDGE_URL, {
        method: "POST",
        headers: {
          "Title": `Order #${order.orderId || "NEW"} - ${order.customer?.name || "Customer"} (${order.outfit?.type || "Custom Outfit"})`,
          "Tags": "dress,sparkles,shopping_bags",
          "Priority": "4",
        },
        body: JSON.stringify(order),
        signal: controller ? controller.signal : undefined,
      });
    }
    if (timeoutId) clearTimeout(timeoutId);
  } catch (err) {
    console.warn("Cloud sync note:", err);
  }
};

const fetchCloudOrders = async () => {
  try {
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 8000) : null;
    const res = await fetch(`${CLOUD_BRIDGE_URL}/json?poll=1&since=all`, {
      cache: "no-store",
      signal: controller ? controller.signal : undefined,
    });
    if (timeoutId) clearTimeout(timeoutId);
    if (!res.ok) return [];
    const text = await res.text();
    const lines = text.trim().split("\n");
    const cloudOrders = [];
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const item = JSON.parse(line);
        if (item.event === "message") {
          let parsedOrder = null;
          // If message has an attachment file (which holds full reference photos), fetch it!
          if (item.attachment?.url) {
            try {
              const attachRes = await fetch(item.attachment.url);
              if (attachRes.ok) {
                parsedOrder = await attachRes.json();
              }
            } catch {}
          }
          // Fallback to inline message body
          if (!parsedOrder && item.message) {
            try {
              parsedOrder = JSON.parse(item.message);
            } catch {}
          }
          if (parsedOrder && parsedOrder.orderId) {
            cloudOrders.push(parsedOrder);
          }
        }
      } catch {}
    }
    return cloudOrders;
  } catch (e) {
    console.warn("Could not fetch cloud orders:", e);
    return [];
  }
};

export default function App() {
  // FORM STATE
  const [currentSection, setCurrentSection] = useState(1);
  const [customer, setCustomer] = useState({
    name: "",
    whatsapp: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pin: "",
    landmark: "",
    cityState: "",
  });
  const [outfit, setOutfit] = useState({
    type: "", pieces: "1", designCode: "", refPhoto: "", specialReq: "",
    uploadedPhoto: "", uploadedPhotoName: "", uploadedPhotoSize: ""
  });
  const [design, setDesign] = useState({
    neckFront: "",
    neckBack: "",
    sleeveLength: "",
    sleeveDesign: "",
    fit: "Regular",
    additionalInstructions: "",
    frontPhoto: "",
    frontPhotoName: "",
    frontPhotoSize: "",
    backPhoto: "",
    backPhotoName: "",
    backPhotoSize: "",
    sleevePhoto: "",
    sleevePhotoName: "",
    sleevePhotoSize: "",
  });
  const [measurements, setMeasurements] = useState({
    unit: "inch",
    provideMethod: "Self measurement / खुद से नाप लेकर",
    values: {},
  });
  const [delivery, setDelivery] = useState({ address: "", landmark: "", deliveryType: "Standard · 7–10 days" });
  const [editingFromReview, setEditingFromReview] = useState(false);
  const [orders, setOrders] = useState([]);
  const [busy, setBusy] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [receiptOrder, setReceiptOrder] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  // URL-based routing: "/" -> customer wizard, "/admin" or "#admin" -> atelier admin
  const getInitialRoute = () => {
    if (typeof window === "undefined") return "customer";
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path.includes("admin") || hash.includes("admin") ? "admin" : "customer";
  };

  const [activeRole, setActiveRole] = useState(getInitialRoute);
  const [adminToken, setAdminToken] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminBusy, setAdminBusy] = useState(false);
  const [stepError, setStepError] = useState("");

  const navigateToCustomer = () => {
    setActiveRole("customer");
    if (window.location.hash) {
      window.history.pushState(null, "", window.location.pathname);
    } else if (window.location.pathname !== "/") {
      window.history.pushState(null, "", "/");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToAdmin = () => {
    setActiveRole("admin");
    window.location.hash = "admin";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Sync route on browser forward / back button or hash change
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const isAdminRoute = path.includes("admin") || hash.includes("admin");
      setActiveRole(isAdminRoute ? "admin" : "customer");
    };

    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") || (e.ctrlKey && e.altKey && e.key.toLowerCase() === "a")) {
        e.preventDefault();
        navigateToAdmin();
      }
    };

    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener("hashchange", handleUrlChange);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("hashchange", handleUrlChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Load local orders immediately into state on startup
  useEffect(() => {
    const local = getLocalOrders();
    if (local && local.length > 0) {
      setOrders(local);
    }
    const savedToken = sessionStorage.getItem("khwab_admin_token");
    if (savedToken) {
      setAdminToken(savedToken);
      reloadRecords(savedToken).catch(() => {
        sessionStorage.removeItem("khwab_admin_token");
        setAdminToken("");
      });
    }

    // Cross-tab and storage synchronization
    let ch;
    try {
      if (window.BroadcastChannel) {
        ch = new BroadcastChannel("khwab_orders_channel");
        ch.onmessage = () => {
          const updatedLocal = getLocalOrders();
          setOrders(updatedLocal);
        };
      }
    } catch {}

    const onStorage = (e) => {
      if (e.key === "khwab_local_orders") {
        const updatedLocal = getLocalOrders();
        setOrders(updatedLocal);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      if (ch) ch.close();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Sync orders whenever switching to admin view
  useEffect(() => {
    if (activeRole === "admin") {
      const savedToken = sessionStorage.getItem("khwab_admin_token") || adminToken;
      reloadRecords(savedToken);
    }
  }, [activeRole]);

  const getLocalOrders = () => {
    try {
      return JSON.parse(localStorage.getItem("khwab_local_orders") || "[]");
    } catch {
      return [];
    }
  };

  const saveLocalOrder = (order) => {
    try {
      const existing = getLocalOrders();
      const updated = [order, ...existing.filter((o) => o?.orderId !== order.orderId)];
      
      // Multi-tier storage to guarantee localStorage never throws QuotaExceededError
      try {
        localStorage.setItem("khwab_local_orders", JSON.stringify(updated));
      } catch (quotaErr1) {
        console.warn("Storage quota limit reached, preserving photos on latest 2 orders only:", quotaErr1);
        const lightweight = updated.map((o, idx) => stripPhotosFromOrder(o, idx < 2));
        try {
          localStorage.setItem("khwab_local_orders", JSON.stringify(lightweight));
        } catch (quotaErr2) {
          console.warn("Storage quota still exceeded, stripping all base64 photos to guarantee order safety:", quotaErr2);
          const textOnly = updated.map((o) => stripPhotosFromOrder(o, false));
          try {
            localStorage.setItem("khwab_local_orders", JSON.stringify(textOnly));
          } catch (fatalErr) {
            localStorage.setItem("khwab_local_orders", JSON.stringify(textOnly.slice(0, 50)));
          }
        }
      }

      // Instantly update React state so admin has it right away
      setOrders((prev) => {
        const map = new Map();
        [order, ...prev].forEach((o) => o?.orderId && map.set(o.orderId, o));
        return Array.from(map.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      });

      // Broadcast to other open tabs/windows and cloud sync
      try {
        syncOrderToCloud(order);
        if (window.BroadcastChannel) {
          const ch = new BroadcastChannel("khwab_orders_channel");
          ch.postMessage({ type: "ORDER_CREATED", order });
          ch.close();
        }
      } catch {}
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  };

  async function apiRequest(url, options = {}) {
    const response = await fetch(url, options);
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || `Request failed (${response.status}).`);
    return result;
  }

  async function reloadRecords(token = adminToken) {
    const activeTok = typeof token === "string" ? token : adminToken;
    let serverOrders = [];
    if (activeTok) {
      try {
        const result = await apiRequest("/api/admin/orders", {
          headers: { authorization: `Bearer ${activeTok}` },
          cache: "no-store",
        });
        serverOrders = result.orders || [];
      } catch (err) {
        if (err.message?.includes("401") || err.message?.includes("password")) {
          throw err;
        }
        console.warn("Server orders fetch failed (fallback to local & cloud):", err);
      }
    }

    // Fetch cloud synced orders across devices
    const cloudOrders = await fetchCloudOrders();
    const localOrders = getLocalOrders();

    const map = new Map();
    // Merge cloud, server, and local orders. Keep richest data if order already exists.
    [...cloudOrders, ...serverOrders, ...localOrders].forEach((o) => {
      if (o?.orderId) {
        const existing = map.get(o.orderId);
        if (!existing) {
          map.set(o.orderId, o);
        } else {
          map.set(o.orderId, {
            ...o,
            ...existing,
            status: existing.status || o.status || "New",
            outfit: {
              ...o.outfit,
              ...existing.outfit,
              uploadedPhoto: existing.outfit?.uploadedPhoto || o.outfit?.uploadedPhoto || "",
            },
            design: {
              ...o.design,
              ...existing.design,
              frontPhoto: existing.design?.frontPhoto || o.design?.frontPhoto || "",
              backPhoto: existing.design?.backPhoto || o.design?.backPhoto || "",
              sleevePhoto: existing.design?.sleevePhoto || o.design?.sleevePhoto || "",
            },
          });
        }
      }
    });

    const combined = Array.from(map.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    try {
      localStorage.setItem("khwab_local_orders", JSON.stringify(combined));
    } catch {}

    setOrders(combined);
    return combined;
  }

  const handleAdminLoginSubmit = async (passwordInput) => {
    setAdminBusy(true);
    setAdminError("");
    try {
      const input = (passwordInput || "").trim();
      if (!input) {
        throw new Error("कृपया पासवर्ड दर्ज करें · Please enter admin password.");
      }

      let authenticated = false;
      try {
        const result = await apiRequest("/api/admin/orders", {
          headers: { authorization: `Bearer ${input}` },
          cache: "no-store",
        });
        authenticated = true;
        if (result && Array.isArray(result.orders)) {
          setOrders(result.orders);
        }
      } catch (err) {
        if (err.message?.includes("401") || err.message?.includes("Incorrect")) {
          throw new Error("Incorrect admin password / गलत पासवर्ड");
        }
        // On static GitHub Pages hosting (no backend server), authenticate with atelier password
        if (input !== "Dhaniya123") {
          throw new Error("Incorrect admin password / गलत पासवर्ड");
        }
        authenticated = true;
      }

      if (authenticated) {
        setAdminToken(input);
        sessionStorage.setItem("khwab_admin_token", input);
        const local = getLocalOrders();
        setOrders((prev) => {
          const map = new Map();
          [...local, ...prev].forEach((o) => o?.orderId && map.set(o.orderId, o));
          return Array.from(map.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        });
      }
    } catch (error) {
      setAdminError(error.message || "Incorrect admin password / गलत पासवर्ड");
    } finally {
      setAdminBusy(false);
    }
  };

  const handleAdminLogout = () => {
    setAdminToken("");
    sessionStorage.removeItem("khwab_admin_token");
  };

  const refreshOrders = async () => {
    if (!adminToken) return;
    setAdminBusy(true);
    try {
      await reloadRecords(adminToken);
    } catch (error) {
      console.error(error);
    } finally {
      setAdminBusy(false);
    }
  };

  const downloadOrdersCsv = async () => {
    setAdminBusy(true);
    try {
      let downloaded = false;
      try {
        const response = await fetch("/api/admin/export.csv", {
          headers: { authorization: `Bearer ${adminToken}` },
          cache: "no-store",
        });
        if (response.ok) {
          const file = await response.blob();
          const url = URL.createObjectURL(file);
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = "khwab-stitch-orders.csv";
          document.body.appendChild(anchor);
          anchor.click();
          anchor.remove();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          downloaded = true;
        }
      } catch (e) {
        console.warn("Server CSV failed, falling back to client-side:", e);
      }

      if (!downloaded) {
        if (orders.length === 0) {
          alert("No orders available to export / एक्सपोर्ट करने के लिए कोई ऑर्डर नहीं है।");
          return;
        }
        const headers = [
          "Order ID", "Date", "Customer Name", "WhatsApp", "Email", "City & State", "PIN",
          "Outfit", "Pieces", "Design Code", "Front Neck", "Back Neck",
          "Sleeve Length", "Sleeve Design", "Fit", "Method", "Address", "Payment"
        ];
        const rows = orders.map((o) => [
          o.orderId, o.createdAt, o.customer?.name, o.customer?.whatsapp, o.customer?.email,
          o.customer?.cityState, o.customer?.pin, o.outfit?.type, o.outfit?.pieces,
          o.outfit?.designCode, o.design?.neckFront, o.design?.neckBack,
          o.design?.sleeveLength, o.design?.sleeveDesign, o.design?.fit,
          o.measurements?.provideMethod, `"${(o.delivery?.address || "").replace(/"/g, '""')}"`,
          o.delivery?.paymentMode
        ]);
        const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "khwab-stitch-orders.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (error) {
      alert(`Could not download CSV: ${error.message}`);
    } finally {
      setAdminBusy(false);
    }
  };

  // Helpers
  const selectOutfit = (t) => {
    if (!t) return;
    setOutfit((current) => {
      if (current.type === t) return current;
      return {
        ...current,
        type: t,
      };
    });
    setDesign((prev) => ({
      ...prev,
      sleeveLength: prev.sleeveLength || DEFAULT_SLEEVE_LENGTH_BY_OUTFIT[t] || "three-quarter",
      sleeveDesign: prev.sleeveDesign || "straight",
    }));
    setStepError("");
  };
  const selectDesign = (type, value) => {
    setDesign({ ...design, [type]: value });
  };
  const showMeasurements = () => {
    return outfit.type ? measurementConfigs[outfit.type] || measurementConfigs.Other : [];
  };
  const openLightbox = (title, grad, subtitle) => {
    setLightbox({ open: true, title, grad, subtitle });
  };

  const openReceipt = (order) => {
    setReceiptOrder(order);
  };

  const saveOrder = async () => {
    // validation
    const digitsOnly = (customer.whatsapp || "").replace(/\D/g, "");
    const clean10 = digitsOnly.length === 12 && digitsOnly.startsWith("91") ? digitsOnly.slice(2) : digitsOnly;
    if (clean10.length !== 10) {
      alert("कृपया 10 अंकों का मान्य वॉट्सऐप नंबर दर्ज करें · Please enter a valid 10-digit WhatsApp number");
      setCurrentSection(2);
      return;
    }
    if (![customer.name, customer.address, customer.pin].every((value) => value && value.trim())) {
      alert("कृपया नाम, पूरा पता और पिन कोड भरें · Please fill in name, address & PIN");
      setCurrentSection(2);
      return;
    }
    if (!outfit.type) { alert("कृपया परिधान चुनें · Please select an outfit"); setCurrentSection(3); return; }

    setBusy(true);
    const combinedCityState = customer.cityState || [customer.city, customer.state].filter(Boolean).join(", ") || customer.city || "Not specified";
    const cleanCustomer = {
      ...customer,
      whatsapp: clean10,
      pin: (customer.pin || "").replace(/\D/g, "").slice(0, 6),
      cityState: combinedCityState,
    };
    setCustomer(cleanCustomer);

    const finalDelivery = {
      ...delivery,
      address: delivery.address || customer.address,
      landmark: delivery.landmark || customer.landmark || "",
    };
    const order = {
      customer: cleanCustomer,
      outfit,
      design,
      measurements: {
        ...measurements,
        values: {
          ...(measurements?.values || {}),
        },
      },
      delivery: finalDelivery,
      createdAt: new Date().toISOString(),
    };
    try {
      const result = await apiRequest("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(order),
      });
      const savedOrder = { ...order, orderId: result.orderId };
      saveLocalOrder(savedOrder);
      syncOrderToCloud(savedOrder);
      setSuccessOrder(savedOrder);
      setReceiptOrder(savedOrder);
    } catch (e) {
      console.warn("API request failed, saving order locally & syncing to cloud:", e);
      const fallbackId = `KS${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const savedOrder = { ...order, orderId: fallbackId };
      saveLocalOrder(savedOrder);
      syncOrderToCloud(savedOrder);
      setSuccessOrder(savedOrder);
      setReceiptOrder(savedOrder);
    } finally {
      setBusy(false);
    }
  };

  const validateAndSyncCustomer = () => {
    if (!customer.name?.trim()) {
      setStepError("कृपया अपना पूरा नाम भरें · Please enter your full name.");
      return false;
    }

    // WhatsApp 10-digit validation
    const digitsOnly = (customer.whatsapp || "").replace(/\D/g, "");
    const clean10 = digitsOnly.length === 12 && digitsOnly.startsWith("91") ? digitsOnly.slice(2) : digitsOnly;
    if (clean10.length !== 10) {
      setStepError("कृपया 10 अंकों का मान्य वॉट्सऐप नंबर दर्ज करें · Please enter a valid 10-digit WhatsApp number.");
      return false;
    }

    if (!customer.address?.trim()) {
      setStepError("कृपया पूरा डिलीवरी पता भरें · Please enter your full delivery address.");
      return false;
    }

    if (!customer.city?.trim()) {
      setStepError("कृपया शहर चुनें या लिखें · Please select or enter your city.");
      return false;
    }

    if (!customer.state?.trim()) {
      setStepError("कृपया राज्य चुनें · Please select your state.");
      return false;
    }

    // PIN 6-digit validation
    const pinDigits = (customer.pin || "").replace(/\D/g, "");
    if (pinDigits.length !== 6) {
      setStepError("कृपया 6 अंकों का सही पिन कोड दर्ज करें · Please enter a valid 6-digit PIN code.");
      return false;
    }

    const combinedCityState = `${customer.city.trim()}, ${customer.state.trim()}`;
    setCustomer((prev) => ({
      ...prev,
      whatsapp: clean10,
      pin: pinDigits,
      cityState: combinedCityState,
    }));

    // Keep delivery address strictly in sync with customer address
    setDelivery((prev) => ({
      ...prev,
      address: customer.address.trim(),
      landmark: customer.landmark ? customer.landmark.trim() : prev.landmark,
    }));

    return true;
  };

  const saveAndReturnToReview = () => {
    setStepError("");
    if (currentSection === 2) {
      if (!validateAndSyncCustomer()) return;
    } else if (currentSection === 3) {
      if (!outfit.type) {
        setStepError("कृपया आगे बढ़ने से पहले परिधान चुनें · Please choose an outfit before continuing.");
        return;
      }
    }
    setEditingFromReview(false);
    setCurrentSection(6);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStepSubmit = (event) => {
    event.preventDefault();
    setStepError("");
    if (currentSection === 2) {
      if (!validateAndSyncCustomer()) return;
    }
    if (currentSection === 3 && !outfit.type) {
      setStepError("कृपया आगे बढ़ने से पहले परिधान चुनें · Please choose an outfit before continuing.");
      return;
    }
    if (currentSection === 6) {
      if (!customer.address?.trim() && !delivery.address?.trim()) {
        setStepError("कृपया डिलीवरी का पता भरें · Please enter your delivery address.");
        return;
      }
      saveOrder();
      return;
    }

    if (editingFromReview) {
      setEditingFromReview(false);
      setCurrentSection(6);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setCurrentSection((section) => Math.min(6, section + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteOrder = async (orderId) => {
    if (!confirm(`Order ${orderId} delete karein? / क्या आप यह ऑर्डर हटाना चाहते हैं?`)) return;
    setAdminError("");
    try {
      await apiRequest(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${adminToken}` },
      }).catch(() => {});
    } catch (error) {
      console.warn("Server delete note:", error);
    }
    const local = getLocalOrders().filter((o) => o.orderId !== orderId);
    localStorage.setItem("khwab_local_orders", JSON.stringify(local));
    setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
    try {
      if (window.BroadcastChannel) {
        const ch = new BroadcastChannel("khwab_orders_channel");
        ch.postMessage({ type: "ORDERS_UPDATED" });
        ch.close();
      }
    } catch {}
  };

  const clearOrders = async () => {
    if (!confirm("Saare orders delete karein? / क्या आप सभी ऑर्डर हटाना चाहते हैं?")) return;
    setAdminError("");
    try {
      await apiRequest("/api/admin/orders", {
        method: "DELETE",
        headers: { authorization: `Bearer ${adminToken}` },
      }).catch(() => {});
    } catch (error) {
      console.warn("Server clear note:", error);
    }
    localStorage.removeItem("khwab_local_orders");
    setOrders([]);
    try {
      if (window.BroadcastChannel) {
        const ch = new BroadcastChannel("khwab_orders_channel");
        ch.postMessage({ type: "ORDERS_UPDATED" });
        ch.close();
      }
    } catch {}
  };

  return (
    <div data-safe-area-inset-root className="min-h-screen w-full overflow-x-clip bg-[var(--bg)] text-[var(--text)]"
      style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)' }}>
      <StepHeader
        currentSection={currentSection}
        activeMode={activeRole}
        onNavigateCustomer={navigateToCustomer}
        onNavigateAdmin={navigateToAdmin}
        onJumpToSection={(sec) => {
          setStepError("");
          if (sec === 6) {
            if (currentSection === 2 && !validateAndSyncCustomer()) return;
            if (currentSection === 3 && !outfit.type) {
              setStepError("कृपया आगे बढ़ने से पहले परिधान चुनें · Please choose an outfit before continuing.");
              return;
            }
            setEditingFromReview(false);
          } else if (currentSection === 6) {
            setEditingFromReview(true);
          }
          setCurrentSection(sec);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        ordersCount={orders.length}
      />

      {/* MAIN */}
      <main className="mx-auto max-w-[1000px] px-4 md:px-8 pb-28 pt-4">
        {activeRole === "admin" ? (
          /* MASTER TAILOR ATELIER PAGE (/admin) */
          adminToken ? (
            <AdminDashboard
              orders={orders}
              adminToken={adminToken}
              onRefresh={reloadRecords}
              onSaveOrder={saveLocalOrder}
              onDeleteOrder={deleteOrder}
              onExportCsv={downloadOrdersCsv}
              onOpenReceipt={openReceipt}
              onOpenLightbox={setLightbox}
              onSwitchToCustomer={navigateToCustomer}
              onLogout={handleAdminLogout}
              adminBusy={adminBusy}
            />
          ) : (
            <AdminLoginPage
              onLogin={handleAdminLoginSubmit}
              onBackToCustomer={navigateToCustomer}
              adminError={adminError}
              adminBusy={adminBusy}
            />
          )
        ) : (
          /* REGULAR CUSTOMER ORDER WIZARD */
          <>
            {currentSection === 1 && !successOrder && (
              <WelcomeStep onStart={() => setCurrentSection(2)} />
            )}

            {/* EDITING MODE ALERT BANNER WHEN EDITING FROM STEP 6 */}
            {editingFromReview && currentSection < 6 && (
              <div className="mt-4 mb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border-2 border-amber-300 bg-amber-50/95 px-4 sm:px-5 py-3.5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white font-bold text-base shadow-xs">
                    ✏️
                  </span>
                  <div>
                    <p className="text-[13.5px] font-bold text-amber-950 flex flex-wrap items-center gap-2">
                      <span>Editing Step 0{currentSection} / बदलाव मोड</span>
                      <span className="text-[11px] font-normal text-amber-900 bg-amber-200/90 px-2.5 py-0.5 rounded-full">
                        Other details are safely preserved / बाकी सभी नाप व जानकारी सुरक्षित हैं
                      </span>
                    </p>
                    <p className="text-[12px] text-amber-800 mt-0.5">
                      Change only what you want to modify, then click Save & Return to go straight back to Step 6.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={saveAndReturnToReview}
                  className="w-full sm:w-auto shrink-0 h-10 px-5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer whitespace-nowrap"
                >
                  <Check size={16} /> Save & Return / सहेजें और लौटें (Step 6)
                </button>
              </div>
            )}

            {/* FORM SECTIONS 2-6 */}
            {!successOrder && currentSection > 1 && (
              <form className="mt-6 space-y-6" onSubmit={handleStepSubmit}>
                {/* SECTION 2 */}
                {currentSection === 2 && (
                  <CustomerDetailsStep customer={customer} setCustomer={setCustomer} />
                )}

                {/* SECTION 3 */}
                {currentSection === 3 && (
                  <OutfitSelectionStep
                    outfitTypes={outfitTypes}
                    outfit={outfit}
                    setOutfit={setOutfit}
                    selectOutfit={selectOutfit}
                    selectionError={stepError}
                  />
                )}

                {/* SECTION 4 DESIGN */}
                {currentSection === 4 && (
                  <DesignSelectionStep
                    design={design}
                    setDesign={setDesign}
                    selectDesign={selectDesign}
                    onPreview={openLightbox}
                    neckFront={neckFront}
                    neckBack={neckBack}
                    sleeveLengthData={sleeveLengthData}
                    sleeveDesign={sleeveDesign}
                  />
                )}

                {/* SECTION 5 MEASUREMENTS - DYNAMIC */}
                {currentSection === 5 && (
                  <MeasurementsStep
                    outfit={outfit}
                    measurements={measurements}
                    setMeasurements={setMeasurements}
                    measurementFields={showMeasurements()}
                    customer={customer}
                    openLightbox={openLightbox}
                  />
                )}

                {/* SECTION 6 DELIVERY & ORDER AT A GLANCE */}
                {currentSection === 6 && (
                  <DeliveryAddressStep
                    customer={customer}
                    setCustomer={setCustomer}
                    delivery={delivery}
                    setDelivery={setDelivery}
                    outfit={outfit}
                    setOutfit={setOutfit}
                    design={design}
                    setDesign={setDesign}
                    measurements={measurements}
                    setMeasurements={setMeasurements}
                    onJumpToSection={(sec) => {
                      setStepError("");
                      if (sec < 6) {
                        setEditingFromReview(true);
                      }
                      setCurrentSection(sec);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    outfitTypes={outfitTypes}
                    neckFront={neckFront}
                    neckBack={neckBack}
                    sleeveLengthData={sleeveLengthData}
                    sleeveDesign={sleeveDesign}
                    measurementConfigs={measurementConfigs}
                    openLightbox={openLightbox}
                  />
                )}

                {stepError && currentSection !== 3 && (
                  <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">
                    {stepError}
                  </p>
                )}

                <div
                  className="sticky bottom-4 z-20 flex gap-3 rounded-[24px] border border-[#e6dacd] bg-white/95 p-3 shadow-xl backdrop-blur-md transition-all"
                >
                  <button
                    type="button"
                    disabled={currentSection === 2}
                    onClick={() => {
                      setStepError("");
                      setCurrentSection((s) => Math.max(2, s - 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex-1 h-12 rounded-full border border-[#ded2c4] bg-white font-bold text-[13.5px] sm:text-[14px] text-stone-700 flex items-center justify-center gap-1.5 disabled:opacity-40 hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <ChevronLeft size={17} /> Back / पीछे
                  </button>

                  {currentSection < 6 ? (
                    editingFromReview ? (
                      <button
                        type="button"
                        onClick={saveAndReturnToReview}
                        className="flex-[1.5] h-12 rounded-full text-white font-bold text-[13.5px] sm:text-[14px] flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-opacity cursor-pointer"
                        style={{ background: "linear-gradient(90deg,var(--primary),var(--secondary))" }}
                      >
                        <Check size={17} />
                        <span>Save & Return to Review / सहेजें और सारांश (Step 6)</span>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="flex-[1.5] h-12 rounded-full text-white font-bold text-[13.5px] sm:text-[14px] flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-opacity cursor-pointer"
                        style={{ background: "linear-gradient(90deg,var(--primary),var(--secondary))" }}
                      >
                        Next / आगे बढ़ें <ChevronRight size={17} />
                      </button>
                    )
                  ) : (
                    <button
                      type="submit"
                      disabled={busy}
                      className="flex-[1.8] h-12 rounded-full text-white font-bold text-[13.5px] sm:text-[14px] flex items-center justify-center gap-2 shadow-md disabled:opacity-60 hover:opacity-95 transition-opacity"
                      style={{ background: "linear-gradient(90deg,var(--primary),var(--secondary))" }}
                    >
                      {busy ? "Saving... / सुरक्षित हो रहा है..." : "✓ Confirm Order / ऑर्डर कन्फ़र्म करें"}{" "}
                      <FileText size={17} />
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* SUCCESS */}
            {successOrder && (
              <div
                className="mt-8 mx-auto max-w-[720px] rounded-[32px] bg-white p-8 md:p-10 shadow-[var(--shadow-lg)] border text-center"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="relative mx-auto h-20 w-20">
                  <img
                    src="./images/khwabstitch_logo.jpg"
                    alt="Khwab Stitch Logo"
                    className="h-20 w-20 rounded-full object-cover border-2 border-[#dfc5b5] shadow-md"
                  />
                  <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--success)] text-white shadow-sm">
                    <Check size={16} />
                  </span>
                </div>
                <h2 className="mt-4 text-[28px] font-bold">Order Confirmed! / ऑर्डर दर्ज हो गया! ✨</h2>
                <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-light)] font-bold text-[14px]">
                  {successOrder.orderId} • {successOrder.outfit.type}
                </div>
                {successOrder.outfit?.uploadedPhoto ? (
                  <div className="mt-4 flex items-center justify-center">
                    <div className="inline-flex items-center gap-3 p-2.5 pr-5 rounded-2xl border border-[var(--border)] bg-[#faf7f2] shadow-sm">
                      <img
                        src={successOrder.outfit.uploadedPhoto}
                        className="h-14 w-14 rounded-xl object-cover border border-[#e3d7cf]"
                        alt="Uploaded design"
                      />
                      <div className="text-left">
                        <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                          ✓ Custom Design Photo Attached / कस्टम फ़ोटो संलग्न
                        </span>
                        <span className="text-[13px] font-semibold text-[var(--text)]">
                          {successOrder.outfit.uploadedPhotoName || "Reference Photo"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : successOrder.outfit?.designCode ? (
                  <div className="mt-4 flex items-center justify-center">
                    <div className="inline-flex items-center gap-3 p-2.5 pr-5 rounded-2xl border border-[var(--border)] bg-[#faf7f2] shadow-sm">
                      <img
                        src={
                          DESIGN_CODE_PHOTOS[successOrder.outfit.designCode] ||
                          OUTFIT_PHOTOS[successOrder.outfit.type] ||
                          "./images/outfits/02_kurti.jpg"
                        }
                        className="h-14 w-14 rounded-xl object-cover border border-[#e3d7cf]"
                        alt={`Design Code ${successOrder.outfit.designCode}`}
                      />
                      <div className="text-left">
                        <span className="text-[11px] font-bold text-[var(--primary)] flex items-center gap-1 font-mono">
                          ✓ Design Code: {successOrder.outfit.designCode}
                        </span>
                        <span className="text-[13px] font-semibold text-[var(--text)]">
                          Studio Catalog Selection / कैटलॉग डिज़ाइन
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null}
                <p className="mt-3 text-[14px] opacity-70">
                  Thank you! We’ve received your details and will contact you to confirm pricing and delivery /
                  धन्यवाद! आपकी जानकारी हमें मिल गई है। कीमत और डिलीवरी की पुष्टि के लिए हम आपसे संपर्क करेंगे।
                </p>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setReceiptOrder(successOrder)}
                    className="flex-1 h-13 rounded-full text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-lg hover:opacity-95 transition-all cursor-pointer"
                    style={{ background: "linear-gradient(90deg,var(--primary),var(--secondary))" }}
                  >
                    <Download size={17} /> Download Slip / PDF (रसीद / PDF प्राप्त करें)
                  </button>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(generateOrderWhatsAppText(successOrder))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 h-13 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer text-center"
                  >
                    <MessageCircle size={18} /> Share on WhatsApp / वॉट्सऐप पर भेजें
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSuccessOrder(null);
                      setCurrentSection(1);
                      setCustomer({
                        name: "",
                        whatsapp: "",
                        email: "",
                        address: "",
                        landmark: "",
                        cityState: "",
                        pin: "",
                      });
                      setOutfit({
                        type: "",
                        pieces: "1",
                        designCode: "",
                        refPhoto: "",
                        specialReq: "",
                        uploadedPhoto: "",
                        uploadedPhotoName: "",
                        uploadedPhotoSize: "",
                      });
                      setDesign({
                        neckFront: "",
                        neckBack: "",
                        sleeveLength: "",
                        sleeveDesign: "",
                        fit: "Regular",
                        additionalInstructions: "",
                        frontPhoto: "",
                        frontPhotoName: "",
                        frontPhotoSize: "",
                        backPhoto: "",
                        backPhotoName: "",
                        backPhotoSize: "",
                        sleevePhoto: "",
                        sleevePhotoName: "",
                        sleevePhotoSize: "",
                      });
                      setMeasurements({
                        unit: "inch",
                        provideMethod: "Purani kapde se naap kar",
                        values: {},
                      });
                      setDelivery({
                        address: "",
                        landmark: "",
                        deliveryType: "Standard · 7–10 days",
                      });
                    }}
                    className="flex-1 h-12 rounded-full border border-stone-300 bg-white text-stone-800 font-bold text-[13.5px] hover:bg-stone-50 transition-colors"
                  >
                    New Order + / नया ऑर्डर +
                  </button>
                </div>
              </div>
            )}

            {/* FOOTER */}
            <footer className="mt-16 text-center text-[12px] text-stone-500 pb-12">
              <p>© {new Date().getFullYear()} Khwab Stitch · हमारी कारीगरी</p>
            </footer>
          </>
        )}
      </main>

      {/* LIGHTBOX */}
      {lightbox?.open && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur p-4 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative w-full max-w-[560px] rounded-[28px] overflow-hidden bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {lightbox.image ? (
              <div className="flex flex-col bg-stone-950">
                <div className="p-3.5 bg-stone-900 border-b border-stone-800 flex justify-between items-center text-white">
                  <div>
                    <div className="font-bold text-[14px]">{lightbox.title || "Design Reference"}</div>
                    <div className="text-[11px] text-stone-400">{lightbox.subtitle}</div>
                  </div>
                  <button
                    onClick={() => setLightbox(null)}
                    className="w-8 h-8 rounded-full bg-stone-700 hover:bg-stone-600 text-white flex items-center justify-center"
                  >
                    <X size={15} />
                  </button>
                </div>
                <div className="max-h-[70vh] p-4 flex items-center justify-center overflow-auto">
                  <img
                    src={lightbox.image}
                    alt={lightbox.title}
                    className="max-h-[65vh] w-auto object-contain rounded-lg"
                  />
                </div>
              </div>
            ) : (
              <>
                <div
                  className={`h-[360px] bg-gradient-to-br ${lightbox.grad} flex flex-col items-center justify-center p-8 text-center`}
                >
                  <div className="text-[48px]">🧵</div>
                  <div className="mt-4 font-bold text-[22px]">{lightbox.title}</div>
                  <div className="text-[14px] opacity-70">{lightbox.subtitle}</div>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div className="text-[12px] opacity-60">
                    {lightbox.title} · {lightbox.subtitle}
                  </div>
                  <button
                    onClick={() => setLightbox(null)}
                    className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center"
                  >
                    <X size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ORDER RECEIPT & PDF MODAL */}
      {receiptOrder && (
        <OrderReceiptModal
          order={receiptOrder}
          onClose={() => setReceiptOrder(null)}
        />
      )}
    </div>
  );
}
