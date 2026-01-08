export interface YouTubePlayer {
  setLoop: (loop: boolean) => void;
  setLoopVideo: (loop: boolean) => void;
  setPlaybackQualityRange: (resolution: string) => Promise<void>;
  playVideo: () => void;
  pauseVideo: () => void;

  getVideoData: () => {
    video_id: string;
    title: string;
    author: string;
    isLive?: boolean;
  };

  getPlaylist: () => string[];
  getPlaylistIndex: () => number;

  addEventListener: (event: string, listener: (...args: any[]) => void) => void;

  removeEventListener: (
    event: string,
    listener: (...args: any[]) => void,
  ) => void;

  [key: string]: any;
}
