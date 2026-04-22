import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus, Send, Heart, PartyPopper } from "lucide-react";
import { type RSVPFormData } from "@/lib/index";
import { GoldDivider } from "@/components/Animations";
import { getSupabaseClient } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";

const rsvpSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  guestCount: z.number().min(1).max(10),
  message: z.string().optional(),
});

interface RSVPFormProps {
  onSuccess: (data: RSVPFormData) => void;
}

export function RSVPForm({ onSuccess }: RSVPFormProps) {
  const [guestCount, setGuestCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<RSVPFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      guestCount: 1,
      message: "",
    },
  });

  const incrementGuests = () => {
    const newCount = Math.min(10, guestCount + 1);
    setGuestCount(newCount);
    setValue("guestCount", newCount);
  };

  const decrementGuests = () => {
    const newCount = Math.max(1, guestCount - 1);
    setGuestCount(newCount);
    setValue("guestCount", newCount);
  };

  const onSubmit = async (data: RSVPFormData) => {
    setIsSubmitting(true);
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from("rsvps").insert({
        name: data.name,
        email: data.email,
        guest_count: data.guestCount,
        message: data.message?.trim() || null,
      });

      if (error) {
        throw error;
      }

      // Fire and forget confirmation email so RSVP success isn't blocked.
      try {
        await supabase.functions.invoke("send-rsvp-confirmation", {
          body: {
            name: data.name,
            email: data.email,
            guestCount: data.guestCount,
          },
        });
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }

      onSuccess(data);
      reset();
      setGuestCount(1);
      toast.success("RSVP submitted successfully.");
    } catch (error) {
      console.error("Failed to submit RSVP:", error);
      toast.error("Could not submit RSVP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 260, damping: 40 }}
      className="w-full max-w-lg mx-auto"
    >
      <div
        className="rounded-3xl p-8 md:p-10"
        style={{
          background: "var(--card)",
          boxShadow: "0 20px 60px -10px color-mix(in srgb, var(--primary) 20%, transparent), 0 4px 16px color-mix(in srgb, var(--ring) 10%, transparent)",
          border: "1px solid color-mix(in srgb, var(--ring) 20%, transparent)",
        }}
      >
        {/* Form Header */}
        <div className="text-center mb-8">
          <motion.div
            className="text-4xl mb-3"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            💌
          </motion.div>
          <h3
            className="text-2xl font-bold mb-2"
            style={{
              fontFamily: "'Playfair Display', serif",
              background: "linear-gradient(135deg, var(--primary), var(--ring))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            RSVP Now
          </h3>
          <p className="text-muted-foreground text-sm">
            Kindly confirm your attendance by August 1st
          </p>
        </div>

        <GoldDivider />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-medium text-foreground/80">
              Your Full Name *
            </Label>
            <Input
              id="name"
              placeholder="Jane Smith"
              {...register("name")}
              className="rounded-xl border-border/60 focus-visible:ring-ring/50 bg-background/60"
            />
            {errors.name && (
              <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-foreground/80">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="jane@example.com"
              {...register("email")}
              className="rounded-xl border-border/60 focus-visible:ring-ring/50 bg-background/60"
            />
            {errors.email && (
              <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Guest Count */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground/80">
              Number of Guests *
            </Label>
            <div className="flex items-center gap-4">
              <motion.button
                type="button"
                onClick={decrementGuests}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                disabled={guestCount <= 1}
              >
                <Minus className="w-4 h-4" />
              </motion.button>

              <div className="flex-1 text-center">
                <motion.span
                  key={guestCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="text-3xl font-bold font-mono"
                  style={{
                    background: "linear-gradient(135deg, var(--primary), var(--ring))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {guestCount}
                </motion.span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {guestCount === 1 ? "person" : "people"}
                </p>
              </div>

              <motion.button
                type="button"
                onClick={incrementGuests}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                disabled={guestCount >= 10}
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
            <input type="hidden" {...register("guestCount", { valueAsNumber: true })} value={guestCount} />
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-sm font-medium text-foreground/80">
              Leave a Warm Message <span className="text-muted-foreground"></span>
            </Label>
            <Textarea
              id="message"
              placeholder="Write a heartfelt message for the anniversary couple… 💕"
              {...register("message")}
              rows={3}
              className="rounded-xl border-border/60 focus-visible:ring-ring/50 bg-background/60 resize-none"
            />
          </div>

          {/* Submit */}
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl py-6 text-base font-semibold relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 80%, var(--ring)))",
                boxShadow: "0 4px 20px color-mix(in srgb, var(--primary) 35%, transparent)",
              }}
            >
              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                    Sending your RSVP…
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Confirm Attendance
                    <Heart className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
}

interface RSVPSuccessProps {
  name: string;
  guestCount: number;
  onClose: () => void;
}

export function RSVPSuccess({ name, guestCount, onClose }: RSVPSuccessProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="w-full max-w-lg mx-auto text-center"
    >
      <div
        className="rounded-3xl p-10 md:p-14"
        style={{
          background: "var(--card)",
          boxShadow: "0 20px 60px -10px color-mix(in srgb, var(--primary) 25%, transparent)",
          border: "1px solid color-mix(in srgb, var(--ring) 30%, transparent)",
        }}
      >
        <motion.div
          className="text-6xl mb-6"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 15, -15, 0],
          }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          🎉
        </motion.div>

        <h3
          className="text-3xl font-bold mb-3"
          style={{
            fontFamily: "'Playfair Display', serif",
            background: "linear-gradient(135deg, var(--primary), var(--ring))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          You're Coming!
        </h3>

        <p className="text-muted-foreground mb-2">
          Thank you, <span className="font-semibold text-foreground">{name}</span>! 🌸
        </p>

        <p className="text-muted-foreground text-sm mb-8">
          We've reserved{" "}
          <span className="font-semibold text-primary">
            {guestCount} {guestCount === 1 ? "spot" : "spots"}
          </span>{" "}
          for you. We can't wait to celebrate together!
        </p>

        <GoldDivider />

        <div className="flex flex-col gap-2 mt-6 text-sm text-muted-foreground">
          <p>📅 Saturday, August 29, 2026 at 17:00 PM</p>
          <p>📍 Angke Heritage - PIK 2, Lounge Room</p>
          <p>👗 Black Semi-Formal </p>
        </div>

        <motion.button
          onClick={onClose}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          className="mt-8 flex items-center gap-2 mx-auto text-primary font-medium text-sm underline-offset-4 hover:underline"
        >
          <PartyPopper className="w-4 h-4" />
          Add another guest
        </motion.button>
      </div>
    </motion.div>
  );
}
