'use client';
import SectionTitle from '@/components/SectionTitle';
import { PROJECTS } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React, { useRef, useState, MouseEvent } from 'react';
import Project from './Project';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ProjectList = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const projectListRef = useRef<HTMLDivElement>(null);
    const imageContainer = useRef<HTMLDivElement>(null);
    const [selectedProject, setSelectedProject] = useState<string | null>(
        PROJECTS[0].slug,
    );

    // update imageRef.current href based on the cursor hover position
    // also update image position
    useGSAP(
        (context, contextSafe) => {
            // show image on hover
            if (window.innerWidth < 768) {
                setSelectedProject(null);
                return;
            }

            const handleMouseMove = contextSafe?.((e: MouseEvent) => {
                if (!containerRef.current) return;
                if (!imageContainer.current) return;

                if (window.innerWidth < 768) {
                    setSelectedProject(null);
                    return;
                }

                const containerRect =
                    containerRef.current?.getBoundingClientRect();
                const imageRect =
                    imageContainer.current.getBoundingClientRect();
                const offsetTop = e.clientY - containerRect.y;

                // if cursor is outside the container, hide the image
                if (
                    containerRect.y > e.clientY ||
                    containerRect.bottom < e.clientY ||
                    containerRect.x > e.clientX ||
                    containerRect.right < e.clientX
                ) {
                    return gsap.to(imageContainer.current, {
                        duration: 0.3,
                        opacity: 0,
                    });
                }

                gsap.to(imageContainer.current, {
                    y: offsetTop - imageRect.height / 2,
                    duration: 1,
                    opacity: 1,
                });
            }) as any;

            window.addEventListener('mousemove', handleMouseMove);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
            };
        },
        { scope: containerRef, dependencies: [containerRef.current] },
    );

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'top 80%',
                    toggleActions: 'restart none none reverse',
                    scrub: 1,
                },
            });

            tl.from(containerRef.current, {
                y: 150,
                opacity: 0,
            });
        },
        { scope: containerRef },
    );

    const handleMouseEnter = (slug: string) => {
        if (window.innerWidth < 768) {
            setSelectedProject(null);
            return;
        }

        setSelectedProject(slug);
    };

    return (
        <section className="pb-section" id="selected-projects">
            <div className="container">
                <SectionTitle title="SELECTED PROJECTS" />

                <div className="group/projects relative" ref={containerRef}>
                    {selectedProject !== null && (
                        <div
                            className="max-md:hidden absolute right-0 top-0 z-[1] pointer-events-none w-[200px] xl:w-[350px] aspect-[3/4] overflow-hidden opacity-0"
                            ref={imageContainer}
                        >
                            {PROJECTS.map((project, idx) => (
                                <div
                                    key={project.slug}
                                    className={cn(
                                        'absolute inset-0 transition-all duration-500 w-full h-full',
                                        'bg-gradient-to-br from-zinc-900/95 via-zinc-800/95 to-zinc-900/95',
                                        'backdrop-blur-2xl border border-white/10',
                                        'rounded-lg p-6 flex flex-col justify-between',
                                        {
                                            'opacity-0':
                                                project.slug !==
                                                selectedProject,
                                        },
                                    )}
                                >
                                    {/* Accent line */}
                                    <div 
                                        className="absolute top-0 left-0 w-full h-1 rounded-t-lg"
                                        style={{
                                            background: idx % 4 === 0 
                                                ? 'linear-gradient(90deg, hsl(140, 100%, 47%), hsl(193, 100%, 47%))'
                                                : idx % 4 === 1
                                                ? 'linear-gradient(90deg, #a855f7, #ec4899)'
                                                : idx % 4 === 2
                                                ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                                                : 'linear-gradient(90deg, #3b82f6, #06b6d4)'
                                        }}
                                    />
                                    
                                    {/* Top section */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs text-white/40 font-mono">PROJECT_{idx + 1}</div>
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 rounded-full bg-red-500/60"></div>
                                                <div className="w-2 h-2 rounded-full bg-yellow-500/60"></div>
                                                <div className="w-2 h-2 rounded-full bg-green-500/60"></div>
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-white font-bold text-lg leading-tight">
                                            {project.title}
                                        </h3>
                                    </div>

                                    {/* Middle section - Tech stack */}
                                    <div className="space-y-2">
                                        <div className="text-xs text-white/40 font-mono mb-2">TECH_STACK:</div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {project.techStack.slice(0, 4).map((tech, i) => (
                                                <span 
                                                    key={i}
                                                    className="text-xs px-2 py-1 rounded bg-white/5 text-white/70 font-mono border border-white/10"
                                                >
                                                    {tech.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bottom section - Stats */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-white/40 font-mono">STATUS:</span>
                                            <span className="text-green-400 font-mono">COMPLETED</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-white/40 font-mono">YEAR:</span>
                                            <span className="text-white/70 font-mono">{project.year}</span>
                                        </div>
                                    </div>

                                    {/* Animated corner glow */}
                                    <div 
                                        className="absolute bottom-0 right-0 w-32 h-32 blur-3xl opacity-20 rounded-full"
                                        style={{
                                            background: idx % 4 === 0 
                                                ? 'hsl(140, 100%, 47%)'
                                                : idx % 4 === 1
                                                ? '#a855f7'
                                                : idx % 4 === 2
                                                ? '#f59e0b'
                                                : '#3b82f6'
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div
                        className="flex flex-col max-md:gap-10"
                        ref={projectListRef}
                    >
                        {PROJECTS.map((project, index) => (
                            <Project
                                index={index}
                                project={project}
                                selectedProject={selectedProject}
                                onMouseEnter={handleMouseEnter}
                                key={project.slug}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectList;
