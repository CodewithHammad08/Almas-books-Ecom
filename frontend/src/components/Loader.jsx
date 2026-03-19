import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

const Loader = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const animations = [];

    // 1. Draw Static Book Lines
    animations.push(
      anime({
        targets: container.querySelectorAll('.book-static'),
        strokeDasharray: anime.setDashoffset,
        strokeDashoffset: [anime.setDashoffset, 0],
        duration: 2000,
        easing: 'easeInOutSine',
        delay: anime.stagger(150),
      })
    );

    // 2. Floating Book Pulse
    animations.push(
      anime({
        targets: container.querySelector('.book-wrapper'),
        filter: [
          'drop-shadow(0px 0px 0px rgba(245,158,11,0))',
          'drop-shadow(0px 0px 20px rgba(245,158,11,0.5))',
        ],
        translateY: ['0px', '-5px'],
        duration: 2500,
        easing: 'easeInOutSine',
        direction: 'alternate',
        loop: true,
      })
    );

    // 3. Page Flip Effect
    animations.push(
      anime({
        targets: container.querySelectorAll('.flying-page'),
        rotateY: [0, 180],
        translateX: [0, 10],
        opacity: [0, 1, 0],
        duration: 1600,
        easing: 'easeInOutSine',
        delay: anime.stagger(800, { start: 500 }),
        loop: true,
      })
    );

    // 4. Brand Animation
    const timeline = anime.timeline();

    timeline
      .add({
        targets: container.querySelectorAll('.brand-char'),
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        easing: 'easeOutExpo',
        delay: anime.stagger(100, { start: 1200 }),
      })
      .add(
        {
          targets: container.querySelector('.brand-divider'),
          scaleY: [0, 1],
          opacity: [0, 1],
          duration: 800,
          easing: 'easeOutExpo',
        },
        '-=600'
      )
      .add(
        {
          targets: container.querySelector('.subtitle'),
          opacity: [0, 0.7],
          letterSpacing: ['0.1em', '0.4em'],
          duration: 1500,
          easing: 'easeOutQuart',
        },
        '-=400'
      );

    animations.push(timeline);

    // 5. Progress Bar
    animations.push(
      anime({
        targets: container.querySelector('.progress-track'),
        width: ['0%', '100%'],
        duration: 3000,
        easing: 'easeInOutQuart',
        loop: true,
      })
    );

    // 6. Particles
    const particles = container.querySelectorAll('.particle');
    particles.forEach((p) => {
      animations.push(
        anime({
          targets: p,
          translateY: [0, anime.random(-80, -150)],
          translateX: [0, anime.random(-30, 30)],
          opacity: [0, 1, 0],
          scale: [0, anime.random(0.5, 1.2), 0],
          duration: anime.random(2000, 3500),
          easing: 'easeOutSine',
          loop: true,
          delay: anime.random(0, 1500),
        })
      );
    });

    // Cleanup
    return () => {
      animations.forEach((anim) => anim.pause());
      anime.remove(container.querySelectorAll('*'));
    };
  }, []);

  const arabicWord = "الماس".split("");
  const englishWord = "ALMAS".split("");

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070707] px-4 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[100px]" />

      {/* Particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="particle absolute w-1 h-1 bg-amber-500 rounded-full opacity-0"
        />
      ))}

      {/* Book */}
      <div className="relative mb-10 w-32 h-32 flex items-center justify-center">
        <div className="book-wrapper relative w-full h-full">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              className="book-static"
              d="M 50 90 L 50 30"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              className="book-static"
              d="M 50 90 Q 25 100 10 75 L 10 15 Q 25 40 50 30"
              stroke="#f59e0b"
              strokeWidth="2"
              fill="none"
            />
            <path
              className="book-static"
              d="M 50 90 Q 75 100 90 75 L 90 15 Q 75 40 50 30"
              stroke="#f59e0b"
              strokeWidth="2"
              fill="none"
            />
            <path
              className="flying-page"
              d="M 50 85 Q 70 92 84 75 L 84 20 Q 70 38 50 30"
              stroke="#f59e0b"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              className="flying-page"
              d="M 50 85 Q 30 92 16 75 L 16 20 Q 30 38 50 30"
              stroke="#f59e0b"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </div>
      </div>

      {/* Brand */}
      <div className="flex flex-col items-center mb-10">
        <div className="flex items-center gap-4 text-4xl font-bold text-white">
          <div className="flex" dir="rtl">
            {arabicWord.map((c, i) => (
              <span key={i} className="brand-char text-amber-500 opacity-0">
                {c}
              </span>
            ))}
          </div>

          <div className="brand-divider w-[1px] h-8 bg-amber-500 opacity-0" />

          <div className="flex tracking-[0.3em]">
            {englishWord.map((c, i) => (
              <span key={i} className="brand-char opacity-0">
                {c}
              </span>
            ))}
          </div>
        </div>

        <p className="subtitle text-gray-400 text-xs tracking-widest opacity-0 mt-2">
          Premium Stationery
        </p>
      </div>

      {/* Progress */}
      <div className="w-64 h-[2px] bg-gray-800 overflow-hidden">
        <div className="progress-track h-full bg-amber-500 w-0" />
      </div>
    </div>
  );
};

export default Loader;