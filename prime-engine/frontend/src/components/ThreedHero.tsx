'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sphere, MeshDistortMaterial, Float as FloatDrei, Stars, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

function Particles({ count = 1000 }) {
    const mesh = useRef<THREE.Points>(null!)

    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100
            const factor = 20 + Math.random() * 100
            const speed = 0.01 + Math.random() / 200
            const xFactor = -50 + Math.random() * 100
            const yFactor = -50 + Math.random() * 100
            const zFactor = -50 + Math.random() * 100
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
        }
        return temp
    }, [count])

    const dummy = useMemo(() => new THREE.Object3D(), [])

    useFrame((state) => {
        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle
            t = particle.t += speed / 2
            const a = Math.cos(t) + Math.sin(t * 1) / 10
            const b = Math.sin(t) + Math.cos(t * 2) / 10
            const s = Math.cos(t)
            particle.mx += (state.mouse.x * 1000 - particle.mx) * 0.01
            particle.my += (state.mouse.y * 1000 - particle.my) * 0.01
            dummy.position.set(
                (xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10),
                (yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10),
                (zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10)
            )
            dummy.scale.set(s, s, s)
            dummy.rotation.set(s * 5, s * 5, s * 5)
            dummy.updateMatrix()
            // Note: In real production, we'd use InstancedMesh for thousands of particles
            // but for this cinemantic effect, a smaller set of handled objects works.
        })
    })

    return null // This is a logic placeholder
}

function Rig() {
    return useFrame((state) => {
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.mouse.x * 2, 0.05)
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.mouse.y * 2, 0.05)
        state.camera.lookAt(0, 0, 0)
    })
}

function Scene() {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={50} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#6366f1" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#a855f7" />

            <FloatDrei speed={2} rotationIntensity={1} floatIntensity={2}>
                <Sphere args={[4, 64, 64]}>
                    <MeshDistortMaterial
                        color="#0f172a"
                        envMapIntensity={0.5}
                        clearcoat={1}
                        clearcoatRoughness={0}
                        metalness={0.9}
                        roughness={0.1}
                        distort={0.4}
                        speed={3}
                    />
                </Sphere>
            </FloatDrei>

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Rig />
        </>
    )
}

export default function ThreedHero() {
    return (
        <div className="absolute inset-0 z-0 opacity-40">
            <Canvas dpr={[1, 2]}>
                <Scene />
            </Canvas>
        </div>
    )
}
