import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { sdk } from "@farcaster/miniapp-sdk"; // ✅ Farcaster SDK
import FirstPage from "./components/FirstPage";
import Game from "./components/Game";
import GameOver from "./components/GameOver";
import "./App.css";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // ✅ SDK hazır olduğunda splash ekran kapanır
        await sdk.actions.ready();
        console.log("✅ Farcaster MiniApp SDK hazır!");
        setReady(true);
      } catch (err) {
        console.warn("⚠️ SDK yüklenemedi:", err);
        // Farcaster dışında çalışırken bile app açılabilsin
        setReady(true);
      }
    };
    init();
  }, []);

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white text-xl">
        Yükleniyor...
      </div>
    );
  }

  return (
    <Router>
      <div className="w-full h-screen bg-black text-white">
        <Routes>
          {/* 🏁 Açılış sayfası */}
          <Route path="/" element={<FirstPage />} />

          {/* 🎮 Oyun sayfası */}
          <Route path="/game" element={<Game />} />

          {/* 💥 Oyun bitti sayfası */}
          <Route path="/gameover" element={<GameOver />} />
        </Routes>
      </div>
    </Router>
  );
}
