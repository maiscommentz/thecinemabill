"use client";

import React from "react";
import { format } from "date-fns";
import { cn } from "./ui";
import { QRCodeSVG } from "qrcode.react";
import JsBarcode from "jsbarcode";

export interface ReceiptProps {
    username?: string;
    listType?: string;
    timePeriod?: string;
    amount?: string;
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
    { id: 6, title: "OPPENHEIMER", genres: "BIOGRAPHY, DRAMA", duration: "03:00", rating: "4.5/5.0" },
    { id: 7, title: "KILLERS OF THE FLOWER MOON", genres: "CRIME, DRAMA", duration: "03:26", rating: "4.0/5.0" },
    { id: 8, title: "SOCIETY OF THE SNOW", genres: "SURVIVAL, THRILLER", duration: "02:24", rating: "4.5/5.0" },
    { id: 9, title: "SALTBURN", genres: "THRILLER, COMEDY", duration: "02:11", rating: "3.5/5.0" },
    { id: 10, title: "BARBIE", genres: "COMEDY, FANTASY", duration: "01:54", rating: "4.0/5.0" },
    { id: 11, title: "DUNE: PART TWO", genres: "SCIFI, ACTION", duration: "02:46", rating: "4.5/5.0" },
    { id: 12, title: "THE BOY AND THE HERON", genres: "ANIMATION, FANTASY", duration: "02:04", rating: "4.0/5.0" },
    { id: 13, title: "SPIDER-MAN: ACROSS THE SPIDER-VERSE", genres: "ANIMATION, ACTION", duration: "02:20", rating: "4.5/5.0" },
    { id: 14, title: "GODZILLA MINUS ONE", genres: "ACTION, SCIFI", duration: "02:05", rating: "4.0/5.0" },
    { id: 15, title: "ASTEROID CITY", genres: "COMEDY, ROMANCE", duration: "01:45", rating: "3.5/5.0" },
    { id: 16, title: "THE HOLDOVERS", genres: "COMEDY, DRAMA", duration: "02:13", rating: "4.0/5.0" },
    { id: 17, title: "MAY DECEMBER", genres: "COMEDY, DRAMA", duration: "01:57", rating: "3.5/5.0" },
    { id: 18, title: "AMERICAN FICTION", genres: "COMEDY, DRAMA", duration: "01:57", rating: "4.0/5.0" },
    { id: 19, title: "PRISCILLA", genres: "BIOGRAPHY, DRAMA", duration: "01:53", rating: "3.5/5.0" },
    { id: 20, title: "THE ZONE OF INTEREST", genres: "DRAMA, WAR", duration: "01:45", rating: "4.5/5.0" },
];

const Divider = () => (
    <div className="w-full overflow-hidden whitespace-nowrap opacity-60 font-mono tracking-widest text-[10px] z-10 mb-1 mt-1 select-none" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
        ----------------------------------------------------------------------------------------------------
    </div>
);

export const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(({
    username,
    listType = "Recent activity",
    timePeriod = "Last Month",
    amount = "5",
    ticketStyle = "Thermal Paper",
    codeStyle = "Barcode",
    showRatings = true,
    showGenres = true,
}, ref) => {
    const displayUser = username || "CINEPHILE";
    const truncatedUser = displayUser.length > 16 ? displayUser.slice(0, 16) + "..." : displayUser;
    const dateStr = format(new Date(), "EEEE, MMMM d, yyyy");

    const [currentUrl, setCurrentUrl] = React.useState("thecinemabill.maiscommentz.ch");
    const [pageUrl, setPageUrl] = React.useState("");
    React.useEffect(() => {
        if (typeof window !== "undefined") {
            setCurrentUrl(window.location.host);
            const params = new URLSearchParams({
                ...(username ? { user: username } : {}),
                list: listType,
                period: timePeriod,
                amount,
                style: ticketStyle,
                code: codeStyle,
                ratings: showRatings ? "1" : "0",
                genres: showGenres ? "1" : "0",
            });
            setPageUrl(`${window.location.origin}/?${params.toString()}`);
        }
    }, [username, listType, timePeriod, amount, ticketStyle, codeStyle, showRatings, showGenres]);

    // Render barcode via JsBarcode
    const barcodeRef = React.useRef<SVGSVGElement>(null);
    React.useEffect(() => {
        if (barcodeRef.current && pageUrl) {
            try {
                JsBarcode(barcodeRef.current, pageUrl, {
                    format: "CODE128",
                    displayValue: false,
                    lineColor: "currentColor",
                    background: "transparent",
                    width: 0.7,
                    height: 50,
                    margin: 0,
                });
            } catch {
                // URL may be too long for some barcode formats                
            }
        }
    }, [pageUrl]);

    // Fallback CSS bar pattern
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
                "w-[340px] shrink-0 font-bold relative flex flex-col items-center justify-start px-6 py-10 pb-12",
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
                <h1 className="font-logo text-[2.2rem] font-black italic uppercase leading-none tracking-tight mb-2 text-left">
                    THE —<br />CINEMA BILL
                </h1>
                <p className="text-xs font-sans uppercase opacity-80" style={{ fontFamily: '"Courier New", Courier, monospace' }}>{listType} - {timePeriod}</p>
            </div>

            <div className="w-full flex flex-col items-start text-[13px] uppercase leading-relaxed z-10 mb-1" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                <p>ORDER #0001 FOR {truncatedUser}</p>
                <p>{dateStr.toUpperCase()}</p>
            </div>

            <Divider />

            <div className="w-full flex justify-between text-[13px] uppercase z-10 mb-1" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                <div className="flex w-full">
                    <span className="w-8 shrink-0 text-left">QTY</span>
                    <span className="flex-1 text-left">ITEM</span>
                    <span className="shrink-0 text-right">RUNTIME</span>
                </div>
            </div>

            <Divider />

            <div className="w-full flex flex-col z-10 text-[13px] mt-1 mb-4" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                {mockMovies.slice(0, parseInt(amount)).map((movie, index) => {
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

            <div className="w-full flex justify-between text-[13px] uppercase z-10 mt-1 mb-1" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                <span>ITEM COUNT:</span>
                <span>{Math.min(mockMovies.length, parseInt(amount))}</span>
            </div>

            <div className="w-full flex justify-between text-[13px] uppercase z-10 mb-6" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                <span>TOTAL:</span>
                <span>10:33</span>
            </div>

            <div className="w-full flex flex-col items-start text-[13px] uppercase z-10 mb-8" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                <p>CARD #: **** **** **** 2026</p>
                <p>AUTH CODE: 123421</p>
                <p>CARDHOLDER: {truncatedUser}</p>
            </div>

            <div className="w-full flex flex-col items-center gap-2 z-10 text-[13px]" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                <p className="uppercase mb-2">THANK YOU FOR YOUR ORDER!</p>

                {codeStyle === "Barcode" ? (
                    <div className="w-full h-14 flex justify-center items-center overflow-hidden mb-1">
                        {pageUrl ? (
                            <svg ref={barcodeRef} className="w-full max-w-[240px] h-full" preserveAspectRatio="none" />
                        ) : (
                            generateBarcode()
                        )}
                    </div>
                ) : (
                    <div className={cn("flex mt-1 mb-1", styleConfig.borderClass)}>
                        <QRCodeSVG
                            value={pageUrl || currentUrl}
                            size={100}
                            bgColor="transparent"
                            fgColor="currentColor"
                            level="M"
                        />
                    </div>
                )}

                <p className="text-[13px] lowercase opacity-80">{currentUrl}</p>
            </div>
        </div>
    );
});

Receipt.displayName = "Receipt";
