import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { sdk } from "@farcaster/miniapp-sdk"; // ✅ Farcaster SDK

export default function GameOver() {
  const navigate = useNavigate();
  const location = useLocation();
  const score = location.state?.score ?? 0;

  const handleCast = async () => {
    const text = `💥 Airdrop Hunter'da ${score} puan yaptım! 🚀\nBenim skorumu geçebilir misin? 🎯`;
    const appUrl = "https://farcaster.xyz/miniapps/QBCgeq4Db7Wx/airdrop-hunter";

    try {
      const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(
        text
      )}&embeds[]=${encodeURIComponent(appUrl)}`;
      await sdk.actions.openUrl({ url: warpcastUrl });
      console.log("✅ Cast composer açıldı");
    } catch (err) {
      console.error("Cast hatası:", err);
      alert("Cast işlemi başarısız oldu 😅");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white px-6">
      <div className="w-full max-w-[380px] text-center flex flex-col items-center justify-center">

        {/* 💥 GAME OVER Başlığı */}
        <div className="relative mb-12">
          <h1 className="relative z-20 text-6xl font-extrabold tracking-widest text-red-500 drop-shadow-[0_0_30px_rgba(255,0,0,0.9)] animate-pulse">
            💥 GAME OVER 💥
          </h1>
          <div className="absolute inset-0 z-0 blur-3xl bg-gradient-to-r from-red-600 via-pink-500 to-yellow-400 opacity-50 animate-ping"></div>
        </div>

        {/* ✨ Afilli Neon Skor Kutusu */}
        <div className="relative w-full max-w-[320px] p-[2px] mb-10 rounded-3xl bg-gradient-to-r from-fuchsia-500 via-yellow-400 to-cyan-400 shadow-[0_0_30px_rgba(255,255,255,0.3)] animate-pulse">
          <div className="bg-black/70 rounded-3xl py-6 px-6 text-center backdrop-blur-xl">
            <p className="text-xl font-semibold bg-clip-text bg-gradient-to-r from-fuchsia-300 via-yellow-300 to-cyan-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] mb-2">
              ✨ Final Skorun ✨
            </p>
            <p className="text-6xl font-extrabold text-yellow-300 drop-shadow-[0_0_25px_rgba(255,255,0,0.9)] animate-bounce">
              {score}
            </p>
          </div>
        </div>

        {/* 🚀 Butonlar */}
        <div className="flex flex-col gap-5 w-full">

          {/* 🔹 SHARE BUTTON */}
          <button
            onClick={handleCast}
            className="w-full py-4 rounded-full text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 shadow-[0_0_25px_rgba(59,130,246,0.8)] hover:shadow-[0_0_40px_rgba(59,130,246,1)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 1080 1080"
              fill="none"
              className="drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
            >
              <rect width="1080" height="1080" rx="120" fill="#6A3CFF"></rect>
              <path
                d="M847.387 270V343.023H774.425V415.985H796.779V416.01H847.387V810.795H725.173L725.099 810.434L662.737 515.101C656.791 486.949 641.232 461.477 618.927 443.362C596.623 425.248 568.527 415.275 539.818 415.275H539.575C510.866 415.275 482.77 425.248 460.466 443.362C438.161 461.477 422.602 486.958 416.657 515.101L354.223 810.795H232V416.001H282.608V415.985H304.959V343.023H232V270H847.387Z"
                fill="white"
              ></path>
            </svg>
            Share Your Score
          </button>

          {/* 🔹 MINT BUTTON */}
          <button className="w-full py-4 rounded-full text-lg font-semibold bg-gradient-to-r from-amber-400 to-yellow-500 shadow-[0_0_25px_rgba(255,215,0,0.8)] hover:shadow-[0_0_40px_rgba(255,220,0,1)] hover:scale-105 transition-all duration-300">
            🪙 Mint Score
          </button>

          {/* 🔹 TRY AGAIN BUTTON */}
          <button
            onClick={() => navigate("/game")}
            className="w-full py-4 rounded-full text-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-[0_0_25px_rgba(236,72,153,0.9)] hover:shadow-[0_0_40px_rgba(236,72,153,1)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            🔁 Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
