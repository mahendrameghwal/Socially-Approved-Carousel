import { useState, useRef, useEffect, useCallback } from 'react';
import { viewVideo } from '../services/api';

/**
 * Manages all state and control functions for a single <video> element.
 *
 * @param {string} videoId - ID of the video (for view tracking)
 * @returns {{
 *   videoRef: React.RefObject,
 *   isPlaying: boolean,
 *   isMuted: boolean,
 *   isBuffering: boolean,
 *   currentTime: number,
 *   duration: number,
 *   progress: number,
 *   play: Function,
 *   pause: Function,
 *   togglePlay: Function,
 *   toggleMute: Function,
 *   seek: Function,
 * }}
 */
export function useVideoPlayer(videoId) {
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // progress 0–100
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Track whether view has been counted
  const viewTracked = useRef(false);

  const play = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.play().catch(() => {
      // Autoplay blocked — stay paused, user will click play
    });
  }, []);

  const pause = useCallback(() => {
    videoRef.current?.pause();
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const toggleMute = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setIsMuted(el.muted);
  }, []);

  const seek = useCallback((time) => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = Math.max(0, Math.min(time, el.duration || 0));
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const onPlay       = () => setIsPlaying(true);
    const onPause      = () => setIsPlaying(false);
    const onEnded      = () => setIsPlaying(false);
    const onWaiting    = () => setIsBuffering(true);
    const onCanPlay    = () => setIsBuffering(false);
    const onTimeUpdate = () => setCurrentTime(el.currentTime);
    const onDurationChange = () => setDuration(el.duration || 0);
    const onVolumeChange   = () => setIsMuted(el.muted);

    // Track first play as a view
    const onPlayOnce = () => {
      if (!viewTracked.current && videoId) {
        viewTracked.current = true;
        viewVideo(videoId).catch(() => {});
      }
    };

    el.addEventListener('play',           onPlay);
    el.addEventListener('play',           onPlayOnce);
    el.addEventListener('pause',          onPause);
    el.addEventListener('ended',          onEnded);
    el.addEventListener('waiting',        onWaiting);
    el.addEventListener('canplay',        onCanPlay);
    el.addEventListener('timeupdate',     onTimeUpdate);
    el.addEventListener('durationchange', onDurationChange);
    el.addEventListener('volumechange',   onVolumeChange);

    return () => {
      el.removeEventListener('play',           onPlay);
      el.removeEventListener('play',           onPlayOnce);
      el.removeEventListener('pause',          onPause);
      el.removeEventListener('ended',          onEnded);
      el.removeEventListener('waiting',        onWaiting);
      el.removeEventListener('canplay',        onCanPlay);
      el.removeEventListener('timeupdate',     onTimeUpdate);
      el.removeEventListener('durationchange', onDurationChange);
      el.removeEventListener('volumechange',   onVolumeChange);
    };
  }, [videoId]);

  return {
    videoRef,
    isPlaying,
    isMuted,
    isBuffering,
    currentTime,
    duration,
    progress,
    play,
    pause,
    togglePlay,
    toggleMute,
    seek,
  };
}
