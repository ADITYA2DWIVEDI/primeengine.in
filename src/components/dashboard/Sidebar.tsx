"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Plus,
    Settings,
    CreditCard,
    LogOut,
    FolderOpen
} from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/dashboard", label: "Projects", icon: LayoutDashboard },
        { href: "/dashboard/templates", label: "Templates", icon: FolderOpen },
        { href: "/dashboard/settings", label: "Settings", icon: Settings },
        { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
    ];

    return (
        <div className="w-64 h-full border-r border-white/5 bg-black/20 backdrop-blur-xl flex flex-col">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-solar-red to-solar-orange flex items-center justify-center font-bold text-black">
                        P
                    </div>
                    <span className="font-bold text-lg tracking-tight">Prime Engine</span>
                </div>

                <button className="w-full py-2 px-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                    <Plus className="w-4 h-4" />
                    New Project
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-solar-red/10 text-solar-orange border border-solar-red/20"
                                    : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5">
                <div className="p-4 rounded-xl bg-gradient-to-br from-solar-red/10 to-transparent border border-solar-red/20">
                    <h4 className="text-sm font-medium text-solar-orange mb-1">Pro Plan</h4>
                    <p className="text-xs text-zinc-400 mb-3">5/10 Projects used</p>
                    <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full w-1/2 bg-solar-orange rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
