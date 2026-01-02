import { useState, useRef, useEffect } from 'react';
import { Pause, Play, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

const Editorial = ({ secureUrl, duration }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoDuration, setVideoDuration] = useState(duration || 0);

  // If no video URL, show no editorial message
  if (!secureUrl) {
    return (
      <div className="w-full max-w-4xl mx-auto my-8">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-12 text-center border border-gray-700 shadow-2xl">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-gray-700 rounded-full flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-gray-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No Editorial Available</h3>
          <p className="text-gray-400 text-lg">
            The video editorial for this problem hasn't been uploaded yet.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Check back later or try solving the problem on your own!
          </p>
        </div>
      </div>
    );
  }

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Update current time during playback
  useEffect(() => {
    const video = videoRef.current;

    const handleTimeUpdate = () => {
      if (video) setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (video) setVideoDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('ended', handleEnded);
      
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto my-8">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-2 h-8 bg-primary rounded-full"></div>
          Video Editorial
        </h2>
        
        <div
          ref={containerRef}
          className="relative w-full rounded-xl overflow-hidden shadow-2xl bg-black group"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Video Element */}
          <video
            ref={videoRef}
            src={secureUrl}
            onClick={togglePlayPause}
            className="w-full aspect-video bg-black cursor-pointer"
          />

          {/* Play/Pause Overlay (center) */}
          <div
            className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
              isHovering && !isPlaying ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              onClick={togglePlayPause}
              className="btn btn-circle btn-primary btn-lg pointer-events-auto transform hover:scale-110 transition-transform shadow-2xl"
              aria-label="Play"
            >
              <Play className="w-8 h-8" />
            </button>
          </div>

          {/* Video Controls Overlay */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 transition-all duration-300 ${
              isHovering || !isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            {/* Progress Bar */}
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max={videoDuration}
                value={currentTime}
                onChange={(e) => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = Number(e.target.value);
                  }
                }}
                className="range range-primary range-xs w-full cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(var(--p)) ${(currentTime / videoDuration) * 100}%, rgb(75 85 99) ${(currentTime / videoDuration) * 100}%)`
                }}
              />
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              {/* Left Controls */}
              <div className="flex items-center gap-3">
                {/* Play/Pause Button */}
                <button
                  onClick={togglePlayPause}
                  className="btn btn-circle btn-sm btn-ghost hover:bg-white/20 text-white"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>

                {/* Volume Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="btn btn-circle btn-sm btn-ghost hover:bg-white/20 text-white"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="range range-primary range-xs w-20"
                  />
                </div>

                {/* Time Display */}
                <span className="text-white text-sm font-medium">
                  {formatTime(currentTime)} / {formatTime(videoDuration)}
                </span>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2">
                {/* Fullscreen Button */}
                <button
                  onClick={toggleFullscreen}
                  className="btn btn-circle btn-sm btn-ghost hover:bg-white/20 text-white"
                  aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                >
                  {isFullscreen ? (
                    <Minimize className="w-5 h-5" />
                  ) : (
                    <Maximize className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Info */}
        <div className="mt-4 flex items-center justify-between text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <div className="badge badge-primary badge-sm">Duration: {formatTime(videoDuration)}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs">Press Space to play/pause</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editorial;