// src/content-scripts/youtube/features/watch/index.ts (update bagian quality service)
import type {
  YouTubePlayer,
  InitialData,
  InitialPlayerResponse,
  PlayerMicroformatRenderer,
} from "@/content-scripts/youtube/types";
import { storageBridge } from "../../bridge/bridge";
import type { InitialPlayerResponseVideoDetails } from "../../types/videoData";

export const watchFeature = (() => {
  let videoId: string | null = null;
  let ytInitialPlayerResponse: string | null = null;
  let ytInitialData: string | null = null;
  let videoState: number | null = null;
  let player: YouTubePlayer | null = null;
  let quality: string | null;
  let qualityReferenceKey = "quality_reference";

  // Config state
  let autoLoopEnabled = true;
  let autoCaptionEnabled = true;
  let qualityServiceEnabled = true;
  let qualityChangeListener: ((q: string) => void) | null = null;
  let isCaptionActive = false;

  const fetchData = async (url: string) => {
    const res = await fetch(url);
    return res.text();
  };

  const getVideoId = () =>
    new URLSearchParams(new URL(location.href).search).get("v");

  const parseYTData = (html: string) => {
    const initialDataMatch = html.match(/var ytInitialData\s*=\s*(\{.*?\});/);
    const initialPlayerResponseMatch = html.match(
      /var ytInitialPlayerResponse\s*=\s*(\{.*?\});/,
    );

    ytInitialData = initialDataMatch?.[1] ?? null;
    ytInitialPlayerResponse = initialPlayerResponseMatch?.[1] ?? null;

    return {
      ytInitialData,
      ytInitialPlayerResponse,
    };
  };

  const fetchAndLogVideoData = async () => {
    const data = await fetchVideoData(location.href);

    if (data.ytInitialData && data.ytInitialPlayerResponse) {
      try {
        const ytInitialDataObj = JSON.parse(data.ytInitialData) as InitialData;
        const ytInitialPlayerResponseObj: InitialPlayerResponse = JSON.parse(
          data.ytInitialPlayerResponse,
        );

        setVideoState(
          ytInitialPlayerResponseObj.microformat.playerMicroformatRenderer,
          ytInitialPlayerResponseObj.videoDetails,
        );

        const title = ytInitialPlayerResponseObj.videoDetails.title;
        const viewCount = getViewCount(ytInitialDataObj);
        const likeCount =
          ytInitialPlayerResponseObj.microformat.playerMicroformatRenderer
            .likeCount;
        const dateText = getDateText(
          ytInitialDataObj,
          ytInitialPlayerResponseObj,
        );

        console.log("Video Title:", title);
        console.log("View Count:", viewCount);
        console.log("Like Count:", likeCount);
        console.log("Date Text:", dateText);
        console.log("Full InitialData:", ytInitialDataObj);
        console.log("Full InitialPlayerResponse:", ytInitialPlayerResponseObj);
      } catch (err) {
        console.warn("Failed to parse ytInitialData:", err);
      }
    }
  };

  const setVideoState = (
    initialPlayerMicroformat: PlayerMicroformatRenderer,
    initialPlayerVideoDetails: InitialPlayerResponseVideoDetails,
  ) => {
    if (
      initialPlayerMicroformat &&
      initialPlayerMicroformat.liveBroadcastDetails &&
      initialPlayerMicroformat.liveBroadcastDetails.isLiveNow == true
    ) {
      // is live now
      videoState = 3;
    } else if (
      initialPlayerMicroformat &&
      initialPlayerMicroformat.liveBroadcastDetails &&
      initialPlayerMicroformat.liveBroadcastDetails.isLiveNow == false &&
      !initialPlayerVideoDetails.isUpcoming
    ) {
      // was live
      videoState = 2;
    } else if (
      initialPlayerMicroformat &&
      initialPlayerVideoDetails &&
      initialPlayerMicroformat.liveBroadcastDetails &&
      initialPlayerMicroformat.liveBroadcastDetails.isLiveNow == false &&
      initialPlayerVideoDetails.isUpcoming
    ) {
      // upcoming
      videoState = 4;
    } else {
      // not live
      videoState = 1;
    }
  };

  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const getViewCount = (data: InitialData) => {
    console.log("[getViewCount] videoState: ", videoState);
    if (videoState == 4) {
      return data.contents.twoColumnWatchNextResults.results.results.contents[0]?.videoPrimaryInfoRenderer?.viewCount.videoViewCountRenderer.viewCount.runs
        ?.map((r) => r.text)
        .join("");
    } else if (videoState == 3) {
      return data.contents.twoColumnWatchNextResults.results.results.contents[0]?.videoPrimaryInfoRenderer?.viewCount.videoViewCountRenderer.viewCount.runs
        ?.map((r) => r.text)
        .join("");
    } else if (videoState == 2) {
      return data.contents.twoColumnWatchNextResults.results.results.contents[0]
        ?.videoPrimaryInfoRenderer?.viewCount.videoViewCountRenderer.viewCount
        .simpleText;
    } else {
      return data.contents.twoColumnWatchNextResults.results.results.contents[0]
        ?.videoPrimaryInfoRenderer?.viewCount.videoViewCountRenderer.viewCount
        .simpleText;
    }
  };

  const getDateText = (
    ytInitialData: InitialData,
    ytInitialPlayerResponse: InitialPlayerResponse,
  ) => {
    if (videoState == 4) {
      return ytInitialPlayerResponse.playabilityStatus.liveStreamability?.liveStreamabilityRenderer.offlineSlate?.liveStreamOfflineSlateRenderer.mainText.runs
        ?.map((r) => r.text)
        .join("");
    } else if (videoState == 3) {
      return ytInitialData.contents.twoColumnWatchNextResults.results.results
        .contents[0]?.videoPrimaryInfoRenderer?.dateText.simpleText;
    } else if (videoState == 2) {
      return ytInitialData.contents.twoColumnWatchNextResults.results.results
        .contents[0]?.videoPrimaryInfoRenderer?.relativeDateText?.simpleText;
    } else {
      return ytInitialData.contents.twoColumnWatchNextResults.results.results
        .contents[0]?.videoPrimaryInfoRenderer?.relativeDateText?.simpleText;
    }
  };

  const fetchVideoData = async (url: string) => {
    const html = await fetchData(url);
    return parseYTData(html);
  };

  const waitForPlayer = async (): Promise<YouTubePlayer> => {
    if (player) return player;

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        player = document.getElementById(
          "movie_player",
        ) as unknown as YouTubePlayer;
        if (player) {
          clearInterval(interval);
          resolve(player);
        }
      }, 100);
    });
  };

  const initConfig = async () => {
    const config = await storageBridge.get("dropdown_config");
    if (config) {
      autoLoopEnabled = config.autoLoop ?? true;
      qualityServiceEnabled = config.qualityService ?? true;
      autoCaptionEnabled = config.autoCaption ?? true;
    }
  };

  const loopVideo = async (player: YouTubePlayer) => {
    if (!autoLoopEnabled) return;
    return player.setLoopVideo(true);
  };

  const setVideoResolution = async (player: YouTubePlayer, quality: string) => {
    if (!qualityServiceEnabled) return;

    quality = (await storageBridge.get(qualityReferenceKey)) || "hd1080";
    await player.setPlaybackQualityRange(quality);
    return await delay(500);
  };

  const watchVideoResolution = (player: YouTubePlayer) => {
    if (!player) return;

    // Hapus listener lama jika ada
    if (qualityChangeListener) {
      player.removeEventListener(
        "onPlaybackQualityChange",
        qualityChangeListener,
      );
    }

    // Hanya attach listener jika quality service enabled
    if (qualityServiceEnabled) {
      qualityChangeListener = (q: string) => {
        console.log("Quality Changed: ", q);
        saveResolution(q);
      };
      player.addEventListener("onPlaybackQualityChange", qualityChangeListener);
    }
  };

  const saveResolution = async (q: string) => {
    // Hanya save jika quality service enabled
    if (!qualityServiceEnabled) return;
    if (q == quality) return;

    quality = q;
    return await storageBridge.set(qualityReferenceKey, q);
  };

  const qualityService = async (player: YouTubePlayer) => {
    await setVideoResolution(player, quality!);
    watchVideoResolution(player);
  };

  const autoCaption = async (player: YouTubePlayer) => {
    if (!autoCaptionEnabled) return;
    player.toggleSubtitlesOn();
    isCaptionActive = true;
  };

  const handleVideo = async () => {
    const player = await waitForPlayer();
    await loopVideo(player);
    await qualityService(player);
    await autoCaption(player);
  };

  // Listen to setting changes
  const settingListener = (event: Event) => {
    const { setting, value } = (event as CustomEvent).detail;

    if (setting === "autoLoop") {
      autoLoopEnabled = value;
      if (player) {
        player.setLoopVideo(value);
      }
    } else if (setting === "qualityService") {
      const wasEnabled = qualityServiceEnabled;
      qualityServiceEnabled = value;

      if (player) {
        if (value && !wasEnabled) {
          // Re-enable: apply saved quality dan attach listener
          qualityService(player);
        } else if (!value && wasEnabled) {
          // Disable: remove listener
          if (qualityChangeListener) {
            player.removeEventListener(
              "onPlaybackQualityChange",
              qualityChangeListener,
            );
            qualityChangeListener = null;
          }
        }
      }
    } else if (setting === "autoCaption") {
      autoCaptionEnabled = value;
      console.log("autoCaptionEnabled:", autoCaptionEnabled);

      if (player) {
        // Logika toggle berdasarkan state saat ini dan nilai yang diinginkan
        if (value && !isCaptionActive) {
          // User mau nyalakan, tapi caption masih mati -> nyalakan
          player.toggleSubtitlesOn();
          isCaptionActive = true;
        } else if (!value && isCaptionActive) {
          // User mau matikan, tapi caption masih nyala -> matikan dengan toggle
          player.toggleSubtitles();
          isCaptionActive = false;
        }
        // Jika value === isCaptionActive, tidak perlu action (sudah sesuai)
      }
    }
  };

  return {
    match: (path: string) => path === "/watch",

    init: async () => {
      initConfig();

      videoId = getVideoId();
      console.log("videoId:", videoId);

      window.addEventListener("yt-enhancer-setting", settingListener);

      handleVideo();
      fetchAndLogVideoData();

      return () => {
        window.removeEventListener("yt-enhancer-setting", settingListener);
        if (player && qualityChangeListener) {
          player.removeEventListener(
            "onPlaybackQualityChange",
            qualityChangeListener,
          );
          qualityChangeListener = null;
        }
        videoId = null;
        ytInitialPlayerResponse = null;
        ytInitialData = null;
        videoState = null;
        player = null;
        quality = null;
        isCaptionActive = false;
        console.log("watch feature destroyed");
      };
    },

    fetchVideoData,
  };
})();
