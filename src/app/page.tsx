"use client"
import { useState, useEffect } from 'react';
import GradualSpacing from '@/components/magicui/gradual-spacing';
import MatterScene from './components/MatterCanvas';
import AnimatedShinyText from '@/components/magicui/animated-shiny-text';
import { cn } from "@/lib/utils";
import ShinyButton from '@/components/magicui/shiny-button';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500); // 0.5 seconds delay

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  return (
    <main className=''>
      <div className="absolute bh-back inset-0 h-screen w-full "><MatterScene /></div>
      <div className=" flex flex-col justify-center h-screen items-center">
        <div className={`z-10 flex items-center justify-center fade-in ${isVisible ? 'show' : ''}`}>
          <div
            className={cn(
              "group rounded-full border sm:text-base text-sm text-white transition-all ClashDisplay-Regular ease-in hover:cursor-pointer border-white/5 bg-neutral-900 hover:bg-neutral-800 mb-3",
            )}
          >
            <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:duration-300 hover:text-neutral-400 ">
              <span>✨ Introducing to Pantry Tracker</span>
            </AnimatedShinyText>
          </div>
        </div>
        <GradualSpacing
          className={`text-center ClashDisplay-Semibold md:text-4xl text-lg font-bold tracking-[-0.1em] text-white w-fit fade-in ${isVisible ? 'show' : ''}`}
          text="Effortlessly Manage Pantry "
        />
        <GradualSpacing
          className={`text-center ClashDisplay-Semibold md:text-4xl text-lg  text-[#5e8582]  font-bold tracking-[-0.1em] fade-in ${isVisible ? 'show' : ''}`}
          text="with my Smart Tracker"
        />
        <GradualSpacing
          className={`text-center ClashDisplay-Regular text-[#5e8582] md:text-lg text-xs  tracking-[-0.2em] fade-in ${isVisible ? 'show' : ''}`}
          text="Take control of your kitchen"
        />
        <a href='/dashboard' className={`flex mt-3 justify-center fade-in ${isVisible ? 'show' : ''}`}>
          <ShinyButton text="Let's Track Now" className="ClashDisplay-Medium uppercase md:text-lg text-sm" />
        </a>
      </div>
    </main>
  );
}
