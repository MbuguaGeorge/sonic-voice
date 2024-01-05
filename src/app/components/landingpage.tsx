"use client";

import React, { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { customGet } from "@/utils/customfetch";
import { cn } from "@/utils/tailwind-utils";
import { type Framework, frameworks } from "@/utils/framework-utils";
import { FaMicrophone } from "react-icons/fa";
import useSpeechRecognition from "./speechRecognition";
import { Track } from "../types/types";

interface VoiceRecordingComponentProps {
  onRecordingComplete: (results: Track[]) => void;
}

const LandingPage: React.FC<VoiceRecordingComponentProps> = ({ onRecordingComplete }) => {
  const [currentFramework, setCurrentFramework] = useState<Framework>(
    frameworks[0]
  );

  const [isListening, setListening] = useState(false);
  const [speechText, setSpeechText] = useState<string>('');
  const [recordingResults, setRecordingResults] = useState<Track[] | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    let currentIndex = 0;
    const rotateFrameworks = () => {
      setCurrentFramework(frameworks[currentIndex]);
      currentIndex = (currentIndex + 1) % frameworks.length;
    };
    const intervalId = setInterval(rotateFrameworks, 2000);
    return () => clearInterval(intervalId);
  }, []);

  const { startListening, stopListening } = useSpeechRecognition({
    onSpeechRecognition: (text) => {
      setSpeechText(text);
    },
  });

  const handleSearch = async () => {
    try {
      const searchTracks = await customGet(
        `https://api.spotify.com/v1/search?q=${speechText}&market=from_token&type=track&limit=5`,
        session
      );
    
      if (searchTracks.error) {
        console.error('Error response from Spotify API:', searchTracks.error.message);
      } else if (searchTracks.tracks) {
        setRecordingResults(searchTracks.tracks.items);
        onRecordingComplete(searchTracks.tracks.items);
      } else {
        console.error('Unexpected response structure from Spotify API:', searchTracks);
      }
    } catch (error) {
      console.error('Error occurred during Spotify API request:', error);
    }
  }

  useEffect(() => {
    const handleTimeout = async () => {
      setListening(false);
      stopListening();
      handleSearch();
    };

    let timeoutId: NodeJS.Timeout;

    if (isListening) {
      startListening();

      // Stop listening after 10 seconds
      timeoutId = setTimeout(handleTimeout, 5000)
    }

    // return () => {
    //   clearTimeout(timeoutId);
    // };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, stopListening, startListening]);

  if (isListening) {
    console.log(speechText)
  }

  const handleClick = () => {
    setListening(true)
  };

  return (
    <div className="mx-auto">
      <div className={`flex items-baseline justify-center z-10`}>
        <h1 className="text-3xl max-w-3xl text-center leading-snug mr-20">
          {!isListening && "Hi, What would you like to listen to?"}
          {isListening && "Listening..."}
        </h1>
        <div onClick={handleClick} className={cn(`pulse transition-colors duration-200 flex justify-center items-center animate-pulse ${isListening ? 'h-24' : 'h-36'} ${isListening ? 'w-24' : 'w-36'} rounded-full cursor-pointer ${isListening && 'bg-[#5a99d4] animate-pulse'}`, {
            "bg-purple-300": currentFramework === "qwik" && !isListening,
            "bg-sky-300": currentFramework === "safari" && !isListening,
            "bg-yellow-300": currentFramework === "chrome" && !isListening,
            "bg-teal-300": currentFramework === "tailwind" && !isListening,
            "bg-blue-300": currentFramework === "react" && !isListening,
            "bg-green-300": currentFramework === "vue" && !isListening,
            "bg-orange-400": currentFramework === "svelte" && !isListening,
            "bg-red-300": currentFramework === "mobile" && !isListening,
            "bg-neutral-300": currentFramework === "desktop" && !isListening,
        })}>
          {isListening && <div className="h-32 w-32 bg-[#5a99d4] opacity-75 rounded-full absolute animate-ping duration-1000" ></div>}
          {isListening && <div className="h-24 w-24 bg-[#5a99d4] opacity-75 rounded-full absolute animate-ping duration-0-" ></div>}
          <i className="transition-colors duration-0 flex justify-center items-center h-12 w-12 rounded-full">
            <FaMicrophone size={20} />
          </i>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;