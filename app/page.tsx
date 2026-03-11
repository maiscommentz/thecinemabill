"use client";

import React, { useRef, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Receipt } from "@/components/Receipt";
import { motion, AnimatePresence } from "framer-motion";
import * as htmlToImage from "html-to-image";
import { Download, Share2 } from "lucide-react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [listType, setListType] = useState("Recent Activity");
  const [timePeriod, setTimePeriod] = useState("Last Month");
  const [ticketStyle, setTicketStyle] = useState("Thermal Paper");
  const [codeStyle, setCodeStyle] = useState("Barcode");
  const [showRatings, setShowRatings] = useState(true);
  const [showRuntimes, setShowRuntimes] = useState(true);

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

  return (
    <main className="flex h-screen w-full overflow-hidden bg-white">
      <Sidebar
        username={username} setUsername={setUsername}
        listType={listType} setListType={setListType}
        timePeriod={timePeriod} setTimePeriod={setTimePeriod}
        ticketStyle={ticketStyle} setTicketStyle={setTicketStyle}
        codeStyle={codeStyle} setCodeStyle={setCodeStyle}
        showRatings={showRatings} setShowRatings={setShowRatings}
        showRuntimes={showRuntimes} setShowRuntimes={setShowRuntimes}
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
              initial={{ y: "150%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "150%", opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="relative z-10"
            >
              <Receipt
                ref={receiptRef}
                username={username}
                listType={listType}
                timePeriod={timePeriod}
                ticketStyle={ticketStyle}
                codeStyle={codeStyle}
                showRatings={showRatings}
                showRuntimes={showRuntimes}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="absolute bottom-8 right-8 flex flex-col gap-4 z-20">
          <button className="w-14 h-14 bg-white brutal-border brutal-shadow rounded-full flex items-center justify-center hover:bg-gray-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
            <Share2 className="w-5 h-5 stroke-[2.5]" />
          </button>
          <button
            onClick={handleDownload}
            className="w-14 h-14 bg-black text-white brutal-border border-black brutal-shadow rounded-full flex items-center justify-center hover:bg-gray-900 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <Download className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </main>
  );
}
