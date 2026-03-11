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
    showRuntimes?: boolean;
}

const mockMovies = [
    { id: 1, title: "ANATOMY OF A FALL", director: "JUSTINE TRIET", duration: "2h 31m", rating: "4.5/5" },
    { id: 2, title: "POOR THINGS", director: "YORGOS LANTHIMOS", duration: "2h 21m", rating: "4.0/5" },
    { id: 3, title: "THE IRON CLAW", director: "SEAN DURKIN", duration: "2h 12m", rating: "4.0/5" },
    { id: 4, title: "PERFECT DAYS", director: "WIM WENDERS", duration: "2h 04m", rating: "4.5/5" },
    { id: 5, title: "PAST LIVES", director: "CELINE SONG", duration: "1h 45m", rating: "5.0/5" },
];

export const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(({
    username,
    listType = "Recent Activity",
    timePeriod = "Last Month",
    ticketStyle = "Thermal Paper",
    codeStyle = "Barcode",
    showRatings = true,
    showRuntimes = true,
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
                "w-[400px] shrink-0 font-mono text-black relative flex flex-col items-center justify-start receipt-mask px-8 py-12 pb-16 bg-gradient-to-br from-[#c69a8a] to-[#e4b3a1]",
                // ticketStyle === "Thermal Paper" ? "thermal-paper font-mono" : ""
                ticketStyle === "Thermal Paper" ? "thermal-paper" : "bg-white",
                "drop-shadow-2xl"
            )}
        >
            <div className="w-full flex flex-col items-center mb-6">
                <h2 className="text-3xl font-bold tracking-widest mb-2 font-mono" style={{ fontFamily: 'var(--font-mono)' }}>CINEMA BILL</h2>
                <p className="text-sm tracking-[0.2em] uppercase">{timePeriod}</p>
            </div>

            <div className="w-full text-xs mb-6 uppercase">
                <p>ORDER #0001 FOR CINEPHILE 🎬</p>
                <p>{dateStr.toUpperCase()}</p>
            </div>

            <div className="w-full border-b border-black border-dashed pb-2 mb-4 flex justify-between text-xs font-bold uppercase">
                <span>QTY ITEM / RATING</span>
                <span>RUNTIME</span>
            </div>

            <div className="w-full flex-col gap-4 flex mb-8">
                {mockMovies.map((movie, index) => (
                    <div key={movie.id} className="flex flex-col text-sm uppercase leading-tight">
                        <div className="flex justify-between">
                            <span className="font-bold">0{index + 1} {movie.title}</span>
                            {showRuntimes && <span>{movie.duration}</span>}
                        </div>
                        <div className="flex justify-between text-[11px] text-black/80">
                            <span>{movie.director}{showRatings ? ` · ${movie.rating}` : ""}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="w-full flex justify-between text-sm mb-2">
                <span>ITEM COUNT:</span>
                <span>5</span>
            </div>

            <div className="w-full flex justify-between text-lg font-bold border-b border-black border-dashed pb-6 mb-4">
                <span>TOTAL:</span>
                <span>65:45</span>
            </div>

            <div className="w-full text-[10px] uppercase space-y-1 mb-8">
                <p>CARD #: **** **** **** 2024</p>
                <p>AUTH CODE: 123421</p>
                <p>CARDHOLDER: {displayUser} 🎬</p>
            </div>

            <div className="w-full flex flex-col items-center gap-4">
                <p className="text-sm font-bold tracking-widest uppercase">THANK YOU FOR VISITING!</p>

                {codeStyle === "Barcode" ? (
                    <div className="w-full h-16 flex justify-center items-center mt-2 mb-1 px-4 overflow-hidden">
                        {generateBarcode()}
                    </div>
                ) : (
                    <div className="w-24 h-24 border-4 border-black p-1 flex mt-2 mb-1">
                        {/* Simple QR mockup */}
                        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6TTIwIDIwaDIwaDIwSDB6IiBmaWxsPSJibGFjayIvPjwvc3ZnPg==')] bg-repeat shadow-[inset_0_0_0_4px_white]">
                            <div className="w-full h-full border-4 border-white bg-black/20" style={{ backgroundSize: '10px 10px', backgroundImage: 'radial-gradient(black 40%, transparent 40%)' }} />
                        </div>
                    </div>
                )}

                <p className="text-[10px] tracking-widestlowercase">cinemabill.netlify.app</p>

                <p className="text-xs font-bold tracking-widest mt-4">KEEP CINEMA ALIVE</p>
            </div>
        </div>
    );
});

Receipt.displayName = "Receipt";
