import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MusicPlayerProps {
  isPlaying: boolean;
  togglePlay: () => void;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ isPlaying, togglePlay }) => {
  const playerRef = useRef<any>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const containerId = 'youtube-music-player';

  useEffect(() => {
    const initPlayer = () => {
      if (playerRef.current || !window.YT || !window.YT.Player) return;

      playerRef.current = new window.YT.Player(containerId, {
        height: '0',
        width: '0',
        videoId: 'Mss0u20GmBo',
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: 'Mss0u20GmBo', // Required for looping single video
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          disablekb: 1,
        },
        events: {
          onReady: (event: any) => {
            setIsPlayerReady(true);
            if (isPlaying) {
              event.target.playVideo();
            }
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          },
        },
      });
    };

    if (!window.YT) {
      const existingTag = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      if (!existingTag) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
          document.head.appendChild(tag);
        }
      }

      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        initPlayer();
      };
    } else {
      initPlayer();
    }

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
        playerRef.current = null;
        setIsPlayerReady(false);
      }
    };
  }, []);

  useEffect(() => {
    if (playerRef.current && isPlayerReady) {
      try {
        if (isPlaying) {
          playerRef.current.playVideo();
        } else {
          playerRef.current.pauseVideo();
        }
      } catch (error) {
        console.warn('Failed to control YouTube player:', error);
      }
    }
  }, [isPlaying, isPlayerReady]);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          left: '-9999px',
          top: '-9999px',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <div id={containerId} />
      </div>

      <AnimatePresence>
        {isPlaying !== undefined && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-6 right-6 z-50"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow relative cursor-pointer border border-on-primary/10 overflow-hidden"
            >
              {/* Spinning vinyl disk texture */}
              <motion.div
                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={isPlaying ? { duration: 4, repeat: Infinity, ease: 'linear' } : { duration: 0.5 }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.15)_41%,rgba(0,0,0,0.05)_42%,transparent_43%)] opacity-70"
              />

              <span className="material-symbols-outlined text-2xl relative z-10">
                {isPlaying ? 'music_note' : 'music_off'}
              </span>

              {/* Pulsing ring around button when playing */}
              {isPlaying && (
                <span className="absolute inset-0 rounded-full border border-primary animate-ping opacity-75 pointer-events-none" />
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
