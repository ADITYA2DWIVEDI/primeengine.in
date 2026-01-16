import React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import LayoutWrapper from '@/components/LayoutWrapper'
import SmoothScroll from '@/components/SmoothScroll'
import CustomCursor from '@/components/CustomCursor'
import PageLoader from '@/components/PageLoader'
import Script from 'next/script'

export const metadata: Metadata = {
    title: 'Prime Engine - Build Full-Stack Apps With AI',
    description: 'The next-gen AI platform that gives everyone the power to build full-stack applications using natural language.',
    keywords: ['AI', 'no-code', 'app builder', 'full-stack', 'web development'],
    openGraph: {
        title: 'Prime Engine - Build Full-Stack Apps With AI',
        description: 'The next-gen AI platform that gives everyone the power to build full-stack applications.',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="mesh-bg grid-pattern bg-dark-950 text-white min-h-screen">
                <Script
                    src="https://checkout.razorpay.com/v1/checkout.js"
                    strategy="lazyOnload"
                />
                <SmoothScroll>
                    <PageLoader />
                    <div className="relative z-50">
                        <CustomCursor />
                    </div>
                    <LayoutWrapper>
                        {children}
                    </LayoutWrapper>
                </SmoothScroll>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: '#020617',
                            color: '#f8fafc',
                            border: '1px solid #1e293b',
                        },
                    }}
                />
            </body>
        </html>
    )
}
