"use client";

import React, { useEffect, useState, useRef } from "react";
import { FaPause, FaPlay, FaShuffle, FaHeart } from "react-icons/fa6";
import { RiRepeatOneFill } from "react-icons/ri";
import { IoIosSkipForward, IoIosSkipBackward } from "react-icons/io";
import { IoVolumeMedium } from "react-icons/io5";
import { Track } from "../types/types";
import Image from "next/image";

import '../globals.css';

interface SongProps {
  songs: Track[] | null;
}

const Player: React.FC<SongProps> = ({ songs }) => {

  const [isPlaying, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentVolume, setCurrentVolume] = useState(0);

  const player = useRef<HTMLAudioElement>(null);
  const progressBar = useRef<HTMLInputElement>(null);
  const animationRef = useRef<number | null>(null);
  const volumeBar = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const seconds = Math.floor(player?.current!?.duration);
    setDuration(seconds);

    progressBar.current!.max = String(seconds);

    player.current!.volume = currentVolume / 100;

  }, [player?.current?.onloadedmetadata, player?.current?.readyState, currentVolume]);

  const time = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const minutes_lapse = minutes < 10 ? `0${minutes}` : `${minutes}`;

    const seconds = Math.floor(secs % 60);
    const seconds_lapse = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${minutes_lapse}:${seconds_lapse}`;
  };

  const togglePlay = () => {
    const prevValue = isPlaying;
    setPlaying(!prevValue);

    if (!prevValue) {
      player.current?.play();
      animationRef.current = requestAnimationFrame(whilePlaying)
    } else {
      player.current?.pause();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  };

  const whilePlaying = () => {
    progressBar.current!.value = String(player.current!.currentTime);
    progressBar.current!.style.setProperty('--seek-before-width', `${Number(progressBar.current!.value) / duration * 100}%`);
    setCurrentTime(Number(progressBar.current!.value))
    animationRef.current = requestAnimationFrame(whilePlaying)
  };

  const changeRange = () => {
    player.current!.currentTime = Number(progressBar.current!.value);
    progressBar.current!.style.setProperty('--seek-before-width', `${Number(progressBar.current!.value) / duration * 100}%`);
    setCurrentTime(Number(progressBar.current!.value))
  };

  const volumeRange = () => {
    volumeBar.current!.style.setProperty('--volume-before-width', `${Number(volumeBar.current!.value) / 100 * 100}%`);
    setCurrentVolume(Number(volumeBar.current!.value))
    if (player.current) {
      player.current.volume = Number(volumeBar.current!.value) / 100
    }
  };

  return (
    <div className="bg-[#1b1b1b] min-h-[10vh] w-full flex items-center justify-center">
      <audio ref={player} src="song.mp3" preload="metadata" ></audio>
      <div className="flex items-center justify-between w-full px-5">
        <div className="flex items-center">
          <div>
            {songs && songs[0]?.album && songs[0].album.images && songs[0].album.images[0] && songs[0].album.images[0].url &&
              <Image src={songs[0].album.images[0].url} alt="track-img" width={60} height={60} className="rounded-md"></Image>
            }
          </div>
          <div className="px-4">
            <h5 className="font-semibold tracking-wide font-sans">Up All Night</h5>
            <p className="text-gray-300 font-normal text-sm font-sans">Khalid</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-between w-48">
            <i className="cursor-pointer">
              <FaShuffle fontSize={20} />
            </i>
            <i className="cursor-pointer">
              <IoIosSkipBackward fontSize={20} />
            </i>
            <i onClick={togglePlay} className="cursor-pointer p-2 bg-white text-black rounded-full flex justify-center items-center">
              {isPlaying ?
                <FaPause fontSize={20} />
                :
                <FaPlay fontSize={20} />
              }
            </i>
            <i className="cursor-pointer">
              <IoIosSkipForward fontSize={20} />
            </i>
            <i className="cursor-pointer">
              <RiRepeatOneFill fontSize={20} />
            </i>
          </div>

          <div className="flex items-center pt-2 w-[600px]">
            <div className="font-Akshar font-semibold text-xs text-[#FF373D] tracking-wider mr-5">{time(currentTime)}</div>
            <input type="range"
              className="seek-slider"
              defaultValue="0"
              ref={progressBar}
              onChange={changeRange}
            />
            <div className="font-Akshar font-semibold text-xs tracking-wider ml-5">{(duration && !isNaN(duration)) && time(duration)}</div>
          </div>
        </div>

        <div className="flex items-center w-[200px]">
          <i className="pr-2">
            <IoVolumeMedium />
          </i>
          <input type="range"
            min="0"
            max="100"
            value={currentVolume}
            className="volume-slider"
            ref={volumeBar}
            onChange={volumeRange}
          />
        </div>
      </div>
    </div>
  )
}

export default Player;