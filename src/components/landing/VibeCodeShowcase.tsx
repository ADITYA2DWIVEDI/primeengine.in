"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Float, Environment, Text, Html, PerspectiveCamera } from "@react-three/drei";
import { motion } from "framer-motion-3d";
import { motion as m } from "framer-motion";
import * as THREE from "three";
import { Lock, Database, Server, Smartphone, Zap, Sparkles } from "lucide-react";

// --- 3D ASSETS ---

const MobilePhone = ({ scale = 1, phase }: { scale?: number, phase: number }) => {
    return (
        <group scale={scale}>
            {/* Phone Body (Rounded Box) */}
            <RoundedBox args={[3.2, 6.5, 0.3]} radius={0.15} smoothness={4} castShadow receiveShadow>
                <meshStandardMaterial
                    color="#1a1a1a"
                    metalness={0.9}
                    roughness={0.2}
                    envMapIntensity={1.5}
                />
            </RoundedBox>

            {/* Screen (Inner Plane) */}
            <mesh position={[0, 0, 0.16]}>
                <planeGeometry args={[2.9, 6.2]} />
                <meshBasicMaterial color="#000" />
            </mesh>

            {/* Dynamic Screen Content (HTML Overlay) */}
            <Html
                transform
                position={[0, 0, 0.17]}
                occlude
                style={{
                    width: "290px",
                    height: "620px",
                    backgroundColor: phase === 0 ? "#000" : "#0d0d0d",
                    borderRadius: "20px",
                    padding: "20px",
                    overflow: "hidden",
                    display: 'flex',
                    flexDirection: 'column',
                    fontFamily: 'Inter, sans-serif'
                }}
            >
                <ScreenContent phase={phase} />
            </Html>
        </group>
    );
};

const BackendNode = ({ position, icon: Icon, label, delay, active }: { position: [number, number, number], icon: any, label: string, delay: number, active: boolean }) => {
    return (
        <motion.group
            position={position}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
            transition={{ delay: delay, duration: 0.5, type: 'spring' }}
        >
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <mesh>
                    <boxGeometry args={[1.2, 1.2, 0.1]} />
                    <meshPhysicalMaterial
                        color="black"
                        transparent
                        opacity={0.8}
                        metalness={0.8}
                        roughness={0.2}
                        clearcoat={1}
                        transmission={0.4}
                        thickness={1}
                        side={THREE.DoubleSide}
                    />
                </mesh>

                {/* Glow Ring */}
                <mesh position={[0, 0, -0.05]}>
                    <ringGeometry args={[0.7, 0.75, 32]} />
                    <meshBasicMaterial color="#FF944D" transparent opacity={0.5} />
                </mesh>

                <Html transform position={[0, 0, 0.06]} style={{ pointerEvents: 'none' }}>
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="p-3 bg-solar-gradient rounded-xl shadow-[0_0_15px_rgba(255,147,41,0.5)]">
                            <Icon size={24} color="black" strokeWidth={3} />
                        </div>
                        <div className="mt-2 px-2 py-1 bg-black/80 backdrop-blur-md rounded border border-white/10 text-[8px] font-bold text-white uppercase tracking-widest whitespace-nowrap">
                            {label}
                        </div>
                    </div>
                </Html>
            </Float>
        </motion.group>
    );
};

// --- REACT UI (INSIDE PHONE) ---

const ScreenContent = ({ phase }: { phase: number }) => {
    if (phase === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center"
                >
                    <Sparkles className="w-6 h-6 text-white/20 animate-pulse" />
                </m.div>
                <m.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-white/40 text-xs font-medium"
                >
                    Waiting for vibe...
                </m.p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col relative">
            {/* Header */}
            <m.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="h-14 flex items-center justify-between border-b border-white/5 pb-2 mb-4"
            >
                <div className="w-8 h-8 rounded-lg bg-white/10 animate-pulse" />
                <div className="w-24 h-4 rounded bg-white/5 animate-pulse" />
            </m.div>

            {/* Hero Card */}
            <m.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="h-32 rounded-2xl bg-gradient-to-br from-solar-red/20 to-solar-orange/10 border border-white/5 p-4 mb-4 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-10 bg-solar-orange/20 blur-2xl rounded-full" />
                <div className="w-1/2 h-4 rounded bg-white/10 mb-2" />
                <div className="w-3/4 h-3 rounded bg-white/5" />
            </m.div>

            {/* List Items */}
            <div className="space-y-3 flex-1 overflow-hidden">
                {[1, 2, 3].map((i) => (
                    <m.div
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 + (i * 0.1) }}
                        className="h-16 rounded-xl bg-white/5 border border-white/5 flex items-center px-4 gap-3"
                    >
                        <div className="w-10 h-10 rounded-full bg-white/5" />
                        <div className="flex-1 space-y-1.5">
                            <div className="w-2/3 h-3 rounded bg-white/10" />
                            <div className="w-1/3 h-2 rounded bg-white/5" />
                        </div>
                    </m.div>
                ))}
            </div>

            {/* Backend Connectivity Badge */}
            {phase >= 2 && (
                <m.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute bottom-0 left-0 right-0 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center gap-2"
                >
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Live System Active</span>
                </m.div>
            )}
        </div>
    );
};

// --- DATA STREAMS ---
const DataStream = ({ start, end, active }: { start: [number, number, number], end: [number, number, number], active: boolean }) => {
    // A simple line or curve with animated texture could go here.
    // For now, representing with particles moving along the path
    if (!active) return null;

    return (
        <group>
            {/* Line visualization can be added here */}
        </group>
    )
}


export default function VibeCodeShowcase() {
    const [phase, setPhase] = useState(0);

    // Animation Sequence
    useEffect(() => {
        const t1 = setTimeout(() => setPhase(1), 1000); // Phone appears
        const t2 = setTimeout(() => setPhase(2), 2500); // Backend nodes appear
        const t3 = setTimeout(() => setPhase(3), 4000); // Connection established

        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []);

    return (
        <div className="w-full h-[600px] md:h-[800px] relative bg-transparent">
            <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={35} />

                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -5, -10]} intensity={0.5} color="#FF944D" />

                <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                    <MobilePhone phase={phase > 0 ? phase : 0} />
                </Float>

                {/* Backend Nodes Floating Around */}
                <BackendNode
                    position={[-3.5, 1.5, -2]}
                    icon={Lock}
                    label="Auth"
                    delay={0.5}
                    active={phase >= 2}
                />
                <BackendNode
                    position={[3.5, 0.5, -1]}
                    icon={Database}
                    label="Postgres"
                    delay={0.7}
                    active={phase >= 2}
                />
                <BackendNode
                    position={[-3, -2.5, 0]}
                    icon={Server}
                    label="Edge API"
                    delay={0.9}
                    active={phase >= 2}
                />
                <BackendNode
                    position={[3, -2, -1.5]}
                    icon={Zap}
                    label="Redis"
                    delay={1.1}
                    active={phase >= 2}
                />

                <Environment preset="city" />
            </Canvas>

            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
    );
}
