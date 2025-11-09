import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';

interface AudioPlayerState {
  play: (url: string, options?: { loop?: boolean }) => Promise<void>;
  stop: () => void;
  isPlaying: boolean;
  currentUrl: string | null;
}

const AudioPlayerContext = createContext<AudioPlayerState | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  // This effect handles events that happen outside our direct control,
  // like the audio finishing on its own.
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handlePlaybackEnded = () => {
      // When the audio finishes by itself, update the state.
      setIsPlaying(false);
      setCurrentUrl(null);
    };
    
    audio.addEventListener('ended', handlePlaybackEnded);
    
    return () => {
      audio.removeEventListener('ended', handlePlaybackEnded);
      audio.pause(); // Clean up on unmount
      audioRef.current = null;
    };
  }, []);

  const play = useCallback(async (url: string, options: { loop?: boolean } = {}) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    // Stop any currently playing audio before starting a new one.
    if (!audio.paused) {
      audio.pause();
    }
    
    try {
      // Always re-assign src to handle retries of failed loads.
      audio.src = url;
      audio.loop = options.loop || false;
      audio.currentTime = 0; // Ensure playback starts from the beginning.
      
      await audio.play();
      
      // If play() is successful, update our state.
      setCurrentUrl(url);
      setIsPlaying(true);
    } catch (error) {
      console.error("Audio playback failed", error);
      // If play() fails, ensure our state is reset.
      setCurrentUrl(null);
      setIsPlaying(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    // Always reset state when stop is called, regardless of the audio element's state.
    setIsPlaying(false);
    setCurrentUrl(null);
  }, []);

  return (
    <AudioPlayerContext.Provider value={{ play, stop, isPlaying, currentUrl }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = (): AudioPlayerState => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};