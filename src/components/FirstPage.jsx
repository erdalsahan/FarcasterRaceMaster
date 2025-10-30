import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import firstPageImage from "../assets/images/FirstPage.png";
import { base } from "viem/chains";
import { useAccount, useConnect, useWriteContract } from "wagmi";
import { injected } from "wagmi/connectors";
import { sdk } from "@farcaster/miniapp-sdk";
import { CONTRACT_ADDRESS, ABI } from "./ScoreMint";

export default function FirstPage() {
  const navigate = useNavigate();

  // 🧩 wagmi hooks
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({ connector: injected() });
  const { writeContractAsync, isPending } = useWriteContract();

  // ⚙️ State
  const [minting, setMinting] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState("");

  // 🪙 Mint işlemi (GameOver’daki mantıkla birebir)
  const handleMint = async () => {
    try {
      setMinting(true);
      setError("");
      console.log("🪙 Mint işlemi başlatılıyor...");

      // 1️⃣ Farcaster Wallet varsa
      if (sdk && sdk.wallet?.address) {
        console.log("✅ Farcaster Wallet bulundu:", sdk.wallet.address);
      }
      // 2️⃣ Farcaster yoksa MetaMask bağlantısı
      else if (!isConnected) {
        console.log("🔗 MetaMask bağlantısı kuruluyor...");
        await connect();
      }

      // 3️⃣ Mint fonksiyonunu çağır
      const score = 0; // girişte skor 0 olarak setlenebilir
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: "mintScore", // GameOver'daki fonksiyon adı
        args: [score],
        value: BigInt(20000000000000), // 0.00002 ETH
        chainId: base.id,
      });

      console.log("✅ Mint gönderildi:", tx);
      setTxHash(tx);
      alert(`🎉 Mint başarılı!\nTx Hash:\n${tx}`);
      window.open(`https://basescan.org/tx/${tx}`, "_blank");
    } catch (err) {
      console.error("Mint hatası:", err);
      setError("Mint işlemi başarısız 😅");
    } finally {
      setMinting(false);
    }
  };

  // 🎮 Oyunu başlat
  const handleStart = () => {
    navigate("/game");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white relative">
      {/* 🖼️ Ana görsel */}
      <img
        src={firstPageImage}
        alt="Race Master"
        className="w-3/5 max-w-[600px] mb-12 animate-fadeIn"
      />

      {/* 🚀 Butonlar */}
      <div className="flex flex-col gap-6 w-full max-w-[320px] text-center">
        <button
          onClick={handleStart}
          className="py-4 rounded-full text-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition-all duration-300"
        >
          🎮 Start Game
        </button>

        <button
          onClick={handleMint}
          disabled={minting || isPending}
          className={`py-4 rounded-full text-lg font-semibold transition-all duration-300 ${
            minting
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-amber-400 to-yellow-500 hover:scale-105"
          }`}
        >
          {minting || isPending ? "⏳ Mintleniyor..." : "🪙 Mint Score"}
        </button>

        {txHash && (
          <p className="text-green-400 text-sm">
            ✅ Tx gönderildi: {txHash.slice(0, 10)}...
          </p>
        )}
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      {/* 🎨 Basit fadeIn animasyonu */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
