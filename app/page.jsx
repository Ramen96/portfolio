"use client";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/page.module.css";
import Nav from "../components/Nav/nav";

export default function Home() {
  const matrixContainerRef = useRef(null);
  const cursorRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [currentSection, setCurrentSection] = useState('home');

  // Prevent scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, []);

  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

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

  // Create initial matrix characters
  useEffect(() => {
    for (let i = 0; i < 15; i++) {
      setTimeout(createMatrixChar, i * 100);
    }
    
    // Set up intervals
    const matrixInterval = setInterval(createMatrixChar, 150);
    const artifactsInterval = setInterval(spawnRandomArtifacts, 3000);

    return () => {
      clearInterval(matrixInterval);
      clearInterval(artifactsInterval);
    };
  }, []);

  const sections = {
    home: {
      title: "the404.page",
      subtitle: "Welcome to the Digital Void",
      content: "A cyberpunk corner of the internet where errors become art and glitches tell stories."
    },
    about: {
      title: "About the Anomaly",
      subtitle: "Lost in Translation",
      content: "Born from the digital abyss, the404.page exists in the liminal space between found and lost, between error and intention. Here, bugs are features and chaos has its own order."
    },
    projects: {
      title: "Digital Artifacts",
      subtitle: "Experiments in Code",
      content: "A collection of digital experiments, glitched creations, and cyberpunk aesthetics. Where traditional web design goes to die and something more interesting is born."
    },
    contact: {
      title: "Establish Connection",
      subtitle: "Signal in the Noise",
      content: "Reach out through the static. Communication protocols may be unstable, but the signal always finds a way through."
    }
  };

  const navItems = [
    { name: 'home', href: '/' },
    { name: 'about', href: '/about' },
    { name: 'projects', href: '/projects' },
    { name: 'contact', href: '/contact' },
    { name: 'game', href: '/game' }
  ];

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
      
      {/* Navigation */}
      <Nav 
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        navItems={navItems}
      />

      {/* Main content */}
      <div className={styles.textLayers}>
        <div className={styles.mainContent}>
          <h1 className={styles.mainTitle} data-text={sections[currentSection].title}>
            {sections[currentSection].title}
          </h1>
          
          <div className={styles.subtitle}>
            {sections[currentSection].subtitle}
          </div>
          
          <div className={styles.content}>
            {sections[currentSection].content}
          </div>

          {/* Section-specific content */}
          {currentSection === 'home' && (
            <div className={styles.homeButtons}>
              {['ENTER', 'EXPLORE', 'EXPERIENCE'].map((text, i) => (
                <div key={text} className={styles.homeButton} style={{
                  animation: `text-color-shift ${2 + i * 0.3}s infinite`
                }}>
                  {text}
                </div>
              ))}
            </div>
          )}

          {currentSection === 'projects' && (
            <div className={styles.projectsGrid}>
              {[
                { name: 'GLITCH.EXE', desc: 'Digital corruption as art form' },
                { name: 'VOID.CSS', desc: 'Stylesheets from the abyss' },
                { name: 'ERROR.HTML', desc: 'Beautiful broken markup' }
              ].map(project => (
                <div key={project.name} className={styles.projectCard}>
                  <div className={styles.projectName}>
                    {project.name}
                  </div>
                  <div className={styles.projectDesc}>
                    {project.desc}
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentSection === 'contact' && (
            <div className={styles.contactContainer}>
              <div className={styles.contactCard}>
                <div className={styles.contactLine}>
                  <span className={styles.contactLabel} style={{ color: 'var(--glitch-color-1)' }}>EMAIL:</span>
                  <span className={styles.contactValue}> contact@the404.page</span>
                </div>
                <div className={styles.contactLine}>
                  <span className={styles.contactLabel} style={{ color: 'var(--glitch-color-2)' }}>SIGNAL:</span>
                  <span className={styles.contactValue}> ENCRYPTED</span>
                </div>
                <div className={styles.contactLine}>
                  <span className={styles.contactLabel} style={{ color: 'var(--glitch-color-3)' }}>STATUS:</span>
                  <span className={styles.contactValue}> ONLINE</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Alternative glitch messages */}
        <div className={`${styles.altMessage} ${styles.altMessage1}`}>SYSTEM ERROR DETECTED</div>
        <div className={`${styles.altMessage} ${styles.altMessage2}`}>REBOOTING IN PROGRESS</div>
        <div className={`${styles.altMessage} ${styles.altMessage3}`}>CONNECTION UNSTABLE</div>
      </div>
      
      {/* Footer status bar */}
      <div className={styles.statusBar}>
        <div>STATUS: <span style={{ color: 'var(--glitch-color-2)' }}>ONLINE</span></div>
        <div>|</div>
        <div>ERRORS: <span style={{ color: 'var(--glitch-color-1)' }}>404</span></div>
        <div>|</div>
        <div>UPTIME: <span style={{ color: 'var(--glitch-color-3)' }}>∞</span></div>
      </div>
    </div>
  );
}