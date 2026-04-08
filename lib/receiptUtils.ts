export interface TicketStyleConfig {
    containerClass: string;
    borderClass: string;
    fgColor: string;
    logoIcon: string;
    style: React.CSSProperties;
}

// Needed only for the return type
import type React from "react";

/**
 * djb2-style hash : stable numeric string in the range [1000, 9999].
 * Used to derive deterministic order numbers and auth codes from user inputs.
 */
export function deriveCode(seed: string): string {
    let h = 5381;
    for (let i = 0; i < seed.length; i++) {
        h = ((h << 5) + h) ^ seed.charCodeAt(i);
        h = h & 0xffffffff;
    }
    return String(1000 + (Math.abs(h) % 9000));
}

/** Returns the 4-digit order number for a given user/sort combo. */
export function getOrderNumber(displayUser: string, sortBy: string): string {
    return deriveCode(`${displayUser}|${sortBy}`);
}

/** Returns the 6-character auth code (different seed from order number). */
export function getAuthCode(displayUser: string, sortBy: string): string {
    return deriveCode(`${sortBy}|${displayUser}|auth`).padEnd(6, "0").slice(0, 6);
}

/** Maps a ticket style name to its visual configuration. */
export function getTicketStyleConfig(ticketStyle: string): TicketStyleConfig {
    switch (ticketStyle) {
        case "Midnight OLED":
            return {
                containerClass: "bg-[#121212] text-[#00FF41]",
                borderClass: "border-current opacity-80",
                fgColor: "#00FF41",
                logoIcon: "",
                style: { textShadow: "0 0 5px rgba(0,255,65,0.4)" },
            };
        case "Eco-Kraft":
            return {
                containerClass: "bg-[#D2B48C] text-[#3e2723] kraft-paper",
                borderClass: "border-current opacity-70",
                fgColor: "#3e2723",
                logoIcon: "",
                style: {},
            };
        case "Premiere VIP":
            return {
                containerClass: "bg-gradient-to-br from-[#F1E5AC] to-[#d4af37] text-[#0a192f] shadow-[inset_0_0_0_4px_rgba(212,175,55,0.5)]",
                borderClass: "border-[#0a192f] opacity-80",
                fgColor: "#0a192f",
                logoIcon: "🍿",
                style: {},
            };
        case "Classic Thermal":
        default:
            return {
                containerClass: "bg-[#F9F9F9] text-[#1A1A1A] thermal-paper",
                borderClass: "border-[#1A1A1A] border-opacity-50",
                fgColor: "#1A1A1A",
                logoIcon: "",
                style: {},
            };
    }
}

/** Returns the foreground colour used by JsBarcode for the given ticket style. */
export function getBarcodeFgColor(ticketStyle: string): string {
    switch (ticketStyle) {
        case "Midnight OLED": return "#00FF41";
        case "Eco-Kraft": return "#3e2723";
        case "Premiere VIP": return "#0a192f";
        default: return "#1A1A1A";
    }
}
