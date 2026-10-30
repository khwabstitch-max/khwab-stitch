import React, { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  Compass,
  Hash,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

// List of all Indian States & Union Territories
export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

// Major cities by State for instant 1-click selection
export const STATE_CITIES = {
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bhilwara", "Sikar"],
  Delhi: ["New Delhi", "Central Delhi", "South Delhi", "North Delhi", "East Delhi", "West Delhi", "Dwarka", "Rohini"],
  "Uttar Pradesh": ["Lucknow", "Noida", "Greater Noida", "Ghaziabad", "Kanpur", "Varanasi", "Agra", "Prayagraj", "Meerut", "Bareilly", "Aligarh", "Mathura"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Navi Mumbai", "Solapur"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar"],
  Haryana: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal", "Hisar", "Rohtak", "Sonipat", "Panchkula"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Mohali", "Bathinda", "Hoshiarpur"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar"],
  Bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri", "Asansol"],
  Karnataka: ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
  Uttarakhand: ["Dehradun", "Haridwar", "Rishikesh", "Haldwani", "Roorkee"],
  Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
  Chhattisgarh: ["Raipur", "Bhilai", "Bilaspur", "Korba"],
  Chandigarh: ["Chandigarh"],
};

export default function CustomerDetailsStep({ customer, setCustomer }) {
  const [cityMode, setCityMode] = useState("dropdown"); // 'dropdown' | 'custom'

  const handleChange = (field, value) => {
    setCustomer((prev) => {
      const updated = { ...prev, [field]: value };
      // Keep combined cityState in sync
      const currentCity = field === "city" ? value : prev.city || "";
      const currentState = field === "state" ? value : prev.state || "";
      updated.cityState = currentCity && currentState ? `${currentCity}, ${currentState}` : currentCity || currentState;
      return updated;
    });
  };

  // WhatsApp input cleaner: numeric only, max 10 digits
  const handlePhoneChange = (raw) => {
    const digits = raw.replace(/\D/g, "");
    // If user pasted with 91 country code (12 digits), strip 91
    const clean = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
    const final10 = clean.slice(0, 10);
    handleChange("whatsapp", final10);
  };

  // PIN code cleaner: numeric only, max 6 digits
  const handlePinChange = (raw) => {
    const digits = raw.replace(/\D/g, "").slice(0, 6);
    handleChange("pin", digits);
  };

  const handleStateChange = (selectedState) => {
    setCustomer((prev) => {
      const updated = { ...prev, state: selectedState };
      // If city belongs to a different state, reset city
      const stateCities = STATE_CITIES[selectedState] || [];
      if (!stateCities.includes(prev.city)) {
        updated.city = stateCities[0] || "";
      }
      updated.cityState = updated.city && selectedState ? `${updated.city}, ${selectedState}` : selectedState;
      return updated;
    });
  };

  const availableCities = customer.state ? STATE_CITIES[customer.state] || [] : [];
  const phoneLength = (customer.whatsapp || "").length;
  const isPhoneValid = phoneLength === 10;
  const pinLength = (customer.pin || "").length;
  const isPinValid = pinLength === 6;

  return (
    <section className="step-card rounded-[28px] border bg-white p-5 sm:p-7 md:p-8 shadow-sm">
      {/* SECTION HEADER */}
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b border-[#f2e7e1] pb-5">
        <div className="flex items-center gap-3.5">
          <span className="step-icon">
            <User size={20} />
          </span>
          <div>
            <p className="step-eyebrow">STEP 02 · YOUR DETAILS & ADDRESS / आपकी जानकारी व पता</p>
            <h2 className="font-serif text-[23px] sm:text-[27px] font-bold text-[var(--primary-dark)] leading-tight">
              Let’s get to know you / अपने बारे में बताएं
            </h2>
            <p className="text-[13px] text-[var(--text-light)] mt-0.5">
              Fill in your contact and doorstep delivery address / फ़िटिंग व डिलीवरी के लिए आवश्यक जानकारी भरें
            </p>
          </div>
        </div>
      </div>

      {/* FORM FIELDS - EXACT ORDER REQUESTED BY USER */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* 1. Full Name / पूरा नाम * */}
        <label className="form-field">
          <span className="flex items-center gap-1.5 text-[12.5px] font-bold text-[var(--primary-dark)]">
            <User size={14} className="text-[var(--primary)]" />
            <span>Full Name / पूरा नाम</span>
            <i aria-hidden="true" className="text-red-500 font-bold">*</i>
          </span>
          <input
            type="text"
            autoComplete="name"
            required
            value={customer.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g. Sunita Sharma / जैसे: सुनीता शर्मा"
            className="rounded-xl border border-[#eedfd6] bg-[#fffdfb] px-3.5 py-3 text-[13.5px] transition-all focus:border-[var(--primary)] focus:bg-white"
          />
        </label>

        {/* 2. WhatsApp Number / वॉट्सऐप नंबर * (10 Digits Strict Check) */}
        <label className="form-field">
          <span className="flex items-center justify-between text-[12.5px] font-bold text-[var(--primary-dark)]">
            <span className="flex items-center gap-1.5">
              <Phone size={14} className="text-[var(--primary)]" />
              <span>WhatsApp Number / वॉट्सऐप नंबर</span>
              <i aria-hidden="true" className="text-red-500 font-bold">*</i>
            </span>
            {phoneLength > 0 && (
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                  isPhoneValid
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-amber-100 text-amber-800 border border-amber-200"
                }`}
              >
                {isPhoneValid ? "✓ 10 Digits Valid" : `${phoneLength}/10 Digits (10 अंक आवश्यक)`}
              </span>
            )}
          </span>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[13px] text-stone-500 select-none">
              +91
            </span>
            <input
              type="tel"
              autoComplete="tel"
              required
              maxLength={10}
              value={customer.whatsapp || ""}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="9876543210 (10 अंक)"
              className={`w-full rounded-xl border pl-13 pr-3.5 py-3 text-[13.5px] font-mono tracking-wider transition-all focus:bg-white ${
                phoneLength > 0 && !isPhoneValid
                  ? "border-amber-400 bg-amber-50/30 focus:border-amber-500"
                  : isPhoneValid
                  ? "border-emerald-500 bg-emerald-50/20"
                  : "border-[#eedfd6] bg-[#fffdfb] focus:border-[var(--primary)]"
              }`}
            />
          </div>
          {phoneLength > 0 && !isPhoneValid && (
            <p className="text-[11px] font-semibold text-amber-700 mt-1 flex items-center gap-1">
              <AlertCircle size={12} />
              <span>कृपया पूरे 10 अंकों का मोबाइल नंबर दर्ज करें ({10 - phoneLength} अंक बाकी)।</span>
            </p>
          )}
        </label>

        {/* 3. Email Address / ईमेल एड्रेस (Optional) */}
        <label className="form-field md:col-span-2">
          <span className="flex items-center justify-between text-[12.5px] font-bold text-[var(--primary-dark)]">
            <span className="flex items-center gap-1.5">
              <Mail size={14} className="text-[var(--primary)]" />
              <span>Email Address / ईमेल एड्रेस</span>
            </span>
            <small className="text-[11px] font-normal text-stone-500">(Optional / वैकल्पिक)</small>
          </span>
          <input
            type="email"
            autoComplete="email"
            value={customer.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="e.g. sunita@email.com"
            className="rounded-xl border border-[#eedfd6] bg-[#fffdfb] px-3.5 py-3 text-[13.5px] transition-all focus:border-[var(--primary)] focus:bg-white"
          />
        </label>

        {/* 4. Full Delivery Address / पूरा डिलीवरी पता * */}
        <label className="form-field md:col-span-2">
          <span className="flex items-center gap-1.5 text-[12.5px] font-bold text-[var(--primary-dark)]">
            <MapPin size={14} className="text-[var(--primary)]" />
            <span>Full Delivery Address / पूरा डिलीवरी पता</span>
            <i aria-hidden="true" className="text-red-500 font-bold">*</i>
          </span>
          <textarea
            required
            rows={2}
            value={customer.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="House/Flat number, building name, street, colony / मकान नंबर, बिल्डिंग का नाम, गली, मोहल्ला..."
            className="rounded-xl border border-[#eedfd6] bg-[#fffdfb] p-3 text-[13px] leading-relaxed transition-all focus:border-[var(--primary)] focus:bg-white"
          />
        </label>

        {/* 5. City / शहर * (Dropdown with Custom Input Option) */}
        <div className="form-field">
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center gap-1.5 text-[12.5px] font-bold text-[var(--primary-dark)]">
              <Compass size={14} className="text-[var(--primary)]" />
              <span>City / शहर</span>
              <i aria-hidden="true" className="text-red-500 font-bold">*</i>
            </span>
            <button
              type="button"
              onClick={() => setCityMode(cityMode === "dropdown" ? "custom" : "dropdown")}
              className="text-[11px] font-semibold text-[var(--primary)] hover:underline cursor-pointer"
            >
              {cityMode === "dropdown" ? "Type other city / शहर लिखें" : "Select from list / सूची से चुनें"}
            </button>
          </div>

          {cityMode === "dropdown" && availableCities.length > 0 ? (
            <div className="relative">
              <select
                required
                value={customer.city || ""}
                onChange={(e) => {
                  if (e.target.value === "__OTHER__") {
                    setCityMode("custom");
                    handleChange("city", "");
                  } else {
                    handleChange("city", e.target.value);
                  }
                }}
                className="w-full appearance-none rounded-xl border border-[#eedfd6] bg-[#fffdfb] px-3.5 py-3 text-[13.5px] font-medium pr-10 outline-none focus:border-[var(--primary)] focus:bg-white cursor-pointer"
              >
                <option value="">Select City / शहर चुनें...</option>
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="__OTHER__">✍️ Other City / अन्य शहर (Type below)...</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-stone-500">
                <ChevronDown size={18} />
              </div>
            </div>
          ) : (
            <input
              type="text"
              required
              value={customer.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="e.g. Jaipur, New Delhi, Lucknow / शहर का नाम"
              className="rounded-xl border border-[#eedfd6] bg-[#fffdfb] px-3.5 py-3 text-[13.5px] transition-all focus:border-[var(--primary)] focus:bg-white"
            />
          )}
        </div>

        {/* 6. State / राज्य * (Full Indian States Dropdown) */}
        <div className="form-field">
          <span className="flex items-center gap-1.5 text-[12.5px] font-bold text-[var(--primary-dark)] mb-1">
            <Building size={14} className="text-[var(--primary)]" />
            <span>State / राज्य</span>
            <i aria-hidden="true" className="text-red-500 font-bold">*</i>
          </span>
          <div className="relative">
            <select
              required
              value={customer.state || ""}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[#eedfd6] bg-[#fffdfb] px-3.5 py-3 text-[13.5px] font-medium pr-10 outline-none focus:border-[var(--primary)] focus:bg-white cursor-pointer"
            >
              <option value="">Select State / राज्य चुनें...</option>
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-stone-500">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>

        {/* 7. PIN Code / पिन कोड * */}
        <label className="form-field">
          <span className="flex items-center justify-between text-[12.5px] font-bold text-[var(--primary-dark)]">
            <span className="flex items-center gap-1.5">
              <Hash size={14} className="text-[var(--primary)]" />
              <span>PIN Code / पिन कोड</span>
              <i aria-hidden="true" className="text-red-500 font-bold">*</i>
            </span>
            {pinLength > 0 && (
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                  isPinValid
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-amber-100 text-amber-800 border border-amber-200"
                }`}
              >
                {isPinValid ? "✓ 6 Digits Valid" : `${pinLength}/6 Digits`}
              </span>
            )}
          </span>
          <input
            type="text"
            required
            maxLength={6}
            value={customer.pin || ""}
            onChange={(e) => handlePinChange(e.target.value)}
            placeholder="e.g. 302001 (6 अंकों का पिन कोड)"
            className={`rounded-xl border px-3.5 py-3 text-[13.5px] font-mono tracking-wider transition-all focus:bg-white ${
              pinLength > 0 && !isPinValid
                ? "border-amber-400 bg-amber-50/30 focus:border-amber-500"
                : isPinValid
                ? "border-emerald-500 bg-emerald-50/20"
                : "border-[#eedfd6] bg-[#fffdfb] focus:border-[var(--primary)]"
            }`}
          />
        </label>

        {/* 8. Nearby Landmark / पास का लैंडमार्क (Optional) */}
        <label className="form-field">
          <span className="flex items-center justify-between text-[12.5px] font-bold text-[var(--primary-dark)]">
            <span className="flex items-center gap-1.5">
              <Building size={14} className="text-[var(--primary)]" />
              <span>Nearby Landmark / पास का लैंडमार्क</span>
            </span>
            <small className="text-[11px] font-normal text-stone-500">(Optional / वैकल्पिक)</small>
          </span>
          <input
            type="text"
            value={customer.landmark || ""}
            onChange={(e) => handleChange("landmark", e.target.value)}
            placeholder="Near temple, hospital, school, or market..."
            className="rounded-xl border border-[#eedfd6] bg-[#fffdfb] px-3.5 py-3 text-[13.5px] transition-all focus:border-[var(--primary)] focus:bg-white"
          />
        </label>
      </div>

      <div className="mt-6 rounded-xl bg-[#fdf9f6] p-3 text-center text-[11.5px] text-[var(--text-light)] border border-[#f0e3db]">
        ✦ All tailor communications, WhatsApp fittings, and delivery status will be sent to your WhatsApp number.
        / फ़िटिंग व डिलीवरी संबंधी सभी सूचनाएं आपके वॉट्सऐप नंबर पर भेजी जाएँगी।
      </div>
    </section>
  );
}
