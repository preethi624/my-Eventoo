import  { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function CountdownTimer({ eventDate }: { eventDate: string }) {
  const calculateTimeLeft = (): TimeLeft | null => {
    const difference = +new Date(eventDate) - +new Date();
    let timeLeft: TimeLeft | null = null;
    
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [eventDate]);

  return (
    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg font-semibold">
      {timeLeft ? (
        <>
          <span className="text-sm">⏰</span>
          <span className="font-mono tracking-wide">
            {timeLeft.days > 0 && `${timeLeft.days}d `}
            {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </span>
        </>
      ) : (
        <>
          <span className="text-sm animate-bounce">🎉</span>
          <span>Event Started!</span>
        </>
      )}
    </div>
  );
}

export default CountdownTimer;