import { useRef, useEffect, useState } from 'react';

export function useLongPress(callback: () => void, delay: number = 2000) {
  const timerRef = useRef<number | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    timerRef.current = window.setTimeout(() => {
      callback();
      timerRef.current = null;
    }, delay);
  };

  const handleMouseUp = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };
  
  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.addEventListener('mousedown', handleMouseDown);
      elementRef.current.addEventListener('mouseup', handleMouseUp);
      elementRef.current.addEventListener('mouseleave', handleMouseUp);
    }
    return () => {
      if (elementRef.current) {
        elementRef.current.removeEventListener('mousedown', handleMouseDown);
        elementRef.current.removeEventListener('mouseup', handleMouseUp);
        elementRef.current.removeEventListener('mouseleave', handleMouseUp);
      }
    }
  }, [])

  return elementRef;
}

export function useAudioRecorder() {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioURL = useRef<string | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('ブラウザーは録音をサポートしていません。');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event: BlobEvent) => {
        audioChunks.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/mp3' });
        audioURL.current = window.URL.createObjectURL(blob);
        audio.current = new Audio(audioURL.current!);
        audioChunks.current = [];
      };

      recorder.start();
      setMediaRecorder(recorder);
    } catch (err) {
      console.error('マイクにアクセスできません', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
    }
  };

  const playRecording = () => {
    if (audio.current) {
      audio.current.play();
    }
  };

  useEffect(() => {
    return () => {
      if (audioURL.current) {
        window.URL.revokeObjectURL(audioURL.current);
      }
    };
  }, []);

  return { startRecording, stopRecording, playRecording };
}