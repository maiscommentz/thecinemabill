"use client";

import React, { useRef, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Receipt } from "@/components/Receipt";
import { motion, AnimatePresence } from "framer-motion";
import * as htmlToImage from "html-to-image";
import { Download, Share2 } from "lucide-react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [listType, setListType] = useState("Recent activity");
  const [timePeriod, setTimePeriod] = useState("Last Month");
  const [amount, setAmount] = useState("5");
  const [ticketStyle, setTicketStyle] = useState("Classic Thermal");
  const [codeStyle, setCodeStyle] = useState("Barcode");
  const [showRatings, setShowRatings] = useState(true);
  const [showGenres, setShowGenres] = useState(true);

  const [hasGenerated, setHasGenerated] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

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
  const scaleAmount = numAmount <= 5 ? 1 : Math.max(0.4, 1 - (numAmount - 5) * 0.03);

  return (
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

      <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#fff7ed] via-[#fef2f2] to-[#eff6ff]">

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
          <button className="w-12 h-12 bg-white brutal-border brutal-shadow rounded-full flex items-center justify-center hover:bg-gray-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
            <Share2 className="w-4 h-4 stroke-[2.5]" />
          </button>
          <button
            onClick={handleDownload}
            className="w-12 h-12 bg-black text-white brutal-border border-black brutal-shadow rounded-full flex items-center justify-center hover:bg-gray-900 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </main>
  );
}
