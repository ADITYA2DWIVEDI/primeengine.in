'use client'

import dynamic from 'next/dynamic'

// Import LandingPage with SSR disabled to avoid GSAP/ScrollTrigger issues during build
const LandingPage = dynamic(() => import('@/components/LandingPage'), {
    ssr: false,
    loading: () => <div className="min-h-screen bg-dark-950" />
})

export default function Page() {
    return <LandingPage />
}
