import React, { useEffect, useRef } from "react";

const NeuralNetworkBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);
        let particles: Particle[] = [];
        let pixels: Pixel[] = [];
        const particleCount = 100;
        const pixelCount = 40;
        const connectionDistance = 150;
        const mouse = { x: -1000, y: -1000 };

        // Helper to get RGB values from CSS variables
        const getThemeColors = () => {
            const style = getComputedStyle(document.documentElement);
            return [
                style.getPropertyValue('--particle-1').trim() || '37, 99, 235', // Default Blue/Cyan
                style.getPropertyValue('--particle-2').trim() || '219, 39, 119', // Default Pink/Magenta
                style.getPropertyValue('--particle-3').trim() || '5, 150, 105'   // Default Emerald/Neon Green
            ];
        };

        let colors = getThemeColors();

        class Pixel {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;
            alpha: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5; // Slower movement
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 15 + 5; // Larger squares
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.alpha = Math.random() * 0.3 + 0.1; // Lower opacity
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
                ctx.fillRect(this.x, this.y, this.size, this.size);
            }
        }

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.size = Math.random() * 2 + 1;
                // Assign one of the 3 colors randomly
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse repulsion
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 200) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (200 - distance) / 200;
                    const repulsionStrength = 2;
                    this.vx -= forceDirectionX * force * repulsionStrength;
                    this.vy -= forceDirectionY * force * repulsionStrength;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, 0.7)`;
                ctx.fill();
            }
        }

        const init = () => {
            colors = getThemeColors(); // Update colors on init (e.g., theme change)
            particles = [];
            pixels = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
            for (let i = 0; i < pixelCount; i++) {
                pixels.push(new Pixel());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        // Use the color of the starting particle for the line
                        ctx.strokeStyle = `rgba(${particles[i].color}, ${1 - distance / connectionDistance})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            particles.forEach((p) => {
                p.update();
                p.draw();
            });

            // Draw Pixels (Overlay)
            pixels.forEach((p) => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            init();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        // Observer to detect theme changes on <html> element
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "attributes" && (mutation.attributeName === "data-theme" || mutation.attributeName === "class")) {
                    init(); // Re-initialize particles to pick up new theme colors
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme', 'class']
        });

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);

        init();
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            observer.disconnect();
        };
    }, []);

    return (
        <>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0 pointer-events-none"
            />
            {/* Decorative Orbs for extra depth */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse delay-1000 pointer-events-none"></div>
        </>
    );
};

export default NeuralNetworkBackground;
