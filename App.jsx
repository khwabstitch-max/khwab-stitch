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
import { useLanguage } from "./context/LanguageContext.jsx";

import {
  BRAND_CONFIG,
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

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
const apiUrl = (path) => `${API_BASE_URL}${path}`;

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

export default function App() {
  const { lang, t } = useLanguage();
  // FORM STATE
  const [currentSection, setCurrentSection] = useState(1);
  const [maxCompletedStep, setMaxCompletedStep] = useState(1);

  useEffect(() => {
    setMaxCompletedStep((prev) => Math.max(prev, currentSection));
  }, [currentSection]);
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
    uploadedPhoto: "", uploadedPhotoName: "", uploadedPhotoSize: "",
    fabricType: "own_fabric", fabricColor: ""
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
    sleeveLengthPhoto: "",
    sleeveLengthPhotoName: "",
    sleeveLengthPhotoSize: "",
  });
  const [measurements, setMeasurements] = useState({
    unit: "inch",
    provideMethod: "self_measurement",
    values: {},
  });
  const [privacyConsent, setPrivacyConsent] = useState(false);
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
  const [apiStatus, setApiStatus] = useState("checking");

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

  useEffect(() => {
    let active = true;
    const checkApi = async () => {
      try {
        const response = await fetch(apiUrl("/api/health"), { cache: "no-store" });
        if (!response.ok || (await response.json()).status !== "ok") throw new Error("Order service is unavailable.");
        if (active) setApiStatus("ready");
      } catch {
        if (active) setApiStatus("offline");
      }
    };

    try {
      sessionStorage.removeItem("khwab_admin_token");
    } catch (error) {
      console.warn("Could not clear the previous admin session from this browser.", error);
    }
    checkApi();
    const interval = window.setInterval(checkApi, 30000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (activeRole === "admin" && adminToken) {
      reloadRecords(adminToken).catch(() => {});
    }
  }, [activeRole, adminToken]);

  async function apiRequest(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("The secure order service is not configured or is unavailable.");
    }
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || `Request failed (${response.status}).`);
    return result;
  }

  async function reloadRecords(token = adminToken) {
    try {
      const result = await apiRequest(apiUrl("/api/admin/orders"), {
        headers: { authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const serverOrders = result.orders || [];
      setOrders(serverOrders);
      setAdminError("");
      return serverOrders;
    } catch (err) {
      console.warn("Backend API unavailable, loading local orders:", err);
      try {
        const localOrders = JSON.parse(localStorage.getItem("khwab_orders") || "[]");
        setOrders(localOrders);
        setAdminError("");
        return localOrders;
      } catch (e) {
        setOrders([]);
        return [];
      }
    }
  }

  const saveAdminOrder = async (order) => {
    try {
      const result = await apiRequest(apiUrl("/api/admin/orders"), {
        method: "POST",
        headers: {
          authorization: `Bearer ${adminToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(order),
      });
      const savedOrder = { ...order, orderId: result.orderId, createdAt: result.createdAt };
      setOrders((previous) => [savedOrder, ...previous.filter((item) => item.orderId !== savedOrder.orderId)]);
      return savedOrder;
    } catch (err) {
      console.warn("Backend API unavailable, saving admin order locally:", err);
      const localId = order.orderId || `KS-${Math.floor(100000 + Math.random() * 900000)}`;
      const savedOrder = { ...order, orderId: localId, createdAt: order.createdAt || new Date().toISOString() };
      setOrders((previous) => {
        const updated = [savedOrder, ...previous.filter((item) => item.orderId !== savedOrder.orderId)];
        try {
          localStorage.setItem("khwab_orders", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
      return savedOrder;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const result = await apiRequest(apiUrl(`/api/admin/orders/${encodeURIComponent(orderId)}`), {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${adminToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      setOrders((previous) => previous.map((order) => order.orderId === orderId ? result.order : order));
      return result.order;
    } catch (err) {
      console.warn("Backend API unavailable, updating order status locally:", err);
      setOrders((previous) => {
        const updated = previous.map((order) => order.orderId === orderId ? { ...order, status } : order);
        try {
          localStorage.setItem("khwab_orders", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
      return { orderId, status };
    }
  };

  const handleAdminLoginSubmit = async (passwordInput) => {
    setAdminBusy(true);
    setAdminError("");
    try {
      const input = (passwordInput || "").trim();
      if (!input) throw new Error(t("Please enter the atelier password.", "कृपया कारीगर पासवर्ड दर्ज करें।"));

      // Read configured admin password from environment (.env)
      const envPassword = (
        (typeof import.meta !== "undefined" && import.meta.env?.VITE_ADMIN_PASSWORD) ||
        "Dhaniya123"
      ).trim();

      // First attempt: Call backend API if available
      try {
        const result = await apiRequest(apiUrl("/api/admin/orders"), {
          headers: { authorization: `Bearer ${input}` },
          cache: "no-store",
        });
        setOrders(result.orders || []);
        setAdminToken(input);
        setAdminError("");
        return;
      } catch (apiError) {
        // If server explicitly returned 401 or invalid password
        const errMsg = (apiError.message || "").toLowerCase();
        if (errMsg.includes("401") || errMsg.includes("invalid password") || errMsg.includes("unauthorized") || errMsg.includes("incorrect")) {
          throw new Error(t("Incorrect password. Please try again.", "गलत पासवर्ड। कृपया पुनः प्रयास करें।"));
        }

        // If server is offline, unavailable, or on static GitHub Pages, verify directly with .env password!
        if (input === envPassword) {
          const localOrders = JSON.parse(localStorage.getItem("khwab_orders") || "[]");
          setOrders(localOrders);
          setAdminToken(input);
          setAdminError("");
          return;
        }

        throw new Error(t("Incorrect password. Please try again.", "गलत पासवर्ड। कृपया पुनः प्रयास करें।"));
      }
    } catch (error) {
      setAdminError(error.message || t("Could not sign in. Please try again.", "लॉगिन नहीं हो सका। कृपया पुनः प्रयास करें।"));
    } finally {
      setAdminBusy(false);
    }
  };

  const handleAdminLogout = () => {
    setAdminToken("");
    setOrders([]);
  };

  const refreshOrders = async () => {
    if (!adminToken) return;
    setAdminBusy(true);
    try {
      await reloadRecords(adminToken);
    } catch (error) {
      const localOrders = JSON.parse(localStorage.getItem("khwab_orders") || "[]");
      setOrders(localOrders);
    } finally {
      setAdminBusy(false);
    }
  };

  const downloadOrdersCsv = async () => {
    setAdminBusy(true);
    setAdminError("");
    try {
      const response = await fetch(apiUrl("/api/admin/export.csv"), {
        headers: { authorization: `Bearer ${adminToken}` },
        cache: "no-store",
      });
      if (!response.ok || !response.headers.get("content-type")?.includes("text/csv")) {
        throw new Error("Server CSV export unavailable.");
      }
      const url = URL.createObjectURL(await response.blob());
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "khwab-stitch-orders.csv";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      try {
        const headers = ["Order ID", "Date", "Customer Name", "WhatsApp", "Status", "Outfit", "Pieces", "Delivery Address", "PIN"];
        const rows = orders.map((o) => [
          o.orderId || "",
          o.createdAt || "",
          `"${(o.customer?.name || "").replace(/"/g, '""')}"`,
          o.customer?.whatsapp || "",
          o.status || "New",
          o.outfit?.type || "",
          o.outfit?.pieces || 1,
          `"${(o.delivery?.address || o.customer?.address || "").replace(/"/g, '""')}"`,
          o.customer?.pin || "",
        ]);
        const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `khwab-stitch-orders-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (err) {
        setAdminError(err.message || "Could not export CSV.");
      }
    } finally {
      setAdminBusy(false);
    }
  };

  // Helpers
  const selectOutfit = (t) => {
    if (!t) return;
    setOutfit((current) => {
      const isSelected = current.type === t;
      return {
        ...current,
        type: isSelected ? "" : t,
      };
    });
    setStepError("");
  };
  const selectDesign = (type, value) => {
    setDesign((prev) => ({
      ...prev,
      [type]: prev[type] === value ? "" : value,
    }));
  };
  const showMeasurements = () => {
    return outfit.type ? measurementConfigs[outfit.type] || measurementConfigs.Other : [];
  };
  const openLightbox = (title, gradOrImage, subtitle, image) => {
    const isImg = typeof gradOrImage === "string" && (
      gradOrImage.startsWith("./") ||
      gradOrImage.startsWith("/") ||
      gradOrImage.startsWith("http") ||
      gradOrImage.startsWith("data:") ||
      gradOrImage.includes(".jpg") ||
      gradOrImage.includes(".png")
    );
    if (isImg) {
      setLightbox({ open: true, title, image: gradOrImage, subtitle });
    } else if (image) {
      setLightbox({ open: true, title, image, subtitle });
    } else {
      setLightbox({ open: true, title, grad: gradOrImage, subtitle });
    }
  };

  const openReceipt = (order) => {
    setReceiptOrder(order);
  };

  const saveOrder = async () => {
    const digitsOnly = (customer.whatsapp || "").replace(/\D/g, "");
    const clean10 = digitsOnly.length === 12 && digitsOnly.startsWith("91") ? digitsOnly.slice(2) : digitsOnly;
    if (clean10.length !== 10) {
      setStepError(t("Please enter a valid 10-digit WhatsApp number.", "कृपया 10 अंकों का मान्य वॉट्सऐप नंबर दर्ज करें।"));
      setCurrentSection(2);
      return;
    }
    if (![customer.name, customer.address, customer.pin].every((value) => value && value.trim())) {
      setStepError(t("Please fill in your name, address, and PIN.", "कृपया नाम, पूरा पता और पिन कोड भरें।"));
      setCurrentSection(2);
      return;
    }
    if (!outfit.type) {
      setStepError(t("Please select an outfit.", "कृपया परिधान चुनें।"));
      setCurrentSection(3);
      return;
    }
    if (!privacyConsent) {
      setStepError(t(
        "Please confirm how your order details will be used before placing the order.",
        "ऑर्डर देने से पहले कृपया अपनी जानकारी के उपयोग की सहमति दें।"
      ));
      return;
    }

    setBusy(true);
    setStepError("");
    const cleanCustomer = {
      ...customer,
      whatsapp: clean10,
      pin: (customer.pin || "").replace(/\D/g, "").slice(0, 6),
      cityState: customer.cityState || [customer.city, customer.state].filter(Boolean).join(", ") || customer.city || "Not specified",
    };
    const order = {
      customer: cleanCustomer,
      outfit,
      design,
      measurements: { ...measurements, values: { ...(measurements?.values || {}) } },
      privacyConsent: true,
      delivery: {
        ...delivery,
        address: delivery.address || customer.address,
        landmark: delivery.landmark || customer.landmark || "",
      },
      createdAt: new Date().toISOString(),
    };

    try {
      let savedOrder;
      try {
        const result = await apiRequest(apiUrl("/api/orders"), {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(order),
        });
        savedOrder = { ...order, orderId: result.orderId, createdAt: result.createdAt };
      } catch (err) {
        console.warn("Backend API unavailable, saving order locally for WhatsApp booking:", err);
        const localId = `KS-${Math.floor(100000 + Math.random() * 900000)}`;
        savedOrder = { ...order, orderId: localId, createdAt: new Date().toISOString(), localOnly: true };
        try {
          const localList = JSON.parse(localStorage.getItem("khwab_orders") || "[]");
          localStorage.setItem("khwab_orders", JSON.stringify([savedOrder, ...localList]));
        } catch (e) {}
      }

      setCustomer(cleanCustomer);
      setSuccessOrder(savedOrder);
      setReceiptOrder(savedOrder);
      setEditingFromReview(false);
    } catch (error) {
      setStepError(t(
        `Your order could not be saved: ${error.message}. Your details are still on this page; please try again.`,
        `आपका ऑर्डर सुरक्षित नहीं हो सका: ${error.message}। आपकी जानकारी इस पेज पर सुरक्षित है; कृपया फिर कोशिश करें।`
      ));
    } finally {
      setBusy(false);
    }
  };

  const validateAndSyncCustomer = () => {
    if (!customer.name?.trim()) {
      setStepError(t("Please enter your full name.", "कृपया अपना पूरा नाम भरें।"));
      return false;
    }

    // WhatsApp 10-digit validation
    const digitsOnly = (customer.whatsapp || "").replace(/\D/g, "");
    const clean10 = digitsOnly.length === 12 && digitsOnly.startsWith("91") ? digitsOnly.slice(2) : digitsOnly;
    if (clean10.length !== 10) {
      setStepError(t("Please enter a valid 10-digit WhatsApp number.", "कृपया 10 अंकों का मान्य वॉट्सऐप नंबर दर्ज करें।"));
      return false;
    }

    if (!customer.address?.trim()) {
      setStepError(t("Please enter your full delivery address.", "कृपया पूरा डिलीवरी पता भरें।"));
      return false;
    }

    if (!customer.city?.trim()) {
      setStepError(t("Please select or enter your city.", "कृपया शहर चुनें या लिखें।"));
      return false;
    }

    if (!customer.state?.trim()) {
      setStepError(t("Please select your state.", "कृपया राज्य चुनें।"));
      return false;
    }

    // PIN 6-digit validation
    const pinDigits = (customer.pin || "").replace(/\D/g, "");
    if (pinDigits.length !== 6) {
      setStepError(t("Please enter a valid 6-digit PIN code.", "कृपया 6 अंकों का सही पिन कोड दर्ज करें।"));
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
        setStepError(t("Please choose an outfit before continuing.", "कृपया आगे बढ़ने से पहले परिधान चुनें।"));
        return;
      }
    } else if (currentSection === 4) {
      setDesign((prev) => ({
        ...prev,
        neckFront: prev.neckFront || (prev.frontPhoto ? "as-photo" : "round"),
        neckBack: prev.neckBack || (prev.backPhoto ? "as-photo" : "simple"),
        sleeveLength: prev.sleeveLength || (prev.sleeveLengthPhoto ? "as-photo" : "full"),
        sleeveDesign: prev.sleeveDesign || (prev.sleevePhoto ? "as-photo" : "straight"),
      }));
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
      setStepError(t("Please choose an outfit before continuing.", "कृपया आगे बढ़ने से पहले परिधान चुनें।"));
      return;
    }
    if (currentSection === 4) {
      // Auto-fallback: round neck, simple back, full sleeves, straight sleeve if left unchosen
      setDesign((prev) => ({
        ...prev,
        neckFront: prev.neckFront || (prev.frontPhoto ? "as-photo" : "round"),
        neckBack: prev.neckBack || (prev.backPhoto ? "as-photo" : "simple"),
        sleeveLength: prev.sleeveLength || (prev.sleeveLengthPhoto ? "as-photo" : "full"),
        sleeveDesign: prev.sleeveDesign || (prev.sleevePhoto ? "as-photo" : "straight"),
      }));
    }
    if (currentSection === 6) {
      if (!customer.address?.trim() && !delivery.address?.trim()) {
        setStepError("कृपया डिलीवरी का पता भरें · Please enter your delivery address.");
        return;
      }
      saveOrder();
      return;
    }

    if (currentSection >= 5) {
      setEditingFromReview(false);
    }

    setCurrentSection((section) => Math.min(6, section + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteOrder = async (orderId) => {
    if (!confirm(t(`Delete order ${orderId}?`, `क्या आप ऑर्डर ${orderId} हटाना चाहते हैं?`))) return;
    setAdminError("");
    try {
      await apiRequest(apiUrl(`/api/admin/orders/${encodeURIComponent(orderId)}`), {
        method: "DELETE",
        headers: { authorization: `Bearer ${adminToken}` },
      });
    } catch (err) {
      console.warn("Server delete unavailable, deleting locally:", err);
    }
    setOrders((previous) => {
      const updated = previous.filter((order) => order.orderId !== orderId);
      try {
        localStorage.setItem("khwab_orders", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const clearOrders = async () => {
    if (!confirm(t("Delete all orders?", "क्या आप सभी ऑर्डर हटाना चाहते हैं?"))) return;
    setAdminError("");
    try {
      await apiRequest(apiUrl("/api/admin/orders"), {
        method: "DELETE",
        headers: { authorization: `Bearer ${adminToken}` },
      });
    } catch (err) {
      console.warn("Server clear unavailable, clearing locally:", err);
    }
    setOrders([]);
    try {
      localStorage.removeItem("khwab_orders");
    } catch (e) {}
  };

  return (
    <div data-safe-area-inset-root className="min-h-screen flex flex-col justify-between w-full overflow-x-clip bg-[var(--bg)] text-[var(--text)]"
      style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)' }}>
      <StepHeader
        currentSection={currentSection}
        activeMode={activeRole}
        onNavigateCustomer={navigateToCustomer}
        onNavigateAdmin={navigateToAdmin}
        maxCompletedStep={maxCompletedStep}
        editingFromReview={editingFromReview}
        hasSuccessOrder={Boolean(successOrder)}
        onJumpToSection={(sec) => {
          // If order is confirmed, do not allow jumping back to wizard steps
          if (successOrder) return;
          if (sec === currentSection) return;

          // Only allow jumping forward if step has been unlocked or editing from Review returning to Step 6
          const isAllowed = sec <= maxCompletedStep || (editingFromReview && sec === 6);
          if (!isAllowed) {
            setStepError(t("Please complete each step in order before continuing.", "कृपया क्रमबद्ध रूप से अगले चरण पर बढ़ें।"));
            return;
          }

          setStepError("");
          if (sec === 6) {
            if (currentSection === 2 && !validateAndSyncCustomer()) return;
            if (currentSection === 3 && !outfit.type) {
              setStepError(t("Please choose an outfit before continuing.", "कृपया आगे बढ़ने से पहले परिधान चुनें।"));
              return;
            }
            setEditingFromReview(false);
          } else if (currentSection === 6 && sec < 6) {
            setEditingFromReview(true);
          }
          setCurrentSection(sec);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        ordersCount={orders.length}
      />

      {/* MAIN */}
      <main className="flex-1 mx-auto max-w-[1000px] w-full px-3 sm:px-4 md:px-8 pb-28 pt-4">
        {activeRole === "admin" ? (
          /* MASTER TAILOR ATELIER PAGE (/admin) */
          adminToken ? (
            <AdminDashboard
              orders={orders}
              adminToken={adminToken}
              onRefresh={refreshOrders}
              onSaveOrder={saveAdminOrder}
              onUpdateStatus={updateOrderStatus}
              errorMessage={adminError}
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
            {!successOrder && editingFromReview && currentSection < 6 && (
              <div className="mt-4 mb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border-2 border-amber-300 bg-amber-50/95 px-4 sm:px-5 py-3.5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white font-bold text-base shadow-xs">
                    ✏️
                  </span>
                  <div>
                    <p className="text-[13.5px] font-bold text-amber-950 flex flex-wrap items-center gap-2">
                      <span>{t(`Editing Step 0${currentSection}`, `बदलाव मोड · चरण 0${currentSection}`)}</span>
                      <span className="text-[11px] font-normal text-amber-900 bg-amber-200/90 px-2.5 py-0.5 rounded-full">
                        {t("Other details are safely preserved", "बाकी सभी नाप व जानकारी सुरक्षित हैं")}
                      </span>
                    </p>
                    <p className="text-[12px] text-amber-800 mt-0.5">
                      {t(
                        "Change only what you want to modify, then click Save & Return to go straight back to Step 6.",
                        "केवल वही बदलें जिसे आप संशोधित करना चाहते हैं, फिर सीधे समीक्षा पर लौटने के लिए 'सहेजें और लौटें' पर क्लिक करें।"
                      )}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={saveAndReturnToReview}
                  className="w-full sm:w-auto shrink-0 h-10 px-5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer whitespace-nowrap"
                >
                  <Check size={16} /> {t("Save & Return (Step 6)", "सहेजें और लौटें (चरण 6)")}
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
                    design={design}
                    setDesign={setDesign}
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
                    privacyConsent={privacyConsent}
                    setPrivacyConsent={setPrivacyConsent}
                  />
                )}

                {stepError && currentSection !== 3 && (
                  <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">
                    {stepError}
                  </p>
                )}

                {/* FLOATING ACTION BOTTOM BAR */}
                <div className="sticky bottom-3 sm:bottom-5 z-20 w-full max-w-[560px] mx-auto px-1 sm:px-0">
                  <div className="flex items-center gap-2.5 sm:gap-3 rounded-full border-2 border-[#eedfd6] bg-white/95 p-1.5 sm:p-2 shadow-2xl backdrop-blur-md">
                    <button
                      type="button"
                      disabled={currentSection === 2}
                      onClick={() => {
                        setStepError("");
                        setCurrentSection((s) => Math.max(2, s - 1));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="flex-1 h-11 sm:h-12 rounded-full border border-[#ded2c4] bg-[#fdfaf8] font-bold text-[13px] sm:text-[14px] text-stone-700 flex items-center justify-center gap-1.5 shadow-2xs hover:bg-[#f6eee7] hover:text-[var(--primary)] transition-all disabled:opacity-35 disabled:hover:bg-[#fdfaf8] disabled:hover:text-stone-700 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronLeft size={16} />
                      <span>{t("Back", "पीछे")}</span>
                    </button>

                    {currentSection < 6 ? (
                      <button
                        type="submit"
                        className="flex-1 h-11 sm:h-12 rounded-full text-white font-bold text-[13px] sm:text-[14px] flex items-center justify-center gap-1.5 shadow-md hover:opacity-95 hover:shadow-lg transition-all cursor-pointer"
                        style={{ background: "linear-gradient(90deg,var(--primary),var(--secondary))" }}
                      >
                        <span>{t("Next", "आगे बढ़ें")}</span>
                        <ChevronRight size={16} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={busy}
                        className="flex-1 h-11 sm:h-12 px-2 sm:px-3 rounded-full text-white font-bold text-[12.5px] sm:text-[14px] flex items-center justify-center gap-1.5 shadow-md disabled:opacity-60 hover:opacity-95 hover:shadow-lg transition-all cursor-pointer"
                        style={{ background: "linear-gradient(90deg,var(--primary),var(--secondary))" }}
                      >
                        {busy ? (
                          <span>{t("Submitting...", "भेजा जा रहा है...")}</span>
                        ) : (
                          <>
                            <Check size={16} className="shrink-0" />
                            <span className="truncate">{t("Confirm & Place Order", "ऑर्डर कन्फर्म करें")}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
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
                    src={BRAND_CONFIG?.logo || "./images/brand/logo.jpg"}
                    alt="Khwab Stitch Logo"
                    className="h-20 w-20 rounded-full object-cover border-2 border-[#dfc5b5] shadow-md"
                    onError={(e) => {
                      e.currentTarget.src = "./images/khwabstitch_logo.jpg";
                    }}
                  />
                  <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--success)] text-white shadow-sm">
                    <Check size={16} />
                  </span>
                </div>
                <h2 className="mt-4 text-[28px] font-bold">{t("Order Confirmed! ✨", "ऑर्डर दर्ज हो गया! ✨")}</h2>
                <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-light)] font-bold text-[14px]">
                  {successOrder.orderId} • {successOrder.outfit?.type || "Custom Outfit"}
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
                          {t("✓ Custom Design Photo Attached", "✓ कस्टम फ़ोटो संलग्न")}
                        </span>
                        <span className="text-[13px] font-semibold text-[var(--text)]">
                          {successOrder.outfit.uploadedPhotoName || t("Reference Photo", "रेफ़रेंस फ़ोटो")}
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
                          {t(`✓ Design Code: ${successOrder.outfit.designCode}`, `✓ डिज़ाइन कोड: ${successOrder.outfit.designCode}`)}
                        </span>
                        <span className="text-[13px] font-semibold text-[var(--text)]">
                          {t("Studio Catalog Selection", "कैटलॉग डिज़ाइन")}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null}
                <p className="mt-3 text-[14px] text-stone-700 font-medium">
                  {t(
                    "Thank you! We’ve received your order details. You can download your official slip or connect directly with our master tailor on WhatsApp.",
                    "धन्यवाद! आपकी जानकारी हमें मिल गई है। आप अपनी अधिकृत रसीद डाउनलोड कर सकते हैं या वॉट्सऐप पर सीधे मास्टर जी से बात कर सकते हैं।"
                  )}
                </p>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setReceiptOrder(successOrder)}
                    className="flex-1 h-12 sm:h-13 rounded-full text-white font-bold text-[13.5px] sm:text-[14px] flex items-center justify-center gap-2 shadow-lg hover:opacity-95 transition-all cursor-pointer"
                    style={{ background: "linear-gradient(90deg,var(--primary),var(--secondary))" }}
                  >
                    <Download size={17} /> {t("Download Slip / PDF", "रसीद / PDF प्राप्त करें")}
                  </button>
                  <a
                    href={`https://wa.me/91${(BRAND_CONFIG?.helpline || "9876543210").replace(/\D/g, "")}?text=${encodeURIComponent(
                      generateOrderWhatsAppText(successOrder)
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 h-12 sm:h-13 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[13.5px] sm:text-[14px] flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <MessageCircle size={17} /> {t("Send on WhatsApp", "वॉट्सऐप पर भेजें")}
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSuccessOrder(null);
                      setCurrentSection(1);
                      setMaxCompletedStep(1);
                      setEditingFromReview(false);
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
                        fabricType: "own_fabric",
                        fabricColor: "",
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
                      setPrivacyConsent(false);
                      setDelivery({
                        address: "",
                        landmark: "",
                        deliveryType: "Standard · 7–10 days",
                      });
                    }}
                    className="flex-1 h-12 rounded-full border border-stone-300 bg-white text-stone-800 font-bold text-[13.5px] hover:bg-stone-50 transition-colors"
                  >
                    {t("New Order +", "नया ऑर्डर +")}
                  </button>
                </div>
              </div>
            )}

          </>
        )}
      </main>

      {/* GLOBAL LUXURY ATELIER FOOTER */}
      <footer className="w-full border-t border-[#ebdcd0] bg-[#faf6f2]/90 py-7 sm:py-9 px-4 mt-auto">
        <div className="mx-auto max-w-[900px] flex flex-col items-center justify-center text-center space-y-3">
          <div className="flex items-center gap-2 select-none">
            <img
              src={BRAND_CONFIG?.logo || "./images/brand/logo.jpg"}
              alt="Khwab Stitch Logo"
              className="h-7 w-7 rounded-full object-cover border border-[#c4994d]"
              onError={(e) => { e.currentTarget.src = "./images/khwabstitch_logo.jpg"; }}
            />
            <span className="font-serif font-bold text-[15px] text-[var(--primary-dark)]">
              {BRAND_CONFIG?.name || "Khwab Stitch"}
            </span>
            <span className="text-stone-400">•</span>
            <span className="text-[12px] font-medium text-stone-600">
              {t("Where Fabric Becomes Art · Bespoke Atelier", "हमारी कारीगरी · ख़्वाब स्टिच")}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[12.5px] font-semibold text-stone-700">
            <a
              href={`https://wa.me/91${(BRAND_CONFIG?.helpline || "9876543210").replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--primary)] transition-colors inline-flex items-center gap-1"
            >
              <span>WhatsApp: {BRAND_CONFIG?.helpline || "+91 98765 43210"}</span>
            </a>
            <span className="text-stone-300 hidden sm:inline">•</span>
            <a
              href={`https://instagram.com/${(BRAND_CONFIG?.instagram || "khwabstitch").replace(/^@/, "")}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--primary)] transition-colors inline-flex items-center gap-1"
            >
              <span>Instagram: {BRAND_CONFIG?.instagram || "@khwabstitch"}</span>
            </a>
            {BRAND_CONFIG?.website && (
              <>
                <span className="text-stone-300 hidden sm:inline">•</span>
                <a
                  href={BRAND_CONFIG.website.startsWith("http") ? BRAND_CONFIG.website : `https://${BRAND_CONFIG.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[var(--primary)] transition-colors"
                >
                  {BRAND_CONFIG.website}
                </a>
              </>
            )}
            <span className="text-stone-300 hidden sm:inline">•</span>
            <button
              type="button"
              onClick={activeRole === "admin" ? navigateToCustomer : navigateToAdmin}
              className="text-[var(--primary)] hover:underline text-[12px] font-bold cursor-pointer"
            >
              {activeRole === "admin"
                ? t("Customer Website / ग्राहक वेबसाइट", "ग्राहक वेबसाइट पर जाएं")
                : t("Master Tailor Portal / कारीगर लॉगिन", "कारीगर पोर्टल")}
            </button>
          </div>

          <p className="text-[11.5px] text-stone-500 pt-1">
            © {new Date().getFullYear()} {BRAND_CONFIG?.name || "Khwab Stitch"}. All rights reserved. {t("Custom Tailoring & Studio", "कस्टम सिलाई व डिज़ाइनर बुटीक")}
          </p>
        </div>
      </footer>

      {/* LIGHTBOX */}
      {lightbox?.open && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur p-4 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative w-full max-w-[880px] rounded-[28px] overflow-hidden bg-white shadow-2xl"
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
