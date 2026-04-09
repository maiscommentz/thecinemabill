"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen({ onDone }: { onDone: () => void }) {
    const [phase, setPhase] = React.useState<"in" | "hold" | "out">("in");

    React.useEffect(() => {
        // Hold for 1.8s then exit
        const holdTimer = setTimeout(() => setPhase("out"), 1800);
        return () => clearTimeout(holdTimer);
    }, []);

    return (
        <AnimatePresence onExitComplete={onDone}>
            {phase !== "out" && (
                <motion.div
                    key="splash"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
                    style={{ background: "#f5f0f0" }}
                >
                    {/* Color blobs as main background */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-50" style={{ background: "radial-gradient(circle, #ffd6d6 0%, transparent 70%)" }} />
                        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full opacity-50" style={{ background: "radial-gradient(circle, #c8f0e0 0%, transparent 70%)" }} />
                        <div className="absolute top-1/2 -right-20 w-[500px] h-[500px] rounded-full opacity-60" style={{ background: "radial-gradient(circle, #d4e8ff 0%, transparent 70%)" }} />
                        <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] rounded-full opacity-55" style={{ background: "radial-gradient(circle, #e8d4ff 0%, transparent 70%)" }} />
                        <div className="absolute top-0 right-1/3 w-[420px] h-[420px] rounded-full opacity-55" style={{ background: "radial-gradient(circle, #ffecd2 0%, transparent 70%)" }} />
                    </div>

                    {/* Logo */}
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                        className="relative z-10 flex flex-col items-center gap-4"
                    >
                        <h1
                            className="font-logo text-[2.8rem] sm:text-[4.5rem] font-black italic uppercase leading-none tracking-tight text-left select-none"
                            style={{ fontFamily: "inherit" }}
                        >
                            THE —<br />CINEMA BILL
                        </h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="font-mono text-xs uppercase tracking-[0.25em] text-black mt-2"
                        >
                            Your film history, itemized.
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
