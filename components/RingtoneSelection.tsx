import React, { useRef, useState } from 'react';
import { Ringtone } from '../types';
import { useRingtonePlayer } from '../hooks/useRingtonePlayer';
import { PlayIcon } from './icons/PlayIcon';
import { UploadIcon } from './icons/UploadIcon';
import { DeleteIcon } from './icons/DeleteIcon';

interface RingtoneSelectionProps {
  ringtones: Ringtone[];
  customRingtones: Ringtone[];
  selectedRingtone: string;
  onRingtoneChange: (url: string) => void;
  onAddCustom: (ringtone: Ringtone) => void;
  onRemoveCustom: (url: string) => void;
}

const MAX_FILE_SIZE_MB = 1;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const RingtoneSelection: React.FC<RingtoneSelectionProps> = ({ ringtones, customRingtones, selectedRingtone, onRingtoneChange, onAddCustom, onRemoveCustom }) => {
  const { playRingtone, stopRingtone, isPlayingUrl } = useRingtonePlayer();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const defaultRingtones = ringtones.filter(r => !customRingtones.some(cr => cr.url === r.url));

  const handlePlayToggle = (url: string) => {
    if (isPlayingUrl(url)) {
      stopRingtone();
    } else {
      playRingtone(url);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setUploadError(`File too large. Max size: ${MAX_FILE_SIZE_MB}MB`);
        return;
      }
      if (!file.type.startsWith('audio/')) {
        setUploadError('Please select a valid audio file.');
        return;
      }
      
      setUploadError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const newRingtone: Ringtone = {
          name: file.name,
          url: url,
        };
        onAddCustom(newRingtone);
      };
      reader.readAsDataURL(file);
    }
    if (event.target) {
        event.target.value = '';
    }
  };
  
  const RingtoneItem: React.FC<{ ringtone: Ringtone, isCustom?: boolean }> = ({ ringtone, isCustom = false }) => (
     <div key={ringtone.url} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 group">
        <label className="flex items-center gap-3 cursor-pointer flex-grow truncate">
          <input
            type="radio"
            name="ringtone"
            value={ringtone.url}
            checked={selectedRingtone === ringtone.url}
            onChange={() => onRingtoneChange(ringtone.url)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
          />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate" title={ringtone.name}>{ringtone.name}</span>
        </label>
        <div className="flex items-center flex-shrink-0">
          {ringtone.url !== 'NONE' && (
              <button
              type="button"
              onClick={() => handlePlayToggle(ringtone.url)}
              className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600"
              aria-label={isPlayingUrl(ringtone.url) ? 'Pause' : 'Play'}
              >
                  <PlayIcon className="w-5 h-5" isPlaying={isPlayingUrl(ringtone.url)} />
              </button>
          )}
          {isCustom && (
               <button
              type="button"
              onClick={() => onRemoveCustom(ringtone.url)}
              className="p-1 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/50 dark:hover:text-danger-dark opacity-0 group-hover:opacity-100 transition-opacity ml-1"
              aria-label={`Remove ${ringtone.name}`}
              >
                  <DeleteIcon className="w-5 h-5" />
              </button>
          )}
        </div>
      </div>
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ringtone</label>
      <div className="space-y-1 max-h-48 overflow-y-auto pr-2 border rounded-md dark:border-gray-600 p-1">
        {defaultRingtones.map((ringtone) => <RingtoneItem key={ringtone.url} ringtone={ringtone} />)}
        
        {customRingtones.length > 0 && (
            <>
                <div className="pt-2 pb-1 px-2">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Custom</p>
                </div>
                {customRingtones.map((ringtone) => <RingtoneItem key={ringtone.url} ringtone={ringtone} isCustom />)}
            </>
        )}
      </div>
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="audio/*"
        className="hidden"
      />
      <button
        type="button"
        onClick={handleUploadClick}
        className="w-full mt-2 px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        <UploadIcon className="w-5 h-5" />
        Add Custom Ringtone
      </button>
      {uploadError && <p className="text-sm text-red-600 dark:text-danger-dark mt-1">{uploadError}</p>}
    </div>
  );
};
