"use client";

import React from "react";
import { format } from "date-fns";
import { cn } from "./ui";
import { QRCodeSVG } from "qrcode.react";
import JsBarcode from "jsbarcode";
import { mockMovies } from "@/lib/receiptData";
import { getOrderNumber, getAuthCode, getTicketStyleConfig, getBarcodeFgColor } from "@/lib/receiptUtils";

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

const MONO: React.CSSProperties = { fontFamily: '"Courier New", Courier, monospace' };
const FALLBACK_BARS: number[] = Array.from({ length: 45 }, () => Math.floor(Math.random() * 4) + 1);

const Divider = () => (
    <div className="w-full overflow-hidden whitespace-nowrap font-mono tracking-widest text-[10px] z-10 select-none" style={MONO}>
        ----------------------------------------------------------------------------------------------------
    </div>
);

export const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>((
    {
        username,
        listType = "Recent Activity",
        timePeriod = "Last Month",
        amount = "5",
        ticketStyle = "Classic Thermal",
        codeStyle = "Barcode",
        showRatings = true,
        showGenres = true,
    },
    ref
) => {
    // Derived display values
    const displayUser = username || "CINEPHILE";
    const truncatedUser = displayUser.length > 16 ? displayUser.slice(0, 16) + "..." : displayUser;
    const dateStr = format(new Date(), "EEEE, MMMM d, yyyy");
    const orderNumber = getOrderNumber(displayUser, listType, timePeriod);
    const authCode = getAuthCode(displayUser, timePeriod);
    const styleConfig = getTicketStyleConfig(ticketStyle);

    // Shareable URL for the QR / barcode
    const [currentUrl, setCurrentUrl] = React.useState("thecinemabill.maiscommentz.ch");
    const [pageUrl, setPageUrl] = React.useState("");
    React.useEffect(() => {
        if (typeof window === "undefined") return;
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
    }, [username, listType, timePeriod, amount, ticketStyle, codeStyle, showRatings, showGenres]);

    // Render barcode via JsBarcode
    const barcodeRef = React.useRef<SVGSVGElement>(null);
    React.useEffect(() => {
        if (!barcodeRef.current || !pageUrl) return;
        try {
            JsBarcode(barcodeRef.current, pageUrl, {
                format: "CODE128",
                displayValue: false,
                lineColor: getBarcodeFgColor(ticketStyle),
                background: "transparent",
                width: 0.7,
                height: 50,
                margin: 0,
            });
        } catch {
            // URL may be too long for some barcode formats
        }
    }, [pageUrl, ticketStyle]);

    const numAmount = parseInt(amount) || 0;

    return (
        <div
            ref={ref}
            className={cn(
                "w-[340px] shrink-0 font-bold relative flex flex-col items-center justify-start px-6 py-10 pb-12",
                styleConfig.containerClass,
                "shadow-[0_10px_40px_rgba(0,0,0,0.15)]"
            )}
            style={{ ...styleConfig.style, minHeight: "600px" }}
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

            {/* Header */}
            <div className="w-full flex flex-col items-center mb-6 z-10">
                <h1 className="font-logo text-[2.2rem] font-black italic uppercase leading-none tracking-tight mb-2 text-left">
                    THE —<br />CINEMA BILL
                </h1>
                <p className="text-xs font-sans uppercase opacity-80" style={MONO}>{listType} - {timePeriod}</p>
            </div>

            {/* Order info */}
            <div className="w-full flex flex-col items-start text-[13px] uppercase leading-relaxed z-10 mb-1" style={MONO}>
                <p>ORDER #{orderNumber} FOR {truncatedUser}</p>
                <p>{dateStr.toUpperCase()}</p>
            </div>

            <Divider />

            {/* Column headers */}
            <div className="w-full flex justify-between text-[13px] uppercase z-10" style={MONO}>
                <div className="flex w-full">
                    <span className="w-8 shrink-0 text-left">QTY</span>
                    <span className="flex-1 text-left">ITEM</span>
                    <span className="shrink-0 text-right">RUNTIME</span>
                </div>
            </div>

            <Divider />

            {/* Movie rows */}
            <div className="w-full flex flex-col z-10 text-[13px] mt-1 mb-1" style={MONO}>
                {mockMovies.slice(0, numAmount).map((movie, index) => {
                    const subtitle = [
                        showGenres && movie.genres,
                        showRatings && movie.rating,
                    ].filter(Boolean).join(" - ");

                    return (
                        <div key={movie.id} className="flex w-full mb-3 uppercase leading-tight items-start">
                            <div className="w-8 shrink-0 text-left">
                                {String(index + 1).padStart(2, "0")}
                            </div>
                            <div className="flex-1 pr-3 flex flex-col text-left">
                                <span className="break-words">{movie.title}</span>
                                {subtitle}
                            </div>
                            <div className="shrink-0 text-right">{movie.duration}</div>
                        </div>
                    );
                })}
            </div>

            <Divider />

            {/* Totals */}
            <div className="w-full flex justify-between text-[13px] uppercase z-10 mt-1 mb-1" style={MONO}>
                <span>ITEM COUNT:</span>
                <span>{Math.min(mockMovies.length, numAmount)}</span>
            </div>
            <div className="w-full flex justify-between text-[13px] uppercase z-10 mb-6" style={MONO}>
                <span>TOTAL:</span>
                <span>10:33</span>
            </div>

            {/* Payment info */}
            <div className="w-full flex flex-col items-start text-[13px] uppercase z-10 mb-8" style={MONO}>
                <p>CARD #: **** **** **** 2026</p>
                <p>AUTH CODE: {authCode}</p>
                <p>CARDHOLDER: {truncatedUser}</p>
            </div>

            {/* Footer — code */}
            <div className="w-full flex flex-col items-center gap-2 z-10 text-[13px]" style={MONO}>
                <p className="uppercase mb-2">THANK YOU FOR YOUR ORDER!</p>

                {codeStyle === "Barcode" ? (
                    <div className="w-full h-14 flex justify-center items-center overflow-hidden mb-1">
                        {pageUrl
                            ? <svg ref={barcodeRef} className="w-full max-w-[240px] h-full" preserveAspectRatio="none" />
                            : <div className="flex h-full">{FALLBACK_BARS.map((w, i) => (
                                <div key={i} className="bg-current h-full opacity-90" style={{ width: `${w}px`, marginRight: "2px" }} />
                            ))}</div>
                        }
                    </div>
                ) : (
                    <div className={cn("flex mt-1 mb-1", styleConfig.borderClass)}>
                        <QRCodeSVG
                            value={pageUrl || currentUrl}
                            size={100}
                            bgColor="transparent"
                            fgColor={styleConfig.fgColor || "#000000"}
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
