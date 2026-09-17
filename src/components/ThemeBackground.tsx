"use client";

import { useEffect, useState, useMemo } from 'react';

/* eslint-disable */
export default function ThemeBackground({ theme }: { theme: string }) {
  const [mounted, setMounted] = useState(false);

  // Pre-generate random values to satisfy linter purity rules
  const romancePetals = useMemo(() => [...Array(25)].map(() => ({
    width: Math.random() * 20 + 15,
    height: Math.random() * 20 + 15,
    left: Math.random() * 100,
    animDur: Math.random() * 8 + 8,
    animDelay: Math.random() * 10,
    rot: Math.random() * 360
  })), []);

  const scifiStars = useMemo(() => [...Array(50)].map(() => ({
    width: Math.random() * 4 + 2,
    height: Math.random() * 4 + 2,
    left: Math.random() * 100,
    top: Math.random() * 100,
    animDur: Math.random() * 3 + 1.5,
    animDelay: Math.random() * 5
  })), []);

  const fantasyFireflies = useMemo(() => [...Array(30)].map(() => ({
    width: Math.random() * 6 + 3,
    height: Math.random() * 6 + 3,
    left: Math.random() * 100,
    animDur: Math.random() * 12 + 8,
    animDelay: Math.random() * 8
  })), []);

  const classicDust = useMemo(() => [...Array(40)].map(() => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    animDur: Math.random() * 8 + 4,
    animDelay: Math.random() * 8
  })), []);

  const fantasyDriftX = useMemo(() => Math.random() > 0.5 ? '150px' : '-150px', []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      
      {/* -------------------- ROMANCE (Rose) -------------------- */}
      {theme === 'romance' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-rose-100/60 to-transparent"></div>
          {/* Falling Petals */}
          {romancePetals.map((p, i) => (
            <div 
              key={i} 
              className="absolute bg-rose-400/60 rounded-full drop-shadow-sm"
              style={{
                width: `${p.width}px`,
                height: `${p.height}px`,
                left: `${p.left}%`,
                top: `-30px`,
                animation: `fall ${p.animDur}s linear infinite`,
                animationDelay: `${p.animDelay}s`,
                borderRadius: '50% 0 50% 50%',
                transform: `rotate(${p.rot}deg)`
              }}
            />
          ))}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes fall {
              0% { transform: translateY(-30px) rotate(0deg) translateX(0); opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { transform: translateY(100vh) rotate(360deg) translateX(150px); opacity: 0; }
            }
          `}} />
        </div>
      )}

      {/* -------------------- SCI-FI (Blue) -------------------- */}
      {theme === 'scifi' && (
        <div className="absolute inset-0 bg-blue-50/50">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.1)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_60%,transparent_100%)]"></div>
          {/* Twinkling Stars */}
          {scifiStars.map((s, i) => (
            <div 
              key={i} 
              className="absolute bg-blue-500 rounded-full"
              style={{
                width: `${s.width}px`,
                height: `${s.height}px`,
                left: `${s.left}%`,
                top: `${s.top}%`,
                animation: `twinkle ${s.animDur}s ease-in-out infinite`,
                animationDelay: `${s.animDelay}s`,
              }}
            />
          ))}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes twinkle {
              0%, 100% { opacity: 0.2; transform: scale(1); }
              50% { opacity: 1; transform: scale(2); box-shadow: 0 0 10px 2px rgba(59,130,246,0.9); }
            }
          `}} />
        </div>
      )}

      {/* -------------------- FANTASY (Emerald) -------------------- */}
      {theme === 'fantasy' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-100/70 to-transparent"></div>
          {/* Glowing Fireflies */}
          {fantasyFireflies.map((f, i) => (
            <div 
              key={i} 
              className="absolute bg-emerald-400 rounded-full"
              style={{
                width: `${f.width}px`,
                height: `${f.height}px`,
                left: `${f.left}%`,
                bottom: `-30px`,
                animation: `float-up ${f.animDur}s ease-in infinite`,
                animationDelay: `${f.animDelay}s`,
                boxShadow: '0 0 15px 4px rgba(52, 211, 153, 0.7)',
              }}
            />
          ))}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes float-up {
              0% { transform: translateY(30px) translateX(0) scale(0.5); opacity: 0; }
              20% { opacity: 1; transform: scale(1); }
              80% { opacity: 1; }
              100% { transform: translateY(-100vh) translateX(${fantasyDriftX}) scale(0.5); opacity: 0; }
            }
          `}} />
        </div>
      )}

      {/* -------------------- MYSTERY (Violet) -------------------- */}
      {theme === 'mystery' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-violet-50/50"></div>
          {/* Slow shifting gradients acting like fog */}
          <div className="absolute bottom-0 left-0 right-0 h-[600px] bg-gradient-to-t from-violet-200/60 to-transparent"></div>
          <div 
            className="absolute -inset-[50%] opacity-40 blur-3xl mix-blend-multiply"
            style={{
              background: 'radial-gradient(circle at center, rgba(139,92,246,0.3) 0%, transparent 60%)',
              animation: 'drift 15s ease-in-out infinite alternate'
            }}
          ></div>
          <div 
            className="absolute -inset-[50%] opacity-40 blur-3xl mix-blend-multiply"
            style={{
              background: 'radial-gradient(circle at 70% 60%, rgba(139,92,246,0.2) 0%, transparent 50%)',
              animation: 'drift 18s ease-in-out infinite alternate-reverse'
            }}
          ></div>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes drift {
              0% { transform: translate(0, 0) scale(1); }
              100% { transform: translate(15%, -10%) scale(1.2); }
            }
          `}} />
        </div>
      )}

      {/* -------------------- CLASSIC (Slate) -------------------- */}
      {theme === 'classic' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-slate-100/50"></div>
          {/* Subtle noise / dust particles */}
          <div className="absolute inset-0 bg-[radial-gradient(#64748b_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-25"></div>
          {classicDust.map((d, i) => (
            <div 
              key={i} 
              className="absolute bg-slate-500 rounded-full"
              style={{
                width: '3px',
                height: '3px',
                left: `${d.left}%`,
                top: `${d.top}%`,
                animation: `dust ${d.animDur}s linear infinite`,
                animationDelay: `${d.animDelay}s`,
                boxShadow: '0 0 2px rgba(100,116,139,0.5)'
              }}
            />
          ))}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes dust {
              0% { transform: translateY(0) translateX(0); opacity: 0; }
              20% { opacity: 0.8; }
              80% { opacity: 0.8; }
              100% { transform: translateY(-100px) translateX(40px); opacity: 0; }
            }
          `}} />
        </div>
      )}

    </div>
  );
}
