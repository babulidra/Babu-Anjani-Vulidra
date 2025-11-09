import { useCallback } from 'react';
import { useAudioPlayer } from './useAudioPlayer';

export const useRingtonePlayer = () => {
  const { play, stop, currentUrl, isPlaying } = useAudioPlayer();

  const playRingtone = useCallback((url: string) => {
    play(url, { loop: false });
  }, [play]);

  const stopRingtone = useCallback(() => {
    stop();
  }, [stop]);

  const isPlayingUrl = useCallback((url: string) => {
    return isPlaying && currentUrl === url;
  }, [isPlaying, currentUrl]);

  return { playRingtone, stopRingtone, isPlayingUrl };
};