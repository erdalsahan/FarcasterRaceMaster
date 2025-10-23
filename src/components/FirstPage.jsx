import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import firstPageImage from "../assets/images/FirstPage.png";

const FirstPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/game"); // 3 saniye sonra yönlendir
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <img
        src={firstPageImage}
        alt="Race Master"
        className="w-3/5 max-w-[600px] animate-fadeOut"
      />

      {/* Fade-out animasyonu */}
      <style>{`
        @keyframes fadeOut {
          0% { opacity: 1; }
          90% { opacity: 0.8; transform: scale(1.02); }
          100% { opacity: 0; transform: scale(1.05); }
        }
        .animate-fadeOut {
          animation: fadeOut 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FirstPage;
