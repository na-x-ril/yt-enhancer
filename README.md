# YT Enhancer
A Firefox extension that enhances the YouTube watching experience with automation, quality-of-life features, and subtle UI improvements. Built with TypeScript and Bun, designed with modularity and long-term maintainability in mind.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Firefox](https://img.shields.io/badge/Firefox-91%2B-orange.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)

---

## Overview
YT Enhancer augments YouTube with opt-in features that reduce friction during daily viewing, such as remembering playback state, preferred quality, and chat behavior during live streams. The extension is built around a feature-based architecture and a dual-context bridge system to safely interact with YouTube's internal APIs.

---

## Features

### Watch Page
* **Animated view counter** with odometer-style transitions and real-time updates
* **Manual refresh button** to fetch latest video statistics on demand
* **Automatic video looping** for continuous playback
* **Preferred video quality** automatically applied on video load
* **Automatic subtitle activation** when enabled in settings
* **Playback position persistence** - resume from where you left off (non-live videos only)
* **DVR availability indicator** for live streams without DVR capability

### Live Chat
* Automatic switch to "All Chat" mode on live streams

### UI
* Integrated settings dropdown in the YouTube header
* Non-intrusive UI aligned with YouTube's native design
* Real-time view count and date text updates via network interception

---

## Architecture
```
src/
├── content-scripts/
│   └── youtube/
│       ├── bridge/              # MAIN <-> ISOLATED communication
│       ├── components/          # UI components
│       ├── controller/          # Feature lifecycle manager
│       ├── features/            # Feature modules
│       ├── utils/               # Shared helpers
│       └── main.ts              # Entry point
├── background/                  # Background worker
└── public/                      # Static assets
```

### Bridge System
The extension uses a two-context messaging bridge to safely access both browser APIs and YouTube's runtime environment.

* **ISOLATED world**
  * Access to `browser.storage`
  * Handles persistence
* **MAIN world**
  * Runs in the page context
  * Interacts with YouTube's player and DOM

Example usage:
```ts
const value = await storageBridge.get('video_time_12345');
await storageBridge.set('dropdown_config', { autoLoop: true, preferredQuality: 'hd1080' });
```

---

## Feature Model
Each feature is self-contained and lifecycle-aware.
```ts
interface Feature {
  match: (path: string) => boolean;
  init?: () => void | (() => void) | Promise<void | (() => void)>;
}
```

Features are mounted and destroyed automatically based on the current YouTube route.

---

## Installation

### Requirements
* Bun >= 1.0
* Firefox >= 91

### Build
```bash
bun install
bun run build
```

Artifacts:
* `dist/`
* `yt-enhancer.zip`

### Load in Firefox
1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select `dist/manifest.json`

---

## Development

### Common Commands
```bash
bun run build        # Production build
bun run type-check   # TypeScript validation
```

### Adding a Feature
1. Create a new feature module under `features/`
2. Implement `match` and `init`
3. Register the feature in the features index
4. Build and test

---

## Storage Keys

| Key                  | Type   | Description                                          |
| -------------------- | ------ | ---------------------------------------------------- |
| dropdown_config      | object | Feature toggles and preferences (autoLoop, etc.)     |
| video_time_{videoId} | number | Last playback position for specific video            |

### dropdown_config Structure
```ts
{
  autoLoop: boolean;           // Enable automatic video looping
  qualityService: boolean;     // Enable automatic quality selection
  autoCaption: boolean;        // Enable automatic subtitle activation
  preferredQuality: string;    // Preferred quality level (e.g., 'hd1080')
}
```

---

## Browser Compatibility
* Firefox only
* Manifest Version: 2
* Content script contexts: MAIN + ISOLATED

---

## Contributing
1. Fork the repository
2. Create a feature branch (`feature/<name>`)
3. Commit with clear intent
4. Open a Pull Request

---

## License
MIT License

---

## Notes
* YouTube internals change frequently. Some features may break and require maintenance.
* This project prioritizes stability over aggressive DOM hacking.
* Live stream features (DVR indicator) only apply when watching active live broadcasts.
* Time tracking automatically saves progress every 3 seconds when pausing or when video state changes.
