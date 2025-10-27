import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { sdk } from "@farcaster/miniapp-sdk";
import { useAccount, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { CONTRACT_ADDRESS, ABI } from "./ScoreMint";
import { ethers } from "ethers";
export default function GameOver() {
  const navigate = useNavigate();
  const location = useLocation();
  const score = location.state?.score ?? 0;

  const { address, isConnected } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

 const handleMint = async () => {
  try {
    console.log("🪙 Mint işlemi başlatılıyor...");

    // 🔍 Önce Farcaster Wallet var mı kontrol et
    let provider;

    if (window.ethereum?.providers?.length) {
      // birden fazla provider varsa (örneğin Farcaster + MetaMask)
      provider =
        window.ethereum.providers.find((p) => p.isFarcaster) || // ✅ Öncelik Farcaster
        window.ethereum.providers.find((p) => p.isMetaMask) || // sonra MetaMask
        window.ethereum.providers[0];
    } else {
      provider = window.ethereum;
    }

    if (!provider) {
      alert("⚠️ Cüzdan bulunamadı!");
      return;
    }

    // 💡 Bilgi amaçlı log
    console.log(
      "🔗 Aktif Wallet:",
      provider.isFarcaster
        ? "Farcaster Wallet"
        : provider.isMetaMask
        ? "MetaMask"
        : "Bilinmiyor"
    );

    // 🔌 Provider'ı ethers ile bağla
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();

    // ⛓️ Kontratı bağla
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    // 💸 Mint işlemini gönder
    const tx = await contract.mintScore(score, {
      value: ethers.parseEther("0.00002"),
    });

    console.log("✅ Mint gönderildi:", tx.hash);

    alert(
      `🎉 Mint başarılı!\nTx Hash:\n${tx.hash}\n\n👇 Basescan'de görmek için tıkla`
    );
    window.open(`https://basescan.org/tx/${tx.hash}`, "_blank");
  } catch (err) {
    console.error("Mint hatası:", err);
    alert("Mint işlemi başarısız 😅");
  }
};

  const handleCast = async () => {
    const text = `🏎️💨 Race Master'da ${score} puan yaptım! 🏁🔥\nSenin hızın buna yeter mi? ⚡🚗`;
    const appUrl = "https://farcaster.xyz/miniapps/_TqCvCpPc4Sg/race-master";

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

        {/* ✨ Skor Kutusu */}
        <div className="relative w-full max-w-[320px] p-[2px] mb-10 rounded-3xl bg-gradient-to-r from-fuchsia-500 via-yellow-400 to-cyan-400 shadow-[0_0_30px_rgba(255,255,255,0.3)] animate-pulse">
          <div className="bg-black/70 rounded-3xl py-6 px-6 text-center backdrop-blur-xl">
            <p className="text-xl font-semibold mb-2">✨ Final Skorun ✨</p>
            <p className="text-6xl font-extrabold text-yellow-300 animate-bounce">{score}</p>
          </div>
        </div>

        {/* 🚀 Butonlar */}
        <div className="flex flex-col gap-5 w-full">
          <button
            onClick={handleCast}
            className="w-full py-4 rounded-full text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 transition-all duration-300"
          >
            📣 Share Your Score
          </button>

          <button
            onClick={handleMint}
            disabled={isPending}
            className="w-full py-4 rounded-full text-lg font-semibold bg-gradient-to-r from-amber-400 to-yellow-500 hover:scale-105 transition-all duration-300"
          >
            {isPending ? "⏳ Minting..." : "🪙 Mint Score"}
          </button>

          <button
            onClick={() => navigate("/game")}
            className="w-full py-4 rounded-full text-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition-all duration-300"
          >
            🔁 Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
