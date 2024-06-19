import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";

const YotTubePlayer = ({ videoUrl, onVideoEnd }) => {
  // const onVideoEnd = () => {
  //   toast.success("Congratulations!!! You've completed the lesson", {
  //     position: "bottom-center",
  //   });
  // };

  const playerRef = useRef(null);

  useEffect(() => {
    const loadYouTubeIframeAPI = () => {
      return new Promise((resolve) => {
        const existingScript = document.getElementById("youtube-iframe-api");
        if (existingScript) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.id = "youtube-iframe-api";
        script.onload = resolve;
        document.body.appendChild(script);
      });
    };

    // Initialize the YouTube player
    const initializePlayer = () => {
      const videoId = extractVideoId(videoUrl);
      if (!videoId) {
        console.error("Invalid YouTube URL");
        return;
      }

      new window.YT.Player(playerRef.current, {
        videoId,
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              onVideoEnd();
            }
          },
        },
      });
    };

    // Extract the video ID from the YouTube URL
    const extractVideoId = (url) => {
      const match = url.match(
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      );
      return match ? match[1] : null;
    };

    loadYouTubeIframeAPI().then(() => {
      if (window.YT && window.YT.Player) {
        initializePlayer();
      } else {
        window.onYouTubeIframeAPIReady = initializePlayer;
      }
    });

    // Cleanup function to destroy the player
    return () => {
      if (window.YT && playerRef.current) {
        const player = window.YT.get(playerRef.current);
        if (player) {
          player.destroy();
        }
      }
    };
  }, [videoUrl, onVideoEnd]);

  return <div ref={playerRef} className="course_module_video"></div>;
};

export default YotTubePlayer;
