import { useState, useEffect } from "react";
import { Check, X, Heart, Search, Trash2, Download, FileText, ChevronRight, ChevronLeft, Star, Scissors, Eye } from "lucide-react";
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

// SECTION DATA
const outfitTypes = [
  {
    id: "Blouse",
    en: "Blouse (Saree / Lehenga)",
    hi: "ब्लाउज़ / चोली",
    desc: "साड़ी और लहंगे के लिए डिज़ाइनर ब्लाउज़",
    popular: true,
    badge: "🔥 Most Popular · सर्वाधिक पसंदीदा",
    image: "./images/blouse.jpg",
  },
  {
    id: "Kurti",
    en: "Kurti",
    hi: "कुर्ती / कुर्ती टॉप",
    desc: "स्ट्रेट, ए-लाइन व फ़ेस्टिव कुर्ती",
    popular: false,
    badge: "✨ Daily & Festive",
    image: "./images/kurti.jpg",
  },
  {
    id: "Suit Upper",
    en: "Suit Upper / Kameez",
    hi: "कमीज़ / सूट अपर",
    desc: "सलवार सूट व पंजाबी कमीज़ अपर",
    popular: false,
    badge: "🌸 Classic Traditional",
    image: "./images/suit-upper.jpg",
  },
];

const neckFront = [
  { id: "round", en: "Round Neck", hi: "Gol Gala", hiScript: "गोल गला", grad: "from-rose-200 to-pink-300" },
  { id: "vneck", en: "V-Neck", hi: "V Gala", hiScript: "वी गला", grad: "from-violet-200 to-purple-300" },
  { id: "boat", en: "Boat Neck", hi: "Naav Gala", hiScript: "नाव गला", grad: "from-amber-200 to-orange-300" },
  { id: "collar", en: "Collar Neck", hi: "Collar Wala", hiScript: "कॉलर वाला", grad: "from-emerald-200 to-teal-300" },
  { id: "square", en: "Square Neck", hi: "Chokor Gala", hiScript: "चोकोर गला", grad: "from-sky-200 to-blue-300" },
  { id: "sweetheart", en: "Sweetheart", hi: "Dil Wala Gala", hiScript: "दिल वाला गला", grad: "from-fuchsia-200 to-pink-300" },
  { id: "high", en: "High Neck", hi: "Band Gala", hiScript: "बंद गला", grad: "from-slate-200 to-gray-300" },
  { id: "mandarin", en: "Mandarin Collar", hi: "Chinese Gala", hiScript: "चाइनीज़ गला", grad: "from-lime-200 to-green-300" },
];
const neckBack = [
  { id: "simple", en: "Simple Back", hi: "Seedha Back", hiScript: "सीधा बैक", grad: "from-rose-100 to-pink-200" },
  { id: "round-back", en: "Round Back", hi: "Gol Back", hiScript: "गोल बैक", grad: "from-purple-100 to-violet-200" },
  { id: "v-back", en: "V-Back", hi: "V Back", hiScript: "वी बैक", grad: "from-amber-100 to-yellow-200" },
  { id: "square-back", en: "Square Back", hi: "Chokor Back", hiScript: "चोकोर बैक", grad: "from-cyan-100 to-sky-200" },
  { id: "deep", en: "Deep Back", hi: "Gehra Back", hiScript: "गहरा बैक", grad: "from-red-100 to-rose-200" },
  { id: "button", en: "Button Back", hi: "Button Wala", hiScript: "बटन वाला", grad: "from-emerald-100 to-green-200" },
  { id: "cutout", en: "Cut-out Back", hi: "Jali Wala", hiScript: "जाली वाला", grad: "from-orange-100 to-amber-200" },
  { id: "as-photo", en: "As per Photo", hi: "Photo Jaisa", hiScript: "फोटो जैसा", grad: "from-zinc-100 to-stone-200" },
];
const sleeveLengthData = [
  { id: "sleeveless", en: "Sleeveless", hi: "Bina Baaju", hiScript: "बिना बाज़ू", cm: "0 cm (0\")", desc: "Length: 0 cm · Shoulder: 38 cm" },
  { id: "quarter", en: "1/4 Sleeve", hi: "Chauthai Baaju", hiScript: "चौथाई बाज़ू", cm: "10 cm (4\")", desc: "Length: 10 cm · Opening: 28 cm" },
  { id: "half", en: "1/2 Sleeve", hi: "Aadhi Baaju", hiScript: "आधी बाज़ू", cm: "20 cm (7.9\")", desc: "Length: 20 cm · Opening: 30 cm" },
  { id: "three-quarter", en: "3/4 Sleeve", hi: "Pauni Baaju", hiScript: "पौनी बाज़ू", cm: "38 cm (15\")", desc: "Length: 38 cm · Opening: 24 cm" },
  { id: "full", en: "Full Sleeve", hi: "Puri Baaju", hiScript: "पूरी बाज़ू", cm: "55 cm (21.7\")", desc: "Length: 55 cm · Opening: 22 cm" },
];
const sleeveDesign = [
  { id: "straight", en: "Straight Plain", hi: "Seedhi Baaju", hiScript: "सीधी बाज़ू" },
  { id: "puff", en: "Puff Sleeve", hi: "Phuli Baaju", hiScript: "फूली बाज़ू" },
  { id: "bell", en: "Bell Sleeve", hi: "Ghanti Baaju", hiScript: "घंटी बाज़ू" },
  { id: "ruffle", en: "Ruffle", hi: "Jhalar Frill", hiScript: "झालर बाज़ू" },
  { id: "cap", en: "Cap Sleeve", hi: "Choti Topi", hiScript: "छोटी टोपी" },
  { id: "bishop", en: "Bishop Balloon", hi: "Gubbare Jaisi", hiScript: "गुब्बारे जैसी" },
  { id: "butterfly", en: "Butterfly", hi: "Titli Baaju", hiScript: "तितली बाज़ू" },
  { id: "cold", en: "Cold Shoulder", hi: "Kandha Khula", hiScript: "कंधा खुला" },
  { id: "flutter", en: "Flutter", hi: "Leher Baaju", hiScript: "लहर बाज़ू" },
  { id: "bell-cuff", en: "Bell-Cuff", hi: "Cuff Wali", hiScript: "कफ़ वाली" },
  { id: "pleated", en: "Pleated", hi: "Chunnet Wali", hiScript: "चुन्नट वाली" },
];

const measurementConfigs = {
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
    { key: "suitLength", num: "1", en: "Suit / Kameez Length", hi: "कमीज़ लंबाई", help: "कंधे से नीचे कुल लंबाई (Point 1 on sketch)" },
    { key: "bust", num: "2", en: "Around Bust", hi: "छाती / चेस्ट", help: "छाती की पूरी गोलाई (Point 2 on sketch)" },
    { key: "waist", num: "3", en: "Around Above Waist", hi: "कमर की गोलाई", help: "नाभि के ऊपर कमर की गोलाई (Point 3 on sketch)" },
    { key: "hip", num: "4", en: "Around Hip", hi: "हिप की गोलाई", help: "कूल्हे / हिप की पूरी गोलाई (Point 4 on sketch)" },
    { key: "armhole", num: "5", en: "Around Armhole", hi: "आर्महोल / कांख", help: "कांख की पूरी गोलाई (Point 5 on sketch)" },
    { key: "shoulder", num: "6", en: "Shoulder Width", hi: "कंधा चौड़ाई", help: "एक कंधे से दूसरे कंधे तक (Point 6 on sketch)" },
    { key: "sleeveLength", num: "7", en: "Sleeve Length", hi: "बाज़ू लंबाई", help: "कंधे से आस्तीन तक (Point 7 on sketch)" },
    { key: "sideSlit", num: "8", en: "Side Slit / Chak Length", hi: "साइड चाक / चीर", help: "कमर से साइड चाक का खुला हिस्सा (Point 8)" },
    { key: "frontNeck", num: "9", en: "Front Neck Deep", hi: "आगे गले की गहराई", help: "कंधे से आगे गले की गहराई (Point 9 on sketch)" },
    { key: "backNeck", num: "10", en: "Back Neck Deep", hi: "पीछे गले की गहराई", help: "कंधे से पीछे गले की गहराई (Point 10 on sketch)" },
  ],
};

const CLOUD_BRIDGE_TOPIC = "khwab_stitch_orders_atelier_prod_v1";
const CLOUD_BRIDGE_URL = `https://ntfy.sh/${CLOUD_BRIDGE_TOPIC}`;

const syncOrderToCloud = async (order) => {
  try {
    const lightweightOrder = {
      ...order,
      outfit: {
        ...order.outfit,
        uploadedPhoto: (order.outfit?.uploadedPhoto && order.outfit.uploadedPhoto.length < 30000) ? order.outfit.uploadedPhoto : "",
      },
    };
    await fetch(CLOUD_BRIDGE_URL, {
      method: "POST",
      headers: {
        "Title": `Order #${order.orderId || "NEW"} - ${order.customer?.name || "Customer"} (${order.outfit?.type || "Custom Outfit"})`,
        "Tags": "dress,sparkles,shopping_bags",
        "Priority": "4",
      },
      body: JSON.stringify(lightweightOrder),
    });
  } catch (err) {
    console.warn("Cloud sync note:", err);
  }
};

const fetchCloudOrders = async () => {
  try {
    const res = await fetch(`${CLOUD_BRIDGE_URL}/json?poll=1&since=all`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const text = await res.text();
    const lines = text.trim().split("\n");
    const cloudOrders = [];
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const item = JSON.parse(line);
        if (item.event === "message" && item.message) {
          const parsedOrder = JSON.parse(item.message);
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
  const [customer, setCustomer] = useState({ name: "", whatsapp: "", email: "", address: "", landmark: "", cityState: "", pin: "" });
  const [outfit, setOutfit] = useState({
    type: "", pieces: "1", designCode: "", refPhoto: "As per design selection", specialReq: "",
    uploadedPhoto: "", uploadedPhotoName: "", uploadedPhotoSize: ""
  });
  const [design, setDesign] = useState({ neckFront: "", neckBack: "", sleeveLength: "", sleeveDesign: "", fit: "Regular", additionalInstructions: "" });
  const [measurements, setMeasurements] = useState({
    unit: "inch",
    provideMethod: "Self measurement / खुद से नाप लेकर",
    values: {},
  });
  const [delivery, setDelivery] = useState({ address: "", landmark: "", deliveryType: "Standard · 7–10 days" });
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
      try {
        localStorage.setItem("khwab_local_orders", JSON.stringify(updated));
      } catch (quotaErr) {
        console.warn("Storage quota limit reached, saving lightweight details:", quotaErr);
        const lightweight = updated.map((o, idx) => ({
          ...o,
          outfit: {
            ...o.outfit,
            uploadedPhoto: idx === 0 ? o.outfit?.uploadedPhoto : "",
          },
        }));
        try {
          localStorage.setItem("khwab_local_orders", JSON.stringify(lightweight));
        } catch {
          const textOnly = updated.map((o) => ({
            ...o,
            outfit: { ...o.outfit, uploadedPhoto: "" },
          }));
          localStorage.setItem("khwab_local_orders", JSON.stringify(textOnly));
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
    setOutfit((current) => ({
      ...current,
      type: current.type === t ? "" : t,
    }));
    setStepError("");
    setMeasurements((current) => ({ ...current, values: {} }));
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
    if (![customer.name, customer.whatsapp, customer.address, customer.cityState, customer.pin].every((value) => value && value.trim())) {
      alert("कृपया नाम, वॉट्सऐप, पूरा पता, शहर और पिन कोड भरें · Please fill in name, WhatsApp, address, city & PIN");
      setCurrentSection(2);
      return;
    }
    if (!outfit.type) { alert("कृपया परिधान चुनें · Please select an outfit"); setCurrentSection(3); return; }

    setBusy(true);
    const finalDelivery = {
      ...delivery,
      address: delivery.address || customer.address,
      landmark: delivery.landmark || customer.landmark || "",
    };
    const order = {
      customer,
      outfit,
      design,
      measurements: {
        ...measurements,
        values: Object.fromEntries(
          showMeasurements()
            .filter(({ key }) => measurements.values[key])
            .map(({ key }) => [key, measurements.values[key]]),
        ),
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
    } catch (e) {
      console.warn("API request failed, saving order locally & syncing to cloud:", e);
      const fallbackId = `KS${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const savedOrder = { ...order, orderId: fallbackId };
      saveLocalOrder(savedOrder);
      syncOrderToCloud(savedOrder);
      setSuccessOrder(savedOrder);
    } finally {
      setBusy(false);
    }
  };

  const handleStepSubmit = (event) => {
    event.preventDefault();
    setStepError("");
    if (currentSection === 2) {
      const requiredCustomerFields = [customer.name, customer.whatsapp, customer.address, customer.cityState, customer.pin];
      if (requiredCustomerFields.some((value) => !value || !value.trim())) {
        setStepError("कृपया नाम, वॉट्सऐप, पूरा पता, शहर और पिन कोड भरें · Please fill in all required details.");
        return;
      }
      // Keep delivery address in sync with customer address
      setDelivery((prev) => ({
        ...prev,
        address: prev.address || customer.address,
        landmark: prev.landmark || customer.landmark || "",
      }));
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
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setStepError("");
                          setCurrentSection(6);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="h-12 px-3.5 sm:px-4 rounded-full border border-[var(--primary)]/30 bg-[#fffbf7] text-[var(--primary)] font-bold text-[12.5px] sm:text-[13px] flex items-center justify-center gap-1.5 shadow-2xs hover:bg-[var(--primary)] hover:text-white transition-all cursor-pointer"
                        title="Skip straight to Order Review / सीधे संपूर्ण सारांश पर जाएँ"
                      >
                        <Eye size={15} />
                        <span className="hidden sm:inline">Review / सारांश (Step 6)</span>
                        <span className="sm:hidden">सारांश</span>
                      </button>

                      <button
                        type="submit"
                        className="flex-[1.5] h-12 rounded-full text-white font-bold text-[13.5px] sm:text-[14px] flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-opacity cursor-pointer"
                        style={{ background: "linear-gradient(90deg,var(--primary),var(--secondary))" }}
                      >
                        Next / आगे बढ़ें <ChevronRight size={17} />
                      </button>
                    </>
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
                {successOrder.outfit?.uploadedPhoto && (
                  <div className="mt-4 flex items-center justify-center">
                    <div className="inline-flex items-center gap-3 p-2.5 pr-5 rounded-2xl border border-[var(--border)] bg-[#faf7f2] shadow-sm">
                      <img
                        src={successOrder.outfit.uploadedPhoto}
                        className="h-14 w-14 rounded-xl object-cover border border-[#e3d7cf]"
                        alt="Uploaded design"
                      />
                      <div className="text-left">
                        <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                          ✓ Design Photo Attached / डिज़ाइन फ़ोटो संलग्न
                        </span>
                        <span className="text-[13px] font-semibold text-[var(--text)]">
                          {successOrder.outfit.uploadedPhotoName || "Reference Photo"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <p className="mt-3 text-[14px] opacity-70">
                  Thank you! We’ve received your details and will contact you to confirm pricing and delivery /
                  धन्यवाद! आपकी जानकारी हमें मिल गई है। कीमत और डिलीवरी की पुष्टि के लिए हम आपसे संपर्क करेंगे।
                </p>

                {/* 1-TAP WHATSAPP DISPATCH TO ATELIER */}
                <div className="mt-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <p className="text-[13px] font-semibold text-emerald-950 mb-2.5">
                    📱 Direct Atelier Sync / कारीगर को तुरंत वॉट्सऐप पर ऑर्डर भेजें:
                  </p>
                  <a
                    href={`https://wa.me/919876543210?text=${encodeURIComponent(
                      `🧵 *New Order from Khwab Stitch* 🧵\n\n*Order ID:* #${successOrder.orderId}\n*Customer:* ${successOrder.customer?.name} (${successOrder.customer?.whatsapp})\n*Outfit:* ${successOrder.outfit?.type} (${successOrder.outfit?.pieces || 1} pieces)\n*Style:* Front: ${successOrder.design?.neckFront || "Standard"}, Back: ${successOrder.design?.neckBack || "Standard"}, Sleeves: ${successOrder.design?.sleeveLength || "Standard"}\n*Measurement Method:* ${successOrder.measurements?.provideMethod || "Standard"}\n*Delivery Address:* ${successOrder.delivery?.address || successOrder.customer?.address || "Address in slip"}\n\nPlease confirm my order!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full h-12 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[14px] shadow-md transition-colors"
                  >
                    <span>📲 Send Order to Atelier on WhatsApp / वॉट्सऐप पर भेजें</span>
                  </a>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setReceiptOrder(successOrder)}
                    className="flex-1 h-12 rounded-full text-white font-bold text-[13.5px] flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-opacity"
                    style={{ background: "linear-gradient(90deg,var(--primary),var(--secondary))" }}
                  >
                    <Download size={16} /> Download Slip / PDF (रसीद / PDF प्राप्त करें)
                  </button>
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
                        refPhoto: "As per design selection",
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
