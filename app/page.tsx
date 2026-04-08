"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Receipt } from "@/components/Receipt";
import { SplashScreen } from "@/components/SplashScreen";
import { InfoModal } from "@/components/InfoModal";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2, Info, SlidersHorizontal, Check, X } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { parseUrlParams } from "@/lib/parseUrlParams";
import { downloadStory, shareStory } from "@/lib/downloadStory";
import { Film } from "@/lib/receiptData";

// Stable random widths for the printing loader
const PRINT_BARS = Array.from({ length: 12 }, () => `${Math.random() * 60 + 40}%`);

export default function Home() {
  // UI state
  const [showSplash, setShowSplash] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [shareState, setShareState] = useState<"idle" | "loading" | "shared" | "copied" | "error">("idle");

  // Dynamic data state
  const [movies, setMovies] = useState<Film[]>([]);
  const [fetchStatus, setFetchStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Receipt options
  const [username, setUsername] = useState("");
  const [sortBy, setSortBy] = useState("Highest Rated");
  const [amount, setAmount] = useState("5");
  const [ticketStyle, setTicketStyle] = useState("Classic Thermal");
  const [codeStyle, setCodeStyle] = useState("Barcode");
  const [showRatings, setShowRatings] = useState(true);
  const [showGenres, setShowGenres] = useState(true);

  // Refs & hooks
  const receiptRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // State reset helper: hides receipt if any setting changes
  const resetBill = useCallback(() => {
    setHasGenerated(false);
    setFetchStatus("idle");
    setMovies([]);
  }, []);

  // Handlers
  const handleGenerate = useCallback(async (arg?: string | React.MouseEvent | React.FormEvent) => {
    // Ensure we don't use the 'event' object as a username if called from onClick
    const overrideUsername = typeof arg === "string" ? arg : undefined;
    const targetUser = overrideUsername || username;

    if (!targetUser || typeof targetUser !== "string") {
      setErrorMsg("Please enter a Letterboxd username");
      setFetchStatus("error");
      return;
    }

    setFetchStatus("loading");
    setErrorMsg(null);
    setHasGenerated(false);

    try {
      const params = new URLSearchParams({
        username: targetUser,
        sortBy
      });
      const resp = await fetch(`/api/fetch-bill?${params.toString()}`);

      // Check if response is actually JSON before parsing
      const contentType = resp.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned an invalid response (not JSON)");
      }

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || "Failed to fetch data");
      }

      setMovies(data);

      // Artificial delay to show 'printing' animation
      setTimeout(() => {
        setFetchStatus("success");
        setHasGenerated(true);
        setSidebarOpen(false);
      }, 1000);

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      setErrorMsg(message);
      setFetchStatus("error");
    }
  }, [username, sortBy]);

  // Hydrate from validated URL params on mount
  useEffect(() => {
    const p = parseUrlParams(window.location.search);
    if (p.username) setUsername(p.username);
    if (p.sortBy) setSortBy(p.sortBy);
    if (p.amount) setAmount(p.amount);
    if (p.ticketStyle) setTicketStyle(p.ticketStyle);
    if (p.codeStyle) setCodeStyle(p.codeStyle);
    if (p.showRatings !== undefined) setShowRatings(p.showRatings);
    if (p.showGenres !== undefined) setShowGenres(p.showGenres);

    // Auto-fetch if username is provided via URL
    if (p.username) {
      handleGenerate(p.username);
    }
  }, [handleGenerate]);

  const handleDownload = async () => {
    if (!receiptRef.current || downloadState === "loading") return;
    setDownloadState("loading");
    try {
      await downloadStory(
        receiptRef.current,
        `cinema-bill-${username || "cinephile"}-story.png`
      );
      setDownloadState("done");
    } catch (err) {
      console.error("Failed to download image", err);
      setDownloadState("error");
    } finally {
      setTimeout(() => setDownloadState("idle"), 2000);
    }
  };

  const handleShare = async () => {
    if (!receiptRef.current || shareState === "loading") return;
    setShareState("loading");
    try {
      const shareUrl = typeof window !== "undefined"
        ? `${window.location.origin}/?user=${encodeURIComponent(username)}&sort=${encodeURIComponent(sortBy)}&amount=${amount}&ticket=${encodeURIComponent(ticketStyle)}&code=${encodeURIComponent(codeStyle)}&ratings=${showRatings}&genres=${showGenres}`
        : "";

      const result = await shareStory(
        receiptRef.current,
        `cinema-bill-${username || "cinephile"}-story.png`,
        shareUrl
      );
      setShareState(result === "shared" ? "shared" : result === "copied" ? "copied" : "error");
    } catch (err) {
      // User cancelled share sheet
      const isCancelled = err instanceof Error && err.name === "AbortError";
      setShareState(isCancelled ? "idle" : "error");
    } finally {
      setTimeout(() => setShareState("idle"), 2500);
    }
  };

  // Derived values
  const numAmount = parseInt(amount) || 5;
  const scaleAmount = isMobile
    ? 1
    : numAmount <= 5 ? 1 : Math.max(0.4, 1 - (numAmount - 5) * 0.04);

  const sidebarProps = {
    username, setUsername: (v: string) => { setUsername(v); resetBill(); },
    sortBy, setSortBy: (v: string) => { setSortBy(v); resetBill(); },
    amount, setAmount: (v: string) => { setAmount(v); resetBill(); },
    ticketStyle, setTicketStyle: (v: string) => { setTicketStyle(v); resetBill(); },
    codeStyle, setCodeStyle: (v: string) => { setCodeStyle(v); resetBill(); },
    showRatings, setShowRatings: (v: boolean) => { setShowRatings(v); resetBill(); },
    showGenres, setShowGenres: (v: boolean) => { setShowGenres(v); resetBill(); },
    onGenerate: handleGenerate,
  };

  // Render
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

          {/* Pastel blobs */}
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
            {fetchStatus === "idle" && !hasGenerated && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-mono text-sm tracking-widest uppercase pointer-events-none">
                Awaiting Generation...
              </div>
            )}

            {/* ERROR ALERT (Neo-brutalist) */}
            {fetchStatus === "error" && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative z-50 p-6 bg-[#ff4d4d] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-logo text-xl font-black italic uppercase italic">ERROR</h3>
                </div>
                <p className="font-mono text-sm font-bold uppercase leading-tight bg-white p-3 border-2 border-black">
                  {errorMsg || "Unknown Error occurred"}
                </p>
                <button
                  onClick={() => setFetchStatus("idle")}
                  className="mt-4 w-full p-2 bg-black text-white font-mono font-bold uppercase text-xs hover:bg-[#333] transition-colors"
                >
                  [ DISMISS ]
                </button>
              </motion.div>
            )}

            {/* PRINTING LOADER */}
            {fetchStatus === "loading" && !hasGenerated && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30">
                {/* Printer Slot */}
                <div className="w-48 h-3 bg-black rounded-sm relative z-20" />
                {/* Paper Strips */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: [0, 60, 58, 140, 138, 220, 218, 300] }}
                  transition={{
                    duration: 1.5,
                    times: [0, 0.1, 0.15, 0.3, 0.35, 0.6, 0.65, 1],
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-44 bg-white border-x-2 border-black overflow-hidden relative z-10 origin-top shadow-[0_10px_20px_-10px_rgba(0,0,0,0.1)]"
                >
                  <div className="w-full h-full opacity-10 flex flex-col gap-2 p-2 pt-4">
                    {PRINT_BARS.map((width, i) => (
                      <div key={i} className="h-2 bg-black w-full" style={{ width }} />
                    ))}
                  </div>
                </motion.div>
                <p className="mt-8 font-mono text-xs font-bold uppercase tracking-[0.2em] animate-pulse">
                  Printing Receipt...
                </p>
              </div>
            )}

            <AnimatePresence>
              {hasGenerated && fetchStatus === "success" && (
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
                    movies={movies}
                    sortBy={sortBy}
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

          {/* Action buttons */}
          <div className="absolute bottom-6 right-4 md:right-6 flex flex-col gap-3 z-20">
            <button
              onClick={() => setShowInfo(true)}
              className="w-12 h-12 bg-white brutal-border brutal-shadow rounded-full flex items-center justify-center hover:bg-gray-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              title="About"
            >
              <Info className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={handleShare}
              disabled={!hasGenerated || shareState === "loading"}
              className={[
                "w-12 h-12 brutal-border brutal-shadow rounded-full flex items-center justify-center transition-all",
                shareState === "shared" || shareState === "copied"
                  ? "bg-green-500 text-white border-green-700"
                  : shareState === "error"
                    ? "bg-red-500 text-white border-red-700"
                    : "bg-white border-black active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
              ].join(" ")}
              title={
                shareState === "shared" ? "Shared!" :
                  shareState === "copied" ? "Link copied!" :
                    shareState === "error" ? "Share failed" :
                      "Copy to clipboard or share"
              }
            >
              {shareState === "loading" && (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
                  <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {(shareState === "shared" || shareState === "copied") && <Check className="w-4 h-4 stroke-[2.5]" />}
              {shareState === "error" && <X className="w-4 h-4 stroke-[2.5]" />}
              {shareState === "idle" && <Share2 className="w-4 h-4 stroke-[2.5]" />}
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
              title={downloadState === "done" ? "Downloaded!" : downloadState === "error" ? "Failed" : "Download as image"}
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
