"use client";

import React, { useRef, useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Receipt } from "@/components/Receipt";
import { SplashScreen } from "@/components/SplashScreen";
import { InfoModal } from "@/components/InfoModal";
import { motion, AnimatePresence } from "framer-motion";
import * as htmlToImage from "html-to-image";
import { Download, Share2, Info, SlidersHorizontal, Check, X } from "lucide-react";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "done" | "error">("idle");

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

  // Track viewport for responsive receipt scaling
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Read URL params on load and hydrate state.
  // Each option param is validated against its allowed values, invalid values are ignored.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const LIST_TYPES = ["Recent Activity", "My Favourites"] as const;
    const TIME_PERIODS = ["Last week", "Last Month", "Last Year", "All Time"] as const;
    const STYLES = ["Classic Thermal", "Midnight OLED", "Eco-Kraft", "Premiere VIP"] as const;
    const CODE_STYLES = ["Barcode", "QR Code"] as const;

    const user = params.get("user");
    if (user) setUsername(user.trim().slice(0, 50));

    const list = params.get("list");
    if (LIST_TYPES.includes(list as typeof LIST_TYPES[number])) setListType(list!);

    const period = params.get("period");
    if (TIME_PERIODS.includes(period as typeof TIME_PERIODS[number])) setTimePeriod(period!);

    const amount = params.get("amount");
    if (amount) {
      const raw = parseInt(amount);
      if (!isNaN(raw)) setAmount(String(Math.min(5, Math.max(1, raw))));
    }

    const style = params.get("style");
    if (STYLES.includes(style as typeof STYLES[number])) setTicketStyle(style!);

    const code = params.get("code");
    if (CODE_STYLES.includes(code as typeof CODE_STYLES[number])) setCodeStyle(code!);

    const ratings = params.get("ratings");
    if (ratings === "1" || ratings === "0") setShowRatings(ratings === "1");

    const genres = params.get("genres");
    if (genres === "1" || genres === "0") setShowGenres(genres === "1");

    // If any valid params were present, treat as "user already generated"
    if (user || list || period || amount || style || code || ratings || genres) {
      setHasGenerated(true);
    }
  }, []);

  const handleGenerate = () => {
    setHasGenerated(false);
    setTimeout(() => setHasGenerated(true), 100);
    setSidebarOpen(false);
  };

  const handleDownload = async () => {
    if (!receiptRef.current || downloadState === "loading") return;
    setDownloadState("loading");
    try {
      const dataUrl = await htmlToImage.toPng(receiptRef.current, { quality: 1, pixelRatio: 3 });
      const link = document.createElement("a");
      link.download = `cinema-bill-${username || "cinephile"}.png`;
      link.href = dataUrl;
      link.click();
      setDownloadState("done");
    } catch (err) {
      console.error("Failed to download image", err);
      setDownloadState("error");
    } finally {
      setTimeout(() => setDownloadState("idle"), 2000);
    }
  };

  const numAmount = parseInt(amount) || 5;
  const scaleAmount = (() => {
    // Mobile: always full size and the receipt area is scrollable
    if (isMobile) return 1;
    // Desktop: start shrinking above 5 items
    return numAmount <= 5 ? 1 : Math.max(0.4, 1 - (numAmount - 5) * 0.04);
  })();

  const sidebarProps = {
    username, setUsername,
    listType, setListType,
    timePeriod, setTimePeriod,
    amount, setAmount,
    ticketStyle, setTicketStyle,
    codeStyle, setCodeStyle,
    showRatings, setShowRatings,
    showGenres, setShowGenres,
    onGenerate: handleGenerate,
  };

  return (
    <>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />

      <main className="flex h-[100dvh] w-full overflow-hidden bg-white">

        {/* DESKTOP Sidebar */}
        <div className="hidden md:flex md:flex-col md:w-[320px] md:shrink-0 md:h-[100dvh] md:border-r-2 md:border-black">
          <Sidebar {...sidebarProps} />
        </div>

        {/* Receipt canvas */}
        <div className="flex-1 relative overflow-hidden flex flex-col" style={{ background: "#f5f0f0" }}>

          {/* Color blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-50" style={{ background: "radial-gradient(circle, #ffd6d6 0%, transparent 70%)" }} />
            <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-50" style={{ background: "radial-gradient(circle, #c8f0e0 0%, transparent 70%)" }} />
            <div className="absolute top-1/2 -right-20 w-[500px] h-[500px] rounded-full opacity-60" style={{ background: "radial-gradient(circle, #d4e8ff 0%, transparent 70%)" }} />
            <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] rounded-full opacity-55" style={{ background: "radial-gradient(circle, #e8d4ff 0%, transparent 70%)" }} />
            <div className="absolute top-0 right-1/3 w-[420px] h-[420px] rounded-full opacity-55" style={{ background: "radial-gradient(circle, #ffecd2 0%, transparent 70%)" }} />
          </div>

          {/* MOBILE top bar */}
          <div className="md:hidden relative z-20 flex items-center justify-between px-4 pt-4 pb-2">
            <h1 className="font-logo text-[1.6rem] font-black italic uppercase leading-none tracking-tight select-none">
              THE —<br />CINEMA BILL
            </h1>
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-10 h-10 bg-white brutal-border brutal-shadow rounded-full flex items-center justify-center active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              aria-label="Open settings"
            >
              <SlidersHorizontal className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Receipt area */}
          <div className="flex-1 relative flex items-start md:items-center justify-center overflow-y-auto md:overflow-hidden p-4 md:p-8">
            {!hasGenerated && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-mono text-sm tracking-widest uppercase pointer-events-none">
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
                  className="relative z-10 mx-auto"
                  style={{ scale: scaleAmount }}
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
          </div>

          {/* Action Buttons */}
          <div className="absolute bottom-6 right-4 md:right-6 flex flex-col gap-3 z-20">
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
              disabled={!hasGenerated || downloadState === "loading"}
              className={[
                "w-12 h-12 brutal-border brutal-shadow rounded-full flex items-center justify-center transition-all",
                downloadState === "done"
                  ? "bg-green-500 text-white border-green-700"
                  : downloadState === "error"
                    ? "bg-red-500 text-white border-red-700"
                    : "bg-black text-white border-black active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
              ].join(" ")}
              title={downloadState === "done" ? "Downloaded!" : downloadState === "error" ? "Failed" : "Download"}
            >
              {downloadState === "loading" && (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
                  <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {downloadState === "done" && <Check className="w-4 h-4 stroke-[2.5]" />}
              {downloadState === "error" && <X className="w-4 h-4 stroke-[2.5]" />}
              {downloadState === "idle" && <Download className="w-4 h-4 stroke-[2.5]" />}
            </button>
          </div>
        </div>
      </main>

      {/* MOBILE Sidebar Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.3 }}
              onDragEnd={(_, info) => {
                if (info.velocity.y > 300 || info.offset.y > 120) {
                  setSidebarOpen(false);
                }
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#fcfcfc] border-t-2 border-black rounded-t-2xl flex flex-col"
              style={{ maxHeight: "90dvh", touchAction: "none" }}
            >
              {/* Drag handle pill */}
              <div className="flex justify-center pt-3 pb-2 shrink-0 cursor-grab active:cursor-grabbing">
                <div className="w-10 h-1 rounded-full bg-gray-300" />
              </div>
              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto" style={{ touchAction: "pan-y" }}>
                <Sidebar {...sidebarProps} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
