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

        var delta = Math.min(
            (timestamp - lastFrame) / 1000,
            0.05
        );

        lastFrame = timestamp;

        if (!document.hidden) {
            activeCarousels.forEach(function (state, index) {
                if (state.paused || !state.setWidth) return;

                // Reverse only carousels 2 and 4.
                var reverse = (index === 1 || index === 3);

                state.offset +=
                    (reverse ? -1 : 1) * CONFIG.speed * delta;

                // Seamless looping in both directions.
                if (state.offset >= state.setWidth) {
                    state.offset -= state.setWidth;
                }

                if (state.offset < 0) {
                    state.offset += state.setWidth;
                }

                state.track.style.transform =
                    "translate3d(" + (-state.offset) + "px,0,0)";
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
   DBN NETWORK CHANNEL SEARCH — MOTD MODULE V2 (TAGS + GENRES)
   Embedded in DBN All-in-One V44; replaces V43 search V1.
   The existing viewer counts, carousels and MOTD stay intact.

   - Searches channel names, URL slugs, and descriptive tags.
   - Horror finds Slasher TV even if its name omits "horror".
   - Automatic genre detection plus custom per-channel tags.
   - Builds a prominent search interface inside #motd.
   - Discovers all channel banners on the page (no extra API).
   - Leaves navbar search, MOTD HTML and CSS untouched.
========================================================== */
(function () {
    'use strict';

    if (window.DBNMotdNetworkSearchV2Loaded) return;
    window.DBNMotdNetworkSearchV2Loaded = true;

    var ROOT_ID = 'dbn-network-search-v2';
    var STYLE_ID = 'dbn-network-search-v2-css';
    var input = null;
    var results = null;
    var counter = null;
    var status = null;
    var channels = [];
    var refreshTimer = null;
    var MAX_RESULTS = 36;

    /* ======================================================
       CUSTOM SEARCH TAGS — edit or extend this dictionary.
       Keys may be the channel's /r/ name or displayed title.
       Example: "Slasher TV" also matches "horror" searches.
       Tags are search metadata, not changes to any channel.
    ====================================================== */
    var CHANNEL_TAGS = {
        'slasher tv': ['horror', 'scary', 'thriller', 'suspense', 'slasher', 'gore'],
        'slashertv': ['horror', 'scary', 'thriller', 'suspense', 'slasher', 'gore']
    };

    // Genre aliases apply to EVERY channel whose name/slug
    // contains the listed related words; no 97-item tag list.
    var GENRE_RULES = [
        { test: /slasher|horror|haunt|ghost|scary|fright|creep|zombie|vampire|monster|terror|scream|nightmare|spooky/i,
          tags: ['horror', 'scary', 'slasher', 'thriller', 'suspense'] },
        { test: /comedy|comedies|sitcom|funny|humor|laugh|standup/i,
          tags: ['comedy', 'funny', 'humor', 'sitcom'] },
        { test: /action|adventure|martial|kungfu|superhero/i,
          tags: ['action', 'adventure', 'thriller'] },
        { test: /sci.?fi|science.?fiction|space|alien|futuristic|cyberpunk/i,
          tags: ['sci-fi', 'scifi', 'science fiction', 'space', 'fantasy'] },
        { test: /sports?|football|baseball|basketball|soccer|hockey|tennis|wrestling|boxing|racing/i,
          tags: ['sports', 'athletics', 'games'] },
        { test: /cartoon|animation|animated|anime|toons/i,
          tags: ['cartoons', 'animation', 'animated', 'anime'] },
        { test: /documentary|documentaries|history|nature|wildlife|educational/i,
          tags: ['documentary', 'educational', 'nonfiction'] },
        { test: /music|concert|rock|hip.?hop|jazz|metal|pop.?hits/i,
          tags: ['music', 'concerts', 'songs'] },
        { test: /drama|romance|romantic|soap.?opera/i,
          tags: ['drama', 'romance', 'relationships'] },
        { test: /classic|retro|vintage|oldies|nostalgia/i,
          tags: ['classic', 'retro', 'vintage', 'nostalgia'] },
        { test: /mystery|detective|crime|whodunit/i,
          tags: ['mystery', 'crime', 'detective', 'suspense'] },
        { test: /video.?game|gaming|gameplay|esports/i,
          tags: ['gaming', 'video games', 'esports'] },
        { test: /kids|children|family/i,
          tags: ['kids', 'family', 'children'] }
    ];

    function normalize(text) {
        return String(text || '').toLowerCase()
            .replace(/&/g, ' and ')
            .replace(/[^a-z0-9]+/g, ' ')
            .replace(/\s+/g, ' ').trim();
    }

    function channelTags(name, room, link, image) {
        var normalizedName = normalize(name);
        var normalizedRoom = normalize(room);
        var combined = normalizedName + ' ' + normalizedRoom;
        var compact = combined.replace(/\s/g, '');
        var found = [];

        function add(tags) {
            (Array.isArray(tags) ? tags : String(tags || '').split(',')).forEach(function (tag) {
                var clean = normalize(tag);
                if (clean && found.indexOf(clean) < 0) found.push(clean);
            });
        }

        [normalizedRoom, normalizedName, compact].forEach(function (key) {
            if (Object.prototype.hasOwnProperty.call(CHANNEL_TAGS, key)) add(CHANNEL_TAGS[key]);
        });
        GENRE_RULES.forEach(function (rule) {
            if (rule.test.test(combined) || rule.test.test(compact)) add(rule.tags);
        });
        [link, image].forEach(function (node) {
            if (!node) return;
            add(node.getAttribute('data-tags'));
            add(node.getAttribute('data-genres'));
            add(node.getAttribute('data-keywords'));
        });
        return found;
    }


    function findMOTD() {
        return document.getElementById('motd') ||
            document.querySelector('#motdwrap, .motd-container, .motd');
    }

    function channelRoom(raw) {
        if (!raw) return null;
        raw = raw.trim();
        try {
            var room = '';
            if (/^https?:\/\//i.test(raw) || raw.startsWith('//')) {
                var url = new URL(raw, location.href);
                if (!/^(www\.)?cytu\.be$/i.test(url.hostname)) return null;
                var match = url.pathname.match(/^\/r\/([^/?#]+)/i);
                if (!match) return null;
                room = match[1];
            } else if (/^\/?r\//i.test(raw)) {
                room = raw.replace(/^\/?r\//i, '').split(/[?#/]/)[0];
            } else if (/^[a-z0-9_-]+$/i.test(raw)) {
                room = raw;
            } else {
                return null;
            }
            return decodeURIComponent(room).trim() || null;
        } catch (error) {
            return null;
        }
    }

    function collectChannels() {
        var unique = new Map();
        // Original banner links remain in the DOM when carousels are running.
        document.querySelectorAll('.motd-banners .column a[href]').forEach(function (link) {
            var room = channelRoom(link.getAttribute('href'));
            if (!room) return;
            var key = room.toLowerCase();

            var image = link.querySelector('img');
            var overlayName = link.querySelector('.dbn-viewer-name-v6');
            var name = (
                (image && image.getAttribute('alt')) ||
                link.getAttribute('aria-label') ||
                (overlayName && overlayName.textContent) ||
                link.getAttribute('title') ||
                room.replace(/[-_]/g, ' ')
            ).trim();
            if (!name) name = room;

            var tags = channelTags(name, room, link, image);
            var next = {
                room: room,
                name: name,
                tags: tags,
                url: '/r/' + encodeURIComponent(room),
                search: normalize(name + ' ' + room + ' ' + tags.join(' '))
            };

            // Prefer a fuller channel name, e.g., image alt instead of room slug.
            if (!unique.has(key) || next.name.length > unique.get(key).name.length) {
                unique.set(key, next);
            }
        });
        return Array.from(unique.values()).sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
    }

    function addStyles() {
        if (document.getElementById(STYLE_ID)) return;
        var css = document.createElement('style');
        css.id = STYLE_ID;
        css.textContent = `
#${ROOT_ID}, #${ROOT_ID} * { box-sizing:border-box; }
#${ROOT_ID} {
    width:min(100%,1050px); margin:18px auto 26px; padding:18px 18px 16px;
    color:#fff; text-align:center; font-family:Arial,Helvetica,sans-serif;
    background:linear-gradient(130deg,rgba(40,0,0,.97),rgba(4,4,10,.98) 55%,rgba(57,0,0,.95));
    border:2px solid #e52828; border-radius:13px;
    box-shadow:inset 0 0 22px rgba(229,20,20,.15),0 0 10px rgba(255,0,0,.65),0 0 28px rgba(255,0,0,.22);
    position:relative; z-index:2;
}
#${ROOT_ID} .dbn-search-title { margin:0 0 5px; font-size:clamp(19px,3vw,29px); font-weight:900; letter-spacing:1.3px; text-transform:uppercase; text-shadow:0 0 8px #f00,0 0 15px rgba(255,0,0,.6); }
#${ROOT_ID} .dbn-search-caption { margin:0 0 13px; color:#ddd; font-size:13px; }
#${ROOT_ID} .dbn-search-field { display:flex; align-items:center; gap:10px; padding:5px 13px; border:1px solid #ec4949; border-radius:9px; background:rgba(0,0,0,.92); box-shadow:inset 0 0 10px rgba(180,0,0,.2); }
#${ROOT_ID} .dbn-search-symbol { font-size:22px; flex:none; }
#${ROOT_ID} .dbn-search-input { display:block; flex:1; min-width:0; width:100%; height:43px; margin:0; padding:6px 0; border:0!important; outline:0!important; background:transparent!important; color:#fff!important; box-shadow:none!important; font-size:clamp(14px,2vw,18px); }
#${ROOT_ID} .dbn-search-input::placeholder { color:#aaa!important; opacity:1; }
#${ROOT_ID} .dbn-search-input:focus { box-shadow:none!important; }
#${ROOT_ID} .dbn-search-field:focus-within { border-color:#fff; box-shadow:0 0 12px rgba(255,0,0,.65); }
#${ROOT_ID} .dbn-search-clear { display:none; flex:none; cursor:pointer; color:#fff; font-size:13px; background:#701111; border:1px solid #b22; border-radius:6px; padding:5px 9px; }
#${ROOT_ID} .dbn-search-clear:hover { background:#aa1414; }
#${ROOT_ID} .dbn-search-status { margin:8px 0 0; color:#ffb5b5; font-size:12px; min-height:15px; }
#${ROOT_ID} .dbn-search-results { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr)); gap:7px; margin-top:10px; text-align:left; }
#${ROOT_ID} .dbn-search-result { display:flex; flex-direction:column; gap:3px; min-width:0; padding:11px 12px; color:#fff!important; text-decoration:none!important; background:rgba(30,0,0,.92); border:1px solid rgba(255,80,80,.55); border-radius:7px; transition:background .15s,border-color .15s,transform .15s; }
#${ROOT_ID} .dbn-search-result:hover, #${ROOT_ID} .dbn-search-result:focus-visible { background:rgba(96,0,0,.95); border-color:#fff; transform:translateY(-1px); outline:0; }
#${ROOT_ID} .dbn-search-result-name { font-size:14px; font-weight:800; line-height:1.3; overflow-wrap:anywhere; }
#${ROOT_ID} .dbn-search-result-room { color:#ffaaaa; font-size:11px; overflow-wrap:anywhere; }
#${ROOT_ID} .dbn-search-result-tags { color:#f3baba; font-size:11px; overflow-wrap:anywhere; }
#${ROOT_ID} .dbn-search-genres { display:flex; flex-wrap:wrap; justify-content:center; align-items:center; gap:6px; margin-top:10px; }
#${ROOT_ID} .dbn-search-genres-label { color:#dfc0c0; font-size:11px; margin-right:3px; }
#${ROOT_ID} .dbn-search-genre { cursor:pointer; background:rgba(76,11,18,.85); color:#ffdede; font-size:11px; border:1px solid #9d454c; border-radius:15px; padding:5px 10px; }
#${ROOT_ID} .dbn-search-genre:hover, #${ROOT_ID} .dbn-search-genre[aria-pressed="true"] { background:#bc1a26; border-color:#fff; color:#fff; }
#${ROOT_ID} .dbn-search-empty { grid-column:1/-1; text-align:center; padding:12px; color:#ffb9b9; font-size:13px; }
@media(max-width:600px) { #${ROOT_ID} { padding:12px 10px; margin:11px auto 16px; } #${ROOT_ID} .dbn-search-input { height:36px; } #${ROOT_ID} .dbn-search-results { grid-template-columns:1fr; } }
@media(prefers-reduced-motion:reduce) { #${ROOT_ID} .dbn-search-result { transition:none; } }
`;
        document.head.appendChild(css);
    }

    function renderResults() {
        if (!input || !results || !counter || !status) return;
        var query = normalize(input.value);
        var clear = document.getElementById(ROOT_ID + '-clear');
        if (clear) clear.style.display = query ? 'inline-block' : 'none';
        counter.textContent = 'Search ' + channels.length + ' DBN channels by name or genre';
        document.querySelectorAll('#' + ROOT_ID + ' .dbn-search-genre').forEach(function (button) {
            button.setAttribute('aria-pressed', String(normalize(button.textContent) === query));
        });
        results.replaceChildren();
        if (!query) {
            status.textContent = 'Start typing to find a channel.';
            return;
        }

        var words = query.split(' ').filter(Boolean);
        var matches = channels.filter(function (item) {
            return words.every(function (word) { return item.search.indexOf(word) !== -1; });
        }).sort(function (a, b) {
            function priority(item) {
                var name = normalize(item.name);
                var room = normalize(item.room);
                if (name === query || room === query) return 4;
                if (name.startsWith(query) || room.startsWith(query)) return 3;
                if (name.indexOf(query) >= 0 || room.indexOf(query) >= 0) return 2;
                return 1; // keyword/genre tag matches
            }
            return priority(b) - priority(a) || a.name.localeCompare(b.name);
        });

        status.textContent = matches.length + (matches.length === 1 ? ' matching channel' : ' matching channels');
        if (!matches.length) {
            var empty = document.createElement('div');
            empty.className = 'dbn-search-empty';
            empty.textContent = 'No DBN channels match your search.';
            results.appendChild(empty);
            return;
        }

        matches.slice(0, MAX_RESULTS).forEach(function (item) {
            var link = document.createElement('a');
            link.className = 'dbn-search-result';
            link.href = item.url;
            var title = document.createElement('span');
            title.className = 'dbn-search-result-name';
            title.textContent = item.name;
            var room = document.createElement('span');
            room.className = 'dbn-search-result-room';
            room.textContent = '/r/' + item.room;
            link.appendChild(title);
            link.appendChild(room);
            if (item.tags.length) {
                var tags = document.createElement('span');
                tags.className = 'dbn-search-result-tags';
                tags.textContent = 'Tags: ' + item.tags.slice(0, 5).join(' · ');
                link.appendChild(tags);
            }
            results.appendChild(link);
        });

        if (matches.length > MAX_RESULTS) {
            status.textContent += ' · showing the first ' + MAX_RESULTS + ' (type more to narrow)';
        }
    }

    function createSearch() {
        var motd = findMOTD();
        if (!motd) return false;
        addStyles();
        var root = document.getElementById(ROOT_ID);
        if (!root) {
            root = document.createElement('section');
            root.id = ROOT_ID;
            root.setAttribute('aria-label', 'Search the DBN channel network');
            root.innerHTML =
                '<h2 class="dbn-search-title">🔎 Search DBN TV</h2>' +
                '<p class="dbn-search-caption" id="' + ROOT_ID + '-counter">Search DBN channels</p>' +
                '<div class="dbn-search-field">' +
                '<span class="dbn-search-symbol" aria-hidden="true">⌕</span>' +
                '<input class="dbn-search-input" id="' + ROOT_ID + '-input" type="search" autocomplete="off" spellcheck="false" placeholder="Try horror, comedy, sports, Slasher TV..." aria-label="Search DBN channels by name or genre" />' +
                '<button class="dbn-search-clear" id="' + ROOT_ID + '-clear" type="button">Clear</button>' +
                '</div>' +
                '<div class="dbn-search-genres" aria-label="Browse by genre">' +
                '<span class="dbn-search-genres-label">Quick searches:</span>' +
                ['Horror', 'Comedy', 'Action', 'Sci-Fi', 'Sports', 'Cartoons'].map(function (genre) {
                    return '<button type="button" class="dbn-search-genre" aria-pressed="false">' + genre + '</button>';
                }).join('') +
                '</div>' +
                '<p class="dbn-search-status" id="' + ROOT_ID + '-status" role="status" aria-live="polite"></p>' +
                '<div class="dbn-search-results" id="' + ROOT_ID + '-results"></div>';
            input = root.querySelector('.dbn-search-input');
            results = root.querySelector('.dbn-search-results');
            counter = root.querySelector('.dbn-search-caption');
            status = root.querySelector('.dbn-search-status');
            input.addEventListener('input', renderResults);
            root.querySelectorAll('.dbn-search-genre').forEach(function (button) {
                button.addEventListener('click', function () {
                    input.value = button.textContent;
                    renderResults();
                    input.focus();
                });
            });
            input.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    var first = results.querySelector('a.dbn-search-result');
                    if (first) { event.preventDefault(); first.click(); }
                }
                if (event.key === 'Escape') {
                    input.value = '';
                    renderResults();
                }
            });
            root.querySelector('.dbn-search-clear').addEventListener('click', function () {
                input.value = '';
                renderResults();
                input.focus();
            });
        } else {
            input = root.querySelector('.dbn-search-input');
            results = root.querySelector('.dbn-search-results');
            counter = root.querySelector('.dbn-search-caption');
            status = root.querySelector('.dbn-search-status');
        }
        if (root.parentElement !== motd || motd.firstElementChild !== root) {
            motd.insertBefore(root, motd.firstChild);
        }
        return true;
    }

    function refresh() {
        if (!createSearch()) return;
        var next = collectChannels();
        // Preserve the typed query. Re-render only if the channel list changed.
        var oldSignature = channels.map(function (ch) { return ch.room + ':' + ch.name + ':' + ch.tags.join(','); }).join('|');
        var newSignature = next.map(function (ch) { return ch.room + ':' + ch.name + ':' + ch.tags.join(','); }).join('|');
        if (oldSignature !== newSignature) {
            channels = next;
            renderResults();
        } else if (status && !status.textContent) {
            // Also initialize a newly recreated MOTD search panel.
            renderResults();
        }
    }

    function queueRefresh() {
        if (refreshTimer !== null) return;
        refreshTimer = setTimeout(function () {
            refreshTimer = null;
            refresh();
        }, 300);
    }

    function initialize() {
        refresh();
        var observer = new MutationObserver(function (records) {
            var root = document.getElementById(ROOT_ID);
            var relevant = records.some(function (record) {
                var target = record.target;
                if (root && (target === root || root.contains(target))) return false;
                if (record.type === 'attributes') return Boolean(target.closest && target.closest('.motd-banners'));
                if (target.nodeType === 1 && target.closest &&
                    target.closest('.motd-banners')) return true;
                return Array.from(record.addedNodes).some(function (node) {
                    return node.nodeType === 1 && (
                        (node.matches && node.matches('#motd, .motd-banners')) ||
                        (node.querySelector && node.querySelector('#motd, .motd-banners'))
                    );
                });
            });
            if (relevant) queueRefresh();
        });
        observer.observe(document.body, {
            childList: true, subtree: true, attributes: true,
            attributeFilter: ['data-tags', 'data-genres', 'data-keywords', 'alt', 'title']
        });
        console.log('[DBN Network Search V2] MOTD channel + genre search ready.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    } else {
        initialize();
    }
})();
