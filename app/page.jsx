"use client";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/page.module.css";

export default function Home() {
const matrixContainerRef = useRef(null);
  const cursorRef = useRef(null);
  const loadingLabelRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  const loadingMessages = [
    'LOADING SYSTEM...',
    'INITIALIZING...',
    'ERROR DETECTED...',
    'RETRYING...',
    'CONNECTING...',
    'SYSTEM CORRUPTED...',
    'RESTORING...'
  ];

  // Matrix character creation
  const createMatrixChar = () => {
    if (!matrixContainerRef.current) return;

    const char = document.createElement('div');
    const charText = chars[Math.floor(Math.random() * chars.length)];
    char.className = styles.matrixChar;
    char.textContent = charText;
    char.setAttribute('data-char', charText);
    char.style.left = Math.random() * 100 + '%';
    char.style.animationDuration = (Math.random() * 4 + 3) + 's';
    char.style.animationDelay = '0s';
    matrixContainerRef.current.appendChild(char);
    
    setTimeout(() => {
      if (char.parentNode) {
        char.remove();
      }
    }, 7000);
  };

  // Custom cursor tracking
  useEffect(() => {
    const updateCursor = () => {
      setCursorPosition(prev => ({
        x: prev.x + (mousePosition.x - prev.x) * 0.1,
        y: prev.y + (mousePosition.y - prev.y) * 0.1
      }));
      requestAnimationFrame(updateCursor);
    };
    updateCursor();
  }, [mousePosition]);

  // Mouse move handler
  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    
    // Mouse trail effect
    if (Math.random() > 0.7) {
      const trail = document.createElement('div');
      trail.className = styles.cursorTrail;
      trail.style.left = e.clientX + 'px';
      trail.style.top = e.clientY + 'px';
      trail.style.background = `var(--glitch-color-${Math.floor(Math.random() * 4) + 1})`;
      document.body.appendChild(trail);
      
      setTimeout(() => {
        if (trail.parentNode) {
          trail.remove();
        }
      }, 500);
    }
  };

  // Random glitch effects
  const randomizeGlitches = () => {
    const intensity = Math.random();
    const body = document.body;
    
    if (intensity > 0.95) {
      body.style.animationDuration = '0.5s';
      setTimeout(() => {
        body.style.animationDuration = '3s';
      }, 500);
    } else if (intensity > 0.85) {
      body.style.animationDuration = '1s';
      setTimeout(() => {
        body.style.animationDuration = '3s';
      }, 1000);
    }
  };

  // Spawn random artifacts
  const spawnRandomArtifacts = () => {
    if (Math.random() > 0.8) {
      const artifact = document.createElement('div');
      artifact.className = styles.artifactBlock;
      artifact.style.position = 'fixed';
      artifact.style.width = (Math.random() * 40 + 5) + 'px';
      artifact.style.height = (Math.random() * 30 + 5) + 'px';
      artifact.style.left = Math.random() * window.innerWidth + 'px';
      artifact.style.top = Math.random() * window.innerHeight + 'px';
      artifact.style.zIndex = '50';
      artifact.style.background = `var(--glitch-color-${Math.floor(Math.random() * 4) + 1})`;
      artifact.style.animation = 'artifact-flicker 0.1s infinite';
      document.body.appendChild(artifact);
      
      setTimeout(() => {
        if (artifact.parentNode) {
          artifact.remove();
        }
      }, Math.random() * 1000 + 500);
    }
  };

  // Update loading message
  const updateLoadingMessage = () => {
    if (Math.random() > 0.7 && loadingLabelRef.current) {
      loadingLabelRef.current.textContent = 
        loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    }
  };

  useEffect(() => {
    // Create initial matrix characters
    for (let i = 0; i < 15; i++) {
      setTimeout(createMatrixChar, i * 100);
    }
    
    // Set up intervals
    const matrixInterval = setInterval(createMatrixChar, 150);
    const glitchInterval = setInterval(randomizeGlitches, 8000);
    const artifactsInterval = setInterval(spawnRandomArtifacts, 3000);
    const loadingInterval = setInterval(updateLoadingMessage, 2000);

    return () => {
      clearInterval(matrixInterval);
      clearInterval(glitchInterval);
      clearInterval(artifactsInterval);
      clearInterval(loadingInterval);
    };
  }, []);

  return (
    <div className={styles.container} onMouseMove={handleMouseMove}>
      {/* Screen flicker overlay */}
      <div className={styles.screenFlicker}></div>
      
      {/* Digital artifacts */}
      <div className={styles.digitalArtifacts}>
        <div className={styles.artifactBlock} style={{width: '20px', height: '15px', top: '10%', left: '15%'}}></div>
        <div className={styles.artifactBlock} style={{width: '15px', height: '12px', top: '30%', left: '70%'}}></div>
        <div className={styles.artifactBlock} style={{width: '25px', height: '18px', top: '60%', left: '20%'}}></div>
        <div className={styles.artifactBlock} style={{width: '18px', height: '20px', top: '80%', left: '85%'}}></div>
        <div className={styles.artifactBlock} style={{width: '12px', height: '10px', top: '25%', left: '45%'}}></div>
        <div className={styles.artifactBlock} style={{width: '30px', height: '8px', top: '70%', left: '60%'}}></div>
        <div className={styles.artifactBlock} style={{width: '8px', height: '25px', top: '15%', left: '90%'}}></div>
        <div className={styles.artifactBlock} style={{width: '22px', height: '14px', top: '85%', left: '10%'}}></div>
      </div>
      
      {/* Matrix background */}
      <div ref={matrixContainerRef} className={styles.matrixBg}></div>
      
      {/* RGB shift overlay */}
      <div className={styles.rgbShift}></div>
      
      {/* Custom cursor */}
      <div 
        ref={cursorRef}
        className={styles.glitchCursor}
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`
        }}
      ></div>
      
      {/* Text layers */}
      <div className={styles.textLayers}>
        <h1 className={styles.mainTitle} data-text="the404.page is under construction!">
          the404.page is under construction!
        </h1>
        <div className={`${styles.altMessage} ${styles.altMessage1}`}>SYSTEM ERROR DETECTED</div>
        <div className={`${styles.altMessage} ${styles.altMessage2}`}>REBOOTING IN PROGRESS</div>
        <div className={`${styles.altMessage} ${styles.altMessage3}`}>CONNECTION UNSTABLE</div>
      </div>
      
      {/* Loading bar */}
      <div className={styles.loadingContainer}>
        <div ref={loadingLabelRef} className={styles.loadingLabel}>LOADING SYSTEM...</div>
        <div className={styles.loadingBar}>
          <div className={styles.loadingProgress}></div>
        </div>
      </div>
    </div>
  );
}
