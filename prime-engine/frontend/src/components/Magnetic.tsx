'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Magnetic({ children }: { children: React.ReactNode }) {
    const magneticRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const xTo = gsap.quickTo(magneticRef.current, "x", { duration: 1, ease: "elastic.out(1, 0.3)" })
        const yTo = gsap.quickTo(magneticRef.current, "y", { duration: 1, ease: "elastic.out(1, 0.3)" })

        const mouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e
            const { height, width, left, top } = magneticRef.current!.getBoundingClientRect()
            const x = clientX - (left + width / 2)
            const y = clientY - (top + height / 2)
            xTo(x * 0.35)
            yTo(y * 0.35)
        }

        const mouseLeave = () => {
            xTo(0)
            yTo(0)
        }

        magneticRef.current?.addEventListener("mousemove", mouseMove)
        magneticRef.current?.addEventListener("mouseleave", mouseLeave)

        return () => {
            magneticRef.current?.removeEventListener("mousemove", mouseMove)
            magneticRef.current?.removeEventListener("mouseleave", mouseLeave)
        }
    }, [])

    return (
        <div ref={magneticRef} className="magnetic">
            {children}
        </div>
    )
}
