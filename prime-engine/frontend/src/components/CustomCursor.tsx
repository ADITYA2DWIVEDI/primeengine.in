'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null)
    const followerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const cursor = cursorRef.current
        const follower = followerRef.current

        if (!cursor || !follower) return

        const onMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e

            gsap.to(cursor, {
                x: clientX,
                y: clientY,
                duration: 0.1,
                ease: 'power2.out'
            })

            gsap.to(follower, {
                x: clientX,
                y: clientY,
                duration: 0.5,
                ease: 'power3.out'
            })
        }

        const onMouseDown = () => {
            gsap.to([cursor, follower], { scale: 0.8, duration: 0.2 })
        }

        const onMouseUp = () => {
            gsap.to([cursor, follower], { scale: 1, duration: 0.2 })
        }

        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mousedown', onMouseDown)
        window.addEventListener('mouseup', onMouseUp)

        // Handle link hovers
        const links = document.querySelectorAll('a, button, .premium-card')
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(follower, {
                    scale: 3,
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    borderWidth: 0,
                    duration: 0.3
                })
            })
            link.addEventListener('mouseleave', () => {
                gsap.to(follower, {
                    scale: 1,
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    duration: 0.3
                })
            })
        })

        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mousedown', onMouseDown)
            window.removeEventListener('mouseup', onMouseUp)
        }
    }, [])

    return (
        <>
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-2 h-2 bg-primary-500 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block"
            />
            <div
                ref={followerRef}
                className="fixed top-0 left-0 w-8 h-8 border border-primary-500/50 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 hidden md:block"
            />
        </>
    )
}
