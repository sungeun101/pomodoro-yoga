"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShuffle } from "@fortawesome/free-solid-svg-icons";

export default function VideoShuffleDial({
  getBreakVideos,
  resetTimer,
}: {
  getBreakVideos: () => void;
  resetTimer: () => void;
}) {
  return (
    <button
      onClick={getBreakVideos}
      className="bg-white text-[#EF4168] rounded-full w-12 h-12 hover:bg-white drop-shadow-lg absolute bottom-1.5 right-0.5 hover:scale-105 transition-all duration-300 cursor-pointer"
    >
      <FontAwesomeIcon icon={faShuffle} size={"lg"} />
    </button>
  );
}
