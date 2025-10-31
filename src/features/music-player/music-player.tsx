import { useEffect, useRef } from 'react';

export interface MusicPlayerProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ isMuted, onToggleMute }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (!isMuted && audio.paused) {
        audio.play().catch(error => {
          // Autoplay was prevented. User needs to interact first.
          console.log("Autoplay was prevented. Waiting for user interaction.");
        });
      }
      audio.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <audio ref={audioRef} id="background-music" src="/music/background-music.mp3" loop />
  );
};

export default MusicPlayer;
