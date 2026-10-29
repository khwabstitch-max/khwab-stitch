import { ArrowRight } from "lucide-react";

export default function WelcomeStep({ onStart }) {
  return (
    <section className="welcome-layout">
      {/* GRAND ATELIER LOGO CENTERPIECE */}
      <div className="mb-4 sm:mb-6 flex flex-col items-center">
        <div className="relative group">
          <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#c4994d] via-[#d69680] to-[#6b2636] opacity-60 blur-md transition-all duration-300 group-hover:opacity-90 group-hover:blur-lg" />
          <div className="relative h-28 w-28 sm:h-36 sm:w-36 md:h-44 md:w-44 overflow-hidden rounded-full border-4 border-[#fff7f0] bg-[#fffaf5] shadow-xl transition-transform duration-300 group-hover:scale-105">
            <img
              src="/images/khwabstitch_logo.jpg"
              alt="Khwab Stitch — Where Fabric Becomes Art"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="h-px w-6 sm:w-10 bg-[#dfc7b8]" />
          <span className="text-[10.5px] sm:text-[12px] font-bold tracking-[0.22em] uppercase text-[var(--secondary)]">
            Where Fabric Becomes Art
          </span>
          <span className="h-px w-6 sm:w-10 bg-[#dfc7b8]" />
        </div>
      </div>

      <div className="welcome-copy">
        <h1 className="welcome-title">
          <span className="welcome-title__english" lang="en">
            Welcome to<br /><em>Khwab Stitch</em>
          </span>
          <span className="welcome-title__hindi" lang="hi">
            ख्वाब स्टिच में आपका स्वागत है!
          </span>
        </h1>
        <div className="welcome-description space-y-3">
          <p>
            Share your details and preferences for a custom-stitched blouse, kurti, or suit / अपने पसंदीदा ब्लाउज़, कुर्ती या सूट की कस्टम सिलाई के लिए अपनी पसंद साझा करें।
          </p>
          <p>
            Provide accurate details and keep your design or reference photo ready / सही जानकारी भरें और अपना चुना हुआ डिज़ाइन या रेफ़रेंस फ़ोटो तैयार रखें।
          </p>
          <p>
            Our master tailors handcraft each piece with care / हमारे मास्टर दर्जी प्यार और हुनर से आपका परिधान तैयार करेंगे।
          </p>
        </div>
        <div className="welcome-actions">
          <button type="button" className="welcome-primary" onClick={onStart}>
            <span>Start your order / ऑर्डर शुरू करें</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
