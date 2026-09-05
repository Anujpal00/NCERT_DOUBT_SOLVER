import { useEffect, useMemo, useRef, useState } from 'react';

const AvatarPanel = ({ audioElement }) => {
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);

  const avatarUrl = useMemo(() => '/avatar/avatar-idle.mp4', []);
  const posterUrl = useMemo(() => '/avatar/avatar-idle.png', []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    video.play().catch(() => {});

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  useEffect(() => {
    const audio = audioElement?.current;
    if (!audio || typeof window === 'undefined') return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const audioContext = new AudioContextClass();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    const tick = () => {
      analyser.getByteTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i += 1) {
        const value = (dataArray[i] - 128) / 128;
        sum += Math.abs(value);
      }
      const average = sum / dataArray.length;
      const speaking = average > 0.06;
      setIsSpeaking(speaking);
      setMouthOpen(speaking);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
      audioContextRef.current = null;
    };
  }, [audioElement]);

  return (
    <div className="rounded-[2rem] border border-orange-200/80 bg-white/90 p-4 shadow-2xl shadow-orange-100">
      <div className={`relative overflow-hidden rounded-[1.5rem] border border-orange-200/80 bg-slate-900 transition-all duration-300 ${isSpeaking ? 'ring-4 ring-orange-300/60' : ''}`}>
        <video
          ref={videoRef}
          src={avatarUrl}
          poster={posterUrl}
          className="h-[320px] w-full object-cover"
        />
        <div className={`absolute inset-0 transition-opacity duration-200 ${mouthOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute bottom-[30%] left-1/2 h-16 w-24 -translate-x-1/2 rounded-full bg-orange-300/60 blur-2xl" />
          <div className="absolute bottom-[36%] left-1/2 h-20 w-28 -translate-x-1/2 rounded-[40%] border border-white/70 bg-orange-200/70" />
        </div>
        <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-orange-700">
          {isSpeaking ? 'Speaking now' : 'Listening'}
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-600">A simple in-browser lip-sync loop reads the spoken answer audio and opens the avatar mouth when the sound rises above a small threshold.</p>
    </div>
  );
};

export default AvatarPanel;
