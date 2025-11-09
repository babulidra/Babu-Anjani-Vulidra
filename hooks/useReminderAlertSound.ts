import { useEffect } from 'react';
import { Reminder } from '../types';
import { useAudioPlayer } from './useAudioPlayer';

export const useReminderAlertSound = (dueReminder: Reminder | null, ringtoneUrl: string, hasInteracted: boolean) => {
  const { play, stop, currentUrl } = useAudioPlayer();

  useEffect(() => {
    const isAlertSoundPlaying = currentUrl === ringtoneUrl && dueReminder;

    if (dueReminder && ringtoneUrl !== 'NONE' && hasInteracted) {
      // Only start playing if it's not already playing this sound.
      // This prevents re-triggering on re-renders.
      if (currentUrl !== ringtoneUrl) {
         play(ringtoneUrl, { loop: true });
      }
    } else {
      // Stop the sound if the reminder is dismissed or interaction hasn't happened.
      // We only stop it if it was the alert sound that was playing.
      if (isAlertSoundPlaying) {
        stop();
      }
    }
    
    // Cleanup function is important if the component unmounts while sound is playing.
    return () => {
      if (isAlertSoundPlaying) {
        stop();
      }
    };
  }, [dueReminder, ringtoneUrl, hasInteracted, play, stop, currentUrl]);
};