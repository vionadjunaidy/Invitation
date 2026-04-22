import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateConfetti, type ConfettiPiece } from "@/lib/index";

interface ConfettiProps {
  active: boolean;
  count?: number;
}

export function Confetti({ active, count = 80 }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const animRef = useRef<number | null>(null);
  const [positions, setPositions] = useState<{ x: number; y: number; rotation: number }[]>([]);

  useEffect(() => {
    if (active) {
      const newPieces = generateConfetti(count);
      setPieces(newPieces);
      setPositions(newPieces.map(p => ({ x: p.x, y: p.y, rotation: p.rotation })));
    } else {
      setPieces([]);
      setPositions([]);
    }
  }, [active, count]);

  useEffect(() => {
    if (!active || pieces.length === 0) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    const animate = () => {
      setPositions(prev =>
        prev.map((pos, i) => {
          const piece = pieces[i];
          const newY = pos.y + piece.velocityY;
          const newX = pos.x + piece.velocityX;
          const newRot = pos.rotation + 3;
          if (newY > 110) {
            return { x: Math.random() * 100, y: -10, rotation: Math.random() * 360 };
          }
          return { x: newX, y: newY, rotation: newRot };
        })
      );
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [active, pieces]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece, i) => (
        <div
          key={piece.id}
          style={{
            position: "absolute",
            left: `${positions[i]?.x ?? piece.x}%`,
            top: `${positions[i]?.y ?? piece.y}%`,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            transform: `rotate(${positions[i]?.rotation ?? piece.rotation}deg)`,
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  );
}

interface FloatingElementProps {
  emoji: string;
  delay?: number;
  duration?: number;
  x?: number;
  className?: string;
}

export function FloatingElement({
  emoji,
  delay = 0,
  duration = 4,
  x = 50,
  className = "",
}: FloatingElementProps) {
  return (
    <motion.div
      className={`absolute text-2xl pointer-events-none select-none ${className}`}
      style={{ left: `${x}%` }}
      animate={{
        y: [0, -20, 0],
        rotate: [-5, 5, -5],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {emoji}
    </motion.div>
  );
}

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function SectionReveal({ children, className = "", delay = 0 }: SectionRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 40,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedCounterProps {
  value: number;
  label: string;
}

export function AnimatedCounter({ value, label }: AnimatedCounterProps) {
  return (
    <motion.div
      className="flex flex-col items-center"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div
        className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-primary"
        style={{
          background: "linear-gradient(135deg, var(--primary), var(--ring))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1 font-sans">
        {label}
      </div>
    </motion.div>
  );
}

export function GoldDivider() {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-ring/40 to-transparent" />
      <span className="text-ring text-xl">✦</span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-ring/40 to-transparent" />
    </div>
  );
}

interface ToastNotificationProps {
  show: boolean;
  message: string;
  type?: "success" | "error";
}

export function ToastNotification({ show, message, type = "success" }: ToastNotificationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full text-white font-medium shadow-lg"
          style={{
            background: type === "success"
              ? "linear-gradient(135deg, oklch(0.65 0.18 345), oklch(0.65 0.18 45))"
              : "oklch(0.60 0.20 25)",
          }}
        >
          {type === "success" ? "🎉 " : "⚠️ "}
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
