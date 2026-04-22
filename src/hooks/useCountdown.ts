import { useEffect, useState } from "react";
import { getTimeRemaining, EVENT_DATE } from "@/lib/index";

interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function useCountdown(): CountdownValues {
  const [timeLeft, setTimeLeft] = useState<CountdownValues>(
    getTimeRemaining(EVENT_DATE)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(EVENT_DATE));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return timeLeft;
}
