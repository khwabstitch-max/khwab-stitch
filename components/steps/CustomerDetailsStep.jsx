import React from "react";
import { User, Phone, Mail, MapPin, Building, Compass, Hash } from "lucide-react";

export default function CustomerDetailsStep({ customer, setCustomer }) {
  const handleChange = (field, value) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section className="step-card rounded-[28px] border bg-white p-6 md:p-8 shadow-sm">
      {/* SECTION HEADER */}
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b border-[#f2e7e1] pb-5">
        <div className="flex items-center gap-3.5">
          <span className="step-icon">
            <User size={20} />
          </span>
          <div>
            <p className="step-eyebrow">STEP 02 · YOUR DETAILS & ADDRESS / आपकी जानकारी व पता</p>
            <h2 className="font-serif text-[24px] sm:text-[27px] font-bold text-[var(--primary-dark)] leading-tight">
              Let’s get to know you / अपने बारे में बताएं
            </h2>
            <p className="text-[13px] text-[var(--text-light)] mt-0.5">
              We’ll use these details for fitting updates and doorstep delivery / फ़िटिंग व डिलीवरी के लिए आवश्यक जानकारी
            </p>
          </div>
        </div>
      </div>

      {/* FORM FIELDS GRID */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Full Name */}
        <label className="form-field">
          <span className="flex items-center gap-1.5 text-[12.5px] font-bold text-[var(--primary-dark)]">
            <User size={14} className="text-[var(--primary)]" />
            <span>Full name / पूरा नाम</span>
            <i aria-hidden="true" className="text-red-500 font-bold">*</i>
          </span>
          <input
            type="text"
            autoComplete="name"
            required
            value={customer.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g. Sunita Sharma / जैसे: सुनीता शर्मा"
            className="rounded-xl border border-[#eedfd6] bg-[#fffdfb] px-3.5 py-3 text-[13.5px] transition-all focus:border-[var(--primary)] focus:bg-white"
          />
        </label>

        {/* WhatsApp Number */}
        <label className="form-field">
          <span className="flex items-center gap-1.5 text-[12.5px] font-bold text-[var(--primary-dark)]">
            <Phone size={14} className="text-[var(--primary)]" />
            <span>WhatsApp number / वॉट्सऐप नंबर</span>
            <i aria-hidden="true" className="text-red-500 font-bold">*</i>
          </span>
          <input
            type="tel"
            autoComplete="tel"
            required
            value={customer.whatsapp}
            onChange={(e) => handleChange("whatsapp", e.target.value)}
            placeholder="e.g. 98765 43210 / 10 अंकों का वॉट्सऐप नंबर"
            className="rounded-xl border border-[#eedfd6] bg-[#fffdfb] px-3.5 py-3 text-[13.5px] transition-all focus:border-[var(--primary)] focus:bg-white"
          />
        </label>

        {/* Email Address */}
        <label className="form-field md:col-span-2">
          <span className="flex items-center justify-between text-[12.5px] font-bold text-[var(--primary-dark)]">
            <span className="flex items-center gap-1.5">
              <Mail size={14} className="text-[var(--primary)]" />
              <span>Email address / ईमेल एड्रेस</span>
            </span>
            <small className="text-[11px] font-normal text-stone-500">(Optional / वैकल्पिक)</small>
          </span>
          <input
            type="email"
            autoComplete="email"
            value={customer.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="e.g. sunita@email.com"
            className="rounded-xl border border-[#eedfd6] bg-[#fffdfb] px-3.5 py-3 text-[13.5px] transition-all focus:border-[var(--primary)] focus:bg-white"
          />
        </label>

        {/* Full Delivery Address */}
        <label className="form-field md:col-span-2">
          <span className="flex items-center gap-1.5 text-[12.5px] font-bold text-[var(--primary-dark)]">
            <MapPin size={14} className="text-[var(--primary)]" />
            <span>Full delivery address / पूरा डिलीवरी पता</span>
            <i aria-hidden="true" className="text-red-500 font-bold">*</i>
          </span>
          <textarea
            required
            rows={2}
            value={customer.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="House/Flat number, building name, street, colony / मकान नंबर, बिल्डिंग का नाम, गली, मोहल्ला..."
            className="rounded-xl border border-[#eedfd6] bg-[#fffdfb] p-3 text-[13px] leading-relaxed transition-all focus:border-[var(--primary)] focus:bg-white"
          />
        </label>

        {/* Nearby Landmark */}
        <label className="form-field md:col-span-2">
          <span className="flex items-center justify-between text-[12.5px] font-bold text-[var(--primary-dark)]">
            <span className="flex items-center gap-1.5">
              <Building size={14} className="text-[var(--primary)]" />
              <span>Nearby landmark / पास का लैंडमार्क</span>
            </span>
            <small className="text-[11px] font-normal text-stone-500">(Optional / वैकल्पिक)</small>
          </span>
          <input
            type="text"
            value={customer.landmark || ""}
            onChange={(e) => handleChange("landmark", e.target.value)}
            placeholder="Near temple, hospital, school, or market / मंदिर, अस्पताल, स्कूल या बाज़ार के पास..."
            className="rounded-xl border border-[#eedfd6] bg-[#fffdfb] px-3.5 py-3 text-[13.5px] transition-all focus:border-[var(--primary)] focus:bg-white"
          />
        </label>

        {/* City & State */}
        <label className="form-field">
          <span className="flex items-center gap-1.5 text-[12.5px] font-bold text-[var(--primary-dark)]">
            <Compass size={14} className="text-[var(--primary)]" />
            <span>City & State / शहर और राज्य</span>
            <i aria-hidden="true" className="text-red-500 font-bold">*</i>
          </span>
          <input
            type="text"
            required
            value={customer.cityState}
            onChange={(e) => handleChange("cityState", e.target.value)}
            placeholder="e.g. New Delhi, Delhi / नई दिल्ली, दिल्ली"
            className="rounded-xl border border-[#eedfd6] bg-[#fffdfb] px-3.5 py-3 text-[13.5px] transition-all focus:border-[var(--primary)] focus:bg-white"
          />
        </label>

        {/* PIN Code */}
        <label className="form-field">
          <span className="flex items-center gap-1.5 text-[12.5px] font-bold text-[var(--primary-dark)]">
            <Hash size={14} className="text-[var(--primary)]" />
            <span>PIN code / पिन कोड</span>
            <i aria-hidden="true" className="text-red-500 font-bold">*</i>
          </span>
          <input
            type="text"
            required
            value={customer.pin}
            onChange={(e) => handleChange("pin", e.target.value)}
            placeholder="e.g. 110001 / 6 अंकों का पिन कोड"
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
