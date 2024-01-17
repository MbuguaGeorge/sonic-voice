"use-client"

import React, { useState, useEffect }  from "react";
import { Track } from "../types/types";
import Image from "next/image";
import { FaPlay, FaTimes } from "react-icons/fa";
import { IoMdPause } from "react-icons/io";

interface TrackComponentProps {
  results: Track[];
  onTrackDetails: (details: Track[]) => void;
  ondisplaySearch: (value: boolean) => void;
}

const Tracks: React.FC<TrackComponentProps> = ({results, onTrackDetails, ondisplaySearch}) => {
  const [isPlaying, setPlaying] = useState<boolean[]>(Array(results.length).fill(false));
  const [track, setTrack] = useState<Track[] | null>(null);

  const handleTrackDetails = (track: Track[]) => {
    onTrackDetails(track)
  };

  const togglePlay = (index: number): void => {
    setPlaying((prev) => {
      const prevValue = Array(results.length).fill(false);
      prevValue[index] = !prev[index]
      return prevValue
    });

    const cardClicked: any = results[index]
    handleTrackDetails(cardClicked)
  };

  useEffect(() => {
    setTrack(results)
  }, [results]);

  const closeTrack = () => {
    ondisplaySearch(true)
  };

  return (
    <div className="flex flex-wrap justify-center w-full h-full bg-[#111] p-5">
      <div className="absolute right-5 -top-10">
        <button className=" bg-white text-black border p-1 text-sm rounded-md" onClick={closeTrack}><FaTimes fontSize={20} /></button>
      </div>
      {track?.map((song: any, index: number ) => (
        <div key={index} className="relative w-48 h-72 bg-[#1d1d1d] m-4 rounded-md cursor-pointer hover:bg-[#343434] transition-bg duration-300 group">
          <div className="flex justify-center items-center py-4">
            <Image src={song.album.images[0]?.url} alt="track-img" width={170} height={170} className="rounded-md"></Image>
          </div>
          <div className="px-3">
            <h1 className="font-semibold tracking-wide font-sans">{song.name}</h1>
            <p className="text-gray-300 font-medium text-sm font-sans py-1">{song.artists[0].name}</p>
          </div>
          <div onClick={() => togglePlay(index)} className={`absolute top-32 right-6 rounded-full bg-green-500 p-4 ${isPlaying[index] ? 'opacity-100' : 'opacity-0' } group-hover:opacity-100 transition-opacity duration-300`}>
            <i>
              {isPlaying[index] ?
                <IoMdPause style={{color: 'black'}} fontSize={20} />
                :
                <FaPlay style={{color: 'black'}}/>
              }
            </i>
          </div>
        </div>
      ))}
    </div>
  )
};

export default Tracks;