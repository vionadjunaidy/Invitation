import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Calendar, Shirt, PartyPopper, Heart, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";
import { Confetti, FloatingElement, SectionReveal, AnimatedCounter, GoldDivider } from "@/components/Animations";
import { RSVPForm, RSVPSuccess } from "@/components/RSVPForm";
import { type RSVPFormData, EVENT_DETAILS } from "@/lib/index";
import { staggerContainer, staggerItem } from "@/lib/motion";

// ─── Decorative Stars ──────────────────────────────────────────────────────────
function DecorativeStar({ size = 16, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={style}>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.35;

    // Try immediate autoplay first.
    void audio.play().catch(() => {
      // Some browsers require user interaction before audio can start.
    });

    const resumeAudio = () => {
      void audio.play().catch(() => {
        // Ignore if still blocked by browser policy.
      });
    };

    window.addEventListener("click", resumeAudio, { once: true });
    window.addEventListener("touchstart", resumeAudio, { once: true });

    return () => {
      window.removeEventListener("click", resumeAudio);
      window.removeEventListener("touchstart", resumeAudio);
    };
  }, []);

  return (
    <audio ref={audioRef} loop autoPlay preload="auto" hidden>
      <source src="/music/background.mp3" type="audio/mpeg" />
    </audio>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleOpen = () => {
    setEnvelopeOpen(true);
    setTimeout(() => setShowContent(true), 600);
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-20"
      style={{
        background: "linear-gradient(160deg, oklch(0.97 0.02 38) 0%, oklch(0.95 0.03 35) 40%, oklch(0.96 0.025 38) 100%)",
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, var(--ring), transparent 70%)" }}
        />
        <div
          className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, var(--secondary), transparent 70%)" }}
        />
      </div>

      {/* Floating Elements */}
      <FloatingElement emoji="💕" x={90} delay={0.5} duration={4} className="top-32" />
      <FloatingElement emoji="🌹" x={15} delay={1} duration={3.8} className="top-1/2" />
      <FloatingElement emoji="💖" x={85} delay={1.5} duration={3.2} className="top-2/3" />
      <FloatingElement emoji="💐" x={5} delay={2} duration={4.5} className="bottom-32" />
      <FloatingElement emoji="💝" x={95} delay={0.8} duration={3.6} className="bottom-1/3" />

      {/* Gold star accents */}
      <div className="absolute top-12 left-1/4 text-ring/40">
        <DecorativeStar size={12} />
      </div>
      <div className="absolute top-1/3 right-12 text-ring/30">
        <DecorativeStar size={20} />
      </div>
      <div className="absolute bottom-1/4 left-16 text-primary/30">
        <DecorativeStar size={16} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-3xl w-full mx-auto text-center">
        <AnimatePresence mode="wait">
          {!showContent ? (
            // Envelope / Opening screen
            <motion.div
              key="envelope"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -30 }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              className="flex flex-col items-center gap-8"
            >
              {/* Gold badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest"
                style={{
                  background: "color-mix(in srgb, var(--ring) 15%, transparent)",
                  color: "var(--ring)",
                  border: "1px solid color-mix(in srgb, var(--ring) 30%, transparent)",
                }}
              >
                <Sparkles className="w-3 h-3" />
                A Special Celebration
                <Sparkles className="w-3 h-3" />
              </motion.div>

              {/* Envelope animation */}
              <motion.div
                className="relative cursor-pointer group"
                onClick={handleOpen}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div
                  className="w-56 h-40 rounded-2xl flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: "linear-gradient(145deg, oklch(0.99 0.005 50), oklch(0.96 0.02 45))",
                    boxShadow: "0 20px 60px -10px color-mix(in srgb, var(--primary) 30%, transparent), 0 4px 16px rgba(0,0,0,0.1)",
                    border: "1px solid color-mix(in srgb, var(--ring) 25%, transparent)",
                  }}
                >
                  {/* Envelope flap */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-20 origin-top"
                    animate={envelopeOpen ? { rotateX: -180, opacity: 0 } : { rotateX: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      background: "linear-gradient(180deg, oklch(0.94 0.03 45), oklch(0.97 0.01 50))",
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      transformOrigin: "top",
                    }}
                  />
                  {/* Envelope body decoration */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-ring/30 to-transparent" />
                  <div className="z-10 flex flex-col items-center gap-2">
                    <span className="text-4xl">💌</span>
                    <span className="text-xs text-muted-foreground font-medium tracking-wide">
                      Tap to open
                    </span>
                  </div>
                  {/* Wax seal */}
                  <div
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center text-base z-20"
                    style={{
                      background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 80%, var(--ring)))",
                      boxShadow: "0 2px 8px color-mix(in srgb, var(--primary) 40%, transparent)",
                    }}
                  >
                    <Heart className="w-4 h-4 text-white fill-white" />
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-8 group-hover:text-primary transition-colors">
                  Click to reveal your invitation ✨
                </p>
              </motion.div>
            </motion.div>
          ) : (
            // Invitation content
            <motion.div
              key="invitation"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 40 }}
              className="flex flex-col items-center gap-6"
            >

              {/* Main headline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
              </motion.div>

              {/* Anniversary card  */}
              <motion.div
                variants={staggerItem}
                className="rounded-lg p-0 overflow-hidden max-w-xl mx-auto"
                style={{
                  background: "white",
                  border: "1px solid color-mix(in srgb, var(--ring) 20%, transparent)",
                  boxShadow: "0 12px 40px -8px rgba(0, 0, 0, 0.15)",
                }}
              >
                {/* Top Image - Old Photo */}
                <img
                  src="/images/old-photo.jpg"
                  alt="Old wedding photo"
                  className="w-full h-56 object-cover"
                />

                {/* Content Section */}
                <div className="p-8 text-center">
                  {/* Main Number */}
                  <h1
                    className="text-5xl font-bold mb-2"
                    style={{
                      color: "var(--ring)",
                      fontFamily: "'Playfair Display', serif",
                      letterSpacing: "0.05em",
                    }}
                  >
                    50 YEARS
                  </h1>

                  {/* Subtitle */}
                  <p
                    className="text-sm font-light tracking-widest mb-6"
                    style={{
                      color: "var(--ring)",
                      fontFamily: "'Playfair Display', serif",
                      fontStyle: "italic",
                    }}
                  >
                    of Love & Legacy
                  </p>

                  {/* Gold Divider */}
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div
                      className="h-px flex-1"
                      style={{ background: "var(--ring)" }}
                    />
                    <Heart className="w-4 h-4" style={{ color: "var(--ring)" }} />
                    <div
                      className="h-px flex-1"
                      style={{ background: "var(--ring)" }}
                    />
                  </div>

                  {/* Names */}
                  <h2
                    className="text-2xl font-semibold mb-1 tracking-wider"
                    style={{
                      marginTop: "50px",
                      color: "var(--foreground)",
                      fontFamily: "'Playfair Display', serif",
                      letterSpacing: "0.25em",
                    }}
                  >
                    YUKONG & RATNA
                  </h2>

                  {/* Date */}
                  <p
                    className="text-s mb-4"
                    style={{
                      color: "var(--ring)",
                      letterSpacing: "0.05em",
                      marginTop: "50px",
                    }}
                  >
                    {EVENT_DETAILS.date}
                  </p>
                  {/* Location */}
                  <div className="text-s space-y-1">
                    <p className="font-semibold">{EVENT_DETAILS.venue}</p>
                    <p className="mt-3">
                      <span className="font-semibold">Time:</span> {EVENT_DETAILS.time}
                    </p>
                    <p className="mt-3">
                      <span className="font-semibold">Dress Code:</span> {EVENT_DETAILS.dressCode}
                    </p>
                    <p className="mt-3">
                      <span className="font-semibold">RSVP:</span> Please confirm by {EVENT_DETAILS.rsvpDeadline}
                    </p>
                  </div>
                </div>

                {/* Bottom Image Placeholder */}
                <img
                  src="/images/now-photo.jpg"
                  alt="Current wedding photo"
                  className="w-full h-56 object-cover"
                />
              </motion.div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground text-lg italic max-w-md"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                "Celebrating five decades of devotion, commitment, and endless love"
              </motion.p>

              {/* CTA */}
              <motion.a
                href="#rsvp"
                onClick={(e) => { e.preventDefault(); document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" }); }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 80%, var(--ring)))",
                  boxShadow: "0 8px 24px color-mix(in srgb, var(--primary) 35%, transparent)",
                }}
              >
                <PartyPopper className="w-5 h-5" />
                RSVP Now
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll indicator */}
      {showContent && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
            <div className="w-1 h-3 bg-muted-foreground/40 rounded-full" />
          </div>
        </motion.div>
      )}
    </section>
  );
}

// ─── Countdown Section ────────────────────────────────────────────────────────
function CountdownSection() {
  const { days, hours, minutes, seconds } = useCountdown();

  return (
    <section
      className="py-16 px-4"
      style={{
        background: "linear-gradient(135deg, color-mix(in srgb, var(--primary) 8%, var(--background)), color-mix(in srgb, var(--ring) 5%, var(--background)))",
      }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <SectionReveal>
          <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground mb-3">
            Counting Down To The Party
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold mb-8"
            style={{
              fontFamily: "'Playfair Display', serif",
              background: "linear-gradient(135deg, var(--primary), var(--ring))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            The Big Day Is Coming! 🎊
          </h2>

          <div
            className="inline-flex items-center gap-3 sm:gap-4 md:gap-10 px-4 sm:px-6 md:px-12 py-5 sm:py-6 md:py-8 rounded-3xl max-w-full"
            style={{
              background: "var(--card)",
              boxShadow: "0 16px 48px -8px color-mix(in srgb, var(--primary) 15%, transparent)",
              border: "1px solid color-mix(in srgb, var(--ring) 20%, transparent)",
            }}
          >
            <AnimatedCounter value={days} label="Days" />
            <span className="text-xl sm:text-2xl md:text-3xl font-mono text-ring/50 font-bold">:</span>
            <AnimatedCounter value={hours} label="Hours" />
            <span className="text-xl sm:text-2xl md:text-3xl font-mono text-ring/50 font-bold">:</span>
            <AnimatedCounter value={minutes} label="Minutes" />
            <span className="text-xl sm:text-2xl md:text-3xl font-mono text-ring/50 font-bold">:</span>
            <AnimatedCounter value={seconds} label="Seconds" />
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

// ─── Event Details Section ─────────────────────────────────────────────────────
function EventDetailsSection() {
  const details = [
    { icon: Calendar, label: "Date", value: EVENT_DETAILS.date, emoji: "📆" },
    { icon: Clock, label: "Time", value: EVENT_DETAILS.time, emoji: "⏰" },
    { icon: MapPin, label: "Venue", value: EVENT_DETAILS.venue, sub: EVENT_DETAILS.address, emoji: "📍" },
    { icon: Shirt, label: "Dress Code", value: EVENT_DETAILS.dressCode, emoji: "👗" },
  ];

  return (
    <section id="details" className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <SectionReveal className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground mb-3">
            Event Information
          </p>
          <h2
            className="text-3xl md:text-5xl font-bold"
            style={{
              fontFamily: "'Playfair Display', serif",
              background: "linear-gradient(135deg, var(--foreground), var(--muted-foreground))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Save the Date
          </h2>
          <GoldDivider />
        </SectionReveal>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {details.map(({ label, value, sub, emoji }) => (
            <motion.div
              key={label}
              variants={staggerItem}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="rounded-2xl p-6 flex items-start gap-4"
              style={{
                background: "var(--card)",
                boxShadow: "0 4px 20px -4px color-mix(in srgb, var(--primary) 10%, transparent)",
                border: "1px solid var(--border)",
              }}
            >
              <span className="text-3xl">{emoji}</span>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-1">
                  {label}
                </p>
                <p className="font-semibold text-foreground">{value}</p>
                {sub && (
                  <p className="text-sm text-muted-foreground mt-0.5">{sub}</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Map placeholder / Location section */}
        <SectionReveal delay={0.3} className="mt-8">
          <div
            className="rounded-3xl overflow-hidden relative"
            style={{
              border: "1px solid color-mix(in srgb, var(--ring) 20%, transparent)",
              boxShadow: "0 8px 30px -6px color-mix(in srgb, var(--primary) 10%, transparent)",
            }}
          >
            <div
              className="h-48 flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, color-mix(in srgb, var(--primary) 8%, var(--muted)), color-mix(in srgb, var(--ring) 6%, var(--muted)))",
              }}
            >
              <div className="text-center">
                <p className="text-5xl mb-3">🌹</p>
                <p className="font-semibold text-foreground text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Angke Heritage - PIK 2
                </p>
                <motion.a
                  href="https://maps.app.goo.gl/aRJ9n4Ff717BWwdd7"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-full text-xs font-medium"
                  style={{
                    background: "color-mix(in srgb, var(--primary) 15%, white)",
                    color: "var(--primary)",
                    border: "1px solid color-mix(in srgb, var(--primary) 30%, transparent)",
                  }}
                >
                  <MapPin className="w-3 h-3" />
                  Get Directions
                </motion.a>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

// ─── Photo Gallery / Celebration Section ─────────────────────────────────────
function CelebrationSection() {
  const slides = [
    {
      src: "/images/IMG_3577.jpg",
      alt: "Memory photo 1",
    },
    {
      src: "/images/IMG_3578.jpg",
      alt: "Memory photo 2",
    },
    {
      src: "/images/IMG_3583.jpg",
      alt: "Memory photo 3",
    },
    {
      src: "/images/IMG_3586.jpg",
      alt: "Memory photo 4",
    },
    {
      src: "/images/IMG_3587.jpg",
      alt: "Memory photo 5",
    },
    {
      src: "/images/IMG_3588.jpg",
      alt: "Memory photo 6",
    },
    {
      src: "/images/IMG_3589.jpg",
      alt: "Memory photo 7",
    },
    {
      src: "/images/IMG_3590.jpg",
      alt: "Memory photo 8",
    },
    {
      src: "/images/IMG_3591.jpg",
      alt: "Memory photo 9",
    },
    {
      src: "/images/IMG_3592.jpg",
      alt: "Memory photo 10",
    },
    {
      src: "/images/IMG_3594.jpg",
      alt: "Memory photo 11",
    },
    {
      src: "/images/IMG_3595.jpg",
      alt: "Memory photo 12",
    },
    {
      src: "/images/IMG_3596.jpg",
      alt: "Memory photo 13",
    },
  ];
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);

  const goToPrevious = () => {
    setSlideDirection(-1);
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setSlideDirection(1);
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      className="py-20 px-4"
      style={{
        background: "linear-gradient(160deg, color-mix(in srgb, var(--secondary) 5%, var(--background)), color-mix(in srgb, var(--primary) 5%, var(--background)))",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <SectionReveal className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground mb-3">
            Celebrating Two Incredible Milestones
          </p>
          <h2
            className="text-3xl md:text-5xl font-bold"
            style={{
              fontFamily: "'Playfair Display', serif",
              background: "linear-gradient(135deg, var(--primary), var(--ring))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            A Story of Love & Joy
          </h2>
          <GoldDivider />
        </SectionReveal>

        <SectionReveal delay={0.15}>
          <div
            className="rounded-3xl overflow-hidden relative"
            style={{
              background: "var(--card)",
              boxShadow: "0 12px 40px -8px color-mix(in srgb, var(--primary) 18%, transparent)",
              border: "1px solid color-mix(in srgb, var(--ring) 20%, transparent)",
            }}
          >
            <div className="relative h-[700px] sm:h-[700px]">
              <AnimatePresence initial={false} custom={slideDirection}>
                <motion.img
                  key={activeSlide}
                  custom={slideDirection}
                  src={slides[activeSlide].src}
                  alt={slides[activeSlide].alt}
                  initial={{ x: slideDirection > 0 ? "100%" : "-100%", opacity: 0.9 }}
                  animate={{ x: "0%", opacity: 1 }}
                  exit={{ x: slideDirection > 0 ? "-100%" : "100%", opacity: 0.9 }}
                  transition={{ duration: 0.42, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 bg-gradient-to-t from-black/70 via-black/35 to-transparent text-white">
                <p className="text-sm sm:text-base font-medium tracking-wide">
                  {slides[activeSlide].caption}
                </p>
              </div>

              <button
                type="button"
                onClick={goToPrevious}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={goToNext}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 py-4 bg-card/80">
              {slides.map((slide, idx) => (
                <span
                  key={slide.src}
                  className={`h-2.5 rounded-full transition-all ${
                    activeSlide === idx ? "w-7 bg-primary" : "w-2.5 bg-muted-foreground/35"
                  }`}
                />
              ))}
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

// ─── RSVP Section ─────────────────────────────────────────────────────────────
function RSVPSection() {
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<RSVPFormData | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleRSVPSuccess = (data: RSVPFormData) => {
    setSubmittedData(data);
    setRsvpSuccess(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const handleRSVPReset = () => {
    setRsvpSuccess(false);
    setSubmittedData(null);
  };

  return (
    <section id="rsvp" className="py-20 px-4 bg-background">
      <Confetti active={showConfetti} count={100} />

      <div className="max-w-2xl mx-auto">
        <SectionReveal className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground mb-3">
            RSVP — Kindly Confirm By August 1st
          </p>
          <h2
            className="text-3xl md:text-5xl font-bold"
            style={{
              fontFamily: "'Playfair Display', serif",
              background: "linear-gradient(135deg, var(--primary), var(--ring))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Will You Join Us?
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            We'd love to have you celebrate with us! Please RSVP so we can make sure everyone has a spot at the table. 🌸
          </p>
          <GoldDivider />
        </SectionReveal>

        <AnimatePresence mode="wait">
          {rsvpSuccess && submittedData ? (
            <RSVPSuccess
              key="success"
              name={submittedData.name}
              guestCount={submittedData.guestCount}
              onClose={handleRSVPReset}
            />
          ) : (
            <div key="form">
              <RSVPForm onSuccess={handleRSVPSuccess} />
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Footer Section ───────────────────────────────────────────────────────────
function FooterSection() {
  return (
    <footer
      className="py-12 px-4 text-center"
      style={{
        background: "linear-gradient(160deg, color-mix(in srgb, var(--primary) 12%, var(--background)), color-mix(in srgb, var(--ring) 8%, var(--background)))",
        borderTop: "1px solid color-mix(in srgb, var(--ring) 15%, transparent)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-md mx-auto space-y-4"
      >
        <p className="text-3xl">💕</p>
        <h3
          className="text-2xl font-bold"
          style={{
            fontFamily: "'Playfair Display', serif",
            background: "linear-gradient(135deg, var(--primary), var(--ring))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          See You There!
        </h3>
        <GoldDivider />
        <p className="text-xs text-muted-foreground">
          Made by Viona for our very special grandparents.
        </p>
      </motion.div>
    </footer>
  );
}

// ─── Nav Bar ─────────────────────────────────────────────────────────────────
function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4"
      animate={{
        background: scrolled
          ? "color-mix(in srgb, var(--background) 95%, transparent)"
          : "transparent",
        boxShadow: scrolled
          ? "0 2px 20px color-mix(in srgb, var(--primary) 10%, transparent)"
          : "none",
      }}
      transition={{ duration: 0.3 }}
      style={{
        backdropFilter: scrolled ? "none" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">🌸</span>
        <span
          className="font-bold text-sm hidden sm:block"
          style={{
            fontFamily: "'Playfair Display', serif",
            background: "linear-gradient(135deg, var(--primary), var(--ring))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          August 29, 2026
        </span>
      </div>

      <div className="flex items-center gap-1">
        {[
          { label: "Details", id: "details" },
          { label: "RSVP", id: "rsvp" },
        ].map(link => (
          <motion.button
            key={link.id}
            onClick={() => scrollTo(link.id)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            {link.label}
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );
}

// ─── Main Page Export ─────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen">
      <BackgroundMusic />
      <NavBar />
      <HeroSection />
      <CountdownSection />
      <EventDetailsSection />
      <CelebrationSection />
      <RSVPSection />
      <FooterSection />
    </div>
  );
}
