"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Parallax section wrapper
interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down";
}

export function ParallaxSection({
  children,
  className = "",
  speed = 0.5,
  direction = "up",
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const yValue = direction === "up" ? -100 * speed : 100 * speed;

    const tween = gsap.to(element, {
      y: yValue,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [speed, direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// Reveal on scroll animation
interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  animation?: "fade" | "slide-up" | "slide-left" | "slide-right" | "scale";
  delay?: number;
  duration?: number;
  threshold?: number;
}

export function RevealOnScroll({
  children,
  className = "",
  animation = "fade",
  delay = 0,
  duration = 1,
  threshold = 0.2,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const animations = {
      fade: { opacity: 0 },
      "slide-up": { opacity: 0, y: 100 },
      "slide-left": { opacity: 0, x: -100 },
      "slide-right": { opacity: 0, x: 100 },
      scale: { opacity: 0, scale: 0.8 },
    };

    const endState = {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      duration,
      delay,
      ease: "power3.out",
    };

    gsap.set(element, animations[animation]);

    const tween = gsap.to(element, {
      ...endState,
      scrollTrigger: {
        trigger: element,
        start: `top ${100 - threshold * 100}%`,
        toggleActions: "play none none reverse",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [animation, delay, duration, threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// Horizontal scroll section
interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
}

export function HorizontalScroll({
  children,
  className = "",
}: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const scrollContent = scrollRef.current;
    if (!container || !scrollContent) return;

    const scrollWidth = scrollContent.scrollWidth;
    const viewportWidth = container.offsetWidth;

    const tween = gsap.to(scrollContent, {
      x: -(scrollWidth - viewportWidth),
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${scrollWidth - viewportWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div ref={scrollRef} className="flex">
        {children}
      </div>
    </div>
  );
}

// Stagger children animation
interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  animation?: "fade" | "slide-up" | "slide-left";
}

export function StaggerReveal({
  children,
  className = "",
  stagger = 0.1,
  animation = "slide-up",
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const childElements = element.children;

    const animations = {
      fade: { opacity: 0 },
      "slide-up": { opacity: 0, y: 50 },
      "slide-left": { opacity: 0, x: -50 },
    };

    gsap.set(childElements, animations[animation]);

    const tween = gsap.to(childElements, {
      opacity: 1,
      y: 0,
      x: 0,
      duration: 0.8,
      stagger,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [stagger, animation]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// Progress indicator
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const tween = gsap.to(element, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--accent-primary)] origin-left z-[100]"
      style={{ transform: "scaleX(0)" }}
    />
  );
}

// Text reveal character by character
interface CharRevealProps {
  text: string;
  className?: string;
  stagger?: number;
}

export function CharReveal({
  text,
  className = "",
  stagger = 0.02,
}: CharRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const chars = element.querySelectorAll(".char");

    gsap.set(chars, {
      opacity: 0,
      y: 50,
      rotateX: -90,
    });

    const tween = gsap.to(chars, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.8,
      stagger,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [stagger]);

  return (
    <div ref={ref} className={className} style={{ perspective: 1000 }}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="char inline-block"
          style={{ display: char === " " ? "inline" : "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}
