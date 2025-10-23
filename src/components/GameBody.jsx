import React, { useEffect, useRef, useState } from "react";
import RedCar from "../assets/images/RedCar.png";
import BlueCar from "../assets/images/BlueCar.png";
import { useNavigate } from "react-router-dom";
const LANES = 4;
const CAR_W = 60;
const CAR_H = 70;
const ROAD_H = 700;

export default function GameBody() {
  const [playerLane, setPlayerLane] = useState(1);
  const [enemies, setEnemies] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [speed, setSpeed] = useState(3);
  const passedRef = useRef(0);
  const navigate = useNavigate();
  // 🔹 Klavye kontrolü
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") setPlayerLane((l) => Math.max(0, l - 1));
      if (e.key === "ArrowRight") setPlayerLane((l) => Math.min(LANES - 1, l + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 🔹 Düşman üretimi
  useEffect(() => {
    const spawn = setInterval(() => {
      setEnemies((prev) => {
        const newEnemies = [...prev];
        const activeLanes = new Set(prev.filter((e) => e.y < 200).map((e) => e.lane));

        if (activeLanes.size < 3) {
          let lane;
          do {
            lane = Math.floor(Math.random() * LANES);
          } while (activeLanes.has(lane) && activeLanes.size >= 3);

          newEnemies.push({
            id: crypto.randomUUID(),
            lane,
            y: -CAR_H - 60,
          });
        }

        return newEnemies;
      });
    }, Math.max(700, 1300 - level * 100));

    return () => clearInterval(spawn);
  }, [level]);

  // 🔹 Hareket ve skor
  useEffect(() => {
    const move = setInterval(() => {
      setEnemies((prev) => {
        const moved = [];
        let passed = 0;

        for (const e of prev) {
          const newY = e.y + speed;
          if (newY >= ROAD_H) {
            passed += 1; // Araç ekranı geçti
          } else {
            moved.push({ ...e, y: newY });
          }
        }

        if (passed > 0) {
          // ✅ skor her geçen araçta artar
          setScore((s) => s + passed * level);
          passedRef.current += passed;

          // ✅ 20 araçta seviye artar
          if (passedRef.current >= 20) {
            passedRef.current = 0;
            setLevel((l) => l + 1);
            setSpeed((s) => s * 1.1); // hız %10 artar
          }
        }

        return moved;
      });
    }, 50);

    return () => clearInterval(move);
  }, [speed, level]);

  // 🔹 Çarpışma kontrolü
  useEffect(() => {
    const playerY = ROAD_H - CAR_H - 20;
    const playerTop = playerY;
    const playerBottom = playerY + CAR_H;

    enemies.forEach((enemy) => {
      const enemyTop = enemy.y;
      const enemyBottom = enemy.y + CAR_H;
      const sameLane = enemy.lane === playerLane;

      if (sameLane && enemyBottom > playerTop && enemyTop < playerBottom) {
        // 🟥 Artık alert yok → direkt GameOver sayfasına yönlendiriyoruz
        navigate("/gameover", { state: { score } });

        // Temizle
        setEnemies([]);
        setScore(0);
        setLevel(1);
        setSpeed(3);
        passedRef.current = 0;
      }
    });
  }, [enemies, playerLane, score, navigate]);

  const laneX = (lane) =>
    `calc(${(lane * 100) / LANES}% + ${(100 / LANES) / 2}% - ${CAR_W / 2}px)`;

 return (
  <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
    {/* 🛣️ Oyun kutusu (BURASI relative) */}
    <div className="relative w-[400px] h-[700px] bg-neutral-800 border-4 border-neutral-700 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.2)]">
      
      {/* şeritler */}
      {[...Array(LANES - 1)].map((_, i) => (
        <div
          key={i}
          className="absolute top-0 h-full border-l border-dashed border-white/30"
          style={{ left: `${((i + 1) * 100) / LANES}%` }}
        />
      ))}

      {/* oyuncu */}
      <img
        src={RedCar}
        alt="player"
        className="absolute z-20 select-none"
        style={{
          width: `${CAR_W}px`,
          height: `${CAR_H}px`,
          imageRendering: "pixelated",
          bottom: "20px",
          left: laneX(playerLane),
        }}
      />

      {/* düşmanlar */}
      {enemies.map((e) => (
        <img
          key={e.id}
          src={BlueCar}
          alt="enemy"
          className="absolute z-10 select-none"
          style={{
            width: `${CAR_W}px`,
            height: `${CAR_H}px`,
            imageRendering: "pixelated",
            top: `${e.y}px`,
            left: laneX(e.lane),
          }}
        />
      ))}

      {/* skor / seviye */}
      <div className="absolute top-3 left-3 bg-black/50 px-3 py-1 rounded text-sm font-semibold">
        🏁 Skor: <span className="text-green-400">{score}</span> | 🔥 Seviye:{" "}
        <span className="text-orange-400">{level}</span>
      </div>

      {/* 🕹️ JOYSTICK — ***OYUN KUTUSUNUN İÇİNDE*** ve ***EN ALT ORTADA*** */}
      <div
        data-testid="joystick"
        className="pointer-events-auto z-30"
        style={{
          position: "absolute",
          bottom: 8,            // ← alt çizgiye yakın
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <div className="relative flex flex-col items-center justify-center">
          <div className="absolute w-36 h-36 rounded-full bg-blue-500/20 blur-3xl" />
          <button className="mb-2 w-12 h-12 rounded-full bg-blue-500 text-white text-lg shadow-[0_0_12px_rgba(59,130,246,0.8)] hover:bg-blue-400 active:translate-y-1 transition">⬆️</button>
          <div className="flex items-center justify-center gap-5">
            <button
              onClick={() => setPlayerLane((l) => Math.max(0, l - 1))}
              className="w-12 h-12 rounded-full bg-blue-500 text-white text-lg shadow-[0_0_12px_rgba(59,130,246,0.8)] hover:bg-blue-400 active:-translate-x-1 transition"
            >⬅️</button>
            <div className="w-8 h-8 rounded-full bg-blue-400/30 border border-blue-300 shadow-[inset_0_0_10px_rgba(59,130,246,0.8)]" />
            <button
              onClick={() => setPlayerLane((l) => Math.min(LANES - 1, l + 1))}
              className="w-12 h-12 rounded-full bg-blue-500 text-white text-lg shadow-[0_0_12px_rgba(59,130,246,0.8)] hover:bg-blue-400 active:translate-x-1 transition"
            >➡️</button>
          </div>
          <button className="mt-2 w-12 h-12 rounded-full bg-blue-500 text-white text-lg shadow-[0_0_12px_rgba(59,130,246,0.8)] hover:bg-blue-400 active:-translate-y-1 transition">⬇️</button>
        </div>
      </div>
      {/* 🔚 JOYSTICK — bu yorumdan SONRA oyun kutusu kapanıyor */}
    </div>
  </div>
);


}
