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
    { id: 1, title: "ANATOMY OF A FALL", genres: "THRILLER, DRAMA", duration: "02:31", rating: "4.5/5" },
    { id: 2, title: "POOR THINGS", genres: "COMEDY, SCIFI", duration: "02:21", rating: "4.0/5" },
    { id: 3, title: "THE IRON CLAW", genres: "DRAMA, SPORT", duration: "02:12", rating: "4.0/5" },
    { id: 4, title: "PERFECT DAYS", genres: "DRAMA", duration: "02:04", rating: "4.5/5" },
    { id: 5, title: "PAST LIVES", genres: "ROMANCE, DRAMA", duration: "01:45", rating: "5.0/5" },
];

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
    // We just generate a flex row of random width black blocks
    const generateBarcode = () => {
        return Array.from({ length: 60 }).map((_, i) => {
            const width = Math.floor(Math.random() * 4) + 1;
            return <div key={i} className="bg-black h-full" style={{ width: `${width}px`, marginRight: '1px' }} />;
        });
    };

    return (
        <div
            ref={ref}
            className={cn(
                "w-[320px] shrink-0 font-mono text-black relative flex flex-col items-center justify-start receipt-mask px-6 py-10 pb-12 bg-gradient-to-br from-[#c69a8a] to-[#e4b3a1]",
                // ticketStyle === "Thermal Paper" ? "thermal-paper font-mono" : ""
                ticketStyle === "Thermal Paper" ? "thermal-paper" : "bg-white",
                "drop-shadow-2xl"
            )}
        >
            <div className="w-full flex flex-col items-center mb-5">
                <h2 className="text-2xl font-bold tracking-widest mb-1.5 font-mono" style={{ fontFamily: 'var(--font-mono)' }}>CINEMA BILL</h2>
                <p className="text-[10px] tracking-[0.2em] uppercase">{timePeriod}</p>
            </div>

            <div className="w-full text-[10px] mb-5 uppercase leading-relaxed">
                <p>ORDER #0001 FOR CINEPHILE 🎬</p>
                <p>{dateStr.toUpperCase()}</p>
            </div>

            <div className="w-full border-b border-black border-dashed pb-1.5 mb-3 flex justify-between text-[10px] font-bold uppercase">
                <span>QTY ITEM / RATING</span>
                <span>RUNTIME</span>
            </div>

            <div className="w-full flex-col gap-3 flex mb-6">
                {mockMovies.map((movie, index) => (
                    <div key={movie.id} className="flex flex-col text-xs uppercase leading-tight">
                        <div className="flex justify-between">
                            <span className="font-bold">0{index + 1} {movie.title}</span>
                            <span>{movie.duration}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-black/80">
                            <span>{[showGenres && movie.genres, showRatings && movie.rating].filter(Boolean).join(" · ")}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="w-full flex justify-between text-[11px] mb-1.5">
                <span>ITEM COUNT:</span>
                <span>{mockMovies.length}</span>
            </div>

            <div className="w-full flex justify-between text-base font-bold border-b border-black border-dashed pb-4 mb-3">
                <span>TOTAL RUNTIME:</span>
                <span>10:33</span>
            </div>

            <div className="w-full text-[9px] uppercase space-y-1 mb-6">
                <p>CARD #: **** **** **** 2026</p>
                <p>AUTH CODE: 123421</p>
                <p>CARDHOLDER: {displayUser} 🎬</p>
            </div>

            <div className="w-full flex flex-col items-center gap-3">
                <p className="text-[11px] font-bold tracking-widest uppercase">THANK YOU FOR VISITING!</p>

                {codeStyle === "Barcode" ? (
                    <div className="w-full h-12 flex justify-center items-center mt-1 mb-1 px-2 overflow-hidden">
                        {generateBarcode()}
                    </div>
                ) : (
                    <div className="w-20 h-20 border-[3px] border-black p-1 flex mt-1 mb-1">
                        {/* Simple QR mockup */}
                        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6TTIwIDIwaDIwaDIwSDB6IiBmaWxsPSJibGFjayIvPjwvc3ZnPg==')] bg-repeat shadow-[inset_0_0_0_3px_white]">
                            <div className="w-full h-full border-[3px] border-white bg-black/20" style={{ backgroundSize: '10px 10px', backgroundImage: 'radial-gradient(black 40%, transparent 40%)' }} />
                        </div>
                    </div>
                )}

                <p className="text-[9px] tracking-widestlowercase">cinemabill.netlify.app</p>

                <p className="text-[10px] font-bold tracking-widest mt-2">KEEP CINEMA ALIVE</p>
            </div>
        </div>
    );
});

Receipt.displayName = "Receipt";
