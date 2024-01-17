"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { assets } from "@/utils/asset-utils";
import { type Framework, frameworks } from "@/utils/framework-utils";
import { cn } from "@/utils/tailwind-utils";
import { Poppins } from "next/font/google";
import LandingPage from "@components/landingpage";
import Player from "@components/player";
import Tracks from "@components/tracks";
import { Track } from "./types/types";

const poppins = Poppins({
  weight: "700",
  subsets: ["latin"],
});

export default function Home() {
  const [currentFramework, setCurrentFramework] = useState<Framework>(
    frameworks[0]
  );
  const [showBackground, setShowBackground] = useState<boolean>(false);
  const [recordingResults, setRecordingResults] = useState<Track[] | null>(null);
  const [track, setTrackDetails] = useState<Track[] | null>(null);
  const [displaySearch, setDisplaySearch] = useState<boolean>(true);

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session === null) {
      router.push('/login');
    }
    console.log(session)
  }, [session, router]);

  useEffect(() => {
    let currentIndex = 0;
    const rotateFrameworks = () => {
      setCurrentFramework(frameworks[currentIndex]);
      currentIndex = (currentIndex + 1) % frameworks.length;
    };
    const intervalId = setInterval(rotateFrameworks, 2000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setShowBackground(true);
  }, []);

  const handleSearch = (results: Track[]) => {
    setRecordingResults(results);
    setDisplaySearch(false)
  };

  const handleTrackDetails = (details: Track[]) => {
    setTrackDetails(details);
  };

  const handleDisplaySearch = (value: boolean) => {
    setDisplaySearch(value)
  };

  return (
    <main>
      {/* Background color */}
      <div
        className={cn(
          "fixed inset-0 transition-color delay-100 duration-700 opacity-20",
          {
            "bg-purple-300": currentFramework === "qwik",
            "bg-sky-300": currentFramework === "safari",
            "bg-yellow-300": currentFramework === "chrome",
            "bg-teal-300": currentFramework === "tailwind",
            "bg-blue-300": currentFramework === "react",
            "bg-green-300": currentFramework === "vue",
            "bg-orange-400": currentFramework === "svelte",
            "bg-red-300": currentFramework === "mobile",
            "bg-neutral-300": currentFramework === "desktop",
          }
        )}
      />
      {/* Grid */}
      <div
        style={{
          backgroundSize: "30px",
          backgroundImage: `url(${assets.square})`,
        }}
        className="fixed inset-0 opacity-30"
      />
      {/* Gradient */}
      <Image
        width={1200}
        height={1200}
        role="presentation"
        alt="gradient background"
        className="fixed inset-0 w-screen h-screen object-cover"
        src={assets.gradient}
      />
      {/* Reveal */}
      <div
        className={cn(
          "bg-black fixed inset-0 transition-opacity duration-1000",
          !showBackground ? "opacity-100" : "opacity-0"
        )}
      />
      <div className={`absolute ${recordingResults && !displaySearch ? 'top-[15%] h-3/4' : 'top-[35%] '} w-full`}>
        {recordingResults && !displaySearch ?
          (
            <Tracks results={recordingResults} onTrackDetails={handleTrackDetails} ondisplaySearch={handleDisplaySearch} />
          )
          :
          (
            <LandingPage onRecordingComplete={handleSearch} />
          )
        }
      </div>

      <div className="fixed bottom-0 left-0 right-0">
        <Player songs={track} />
      </div>
    </main>
  );
}