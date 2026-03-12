"use client";

import React from "react";
import { format } from "date-fns";
import { cn } from "./ui";

export interface ReceiptProps {
    username?: string;
    listType?: string;
    timePeriod?: string;
    ticketStyle?: string;
    codeStyle?: string;
    showRatings?: boolean;
    showGenres?: boolean;
}

const mockMovies = [
    { id: 1, title: "ANATOMY OF A FALL", genres: "THRILLER, DRAMA", duration: "02:31", rating: "4.5/5.0" },
    { id: 2, title: "POOR THINGS", genres: "COMEDY, SCIFI", duration: "02:21", rating: "4.0/5.0" },
    { id: 3, title: "THE IRON CLAW", genres: "DRAMA, SPORT", duration: "02:12", rating: "4.0/5.0" },
    { id: 4, title: "PERFECT DAYS", genres: "DRAMA", duration: "02:04", rating: "4.5/5.0" },
    { id: 5, title: "PAST LIVES", genres: "ROMANCE, DRAMA", duration: "01:45", rating: "5.0/5.0" },
];

const Divider = () => (
    <div className="w-full overflow-hidden whitespace-nowrap opacity-60 font-mono tracking-widest text-[10px] z-10 mb-1 mt-1 select-none" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
        ----------------------------------------------------------------------------------------------------
    </div>
);

export const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(({
    username,
    listType = "Recent Activity",
    timePeriod = "Last Month",
    ticketStyle = "Thermal Paper",
    codeStyle = "Barcode",
    showRatings = true,
    showGenres = true,
}, ref) => {
    const displayUser = username || "CINEPHILE";
    const dateStr = format(new Date(), "EEEE, MMMM d, yyyy");

    // A simple pure CSS barcode generator for visual effect
    // We just generate a flex row of random width currentColor blocks
    const generateBarcode = () => {
        return Array.from({ length: 45 }).map((_, i) => {
            const width = Math.floor(Math.random() * 4) + 1;
            return <div key={i} className="bg-current h-full opacity-90" style={{ width: `${width}px`, marginRight: '2px' }} />;
        });
    };

    const getStyleConfig = () => {
        switch (ticketStyle) {
            case "Midnight OLED":
                return {
                    containerClass: "bg-[#121212] text-[#00FF41]",
                    borderClass: "border-current opacity-80",
                    logoIcon: "",
                    style: { textShadow: "0 0 5px rgba(0,255,65,0.4)" }
                };
            case "Eco-Kraft":
                return {
                    containerClass: "bg-[#D2B48C] text-[#3e2723] kraft-paper",
                    borderClass: "border-current opacity-70",
                    logoIcon: "",
                    style: {}
                };
            case "Premiere VIP":
                return {
                    containerClass: "bg-gradient-to-br from-[#F1E5AC] to-[#d4af37] text-[#0a192f] shadow-[inset_0_0_0_4px_rgba(212,175,55,0.5)]",
                    borderClass: "border-[#0a192f] opacity-80",
                    logoIcon: "🍿",
                    style: {}
                };
            case "Classic Thermal":
            default:
                return {
                    containerClass: "bg-[#F9F9F9] text-[#1A1A1A] thermal-paper",
                    borderClass: "border-current opacity-50",
                    logoIcon: "",
                    style: {}
                };
        }
    };

    const styleConfig = getStyleConfig();

    return (
        <div
            ref={ref}
            className={cn(
                "w-[340px] shrink-0 relative flex flex-col items-center justify-start px-8 py-10 pb-12",
                styleConfig.containerClass,
                "shadow-[0_10px_40px_rgba(0,0,0,0.15)]"
            )}
            style={{ ...styleConfig.style, minHeight: '600px' }}
        >
            {/* Background filigrane for Premiere VIP */}
            {styleConfig.logoIcon && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5 select-none z-0">
                    <div className="w-full h-full grid grid-cols-3 gap-y-16 gap-x-8 place-items-center pt-8 pb-12 rotate-[-5deg] scale-110">
                        {Array.from({ length: 18 }).map((_, i) => (
                            <div key={i} className="text-5xl">{styleConfig.logoIcon}</div>
                        ))}
                    </div>
                </div>
            )}

            <div className="w-full flex flex-col items-center mb-6 z-10">
                <h2 className="text-3xl font-bold tracking-tighter mb-1 font-sans uppercase">CINEMA BILL</h2>
                <p className="text-xs font-sans uppercase opacity-80">{timePeriod}</p>
            </div>

            <div className="w-full flex flex-col items-start text-[11px] uppercase leading-relaxed z-10 mb-1" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                <p>ORDER #0001 FOR {displayUser} 🎬</p>
                <p>{dateStr.toUpperCase()}</p>
            </div>

            <Divider />

            <div className="w-full flex justify-between text-[11px] uppercase z-10 mb-1" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                <div className="flex w-full">
                    <span className="w-8 shrink-0 text-left">QTY</span>
                    <span className="flex-1 text-left">ITEM</span>
                    <span className="shrink-0 text-right">RUNTIME</span>
                </div>
            </div>

            <Divider />

            <div className="w-full flex flex-col z-10 text-[11px] mt-1 mb-4" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                {mockMovies.map((movie, index) => {
                    const subtitle = [
                        showGenres && movie.genres,
                        showRatings && movie.rating
                    ].filter(Boolean).join(" - ");

                    return (
                        <div key={movie.id} className="flex w-full mb-3 uppercase leading-tight items-start">
                            <div className="w-8 shrink-0 text-left">
                                {String(index + 1).padStart(2, '0')}
                            </div>
                            <div className="flex-1 pr-3 flex flex-col text-left">
                                <span className="break-words">{movie.title}</span>
                                {subtitle}
                            </div>
                            <div className="shrink-0 text-right">
                                {movie.duration}
                            </div>
                        </div>
                    );
                })}
            </div>

            <Divider />

            <div className="w-full flex justify-between text-[11px] uppercase z-10 mt-1 mb-1" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                <span>ITEM COUNT:</span>
                <span>{mockMovies.length}</span>
            </div>

            <div className="w-full flex justify-between text-[11px] uppercase z-10 mb-6" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                <span>TOTAL:</span>
                <span>10:33</span>
            </div>

            <div className="w-full flex flex-col items-start text-[11px] uppercase z-10 mb-8" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                <p>CARD #: **** **** **** 2026</p>
                <p>AUTH CODE: 123421</p>
                <p>CARDHOLDER: {displayUser} 🎬</p>
            </div>

            <div className="w-full flex flex-col items-center gap-2 z-10 text-[11px]" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                <p className="uppercase mb-2">THANK YOU FOR VISITING!</p>

                {codeStyle === "Barcode" ? (
                    <div className="w-full max-w-[200px] h-14 flex justify-center items-center overflow-hidden mb-1">
                        {generateBarcode()}
                    </div>
                ) : (
                    <div className={cn("w-20 h-20 border-[3px] p-1 flex mt-1 mb-1", styleConfig.borderClass)}>
                        <div className="w-full h-full bg-current" style={{ WebkitMaskImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M0 0h40v40H0zM20 20h20v20H0z" fill="white"/></svg>')`, WebkitMaskSize: 'cover' }}>
                            <div className="w-full h-full border-[3px] border-current" style={{ backgroundSize: '10px 10px', backgroundImage: 'radial-gradient(currentColor 40%, transparent 40%)', opacity: 0.5 }} />
                        </div>
                    </div>
                )}

                <p className="text-[11px] lowercase opacity-80">cinemabill.netlify.app</p>
            </div>
        </div>
    );
});

Receipt.displayName = "Receipt";
