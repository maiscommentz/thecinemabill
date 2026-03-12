"use client";

import React, { useRef, useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Receipt } from "@/components/Receipt";
import { SplashScreen } from "@/components/SplashScreen";
import { InfoModal } from "@/components/InfoModal";
import { motion, AnimatePresence } from "framer-motion";
import * as htmlToImage from "html-to-image";
import { Download, Share2, Info } from "lucide-react";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [username, setUsername] = useState("");
  const [listType, setListType] = useState("Recent Activity");
  const [timePeriod, setTimePeriod] = useState("Last Month");
  const [amount, setAmount] = useState("5");
  const [ticketStyle, setTicketStyle] = useState("Classic Thermal");
  const [codeStyle, setCodeStyle] = useState("Barcode");
  const [showRatings, setShowRatings] = useState(true);
  const [showGenres, setShowGenres] = useState(true);

  const [hasGenerated, setHasGenerated] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Read URL params on load and hydrate state
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasParams = params.toString().length > 0;

    if (params.get("user")) setUsername(params.get("user")!);
    if (params.get("list")) setListType(params.get("list")!);
    if (params.get("period")) setTimePeriod(params.get("period")!);
    if (params.get("amount")) {
      const raw = parseInt(params.get("amount")!);
      if (!isNaN(raw)) setAmount(String(Math.min(10, Math.max(1, raw))));
    }
    if (params.get("style")) setTicketStyle(params.get("style")!);
    if (params.get("code")) setCodeStyle(params.get("code")!);
    if (params.get("ratings")) setShowRatings(params.get("ratings") === "1");
    if (params.get("genres")) setShowGenres(params.get("genres") === "1");

    // Auto-generate receipt if params were present
    if (hasParams) {
      setTimeout(() => setHasGenerated(true), 200);
    }
  }, []);

  const handleGenerate = () => {
    // Reset generation state to trigger animation re-run
    setHasGenerated(false);
    setTimeout(() => {
      setHasGenerated(true);
    }, 100);
  };

  const handleDownload = async () => {
    if (receiptRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(receiptRef.current, { quality: 1, pixelRatio: 3 });
        const link = document.createElement("a");
        link.download = `cinema-bill-${username || "cinephile"}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("Failed to download image", err);
      }
    }
  };

  const numAmount = parseInt(amount) || 5;
  const scaleAmount = numAmount <= 5 ? 1 : Math.max(0.4, 1 - (numAmount - 5) * 0.04);

  return (
    <>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />
      <main className="flex h-screen w-full overflow-hidden bg-white">
        <Sidebar
          username={username} setUsername={setUsername}
          listType={listType} setListType={setListType}
          timePeriod={timePeriod} setTimePeriod={setTimePeriod}
          amount={amount} setAmount={setAmount}
          ticketStyle={ticketStyle} setTicketStyle={setTicketStyle}
          codeStyle={codeStyle} setCodeStyle={setCodeStyle}
          showRatings={showRatings} setShowRatings={setShowRatings}
          showGenres={showGenres} setShowGenres={setShowGenres}
          onGenerate={handleGenerate}
        />

        <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8" style={{ background: "#f5f0f0" }}>
          {/* Soft color blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-50" style={{ background: "radial-gradient(circle, #ffd6d6 0%, transparent 70%)" }} />
            <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-50" style={{ background: "radial-gradient(circle, #c8f0e0 0%, transparent 70%)" }} />
            <div className="absolute top-1/2 -right-20 w-[500px] h-[500px] rounded-full opacity-60" style={{ background: "radial-gradient(circle, #d4e8ff 0%, transparent 70%)" }} />
            <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] rounded-full opacity-55" style={{ background: "radial-gradient(circle, #e8d4ff 0%, transparent 70%)" }} />
            <div className="absolute top-0 right-1/3 w-[420px] h-[420px] rounded-full opacity-55" style={{ background: "radial-gradient(circle, #ffecd2 0%, transparent 70%)" }} />
          </div>

          {!hasGenerated && (
            <div className="text-gray-400 font-mono text-sm tracking-widest uppercase">
              Awaiting Generation...
            </div>
          )}

          <AnimatePresence>
            {hasGenerated && (
              <motion.div
                initial={{ y: "150%", opacity: 0, scale: scaleAmount }}
                animate={{ y: 0, opacity: 1, scale: scaleAmount }}
                exit={{ y: "150%", opacity: 0, scale: scaleAmount }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="relative z-10"
              >
                <Receipt
                  ref={receiptRef}
                  username={username}
                  listType={listType}
                  timePeriod={timePeriod}
                  amount={amount}
                  ticketStyle={ticketStyle}
                  codeStyle={codeStyle}
                  showRatings={showRatings}
                  showGenres={showGenres}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-20">
            <button
              onClick={() => setShowInfo(true)}
              className="w-12 h-12 bg-white brutal-border brutal-shadow rounded-full flex items-center justify-center hover:bg-gray-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              title="About"
            >
              <Info className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              className="w-12 h-12 bg-white brutal-border brutal-shadow rounded-full flex items-center justify-center hover:bg-gray-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              title="Share"
            >
              <Share2 className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={handleDownload}
              className="w-12 h-12 bg-black text-white brutal-border border-black brutal-shadow rounded-full flex items-center justify-center active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
