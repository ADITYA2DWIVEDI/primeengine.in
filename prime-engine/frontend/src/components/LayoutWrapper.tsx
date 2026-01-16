'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

const sidebarRoutes = ['/dashboard', '/editor', '/settings', '/projects', '/credits', '/analytics']
const noNavRoutes = ['/login', '/signup']

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    // Check if the current route should show the sidebar
    const showSidebar = sidebarRoutes.some(route => pathname?.startsWith(route))

    // Check if the current route should show the navbar (public pages)
    const showNavbar = !showSidebar && !noNavRoutes.some(route => pathname?.startsWith(route))

    return (
        <>
            {showNavbar && <Navbar />}
            {showSidebar && <Sidebar />}
            <main className={showSidebar ? 'pl-20' : ''}>
                {children}
            </main>
        </>
    )
}
