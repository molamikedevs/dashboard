
'use client';

import { logout } from "@/lib/actions/action.auth";
import { Power } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutForm() {
    const router = useRouter();
    
    async function handleLogout(event: React.FormEvent) {
        event.preventDefault();
        event.stopPropagation();
        await logout();
        router.push("/login");
    }
    
    return (
        <form onSubmit={handleLogout} className="w-full">
            <button 
                type="submit"
                className="flex h-12 w-full grow items-center justify-center gap-2 rounded-md bg-custom-muted p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 transition-colors"
            >
                <Power className="w-6" />
                <div className="hidden md:block">Sign Out</div>
            </button>
        </form>
    );
}