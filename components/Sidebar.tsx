"use client";

import React from "react";
import { Input, Button, Select, Switch } from "./ui";

export interface SidebarProps {
    username: string;
    setUsername: (val: string) => void;
    listType: string;
    setListType: (val: string) => void;
    timePeriod: string;
    setTimePeriod: (val: string) => void;
    ticketStyle: string;
    setTicketStyle: (val: string) => void;
    codeStyle: string;
    setCodeStyle: (val: string) => void;
    showRatings: boolean;
    setShowRatings: (val: boolean) => void;
    showRuntimes: boolean;
    setShowRuntimes: (val: boolean) => void;
    onGenerate: () => void;
}

export function Sidebar({
    username, setUsername,
    listType, setListType,
    timePeriod, setTimePeriod,
    ticketStyle, setTicketStyle,
    codeStyle, setCodeStyle,
    showRatings, setShowRatings,
    showRuntimes, setShowRuntimes,
    onGenerate
}: SidebarProps) {
    return (
        <div className="w-[350px] shrink-0 border-r-2 border-black bg-[#fcfcfc] p-8 flex flex-col h-[100dvh] overflow-y-auto z-10">
            <div className="mb-12 cursor-default">
                <h1 className="font-logo text-[3.5rem] font-black italic uppercase leading-none tracking-tight mb-2">
                    THE —<br />CINEMA BILL
                </h1>
                <p className="font-sans text-sm font-semibold text-gray-500">Your film history, itemized.</p>
            </div>

            <div className="flex flex-col gap-6 flex-1">
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black">Letterboxd Username</label>
                    <Input
                        placeholder="e.g. film_lover12"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <Button className="w-full text-lg mt-2" onClick={onGenerate}>Generate Bill</Button>

                <hr className="border-t-2 border-black my-2" />

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black">List Type</label>
                    <Select value={listType} onChange={(e) => setListType(e.target.value)}>
                        <option>Recent Activity</option>
                        <option>Top 5 Favorites</option>
                        <option>Top 10 Favorites</option>
                    </Select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black">Time Period</label>
                    <Select value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)}>
                        <option>Last Month</option>
                        <option>This Year</option>
                        <option>All Time</option>
                    </Select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black">Ticket Style</label>
                    <Select value={ticketStyle} onChange={(e) => setTicketStyle(e.target.value)}>
                        <option>Thermal Paper</option>
                        <option>Matte Black</option>
                        <option>Neon Pop</option>
                    </Select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black">Code Style</label>
                    <Select value={codeStyle} onChange={(e) => setCodeStyle(e.target.value)}>
                        <option>Barcode</option>
                        <option>QR Code</option>
                    </Select>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black">Show Ratings</label>
                    <Switch checked={showRatings} onChange={setShowRatings} />
                </div>

                <div className="flex items-center justify-between mb-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black">Show Runtimes</label>
                    <Switch checked={showRuntimes} onChange={setShowRuntimes} />
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="font-sans text-[10px] text-gray-500 max-w-[200px] leading-relaxed mb-4">
                    A minimalist utility for cinephiles. Converts your recent watches into a high-fidelity thermal receipt visualization.
                </p>
                <p className="font-sans text-[9px] text-gray-400 font-bold tracking-wider">© 2026 MAISCOMMENTZ</p>
            </div>
        </div>
    );
}
