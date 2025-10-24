import React, { useEffect, useRef, useState } from "react";
import RedCar from "../assets/images/RedCar.png";
import BlueCar from "../assets/images/BlueCar.png";
import { useNavigate } from "react-router-dom";
import CrashSound from "../assets/sounds/crash.mp3";
const LANES = 4;
const CAR_W = 60;
const CAR_H = 70;
const ROAD_H = 700;

export default function GameBody() {
  const [playerX, setPlayerX] = useState(0);
  const [enemies, setEnemies] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [speed, setSpeed] = useState(3);
  const [crashed, setCrashed] = useState(false);
  const [blast, setBlast] = useState(null);
  const passedRef = useRef(0);
  const containerRef = useRef(null);
  const isMouseDown = useRef(false);
  const direction = useRef(null);
  const navigate = useNavigate();

 // 🖱️ / 📱 Dokunmatik + Fare kontrolü
useEffect(() => {
  const down = (clientX) => {
    isMouseDown.current = true;
    const rect = containerRef.current.getBoundingClientRect();
    const midX = rect.left + rect.width / 2;
    direction.current = clientX < midX ? "left" : "right";
  };

  const up = () => {
    isMouseDown.current = false;
    direction.current = null;
  };

  // 🖱️ fare olayları
  const handleMouseDown = (e) => down(e.clientX);
  const handleMouseUp = () => up();

  // 📱 dokunmatik olayları
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      down(e.touches[0].clientX);
    }
  };
  const handleTouchEnd = () => up();

  window.addEventListener("mousedown", handleMouseDown);
  window.addEventListener("mouseup", handleMouseUp);
  window.addEventListener("touchstart", handleTouchStart);
  window.addEventListener("touchend", handleTouchEnd);

  return () => {
    window.removeEventListener("mousedown", handleMouseDown);
    window.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("touchstart", handleTouchStart);
    window.removeEventListener("touchend", handleTouchEnd);
  };
}, []);


  // 🚗 Hareket (tam kenara kadar)
  useEffect(() => {
    let raf;
    const move = () => {
      if (isMouseDown.current && containerRef.current) {
        const w = containerRef.current.clientWidth;
        const minX = 0;
        const maxX = w - CAR_W;
        setPlayerX((x) => {
          const step = 5;
          if (direction.current === "left") return Math.max(minX, x - step);
          if (direction.current === "right") return Math.min(maxX, x + step);
          return x;
        });
      }
      raf = requestAnimationFrame(move);
    };
    raf = requestAnimationFrame(move);
    return () => cancelAnimationFrame(raf);
  }, []);

  // 🔹 Düşman oluşturma
  useEffect(() => {
    const spawn = setInterval(() => {
      setEnemies((prev) => {
        const list = [...prev];
        if (list.length < 5) {
          const lane = Math.floor(Math.random() * LANES);
          const laneW = 260 / LANES;
          const x = laneW * lane + laneW / 2 - CAR_W / 2;
          list.push({ id: crypto.randomUUID(), x, y: -CAR_H - 60 });
        }
        return list;
      });
    }, Math.max(700, 1300 - level * 100));
    return () => clearInterval(spawn);
  }, [level]);

  // 🔹 Düşman hareketi ve skor
  useEffect(() => {
    const t = setInterval(() => {
      setEnemies((prev) => {
        const moved = [];
        let passed = 0;
        for (const e of prev) {
          const y = e.y + speed;
          if (y >= ROAD_H) passed++;
          else moved.push({ ...e, y });
        }
        if (passed) {
          setScore((s) => s + passed * level);
          passedRef.current += passed;
          if (passedRef.current >= 10) {
            passedRef.current = 0;
            setLevel((l) => l + 1);
            setSpeed((s) => s * 1.1);
          }
        }
        return moved;
      });
    }, 50);
    return () => clearInterval(t);
  }, [speed, level]);

  // 💥 Çarpışma + animasyon
 useEffect(() => {
  if (crashed) return;

  const playerY = ROAD_H - CAR_H - 20;
  const pL = playerX + 8,
        pR = playerX + CAR_W - 8,
        pT = playerY + 10,
        pB = playerY + CAR_H - 5;

  enemies.forEach((e) => {
    const eL = e.x + 8,
          eR = e.x + CAR_W - 8,
          eT = e.y + 10,
          eB = e.y + CAR_H - 5;
    const hDist = Math.abs((pL + pR) / 2 - (eL + eR) / 2);
    const overlapY = pT < eB && pB > eT;

    if (hDist < CAR_W - 25 && overlapY) {
      // ✅ çarpışma tespit edildi
      setCrashed(true);
      setBlast({ x: playerX + CAR_W / 2, y: playerY + CAR_H / 2 });

      // 🔊 ses çal
      const crashAudio = new Audio(CrashSound);
      crashAudio.volume = 0.8;
      crashAudio.currentTime = 0;
      crashAudio.play().catch((err) => console.warn("Ses engellendi:", err));

      // ⏱ animasyon + ses senkronu
      setTimeout(() => {
        navigate("/gameover", { state: { score } });
        setEnemies([]);
        setScore(0);
        setLevel(1);
        setSpeed(3);
        passedRef.current = 0;
        setCrashed(false);
        setBlast(null);
      }, 1400);
    }
  });
}, [enemies, playerX, score, navigate, crashed]);


  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#E4C59E] text-white">
      <div
        ref={containerRef}
        className="relative w-[280px] h-[700px] bg-[#2F2F2F] border-4 border-[#3A3A3A] rounded-xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.2)] mx-auto select-none"
      >
        {[...Array(LANES - 1)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 h-full"
            style={{
              left: `${((i + 1) * 100) / LANES}%`,
              borderLeft: "3px dashed white",
              height: "100%",
            }}
          />
        ))}

        <img
          src={RedCar}
          alt="player"
          className={`absolute z-20 ${crashed ? "animate-crash" : "transition-all duration-75 ease-linear"}`}
          style={{
            width: CAR_W,
            height: CAR_H,
            bottom: 20,
            left: playerX,
          }}
        />

        {blast && (
          <div
            className="absolute z-30 animate-boom pointer-events-none"
            style={{
              width: 10,
              height: 10,
              left: blast.x - 5,
              top: blast.y - 5,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,210,120,1) 0%, rgba(255,120,0,0.8) 40%, rgba(255,0,0,0.6) 60%, rgba(0,0,0,0) 70%)",
            }}
          />
        )}

        {enemies.map((e) => (
          <img
            key={e.id}
            src={BlueCar}
            alt="enemy"
            className="absolute z-10"
            style={{ width: CAR_W, height: CAR_H, top: e.y, left: e.x }}
          />
        ))}

        {/* 🏁 Skor / Seviye */}
<div className="absolute top-3 left-3 px-3 py-1 rounded text-sm font-semibold bg-black/50 backdrop-blur-sm text-[#FFD700]">
  🏁 <span className="font-semibold text-[#FFD700]">Skor:</span> <span className="font-semibold text-[#FFD700]">{score}</span>
  {" "} | 🔥 <span className="font-semibold text-[#FFD700]">Seviye:</span> <span className="font-semibold text-[#FFD700]">{level}</span>
</div>

      </div>
    </div>
  );
}
