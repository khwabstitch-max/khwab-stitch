import React, { useState } from "react";
import { Lock, ArrowRight, ShieldCheck, ArrowLeft, KeyRound } from "lucide-react";

export default function AdminLoginPage({
  onLogin,
  onBackToCustomer,
  adminError,
  adminBusy,
}) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    onLogin(password);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[420px] rounded-[32px] border-2 border-[#ebdcd0] bg-white p-7 sm:p-9 shadow-xl text-center">
        {/* LOGO */}
        <div className="relative mx-auto mb-5 h-20 w-20 sm:h-24 sm:w-24">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#c4994d] via-[#d69680] to-[#6b2636] opacity-70 blur-sm" />
          <img
            src="./images/khwabstitch_logo.jpg"
            alt="Khwab Stitch Logo"
            className="relative h-full w-full rounded-full object-cover border-2 border-[#fff6ee] shadow-md"
          />
        </div>

        {/* TITLE */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fdf5f0] px-3 py-1 text-[11px] font-bold text-[var(--primary)] border border-[#f3ddd1] uppercase tracking-wider mb-2">
          <ShieldCheck size={13} />
          <span>Atelier Portal / कारीगर पोर्टल</span>
        </span>
        <h1 className="font-serif text-[23px] sm:text-[26px] font-bold text-[var(--primary-dark)] leading-tight">
          Master Tailor Sign In
        </h1>
        <p className="mt-1 text-[12.5px] text-[var(--text-light)]">
          Enter atelier password to manage customer orders / ऑर्डर देखने के लिए पासवर्ड दर्ज करें
        </p>

        {/* ERROR DISPLAY */}
        {adminError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[12px] font-semibold text-red-700">
            {adminError}
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
          <label className="block">
            <span className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--primary-dark)] mb-1.5">
              <Lock size={13} className="text-[var(--primary)]" />
              <span>Password / पासवर्ड</span>
            </span>
            <div className="relative">
              <input
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                className="w-full rounded-xl border-2 border-[#eedfd6] bg-[#fffdfb] px-4 py-3 text-[14px] outline-none transition-all focus:border-[var(--primary)] focus:bg-white focus:ring-3 focus:ring-[rgba(107,38,54,0.12)]"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={adminBusy}
            className="w-full h-12 rounded-full text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-opacity disabled:opacity-60"
            style={{ background: "linear-gradient(90deg,var(--primary),var(--secondary))" }}
          >
            {adminBusy ? (
              <span>Verifying... / सत्यापन जारी...</span>
            ) : (
              <>
                <span>Sign In / लॉगिन करें</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* BACK TO CUSTOMER SITE */}
        <div className="mt-6 pt-5 border-t border-[#f0e4d8]">
          <button
            type="button"
            onClick={onBackToCustomer}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--primary)] hover:underline"
          >
            <ArrowLeft size={13} />
            <span>Return to Customer Website / ग्राहक वेबसाइट पर जाएं</span>
          </button>
        </div>
      </div>
    </div>
  );
}

