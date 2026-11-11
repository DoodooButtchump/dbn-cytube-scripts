/* ==========================================================
   DBN LIVE CHANNEL VIEWER COUNTS
   Doodoo Buttchump Network
   Version 29.0 - Stable Hover Marquee (No Recursive Font Callback) - Authoritative Server Viewer Count - Now Playing Titles - Isolated WebSocket Connections

   FEATURES:
   - Dedicated channel-name section
   - Separate LIVE NOW indicator
   - Dedicated viewer-count section
   - Dedicated status section
   - Prevents text overlap and clipping
   - Blood-red neon appearance
   - Responsive sizing
   - Tries all available secure sync servers
   - Moves to another server after connection failure
   - Detects newly added banners
   ========================================================== */

(function () {
    "use strict";

    if (window.DBNLiveViewerCountsV21Loaded) return;
    window.DBNLiveViewerCountsV21Loaded = true;

    const CONFIG = {
        container: ".motd-banners",
        connectionTimeout: 15000
    };

    const serverCache = new Map();

    /* ======================================================
       1. STYLING
    ====================================================== */

    function addStyles() {
        if (document.getElementById("dbn-viewer-styles-v7")) return;

        const style = document.createElement("style");
        style.id = "dbn-viewer-styles-v7";

        style.textContent = `

.motd-banners a.dbn-viewer-banner-v6 {
    position: relative !important;
    display: inline-block !important;
    vertical-align: top !important;
    overflow: hidden !important;
    isolation: isolate !important;
    line-height: 0 !important;
    text-decoration: none !important;
}

.motd-banners a.dbn-viewer-banner-v6 img {
    display: block !important;
    max-width: 100% !important;
    height: auto !important;
}

.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-overlay-v6 {
    position: absolute !important;
    inset: 3% !important;
    width: 94% !important;
    height: 94% !important;
    box-sizing: border-box !important;
    min-width: 0 !important;
    min-height: 0 !important;
    max-width: 94% !important;
    max-height: 94% !important;
    z-index: 999 !important;
    display: grid !important;
    /* Readable vertical layout with natural text heights. */
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    align-items: center !important;
    gap: 3px !important;
    justify-items: center !important;
    gap: 2px !important;
    padding: 3px 6px !important;
    overflow: hidden !important;
    background: rgba(0, 0, 0, 0.95) !important;
    border: 2px solid #ff1717 !important;
    border-radius: 5px !important;
    box-shadow:
        inset 0 0 15px rgba(255, 0, 0, 0.4),
        0 0 8px rgba(255, 0, 0, 0.95),
        0 0 20px rgba(255, 0, 0, 0.7) !important;
    opacity: 0 !important;
    visibility: hidden !important;
    transform: scale(0.96);
    transition:
        opacity 0.25s ease,
        visibility 0.25s ease,
        transform 0.25s ease !important;
    pointer-events: none !important;
    text-align: center !important;
    line-height: normal !important;
}

.motd-banners a.dbn-viewer-banner-v6:hover .dbn-viewer-overlay-v6,
.motd-banners a.dbn-viewer-banner-v6:focus-visible .dbn-viewer-overlay-v6,
.motd-banners a.dbn-viewer-banner-v6:focus-within .dbn-viewer-overlay-v6 {
    opacity: 1 !important;
    visibility: visible !important;
    transform: scale(1) !important;
}

.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-overlay-v6 > * {
    flex: 0 0 auto !important;
    min-width: 0 !important;
    min-height: 0 !important;
    max-width: 100% !important;
}

.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-overlay-v6,
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-overlay-v6 * {
    font-family: Arial, sans-serif !important;
    box-sizing: border-box !important;
}

.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-name-v6 {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    min-height: 0 !important;
    color: #ffffff !important;
    -webkit-text-fill-color: #ffffff !important;
    font-size: clamp(8px, 1.05vw, 13px) !important;
    font-weight: 900 !important;
    letter-spacing: 0.7px !important;
    line-height: 1.1 !important;
    text-align: center !important;
    text-transform: uppercase !important;
    overflow: hidden !important;
    overflow-wrap: anywhere !important;
    word-break: break-word !important;
    text-shadow:
        0 0 4px #ffffff,
        0 0 9px #ff0000,
        0 0 17px #ff0000 !important;
}

.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-live-v6 {
    display: none;
    align-items: center !important;
    justify-content: center !important;
    gap: 5px !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    color: #ff2525 !important;
    -webkit-text-fill-color: #ff2525 !important;
    font-size: clamp(7px, 0.75vw, 9px) !important;
    font-weight: 900 !important;
    letter-spacing: 1.5px !important;
    line-height: 1.1 !important;
    text-transform: uppercase !important;
    white-space: nowrap !important;
    text-shadow:
        0 0 5px #ff0000,
        0 0 12px #ff0000 !important;
}

.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-live-dot-v6 {
    display: inline-block !important;
    width: 7px !important;
    height: 7px !important;
    min-width: 7px !important;
    min-height: 7px !important;
    flex-shrink: 0 !important;
    border-radius: 50% !important;
    background: #ff1010 !important;
    box-shadow:
        0 0 5px #ff0000,
        0 0 12px #ff0000 !important;
    animation: dbn-live-pulse-v6 1.1s infinite !important;
}

@keyframes dbn-live-pulse-v6 {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.5;
        transform: scale(0.8);
    }
}

.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-count-v6 {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 2px !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    min-height: 0 !important;
    overflow: hidden !important;
    color: #ffffff !important;
    -webkit-text-fill-color: #ffffff !important;
    text-align: center !important;
    line-height: 1 !important;
}

.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-number-v6 {
    display: block !important;
    max-width: 100% !important;
    min-width: 0 !important;
    color: #ffffff !important;
    -webkit-text-fill-color: #ffffff !important;
    font-size: clamp(18px, 2vw, 26px) !important;
    font-weight: 900 !important;
    line-height: 1 !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-shadow:
        0 0 5px #ffffff,
        0 0 12px #ff0000,
        0 0 22px #ff0000 !important;
}

.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-label-v6 {
    display: block !important;
    max-width: 100% !important;
    color: #ff3030 !important;
    -webkit-text-fill-color: #ff3030 !important;
    font-size: clamp(9px, 0.9vw, 11px) !important;
    font-weight: 900 !important;
    letter-spacing: 1.5px !important;
    line-height: 1.1 !important;
    text-transform: uppercase !important;
    white-space: nowrap !important;
    text-shadow:
        0 0 5px #ff0000,
        0 0 10px #ff0000 !important;
}

.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-nowplaying-v17 {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 2px !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    min-height: 0 !important;
    overflow: hidden !important;
    text-align: center !important;
    line-height: 1.05 !important;
}

.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-nowplaying-label-v17 {
    display: block !important;
    width: 100% !important;
    color: #ff3030 !important;
    -webkit-text-fill-color: #ff3030 !important;
    font-size: clamp(8px, 0.8vw, 10px) !important;
    font-weight: 900 !important;
    letter-spacing: 1.2px !important;
    line-height: 1 !important;
    text-shadow: 0 0 5px #ff0000, 0 0 10px #ff0000 !important;
}

.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-nowplaying-title-v17 {
    display: -webkit-box !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    color: #ffffff !important;
    -webkit-text-fill-color: #ffffff !important;
    font-size: clamp(6px, 0.7vw, 8px) !important;
    font-weight: 700 !important;
    letter-spacing: 0.2px !important;
    line-height: 1.15 !important;
    text-align: center !important;
    white-space: normal !important;
    overflow: hidden !important;
    overflow-wrap: anywhere !important;
    word-break: break-word !important;
    -webkit-line-clamp: 2 !important;
    -webkit-box-orient: vertical !important;
    text-shadow: 0 0 4px rgba(255,255,255,0.75) !important;
}

.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-nowplaying-title-v17.dbn-title-marquee {
    display: block !important;
    width: max-content !important;
    max-width: none !important;
    white-space: nowrap !important;
    overflow: visible !important;
    overflow-wrap: normal !important;
    word-break: normal !important;
    -webkit-line-clamp: unset !important;
    -webkit-box-orient: initial !important;
    animation: dbn-title-marquee-v1 var(--dbn-marquee-duration, 9s) linear infinite alternate !important;
    will-change: transform;
}

@keyframes dbn-title-marquee-v1 {
    0%, 10% { transform: translateX(0); }
    90%, 100% { transform: translateX(var(--dbn-marquee-distance, -40px)); }
}

/* DBN V7: dedicated visible now-playing title strip */
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-overlay-v6 {
    display:flex !important; flex-direction:column !important;
    justify-content:space-evenly !important; align-items:center !important;
    gap:2px !important; padding:4px 6px !important;
}
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-nowplaying-v17 {
    display:flex !important; flex:0 0 auto !important; flex-direction:column !important;
    width:100% !important; min-height:27px !important; max-height:32% !important;
    overflow:hidden !important; justify-content:center !important; align-items:center !important;
    gap:3px !important; padding-top:3px !important;
    border-top:1px solid rgba(255,40,40,.8) !important;
}
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-nowplaying-label-v17 {
    display:block !important; flex:0 0 auto !important;
    font-size:clamp(9px,1vw,12px) !important; line-height:1.1 !important;
}
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-nowplaying-title-v17 {
    display:block !important; flex:0 0 auto !important; width:100% !important;
    min-height:12px !important; color:#fff !important; -webkit-text-fill-color:#fff !important;
    font-size:clamp(9px,1vw,12px) !important; font-weight:800 !important;
    line-height:1.2 !important; text-align:center !important; white-space:nowrap !important;
    overflow:hidden !important; text-overflow:clip !important; overflow-wrap:normal !important;
    word-break:normal !important; -webkit-line-clamp:unset !important;
    -webkit-box-orient:initial !important; text-shadow:0 0 4px #fff,0 0 8px #f00 !important;
}
@media(max-width:600px) {
 .motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-nowplaying-v17 { min-height:25px !important; }
 .motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-nowplaying-title-v17 { font-size:9px !important; }
}
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-status-v6 {
    display: block !important;
    margin-top: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    color: #ffffff !important;
    -webkit-text-fill-color: #ffffff !important;
    font-size: clamp(9px, 1vw, 12px) !important;
    font-weight: bold !important;
    letter-spacing: 0.7px !important;
    line-height: 1.1 !important;
    text-align: center !important;
    text-transform: uppercase !important;
    overflow: visible !important;
    text-overflow: clip !important;
    white-space: normal !important;
    overflow-wrap: anywhere !important;
    word-break: break-word !important;
    max-height: 3.3em !important;
    text-shadow:
        0 0 5px rgba(255,255,255,0.7) !important;
}

@media (max-width: 600px) {

    .motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-overlay-v6 {
        gap: 1px !important;
        padding: 2px 4px !important;
        border-width: 1.5px !important;
    }

    .motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-name-v6 {
        font-size: clamp(7px, 2vw, 11px) !important;
        letter-spacing: 0.3px !important;
    }

    .motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-live-v6 {
        font-size: 6px !important;
        letter-spacing: 1px !important;
    }

    .motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-live-dot-v6 {
        width: 6px !important;
        height: 6px !important;
        min-width: 6px !important;
        min-height: 6px !important;
    }

    .motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-number-v6 {
        font-size: clamp(17px, 4vw, 23px) !important;
    }

    .motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-label-v6 {
        font-size: 8px !important;
    }

    .motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-status-v6 {
        font-size: 9px !important;
    }
}

@media (prefers-reduced-motion: reduce) {

    .motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-overlay-v6 {
        transition: none !important;
    }

    .motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-live-dot-v6 {
        animation: none !important;
    }
}

`;

        document.head.appendChild(style);
    }

    /* ======================================================
       2. IDENTIFY CHANNEL
    ====================================================== */

    function getChannelName(link) {
        try {
            const rawHref = link.getAttribute("href");

            if (!rawHref) return null;

            let channel = rawHref.trim();

            const fullURL = channel.match(
                /^https?:\/\/(?:www\.)?cytu\.be\/r\/([^/?#]+)/i
            );

            if (fullURL) {
                return decodeURIComponent(fullURL[1]);
            }

            channel = channel.replace(/^\/+/, "");

            if (
                channel.includes("://") ||
                channel.startsWith("#") ||
                channel.includes("/")
            ) {
                return null;
            }

            return decodeURIComponent(channel);

        } catch (error) {
            return null;
        }
    }

    /* ======================================================
       3. CREATE OVERLAY
    ====================================================== */

    function createOverlay(link, channel) {
        if (link.dataset.dbnViewerReadyV7) return;

        link.dataset.dbnViewerReadyV7 = "true";
        link.classList.add("dbn-viewer-banner-v6");

        const overlay = document.createElement("div");
        overlay.className = "dbn-viewer-overlay-v6";

        const name = document.createElement("div");
        name.className = "dbn-viewer-name-v6";
        name.textContent = channel.replace(/-/g, " ");

        const live = document.createElement("div");
        live.className = "dbn-viewer-live-v6";

        const liveDot = document.createElement("span");
        liveDot.className = "dbn-viewer-live-dot-v6";

        const liveText = document.createElement("span");
        liveText.textContent = "LIVE NOW";

        live.append(liveDot, liveText);

        const count = document.createElement("div");
        count.className = "dbn-viewer-count-v6";

        const countNumber = document.createElement("span");
        countNumber.className = "dbn-viewer-number-v6";
        countNumber.textContent = "--";

        const countLabel = document.createElement("span");
        countLabel.className = "dbn-viewer-label-v6";
        countLabel.textContent = "VIEWERS";

        count.append(countNumber, countLabel);

        const nowPlaying = document.createElement("div");
        nowPlaying.className = "dbn-viewer-nowplaying-v17";

        const nowPlayingLabel = document.createElement("span");
        nowPlayingLabel.className = "dbn-viewer-nowplaying-label-v17";
        nowPlayingLabel.textContent = "NOW PLAYING";

        const nowPlayingTitle = document.createElement("span");
        nowPlayingTitle.className = "dbn-viewer-nowplaying-title-v17";
        const nowPlayingText = document.createElement("span");
        nowPlayingText.className = "dbn-viewer-nowplaying-text-v18";
        nowPlayingText.textContent = "Waiting for room info...";
        nowPlayingTitle.appendChild(nowPlayingText);

        nowPlaying.append(nowPlayingLabel, nowPlayingTitle);

        const status = document.createElement("div");
        status.className = "dbn-viewer-status-v6";
        status.textContent = "Hover for viewer count";

        overlay.append(name, live, count, status, nowPlaying);
        link.appendChild(overlay);

        // V14: resilient hover marquee startup.
        // Retry while the pointer remains over the banner because the overlay
        // transition, fonts, and carousel layout can settle after mouseenter.
        let marqueeAnimation = null;
        let marqueeFrame = 0;
        let marqueeTimer = 0;
        let marqueeRun = 0;
        let pointerInside = false;
        const MAX_MARQUEE_ATTEMPTS = 16;
        const MARQUEE_RETRY_DELAY = 90;

        function clearTitleMarquee() {
            if (marqueeFrame) cancelAnimationFrame(marqueeFrame);
            if (marqueeTimer) clearTimeout(marqueeTimer);
            marqueeFrame = 0;
            marqueeTimer = 0;

            if (marqueeAnimation) {
                marqueeAnimation.cancel();
                marqueeAnimation = null;
            }

            nowPlayingTitle.classList.remove("dbn-title-marquee");
            nowPlayingText.style.removeProperty("transform");
            nowPlayingText.style.removeProperty("width");
        }

        function measureFullTitleWidth() {
            return Math.ceil(nowPlayingText.getBoundingClientRect().width);
        }

        function updateTitleMarquee() {
            if (marqueeFrame) cancelAnimationFrame(marqueeFrame);
            if (marqueeTimer) clearTimeout(marqueeTimer);
            marqueeFrame = 0;
            marqueeTimer = 0;

            if (marqueeAnimation) {
                marqueeAnimation.cancel();
                marqueeAnimation = null;
            }

            const run = ++marqueeRun;
            nowPlayingText.style.removeProperty("transform");
            let attempts = 0;

            function measureAndStart() {
                if (run !== marqueeRun || !pointerInside) return;

                const available = nowPlayingTitle.clientWidth;
                if (available <= 0 || !nowPlayingText.textContent.trim()) {
                    retry();
                    return;
                }

                const fullWidth = measureFullTitleWidth();
                const overflow = fullWidth - available;

                if (overflow <= 3) {
                    nowPlayingText.style.removeProperty("transform");
                    return;
                }

                const distance = Math.ceil(overflow + 6);
                const duration = Math.max(5, Math.min(22, distance / 16));

                if (typeof nowPlayingText.animate === "function") {
                    marqueeAnimation = nowPlayingText.animate(
                        [
                            { transform: "translateX(0px)" },
                            { transform: "translateX(" + (-distance) + "px)" }
                        ],
                        {
                            duration: duration * 1000,
                            easing: "linear",
                            iterations: Infinity,
                            direction: "alternate"
                        }
                    );
                }
            }

            function retry() {
                if (run !== marqueeRun || !pointerInside) return;
                if (attempts >= MAX_MARQUEE_ATTEMPTS) return;
                attempts++;
                marqueeTimer = window.setTimeout(function () {
                    marqueeTimer = 0;
                    marqueeFrame = requestAnimationFrame(function () {
                        marqueeFrame = 0;
                        measureAndStart();
                    });
                }, MARQUEE_RETRY_DELAY);
            }

            marqueeFrame = requestAnimationFrame(function () {
                marqueeFrame = requestAnimationFrame(function () {
                    marqueeFrame = 0;
                    measureAndStart();
                });
            });
        }

        link.addEventListener("mouseenter", function () {
            pointerInside = true;
            updateTitleMarquee();
        });

        link.addEventListener("mouseleave", function () {
            pointerInside = false;
            marqueeRun++;
            clearTitleMarquee();
        });

        // Deliberately do not observe the title viewport here.
        // The marquee temporarily expands the title to max-content; observing
        // its parent can create a resize/update feedback loop in flex layouts.
        // Re-measure on the next hover instead of reacting to our own animation.
        
        const state = {
            active: false,
            socket: null,
            timer: null,
            retryTimer: null,
            generation: 0
        };

        function updateNowPlaying(media) {
            let title = "";

            if (typeof media === "string") {
                title = media;
            } else if (media && typeof media === "object") {
                if (typeof media.title === "string") {
                    title = media.title;
                } else if (media.media && typeof media.media.title === "string") {
                    title = media.media.title;
                }
            }

            title = title.trim();

            nowPlayingText.textContent = title || "Nothing playing";
            nowPlayingTitle.title = title || "Nothing playing";

            // If the media title arrives or changes while this banner is
            // already hovered, recalculate immediately instead of waiting
            // for the user to leave and hover a second time.
            if (link.matches(":hover")) {
                updateTitleMarquee();
            }
        }

        function showCount(number) {
            if (!Number.isFinite(number) || number < 0) return;

            countNumber.textContent = number;

            countLabel.textContent =
                number === 1 ? "VIEWER" : "VIEWERS";

            live.style.display = "flex";
            status.textContent = "Currently in chat";
        }

        function showStatus(message) {
            countNumber.textContent = "--";
            countLabel.textContent = "VIEWERS";

            live.style.display = "none";
            status.textContent = message;
        }

        /* ==================================================
           4. GET ALL SECURE SOCKET SERVERS
        ================================================== */

        async function getSocketServers() {
            const cached = serverCache.get(channel);

            if (cached && Date.now() - cached.time < 300000) {
                return cached.urls;
            }

            const response = await fetch(
                "/socketconfig/" +
                encodeURIComponent(channel) +
                ".json",
                { cache: "no-store" }
            );

            if (!response.ok) {
                throw new Error("Channel configuration unavailable");
            }

            const data = await response.json();

            if (!data.servers || !data.servers.length) {
                throw new Error("No sync servers found");
            }

            const urls = [
                ...new Set(
                    data.servers
                        .filter(function (server) {
                            return server.secure === true && server.url;
                        })
                        .map(function (server) {
                            return server.url;
                        })
                )
            ];

            if (!urls.length) {
                throw new Error("No secure sync servers found");
            }

            serverCache.set(channel, {
                urls: urls,
                time: Date.now()
            });

            return urls;
        }

        /* ==================================================
           5. CONNECT AND TRY SERVERS IN SEQUENCE
        ================================================== */

        async function connect() {
            if (state.active) return;

            state.active = true;
            const generation = ++state.generation;
            let round = 0;
            let connectedAtLeastOnce = false;
            let lastFailureReason = "No connection attempt completed";
            const MAX_ROUNDS = 5;
            const ROUND_DELAY = 5000;

            showStatus("Connecting...");

            if (typeof window.io !== "function") {
                state.active = false;
                showStatus("Socket client unavailable");
                return;
            }

            function isCurrent() {
                return state.active && generation === state.generation;
            }

            function scheduleNextRound() {
                if (!isCurrent()) return;

                if (round >= MAX_ROUNDS) {
                    state.active = false;
                    showStatus(
                        connectedAtLeastOnce
                            ? "Connected, but viewer count did not arrive: " + lastFailureReason
                            : "Connection unavailable: " + lastFailureReason
                    );
                    return;
                }

                showStatus("Connection lost - retrying shortly...");
                clearTimeout(state.retryTimer);

                state.retryTimer = setTimeout(function () {
                    state.retryTimer = null;
                    if (isCurrent()) runRound();
                }, ROUND_DELAY);
            }

            async function runRound() {
                if (!isCurrent()) return;

                round++;
                showStatus("Connecting - attempt " + round + " of " + MAX_ROUNDS + "...");

                let servers;

                try {
                    const response = await fetch(
                        "/socketconfig/" +
                        encodeURIComponent(channel) +
                        ".json",
                        { cache: "no-store" }
                    );

                    if (!response.ok) {
                        throw new Error("Channel configuration unavailable");
                    }

                    const data = await response.json();

                    if (!data.servers || !data.servers.length) {
                        throw new Error("No sync servers found");
                    }

                    servers = [...new Set(
                        data.servers
                            .filter(function (server) {
                                return server.secure === true && server.url;
                            })
                            .map(function (server) {
                                return server.url;
                            })
                    )];

                    if (!servers.length) {
                        throw new Error("No secure sync servers found");
                    }
                } catch (error) {
                    lastFailureReason = "channel config: " + (error && error.message ? error.message : String(error));
                    console.warn("[DBN V21] Channel config failed:", lastFailureReason);
                    if (isCurrent()) scheduleNextRound();
                    return;
                }

                if (!isCurrent()) return;

                let serverIndex = 0;

                function tryNextServer() {
                    if (!isCurrent()) return;

                    if (serverIndex >= servers.length) {
                        scheduleNextRound();
                        return;
                    }

                    const serverURL = servers[serverIndex++];
                    showStatus(
                        "Trying server " + serverIndex +
                        " of " + servers.length +
                        " (attempt " + round + "/" + MAX_ROUNDS + ")..."
                    );

                    let failed = false;
                    let receivedCount = false;

                    const socket = window.io(serverURL, {
                        // Match CyTube's documented sync-client transport.
                        transports: ["websocket"],
                        // Each banner must own its own socket. Without this,
                        // Socket.IO may multiplex same-origin connections and
                        // a banner leaving can interfere with another banner.
                        forceNew: true,
                        reconnection: false,
                        timeout: CONFIG.connectionTimeout
                    });

                    state.socket = socket;

                    function failServer(reason) {
                        if (failed || receivedCount || !isCurrent()) return;

                        lastFailureReason = reason || "server connection failed without an error message";
                        console.warn("[DBN V21] Server failed:", serverURL, lastFailureReason);
                        failed = true;
                        clearTimeout(state.timer);

                        if (state.socket === socket) {
                            state.socket = null;
                        }

                        socket.removeAllListeners();
                        socket.disconnect();

                        tryNextServer();
                    }

                    function updateCount(value) {
                        if (!isCurrent() || failed || receivedCount) return;

                        let number = null;

                        if (typeof value === "number") {
                            number = value;
                        } else if (value && typeof value.count === "number") {
                            number = value.count;
                        }

                        if (
                            number === null ||
                            !Number.isFinite(number) ||
                            number < 0
                        ) return;

                        // CyTube's usercount is the total channel.users.length.
                        // It includes unnamed/anonymous users that userlist omits.
                        // This monitor socket is itself a channel user, so remove it.
                        number = Math.max(0, number - 1);

                        receivedCount = true;
                        clearTimeout(state.timer);
                        clearTimeout(state.retryTimer);
                        state.retryTimer = null;
                        showCount(number);
                    }

                    socket.on("connect", function () {
                        if (!isCurrent() || failed) return;

                        connectedAtLeastOnce = true;
                        clearTimeout(state.timer);

                        showStatus("Connected - joining channel...");
                        socket.emit("joinChannel", { name: channel });

                        // Start a full response window AFTER the socket
                        // connects and the channel-join request is sent.
                        state.timer = setTimeout(function () {
                            if (isCurrent() && !receivedCount && !failed) {
                                failServer("viewer-count response timeout after socket connected");
                            }
                        }, CONFIG.connectionTimeout);
                    });

                    socket.on("setPermissions", function () {
                        if (!isCurrent() || failed) return;
                        showStatus("Connected - retrieving count...");
                    });

                    socket.on("changeMedia", updateNowPlaying);
                    // Only trust CyTube's server-reported total. The userlist
                    // can omit users with blank display names.
                    socket.on("usercount", updateCount);

                    socket.on("connect_error", function (error) {
                        failServer("handshake: " + (error && (error.message || error.description) ? (error.message || error.description) : "unknown connect_error"));
                    });

                    socket.on("error", function (error) {
                        failServer("socket error: " + (error && error.message ? error.message : String(error)));
                    });

                    socket.on("disconnect", function (reason) {
                        if (!receivedCount && !failed && isCurrent()) {
                            failServer("disconnect: " + (reason || "unknown reason"));
                        }
                    });

                    // Explicitly time out the CONNECT phase as well.
                    // The separate response timer starts after connect.
                    state.timer = setTimeout(function () {
                        if (isCurrent() && !receivedCount && !failed) {
                            failServer("socket connection timeout");
                        }
                    }, CONFIG.connectionTimeout);

                 }

                tryNextServer();
            }

            runRound();
        }

        /* ==================================================
           6. DISCONNECT WHEN LEAVING BANNER
        ================================================== */

        function disconnect() {
            if (
                link.matches(":hover") ||
                link.contains(document.activeElement)
            ) {
                return;
            }

            state.active = false;
            state.generation++;

            clearTimeout(state.timer);
            clearTimeout(state.retryTimer);
            state.retryTimer = null;

            if (state.socket) {
                state.socket.disconnect();
                state.socket = null;
            }
        }

        link.addEventListener("pointerenter", connect);
        link.addEventListener("pointerleave", disconnect);
        link.addEventListener("focusin", connect);

        link.addEventListener("focusout", function () {
            setTimeout(disconnect, 100);
        });
    }

    /* ======================================================
       7. SCAN BANNERS
    ====================================================== */

    function scanBanners() {
        const containers = document.querySelectorAll(
            CONFIG.container
        );

        containers.forEach(function (container) {
            const links = container.querySelectorAll("a[href]");

            links.forEach(function (link) {
                const channel = getChannelName(link);

                if (!channel) return;
                if (!link.querySelector("img")) return;

                createOverlay(link, channel);
            });
        });
    }

    /* ======================================================
       8. INITIALIZE
    ====================================================== */

    function initialize() {
        addStyles();
        scanBanners();

        const observer = new MutationObserver(function () {
            scanBanners();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log(
            "[DBN V21] Live channel viewer counts initialized."
        );
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            { once: true }
        );
    } else {
        initialize();
    }

})();


/* ==========================================================
   DBN SCROLL TO VIDEO
   Doodoo Buttchump Network
   Version 27 - Consolidated Build
   ========================================================== */
(function () {
    "use strict";

    if (window.DBNScrollToVideoV27Loaded) return;
    window.DBNScrollToVideoV27Loaded = true;

    var BUTTON_ID = "dbn-scroll-to-video";
    var SECTION_ID = "dbn-scroll-to-video-v27-section";

    function findMotd() {
        var selectors = ["#motdwrap", ".motd-container", "#motd", ".motd"];
        for (var i = 0; i < selectors.length; i++) {
            var element = document.querySelector(selectors[i]);
            if (element && element.parentElement) return element;
        }
        return null;
    }

    function createButton() {
        var motd = findMotd();
        if (!motd) return false;

        var section = document.getElementById(SECTION_ID);
        if (!section) {
            section = document.createElement("div");
            section.id = SECTION_ID;
            Object.assign(section.style, {
                display: "flex",
                position: "relative",
                width: "100%",
                boxSizing: "border-box",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                margin: "15px auto 21px",
                padding: "0",
                clear: "both",
                zIndex: "1"
            });
            motd.parentElement.insertBefore(section, motd);
        } else if (section.parentElement !== motd.parentElement || section.nextElementSibling !== motd) {
            motd.parentElement.insertBefore(section, motd);
        }

        var button = document.getElementById(BUTTON_ID);
        if (!button) {
            button = document.createElement("button");
            button.id = BUTTON_ID;
            button.type = "button";
            button.innerHTML = "👇 SCROLL TO VIDEO 👇";
            Object.assign(button.style, {
                display: "inline-block",
                position: "relative",
                boxSizing: "border-box",
                minWidth: "240px",
                maxWidth: "95%",
                padding: "9px 24px",
                margin: "0",
                border: "3px solid #ffffff",
                borderRadius: "9px",
                background: "linear-gradient(180deg, #ff3030 0%, #990000 100%)",
                color: "#ffffff",
                fontFamily: "'Metal Mania', cursive",
                fontSize: "22.5px",
                fontWeight: "bold",
                letterSpacing: "1px",
                textAlign: "center",
                textShadow: "2px 2px 2px #000000, 0 0 8px #ff0000",
                boxShadow: "0 5px 0 #4d0000, 0 0 14px #ff0000",
                cursor: "pointer",
                transition: "transform 0.15s ease, box-shadow 0.15s ease"
            });
            button.addEventListener("mouseenter", function () {
                button.style.transform = "translateY(-2px)";
                button.style.boxShadow = "0 7px 0 #4d0000, 0 0 22px #ff0000";
            });
            button.addEventListener("mouseleave", function () {
                button.style.transform = "translateY(0)";
                button.style.boxShadow = "0 5px 0 #4d0000, 0 0 14px #ff0000";
            });
            button.addEventListener("mousedown", function () {
                button.style.transform = "translateY(4px)";
                button.style.boxShadow = "0 1px 0 #4d0000, 0 0 12px #ff0000";
            });
            button.addEventListener("mouseup", function () {
                button.style.transform = "translateY(-2px)";
                button.style.boxShadow = "0 7px 0 #4d0000, 0 0 22px #ff0000";
            });
            button.addEventListener("click", function () {
                var video = document.querySelector("#videowrap");
                if (video) video.scrollIntoView({ behavior: "smooth", block: "center" });
            });
            section.appendChild(button);
        } else if (button.parentElement !== section) {
            section.appendChild(button);
        }
        return true;
    }

    function initialize() {
        var attempts = 0;
        var retry = setInterval(function () {
            attempts++;
            if (createButton() || attempts >= 40) clearInterval(retry);
        }, 500);
        createButton();
        window.addEventListener("resize", createButton);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize, { once: true });
    } else {
        initialize();
    }
})();

/* ==========================================================
   DBN INFINITE BANNER CAROUSELS
   Version 7.0 - Dedicated visible title strip; pause on hover; marquee for long titles.
   Original banner links/images are retained; duplicates are
   cleaned so the viewer-count observer can initialize them.
   ========================================================== */
(function () {
    "use strict";

    if (window.DBNInfiniteBannerCarouselV1Loaded) return;
    window.DBNInfiniteBannerCarouselV1Loaded = true;

    var CONFIG = {
        selector: ".motd-banners",
        speed: 35,
        gap: 16,
        cardWidth: "clamp(150px, 18vw, 230px)",
        mobileCardWidth: "72vw"
    };

    var activeCarousels = [];
    var rafId = null;
    var lastFrame = 0;
    var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function addCarouselStyles() {
        if (document.getElementById("dbn-infinite-carousel-styles-v1")) return;
        var style = document.createElement("style");
        style.id = "dbn-infinite-carousel-styles-v1";
        style.textContent = `
.dbn-carousel-shell {
    position: relative !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 12px auto 22px !important;
    padding: 12px 42px !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
    background: rgba(0,0,0,.94) !important;
    border: 2px solid #8f0000 !important;
    border-radius: 10px !important;
    box-shadow: none !important;
}
.dbn-carousel-viewport { width:100% !important; overflow:hidden !important; position:relative !important; }
.dbn-carousel-track { display:flex !important; flex-wrap:nowrap !important; align-items:stretch !important; width:max-content !important; will-change:transform; }
.dbn-carousel-set { display:flex !important; flex:0 0 auto !important; flex-wrap:nowrap !important; align-items:stretch !important; gap:${CONFIG.gap}px !important; width:max-content !important; margin:0 !important; padding:0 ${CONFIG.gap}px 0 0 !important; }
.dbn-carousel-set > .column { display:block !important; float:none !important; flex:0 0 ${CONFIG.cardWidth} !important; width:${CONFIG.cardWidth} !important; max-width:${CONFIG.cardWidth} !important; min-width:0 !important; margin:0 !important; padding:0 !important; box-sizing:border-box !important; }
.dbn-carousel-set a[href] { display:block !important; width:100% !important; }
.dbn-carousel-set a[href] img { display:block !important; width:100% !important; max-width:100% !important; height:auto !important; }
.dbn-carousel-arrow { position:absolute !important; top:50% !important; z-index:1005 !important; transform:translateY(-50%) !important; width:32px !important; height:48px !important; padding:0 !important; border:2px solid #fff !important; border-radius:7px !important; background:linear-gradient(180deg,#ff3030,#850000) !important; color:#fff !important; font-size:25px !important; font-weight:bold !important; line-height:1 !important; text-shadow:0 0 8px #f00 !important; box-shadow:0 0 12px rgba(255,0,0,.85) !important; cursor:pointer !important; }
.dbn-carousel-arrow:hover { background:linear-gradient(180deg,#ff5555,#b00000) !important; box-shadow:0 0 18px #f00 !important; }
.dbn-carousel-arrow-prev { left:5px !important; }
.dbn-carousel-arrow-next { right:5px !important; }
.dbn-carousel-shell:hover .dbn-carousel-arrow { opacity:1 !important; }
.dbn-carousel-set[aria-hidden="true"] { pointer-events:auto !important; }
@media(max-width:600px) {
  .dbn-carousel-shell { padding:9px 34px !important; margin:9px auto 17px !important; }
  .dbn-carousel-set { gap:12px !important; padding-right:12px !important; }
  .dbn-carousel-set > .column { flex-basis:${CONFIG.mobileCardWidth} !important; width:${CONFIG.mobileCardWidth} !important; max-width:${CONFIG.mobileCardWidth} !important; }
  .dbn-carousel-arrow { width:27px !important; height:42px !important; font-size:21px !important; }
}
@media(prefers-reduced-motion:reduce) { .dbn-carousel-track { will-change:auto; } }
`;
        document.head.appendChild(style);
    }

    function removeCopiedViewerState(root) {
        var links = root.querySelectorAll("a[href]");
        links.forEach(function (link) {
            link.removeAttribute("data-dbn-viewer-ready-v7");
            link.classList.remove("dbn-viewer-banner-v6");
            link.querySelectorAll(".dbn-viewer-overlay-v6").forEach(function (overlay) {
                overlay.remove();
            });
        });
        if (root.id) root.removeAttribute("id");
        root.querySelectorAll("[id]").forEach(function (el) { el.removeAttribute("id"); });
    }

    function getColumns(container) {
        return Array.prototype.filter.call(container.children, function (child) {
            return child.classList && child.classList.contains("column") && child.querySelector("a[href] img");
        });
    }

    function makeCarousel(container) {
        if (container.dataset.dbnCarouselReady === "true") return;
        var columns = getColumns(container);
        if (columns.length < 2) return;

        container.dataset.dbnCarouselReady = "true";
        var shell = document.createElement("div");
        shell.className = "dbn-carousel-shell";
        var viewport = document.createElement("div");
        viewport.className = "dbn-carousel-viewport";
        var track = document.createElement("div");
        track.className = "dbn-carousel-track";
        var previous = document.createElement("button");
        previous.type = "button";
        previous.className = "dbn-carousel-arrow dbn-carousel-arrow-prev";
        previous.setAttribute("aria-label", "Scroll banners left");
        previous.textContent = "‹";
        var next = document.createElement("button");
        next.type = "button";
        next.className = "dbn-carousel-arrow dbn-carousel-arrow-next";
        next.setAttribute("aria-label", "Scroll banners right");
        next.textContent = "›";

        container.parentNode.insertBefore(shell, container);
        shell.appendChild(viewport);
        viewport.appendChild(track);
        track.appendChild(container);
        container.classList.add("dbn-carousel-set");

        // Two clean copies are sufficient for a seamless repeating track.
        var cloneA = container.cloneNode(true);
        var cloneB = container.cloneNode(true);
        removeCopiedViewerState(cloneA);
        removeCopiedViewerState(cloneB);
        cloneA.classList.add("dbn-carousel-set");
        cloneB.classList.add("dbn-carousel-set");
        cloneA.setAttribute("aria-hidden", "true");
        cloneB.setAttribute("aria-hidden", "true");
        track.append(cloneA, cloneB);
        shell.append(previous, next);

        var state = {
            shell: shell,
            track: track,
            firstSet: container,
            offset: 0,
            setWidth: 0,
            paused: false,
            lastTime: 0
        };
        activeCarousels.push(state);

        function measure() {
            state.setWidth = container.getBoundingClientRect().width;
            if (state.setWidth > 0) {
                state.offset = ((state.offset % state.setWidth) + state.setWidth) % state.setWidth;
                track.style.transform = "translate3d(" + (-state.offset) + "px,0,0)";
            }
        }

        function nudge(direction) {
            measure();
            if (!state.setWidth) return;
            var firstCard = container.querySelector(":scope > .column");
            var cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 200;
            var gap = parseFloat(getComputedStyle(container).columnGap) || CONFIG.gap;
            state.offset += direction * (cardWidth + gap);
            state.offset = ((state.offset % state.setWidth) + state.setWidth) % state.setWidth;
            track.style.transform = "translate3d(" + (-state.offset) + "px,0,0)";
        }

        previous.addEventListener("click", function () { nudge(-1); });
        next.addEventListener("click", function () { nudge(1); });

        // Pause the continuous track while the user hovers or focuses this carousel.
        shell.addEventListener("mouseenter", function () { state.paused = true; });
        shell.addEventListener("mouseleave", function () { state.paused = false; });
        shell.addEventListener("focusin", function () { state.paused = true; });
        shell.addEventListener("focusout", function (event) {
            if (!shell.contains(event.relatedTarget)) state.paused = false;
        });
        measure();
        if (window.ResizeObserver) {
            var resizeObserver = new ResizeObserver(measure);
            resizeObserver.observe(container);
            resizeObserver.observe(viewport);
        } else {
            window.addEventListener("resize", measure);
        }
    }

    function frame(timestamp) {
        if (!lastFrame) lastFrame = timestamp;
        var delta = Math.min((timestamp - lastFrame) / 1000, 0.05);
        lastFrame = timestamp;
        if (!document.hidden) {
            activeCarousels.forEach(function (state) {
                if (state.paused || !state.setWidth) return;
                state.offset += CONFIG.speed * delta;
                if (state.offset >= state.setWidth) state.offset -= state.setWidth;
                state.track.style.transform = "translate3d(" + (-state.offset) + "px,0,0)";
            });
        }
        rafId = window.requestAnimationFrame(frame);
    }

    function scanForCarousels() {
        document.querySelectorAll(CONFIG.selector).forEach(makeCarousel);
    }

    function initialize() {
        addCarouselStyles();
        scanForCarousels();

        // CyTube can inject MOTD content after external JavaScript loads.
        // Observe later additions so the carousel still initializes reliably.
        if (!window.DBNCarouselDomObserver) {
            window.DBNCarouselDomObserver = new MutationObserver(function () {
                scanForCarousels();
            });
            window.DBNCarouselDomObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        if (rafId === null) rafId = window.requestAnimationFrame(frame);
        console.log("[DBN Carousel V5] Initializer and DOM observer ready.");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize, { once: true });
    } else {
        initialize();
    }
})();

/* ==========================================================
   DBN ALL-IN-ONE V8 - TARGETED NOW-PLAYING LAYOUT CORRECTION
   Built from the verified V7 baseline. This only changes the
   hover overlay layout; carousel, viewer socket, and scroll
   button logic remain unchanged.
   ========================================================== */
(function () {
    "use strict";

    function installDBNViewerLayoutV8() {
        if (document.getElementById("dbn-viewer-layout-v8")) return;

        var style = document.createElement("style");
        style.id = "dbn-viewer-layout-v8";
        style.textContent = `
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-overlay-v6 {
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) !important;
    grid-template-rows:
        minmax(0, .9fr)
        minmax(0, .55fr)
        minmax(0, 1.2fr)
        minmax(0, .7fr)
        minmax(30px, 1.5fr) !important;
    align-content: stretch !important;
    justify-items: stretch !important;
    align-items: stretch !important;
    justify-content: stretch !important;
    gap: 1px !important;
    padding: 3px 5px !important;
    overflow: hidden !important;
}
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-overlay-v6 > * {
    min-width: 0 !important;
    min-height: 0 !important;
    max-width: 100% !important;
    max-height: 100% !important;
    width: 100% !important;
    margin: 0 !important;
    justify-self: stretch !important;
    align-self: stretch !important;
}
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-name-v6,
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-live-v6,
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-count-v6,
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-status-v6 {
    min-height: 0 !important;
    max-height: 100% !important;
    overflow: hidden !important;
}
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-nowplaying-v17 {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    align-self: stretch !important;
    width: 100% !important;
    height: 100% !important;
    min-width: 0 !important;
    min-height: 30px !important;
    max-height: 100% !important;
    box-sizing: border-box !important;
    gap: 2px !important;
    padding: 2px 1px 0 !important;
    border-top: 1px solid rgba(255, 40, 40, .85) !important;
    overflow: hidden !important;
}
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-nowplaying-label-v17 {
    display: block !important;
    flex: 0 0 10px !important;
    width: 100% !important;
    height: 10px !important;
    min-height: 10px !important;
    max-height: 10px !important;
    margin: 0 !important;
    padding: 0 !important;
    color: #ff3030 !important;
    -webkit-text-fill-color: #ff3030 !important;
    font-size: 9px !important;
    font-weight: 900 !important;
    line-height: 10px !important;
    letter-spacing: .5px !important;
    text-align: center !important;
    white-space: nowrap !important;
    overflow: hidden !important;
}
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-nowplaying-title-v17 {
    display: block !important;
    flex: 0 0 13px !important;
    width: 100% !important;
    height: 13px !important;
    min-height: 13px !important;
    max-height: 13px !important;
    margin: 0 !important;
    padding: 0 2px !important;
    color: #fff !important;
    -webkit-text-fill-color: #fff !important;
    font-size: 9px !important;
    font-weight: 800 !important;
    line-height: 13px !important;
    text-align: center !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: clip !important;
    overflow-wrap: normal !important;
    word-break: normal !important;
    -webkit-line-clamp: unset !important;
    -webkit-box-orient: initial !important;
    text-shadow: 0 0 4px #fff, 0 0 8px #f00 !important;
}
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-nowplaying-title-v17.dbn-title-marquee {
    display: block !important;
    width: max-content !important;
    max-width: none !important;
    white-space: nowrap !important;
    overflow: visible !important;
}
@media (max-width: 600px) {
    .motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-overlay-v6 {
        padding: 2px 3px !important;
    }
    .motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-nowplaying-label-v17 {
        font-size: 8px !important;
    }
    .motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-nowplaying-title-v17 {
        font-size: 8px !important;
    }
}
`;
        document.head.appendChild(style);
        console.log("[DBN All-in-One V8] Targeted viewer layout correction installed.");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", installDBNViewerLayoutV8, { once: true });
    } else {
        installDBNViewerLayoutV8();
    }
})();


/* ==========================================================
   DBN ALL-IN-ONE V9 - VIEWER COUNT READABILITY ADJUSTMENT
   Built from V8. Gives the viewer number and VIEWERS label
   a larger dedicated row while retaining the other features.
   ========================================================== */
(function () {
    "use strict";

    function installDBNViewerCountLayoutV9() {
        if (document.getElementById("dbn-viewer-count-layout-v9")) return;

        var style = document.createElement("style");
        style.id = "dbn-viewer-count-layout-v9";
        style.textContent = `
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-overlay-v6 {
    grid-template-rows:
        minmax(11px, .75fr)
        minmax(8px, .45fr)
        minmax(34px, 2.05fr)
        minmax(10px, .55fr)
        minmax(28px, 1.55fr) !important;
    gap: 1px !important;
    padding: 3px 5px !important;
}
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-count-v6 {
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    gap: 2px !important;
    min-height: 34px !important;
    height: 100% !important;
    overflow: visible !important;
}
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-number-v6 {
    font-size: clamp(21px, 2.35vw, 30px) !important;
    line-height: 1.05 !important;
    min-height: 21px !important;
    overflow: visible !important;
}
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-label-v6 {
    font-size: clamp(9px, 1vw, 12px) !important;
    line-height: 1.1 !important;
    letter-spacing: 1.3px !important;
}
@media (max-width: 600px) {
    .motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-overlay-v6 {
        grid-template-rows:
            minmax(10px, .7fr)
            minmax(7px, .4fr)
            minmax(31px, 2fr)
            minmax(9px, .5fr)
            minmax(26px, 1.5fr) !important;
        padding: 2px 3px !important;
    }
    .motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-count-v6 {
        min-height: 31px !important;
    }
    .motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-number-v6 {
        font-size: clamp(19px, 4.5vw, 26px) !important;
    }
    .motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-label-v6 {
        font-size: 8px !important;
        letter-spacing: 1px !important;
    }
}
`;
        document.head.appendChild(style);
        console.log("[DBN All-in-One V9] Viewer count readability adjustment installed.");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", installDBNViewerCountLayoutV9, { once: true });
    } else {
        installDBNViewerCountLayoutV9();
    }
})();


/* ==========================================================
   DBN ALL-IN-ONE V10 - VIEWER NUMBER POSITION/SIZE TUNING
   Based on V9. Slightly raises and reduces the viewer number
   while preserving the dedicated count row and text spacing.
   ========================================================== */
(function () {
    "use strict";

    function installDBNViewerNumberTuningV10() {
        if (document.getElementById("dbn-viewer-number-tuning-v10")) return;

        var style = document.createElement("style");
        style.id = "dbn-viewer-number-tuning-v10";
        style.textContent = `
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-count-v6 {
    gap: 3px !important;
}
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-number-v6 {
    font-size: clamp(19px, 2.1vw, 27px) !important;
    line-height: 1.05 !important;
    transform: translateY(-2px) !important;
}
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-label-v6 {
    margin-top: 1px !important;
}
@media (max-width: 600px) {
    .motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-count-v6 {
        gap: 3px !important;
    }
    .motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-number-v6 {
        font-size: clamp(18px, 4.1vw, 23px) !important;
        transform: translateY(-1px) !important;
    }
}
`;
        document.head.appendChild(style);
        console.log("[DBN All-in-One V10] Viewer number position and size tuning installed.");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", installDBNViewerNumberTuningV10, { once: true });
    } else {
        installDBNViewerNumberTuningV10();
    }
})();


/* ==========================================================
   DBN ALL-IN-ONE V11 - FIRST-HOVER TITLE MARQUEE FIX
   Recalculates marquee when the media title is populated or
   updated during the first hover. All V10 features retained.
   ========================================================== */
(function () {
    "use strict";
    console.log("[DBN All-in-One V11] First-hover title marquee fix loaded.");
})();

/* ==========================================================
   DBN V18 - INNER-TEXT NOW-PLAYING MARQUEE
   Keeps the title viewport fixed while only the inner text moves.
   ========================================================== */
(function () {
    "use strict";
    if (document.getElementById("dbn-nowplaying-inner-marquee-v18")) return;
    var style = document.createElement("style");
    style.id = "dbn-nowplaying-inner-marquee-v18";
    style.textContent = `
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-nowplaying-title-v17 {
    display: block !important;
    position: relative !important;
    flex: 0 0 13px !important;
    width: 100% !important;
    height: 13px !important;
    min-height: 13px !important;
    max-height: 13px !important;
    overflow: hidden !important;
    white-space: nowrap !important;
    text-align: center !important;
    text-overflow: clip !important;
}
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-nowplaying-text-v18 {
    display: inline-block !important;
    position: relative !important;
    width: max-content !important;
    max-width: none !important;
    white-space: nowrap !important;
    transform: translateX(0);
    will-change: transform;
}
`;
    document.head.appendChild(style);
    console.log("[DBN Now Playing V18] Inner-text marquee layout installed.");
})();




/* ==========================================================
   DBN V21 - CLEAN CHANNEL-NAME HOVER MARQUEE
   One delegated hover handler; no stacked V16/V17/V19/V20 patches.
   Existing V18 video-title marquee is preserved.
   ========================================================== */
(function () {
    "use strict";
    if (window.DBNChannelNameMarqueeV21Loaded) return;
    window.DBNChannelNameMarqueeV21Loaded = true;

    var animations = new WeakMap();
    var currentBanner = null;

    var style = document.createElement("style");
    style.id = "dbn-channel-name-clean-v21";
    style.textContent = `
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-name-v6 {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    min-height: 0 !important;
    max-height: 100% !important;
    box-sizing: border-box !important;
    padding: 2px 3px !important;
    overflow: hidden !important;
    white-space: nowrap !important;
    overflow-wrap: normal !important;
    word-break: normal !important;
    scrollbar-width: none !important;
    cursor: default !important;
}
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-name-v6.dbn-channel-name-overflow-v22 {
    justify-content: flex-start !important;
}
.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-name-v6 > .dbn-channel-name-text-v21 {
    display: inline-block !important;
    flex: 0 0 auto !important;
    width: max-content !important;
    max-width: none !important;
    white-space: nowrap !important;
    overflow: visible !important;
    text-align: left !important;
    transform: translateX(0);
    will-change: transform;
}
`;
    document.head.appendChild(style);

    function getName(banner) {
        var name = banner && banner.querySelector(".dbn-viewer-name-v6");
        if (!name) return null;

        var text = name.querySelector(":scope > .dbn-channel-name-text-v21");
        if (!text) {
            text = document.createElement("span");
            text.className = "dbn-channel-name-text-v21";
            text.textContent = name.textContent || "";
            name.textContent = "";
            name.appendChild(text);
        }
        return { name: name, text: text };
    }

    function stop(banner) {
        if (!banner) return;
        var parts = getName(banner);
        var animation = parts && animations.get(parts.text);
        if (animation) {
            animation.cancel();
            animations.delete(parts.text);
        }
        if (parts) {
            parts.text.style.transform = "translateX(0px)";
            parts.name.classList.remove("dbn-channel-name-overflow-v22");
        }
        if (currentBanner === banner) currentBanner = null;
    }

    function start(banner) {
        var parts = getName(banner);
        if (!parts) return;

        stop(banner);
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                if (!banner.isConnected) return;

                var name = parts.name;
                var text = parts.text;
                var css = getComputedStyle(name);
                var pad = (parseFloat(css.paddingLeft) || 0) +
                          (parseFloat(css.paddingRight) || 0);
                var available = name.clientWidth - pad;
                var fullWidth = Math.ceil(text.getBoundingClientRect().width);
                var overflow = fullWidth - available;

                if (available <= 0 || overflow <= 3) {
                    name.classList.remove("dbn-channel-name-overflow-v22");
                    text.style.transform = "translateX(0px)";
                    return;
                }

                // Left-align the overflowing flex child before animating.
                // Otherwise justify-content:center offsets its starting edge
                // by half the overflow and clips the first character.
                name.classList.add("dbn-channel-name-overflow-v22");
                var distance = Math.ceil(overflow + 4);
                var duration = Math.max(5000, Math.min(18000, 4500 + distance * 35));
                var animation = text.animate(
                    [
                        { transform: "translateX(" + (-distance) + "px)" },
                        { transform: "translateX(0px)" }
                    ],
                    {
                        duration: duration,
                        iterations: Infinity,
                        direction: "alternate",
                        easing: "linear",
                        delay: 250
                    }
                );
                animations.set(text, animation);
                currentBanner = banner;
            });
        });
    }

    function findBanner(target) {
        return target && target.closest
            ? target.closest(".motd-banners a.dbn-viewer-banner-v6")
            : null;
    }

    document.addEventListener("pointerover", function (event) {
        var banner = findBanner(event.target);
        if (!banner) return;
        var from = event.relatedTarget;
        if (from && banner.contains(from)) return;
        if (currentBanner && currentBanner !== banner) stop(currentBanner);
        start(banner);
    }, true);

    document.addEventListener("pointerout", function (event) {
        var banner = findBanner(event.target);
        if (!banner) return;
        var to = event.relatedTarget;
        if (to && banner.contains(to)) return;
        stop(banner);
    }, true);

    document.addEventListener("focusin", function (event) {
        var banner = findBanner(event.target);
        if (banner) start(banner);
    }, true);

    document.addEventListener("focusout", function (event) {
        var banner = findBanner(event.target);
        if (!banner) return;
        var to = event.relatedTarget;
        if (to && banner.contains(to)) return;
        stop(banner);
    }, true);

    window.addEventListener("resize", function () {
        if (currentBanner) start(currentBanner);
    }, { passive: true });

    console.log("[DBN Channel Name V21] Clean delegated hover marquee ready.");
})();


/* ==========================================================
   DBN V23 - REMOVE RED VERTICAL CAROUSEL CARD SEPARATOR
   Keeps the outer carousel frame and banner artwork intact.
========================================================== */
(function () {
    "use strict";
    if (document.getElementById("dbn-carousel-no-red-separator-v23")) return;
    var style = document.createElement("style");
    style.id = "dbn-carousel-no-red-separator-v23";
    style.textContent = `
        .dbn-carousel-shell .dbn-carousel-set > .column + .column,
        .dbn-carousel-shell .dbn-carousel-set > .column {
            border-left: 0 !important;
            border-right: 0 !important;
        }
        .dbn-carousel-shell .dbn-carousel-set > .column + .column::before,
        .dbn-carousel-shell .dbn-carousel-set > .column + .column::after {
            content: none !important;
            display: none !important;
            border: 0 !important;
            box-shadow: none !important;
            background: none !important;
        }
        .dbn-carousel-shell .dbn-carousel-set > .column + .column > a {
            border-left: 0 !important;
        }
    `;
    document.head.appendChild(style);
})();


/* ==========================================================
   DBN V24 - REMOVE VERTICAL DIVIDER FROM CAROUSEL CARD WRAPPERS
   Scoped to the banner-card structure; preserves overlay borders
   and the outer carousel frame.
========================================================== */
(function () {
    "use strict";
    if (document.getElementById("dbn-carousel-card-divider-reset-v24")) return;
    var style = document.createElement("style");
    style.id = "dbn-carousel-card-divider-reset-v24";
    style.textContent = `
        .dbn-carousel-shell .dbn-carousel-set > .column,
        .dbn-carousel-shell .dbn-carousel-set > .column + .column,
        .dbn-carousel-shell .dbn-carousel-set > .column > a,
        .dbn-carousel-shell .dbn-carousel-set > .column + .column > a,
        .dbn-carousel-shell .dbn-carousel-set > .column > a > img,
        .dbn-carousel-shell .dbn-carousel-set > .column + .column > a > img {
            border-left: 0 !important;
            border-right: 0 !important;
            outline: 0 !important;
        }
        .dbn-carousel-shell .dbn-carousel-set > .column::before,
        .dbn-carousel-shell .dbn-carousel-set > .column::after,
        .dbn-carousel-shell .dbn-carousel-set > .column + .column::before,
        .dbn-carousel-shell .dbn-carousel-set > .column + .column::after,
        .dbn-carousel-shell .dbn-carousel-set > .column > a::before,
        .dbn-carousel-shell .dbn-carousel-set > .column > a::after,
        .dbn-carousel-shell .dbn-carousel-set > .column + .column > a::before,
        .dbn-carousel-shell .dbn-carousel-set > .column + .column > a::after {
            content: none !important;
            display: none !important;
            border: 0 !important;
            outline: 0 !important;
            box-shadow: none !important;
            background: transparent !important;
        }
    `;
    document.head.appendChild(style);
})();


/* ==========================================================
   DBN V25 - REMOVE CARD EDGE SHADOW / BORDER SEPARATOR
   Restricts reset to carousel card wrappers, links and images.
   Does not affect the carousel shell or viewer overlay.
========================================================== */
(function () {
    "use strict";
    if (document.getElementById("dbn-carousel-card-edge-reset-v25")) return;
    var style = document.createElement("style");
    style.id = "dbn-carousel-card-edge-reset-v25";
    style.textContent = `
        .dbn-carousel-shell .dbn-carousel-set > .column,
        .dbn-carousel-shell .dbn-carousel-set > .column > a,
        .dbn-carousel-shell .dbn-carousel-set > .column > a > img {
            border: 0 !important;
            outline: 0 !important;
            box-shadow: none !important;
        }
    `;
    document.head.appendChild(style);
})();


/* ==========================================================
   DBN V26 - REMOVE MOVING CAROUSEL-SET START DIVIDER
   V23-V25 targeted the cards inside each set, but not the
   .dbn-carousel-set wrapper itself. This targets only that
   moving wrapper and its pseudo-elements; banner overlays
   and the outer carousel frame remain untouched.
========================================================== */
(function () {
    "use strict";
    if (document.getElementById("dbn-carousel-set-start-reset-v26")) return;
    var style = document.createElement("style");
    style.id = "dbn-carousel-set-start-reset-v26";
    style.textContent = `
        .dbn-carousel-shell .dbn-carousel-track > .dbn-carousel-set {
            border-left: 0 !important;
            border-right: 0 !important;
            outline: 0 !important;
            box-shadow: none !important;
        }
        .dbn-carousel-shell .dbn-carousel-track > .dbn-carousel-set::before,
        .dbn-carousel-shell .dbn-carousel-track > .dbn-carousel-set::after {
            content: none !important;
            display: none !important;
            border: 0 !important;
            outline: 0 !important;
            box-shadow: none !important;
            background: transparent !important;
        }
    `;
    document.head.appendChild(style);
})();


/* DBN V27 - RESTORE THE NORMAL GAP AT EACH REPEATING SET SEAM.
   Right padding is included in the set's measured width, so the
   infinite-loop offset stays synchronized with the visible gap. */


/* DBN V28 - REMOVE RED SHADOW AROUND CAROUSEL FRAME.
   The red frame border and rounded corners remain intact. */



/* ==========================================================
   DBN V29 - RESTORE OUTER RED GLOW; REMOVE BOTTOM FRAME EDGE
   Preserves the top and side borders, carousel spacing, and
   all existing banner/hover behavior.
========================================================== */
(function () {
    "use strict";
    if (document.getElementById("dbn-carousel-frame-fix-v29")) return;

    var style = document.createElement("style");
    style.id = "dbn-carousel-frame-fix-v29";
    style.textContent = `
        .dbn-carousel-shell {
            border-bottom: 0 !important;
            box-shadow:
                inset 0 0 18px rgba(255,0,0,.20),
                0 0 10px rgba(255,0,0,.75),
                0 0 24px rgba(255,0,0,.35) !important;
        }
    `;
    document.head.appendChild(style);
})();



/* ==========================================================
   DBN V30 - REMOVE BOTTOM EDGE FROM MOVING CAROUSEL SETS
   The remaining line follows the moving banner sets, not the
   stationary outer shell. V26 had reset only left/right edges.
   Preserve V29's restored outer glow and shell border.
========================================================== */
(function () {
    "use strict";
    if (document.getElementById("dbn-carousel-moving-set-bottom-reset-v30")) return;

    var style = document.createElement("style");
    style.id = "dbn-carousel-moving-set-bottom-reset-v30";
    style.textContent = `
        .dbn-carousel-shell .dbn-carousel-track > .dbn-carousel-set {
            border-bottom: 0 !important;
            box-shadow: none !important;
            outline: 0 !important;
        }
        .dbn-carousel-shell .dbn-carousel-track > .dbn-carousel-set::before,
        .dbn-carousel-shell .dbn-carousel-track > .dbn-carousel-set::after {
            border-bottom: 0 !important;
            box-shadow: none !important;
            outline: 0 !important;
        }
    `;
    document.head.appendChild(style);
})();


/* ==========================================================
   DBN V35 - MOTD CHANNEL COUNTS
   Accounts for carousel initialization moving .motd-banners
   inside .dbn-carousel-shell. Built from working V30.
========================================================== */
(function () {
    "use strict";

    if (window.DBNMotdSectionCountsV35Loaded) return;
    window.DBNMotdSectionCountsV35Loaded = true;

    function installStyles() {
        if (document.getElementById("dbn-motd-section-counts-v35-style")) return;
        var style = document.createElement("style");
        style.id = "dbn-motd-section-counts-v35-style";
        style.textContent = `
            .dbn-motd-section-count-v35 {
                display:block !important;
                width:fit-content !important;
                max-width:100% !important;
                margin:5px auto 10px !important;
                padding:3px 13px 4px !important;
                box-sizing:border-box !important;
                border:1px solid rgba(190,0,0,.9) !important;
                border-radius:5px !important;
                background:rgba(0,0,0,.88) !important;
                color:#ff3030 !important;
                font-family:inherit !important;
                font-size:12px !important;
                font-weight:900 !important;
                letter-spacing:2px !important;
                line-height:1.35 !important;
                text-align:center !important;
                text-transform:uppercase !important;
                text-shadow:0 0 4px #f00,0 0 9px rgba(255,0,0,.9) !important;
                box-shadow:0 0 7px rgba(255,0,0,.45),inset 0 0 7px rgba(255,0,0,.12) !important;
                pointer-events:none !important;
            }
            @media(max-width:600px) {
                .dbn-motd-section-count-v35 {
                    margin:4px auto 8px !important;
                    padding:2px 10px 3px !important;
                    font-size:10px !important;
                    letter-spacing:1.5px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function findBannerContainer(heading) {
        var node = heading.nextElementSibling;
        while (node) {
            if (node.matches && node.matches(".movies-heading")) return null;

            if (node.matches && node.matches(".motd-banners")) return node;

            // The carousel wraps the original .motd-banners element in
            // .dbn-carousel-shell, so look inside each following sibling.
            if (node.querySelector) {
                var nested = node.querySelector(".motd-banners");
                if (nested) return nested;
            }
            node = node.nextElementSibling;
        }
        return null;
    }

    function countCards(container) {
        // Count only original direct-child banner cards, never carousel clones.
        var cards = container.children;
        var count = 0;
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            if (card.classList && card.classList.contains("column") &&
                card.querySelector("a[href] img")) count++;
        }
        return count;
    }

    function updateCounts() {
        var headings = document.querySelectorAll(".movies-heading");
        for (var i = 0; i < headings.length; i++) {
            var heading = headings[i];
            var container = findBannerContainer(heading);
            if (!container) continue;

            var count = countCards(container);
            var badge = heading.nextElementSibling;
            if (!badge || !badge.classList ||
                !badge.classList.contains("dbn-motd-section-count-v35")) {
                badge = document.createElement("div");
                badge.className = "dbn-motd-section-count-v35";
                heading.parentNode.insertBefore(badge, heading.nextSibling);
            }

            var label = count + (count === 1 ? " CHANNEL" : " CHANNELS");
            if (badge.textContent !== label) {
                badge.textContent = label;
                badge.setAttribute("aria-label", count + " channels in this section");
            }
        }
    }

    function initialize() {
        installStyles();
        updateCounts();

        if (!window.DBNMotdSectionCountsV35Observer) {
            var queued = false;
            window.DBNMotdSectionCountsV35Observer = new MutationObserver(function () {
                if (queued) return;
                queued = true;
                window.requestAnimationFrame(function () {
                    queued = false;
                    updateCounts();
                });
            });
            window.DBNMotdSectionCountsV35Observer.observe(document.body, {
                childList:true,
                subtree:true
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize, { once:true });
    } else {
        initialize();
    }
})();


/* ==========================================================
   DBN V36 - TIGHTEN CHANNEL COUNTER TO CAROUSEL SPACING
   Removes the original line break immediately after each
   injected counter and reduces the carousel's top margin.
   All V35 behavior remains unchanged.
========================================================== */
(function () {
    "use strict";
    if (document.getElementById("dbn-counter-carousel-spacing-v36")) return;

    var style = document.createElement("style");
    style.id = "dbn-counter-carousel-spacing-v36";
    style.textContent = `
        .dbn-motd-section-count-v35 {
            margin-bottom: 3px !important;
        }
        .dbn-motd-section-count-v35 + br {
            display: none !important;
        }
        .dbn-carousel-shell {
            margin-top: 4px !important;
        }
    `;
    document.head.appendChild(style);
})();































/* ==========================================================
   DBN ALL-IN-ONE V38 — RETRO NETWORK CHANNEL GUIDE
   Additive module; preserves all v36 features.
   Uses original .motd-banners links as the channel lineup.
   'Now playing' comes from the existing banner overlays.
   Future scheduling requires an additional data source.
   V38: Ten visible rows, vertical scroll, sticky header.
   ========================================================== */
(function () {
    'use strict';
    if (window.DBNRetroGuideV37Loaded) return;
    window.DBNRetroGuideV37Loaded = true;

    var ROOT_ID = 'dbn-retro-channel-guide-v37';
    var STYLE_ID = 'dbn-retro-channel-guide-style-v37';
    var refreshTimer = null;
    var currentSignature = '';
    var scrollY = 0;
    var scrollX = 0;

    function addStyles() {
        if (document.getElementById(STYLE_ID)) return;
        var style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
#${ROOT_ID} {
    width:100%;
    max-width:100%;
    margin:22px auto 12px;
    clear:both;
    color:#fff;
    font-family:Arial,Helvetica,sans-serif;
    box-sizing:border-box;
}
#${ROOT_ID} * {
    box-sizing:border-box;
}
#${ROOT_ID} .dbn-guide-shell {
    overflow:hidden;
    background:#090405;
    border:2px solid #a50000;
    border-radius:9px;
    box-shadow:
        inset 0 0 16px rgba(255,0,0,.16),
        0 0 13px rgba(255,0,0,.45);
}
#${ROOT_ID} .dbn-guide-titlebar {
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:8px;
    padding:10px 13px;
    background:linear-gradient(180deg,#420707,#170303);
    border-bottom:2px solid #a40000;
}
#${ROOT_ID} .dbn-guide-title {
    font-size:16px;
    font-weight:900;
    letter-spacing:2px;
    color:#fff;
    text-shadow:0 0 5px #f00,0 0 11px #f00;
}
#${ROOT_ID} .dbn-guide-subhead {
    font-size:10px;
    letter-spacing:1px;
    color:#ff7777;
    text-align:right;
}

/* V38: 10 CHANNELS VISIBLE */
#${ROOT_ID} .dbn-guide-scroll {
    max-width:100%;
    max-height:680px;
    overflow-x:auto;
    overflow-y:auto;
    scrollbar-width:thin;
    scrollbar-color:#ff3030 #160707;
}

/* RED SCROLLBAR */
#${ROOT_ID} .dbn-guide-scroll::-webkit-scrollbar {
    width:12px;
    height:10px;
}
#${ROOT_ID} .dbn-guide-scroll::-webkit-scrollbar-track {
    background:#160707;
}
#${ROOT_ID} .dbn-guide-scroll::-webkit-scrollbar-thumb {
    background:linear-gradient(#ff4040,#8b0000);
    border:2px solid #160707;
    border-radius:6px;
}
#${ROOT_ID} .dbn-guide-scroll::-webkit-scrollbar-thumb:hover {
    background:#ff6060;
}

#${ROOT_ID} .dbn-guide-grid {
    min-width:690px;
}
#${ROOT_ID} .dbn-guide-header,
#${ROOT_ID} .dbn-guide-row {
    display:grid;
    grid-template-columns:220px repeat(3,minmax(0,1fr));
}

/* V38: STICKY COLUMN HEADINGS */
#${ROOT_ID} .dbn-guide-header {
    position:sticky;
    top:0;
    z-index:20;
    height:40px;
    min-height:40px;
    background:#480c0c;
    color:#fff;
    font-size:12px;
    font-weight:900;
    letter-spacing:1px;
}
#${ROOT_ID} .dbn-guide-header > div {
    padding:9px 11px;
    border-right:1px solid #7f2222;
}

/* V38: FIXED ROW HEIGHT */
#${ROOT_ID} .dbn-guide-row {
    height:64px;
    min-height:64px;
    max-height:64px;
    overflow:hidden;
    border-top:1px solid #732020;
}
#${ROOT_ID} .dbn-guide-channel {
    display:flex;
    align-items:center;
    gap:9px;
    padding:9px 11px;
    background:#160708;
    color:#fff!important;
    text-decoration:none!important;
    border-right:1px solid #632020;
}
#${ROOT_ID} .dbn-guide-number {
    color:#ff3030;
    font-size:25px;
    font-weight:900;
    min-width:33px;
    text-shadow:0 0 7px rgba(255,0,0,.7);
}
#${ROOT_ID} .dbn-guide-name {
    display:-webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
    overflow:hidden;
    font-weight:900;
    font-size:12px;
    line-height:1.2;
    overflow-wrap:anywhere;
}
#${ROOT_ID} .dbn-guide-roomstate {
    color:#fa7878;
    font-size:10px;
    margin-top:3px;
}
#${ROOT_ID} .dbn-guide-cell {
    display:flex;
    flex-direction:column;
    justify-content:center;
    min-width:0;
    padding:9px 11px;
    border-right:1px solid #642222;
    background:#270d0f;
    color:#fff!important;
    text-decoration:none!important;
}
#${ROOT_ID} .dbn-guide-row:nth-child(2n) .dbn-guide-cell {
    background:#20090b;
}
#${ROOT_ID} .dbn-guide-cell .dbn-guide-program {
    display:block;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    font-size:13px;
    font-weight:800;
}
#${ROOT_ID} .dbn-guide-cell .dbn-guide-note {
    color:#d88b8b;
    font-size:10px;
    margin-top:4px;
}
#${ROOT_ID} .dbn-guide-channel:hover,
#${ROOT_ID} .dbn-guide-cell:hover,
#${ROOT_ID} .dbn-guide-channel:focus-visible,
#${ROOT_ID} .dbn-guide-cell:focus-visible {
    background:linear-gradient(180deg,#982626,#4f0808)!important;
    outline:1px solid #ff7777;
    outline-offset:-2px;
    box-shadow:inset 0 0 11px rgba(255,0,0,.5);
    color:#fff!important;
}
#${ROOT_ID} .dbn-guide-row.dbn-guide-current .dbn-guide-channel {
    background:#4d090b;
    box-shadow:inset 3px 0 #ff3737;
}
#${ROOT_ID} .dbn-guide-footer {
    padding:9px 12px;
    background:#120506;
    color:#c99191;
    font-size:11px;
    line-height:1.4;
}
#${ROOT_ID} .dbn-guide-empty {
    padding:18px 12px;
    color:#eee;
    font-size:12px;
}
@media(max-width:650px) {
    #${ROOT_ID} .dbn-guide-titlebar {
        padding:8px;
    }
    #${ROOT_ID} .dbn-guide-title {
        font-size:13px;
    }
    #${ROOT_ID} .dbn-guide-subhead {
        font-size:9px;
    }
}
`;
        document.head.appendChild(style);
    }

    function parseRoom(href) {
        try {
            var url = new URL(href, location.href);
            if (url.hostname !== 'cytu.be' &&
                url.hostname !== 'www.cytu.be') return null;

            var match = url.pathname.match(/^\/r\/([^/]+)/);

            return match
                ? decodeURIComponent(match[1])
                : null;

        } catch (error) {
            return null;
        }
    }

    function collectChannels() {
        var found = [];
        var seen = new Set();

        // Ignore cloned carousel copies.
        document.querySelectorAll(
            '.motd-banners:not([aria-hidden="true"]) > .column a[href]'
        ).forEach(function (link) {

            var room = parseRoom(link.href);

            if (!room || seen.has(room.toLowerCase())) return;

            seen.add(room.toLowerCase());

            var titleNode = link.querySelector(
                '.dbn-viewer-nowplaying-text-v18'
            );

            var playing = titleNode
                ? titleNode.textContent.trim()
                : '';

            if (/^(waiting for room info|nothing playing|unknown|loading)/i.test(playing)) {
                playing = '';
            }

            found.push({
                room: room,
                name: room.replace(/[-_]/g, ' '),
                playing: playing
            });
        });

        return found;
    }

    function makeElement(tag, className, text) {
        var node = document.createElement(tag);

        if (className) node.className = className;
        if (text != null) node.textContent = text;

        return node;
    }

    function makeLink(className, room) {
        var link = makeElement('a', className);

        link.href =
            'https://cytu.be/r/' + encodeURIComponent(room);

        link.title =
            'Switch to ' + room.replace(/[-_]/g, ' ');

        return link;
    }

    function ensureRoot() {
        var root = document.getElementById(ROOT_ID);
        var motd = document.querySelector('#motd');

        if (!motd) return null;

        if (!root) {
            root = makeElement('section');
            root.id = ROOT_ID;

            root.setAttribute(
                'aria-label',
                'DBN Network TV Guide'
            );

            motd.appendChild(root);
        }

        return root;
    }

    function render() {
        var root = ensureRoot();
        if (!root) return;

        var channels = collectChannels();

        // Future schedules are not yet connected.
        var signature = JSON.stringify(channels);

        if (signature === currentSignature && root.firstChild) {
            return;
        }

        currentSignature = signature;

        // V38: Remember scroll position on updates.
        var oldScroll = root.querySelector('.dbn-guide-scroll');

        if (oldScroll) {
            scrollY = oldScroll.scrollTop;
            scrollX = oldScroll.scrollLeft;
        }

        root.replaceChildren();

        var shell = makeElement('div', 'dbn-guide-shell');
        var titlebar = makeElement('div', 'dbn-guide-titlebar');

        titlebar.append(
            makeElement(
                'div',
                'dbn-guide-title',
                'DBN NETWORK · TV GUIDE'
            ),
            makeElement(
                'div',
                'dbn-guide-subhead',
                'CHOOSE A CHANNEL TO WATCH'
            )
        );

        shell.appendChild(titlebar);

        if (!channels.length) {

            shell.appendChild(
                makeElement(
                    'div',
                    'dbn-guide-empty',
                    'Channel listings will appear when your MOTD banners are loaded.'
                )
            );

        } else {

            var scroll = makeElement('div', 'dbn-guide-scroll');
            var grid = makeElement('div', 'dbn-guide-grid');
            var header = makeElement('div', 'dbn-guide-header');

            [
                'CHANNEL',
                'ON AIR NOW',
                'UP NEXT',
                'LATER'
            ].forEach(function (heading) {
                header.appendChild(
                    makeElement('div', '', heading)
                );
            });

            grid.appendChild(header);

            var currentRoom = parseRoom(location.href);

            channels.forEach(function (channel, index) {

                var isCurrent =
                    currentRoom &&
                    channel.room.toLowerCase() ===
                    currentRoom.toLowerCase();

                var row = makeElement(
                    'div',
                    'dbn-guide-row' +
                    (isCurrent ? ' dbn-guide-current' : '')
                );

                var side = makeLink(
                    'dbn-guide-channel',
                    channel.room
                );

                side.appendChild(
                    makeElement(
                        'span',
                        'dbn-guide-number',
                        String(index + 1).padStart(2, '0')
                    )
                );

                var label = makeElement('div');

                label.appendChild(
                    makeElement(
                        'div',
                        'dbn-guide-name',
                        channel.name.toUpperCase()
                    )
                );

                label.appendChild(
                    makeElement(
                        'div',
                        'dbn-guide-roomstate',
                        isCurrent
                            ? '● YOU ARE HERE'
                            : 'CLICK TO SWITCH'
                    )
                );

                side.appendChild(label);
                row.appendChild(side);

                var nowCell = makeLink(
                    'dbn-guide-cell',
                    channel.room
                );

                nowCell.appendChild(
                    makeElement(
                        'div',
                        'dbn-guide-program',
                        channel.playing ||
                        'Now playing unavailable'
                    )
                );

                nowCell.appendChild(
                    makeElement(
                        'div',
                        'dbn-guide-note',
                        channel.playing
                            ? 'LIVE TITLE · CLICK TO WATCH'
                            : 'CLICK TO WATCH'
                    )
                );

                row.appendChild(nowCell);

                [
                    'Schedule not connected',
                    'Schedule not connected'
                ].forEach(function (message) {

                    var cell = makeLink(
                        'dbn-guide-cell',
                        channel.room
                    );

                    cell.appendChild(
                        makeElement(
                            'div',
                            'dbn-guide-program',
                            message
                        )
                    );

                    cell.appendChild(
                        makeElement(
                            'div',
                            'dbn-guide-note',
                            'CLICK TO WATCH THIS CHANNEL'
                        )
                    );

                    row.appendChild(cell);
                });

                grid.appendChild(row);
            });

            scroll.appendChild(grid);
            shell.appendChild(scroll);
        }

        shell.appendChild(
            makeElement(
                'div',
                'dbn-guide-footer',
                'Live titles appear when banner data is available. Future program times require a schedule feed. Click any channel or program cell to switch rooms.'
            )
        );

        root.appendChild(shell);

        // V38: Restore position after attaching to page.
        var newScroll = root.querySelector('.dbn-guide-scroll');

        if (newScroll) {
            newScroll.scrollTop = scrollY;
            newScroll.scrollLeft = scrollX;
        }
    }

    function queueRender() {
        if (refreshTimer) return;

        refreshTimer = setTimeout(function () {
            refreshTimer = null;
            render();
        }, 500);
    }

    function initialize() {
        addStyles();
        queueRender();

        // Watch original banner changes, not guide changes.
        var observer = new MutationObserver(function (records) {

            if (records.some(function (record) {

                var element =
                    record.target.nodeType === 1
                        ? record.target
                        : record.target.parentElement;

                return element &&
                    element.closest &&
                    element.closest('.motd-banners');

            })) {
                queueRender();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        setInterval(queueRender, 15000);

        console.log(
            '[DBN V38] Retro network guide with 10-row scroll initialized.'
        );
    }

    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            initialize,
            { once: true }
        );
    } else {
        initialize();
    }

})();





























/* ============================================================
   DBN V41 - LIVE TITLES + PRESERVE LAST CONFIRMED TITLE
   Combined replacement for V40 and its V41 tick() patch.
   APPEND TO YOUR COMPLETE V38 FILE, NOT V39 OR V40.
   ============================================================ */
(function () {
    'use strict';
    if (window.DBNGuideLiveV41Loaded) return;
    window.DBNGuideLiveV41Loaded = true;

    var ROOT_ID = 'dbn-retro-channel-guide-v37';
    var cache = new Map();
    var pending = new Set();
    var queue = [];
    var activeCount = 0;
    var MAX_ACTIVE = 2;
    var LIVE_TTL = 90000;
    var FAIL_RETRY = 90000;

    function parseRoom(href) {
        try {
            var url = new URL(href, location.href);
            if (!/^(www\.)?cytu\.be$/i.test(url.hostname)) return '';
            var match = url.pathname.match(/^\/r\/([^/]+)/);
            return match ? decodeURIComponent(match[1]) : '';
        } catch (e) {
            return '';
        }
    }

    function getTitle(data) {
        var title = typeof data === 'string' ? data :
            data && typeof data.title === 'string' ? data.title :
            data && data.media && typeof data.media.title === 'string'
                ? data.media.title : '';
        return title.trim();
    }

    function meaningful(title) {
        return !!title && !/^(waiting for room info|nothing playing|now playing unavailable|checking live|checking channel|live lookup|live title could not|scroll here|schedule not connected)/i.test(title);
    }

    function bannerTitles() {
        var titles = new Map();
        document.querySelectorAll(
            '.motd-banners:not([aria-hidden="true"]) > .column > a[href]'
        ).forEach(function (link) {
            var room = parseRoom(link.href);
            var titleNode = link.querySelector('.dbn-viewer-nowplaying-text-v18');
            var title = titleNode ? titleNode.textContent.trim() : '';
            if (room && meaningful(title)) titles.set(room.toLowerCase(), title);
        });
        return titles;
    }

    async function lookup(room) {
        if (typeof window.io !== 'function') {
            throw new Error('Socket.IO client unavailable');
        }
        var response = await fetch(
            '/socketconfig/' + encodeURIComponent(room) + '.json',
            { cache: 'no-store' }
        );
        if (!response.ok) throw new Error('Room config HTTP ' + response.status);
        var config = await response.json();
        var servers = Array.from(new Set(
            (config.servers || []).filter(function (s) {
                return s.secure && s.url;
            }).map(function (s) { return s.url; })
        ));
        if (!servers.length) throw new Error('No secure socket server');

        function tryServer(server) {
            return new Promise(function (resolve, reject) {
                var socket;
                var done = false;
                var playlist = [];
                var sawPlaylist = false;
                var currentUid = null;
                var joined = false;
                var emptyTimer = null;
                var timer = null;

                function finish(error, result) {
                    if (done) return;
                    done = true;
                    clearTimeout(timer);
                    clearTimeout(emptyTimer);
                    if (socket) {
                        socket.removeAllListeners();
                        socket.disconnect();
                    }
                    if (error) reject(error);
                    else resolve(result);
                }

                function checkPlaylist() {
                    if (done) return;
                    if (currentUid !== null && String(currentUid) !== '-1') {
                        var item = playlist.find(function (entry) {
                            return String(entry.uid) === String(currentUid);
                        });
                        var title = item && getTitle(item.media || item);
                        if (title) {
                            finish(null, { title: title, empty: false });
                            return;
                        }
                    }
                    if (joined && sawPlaylist &&
                        (!playlist.length || String(currentUid) === '-1') &&
                        !emptyTimer) {
                        emptyTimer = setTimeout(function () {
                            finish(null, { title: '', empty: true });
                        }, 3500);
                    }
                }

                try {
                    socket = window.io(server, {
                        transports: ['websocket'],
                        forceNew: true,
                        reconnection: false,
                        timeout: 17000
                    });
                } catch (error) {
                    finish(error);
                    return;
                }

                timer = setTimeout(function () {
                    if (joined && sawPlaylist && !playlist.length) {
                        finish(null, { title: '', empty: true });
                    } else {
                        finish(new Error('No current media response within 20 seconds'));
                    }
                }, 20000);

                socket.on('connect', function () {
                    socket.emit('joinChannel', { name: room });
                });
                socket.on('setPermissions', function () {
                    joined = true;
                    checkPlaylist();
                });
                socket.on('changeMedia', function (media) {
                    var title = getTitle(media);
                    if (title) finish(null, { title: title, empty: false });
                });
                socket.on('playlist', function (data) {
                    playlist = Array.isArray(data) ? data :
                        data && Array.isArray(data.items) ? data.items : [];
                    sawPlaylist = true;
                    checkPlaylist();
                });
                socket.on('setCurrent', function (data) {
                    currentUid = data && typeof data === 'object'
                        ? data.uid : data;
                    checkPlaylist();
                });
                socket.on('needPassword', function () {
                    finish(new Error('Password required'));
                });
                socket.on('connect_error', function (error) {
                    finish(new Error('Connection failed: ' +
                        (error && error.message || 'unknown')));
                });
                socket.on('disconnect', function () {
                    finish(new Error('Disconnected before media arrived'));
                });
            });
        }

        var lastError;
        for (var i = 0; i < servers.length; i++) {
            try {
                return await tryServer(servers[i]);
            } catch (error) {
                lastError = error;
            }
        }
        throw lastError || new Error('No server responded');
    }

    function getVisible() {
        var root = document.getElementById(ROOT_ID);
        if (!root) return [];
        var scroll = root.querySelector('.dbn-guide-scroll');
        if (!scroll) return [];
        var bounds = root.getBoundingClientRect();
        if (document.hidden || bounds.bottom < -150 ||
            bounds.top > window.innerHeight + 150) return [];
        var viewport = scroll.getBoundingClientRect();
        return Array.from(scroll.querySelectorAll('.dbn-guide-row'))
            .filter(function (row) {
                var rect = row.getBoundingClientRect();
                return rect.bottom > viewport.top + 39 &&
                    rect.top < viewport.bottom;
            }).slice(0, 10);
    }

    function paint(row, item, active) {
        var title = row.querySelector('.dbn-guide-cell .dbn-guide-program');
        var note = row.querySelector('.dbn-guide-cell .dbn-guide-note');
        if (!title || !note) return;
        var label, status;
        if (item && item.title) {
            label = item.title;
            status = item.failed ? 'LAST CONFIRMED · RETRYING' :
                Date.now() > item.next ? 'LAST CONFIRMED · UPDATING' :
                'ON AIR · CLICK TO WATCH';
        } else if (item && item.empty) {
            label = 'Nothing playing';
            status = 'CHANNEL CONNECTED · NO VIDEO';
        } else if (item && item.failed) {
            label = 'Live title could not be confirmed';
            status = 'RETRYING · CLICK TO WATCH';
        } else if (active) {
            label = 'Checking channel...';
            status = 'CONNECTING';
        } else {
            return;
        }
        if (title.textContent !== label) title.textContent = label;
        if (note.textContent !== status) note.textContent = status;
    }

    function pump() {
        while (activeCount < MAX_ACTIVE && queue.length) {
            var room = queue.shift();
            var key = room.toLowerCase();
            var visible = getVisible().some(function (row) {
                var link = row.querySelector('.dbn-guide-channel[href]');
                return link && parseRoom(link.href).toLowerCase() === key;
            });
            if (!visible) {
                pending.delete(key);
                continue;
            }
            activeCount++;
            (function (name, roomKey) {
                lookup(name).then(function (result) {
                    cache.set(roomKey, {
                        title: result.title,
                        empty: result.empty,
                        failed: false,
                        next: Date.now() + LIVE_TTL
                    });
                }).catch(function (error) {
                    var previous = cache.get(roomKey) || {};
                    cache.set(roomKey, {
                        // Never erase a verified title due to lookup failure.
                        title: previous.title || '',
                        empty: false,
                        failed: true,
                        next: Date.now() + FAIL_RETRY
                    });
                    console.warn('[DBN V41] ' + name + ': ' + error.message);
                }).finally(function () {
                    activeCount--;
                    pending.delete(roomKey);
                    tick();
                    pump();
                });
            })(room, key);
        }
    }

    function tick() {
        var rows = getVisible();
        var bannerMap = bannerTitles();
        var now = Date.now();
        rows.forEach(function (row) {
            var link = row.querySelector('.dbn-guide-channel[href]');
            if (!link) return;
            var room = parseRoom(link.href);
            if (!room) return;
            var key = room.toLowerCase();
            var existing = cache.get(key);
            var titleNode = row.querySelector('.dbn-guide-cell .dbn-guide-program');
            var noteNode = row.querySelector('.dbn-guide-cell .dbn-guide-note');
            var displayedTitle = titleNode ? titleNode.textContent.trim() : '';
            var displayedNote = noteNode ? noteNode.textContent.trim() : '';
            var guideTitle = /^LIVE TITLE\b/i.test(displayedNote) &&
                meaningful(displayedTitle) ? displayedTitle : '';
            var observedTitle = guideTitle || bannerMap.get(key) || '';

            // Capture known-good banner titles before an unsuccessful lookup
            // can overwrite the guide's display. Do not replace cached titles
            // with potentially older banner data.
            if (observedTitle && (!existing || !existing.title)) {
                existing = {
                    title: observedTitle,
                    empty: false,
                    failed: true,
                    next: now
                };
                cache.set(key, existing);
            }
            paint(row, existing, true);
            if (pending.has(key) || (existing && now < existing.next)) return;
            pending.add(key);
            queue.push(room);
        });
        pump();
    }

    function initialize() {
        tick();
        setInterval(tick, 3000);
        console.log('[DBN V41] Combined live-title and title-preservation module active.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    } else {
        initialize();
    }
})();
