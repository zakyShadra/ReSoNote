import { useState, useEffect, useRef, useCallback } from "react";
import "../style/particles.css";

export function SummerLeaves() {
  const [leaves] = useState(() => 
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 4 + Math.random() * 2,
    }))
  );
  
  const containerRef = useRef(null);

  const handleClear = useCallback((e) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const leafElements = container.querySelectorAll(".leaf");
    leafElements.forEach((el) => {
      const elRect = el.getBoundingClientRect();
      const elCenterX = elRect.left - rect.left + elRect.width / 2;
      const elCenterY = elRect.top - rect.top + elRect.height / 2;
      const distance = Math.hypot(x - elCenterX, y - elCenterY);

      if (distance < 100) {
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
      }
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    
    const handleTouch = (e) => {
      if (e.touches[0]) {
        handleClear({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
      }
    };

    container?.addEventListener("click", handleClear);
    container?.addEventListener("touchmove", handleTouch);

    return () => {
      container?.removeEventListener("click", handleClear);
      container?.removeEventListener("touchmove", handleTouch);
    };
  }, [handleClear]);

  return (
    <div ref={containerRef} className="particles-container summer">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="leaf"
          style={{
            left: `${leaf.left}%`,
            "--delay": `${leaf.delay}s`,
            "--duration": `${leaf.duration}s`,
          }}
        >
          🍂
        </div>
      ))}
    </div>
  );
}

export function SnowFlakes() {
  // Terapkan cara yang sama untuk SnowFlakes
  const [snowflakes] = useState(() => 
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 6 + Math.random() * 4,
      size: 0.6 + Math.random() * 0.8,
    }))
  );

  const containerRef = useRef(null);

  const handleClear = useCallback((e) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const flakeElements = container.querySelectorAll(".snowflake");
    flakeElements.forEach((el) => {
      const elRect = el.getBoundingClientRect();
      const elCenterX = elRect.left - rect.left + elRect.width / 2;
      const elCenterY = elRect.top - rect.top + elRect.height / 2;
      const distance = Math.hypot(x - elCenterX, y - elCenterY);

      if (distance < 120) {
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
      }
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    
    const handleTouch = (e) => {
      if (e.touches[0]) {
        handleClear({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
      }
    };

    container?.addEventListener("click", handleClear);
    container?.addEventListener("touchmove", handleTouch);

    return () => {
      container?.removeEventListener("click", handleClear);
      container?.removeEventListener("touchmove", handleTouch);
    };
  }, [handleClear]);

  return (
    <div ref={containerRef} className="particles-container snow">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            "--delay": `${flake.delay}s`,
            "--duration": `${flake.duration}s`,
            "--size": flake.size,
          }}
        >
          ❄️
        </div>
      ))}
    </div>
  );
}

export function LoveHearts() {
  const [hearts] = useState(() =>
    Array.from({ length: 34 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 7 + Math.random() * 5,
      size: 0.75 + Math.random() * 0.9,
      drift: -40 + Math.random() * 80,
    }))
  );

  return (
    <div className="particles-container love">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="love-heart"
          style={{
            left: `${heart.left}%`,
            "--delay": `${heart.delay}s`,
            "--duration": `${heart.duration}s`,
            "--size": heart.size,
            "--drift": `${heart.drift}px`,
          }}
        >
          ♥
        </div>
      ))}
    </div>
  );
}

export default function ThemeParticles({ theme }) {
  if (theme === "summer") return <SummerLeaves />;
  if (theme === "snow") return <SnowFlakes />;
  if (theme === "love") return <LoveHearts />;
  return null;
}
