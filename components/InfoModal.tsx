"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Github, Mail, Shield, Heart, Coffee } from "lucide-react";

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
    // Close on Escape key
    React.useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.96 }}
                        transition={{ type: "spring", damping: 22, stiffness: 220 }}
                        className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-6 pointer-events-none"
                    >
                        <div className="pointer-events-auto w-full max-w-[92vw] md:max-w-md max-h-[84dvh] md:max-h-none bg-[#fafaf8] border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none relative font-mono overflow-hidden">

                            {/* Receipt top edge */}
                            <div className="w-full h-4 overflow-hidden flex">
                                {Array.from({ length: 28 }).map((_, i) => (
                                    <div key={i} className="w-5 h-4 shrink-0" style={{
                                        background: i % 2 === 0 ? "#fafaf8" : "transparent",
                                        clipPath: "polygon(0 0, 100% 0, 50% 100%)"
                                    }} />
                                ))}
                            </div>

                            <div className="px-5 pb-6 pt-2 md:px-7 md:pb-8 overflow-y-auto max-h-[calc(84dvh-1rem)] md:max-h-none">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h2 className="font-logo text-[1.8rem] font-black italic uppercase leading-none tracking-tight">
                                            THE —<br />CINEMA BILL
                                        </h2>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors mt-1"
                                    >
                                        <X className="w-4 h-4 stroke-[2.5]" />
                                    </button>
                                </div>

                                <div className="w-full border-t border-dashed border-black/30 mb-5" />

                                {/* About */}
                                <section className="mb-5">
                                    <p className="text-[11px] uppercase tracking-widest font-bold mb-2 opacity-50">ABOUT</p>
                                    <p className="text-[13px] leading-relaxed">
                                        The Cinema Bill turns your Letterboxd watch history into a cinema receipt. Each film becomes a line item, itemized like a real ticket.<br />
                                        If you like it, give it a star on GitHub!
                                    </p>
                                    <p className="text-[13px] leading-relaxed mt-2 flex items-center gap-1.5">
                                        <Heart className="w-3 h-3 shrink-0 stroke-[2.5]" />
                                        Inspired by{" "}
                                        <a
                                            href="https://receiptify.herokuapp.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline underline-offset-2 hover:opacity-70 transition-opacity"
                                        >
                                            Receiptify
                                        </a>{" "}
                                        by Michelle Liu.
                                    </p>
                                </section>

                                <div className="w-full border-t border-dashed border-black/30 mb-5" />

                                {/* Links */}
                                <section className="mb-5 flex flex-col gap-3">
                                    <p className="text-[11px] uppercase tracking-widest font-bold opacity-50">LINKS</p>

                                    <a
                                        href="https://github.com/maiscommentz/thecinemabill"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 text-[13px] hover:opacity-70 transition-opacity group"
                                    >
                                        <div className="w-7 h-7 border-2 border-black flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                                            <Github className="w-3.5 h-3.5 stroke-[2]" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-[12px]">Open Source on GitHub</p>
                                            <p className="opacity-50 text-[11px]">github.com/maiscommentz/thecinemabill</p>
                                        </div>
                                    </a>

                                    <a
                                        href="mailto:pro.maiscommentz@gmail.com"
                                        className="flex items-center gap-3 text-[13px] hover:opacity-70 transition-opacity group"
                                    >
                                        <div className="w-7 h-7 border-2 border-black flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                                            <Mail className="w-3.5 h-3.5 stroke-[2]" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-[12px]">Contact</p>
                                            <p className="opacity-50 text-[11px]">pro.maiscommentz@gmail.com</p>
                                        </div>
                                    </a>

                                    <a
                                        href="https://buymeacoffee.com/mczzz"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 text-[13px] hover:opacity-70 transition-opacity group"
                                    >
                                        <div className="w-7 h-7 border-2 border-black flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                                            <Coffee className="w-3.5 h-3.5 stroke-[2]" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-[12px]">Buy Me a Coffee</p>
                                            <p className="opacity-50 text-[11px]">buymeacoffee.com/mczzz</p>
                                        </div>
                                    </a>
                                </section>

                                <div className="w-full border-t border-dashed border-black/30 mb-5" />

                                {/* Privacy */}
                                <section className="mb-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Shield className="w-3.5 h-3.5 shrink-0 stroke-[2]" />
                                        <p className="text-[11px] uppercase tracking-widest font-bold opacity-50">PRIVACY POLICY</p>
                                    </div>
                                    <p className="text-[12px] leading-relaxed opacity-70">
                                        The Cinema Bill does not collect, store, or transmit any personal data. Your Letterboxd username is only used client-side to generate the receipt preview. No analytics, no cookies, no tracking.
                                    </p>
                                </section>

                                <div className="w-full border-t border-dashed border-black/30 mt-5 mb-4" />

                                <p className="text-[10px] uppercase tracking-widest opacity-40 text-left">
                                    © 2026 MAISCOMMENTZ
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )
            }
        </AnimatePresence >
    );
}
