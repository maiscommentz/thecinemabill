"use client";

import { useState, useEffect } from "react";

/**
 * Returns true when the viewport width is below the `md` Tailwind breakpoint (768 px).
 * Updates reactively on window resize.
 */
export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const update = () => setIsMobile(window.innerWidth < 768);
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    return isMobile;
}
