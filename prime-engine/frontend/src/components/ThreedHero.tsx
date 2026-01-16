'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sphere, MeshDistortMaterial, Stars, PerspectiveCamera, Icosahedron, MeshWobbleMaterial } from '@react-three/drei'
import * as THREE from 'three'

function Particles({ count = 40 }) {
    const mesh = useRef<THREE.Group>(null!)

    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            const time = Math.random() * 100
            const factor = 10 + Math.random() * 20
            const speed = 0.005 + Math.random() / 200
            const xFactor = -20 + Math.random() * 40
            const yFactor = -20 + Math.random() * 40
            const zFactor = -20 + Math.random() * 40
            temp.push({ time, factor, speed, xFactor, yFactor, zFactor })
        }
        return temp
    }, [count])

    useFrame((state) => {
        mesh.current.children.forEach((child, i) => {
            const { time, factor, speed, xFactor, yFactor, zFactor } = particles[i]
            const t = (particles[i].time += speed)
            child.position.set(
                xFactor + Math.cos(t / 2) * factor,
                yFactor + Math.sin(t / 4) * factor,
                zFactor + Math.cos(t / 1) * factor
            )
            child.scale.setScalar(Math.cos(t) * 0.5 + 1)
        })
    })

    return (
        <group ref={mesh}>
            {particles.map((_, i) => (
                <Icosahedron key={i} args={[0.2, 0]}>
                    <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={2} transparent opacity={0.5} />
                </Icosahedron>
            ))}
        </group>
    )
}

function Rig() {
    return useFrame((state) => {
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.mouse.x * 10, 0.05)
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.mouse.y * 10, 0.05)
        state.camera.lookAt(0, 0, 0)
    })
}

function Scene() {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 25]} fov={50} />
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#6366f1" />
            <pointLight position={[-10, -10, -10]} intensity={1.5} color="#a855f7" />
            <spotLight position={[5, 10, 5]} angle={0.15} penumbra={1} intensity={2} color="#fff" />

            <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
                <Icosahedron args={[5, 1]}>
                    <MeshDistortMaterial
                        color="#0f172a"
                        envMapIntensity={0.5}
                        clearcoat={1}
                        clearcoatRoughness={0}
                        metalness={0.9}
                        roughness={0.1}
                        distort={0.5}
                        speed={2}
                    />
                    <lineSegments>
                        <edgesGeometry args={[new THREE.IcosahedronGeometry(5.05, 1)]} />
                        <meshBasicMaterial color="#6366f1" transparent opacity={0.2} />
                    </lineSegments>
                </Icosahedron>
            </Float>

            <Particles />
            <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
            <Rig />
        </>
    )
}

export default function ThreedHero() {
    return (
        <div className="absolute inset-0 z-0 opacity-60">
            <Canvas dpr={[1, 2]}>
                <Scene />
            </Canvas>
        </div>
    )
}
