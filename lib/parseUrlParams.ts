// Allowed values for each option
// Kept in sync with the Sidebar selects.
export const LIST_TYPES = ["Recent Activity", "My Favourites"] as const;
export const TIME_PERIODS = ["Last week", "Last Month", "Last Year", "All Time"] as const;
export const STYLES = ["Classic Thermal", "Midnight OLED", "Eco-Kraft", "Premiere VIP"] as const;
export const CODE_STYLES = ["Barcode", "QR Code"] as const;

export type ListType = typeof LIST_TYPES[number];
export type TimePeriod = typeof TIME_PERIODS[number];
export type TicketStyle = typeof STYLES[number];
export type CodeStyle = typeof CODE_STYLES[number];

export interface ParsedParams {
    username?: string;
    listType?: ListType;
    timePeriod?: TimePeriod;
    amount?: string;
    ticketStyle?: TicketStyle;
    codeStyle?: CodeStyle;
    showRatings?: boolean;
    showGenres?: boolean;
    hasAnyParam: boolean;
}

/**
 * Parses and validates URL search params.
 * Invalid / unknown values are silently dropped and the key is absent in the result.
 */
export function parseUrlParams(search: string): ParsedParams {
    const params = new URLSearchParams(search);
    const result: ParsedParams = { hasAnyParam: false };

    const user = params.get("user");
    if (user) {
        result.username = user.trim().slice(0, 50);
        result.hasAnyParam = true;
    }

    const list = params.get("list");
    if (LIST_TYPES.includes(list as ListType)) {
        result.listType = list as ListType;
        result.hasAnyParam = true;
    }

    const period = params.get("period");
    if (TIME_PERIODS.includes(period as TimePeriod)) {
        result.timePeriod = period as TimePeriod;
        result.hasAnyParam = true;
    }

    const amount = params.get("amount");
    if (amount) {
        const raw = parseInt(amount);
        if (!isNaN(raw)) {
            result.amount = String(Math.min(5, Math.max(1, raw)));
            result.hasAnyParam = true;
        }
    }

    const style = params.get("style");
    if (STYLES.includes(style as TicketStyle)) {
        result.ticketStyle = style as TicketStyle;
        result.hasAnyParam = true;
    }

    const code = params.get("code");
    if (CODE_STYLES.includes(code as CodeStyle)) {
        result.codeStyle = code as CodeStyle;
        result.hasAnyParam = true;
    }

    const ratings = params.get("ratings");
    if (ratings === "1" || ratings === "0") {
        result.showRatings = ratings === "1";
        result.hasAnyParam = true;
    }

    const genres = params.get("genres");
    if (genres === "1" || genres === "0") {
        result.showGenres = genres === "1";
        result.hasAnyParam = true;
    }

    return result;
}
