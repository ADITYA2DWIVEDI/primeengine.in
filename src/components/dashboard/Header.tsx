"use client";

import { useSession, signOut } from "next-auth/react";
import { User, LogOut, Bell } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
    const { data: session } = useSession();

    return (
        <header className="h-16 border-b border-white/5 bg-black/20 backdrop-blur-xl flex items-center justify-between px-6">
            <div className="text-sm text-zinc-400">
                Dashboard / <span className="text-zinc-100 font-medium">Projects</span>
            </div>

            <div className="flex items-center gap-4">
                <button className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
                    <Bell className="w-4 h-4 text-zinc-400" />
                </button>

                <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-4 h-4 text-zinc-400" />
                            )}
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-zinc-950 border-white/10 text-zinc-200">
                        <DropdownMenuItem className="focus:bg-white/5 cursor-pointer">
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-white/5 cursor-pointer">
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="focus:bg-red-500/10 text-red-400 focus:text-red-400 cursor-pointer"
                            onClick={() => signOut()}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
