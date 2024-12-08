import { useEffect, useRef, useState } from "react";

// 録音開始関数、停止関数と再生関数をエクスポートする
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
                if (audioURL.current) {
                    window.URL.revokeObjectURL(audioURL.current);
                }
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