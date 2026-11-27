/* DBN all-in-one V55 · 97 channels · 724 curated search tags · imported from ODS · Module SHA256: 6ec748384784e4beec56c70ccf56501d081aac95ac41a1f3bc07ccc0d1b8e077 */
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
            lastTime: 0,
            // Stable automatic scrolling direction, based on visible order.
            dbnDirection: 1
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
            activeCarousels.forEach(function (state) {
                if (state.paused || !state.setWidth) return;

                // Direction is assigned from current page order, not array index.
                // This survives CyTube dynamically replacing MOTD carousels.
                state.offset += state.dbnDirection * CONFIG.speed * delta;

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

        // Discard old carousels when CyTube replaces/reloads MOTD content.
        // Otherwise the animation array becomes out of sync with the page.
        activeCarousels = activeCarousels.filter(function (state) {
            return state.shell.isConnected;
        });

        // Use the actual top-to-bottom order of currently visible carousels:
        // 1 and 3 go right-to-left; 2 and 4 go left-to-right.
        var shells = Array.from(document.querySelectorAll(".dbn-carousel-shell"));
        activeCarousels.forEach(function (state) {
            var position = shells.indexOf(state.shell);
            if (position < 0) return;
            state.dbnDirection = (position % 2 === 0) ? 1 : -1;
        });
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
        console.log("[DBN Carousel V55] Stable alternating carousel directions and DOM observer ready.");
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
        .dbn-carousel-shell .dbn-carousel-set > .column + .column::after,        .dbn-carousel-shell .dbn-carousel-set > .column > a::before,
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
   DBN NETWORK CHANNEL SEARCH — MOTD MODULE V4 (EDITABLE 97-CHANNEL TAG CATALOG)
   Embedded in DBN All-in-One V55; replaces the V44 search module.
   The existing viewer counts, carousels and MOTD stay intact.

   - Searches channel names, URL slugs, and descriptive tags.
   - Every existing channel automatically gets 7+ meaningful tags.
   - Additional channels receive category- and title-based tags.
   - Builds a prominent search interface inside #motd.
   - Discovers all channel banners on the page (no extra API).
   - Leaves navbar search, MOTD HTML and CSS untouched.
========================================================== */
(function () {
    'use strict';

    if (window.DBNMotdNetworkSearchV4Loaded) return;
    window.DBNMotdNetworkSearchV4Loaded = true;

    var ROOT_ID = 'dbn-network-search-v4';
    var STYLE_ID = 'dbn-network-search-v4-css';
    var input = null;
    var results = null;
    var counter = null;
    var status = null;
    var channels = [];
    var refreshTimer = null;
    var MAX_RESULTS = 36;

    /* ======================================================
       CURATED TAGS FOR EVERY CURRENT DBN MOTD CHANNEL (97)
       Each entry is keyed by its normalized /r/ channel slug.
       This metadata is automatically applied to MOTD banners;
       visitors never need to add tags or edit the MOTD.
       Each channel has at least seven individually relevant tags.
    ====================================================== */
    /* Search tags imported from DBN-97-Channel-Tag-Editor.ods on November 12, 2026. */
    var CHANNEL_TAGS = {
    "non stop action": [
        "action movies",
        "adventure",
        "stunts",
        "explosions",
        "fight scenes",
        "thrillers",
        "high octane",
        "blockbusters"
    ],
    "24 7 comedy": [
        "comedy movies",
        "funny",
        "humor",
        "laughs",
        "comedies",
        "funny films",
        "parody",
        "entertainment"
    ],
    "gore and more": [
        "horror",
        "gore",
        "splatter",
        "blood",
        "extreme horror",
        "cult horror",
        "graphic movies",
        "exploitation"
    ],
    "ed wood": [
        "cult cinema",
        "b movies",
        "camp",
        "low budget",
        "classic horror",
        "vintage movies",
        "so bad its good",
        "filmmakers"
    ],
    "so bad they are good": [
        "bad movies",
        "cult classics",
        "campy films",
        "b movies",
        "trash cinema",
        "cheesy movies",
        "so bad its good",
        "comedy"
    ],
    "theasylummovies": [
        "the asylum",
        "mockbusters",
        "b movies",
        "low budget",
        "disaster movies",
        "cult cinema",
        "monster movies",
        "action"
    ],
    "the breenverse": [
        "neil breen",
        "cult movies",
        "independent cinema",
        "so bad its good",
        "surreal",
        "outsider art",
        "b movies",
        "camp"
    ],
    "joe bob briggs": [
        "horror",
        "drive in movies",
        "b movies",
        "cult cinema",
        "movie host",
        "horror commentary",
        "camp",
        "exploitation"
    ],
    "hammer horror": [
        "horror",
        "gothic horror",
        "classic monsters",
        "vampires",
        "dracula",
        "british horror",
        "retro movies",
        "hammer films"
    ],
    "slashertv": [
        "horror",
        "slasher movies",
        "scary",
        "serial killers",
        "suspense",
        "gore",
        "thriller",
        "stalker films"
    ],
    "kaiju central": [
        "kaiju",
        "giant monsters",
        "godzilla",
        "japanese cinema",
        "creature features",
        "science fiction",
        "monster movies",
        "tokusatsu"
    ],
    "troma entertainment": [
        "troma",
        "cult movies",
        "exploitation",
        "horror comedy",
        "low budget",
        "b movies",
        "toxic avenger",
        "camp"
    ],
    "sanford and son": [
        "sitcom",
        "classic tv",
        "comedy",
        "1970s",
        "redd foxx",
        "family humor",
        "retro television"
    ],
    "reno 911": [
        "comedy",
        "mockumentary",
        "police parody",
        "improv",
        "sketch comedy",
        "sitcom",
        "comedy central"
    ],
    "the sopranos": [
        "mafia",
        "crime drama",
        "gangsters",
        "mob",
        "hbo",
        "organized crime",
        "tony soprano",
        "drama"
    ],
    "workaholics": [
        "workplace comedy",
        "sitcom",
        "comedy central",
        "slacker humor",
        "office comedy",
        "adult comedy",
        "friends"
    ],
    "sketch comedy": [
        "sketch comedy",
        "funny",
        "parody",
        "satire",
        "comedy sketches",
        "improvisation",
        "humor"
    ],
    "back when mtv was cool": [
        "mtv",
        "music videos",
        "retro television",
        "nostalgia",
        "1980s",
        "1990s",
        "music television",
        "classic mtv"
    ],
    "the whitest kids u know": [
        "sketch comedy",
        "wkuk",
        "alternative comedy",
        "parody",
        "satire",
        "funny",
        "comedy troupe"
    ],
    "columbotv": [
        "detective",
        "crime mystery",
        "police procedural",
        "investigation",
        "classic tv",
        "peter falk",
        "whodunit"
    ],
    "30 rock": [
        "sitcom",
        "workplace comedy",
        "tina fey",
        "satire",
        "nbc",
        "television industry",
        "funny"
    ],
    "classic trailer park boys": [
        "trailer park boys",
        "canadian comedy",
        "mockumentary",
        "sitcom",
        "cult tv",
        "bubbles",
        "trailer park"
    ],
    "classic nickelodeon": [
        "nickelodeon",
        "retro kids tv",
        "1990s",
        "nostalgia",
        "classic shows",
        "nick at nite",
        "family tv"
    ],
    "saturdaymorningcartoonschannel": [
        "cartoons",
        "saturday morning",
        "animation",
        "retro kids tv",
        "nostalgia",
        "classic cartoons",
        "family"
    ],
    "classic tv": [
        "classic television",
        "retro tv",
        "vintage shows",
        "nostalgia",
        "oldies",
        "reruns",
        "television classics",
        "1960s",
        "1960’s",
        "60s",
        "60’s"
    ],
    "classic tv 2": [
        "classic television",
        "retro tv",
        "vintage shows",
        "nostalgia",
        "oldies",
        "reruns",
        "television classics",
        "1970s",
        "1970’s",
        "70s",
        "70’s"
    ],
    "classic tv 3": [
        "classic television",
        "retro tv",
        "vintage shows",
        "nostalgia",
        "oldies",
        "reruns",
        "television classics",
        "1980s",
        "1980’s",
        "80s",
        "90’s"
    ],
    "best of snl": [
        "saturday night live",
        "snl",
        "sketch comedy",
        "late night",
        "parody",
        "celebrity impressions",
        "comedy"
    ],
    "tales from the crypt": [
        "horror",
        "anthology",
        "crypt keeper",
        "scary stories",
        "supernatural",
        "dark comedy",
        "thriller"
    ],
    "the muppets": [
        "muppets",
        "jim henson",
        "puppets",
        "family entertainment",
        "variety show",
        "comedy",
        "classic television"
    ],
    "nothing but commercials": [
        "tv commercials",
        "advertising",
        "vintage ads",
        "retro nostalgia",
        "classic commercials",
        "television history",
        "commercial breaks"
    ],
    "its always sunny": [
        "its always sunny in philadelphia",
        "dark comedy",
        "sitcom",
        "satire",
        "philadelphia",
        "adult humor",
        "the gang"
    ],
    "trailer park boys channel": [
        "trailer park boys",
        "canadian comedy",
        "mockumentary",
        "sitcom",
        "bubbles",
        "trailer park",
        "cult comedy"
    ],
    "malcolm in the middle": [
        "sitcom",
        "family comedy",
        "dysfunctional family",
        "2000s tv",
        "fox",
        "coming of age",
        "funny"
    ],
    "the office": [
        "workplace comedy",
        "mockumentary",
        "sitcom",
        "michael scott",
        "dunder mifflin",
        "office humor",
        "comedy"
    ],
    "married with children": [
        "sitcom",
        "al bundy",
        "classic comedy",
        "dysfunctional family",
        "retro tv",
        "1980s",
        "1990s"
    ],
    "twilight zone": [
        "sci fi",
        "anthology",
        "mystery",
        "supernatural",
        "classic television",
        "speculative fiction",
        "suspense"
    ],
    "arrested development": [
        "sitcom",
        "bluth family",
        "satire",
        "dysfunctional family",
        "comedy",
        "cult tv",
        "funny"
    ],
    "fox kids channel": [
        "fox kids",
        "1990s cartoons",
        "animation",
        "kids television",
        "nostalgia",
        "after school",
        "retro tv"
    ],
    "i love lucy": [
        "lucille ball",
        "classic sitcom",
        "1950s",
        "vintage comedy",
        "black and white",
        "retro tv",
        "family comedy"
    ],
    "breaking bad": [
        "crime drama",
        "walter white",
        "meth",
        "amc",
        "thriller",
        "antihero",
        "new mexico",
        "heisenberg"
    ],
    "better call saul": [
        "crime drama",
        "legal drama",
        "jimmy mcgill",
        "saul goodman",
        "lawyers",
        "breaking bad",
        "amc"
    ],
    "gilligans island": [
        "classic sitcom",
        "castaways",
        "desert island",
        "retro tv",
        "comedy",
        "vintage television",
        "1960s"
    ],
    "whose line is it anyway": [
        "improv comedy",
        "improvisation",
        "comedy games",
        "funny",
        "unscripted",
        "sketch humor",
        "drew carey"
    ],
    "kids in the hall": [
        "sketch comedy",
        "canadian comedy",
        "parody",
        "satire",
        "alternative comedy",
        "comedy troupe",
        "cult tv"
    ],
    "sliders": [
        "sci fi",
        "parallel universes",
        "alternate reality",
        "science fiction",
        "dimensional travel",
        "adventure",
        "1990s tv"
    ],
    "disney channel classic": [
        "disney channel",
        "classic disney",
        "kids shows",
        "family television",
        "nostalgia",
        "retro shows",
        "2000s"
    ],
    "thex files": [
        "sci fi",
        "aliens",
        "paranormal",
        "fbi",
        "conspiracies",
        "mystery",
        "supernatural",
        "mulder and scully"
    ],
    "twin peaks show": [
        "mystery",
        "david lynch",
        "surreal",
        "crime drama",
        "supernatural",
        "cult tv",
        "small town",
        "thriller"
    ],
    "eastbound and down": [
        "comedy",
        "baseball",
        "kenny powers",
        "sports comedy",
        "hbo",
        "dark humor",
        "sitcom"
    ],
    "star trek tng": [
        "science fiction",
        "sci fi",
        "star trek",
        "space exploration",
        "starship enterprise",
        "captain picard",
        "aliens",
        "federation"
    ],
    "doctor who classic": [
        "doctor who",
        "science fiction",
        "sci fi",
        "time travel",
        "tardis",
        "british television",
        "bbc",
        "adventure"
    ],
    "spike tv man cave": [
        "spike tv",
        "mens entertainment",
        "action",
        "reality television",
        "sports",
        "extreme entertainment",
        "retro cable"
    ],
    "madtv": [
        "sketch comedy",
        "parody",
        "satire",
        "impressions",
        "late night",
        "funny",
        "fox comedy"
    ],
    "true detective": [
        "crime drama",
        "detectives",
        "mystery",
        "noir",
        "investigation",
        "hbo",
        "thriller",
        "police"
    ],
    "joe pera talks with you": [
        "gentle comedy",
        "joe pera",
        "adult swim",
        "dry humor",
        "wholesome",
        "slice of life",
        "offbeat comedy"
    ],
    "family guy show": [
        "family guy",
        "adult animation",
        "sitcom",
        "satire",
        "griffin family",
        "comedy",
        "fox cartoons"
    ],
    "animeforadults": [
        "anime",
        "japanese animation",
        "mature anime",
        "seinen",
        "action anime",
        "fantasy",
        "adult animation"
    ],
    "south park show": [
        "south park",
        "adult cartoon",
        "satire",
        "comedy central",
        "dark humor",
        "animation",
        "raunchy comedy"
    ],
    "crayon shin chan": [
        "anime",
        "japanese cartoons",
        "family comedy",
        "shin chan",
        "animation",
        "slice of life",
        "kids comedy",
        "crayon shin chan"
    ],
    "best of nick toons": [
        "nicktoons",
        "nickelodeon",
        "cartoons",
        "1990s nostalgia",
        "kids animation",
        "retro cartoons",
        "classic nick"
    ],
    "looneytuneschannel": [
        "looney tunes",
        "classic cartoons",
        "bugs bunny",
        "daffy duck",
        "slapstick",
        "warner bros",
        "animation"
    ],
    "spongebob squarepants": [
        "spongebob",
        "nickelodeon",
        "underwater comedy",
        "bikini bottom",
        "patrick star",
        "kids cartoon",
        "animation"
    ],
    "beavisandbutt head": [
        "beavis and butt head",
        "mtv",
        "1990s comedy",
        "adult animation",
        "satire",
        "music television",
        "cartoon"
    ],
    "ren and stimpy": [
        "ren and stimpy",
        "nickelodeon",
        "gross out humor",
        "1990s cartoons",
        "slapstick",
        "retro animation",
        "comedy"
    ],
    "futurama show": [
        "futurama",
        "sci fi",
        "science fiction",
        "space comedy",
        "bender",
        "robots",
        "adult animation",
        "sitcom"
    ],
    "king of the hill": [
        "king of the hill",
        "hank hill",
        "texas",
        "sitcom",
        "adult cartoon",
        "propane",
        "comedy"
    ],
    "bobs burgers": [
        "bobs burgers",
        "animated sitcom",
        "belcher family",
        "restaurant",
        "comedy",
        "adult animation",
        "fox"
    ],
    "treehouse of horror": [
        "simpsons",
        "halloween",
        "horror parody",
        "scary cartoons",
        "anthology",
        "spooky",
        "animated comedy"
    ],
    "classic simpsons": [
        "the simpsons",
        "classic seasons",
        "1990s",
        "retro cartoons",
        "springfield",
        "satire",
        "animated sitcom"
    ],
    "the simpsons": [
        "simpsons",
        "animated sitcom",
        "homer simpson",        "springfield",
        "family comedy",
        "satire",
        "fox"
    ],
    "animation for adults": [
        "adult animation",
        "mature cartoons",
        "adult comedy",
        "animated series",
        "satire",
        "cartoons",
        "comedy"
    ],
    "classic spongebob": [
        "spongebob",
        "retro nickelodeon",
        "classic cartoons",
        "underwater",
        "patrick star",
        "kids animation",
        "nostalgia"
    ],
    "cartoonnetworkchannel": [
        "cartoon network",
        "cartoons",
        "kids animation",
        "2000s nostalgia",
        "retro cartoons",
        "animated shows",
        "90s tv"
    ],
    "hanna barbera": [
        "hanna barbera",
        "classic cartoons",
        "scooby doo",
        "the flintstones",
        "the jetsons",
        "retro animation",
        "kids tv"
    ],
    "regular show": [
        "regular show",
        "cartoon network",
        "mordecai",
        "rigby",
        "surreal comedy",
        "animated sitcom",
        "cartoons"
    ],
    "the cleveland show": [
        "cleveland show",
        "animated sitcom",
        "family comedy",
        "adult cartoon",
        "fox",
        "satire",
        "spin off"
    ],
    "hey arnold": [
        "hey arnold",
        "nickelodeon",
        "1990s cartoons",
        "school kids",
        "city adventures",
        "animation",
        "nostalgia"
    ],
    "home movies": [
        "home movies cartoon",
        "adult swim",
        "brendon small",
        "animated comedy",
        "filmmaking",
        "improv comedy",
        "cult cartoon"
    ],
    "ed edd n eddy": [
        "ed edd n eddy",
        "cartoon network",
        "1990s cartoons",
        "comedy",
        "jawbreakers",
        "kids animation",
        "nostalgia"
    ],
    "rickandmortytv": [
        "rick and morty",
        "adult swim",
        "science fiction",
        "sci fi",
        "multiverse",
        "portal adventures",
        "dark comedy"
    ],
    "best of adult swim": [
        "adult swim",
        "late night animation",
        "adult cartoons",
        "surreal comedy",
        "anime",
        "comedy",
        "cartoon network"
    ],
    "attack on titan channel": [
        "attack on titan",
        "anime",
        "dark fantasy",
        "titans",
        "action",
        "japanese animation",
        "shonen",
        "giants"
    ],
    "phineas and ferb": [
        "phineas and ferb",
        "disney",
        "cartoons",
        "inventions",
        "summer adventures",
        "family comedy",
        "animation"
    ],
    "dragon ball z": [
        "dragon ball z",
        "anime",
        "martial arts",
        "goku",
        "saiyans",
        "action",
        "fighting",
        "shonen"
    ],
    "american dad": [
        "american dad",
        "animated sitcom",
        "stan smith",
        "cia",
        "satire",
        "adult comedy",
        "fox",
        "adult cartoons"
    ],
    "uncensored family guy": [
        "family guy",
        "uncensored comedy",
        "adult humor",
        "griffin family",
        "raunchy",
        "satire",
        "adult cartoons"
    ],
    "tom and jerry": [
        "tom and jerry",
        "classic cartoons",
        "cat and mouse",
        "slapstick",
        "hanna barbera",
        "kids animation",
        "retro"
    ],
    "archer show": [
        "archer",
        "spy comedy",
        "espionage",
        "adult animation",
        "satire",
        "sterling archer",
        "fx",
        "sitcom"
    ],
    "aqua teen hunger force show": [
        "aqua teen hunger force",
        "adult swim",
        "surreal comedy",
        "absurd humor",
        "adult animation",
        "cult cartoons",
        "comedy"
    ],
    "dr katz professional therapist": [
        "dr katz",
        "animated sitcom",
        "therapy",
        "standup comedy",
        "comedy central",
        "1990s",
        "squigglevision"
    ],
    "metal maniacs": [
        "heavy metal",
        "rock music",
        "metal bands",
        "hard rock",
        "concerts",
        "headbanging",
        "music videos",
        "metalheads"
    ],
    "jackass tv": [
        "jackass",
        "stunts",
        "pranks",
        "reality television",
        "extreme comedy",
        "mtv",
        "slapstick",
        "dangerous stunts"
    ],
    "the 3 stooges": [
        "three stooges",
        "slapstick",
        "classic comedy",
        "moe larry curly",
        "physical comedy",
        "vintage shorts",
        "old movies"
    ],
    "spider man channel": [
        "spider man",
        "marvel",
        "superhero",
        "comic books",
        "peter parker",
        "action",
        "animated heroes",
        "adventure"
    ],
    "cinco cinema experience": [
        "cinema",
        "cult movies",
        "film",
        "oddity",
        "unusual films",
        "movie experience",
        "alternative entertainment",
        "tim and eric",
        "cinco",
        "adult swim"
    ],
    "anthology horror": [
        "horror",
        "anthology",
        "scary stories",
        "supernatural",
        "suspense",
        "creepy",
        "terror",
        "horror episodes"
    ]
};

    // Supplement curated tags; also infer relevant tags for new channels.
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

        var isCurated = false;
        [normalizedRoom, normalizedName, compact].forEach(function (key) {
            if (Object.prototype.hasOwnProperty.call(CHANNEL_TAGS, key)) {
                add(CHANNEL_TAGS[key]);
                isCurated = true;
            }
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

        // New MOTD channels (not in the current 97) get useful tags based
        // on the section in which their banner appears. Curated entries
        // above are always used first and never overwritten by inference.
        if (!isCurated) {
            var section = getBannerSection(link);
            var sectionTags = {
                'movies': ['movies', 'cinema', 'film', 'movie night', 'feature films', 'entertainment'],
                't v': ['television', 'tv shows', 'series', 'episodes', 'broadcast', 'entertainment'],
                'tv': ['television', 'tv shows', 'series', 'episodes', 'broadcast', 'entertainment'],
                'animation': ['animation', 'cartoons', 'animated series', 'cartoon shows', 'illustrated stories', 'entertainment'],
                'other': ['variety', 'entertainment', 'specialty channels', 'shows', 'programming', 'television']
            };
            if (sectionTags[section]) add(sectionTags[section]);
            if (found.length < 5) add(['entertainment', 'tv', 'shows', 'channels', 'streaming', 'videos']);
        }
        return found;
    }

    function getBannerSection(link) {
        var banners = link && link.closest && link.closest('.motd-banners');
        if (!banners) return '';
        var node = banners.closest('.dbn-carousel-shell') || banners;
        // Heading and banner container are sibling sections in DBN MOTD.
        for (var i = 0; node && i < 20; i++, node = node.previousElementSibling) {
            if (node.matches && node.matches('.movies-heading')) return normalize(node.textContent);
        }
        return '';
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
                tags.textContent = 'Tags: ' + item.tags.slice(0, 7).join(' · ');
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
                '<h2 class="dbn-search-title">🔎 Search the Doodoo Buttchump Network</h2>' +
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
        console.log('[DBN Network Search V4] MOTD channel + genre search ready.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    } else {
        initialize();
    }
})();

/* ==========================================================
   DBN V53 — HIDE REDUNDANT NAVBAR SEARCH ITEM
   Keep the full 97-channel / 724-tag search inside the MOTD.
   Only acts when the MOTD network search is present.
   Does not remove links, alter menus, or affect CyTube's
   separate video/library search field.
========================================================== */
(function () {
    'use strict';
    if (window.DBNHideNavbarSearchV53Loaded) return;
    window.DBNHideNavbarSearchV53Loaded = true;

    var MOTD_SEARCH_ID = 'dbn-network-search-v4';
    var NAVS = 'nav, .navbar, #navbar, [role="navigation"]';
    var HIDE_CLASS = 'dbn-hide-navbar-search-v53';
    var queued = false;

    function isSearchLabel(text) {
        var clean = String(text || '')
            .replace(/[\u{1F50D}\u{1F50E}\u{1F50D}\u2315\u2316\uFE0F]/gu, '')
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, '')
            .toLowerCase();
        return /^(search|search dbn tv|dbn search|search channels|search dbn channels|search the doodoo buttchump network)$/.test(clean);
    }

    function isNavbarSearch(node) {
        if (!node || !node.closest || !node.closest(NAVS)) return false;
        if (node.closest('#' + MOTD_SEARCH_ID)) return false;
        // Do not hide arbitrary navigation links that contain the word search.
        return isSearchLabel(node.textContent) ||
            isSearchLabel(node.getAttribute('aria-label')) ||
            isSearchLabel(node.getAttribute('title'));
    }

    function hide(control) {
        if (!isNavbarSearch(control)) return;
        var item = control.closest('li');
        var nav = control.closest(NAVS);
        var target = control;
        // Hide the whole list item only when it contains this one action.
        // Preserve a parent that also contains dropdown menu choices.
        if (item && nav && nav.contains(item) &&
            item.querySelectorAll('a, button').length === 1 &&
            isSearchLabel(item.textContent)) {
            target = item;
        }
        if (target.classList.contains(HIDE_CLASS)) return;
        target.classList.add(HIDE_CLASS);
        target.style.setProperty('display', 'none', 'important');
        target.setAttribute('aria-hidden', 'true');
        // We never remove the element, so prior event handlers remain intact.
    }

    function scan() {
        if (!document.getElementById(MOTD_SEARCH_ID)) return;
        document.querySelectorAll(NAVS).forEach(function (nav) {
            // CyTube navigation may use ordinary links, buttons, or direct list items.
            nav.querySelectorAll('a, button, li').forEach(hide);
        });
    }

    function schedule() {
        if (queued) return;
        queued = true;
        setTimeout(function () {
            queued = false;
            scan();
        }, 80);
    }

    function init() {
        scan();
        var observer = new MutationObserver(function (mutations) {
            var relevant = mutations.some(function (mutation) {
                var t = mutation.target;
                if (t.nodeType === 1 && t.closest && t.closest(NAVS)) return true;
                return Array.from(mutation.addedNodes).some(function (node) {
                    return node.nodeType === 1 && (
                        (node.matches && node.matches(NAVS)) ||
                        (node.querySelector && node.querySelector(NAVS)) ||
                        (node.matches && node.matches('#' + MOTD_SEARCH_ID)) ||
                        (node.querySelector && node.querySelector('#' + MOTD_SEARCH_ID))
                    );
                });
            });
            if (relevant) schedule();
        });
        observer.observe(document.body, {childList: true, subtree: true});
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, {once: true});
    } else {
        init();
    }
})();































/* =========================================
   DBN - PREVENT AUTO-SCROLL ON PAGE LOAD
   ========================================= */
(function () {
  if (window.__dbnScrollFix || location.hash) return;
  window.__dbnScrollFix = true;

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  let userInteracted = false;

  ["wheel", "touchstart", "pointerdown", "keydown"]
    .forEach(event => {
      window.addEventListener(event, () => {
        userInteracted = true;
      }, { once: true, passive: true });
    });

  function keepAtTop() {
    if (!userInteracted) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant"
      });
    }
  }

  keepAtTop();

  window.addEventListener("load", keepAtTop, {
    once: true
  });

  [200, 600, 1200].forEach(delay => {
    setTimeout(keepAtTop, delay);
  });
})();





























/* DBN VISUAL UPGRADE V56 — CINEMATIC CYBERPUNK
   Append to the end of your existing shared JS.
   Remove this block to undo the visual changes.
*/
(function () {
  'use strict';

  var STYLE_ID = 'dbn-visual-upgrade-v56';
  if (document.getElementById(STYLE_ID)) return;

  var css = `
/* Cinematic carousel frames */
.dbn-carousel-shell {
  background: linear-gradient(180deg,
    rgba(30,8,14,.98) 0%,
    rgba(4,5,10,.97) 45%,
    rgba(19,3,8,.98) 100%) !important;
  border: 1px solid rgba(255,73,87,.72) !important;
  border-radius: 11px !important;
  box-shadow:
    inset 0 1px 0 rgba(255,180,180,.16),
    inset 0 -8px 19px rgba(112,0,13,.20),
    0 8px 19px rgba(0,0,0,.64),
    0 0 12px rgba(224,13,36,.38) !important;
}

.dbn-carousel-shell::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(90deg,
    rgba(255,34,55,.12),
    transparent 10%,
    transparent 90%,
    rgba(255,34,55,.12));
  z-index: 1;
}

/* Refined carousel navigation */
.dbn-carousel-shell .dbn-carousel-arrow {
  border: 1px solid rgba(255,165,165,.9) !important;
  border-radius: 6px !important;
  background: linear-gradient(180deg,
    #ce2637,#6b0610) !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.22),
    0 0 10px rgba(255,36,57,.55) !important;
}

.dbn-carousel-shell .dbn-carousel-arrow:hover {
  background: linear-gradient(180deg,
    #ed3749,#8b0716) !important;
  box-shadow:
    0 0 16px rgba(255,40,64,.78) !important;
}

/* Banner hover illumination */
.dbn-carousel-shell .dbn-carousel-set
> .column > a[href] {
  border-radius: 4px;
  transition: box-shadow .2s ease;
}

.dbn-carousel-shell .dbn-carousel-set
> .column > a[href]:hover,
.dbn-carousel-shell .dbn-carousel-set
> .column > a[href]:focus-visible {
  box-shadow:
    0 0 0 1px rgba(255,105,110,.9),
    0 0 14px rgba(255,32,56,.45) !important;
}

/* Existing neon category artwork */
.movies-heading {
  filter:
    drop-shadow(0 0 7px rgba(255,35,51,.30));
}

/* Channel counters and decorative dividers */
.dbn-motd-section-count-v35 {
  position: relative !important;
  background: linear-gradient(180deg,
    rgba(36,5,11,.93),
    rgba(5,4,9,.97)) !important;
  border: 1px solid rgba(240,67,83,.72) !important;
  border-radius: 6px !important;
  box-shadow:
    0 0 8px rgba(228,22,42,.32),
    inset 0 1px 0 rgba(255,255,255,.08)
    !important;
}

.dbn-motd-section-count-v35::before,
.dbn-motd-section-count-v35::after {
  content: '';
  position: absolute;
  top: 50%;
  width: clamp(25px,10vw,110px);
  height: 1px;
  pointer-events: none;
  background: linear-gradient(90deg,
    transparent,#cf2237);
  box-shadow:
    0 0 7px rgba(245,35,55,.55);
}

.dbn-motd-section-count-v35::before {
  right: calc(100% + 12px);
}

.dbn-motd-section-count-v35::after {
  left: calc(100% + 12px);
  transform: rotate(180deg);
}

@media (max-width: 600px) {
  .dbn-motd-section-count-v35::before,
  .dbn-motd-section-count-v35::after {
    width: 25px;
  }
}
`;

  var style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = css;
  (document.head || document.documentElement)
    .appendChild(style);
})();




























/* DBN PHASE 2 — CINEMATIC BACKGROUND V57
   Append after V56. Remove this block to undo.
*/
(function () {
  'use strict';

  var STYLE_ID = 'dbn-phase2-v57-style';
  var OVERLAY_CLASS = 'dbn-phase2-v57-ambient';
  var ROOT_CLASS = 'dbn-phase2-v57';

  function install() {
    var motd = document.getElementById('motd');
    if (!motd) return false;

    if (!document.getElementById(STYLE_ID)) {
      var style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = `
#motd.${ROOT_CLASS} {
  position: relative !important;
  isolation: isolate;
}

#motd.${ROOT_CLASS} > .${OVERLAY_CLASS} {
  position: absolute !important;
  inset: 0 !important;
  z-index: -1 !important;
  display: block !important;
  pointer-events: none !important;
  background:
    radial-gradient(ellipse 7% 47% at 50% 20%,
      rgba(0,0,0,.35),
      rgba(0,0,0,.13) 54%,
      transparent 100%),
    radial-gradient(ellipse 49% 35% at 50% 43%,
      rgba(78,0,10,.12),
      transparent 80%),
    linear-gradient(90deg,
      rgba(0,0,0,.56) 0%,
      rgba(0,0,0,.19) 18%,
      rgba(0,0,0,.07) 50%,
      rgba(0,0,0,.19) 82%,
      rgba(0,0,0,.56) 100%),
    linear-gradient(180deg,
      rgba(0,0,0,.20) 0%,
      transparent 16%,
      transparent 72%,
      rgba(0,0,0,.26) 100%);
}

/* Refined category lighting */
#motd.${ROOT_CLASS} .movies-heading {
  filter:
    drop-shadow(0 0 5px rgba(255,40,58,.46))
    drop-shadow(0 0 14px rgba(190,8,26,.20))
    !important;
}

/* Channel counters */
#motd.${ROOT_CLASS} .dbn-motd-section-count-v35 {
  box-shadow:
    0 0 8px rgba(238,23,40,.32),
    inset 0 1px 0 rgba(255,255,255,.09)
    !important;
}

/* Carousel depth and spacing */
#motd.${ROOT_CLASS} .dbn-carousel-shell {
  margin-bottom: 25px !important;
  box-shadow:
    inset 0 1px 0 rgba(255,180,180,.12),
    inset 0 -10px 20px rgba(96,0,12,.20),
    0 9px 23px rgba(0,0,0,.68),
    0 0 13px rgba(218,16,40,.31)
    !important;
}

@media (max-width: 600px) {
  #motd.${ROOT_CLASS} .dbn-carousel-shell {
    margin-bottom: 19px !important;
  }
}
`;
      (document.head || document.documentElement)
        .appendChild(style);
    }

    motd.classList.add(ROOT_CLASS);

    if (!motd.querySelector('.' + OVERLAY_CLASS)) {
      var overlay = document.createElement('div');
      overlay.className = OVERLAY_CLASS;
      overlay.setAttribute('aria-hidden', 'true');
      motd.insertBefore(overlay, motd.firstChild);
    }

    return true;
  }

  if (!install()) {
    var observer = new MutationObserver(function () {
      if (install()) observer.disconnect();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
})();

/* DBN ADD-ON: BROKEN VIDEO REPORTER V1.1 - NO CHANGES TO EXISTING MODULES */
/* =====================================================================
   DOODOO BUTTCHUMP NETWORK — REPORT BROKEN VIDEO (SAFE TEST ADD-ON)
   Version: Reporter 1.1 | November 25, 2026

   PURPOSE: Add a "REPORT BROKEN VIDEO" button and a Google Forms popup.
   This code DOES NOT replace or modify existing DBN carousels, CSS,
   MOTD, network search, viewer counters, or external JavaScript URL.

   TEST INSTALL:
   1. Keep the WORKING External JavaScript URL untouched.
   2. CyTube > doodootest > Channel Settings > Edit > Javascript.
   3. APPEND this complete block to existing channel Javascript (if any).
   4. Click Save JS and reload; allow channel scripts if prompted.

   To remove: delete only this complete reporter block from the editor.

   Google Form fields configured from the owner's prefilled URL:
     Channel URL  = entry.1917847598
     Video Title  = entry.1930665811
     Video Link   = entry.1375484011
   Nothing is submitted until the viewer submits the Google Form.
   ===================================================================== */
(function DBNReportBrokenVideoSafeV11() {
  'use strict';
  if (window.__DBNReportBrokenVideoSafeV11) return;
  window.__DBNReportBrokenVideoSafeV11 = true;

  var FORM_BASE = 'https://docs.google.com/forms/d/e/1FAIpQLSc58nIxvLBygfC4PB53mw8z0cieOfXyPfJbM7JeDDAf_8X0Cw/viewform';
  var BUTTON_ID = 'dbn-report-broken-video-safe-v11';
  var OVERLAY_ID = 'dbn-report-broken-overlay-safe-v11';
  var STYLE_ID = 'dbn-report-broken-css-safe-v11';

  function nowPlaying() {
    var active = document.querySelector('#queue .queue_active, .queue_active');
    var media = null;
    var jq = window.jQuery || window.$;
    if (active) {
      try {
        if (typeof jq === 'function') media = jq(active).data('media') || null;
        if (!media && active.dataset && active.dataset.media) {
          media = JSON.parse(active.dataset.media);
        }
      } catch (e) { /* CyTube versions expose media differently. */ }
    }
    if (media && media.media && !media.id) media = media.media;

    var title = media && typeof media.title === 'string' ? media.title.trim() : '';
    if (!title && active) {
      var rowTitle = active.querySelector('.qe_title, a, .queue_title');
      if (rowTitle) title = (rowTitle.textContent || '').trim();
    }
    if (!title) {
      var current = document.querySelector('#currenttitle');
      if (current) title = (current.textContent || '').replace(/^Currently Playing\s*:?/i, '').trim();
    }

    var url = '';
    if (media && media.id !== undefined && media.id !== null) {
      var id = String(media.id);
      try {
        if (typeof window.formatURL === 'function') {
          var formatted = window.formatURL(media);
          if (typeof formatted === 'string' && /^https?:\/\//i.test(formatted)) url = formatted;
        }
      } catch (e) { /* Use known provider fallbacks. */ }
      if (!url) {
        switch (String(media.type || '').toLowerCase()) {
          case 'yt': url = 'https://www.youtube.com/watch?v=' + encodeURIComponent(id); break;
          case 'vi': url = 'https://vimeo.com/' + encodeURIComponent(id); break;
          case 'dm': url = 'https://www.dailymotion.com/video/' + encodeURIComponent(id); break;
          case 'gd': url = 'https://drive.google.com/file/d/' + encodeURIComponent(id) + '/view'; break;
          case 'fi': url = /^https?:\/\//i.test(id) ? id : 'File: ' + id; break;
          default: url = (media.type ? String(media.type) + ':' : '') + id;
        }
      }
    }
    if (!url && active) {
      var link = active.querySelector('a[href^="https://"], a[href^="http://"]');
      if (link) url = link.href;
    }
    return {
      title: title || 'Video title unavailable - please describe it below',
      url: url || 'Video URL unavailable - please describe it below'
    };
  }

  function formUrl(embed) {
    var media = nowPlaying();
    var url = new URL(FORM_BASE);
    url.searchParams.set('usp', 'pp_url');
    url.searchParams.set('entry.1917847598', window.location.origin + window.location.pathname);
    url.searchParams.set('entry.1930665811', media.title);
    url.searchParams.set('entry.1375484011', media.url);
    if (embed) url.searchParams.set('embedded', 'true');
    return url.toString();
  }

  function showForm() {
    if (document.getElementById(OVERLAY_ID)) return;
    var focusBefore = document.activeElement;
    var backdrop = document.createElement('div');
    backdrop.id = OVERLAY_ID;
    backdrop.setAttribute('role', 'presentation');
    var dialog = document.createElement('section');
    dialog.className = 'dbn-report-safe-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-label', 'Report a broken video');
    var header = document.createElement('div');
    header.className = 'dbn-report-safe-header';
    var title = document.createElement('strong');
    title.textContent = '⚠ REPORT BROKEN VIDEO';
    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'dbn-report-safe-close';
    close.textContent = '✕ Close';
    close.setAttribute('aria-label', 'Close report form');
    header.append(title, close);

    var instruction = document.createElement('div');
    instruction.className = 'dbn-report-safe-note';
    instruction.textContent = 'Channel and current video are filled in when available. Select the problem, then submit the form.';

    var iframe = document.createElement('iframe');
    iframe.className = 'dbn-report-safe-frame';
    iframe.title = 'DBN broken video reporting form';
    iframe.src = formUrl(true);

    var footer = document.createElement('div');
    footer.className = 'dbn-report-safe-footer';
    var helpLink = document.createElement('a');
    helpLink.href = formUrl(false);
    helpLink.target = '_blank';
    helpLink.rel = 'noopener noreferrer';
    helpLink.textContent = 'Form not displaying? Open in a new tab';
    footer.appendChild(helpLink);
    dialog.append(header, instruction, iframe, footer);
    backdrop.appendChild(dialog);

    function dismiss() {
      document.removeEventListener('keydown', keyHandler, true);
      backdrop.remove();
      if (focusBefore && typeof focusBefore.focus === 'function') focusBefore.focus();
    }
    function keyHandler(event) {
      if (event.key === 'Escape') dismiss();
    }
    close.addEventListener('click', dismiss);
    backdrop.addEventListener('click', function (event) {
      if (event.target === backdrop) dismiss();
    });
    document.addEventListener('keydown', keyHandler, true);
    document.body.appendChild(backdrop);
    close.focus();
  }

  function init() {
    if (!document.body || document.getElementById(BUTTON_ID)) return;
    if (!document.getElementById(STYLE_ID)) {
      var style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = '\n' +
        '#'+BUTTON_ID+'{position:fixed!important;bottom:72px!important;right:18px!important;z-index:2147483000!important;background:linear-gradient(180deg,#d22c39,#7e0c17)!important;border:2px solid #ff646a!important;border-radius:9px!important;padding:11px 15px!important;color:#fff!important;font:800 12px/1.3 Arial,sans-serif!important;letter-spacing:.3px!important;box-shadow:0 0 14px #b00000,0 6px 20px #000c!important;cursor:pointer!important}\n' +
        '#'+BUTTON_ID+':hover,#'+BUTTON_ID+':focus-visible{background:#df3342!important;outline:2px solid white!important;outline-offset:2px!important}\n' +
        '#'+OVERLAY_ID+'{position:fixed!important;inset:0!important;z-index:2147483001!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:12px!important;background:#000d!important;box-sizing:border-box!important}\n' +
        '#'+OVERLAY_ID+' *{box-sizing:border-box!important}\n' +
        '#'+OVERLAY_ID+' .dbn-report-safe-dialog{width:min(680px,100%)!important;height:min(87vh,850px)!important;background:#121216!important;border:2px solid #c32133!important;border-radius:11px!important;box-shadow:0 12px 45px #000!important;display:flex!important;flex-direction:column!important;overflow:hidden!important;color:#fff!important;font-family:Arial,sans-serif!important}\n' +
        '#'+OVERLAY_ID+' .dbn-report-safe-header{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important;padding:12px 16px!important;background:#28080f!important;border-bottom:1px solid #ab2535!important}\n' +
        '#'+OVERLAY_ID+' .dbn-report-safe-header strong{color:#fff!important;font-size:15px!important}\n' +
        '#'+OVERLAY_ID+' .dbn-report-safe-close{padding:7px 10px!important;border:1px solid #97545f!important;border-radius:6px!important;background:#311019!important;color:#fff!important;cursor:pointer!important}\n' +
        '#'+OVERLAY_ID+' .dbn-report-safe-note{padding:8px 16px!important;color:#ecd6d9!important;font-size:12px!important}\n' +
        '#'+OVERLAY_ID+' .dbn-report-safe-frame{width:100%!important;min-height:0!important;flex:1 1 auto!important;background:#fff!important;border:0!important}\n' +
        '#'+OVERLAY_ID+' .dbn-report-safe-footer{padding:10px 16px!important;background:#20070c!important;font-size:12px!important}\n' +
        '#'+OVERLAY_ID+' .dbn-report-safe-footer a{color:#ffb6bd!important;text-decoration:underline!important}\n' +
        '@media(max-width:600px){#'+BUTTON_ID+'{right:8px!important;bottom:62px!important;padding:10px!important;font-size:11px!important}#'+OVERLAY_ID+' .dbn-report-safe-dialog{height:94vh!important}}';
      (document.head || document.documentElement).appendChild(style);
    }
    var button = document.createElement('button');
    button.id = BUTTON_ID;
    button.type = 'button';
    button.textContent = '⚠ REPORT BROKEN VIDEO';
    button.setAttribute('aria-label', 'Report a broken video to DBN');
    button.addEventListener('click', showForm);
    document.body.appendChild(button);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();


/* ====================================================================
   DBN V59 — STATIC, CENTERED BROKEN-VIDEO REPORT BUTTON
   Additive placement correction to the working V58 reporter.
   Moves the existing button into the MOTD under the Community & Support
   section; does not edit any carousel, banner, search, or form logic.
   ==================================================================== */
(function DBNReporterCommunityPlacementV59() {
  'use strict';
  if (window.__DBNReporterCommunityPlacementV59) return;
  window.__DBNReporterCommunityPlacementV59 = true;

  var BUTTON_ID = 'dbn-report-broken-video-safe-v11';
  var WRAPPER_ID = 'dbn-reporter-below-community-v59';
  var STYLE_ID = 'dbn-reporter-static-v59-css';
  var savedButton = null;

  function installStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      '#' + WRAPPER_ID + '{' +
        'display:flex!important;align-items:center!important;' +
        'justify-content:center!important;clear:both!important;' +
        'position:relative!important;width:100%!important;' +
        'box-sizing:border-box!important;margin:24px auto 32px!important;' +
        'padding:0 12px!important;text-align:center!important;' +
        'z-index:5!important;}' +
      '#' + WRAPPER_ID + ' > #' + BUTTON_ID + '{' +
        'position:static!important;inset:auto!important;' +
        'top:auto!important;right:auto!important;bottom:auto!important;left:auto!important;' +
        'float:none!important;transform:none!important;' +
        'margin:0 auto!important;display:inline-flex!important;' +
        'align-items:center!important;justify-content:center!important;' +
        'max-width:100%!important;white-space:normal!important;' +
        'text-align:center!important;}' +
      '@media(max-width:600px){#' + WRAPPER_ID + '{' +
        'margin:18px auto 24px!important;padding:0 10px!important;}}';
    (document.head || document.documentElement).appendChild(style);
  }

  // Heading may be styled inside any kind of MOTD container; don't rely
  // on a guessed class name for the Community & Support window.
  function findCommunityHeading(motd) {
    var candidates = motd.querySelectorAll('h1,h2,h3,h4,h5,h6,strong,b,span,div,p');
    for (var i = candidates.length - 1; i >= 0; i--) {
      var node = candidates[i];
      // Exclude broad ancestor nodes and tolerate either "&" or "AND".
      var value = String(node.textContent || '').replace(/\s+/g, ' ').trim();
      if (/^DBN\s+COMMUNITY\s*(?:&|AND)\s*SUPPORT$/i.test(value)) return node;
    }
    return null;
  }

  function place() {
    var motd = document.getElementById('motd');
    var button = document.getElementById(BUTTON_ID) || savedButton;
    if (!motd || !button) return false;
    savedButton = button;
    installStyle();

    var wrapper = document.getElementById(WRAPPER_ID);
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.id = WRAPPER_ID;
      wrapper.setAttribute('aria-label', 'Report a broken video');
    }

    // Place immediately after the complete Community & Support block if
    // that block can be identified; otherwise place at the end of the MOTD.
    // The support section is the final panel in the user's supplied layout.
    var heading = findCommunityHeading(motd);
    var section = heading;
    if (heading) {
      // Prefer an enclosing support panel, if there is one.
      var ancestor = heading.parentElement;
      while (ancestor && ancestor !== motd) {
        var tokens = (String(ancestor.id || '') + ' ' + String(ancestor.className || '')).toLowerCase();
        if (/(community|support)/.test(tokens) &&
            (ancestor.querySelector('a,img,iframe,button') ||
             ancestor.querySelectorAll('p,div').length > 2)) {
          section = ancestor;
        }
        ancestor = ancestor.parentElement;
      }
      // Use the nearest top-level MOTD block if it actually contains the
      // support content. A standalone heading isn't the whole window.
      if (section === heading) {
        var top = heading;
        while (top.parentElement && top.parentElement !== motd) top = top.parentElement;
        if (top !== heading && top.textContent.trim() !== heading.textContent.trim()) {
          section = top;
        } else {
          section = null;
        }
      }
    }

    if (section && section !== motd && section.parentNode && motd.contains(section)) {
      // Insert beside the full panel, not inside the heading.
      if (wrapper.previousElementSibling !== section || wrapper.parentNode !== section.parentNode) {
        section.parentNode.insertBefore(wrapper, section.nextSibling);
      }
    } else if (wrapper.parentNode !== motd || wrapper !== motd.lastElementChild) {
      motd.appendChild(wrapper);
    }

    if (button.parentNode !== wrapper) wrapper.appendChild(button);
    return true;
  }

  function init() {
    var retryCount = 0;
    var retry = setInterval(function () {
      retryCount++;
      if (place() || retryCount >= 40) clearInterval(retry);
    }, 500);
    place();

    // CyTube may replace MOTD content on reconnect. Reattach the button
    // only when needed, without affecting the rest of the page.
    var queued = false;
    var observer = new MutationObserver(function () {
      var wrapper = document.getElementById(WRAPPER_ID);
      var button = document.getElementById(BUTTON_ID);
      if (wrapper && wrapper.isConnected && button && button.parentNode === wrapper) return;
      if (queued) return;
      queued = true;
      setTimeout(function () { queued = false; place(); }, 80);
    });
    observer.observe(document.body, { childList:true, subtree:true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once:true });
  } else {
    init();
  }
})();

/* ==========================================================
   DBN PRIVATE ADMINISTRATOR-ONLY INTELLIGENT BROADCAST SHUFFLE
   Appended as a separate isolated module; existing V59 features retained.
========================================================== */
/* ==========================================================
   DBN INTELLIGENT BROADCAST SHUFFLE
   Version 115.0 - Shuffle all playlist entries except active item; active UID protected; read-only audit

   Admin rank 3+ only; requires CyTube playlistmove permission.
   Upcoming queue only; currently playing video is never moved.
   Recognizes SxxExx, Season/Episode and 1x02 episode titles.
   Preserves episode chronology and maximizes show separation.
   Short clips under 5:00 are commercials by default.
   Per-channel manual overrides, preview and undo included.
   ========================================================== */
(function () {
    "use strict";
    if (window.DBNIntelligentBroadcastShuffleV115Loaded) return;
    window.DBNIntelligentBroadcastShuffleV115Loaded = true;

    var C = {
        button: "dbn-broadcast-shuffle-button-v1",
        modal: "dbn-broadcast-shuffle-modal-v1",
        style: "dbn-broadcast-shuffle-style-v1",
        commercialSeconds: 300,
        rankRequired: 3,
        moveTimeout: 60000,
        undoPrefix: "dbnBroadcastShuffleUndoV1:",
        overridePrefix: "dbnBroadcastShuffleOverridesV1:"
    };
    var plan = null;
    var applying = false;
    var undoSnapshot = null;
    var diagnosticRunning = false;

    function channelName() {
        return window.CHANNEL && CHANNEL.name
            ? String(CHANNEL.name)
            : String(window.location.pathname || "unknown");
    }
    function getStore(key) {
        try { return localStorage.getItem(key); } catch (e) { return null; }
    }
    function setStore(key, value) {
        try { localStorage.setItem(key, value); return true; } catch (e) { return false; }
    }
    function removeStore(key) {
        try { localStorage.removeItem(key); } catch (e) {}
    }
    function allowed() {
        try {
            return !!(window.CLIENT && typeof CLIENT.rank === "number" &&
                CLIENT.rank >= C.rankRequired &&
                typeof window.hasPermission === "function" &&
                window.hasPermission("playlistmove") &&
                window.socket && typeof socket.emit === "function");
        } catch (e) { return false; }
    }
    function parseDuration(value) {
        if (typeof value === "number" && isFinite(value)) return Math.max(0, value);
        if (typeof value !== "string" || !value.trim()) return null;
        var s = value.trim();
        if (/^\d+(?:\.\d+)?$/.test(s)) return Number(s);
        var p = s.split(":");
        if (p.length < 2 || p.length > 3) return null;
        var n = p.map(Number);
        if (n.some(function (v) { return !isFinite(v) || v < 0; })) return null;
        return n.length === 2 ? n[0] * 60 + n[1] : n[0] * 3600 + n[1] * 60 + n[2];
    }
    function queueEntries() {
        if (!window.jQuery) return [];
        var $ = window.jQuery, items = [];
        $("#queue > li.queue_entry").each(function () {
            var li = $(this), media = li.data("media") || {}, uid = li.data("uid");
            if (uid === undefined || uid === null) return;
            items.push({
                uid: String(uid),
                media: media,
                title: String(media.title || li.find(".qe_title").text() || "Untitled video"),
                duration: parseDuration(media.duration),
                element: this
            });
        });
        return items;
    }
    function currentUid() {
        return window.PL_CURRENT === undefined || window.PL_CURRENT === null
            ? null : String(window.PL_CURRENT);
    }
    function upcomingSnapshot() {
        // CyTube's playlist array contains both previously played entries,
        // the active item, and items queued after it. Every entry except
        // PL_CURRENT is eligible for reshuffling. Keep the active UID out
        // of the move-source list and restore it to its original index.
        var current = currentUid();
        if (current === null) throw new Error("CyTube has not identified the current video. No changes were made.");
        var all = queueEntries();
        if (!all.length) throw new Error("The server playlist is empty or the browser queue could not be read.");
        var currentIndex = all.findIndex(function(item) { return String(item.uid) === String(current); });
        if (currentIndex < 0) throw new Error("The currently playing UID was not found in the playlist. The shuffle preview was blocked.");
        var shuffleable = all.filter(function(item) { return String(item.uid) !== String(current); });
        return {
            currentUid: current,
            currentIndex: currentIndex,
            all: all,
            shuffleable: shuffleable,
            upcoming: shuffleable
        };
    }
    function mediaKey(item) {
        var m = item.media || {};
        return m.type && m.id
            ? String(m.type) + ":" + String(m.id)
            : item.title.toLowerCase() + "|" + String(item.duration);
    }
    function overrides() {
        try {
            var value = JSON.parse(getStore(C.overridePrefix + channelName()) || "{}");
            return value && typeof value === "object" ? value : {};
        } catch (e) { return {}; }
    }
    function saveOverride(item, value) {
        var all = overrides(), key = mediaKey(item);
        if (value === "auto") delete all[key];
        else all[key] = value;
        setStore(C.overridePrefix + channelName(), JSON.stringify(all));
    }
    function cleanShow(value) {
        return String(value || "")
            .replace(/\[[^\]]*(?:480p|720p|1080p|2160p|HD|WEB-DL|WEBRip|DVDRip)[^\]]*\]/ig, " ")
            .replace(/\([^)]*(?:480p|720p|1080p|2160p|HD|WEB-DL|WEBRip|DVDRip)[^)]*\)/ig, " ")
            .replace(/\b(?:480p|720p|1080p|2160p|HDTV|WEB-DL|WEBRip|DVDRip|x264|x265)\b/ig, " ")
            .replace(/[\s._-]+$/g, "").replace(/^[\s._-]+/g, "")
            .replace(/[\s._-]+/g, " ").trim().toLowerCase();
    }
    function episodeInfo(title) {
        title = String(title || "");
        // Explicit season/episode formats (including common filename variants).
        var patterns = [
            /\bS(\d{1,2})[\s._-]*E(?:P)?[\s._-]*(\d{1,3})\b/i,
            /\bSeason[\s._-]*(\d{1,2})[\s._-]*(?:Episode|Ep\.?)\s*(\d{1,3})\b/i,
            /\b(\d{1,2})x(\d{1,3})\b/i,
            /\b(\d{1,2})[\s._-]+(?:Episode|Ep\.?)\s*(\d{1,3})\b/i
        ];
        for (var i = 0; i < patterns.length; i++) {
            var match = patterns[i].exec(title);
            if (!match) continue;
            var show = cleanShow(title.slice(0, match.index));
            if (!show) continue;
            return { show: show, season: Number(match[1]), episode: Number(match[2]) };
        }

        // Bare E### format: "The Pink Panther E030 (Jet Pink)".
        // These titles use the E prefix without a season number.
        var bareEpisode = /\bE(\d{1,3})\b/i.exec(title);
        if (bareEpisode) {
            var bareShow = cleanShow(title.slice(0, bareEpisode.index));
            if (bareShow) return { show: bareShow, season: 0, episode: Number(bareEpisode[1]) };
        }

        // Episode-only formats: "Show Name - Episode 18", "Show Name Ep 18".
        var episodeOnly = /\b(?:Episode|Ep\.?)\s*(\d{1,3})\b/i.exec(title);
        if (episodeOnly) {
            var episodeShow = cleanShow(title.slice(0, episodeOnly.index));
            if (episodeShow) return { show: episodeShow, season: 0, episode: Number(episodeOnly[1]) };
        }

        // Compact broadcast numbering: "Show Name 118" (season 1, episode 18)
        // or "Show Name 1012" (season 10, episode 12).
        var compact = /(?:^|[\s._-])(\d{3,4})\s*$/.exec(title);
        if (compact) {
            var digits = compact[1], compactShow = cleanShow(title.slice(0, compact.index));
            if (compactShow) {
                var split = digits.length === 3 ? 1 : 2;
                return { show: compactShow, season: Number(digits.slice(0, split)), episode: Number(digits.slice(split)) };
            }
        }

        // Episode-number suffixes such as "Show Name - 18" or "Show Name_018".
        // This fallback groups episodes by their shared series prefix instead of
        // treating every unrecognized episode as an unrelated one-off video.
        var numbered = /(?:^|[\s._-])(\d{1,3})\s*$/.exec(title);
        if (numbered) {
            var numberedShow = cleanShow(title.slice(0, numbered.index));
            if (numberedShow && numberedShow.length >= 3) {
                return { show: numberedShow, season: 0, episode: Number(numbered[1]) };
            }
        }
        return null;
    }
    function classification(item, saved) {
        var override = saved[mediaKey(item)];
        if (override === "commercial") return "commercial";
        if (override === "program") return "program";
        // Explicitly labeled commercials stay commercials even when longer than 5 minutes.
        if (/\b(?:commercial|commerical|comercial)\b/i.test(String(item.title || ""))) return "commercial";
        return item.duration !== null && item.duration < C.commercialSeconds
            ? "commercial" : "program";
    }
    function shuffled(items) {
        var a = items.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1)), t = a[i];
            a[i] = a[j]; a[j] = t;
        }
        return a;
    }
    function orderPrograms(programs) {
        var map = Object.create(null), groups = [];
        programs.forEach(function (item, index) {
            var ep = episodeInfo(item.title);
            var key = ep ? "show:" + ep.show : "single:" + item.uid;
            if (!map[key]) {
                map[key] = { key: key, last: -1000000, items: [] };
                groups.push(map[key]);
            }
            item.episode = ep;
            item.originalIndex = index;
            map[key].items.push(item);
        });
        groups.forEach(function (g) {
            g.items.sort(function (a, b) {
                if (a.episode && b.episode) {
                    if (a.episode.season !== b.episode.season) return a.episode.season - b.episode.season;
                    if (a.episode.episode !== b.episode.episode) return a.episode.episode - b.episode.episode;
                }
                return a.originalIndex - b.originalIndex;
            });
        });
        var result = [];
        while (true) {
            var remaining = groups.filter(function (g) { return g.items.length; });
            if (!remaining.length) break;

            // Prefer a show only after at least two other programs have appeared.
            // If that is impossible, relax to one intervening program, then no
            // immediate repeat, and finally allow a repeat only when unavoidable.
            var candidates = remaining.filter(function (g) {
                return result.length - g.last > 2;
            });
            if (!candidates.length) {
                candidates = remaining.filter(function (g) {
                    return result.length - g.last > 1;
                });
            }
            if (!candidates.length) {
                candidates = remaining.filter(function (g) {
                    return result.length - g.last > 0;
                });
            }
            if (!candidates.length) candidates = remaining;

            // Select the group with the most episodes still waiting. This spreads
            // multi-episode shows across the full run instead of exhausting every
            // one-off title before returning to them.
            var largest = Math.max.apply(null, candidates.map(function (g) {
                return g.items.length;
            }));
            candidates = candidates.filter(function (g) {
                return g.items.length === largest;
            });
            var oldest = Math.min.apply(null, candidates.map(function (g) {
                return g.last;
            }));
            var tied = candidates.filter(function (g) { return g.last === oldest; });
            var chosen = tied[Math.floor(Math.random() * tied.length)];

            result.push(chosen.items.shift());
            chosen.last = result.length;
        }
        return result;
    }
    function makePlan(snapshot) {
        var saved = overrides(), programs = [], ads = [];
        snapshot.shuffleable.forEach(function (item) {
            item.kind = classification(item, saved);
            (item.kind === "commercial" ? ads : programs).push(item);
        });
        var programOrder = orderPrograms(programs), adOrder = shuffled(ads);
        var gaps = Math.max(0, programOrder.length - 1), buckets = [];
        for (var i = 0; i < gaps; i++) buckets.push([]);
        if (gaps > 0 && adOrder.length > 0) {
            adOrder.forEach(function (ad, index) {
                var gapIndex = adOrder.length <= gaps
                    ? Math.floor((index + 0.5) * gaps / adOrder.length)
                    : Math.floor(index * gaps / adOrder.length);
                gapIndex = Math.max(0, Math.min(gaps - 1, gapIndex));
                buckets[gapIndex].push(ad);
            });
            buckets = buckets.map(shuffled);
        }
        var order = [];
        if (programOrder.length === 0) {
            order = adOrder.slice();
        } else {
            programOrder.forEach(function (item, index) {
                order.push(item);
                if (index < buckets.length) buckets[index].forEach(function (ad) { order.push(ad); });
            });
            if (programOrder.length === 1) adOrder.forEach(function (ad) { order.push(ad); });
        }
        var bucketSizes = buckets.map(function (bucket) { return bucket.length; });
        var balanced = programs.length === ads.length + 1;
        var warning = "";
        if (!balanced) {
            var placement;
            if (programOrder.length === 0) {
                placement = "No programs were detected among the videos being shuffled, so all eligible entries will be shuffled together.";
            } else if (programOrder.length === 1) {
                placement = "Only one program was detected among the videos being shuffled, so all commercials will follow it.";
            } else if (ads.length < gaps) {
                placement = "The commercials will be spread across the full shuffled playlist, leaving evenly spaced gaps without a commercial.";
            } else {
                placement = "The commercials will be divided as evenly as possible among the available gaps between programs.";
            }
            warning = "COUNT IMBALANCE — " + programs.length + " programs and " + ads.length +
                " commercials among " + snapshot.shuffleable.length +
                " videos being shuffled. Every eligible video will still be included. " + placement;
        }
        return {
            currentUid:snapshot.currentUid,
            currentIndex:snapshot.currentIndex,
            source:snapshot.shuffleable,
            order:order,
            programs:programs,
            commercials:ads,
            buckets:buckets,
            bucketSizes:bucketSizes,
            balanced:balanced,
            warning:warning
        };
    }
    function addStyles() {
        if (document.getElementById(C.style)) return;
        var style = document.createElement("style");
        style.id = C.style;
        style.textContent = `
#${C.button}{margin-left:7px;border:1px solid #ff3838;border-radius:5px;padding:6px 11px;color:#fff;background:linear-gradient(180deg,#b80000,#4b0000);box-shadow:0 0 9px rgba(255,0,0,.65),inset 0 1px 2px rgba(255,255,255,.15);font-weight:900;letter-spacing:.5px;text-shadow:0 0 5px #f00;cursor:pointer}
#${C.button}:hover{background:linear-gradient(180deg,#e00000,#650000);box-shadow:0 0 15px rgba(255,0,0,.9)}
#${C.modal}{position:fixed;inset:0;z-index:1000000;display:none;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;background:rgba(0,0,0,.82);color:#f4eaea;font-family:Arial,sans-serif}
#${C.modal} .dbn-bs-panel{width:min(920px,96vw);max-height:88vh;display:flex;flex-direction:column;overflow:hidden;border:2px solid #b40000;border-radius:9px;background:#100707;box-shadow:0 0 18px rgba(255,0,0,.55),0 0 45px rgba(0,0,0,.9)}
#${C.modal} .dbn-bs-head{padding:13px 16px;border-bottom:1px solid #651010;background:linear-gradient(90deg,#300707,#120707)}
#${C.modal} .dbn-bs-title{color:#ff4545;font-size:20px;font-weight:900;letter-spacing:1.2px;text-shadow:0 0 8px #f00}
#${C.modal} .dbn-bs-subtitle{margin-top:4px;color:#c9aaaa;font-size:11px;letter-spacing:.7px}
#${C.modal} .dbn-bs-stats{display:flex;flex-wrap:wrap;gap:8px;padding:10px 14px;border-bottom:1px solid #3b1717}
#${C.modal} .dbn-bs-stat{padding:7px 10px;border:1px solid #482020;border-radius:5px;background:#1b0c0c;color:#fff;font-size:12px}
#${C.modal} .dbn-bs-stat strong{color:#ff5555;font-size:16px;margin-right:5px}
#${C.modal} .dbn-bs-warning{margin:10px 14px 0;padding:8px 10px;border-left:3px solid #d68a22;background:#211607;color:#f0d7a9;font-size:12px}
#${C.modal} .dbn-bs-list-wrap{overflow:auto;min-height:120px;padding:8px 14px 14px}
#${C.modal} .dbn-bs-row{display:grid;grid-template-columns:36px minmax(0,1fr) 112px 105px;align-items:center;gap:9px;padding:7px 8px;border-bottom:1px solid #2b1717;background:#160b0b;font-size:12px}
#${C.modal} .dbn-bs-row:nth-child(even){background:#1d0d0d}
#${C.modal} .dbn-bs-index{color:#a77c7c;text-align:right;font-variant-numeric:tabular-nums}
#${C.modal} .dbn-bs-name{min-width:0;overflow-wrap:anywhere;color:#f7eeee}
#${C.modal} .dbn-bs-detection{display:block;margin-top:4px;font-size:10px;font-weight:700;letter-spacing:.35px;color:#ffb0b0}
#${C.modal} .dbn-bs-detection.is-commercial{color:#ff6868}
#${C.modal} .dbn-bs-detection.is-program{color:#b8d9b8}
#${C.modal} .dbn-bs-duration{color:#c9a9a9;text-align:right;white-space:nowrap}
#${C.modal} .dbn-bs-kind{width:100%;padding:5px;border:1px solid #633030;border-radius:4px;background:#0d0808;color:#fff;font-size:11px}
#${C.modal} .dbn-bs-foot{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;padding:12px 14px;border-top:1px solid #651010;background:#160909}
#${C.modal} .dbn-bs-action{border:1px solid #793030;border-radius:5px;padding:8px 12px;background:#2a1111;color:#fff;font-weight:700;cursor:pointer}
#${C.modal} .dbn-bs-action.primary{border-color:#ff3535;background:linear-gradient(180deg,#bd0000,#5a0000);box-shadow:0 0 9px rgba(255,0,0,.45)}
#${C.modal} .dbn-bs-action:disabled{opacity:.45;cursor:not-allowed}
#${C.modal} .dbn-bs-status{margin-right:auto;align-self:center;color:#d7baba;font-size:11px}
@media(max-width:620px){#${C.modal}{padding:5px}#${C.modal} .dbn-bs-row{grid-template-columns:25px minmax(0,1fr) 65px;gap:5px}#${C.modal} .dbn-bs-duration{display:none}#${C.modal} .dbn-bs-kind{grid-column:2/4}}
        `;
        document.head.appendChild(style);
    }
    function timeText(seconds) {
        if (seconds === null || seconds === undefined) return "Unknown";
        var total = Math.floor(seconds), mins = Math.floor(total / 60), sec = total % 60;
        var hrs = Math.floor(mins / 60);
        mins %= 60;
        return hrs ? hrs + ":" + String(mins).padStart(2,"0") + ":" + String(sec).padStart(2,"0")
            : mins + ":" + String(sec).padStart(2,"0");
    }
    function createModal() {
        var old = document.getElementById(C.modal);
        if (old) return old;
        addStyles();
        var modal = document.createElement("div");
        modal.id = C.modal;
        modal.innerHTML = `
<div class="dbn-bs-panel" role="dialog" aria-modal="true" aria-label="DBN Intelligent Broadcast Shuffle">
 <div class="dbn-bs-head"><div class="dbn-bs-title">DBN INTELLIGENT BROADCAST SHUFFLE</div><div class="dbn-bs-subtitle">PRIVATE ADMINISTRATOR BROADCAST CONTROL • UPCOMING QUEUE ONLY</div></div>
 <div class="dbn-bs-stats"></div><div class="dbn-bs-warning" style="display:none"></div><div class="dbn-bs-list-wrap"></div>
 <div class="dbn-bs-foot"><div class="dbn-bs-status">Ready</div><button type="button" class="dbn-bs-action dbn-bs-undo" disabled>UNDO DISABLED IN READ-ONLY DIAGNOSTIC</button><button type="button" class="dbn-bs-action dbn-bs-close">CLOSE</button><button type="button" class="dbn-bs-action primary dbn-bs-apply" disabled>GENERATE A PREVIEW FIRST</button></div>
</div>`;
        modal.addEventListener("click", function (e) { if (e.target === modal) hideModal(); });
        modal.querySelector(".dbn-bs-close").addEventListener("click", hideModal);
        modal.querySelector(".dbn-bs-apply").addEventListener("click", runFullShuffle);
        modal.querySelector(".dbn-bs-undo").disabled = true;
        document.body.appendChild(modal);
        return modal;
    }
    function status(message) {
        var modal = document.getElementById(C.modal);
        if (modal) modal.querySelector(".dbn-bs-status").textContent = message;
    }
    function showModal() {
        createModal().style.display = "flex";
        document.body.style.overflow = "hidden";
    }
    function hideModal() {
        var modal = document.getElementById(C.modal);
        if (modal) modal.style.display = "none";
        document.body.style.overflow = "";
    }
    function readUndo() {
        if (undoSnapshot && undoSnapshot.purpose === "V110 pre-shuffle snapshot") return undoSnapshot;
        undoSnapshot = null;
        try {
            var value = JSON.parse(getStore(C.undoPrefix + channelName()) || "null");
            if (value && Array.isArray(value.order) &&
                value.purpose === "V110 pre-shuffle snapshot") undoSnapshot = value;
        } catch (e) {}
        return undoSnapshot;
    }
    function updateUndoButton() {
        var modal = document.getElementById(C.modal);
        if (!modal) return;
        var button = modal.querySelector(".dbn-bs-undo");
        if (button) button.disabled = applying || diagnosticRunning || !readUndo();
    }

    async function testFirstRecoveryMove() {
        alert("V86 is read-only. No moveMedia request can be sent from this diagnostic build.");
        return;
    }

    async function copyQueueDiagnostic() {
        alert("The V89 recovery handler is disabled in V104. Use the preview-approved shuffle or the UNDO SHUFFLE control.");
        return;
    }

    function runReadOnlySocketDiagnostic() {
        if (diagnosticRunning) return;
        var sock = window.socket;
        if (!sock || typeof sock.on !== "function") {
            window.prompt("DBN V113 SOCKET DIAGNOSTIC — SOCKET UNAVAILABLE",
                "Connected socket object: " + (!!sock) + "\nSocket .on function: " + (!!(sock && typeof sock.on === "function")) +
                "\nNo socket events monitored.\nRead-only: true; moveMedia requests sent: 0.");
            return;
        }

        diagnosticRunning = true;
        var beforeQueue = fullQueueOrder().slice();
        var beforeCurrent = currentUid();
        var inboundCounts = Object.create(null);
        var outboundCounts = Object.create(null);
        var moveVideoEvents = [];
        var outboundMoveMedia = 0;
        var listenerCountBefore = null;
        try {
            if (typeof sock.listeners === "function") listenerCountBefore = sock.listeners("moveVideo").length;
        } catch (e) {}

        function onMoveVideo(data) {
            if (moveVideoEvents.length >= 12) return;
            var item = { type: typeof data };
            if (data && typeof data === "object") {
                item.from = data.from;
                item.after = data.after;
                item.keys = Object.keys(data).slice(0, 20);
            } else {
                item.value = data;
            }
            try { item.raw = JSON.stringify(data).slice(0, 500); }
            catch (e) { item.raw = "[unserializable payload]"; }
            moveVideoEvents.push(item);
        }
        function onAny(eventName) {
            var name = String(eventName);
            inboundCounts[name] = (inboundCounts[name] || 0) + 1;
        }
        function onAnyOutgoing(eventName) {
            var name = String(eventName);
            outboundCounts[name] = (outboundCounts[name] || 0) + 1;
            if (name === "moveMedia") outboundMoveMedia++;
        }
        var anyAttached = false, outgoingAttached = false, moveVideoAttached = false;
        try {
            sock.on("moveVideo", onMoveVideo);
            moveVideoAttached = true;
            if (typeof sock.onAny === "function") {
                sock.onAny(onAny);
                anyAttached = true;
            }
            if (typeof sock.onAnyOutgoing === "function") {
                sock.onAnyOutgoing(onAnyOutgoing);
                outgoingAttached = true;
            }
        } catch (attachError) {
            if (moveVideoAttached) {
                if (typeof sock.off === "function") sock.off("moveVideo", onMoveVideo);
                else if (typeof sock.removeListener === "function") sock.removeListener("moveVideo", onMoveVideo);
            }
            diagnosticRunning = false;
            window.prompt("DBN V111 SOCKET DIAGNOSTIC — LISTENER ERROR",
                "Listener setup failed: " + String(attachError && attachError.message || attachError) +
                "\nRead-only: true; moveMedia requests sent: 0.");
            return;
        }

        status("READ-ONLY SOCKET MONITOR ACTIVE • 20 seconds • no queue requests will be sent");
        var monitorBanner = document.getElementById("dbn-v112-monitor-banner");
        if (!monitorBanner) {
            monitorBanner = document.createElement("div");
            monitorBanner.id = "dbn-v112-monitor-banner";
            monitorBanner.style.cssText = "position:fixed;right:14px;bottom:14px;z-index:1000001;max-width:min(440px,calc(100vw - 28px));padding:11px 15px;border:2px solid #ff3333;border-radius:7px;background:#170606;color:#fff;box-shadow:0 0 16px rgba(255,0,0,.8);font:700 13px Arial,sans-serif;text-align:center";
            document.body.appendChild(monitorBanner);
        }
        monitorBanner.textContent = "DBN READ-ONLY SOCKET MONITOR ACTIVE — 20 SECONDS\nUse the REAL CyTube queue now. No shuffle requests are being sent.";
        hideModal();
        window.setTimeout(function () {
            try {
                if (moveVideoAttached) {
                    if (typeof sock.off === "function") sock.off("moveVideo", onMoveVideo);
                    else if (typeof sock.removeListener === "function") sock.removeListener("moveVideo", onMoveVideo);
                }
                if (anyAttached && typeof sock.offAny === "function") sock.offAny(onAny);
                if (outgoingAttached && typeof sock.offAnyOutgoing === "function") sock.offAnyOutgoing(onAnyOutgoing);
            } catch (cleanupError) {}
            var afterQueue = fullQueueOrder().slice();
            var afterCurrent = currentUid();
            var inboundNames = Object.keys(inboundCounts).sort().map(function (name) {
                return name + "=" + inboundCounts[name];
            });
            var outboundNames = Object.keys(outboundCounts).sort().map(function (name) {
                return name + "=" + outboundCounts[name];
            });
            var listenerCountAfter = null;
            try {
                if (typeof sock.listeners === "function") listenerCountAfter = sock.listeners("moveVideo").length;
            } catch (e) {}
            var report = [
                "DBN V111 READ-ONLY SOCKET EVENT DIAGNOSTIC",
                "Channel: " + channelName(),
                "Monitor duration: 20 seconds",
                "Socket exists: true",
                "Socket connected at start: " + !!sock.connected,
                "Socket ID: " + String(sock.id || "unavailable"),
                "Engine ID: " + String(sock.io && sock.io.engine && sock.io.engine.id || "unavailable"),
                "Transport: " + String(sock.io && sock.io.engine && sock.io.engine.transport && sock.io.engine.transport.name || "unavailable"),
                "Socket onAny supported: " + anyAttached,
                "Socket onAnyOutgoing supported: " + outgoingAttached,
                "moveVideo listener attached: " + moveVideoAttached,
                "Existing moveVideo listeners before monitor: " + String(listenerCountBefore),
                "moveVideo listeners after cleanup: " + String(listenerCountAfter),
                "Incoming event names: " + (inboundNames.join(", ") || "none observed"),
                "moveVideo events received: " + moveVideoEvents.length,
                "moveVideo payload samples: " + (moveVideoEvents.length ? JSON.stringify(moveVideoEvents) : "none"),
                "Outgoing event names: " + (outboundNames.join(", ") || "none observed"),
                "moveMedia outgoing events observed: " + outboundMoveMedia,
                "Current UID before/after: " + String(beforeCurrent) + " / " + String(afterCurrent),
                "Queue count before/after: " + beforeQueue.length + " / " + afterQueue.length,
                "Queue order unchanged during monitor: " + (beforeQueue.length === afterQueue.length && beforeQueue.every(function (uid, index) { return uid === afterQueue[index]; })),
                "Read-only: true; diagnostic moveMedia requests sent: 0",
                "No queue changes were requested by this diagnostic."
            ].join("\n");
            diagnosticRunning = false;
            var activeBanner = document.getElementById("dbn-v112-monitor-banner");
            if (activeBanner) activeBanner.remove();
            status("READ-ONLY SOCKET MONITOR COMPLETE • no queue requests sent");
            updateUndoButton();
            window.prompt("DBN V111 SOCKET DIAGNOSTIC COMPLETE — press Ctrl+A, then Ctrl+C to copy:", report);
        }, 20000);
    }

    async function runReadOnlyMovePlanAudit() {
        if (diagnosticRunning) return;
        if (!plan || !Array.isArray(plan.order) || !Array.isArray(plan.source)) {
            alert("Generate a fresh V115 preview before running the audit. No queue changes were made.");
            return;
        }
        var sock = window.socket;
        if (!sock || !sock.connected || typeof sock.on !== "function" || typeof sock.emit !== "function") {
            alert("CyTube's main socket is not connected. No audit request was sent and no queue changes were made.");
            return;
        }
        diagnosticRunning = true;
        status("Read-only audit • checking full playlist with active video protected...");
        function removeListener(name, handler) {
            if (typeof sock.off === "function") sock.off(name, handler);
            else if (typeof sock.removeListener === "function") sock.removeListener(name, handler);
        }
        try {
            var serverPayload = await new Promise(function(resolve, reject) {
                var done = false, timer = null;
                function finish(error, data) {
                    if (done) return;
                    done = true;
                    if (timer) window.clearTimeout(timer);
                    removeListener("playlist", onPlaylist);
                    if (error) reject(error); else resolve(data);
                }
                function onPlaylist(data) { finish(null, data); }
                sock.on("playlist", onPlaylist);
                timer = window.setTimeout(function() {
                    finish(new Error("No authoritative server playlist response was received within 15 seconds."));
                }, 15000);
                try { sock.emit("requestPlaylist"); }
                catch (error) { finish(error); }
            });

            var entries = Array.isArray(serverPayload) ? serverPayload :
                (serverPayload && Array.isArray(serverPayload.playlist) ? serverPayload.playlist :
                (serverPayload && Array.isArray(serverPayload.queue) ? serverPayload.queue :
                (serverPayload && Array.isArray(serverPayload.items) ? serverPayload.items : null)));
            if (!entries) throw new Error("The server response did not contain a readable playlist array.");

            var serverOrder = entries.map(function(item) {
                return item && item.uid !== undefined && item.uid !== null ? String(item.uid) : null;
            }).filter(function(uid) { return uid !== null; });
            var liveOrder = fullQueueOrder().map(String);
            var sourceOrder = plan.source.map(function(item) { return String(item.uid); });
            var movableTarget = plan.order.map(function(item) { return String(item.uid); });
            var current = currentUid();
            var serverCurrentIndex = serverOrder.indexOf(String(current));
            var liveCurrentIndex = liveOrder.indexOf(String(current));
            if (serverCurrentIndex < 0 || liveCurrentIndex < 0) {
                throw new Error("The currently playing UID is missing from the server or browser playlist. The audit refused to make assumptions.");
            }
            if (plan.currentIndex !== liveCurrentIndex) {
                throw new Error("The currently playing video's playlist position changed since the preview. Generate a fresh preview.");
            }
            if (movableTarget.length !== liveOrder.length - 1) {
                throw new Error("The proposed shuffle does not contain exactly every non-current playlist entry.");
            }
            var fullTarget = movableTarget.slice();
            fullTarget.splice(liveCurrentIndex, 0, String(current));
            var moves = buildMovePlanProtectingCurrent(liveOrder, fullTarget, current);
            var serverSet = new Set(serverOrder);
            var liveSet = new Set(liveOrder);
            var targetSet = new Set(fullTarget);
            function duplicateCount(values) { return values.length - new Set(values).size; }
            function firstMismatch(a, b) {
                var limit = Math.min(a.length, b.length);
                for (var i = 0; i < limit; i++) if (a[i] !== b[i]) return i;
                return a.length === b.length ? -1 : limit;
            }
            function isValidMove(move) {
                var from = String(move.from), after = String(move.after);
                return Number.isSafeInteger(move.from) &&
                    (move.after === "append" || move.after === "prepend" || Number.isSafeInteger(move.after)) &&
                    serverSet.has(from) &&
                    (move.after === "append" || move.after === "prepend" || serverSet.has(after)) &&
                    from !== after && from !== String(current);
            }
            var invalidAll = moves.filter(function(move) { return !isValidMove(move); });
            var firstBatch = moves.slice(0, 10);
            var firstBatchDetails = firstBatch.map(function(move, index) {
                return {
                    request:index + 1,
                    from:move.from,
                    fromExistsOnServer:serverSet.has(String(move.from)),
                    fromIsCurrent: String(move.uid) === String(current),
                    after:move.after,
                    afterExistsOnServer:move.after === "prepend" || move.after === "append" || serverSet.has(String(move.after)),
                    afterIsCurrent:String(move.after) === String(current),
                    validTypes:Number.isSafeInteger(move.from) &&
                        (move.after === "append" || move.after === "prepend" || Number.isSafeInteger(move.after)),
                    fromDiffersFromAfter:String(move.from) !== String(move.after)
                };
            });
            var sourceMatchesNonCurrent = exactOrderMatches(
                sourceOrder, liveOrder.filter(function(uid) { return uid !== String(current); })
            );
            var serverMatchesLive = exactOrderMatches(serverOrder, liveOrder);
            var targetSetsMatch = liveSet.size === targetSet.size &&
                liveOrder.every(function(uid) { return targetSet.has(uid); }) &&
                fullTarget.length === liveOrder.length;
            var currentMoved = moves.some(function(move) { return String(move.uid) === String(current); });
            var finalCurrentIndex = fullTarget.indexOf(String(current));
            var report = [
                "DBN V115 READ-ONLY ALL-EXCEPT-CURRENT MOVE-PLAN AUDIT",
                "Channel: " + channelName(),
                "Current playing UID: " + String(current),
                "Current playing original playlist index: " + liveCurrentIndex,
                "Entries before current, now eligible for shuffle: " + liveCurrentIndex,
                "Entries after current, eligible for shuffle: " + (liveOrder.length - liveCurrentIndex - 1),
                "Current video excluded from shuffle: true",
                "Total playlist entries: " + liveOrder.length,
                "Authoritative server playlist entries: " + serverOrder.length,
                "Videos being classified and shuffled: " + sourceOrder.length,
                "Programs among all non-current entries: " + plan.programs.length,
                "Commercials among all non-current entries: " + plan.commercials.length,
                "Proposed movable entries: " + movableTarget.length,
                "Preview source matches every non-current live entry: " + sourceMatchesNonCurrent,
                "Server playlist exactly matches browser playlist: " + serverMatchesLive,
                "Server/browser first mismatch index: " + firstMismatch(serverOrder, liveOrder),
                "Server current UID index: " + serverCurrentIndex,
                "Current UID final target index: " + finalCurrentIndex,
                "Current video retains its original final playlist position: " + (finalCurrentIndex === liveCurrentIndex),
                "Current video ever used as a move source: " + currentMoved,
                "Target contains exactly all existing playlist UIDs: " + targetSetsMatch,
                "Duplicate UIDs in live/server/source/target: " +
                    [duplicateCount(liveOrder),duplicateCount(serverOrder),duplicateCount(sourceOrder),duplicateCount(fullTarget)].join(" / "),
                "Total planned move requests: " + moves.length,
                "First batch request count: " + firstBatch.length,
                "Invalid planned requests across entire plan: " + invalidAll.length,
                "First batch payload audit: " + JSON.stringify(firstBatchDetails),
                "First batch exact payloads: " + JSON.stringify(firstBatch.map(function(move) {
                    return {from:move.from,after:move.after};
                })),
                "First 12 proposed shuffled UIDs: " + movableTarget.slice(0,12).join(", "),
                "Invalid request samples: " + JSON.stringify(invalidAll.slice(0,10).map(function(move) {
                    return {from:move.from,after:move.after,uid:move.uid};
                })),
                "Read-only: true; moveMedia requests sent: 0",
                "No queue changes were made."
            ].join("\\n");
            status("All-except-current move-plan audit complete • current video protected • no moves sent");
            window.prompt("DBN V115 ALL-EXCEPT-CURRENT AUDIT COMPLETE — press Ctrl+A, then Ctrl+C to copy:", report);
        } catch (error) {
            window.prompt("DBN V115 MOVE-PLAN AUDIT BLOCKED — press Ctrl+A, then Ctrl+C to copy:",
                "DBN V115 READ-ONLY AUDIT BLOCKED\\nReason: " +
                String(error && error.message || error) +
                "\\nRead-only: true; moveMedia requests sent: 0\\nNo queue changes were made.");
        } finally {
            diagnosticRunning = false;
            updateUndoButton();
        }
    }



    async function runVerifiedBatches(moves, startOrder, expectedCurrent, operationLabel) {
        var sock=window.socket, expectedLive=startOrder.map(String), batchSize=10;
        var totalBatches=Math.ceil(moves.length/batchSize), confirmed=0, verified=0, started=Date.now();
        function duration(seconds) {
            seconds=Math.max(0,Math.ceil(seconds));
            var h=Math.floor(seconds/3600),m=Math.floor((seconds%3600)/60),s=seconds%60;
            return h ? h+":"+String(m).padStart(2,"0")+":"+String(s).padStart(2,"0")
                : m+":"+String(s).padStart(2,"0");
        }
        function simulate(start,items) {
            var next=start.slice();
            items.forEach(function(move){
                var ix=next.indexOf(String(move.uid));
                if(ix<0)throw new Error("Move UID "+move.uid+" disappeared from the simulated queue.");
                next.splice(ix,1);
                if(move.after==="prepend")next.unshift(String(move.uid));
                else {
                    var ai=next.indexOf(String(move.after));
                    if(ai<0)throw new Error("Move anchor UID "+move.after+" disappeared from the simulated queue.");
                    next.splice(ai+1,0,String(move.uid));
                }
            });
            return next;
        }
        function removeListener(handler) {
            if(typeof sock.off==="function")sock.off("moveVideo",handler);
            else if(typeof sock.removeListener==="function")sock.removeListener("moveVideo",handler);
        }
        for(var offset=0;offset<moves.length;offset+=batchSize) {
            var batchNumber=Math.floor(offset/batchSize)+1;
            var batch=moves.slice(offset,offset+batchSize);
            if(currentUid()!==String(expectedCurrent))throw new Error("The active video changed before batch "+batchNumber+". Execution stopped; no further moves were sent.");
            if(!sock.connected||window.socket!==sock)throw new Error("CyTube disconnected before batch "+batchNumber+".");
            if(!allowed())throw new Error("Playlist-move permission was lost before batch "+batchNumber+".");
            var q=window.PL_ACTION_QUEUE||null;
            if(q&&(q._lock||(q._q&&q._q.length)))throw new Error("CyTube's browser playlist action queue is busy before batch "+batchNumber+".");
            if(!exactOrderMatches(fullQueueOrder().map(String),expectedLive))throw new Error("The live queue no longer matches the last verified batch before batch "+batchNumber+".");
            if(batch.some(function(m){return String(m.uid)===String(expectedCurrent);}))throw new Error("Safety stop: the active video was included as a move source.");
            var expectedAfter=simulate(expectedLive,batch),received=0,unexpected=null,timer=null,handler=null;
            status(operationLabel+" • batch "+batchNumber+"/"+totalBatches+" • sending "+batch.length+" moves • "+confirmed+"/"+moves.length+" confirmed");
            var serverResult=await new Promise(function(resolve){
                var settled=false;
                function finish(result){if(settled)return;settled=true;if(timer)window.clearTimeout(timer);if(handler)removeListener(handler);resolve(result);}
                handler=function(data){
                    var expected=batch[received];
                    if(!data||data.from===undefined||data.after===undefined)return;
                    if(!expected){unexpected={extra:{from:data.from,after:data.after}};finish("extra-server-move");return;}
                    if(String(data.from)===String(expected.from)&&String(data.after)===String(expected.after)){
                        received++;confirmed++;
                        var elapsed=Math.max(0.001,(Date.now()-started)/1000),rate=confirmed/elapsed;
                        var eta=rate>0?duration((moves.length-confirmed)/rate):"calculating";
                        status(operationLabel+" • batch "+batchNumber+"/"+totalBatches+" • "+confirmed+"/"+moves.length+" confirmed • ETA "+eta);
                        if(received===batch.length)finish("confirmed");
                    } else {
                        unexpected={expected:{from:expected.from,after:expected.after},received:{from:data.from,after:data.after}};
                        finish("unexpected-server-move");
                    }
                };
                sock.on("moveVideo",handler);
                timer=window.setTimeout(function(){finish("server-confirmation-timeout");},45000);
                try{batch.forEach(function(move){sock.emit("moveMedia",{from:move.from,after:move.after});});}
                catch(e){unexpected={error:e&&e.message?e.message:String(e)};finish("socket-emit-error");}
            });
            if(serverResult!=="confirmed")throw new Error("Batch "+batchNumber+" stopped after "+received+"/"+batch.length+" server confirmations. Result: "+serverResult+". Details: "+JSON.stringify(unexpected));
            var domResult=await new Promise(function(resolve){
                var began=Date.now(),poll=window.setInterval(function(){
                    if(currentUid()!==String(expectedCurrent)){window.clearInterval(poll);resolve("current-video-changed");return;}
                    var actual=fullQueueOrder().map(String),aq=window.PL_ACTION_QUEUE||null;
                    var idle=!aq||(!aq._lock&&(!aq._q||aq._q.length===0));
                    if(idle&&exactOrderMatches(actual,expectedAfter)){window.clearInterval(poll);resolve("confirmed");return;}
                    if(Date.now()-began>=60000){window.clearInterval(poll);resolve(idle?"complete-order-not-confirmed":"browser-action-queue-not-idle");}
                },100);
            });
            if(domResult!=="confirmed")throw new Error("Batch "+batchNumber+" received all server confirmations, but full browser-queue verification failed: "+domResult+".");
            expectedLive=expectedAfter;verified++;
            status(operationLabel+" • "+confirmed+"/"+moves.length+" confirmed • "+verified+"/"+totalBatches+" batches verified");
        }
        if(currentUid()!==String(expectedCurrent)||!exactOrderMatches(fullQueueOrder().map(String),expectedLive))
            throw new Error("Final active-video or complete-queue verification failed.");
        return {moveRequests:confirmed,batches:verified,totalBatches:totalBatches,queueCount:expectedLive.length,
            finalOrder:expectedLive,elapsedMs:Date.now()-started};
    }

    async function runFullShuffle() {
        if(applying||diagnosticRunning)return;
        if(!plan||!Array.isArray(plan.order)||!Array.isArray(plan.source)){alert("Generate a fresh preview first. No changes were made.");return;}
        if(!allowed()){alert("Administrator playlist-move permission is required. No moves were sent.");return;}
        var sock=window.socket;
        if(!sock||!sock.connected||typeof sock.emit!=="function"||typeof sock.on!=="function"){alert("CyTube's main socket is not connected. No moves were sent.");return;}
        var fresh;
        try{fresh=upcomingSnapshot();}catch(e){alert(e.message);return;}
        var current=String(fresh.currentUid),live=fullQueueOrder().map(String);
        var source=plan.source.map(function(x){return String(x.uid);});
        var actualSource=fresh.shuffleable.map(function(x){return String(x.uid);});
        if(current!==String(plan.currentUid)||fresh.currentIndex!==plan.currentIndex||!exactOrderMatches(source,actualSource)){
            alert("The active video or playlist changed since the preview. Generate a fresh preview. No moves were sent.");return;
        }
        var movableTarget=plan.order.map(function(x){return String(x.uid);});
        if(movableTarget.length!==live.length-1||movableTarget.indexOf(current)!==-1){
            alert("The reviewed order does not contain exactly every non-current playlist entry. No moves were sent.");return;
        }
        var target=movableTarget.slice();target.splice(fresh.currentIndex,0,current);
        var moves;
        try{moves=buildMovePlanProtectingCurrent(live,target,current);}
        catch(e){alert("Move-plan validation failed: "+e.message+" No moves were sent.");return;}
        if(!moves.length){alert("The proposed order already matches the live playlist. No moves are needed.");return;}
        var batchCount=Math.ceil(moves.length/10),checkpointKey=C.undoPrefix+channelName()+":v117-full-shuffle-checkpoint";
        var pendingKey=C.undoPrefix+channelName()+":v117-pending-target";
        var snapshot={order:live.slice(),currentUid:current,currentIndex:fresh.currentIndex,
            createdAt:new Date().toISOString(),purpose:"V110 pre-shuffle snapshot",version:"V117"};
        var confirmation=[
            "APPLY THE FULL DBN BROADCAST SHUFFLE?","",
            "All playlist entries except the currently playing video will be shuffled.",
            "Previously played entries are INCLUDED.",
            "Currently playing UID: "+current+" (never used as a move source)",
            "Total playlist entries: "+live.length,
            "Programs: "+plan.programs.length,
            "Commercials: "+plan.commercials.length,
            "Move requests: "+moves.length,
            "Server-confirmed batches: "+batchCount+" (up to 10 requests each)",
            "",
            plan.warning?"COUNT IMBALANCE WARNING: "+plan.warning:"Program/commercial distribution is ready.",
            "",
            "The original full queue and target order will be saved before execution.",
            "Every batch requires matching server confirmations and a complete browser-queue verification.",
            "If the active video changes, the connection drops, or any verification fails, execution stops immediately.",
            "No automatic retries. No later batches after a failure.",
            "",
            "This will rearrange the live playlist. Keep this page open and do not manually edit the queue.",
            "Proceed with the FULL shuffle?"
        ].join("\n");
        if(!window.confirm(confirmation))return;
        var q=window.PL_ACTION_QUEUE||null;
        if(currentUid()!==current||!exactOrderMatches(fullQueueOrder().map(String),live)||!allowed()||!sock.connected||
            (q&&(q._lock||(q._q&&q._q.length)))){alert("Preflight changed after confirmation. No moves were sent.");return;}
        if(!setStore(C.undoPrefix+channelName(),JSON.stringify(snapshot))||
           !setStore(checkpointKey,JSON.stringify(snapshot))||
           !setStore(pendingKey,JSON.stringify({targetOrder:target.slice(),currentUid:current,checkpointKey:checkpointKey,
                createdAt:snapshot.createdAt,purpose:"V117 resumable full-shuffle target"}))){
            alert("Could not save the original queue checkpoint and target order. No moves were sent.");return;
        }
        undoSnapshot=snapshot;applying=true;plan=null;
        var modal=createModal(),applyButton=modal.querySelector(".dbn-bs-apply");
        var undoButton=modal.querySelector(".dbn-bs-undo"),closeButton=modal.querySelector(".dbn-bs-close");
        applyButton.disabled=true;applyButton.textContent="FULL SHUFFLE RUNNING...";
        undoButton.disabled=true;closeButton.disabled=true;
        modal.querySelectorAll(".dbn-bs-kind").forEach(function(x){x.disabled=true;});
        status("Starting full server-verified shuffle • "+moves.length+" moves • ETA calculating");
        var jqueryFx=window.jQuery&&window.jQuery.fx,oldFx=jqueryFx?jqueryFx.off:undefined;
        try{
            if(jqueryFx)jqueryFx.off=true;
            var result=await runVerifiedBatches(moves,live,current,"Shuffle");
            setStore(pendingKey,JSON.stringify({targetOrder:target.slice(),currentUid:current,checkpointKey:checkpointKey,
                createdAt:snapshot.createdAt,purpose:"V117 completed full-shuffle target",completed:true,
                completedAt:new Date().toISOString()}));
            status("FULL SHUFFLE COMPLETE • "+result.moveRequests+" moves confirmed • all "+result.batches+" batches verified.");
            window.prompt("DBN V117 FULL SHUFFLE SUCCEEDED — press Ctrl+A, then Ctrl+C:",[
                "DBN V117 FULL SHUFFLE SUCCEEDED",
                "Channel: "+channelName(),
                "Move requests sent: "+result.moveRequests,
                "Server confirmations: "+result.moveRequests+"/"+moves.length,
                "Verified batches: "+result.batches+"/"+result.totalBatches,
                "Complete browser queue verified: true",
                "Final queue matches reviewed target: true",
                "Currently playing UID remained: "+current,
                "Current video used as move source: false",
                "Original full-queue checkpoint saved: true",
                "Undo snapshot saved: true",
                "Elapsed seconds: "+(result.elapsedMs/1000).toFixed(1),
                "No automatic retries performed."
            ].join("\n"));
        }catch(e){
            var d=e&&e.dbnDetails?e.dbnDetails:{};
            status("SHUFFLE STOPPED • inspect queue before doing anything else.");
            window.prompt("DBN V117 FULL SHUFFLE STOPPED — press Ctrl+A, then Ctrl+C:",[
                "DBN V117 FULL SHUFFLE STOPPED",
                "Reason: "+String(e&&e.message||e),
                "Server-confirmed moves: "+(d.serverConfirmedMoves!==undefined?d.serverConfirmedMoves:"see last progress status"),
                "Current UID: "+String(currentUid()),
                "Current UID playlist index: "+fullQueueOrder().map(String).indexOf(String(currentUid())),
                "Live playlist entries: "+fullQueueOrder().length,
                "Original checkpoint saved: true",
                "Pending target saved: true",
                "No automatic retries performed.",
                "No later batches sent after the failure.",
                "IMPORTANT: Do not restart the shuffle. Inspect the live queue and checkpoint first."
            ].join("\n"));
        }finally{
            if(jqueryFx)jqueryFx.off=oldFx;
            applying=false;diagnosticRunning=false;
            closeButton.disabled=false;undoButton.disabled=!readUndo();
            applyButton.disabled=true;applyButton.textContent="SHUFFLE ATTEMPT FINISHED — GENERATE A FRESH PREVIEW";
            modal.querySelectorAll(".dbn-bs-kind").forEach(function(x){x.disabled=false;});
            updateUndoButton();
        }
    }

    async function runFirstBatchExecutionTest() {
        if (applying || diagnosticRunning) return;
        if (!plan || !Array.isArray(plan.order) || !Array.isArray(plan.source)) {
            alert("Generate a fresh V116 preview first. No queue changes were made."); return;
        }
        if (!allowed()) { alert("Administrator playlist-move permission is required. No moves were sent."); return; }
        var sock=window.socket;
        if(!sock||!sock.connected||typeof sock.emit!=="function"||typeof sock.on!=="function") {
            alert("CyTube's main socket is not connected. No moves were sent."); return;
        }
        var fresh;
        try { fresh=upcomingSnapshot(); } catch(e) { alert(e.message); return; }
        var sourceOrder=plan.source.map(function(x){return String(x.uid);});
        var freshMovable=fresh.shuffleable.map(function(x){return String(x.uid);});
        if(String(fresh.currentUid)!==String(plan.currentUid) ||
           fresh.currentIndex!==plan.currentIndex ||
           !exactOrderMatches(sourceOrder,freshMovable)) {
            alert("The current video or playlist changed since this preview. No moves were sent. Generate a fresh preview."); return;
        }
        var live=fullQueueOrder().map(String), current=String(fresh.currentUid);
        var targetMovable=plan.order.map(function(x){return String(x.uid);});
        if(targetMovable.length!==live.length-1 || targetMovable.indexOf(current)!==-1) {
            alert("The preview does not contain exactly all non-current videos. No moves were sent."); return;
        }
        var target=targetMovable.slice();
        target.splice(fresh.currentIndex,0,current);
        var moves;
        try { moves=buildMovePlanProtectingCurrent(live,target,current); }
        catch(e) { alert("Move-plan validation failed: "+e.message+" No moves were sent."); return; }
        if(!moves.length) { alert("The proposed order requires no moves. No requests were sent."); return; }
        var batch=moves.slice(0,10);
        var snapshotKey=C.undoPrefix+channelName()+":v116-first-batch-checkpoint";
        var pendingKey=C.undoPrefix+channelName()+":v116-pending-target";
        var checkpoint={order:live.slice(),currentUid:current,currentIndex:fresh.currentIndex,
            targetOrder:target.slice(),createdAt:new Date().toISOString(),
            purpose:"V116 first-batch execution checkpoint"};
        var confirmText=[
            "V116 CONTROLLED FIRST-BATCH TEST",
            "",
            "This will send exactly "+batch.length+" moveMedia requests (the first batch only).",
            "Total planned requests: "+moves.length,
            "Current playing UID: "+current,
            "Current video move source: never",
            "The current video is never a move source; other moves may temporarily change its numeric queue index.",
            "A full original-order checkpoint and target order will be saved first.",
            "All 10 server confirmations and the complete browser queue will be checked.",
            "If any check fails, execution stops. No retries and no later batches.",
            "",
            "The queue WILL be partially rearranged if this first batch succeeds.",
            "Keep the page open and do not manually edit the queue during the test.",
            "",
            "Proceed with this 10-move test?"
        ].join("\n");
        if(!window.confirm(confirmText)) return;
        var q=window.PL_ACTION_QUEUE||null;
        if(currentUid()!==current || !exactOrderMatches(fullQueueOrder().map(String),live) ||
           !allowed() || !sock.connected || (q&&(q._lock||(q._q&&q._q.length)))) {
            alert("Preflight changed after confirmation. No move requests were sent."); return;
        }
        if(!setStore(snapshotKey,JSON.stringify(checkpoint)) ||
           !setStore(pendingKey,JSON.stringify({targetOrder:target.slice(),currentUid:current,checkpointKey:snapshotKey,
                createdAt:checkpoint.createdAt,purpose:"V116 resumable first-batch target"}))) {
            alert("Could not save the V116 recovery checkpoint and pending target. No moves were sent."); return;
        }
        diagnosticRunning=true; applying=true; updateUndoButton();
        var modal=createModal(), applyButton=modal.querySelector(".dbn-bs-apply");
        applyButton.disabled=true; applyButton.textContent="FIRST BATCH RUNNING...";
        var jqueryFx=window.jQuery&&window.jQuery.fx, oldFx=jqueryFx?jqueryFx.off:undefined;
        function removeMoveListener(handler) {
            if(typeof sock.off==="function") sock.off("moveVideo",handler);
            else if(typeof sock.removeListener==="function") sock.removeListener("moveVideo",handler);
        }
        function simulateBatch(start,items) {
            var expected=start.slice();
            items.forEach(function(m){
                var ix=expected.indexOf(String(m.uid));
                if(ix<0) throw new Error("Move UID disappeared from simulated queue: "+m.uid);
                expected.splice(ix,1);
                if(m.after==="prepend") expected.unshift(String(m.uid));
                else {
                    var ai=expected.indexOf(String(m.after));
                    if(ai<0) throw new Error("Move anchor disappeared from simulated queue: "+m.after);
                    expected.splice(ai+1,0,String(m.uid));
                }
            });
            return expected;
        }
        var received=0,unexpected=null,timer=null,handler=null,started=Date.now();
        try {
            if(jqueryFx) jqueryFx.off=true;
            var expectedAfter=simulateBatch(live,batch);
            if(expectedAfter.indexOf(current)<0 ||
               batch.some(function(m){return String(m.uid)===current;})) {
                throw new Error("Preflight safety check failed: the active video is missing or appears as a move source. No requests were sent.");
            }
            var serverResult=await new Promise(function(resolve){
                var settled=false;
                function finish(result){
                    if(settled)return; settled=true;
                    if(timer)window.clearTimeout(timer);
                    removeMoveListener(handler);
                    resolve(result);
                }
                handler=function(data){
                    var expected=batch[received];
                    if(!data||data.from===undefined||data.after===undefined)return;
                    if(!expected){unexpected={extra:{from:data.from,after:data.after}};finish("extra-server-move");return;}
                    if(String(data.from)===String(expected.from)&&String(data.after)===String(expected.after)){
                        received++;
                        status("First batch • server confirmed "+received+"/"+batch.length);
                        if(received===batch.length)finish("confirmed");
                    } else {
                        unexpected={expected:{from:expected.from,after:expected.after},received:{from:data.from,after:data.after}};
                        finish("unexpected-server-move");
                    }
                };
                sock.on("moveVideo",handler);
                timer=window.setTimeout(function(){finish("server-confirmation-timeout");},45000);
                try { batch.forEach(function(m){sock.emit("moveMedia",{from:m.from,after:m.after});}); }
                catch(e){unexpected={error:e&&e.message?e.message:String(e)};finish("socket-emit-error");}
            });
            if(serverResult!=="confirmed") {
                throw new Error("Stopped after "+received+" of "+batch.length+" server confirmations. Result: "+serverResult+". Details: "+JSON.stringify(unexpected));
            }
            var domResult=await new Promise(function(resolve){
                var began=Date.now(),poll=window.setInterval(function(){
                    if(currentUid()!==current){window.clearInterval(poll);resolve("current-video-changed");return;}
                    var actual=fullQueueOrder().map(String),aq=window.PL_ACTION_QUEUE||null;
                    var idle=!aq||(!aq._lock&&(!aq._q||aq._q.length===0));
                    if(idle&&exactOrderMatches(actual,expectedAfter)){window.clearInterval(poll);resolve("confirmed");return;}
                    if(Date.now()-began>=60000){window.clearInterval(poll);resolve(idle?"complete-order-not-confirmed":"browser-action-queue-not-idle");}
                },100);
            });
            if(domResult!=="confirmed") throw new Error("All "+batch.length+" server confirmations arrived, but complete queue verification failed: "+domResult+". No later batches were sent.");
            if(currentUid()!==current || fullQueueOrder().map(String).indexOf(current)<0) {
                throw new Error("Final active-video identity verification failed. No later batches were sent.");
            }
            var report=[
                "DBN V116 FIRST-BATCH EXECUTION TEST SUCCEEDED",
                "Channel: "+channelName(),
                "Move requests sent: "+batch.length,
                "Server confirmations: "+received+"/"+batch.length,
                "Complete browser queue verified: true",
                "Current playing UID: "+current,
                "Current video original/final index: "+fresh.currentIndex+" / "+fullQueueOrder().map(String).indexOf(current),
                "Current video remained the active playback UID: true",
                "Current video used as move source: false",
                "Total planned requests remaining after test: "+(moves.length-batch.length),
                "Original full-queue checkpoint saved: true",
                "Pending target order saved: true",
                "Elapsed seconds: "+((Date.now()-started)/1000).toFixed(1),
                "No automatic retries performed.",
                "No subsequent batches sent."
            ].join("\n");
            status("First batch verified • stopped safely after 10 moves");
            window.prompt("DBN V116 FIRST-BATCH TEST RESULT — press Ctrl+A, then Ctrl+C:",report);
        } catch(e) {
            var report=[
                "DBN V116 FIRST-BATCH EXECUTION TEST STOPPED",
                "Reason: "+String(e&&e.message||e),
                "Server confirmations received: "+received+"/"+batch.length,
                "Current playing UID: "+String(currentUid()),
                "Current UID current/original index: "+fullQueueOrder().map(String).indexOf(String(currentUid()))+" / "+fresh.currentIndex,
                "Live queue entries: "+fullQueueOrder().length,
                "Recovery checkpoint saved: true",
                "Pending target order saved: true",
                "No automatic retries performed.",
                "No subsequent batches sent.",
                "IMPORTANT: Inspect the live queue against the saved checkpoint before doing anything else."
            ].join("\n");
            status("First batch stopped • inspect queue before continuing");
            window.prompt("DBN V116 FIRST-BATCH TEST STOPPED — press Ctrl+A, then Ctrl+C:",report);
        } finally {
            if(timer)window.clearTimeout(timer);
            if(handler)removeMoveListener(handler);
            if(jqueryFx)jqueryFx.off=oldFx;
            applying=false; diagnosticRunning=false;
            applyButton.disabled=false;
            applyButton.textContent="FIRST BATCH TEST ALREADY RUN — REGENERATE PREVIEW";
            applyButton.disabled=true;
            updateUndoButton();
        }
    }

    function renderPlan(p) {
        var modal = createModal(), stats = modal.querySelector(".dbn-bs-stats");
        var list = modal.querySelector(".dbn-bs-list-wrap");
        var warning = modal.querySelector(".dbn-bs-warning");
        var apply = modal.querySelector(".dbn-bs-apply");
        var savedOverrides = overrides();
        stats.innerHTML = "";
        [
            [p.source.length,"VIDEOS TO SHUFFLE"],
            [p.programs.length,"PROGRAMS"],
            [p.commercials.length,"COMMERCIALS"],
            [p.currentIndex,"ENTRIES BEFORE CURRENT — ALSO SHUFFLED"],
            [1,"CURRENT VIDEO EXCLUDED FROM MOVES"],
            [p.order.length,"PROPOSED SHUFFLE ORDER"]
        ].forEach(function (pair) {
            var box = document.createElement("div"), strong = document.createElement("strong");
            box.className = "dbn-bs-stat"; strong.textContent = pair[0];
            box.appendChild(strong); box.appendChild(document.createTextNode(pair[1])); stats.appendChild(box);
        });
        warning.style.display = p.warning ? "block" : "none";
        warning.textContent = p.warning || "";
        list.innerHTML = "";
        var intro = document.createElement("div");
        intro.style.cssText = "padding:4px 2px 9px;color:#c9aaaa;font-size:11px";
        intro.textContent = "V115 ALL-EXCEPT-CURRENT PLAN — all playlist entries except the currently playing video are classified and shuffled, including entries that were before the current video. The current video is never a moved item and remains at its original playlist index in the completed order. V117 full execution build: all non-current playlist entries are shuffled with server-confirmed batches of 10 and full queue verification after every batch.";
        list.appendChild(intro);
        p.order.forEach(function (item, index) {
            var row = document.createElement("div");
            row.className = "dbn-bs-row";
            var num = document.createElement("div"); num.className = "dbn-bs-index";
            num.textContent = (index + 1) + (index >= p.currentIndex ? " • " : ". "); row.appendChild(num);
            var title = document.createElement("div"); title.className = "dbn-bs-name";
            title.textContent = item.title; title.title = item.title;
            var manualChoice = savedOverrides[mediaKey(item)];
            var automaticKind = classification(item, {});
            var displayedKind = manualChoice === "program" || manualChoice === "commercial" ? manualChoice : automaticKind;
            var detection = document.createElement("span");
            detection.className = "dbn-bs-detection is-" + displayedKind;
            detection.textContent = manualChoice === "program" || manualChoice === "commercial"
                ? "AUTO: " + automaticKind.toUpperCase() + "  •  OVERRIDE: " + manualChoice.toUpperCase()
                : "AUTO DETECTED: " + automaticKind.toUpperCase();
            title.appendChild(detection);
            row.appendChild(title);
            var duration = document.createElement("div"); duration.className = "dbn-bs-duration";
            duration.textContent = timeText(item.duration); row.appendChild(duration);
            var select = document.createElement("select"); select.className = "dbn-bs-kind";
            [["auto","AUTO DETECT"],["program","PROGRAM"],["commercial","COMMERCIAL"]].forEach(function (o) {
                var option = document.createElement("option"); option.value = o[0];
                option.textContent = o[1]; select.appendChild(option);
            });
            select.value = manualChoice || "auto";
            select.addEventListener("change", function () {
                saveOverride(item, select.value);
                try {
                    plan = makePlan(upcomingSnapshot());
                    renderPlan(plan);
                    status("Classification saved for this video • preview recalculated");
                } catch (e) { status(e.message); }
            });
            row.appendChild(select); list.appendChild(row);
        });
        apply.disabled = false;
        apply.textContent = "APPLY FULL SHUFFLE (SERVER-VERIFIED BATCHES OF 10)";
        updateUndoButton();
        status("All-except-current preview ready • current video protected");
    }
    function openPreview() {
        if (!allowed()) {
            alert("This private tool is available only to channel administrators with playlist-move permission.");
            return;
        }
        try {
            var snapshot = upcomingSnapshot();
            if (!snapshot.upcoming.length) {
                alert("There are no upcoming videos to shuffle. The currently playing video was left untouched.");
                return;
            }
            plan = makePlan(snapshot);
            renderPlan(plan);
            showModal();
        } catch (e) { alert(e.message || "Unable to analyze the playlist."); }
    }
    function fullQueueOrder() {
        return queueEntries().map(function (item) { return item.uid; });
    }
    function immediatelyAfter(from, after) {
        var order = fullQueueOrder();
        if (String(after) === "prepend") return order.length > 0 && order[0] === String(from);
        var a = order.indexOf(String(from)), b = order.indexOf(String(after));
        return a >= 0 && b >= 0 && a === b + 1;
    }
    function waitForMove(from, after, expectedCurrent) {
        return new Promise(function (resolve) {
            var start = Date.now();
            var timer = window.setInterval(function () {
                if (currentUid() !== String(expectedCurrent)) {
                    clearInterval(timer); resolve(false); return;
                }
                if (immediatelyAfter(from, after)) {
                    clearInterval(timer); resolve(true); return;
                }
                if (Date.now() - start > C.moveTimeout) {
                    clearInterval(timer); resolve(false);
                }
            }, 100);
        });
    }

    function waitForPrefix(expectedPrefix, expectedCurrent) {
        return new Promise(function (resolve) {
            var start = Date.now();
            var timer = window.setInterval(function () {
                if (currentUid() !== String(expectedCurrent)) {
                    clearInterval(timer); resolve(false); return;
                }
                var actual = fullQueueOrder();
                var matches = expectedPrefix.length <= actual.length &&
                    expectedPrefix.every(function (uid, index) {
                        return actual[index] === String(uid);
                    });
                if (matches) {
                    clearInterval(timer); resolve(true); return;
                }
                if (Date.now() - start > C.moveTimeout) {
                    clearInterval(timer); resolve(false);
                }
            }, 100);
        });
    }
    function buildMovePlan(initialOrder, targetOrder) {
        var initial = initialOrder.map(String), target = targetOrder.map(String);
        if (initial.length !== target.length) throw new Error("The current queue and proposed order contain different numbers of entries.");
        if (new Set(initial).size !== initial.length || new Set(target).size !== target.length) throw new Error("Duplicate UIDs were detected. No queue moves were planned.");
        var available = new Set(initial);
        for (var i = 0; i < target.length; i++) if (!available.has(target[i])) throw new Error("The proposed order contains a UID that is not in the live queue: " + target[i]);
        var simulated = initial.slice(), moves = [], anchor = "prepend";
        for (var j = 0; j < target.length; j++) {
            var uid = target[j], fromIndex = simulated.indexOf(uid);
            var anchorIndex = anchor === "prepend" ? -1 : simulated.indexOf(String(anchor));
            var alreadyPlaced = anchor === "prepend" ? fromIndex === 0 : fromIndex >= 0 && anchorIndex >= 0 && fromIndex === anchorIndex + 1;
            if (!alreadyPlaced) {
                var fromNumber = Number(uid), afterNumber = anchor === "prepend" ? "prepend" : Number(anchor);
                if (!Number.isSafeInteger(fromNumber) || (afterNumber !== "prepend" && !Number.isSafeInteger(afterNumber))) throw new Error("A queue UID is not a safe numeric CyTube UID. No moves were sent.");
                if (fromIndex < 0) throw new Error("The move planner could not find UID " + uid + ".");
                moves.push({uid:uid,from:fromNumber,after:afterNumber});
                simulated.splice(fromIndex,1);
                if (anchor === "prepend") simulated.unshift(uid);
                else {
                    anchorIndex = simulated.indexOf(String(anchor));
                    if (anchorIndex < 0) throw new Error("The move planner lost anchor UID " + anchor + ".");
                    simulated.splice(anchorIndex+1,0,uid);
                }
            }
            anchor=uid;
        }
        if (simulated.some(function(uid,index){return uid!==target[index];})) throw new Error("The simulated move plan did not produce the complete proposed order. No moves were sent.");
        return moves;
    }

    function buildMovePlanProtectingCurrent(initialOrder, targetOrder, protectedUid) {
        var initial = initialOrder.map(String), target = targetOrder.map(String), fixed = String(protectedUid);
        if (initial.length !== target.length) throw new Error("The current queue and proposed order contain different numbers of entries.");
        if (new Set(initial).size !== initial.length || new Set(target).size !== target.length) throw new Error("Duplicate UIDs were detected. No queue moves were planned.");
        if (initial.filter(function(uid){return uid===fixed;}).length !== 1 ||
            target.filter(function(uid){return uid===fixed;}).length !== 1) {
            throw new Error("The protected current UID must appear exactly once in both orders.");
        }
        var available = new Set(initial);
        for (var i=0;i<target.length;i++) if(!available.has(target[i])) throw new Error("The proposed order contains a UID that is not in the live queue: "+target[i]);
        var simulated=initial.slice(), moves=[], anchor="prepend";
        for(var j=0;j<target.length;j++){
            var uid=target[j];
            if(uid===fixed){ anchor=fixed; continue; }
            var fromIndex=simulated.indexOf(uid);
            var anchorIndex=anchor==="prepend"?-1:simulated.indexOf(String(anchor));
            var alreadyPlaced=anchor==="prepend"?fromIndex===0:
                fromIndex>=0&&anchorIndex>=0&&fromIndex===anchorIndex+1;
            if(!alreadyPlaced){
                var fromNumber=Number(uid),afterNumber=anchor==="prepend"?"prepend":Number(anchor);
                if(!Number.isSafeInteger(fromNumber)||(afterNumber!=="prepend"&&!Number.isSafeInteger(afterNumber))) throw new Error("A queue UID is not a safe numeric CyTube UID. No moves were sent.");
                if(fromIndex<0)throw new Error("The move planner could not find UID "+uid+".");
                moves.push({uid:uid,from:fromNumber,after:afterNumber});
                simulated.splice(fromIndex,1);
                if(anchor==="prepend")simulated.unshift(uid);
                else {
                    anchorIndex=simulated.indexOf(String(anchor));
                    if(anchorIndex<0)throw new Error("The move planner lost protected/current anchor UID "+anchor+".");
                    simulated.splice(anchorIndex+1,0,uid);
                }
            }
            anchor=uid;
        }
        if(simulated.some(function(uid,index){return uid!==target[index];})) throw new Error("The protected-current move plan did not produce the complete proposed order. No moves were sent.");
        if(moves.some(function(move){return String(move.uid)===fixed;})) throw new Error("Safety check failed: the current video appeared as a moved item.");
        return moves;
    }

    function exactOrderMatches(actual, expected) {
        return actual.length===expected.length && expected.every(function(uid,index){return actual[index]===String(uid);});
    }

    async function applyOrder(targetOrder, expectedCurrent, expectedStartOrder, operationLabel) {
        throw new Error("V111 is read-only. applyOrder is hard-disabled; no moveMedia requests can be sent.");
        var sock=window.socket;
        if(!sock||!sock.connected||typeof sock.emit!=="function"||typeof sock.on!=="function") throw new Error("CyTube's main socket is not connected or cannot receive server confirmations. No moves were sent.");
        if(!allowed()) throw new Error("Playlist-move permission is unavailable. No moves were sent.");
        if(currentUid()!==String(expectedCurrent)) throw new Error("The currently playing video changed before queue moves began. No moves were sent.");
        var actionQueue=window.PL_ACTION_QUEUE||null;
        if(actionQueue&&(actionQueue._lock||(actionQueue._q&&actionQueue._q.length))) throw new Error("CyTube's browser playlist action queue is busy. Wait until it settles and retry from a fresh preview.");
        var initialOrder=fullQueueOrder();
        if(expectedStartOrder&&!exactOrderMatches(initialOrder,expectedStartOrder)) throw new Error("The live queue changed after confirmation. No moves were sent; generate a fresh preview.");
        var moves=buildMovePlan(initialOrder,targetOrder),batchSize=10,batchCount=Math.ceil(moves.length/batchSize);
        if(!moves.length) return {moveRequests:0,batches:0,queueCount:initialOrder.length,finalOrder:initialOrder};
        var jqueryFx=window.jQuery&&window.jQuery.fx,previousFxOff=jqueryFx?jqueryFx.off:undefined;
        var totalServerConfirmed=0,completedBatches=0,expectedLive=initialOrder.slice(),failedBatch=0;
        var operationStartedAt=Date.now();
        function progressDuration(seconds){
            seconds=Math.max(0,Math.ceil(seconds));
            var hours=Math.floor(seconds/3600),minutes=Math.floor((seconds%3600)/60),secs=seconds%60;
            return hours ? hours+":"+String(minutes).padStart(2,"0")+":"+String(secs).padStart(2,"0")
                : minutes+":"+String(secs).padStart(2,"0");
        }
        function progressStatus(phase){
            var elapsed=Math.max(0.001,(Date.now()-operationStartedAt)/1000);
            var rate=totalServerConfirmed/elapsed;
            var remaining=Math.max(0,moves.length-totalServerConfirmed);
            var eta=rate>0?progressDuration(remaining/rate):"calculating";
            status(operationLabel+" • "+phase+" • "+totalServerConfirmed+"/"+moves.length+
                " confirmed • "+completedBatches+"/"+batchCount+" batches verified • elapsed "+
                progressDuration(elapsed)+" • ETA "+eta);
        }

        function removeListener(name,handler){
            if(typeof sock.off==="function")sock.off(name,handler);
            else if(typeof sock.removeListener==="function")sock.removeListener(name,handler);
        }
        function waitForServerBatch(batch,batchNumber){
            return new Promise(function(resolve){
                var received=0,settled=false,timer=null,unexpected=null;
                function finish(result){
                    if(settled)return;settled=true;if(timer)window.clearTimeout(timer);
                    removeListener("moveVideo",onMoveVideo);
                    resolve({result:result,received:received,unexpected:unexpected});
                }
                function onMoveVideo(data){
                    var expected=batch[received];
                    if(!data||data.from===undefined||data.after===undefined)return;
                    if(!expected){unexpected={from:String(data.from),after:String(data.after)};finish("extra-server-move");return;}
                    if(String(data.from)===String(expected.from)&&String(data.after)===String(expected.after)){
                        received++;progressStatus("batch "+batchNumber+"/"+batchCount+" • server confirmed "+received+"/"+batch.length);
                        if(received===batch.length)finish("confirmed");return;
                    }
                    unexpected={expected:{from:expected.from,after:expected.after},received:{from:String(data.from),after:String(data.after)}};
                    finish("unexpected-server-move");
                }
                sock.on("moveVideo",onMoveVideo);
                timer=window.setTimeout(function(){finish("server-confirmation-timeout");},45000);
                try{batch.forEach(function(move){sock.emit("moveMedia",{from:move.from,after:move.after});});}
                catch(e){unexpected={error:e&&e.message?e.message:String(e)};finish("socket-emit-error");}
            });
        }
        function waitForExactQueue(expectedOrder,current,timeoutMs){
            return new Promise(function(resolve){
                var started=Date.now(),timer=window.setInterval(function(){
                    if(currentUid()!==String(current)){window.clearInterval(timer);resolve("current-video-changed");return;}
                    var actual=fullQueueOrder(),q=window.PL_ACTION_QUEUE||null;
                    var idle=!q||(!q._lock&&(!q._q||q._q.length===0));
                    if(idle&&exactOrderMatches(actual,expectedOrder)){window.clearInterval(timer);resolve("confirmed");return;}
                    if(Date.now()-started>=timeoutMs){window.clearInterval(timer);resolve(idle?"complete-order-not-confirmed":"browser-action-queue-not-idle");}
                },100);
            });
        }

        try{
            if(jqueryFx)jqueryFx.off=true;
            for(var offset=0;offset<moves.length;offset+=batchSize){
                var batchNumber=Math.floor(offset/batchSize)+1,batch=moves.slice(offset,offset+batchSize);failedBatch=batchNumber;
                if(!allowed())throw new Error("Playlist-move permission was lost before batch "+batchNumber+".");
                if(!sock.connected)throw new Error("CyTube disconnected before batch "+batchNumber+".");
                if(currentUid()!==String(expectedCurrent))throw new Error("The currently playing video changed before batch "+batchNumber+".");
                if(!exactOrderMatches(fullQueueOrder(),expectedLive))throw new Error("The complete live queue changed before batch "+batchNumber+". No further moves were sent; inspect the queue before retrying.");
                status(operationLabel+" batch "+batchNumber+"/"+batchCount+" • sending "+batch.length+" move requests...");
                var serverResult=await waitForServerBatch(batch,batchNumber);
                totalServerConfirmed+=serverResult.received;
                if(serverResult.result!=="confirmed")throw new Error("Stopped in batch "+batchNumber+". CyTube confirmed "+serverResult.received+" of "+batch.length+" moves. Result: "+serverResult.result+". Unexpected event: "+(serverResult.unexpected?JSON.stringify(serverResult.unexpected):"none")+". Do not retry until the queue has been inspected.");
                batch.forEach(function(move){
                    var oldIndex=expectedLive.indexOf(String(move.uid));
                    if(oldIndex<0)throw new Error("Confirmed move UID "+move.uid+" disappeared from the expected queue.");
                    expectedLive.splice(oldIndex,1);
                    if(move.after==="prepend")expectedLive.unshift(String(move.uid));
                    else{
                        var afterIndex=expectedLive.indexOf(String(move.after));
                        if(afterIndex<0)throw new Error("Confirmed move anchor UID "+move.after+" disappeared.");
                        expectedLive.splice(afterIndex+1,0,String(move.uid));
                    }
                });
                var domResult=await waitForExactQueue(expectedLive,expectedCurrent,60000);
                if(domResult!=="confirmed")throw new Error("CyTube confirmed all "+batch.length+" server moves in batch "+batchNumber+", but the complete browser queue did not pass verification. Result: "+domResult+". No later batches were sent.");
                completedBatches++;
                progressStatus("progress");
            }
            if(currentUid()!==String(expectedCurrent)||!exactOrderMatches(fullQueueOrder(),targetOrder.map(String)))throw new Error("Final full-queue verification failed after the last batch.");
            var finalQueue=window.PL_ACTION_QUEUE||null;
            if(finalQueue&&(finalQueue._lock||(finalQueue._q&&finalQueue._q.length)))throw new Error("The final browser playlist action queue is not idle.");
            return {moveRequests:totalServerConfirmed,batches:completedBatches,queueCount:expectedLive.length,finalOrder:expectedLive.slice(),elapsedMs:Date.now()-operationStartedAt};
        }catch(error){
            error.dbnDetails={failedBatch:failedBatch,serverConfirmedMoves:totalServerConfirmed,verifiedBatches:completedBatches,totalBatches:batchCount,currentUid:currentUid(),liveQueueCount:fullQueueOrder().length,first15LiveUids:fullQueueOrder().slice(0,15)};
            throw error;
        }finally{if(jqueryFx)jqueryFx.off=previousFxOff;}
    }

    async function applyPlan(){
        alert("V111 is read-only. Live shuffle is disabled and no moveMedia requests can be sent.");
        return;
        if(applying||!plan)return;
        if(!allowed()){alert("Administrator playlist permission is required.");return;}
        var reviewedPlan=plan;
        var fresh;
        try{fresh=upcomingSnapshot();}catch(e){alert(e.message);return;}
        var previewOrder=reviewedPlan.source.map(function(item){return String(item.uid);});
        var freshOrder=fresh.upcoming.map(function(item){return String(item.uid);});
        if(fresh.currentUid!==String(reviewedPlan.currentUid)||!exactOrderMatches(freshOrder,previewOrder)){
            alert("The currently playing video or upcoming queue changed after the preview. Nothing was moved. Close this preview and generate a fresh one.");
            status("Preview is stale • live queue unchanged");return;
        }
        if(reviewedPlan.order.length!==freshOrder.length){
            alert("The reviewed plan does not contain every upcoming entry. No moves were sent.");return;
        }
        var targetOrder=reviewedPlan.order.map(function(item){return String(item.uid);}),moves;
        try{moves=buildMovePlan(freshOrder,targetOrder);}catch(e){alert(e.message);return;}
        if(!moves.length){
            window.prompt("DBN V110 SHUFFLE — NO MOVES NEEDED:","The proposed broadcast order is already the live queue order. No socket requests were sent.");
            return;
        }
        var batchSize=10,batchCount=Math.ceil(moves.length/batchSize);
        var confirmation=[
            "APPLY THE REVIEWED DBN BROADCAST SHUFFLE?","",
            "Upcoming videos: "+freshOrder.length,
            "Programs: "+reviewedPlan.programs.length,
            "Commercials detected: "+reviewedPlan.commercials.length,
            "Move requests required: "+moves.length,
            "Server-confirmed batches: "+batchCount+" of up to "+batchSize+" moves","",
            reviewedPlan.warning ? "COUNT IMBALANCE WARNING:" : "PROGRAM / COMMERCIAL COUNTS:",
            reviewedPlan.warning || "The detected counts permit the planned program-first distribution.",
            "",
            "The proposed order is the one displayed in the preview.",
            "Every move must be confirmed by CyTube's server.",
            "The entire browser queue must match after each batch before the next is sent.",
            "The currently playing video will not be moved.",
            "A V110 pre-shuffle snapshot will be saved for the protected UNDO SHUFFLE operation.",
            "No automatic retries will be performed.",
            "Progress will show confirmed moves, verified batches, elapsed time and estimated time remaining.","",
            "Keep this page open and do not manually edit the queue while it runs.","",
            "Proceed with the live shuffle?"
        ].join("\n");
        if(!window.confirm(confirmation))return;
        if(currentUid()!==String(fresh.currentUid)||!exactOrderMatches(fullQueueOrder(),freshOrder)||!allowed()||!window.socket||!window.socket.connected){
            alert("The queue, current video, connection, or permission changed during confirmation. No moves were sent.");
            status("Preflight changed • nothing was moved");return;
        }
        var q=window.PL_ACTION_QUEUE||null;
        if(q&&(q._lock||(q._q&&q._q.length))){
            alert("CyTube's browser playlist action queue became busy. No moves were sent.");return;
        }
        var snapshot={order:freshOrder.slice(),currentUid:fresh.currentUid,createdAt:new Date().toISOString(),purpose:"V110 pre-shuffle snapshot"};
        if(!setStore(C.undoPrefix+channelName(),JSON.stringify(snapshot))){
            alert("Could not save the V110 pre-shuffle snapshot in this browser. No queue changes were made.");return;
        }
        undoSnapshot=snapshot;applying=true;plan=null;
        var modal=createModal(),applyButton=modal.querySelector(".dbn-bs-apply");
        var undoButton=modal.querySelector(".dbn-bs-undo"),closeButton=modal.querySelector(".dbn-bs-close");
        applyButton.disabled=true;applyButton.textContent="SHUFFLE IN PROGRESS...";
        undoButton.disabled=true;closeButton.disabled=true;
        modal.querySelectorAll(".dbn-bs-kind").forEach(function(select){select.disabled=true;});
        status("Starting server-verified shuffle • "+moves.length+" moves • elapsed 0:00 • ETA calculating");
        try{
            var result=await applyOrder(targetOrder,fresh.currentUid,freshOrder,"Shuffle");
            status("Broadcast shuffle complete • all server and full-queue checks passed.");
            window.prompt("DBN V111 READ-ONLY DIAGNOSTIC SUCCEEDED — press Ctrl+A, then Ctrl+C to copy:",[
                "DBN V110 INTELLIGENT SHUFFLE SUCCEEDED",
                "Server-confirmed move requests: "+result.moveRequests,
                "Verified batches: "+result.batches+"/"+batchCount,
                "Upcoming queue entries: "+result.queueCount,
                "Final queue exactly matches reviewed preview: true",
                "Browser playlist action queue idle: true",
                "Currently playing UID before/after: "+fresh.currentUid+" / "+String(currentUid()),
                "V110 pre-shuffle snapshot saved: true",
                "Elapsed time: "+(Math.round(result.elapsedMs/1000))+" seconds",
                "No automatic retries were performed."
            ].join("\n"));
        }catch(e){
            status("Shuffle stopped • inspect the live queue before any further action.");
            var d=e&&e.dbnDetails?e.dbnDetails:{};
            window.prompt("DBN V110 INTELLIGENT SHUFFLE STOPPED — press Ctrl+A, then Ctrl+C to copy:",[
                "DBN V110 INTELLIGENT SHUFFLE STOPPED",
                "Failure: "+(e&&e.message?e.message:String(e)),
                "Failed/current batch: "+(d.failedBatch||"preflight"),
                "Server-confirmed moves: "+(d.serverConfirmedMoves||0),
                "Verified batches: "+(d.verifiedBatches||0)+"/"+(d.totalBatches||batchCount),
                "Upcoming queue entries now: "+(d.liveQueueCount||fullQueueOrder().length),
                "First 15 live UIDs now: "+((d.first15LiveUids||fullQueueOrder().slice(0,15)).join(", ")),
                "Current UID at stop: "+String(currentUid()),
                "V110 pre-shuffle snapshot preserved: true",
                "No automatic retries were performed.",
                "Do not start another shuffle until the queue has been inspected. If the queue is stable and matches the expected current state, use the protected UNDO SHUFFLE control to restore the saved order."
            ].join("\n"));
        }finally{
            applying=false;closeButton.disabled=false;applyButton.disabled=true;
            applyButton.textContent="CLOSE AND GENERATE A NEW PREVIEW";updateUndoButton();
        }
    }

    async function undo(){
        alert("V111 is read-only. Undo is disabled and no moveMedia requests can be sent.");
        return;
        if(applying||diagnosticRunning)return;
        if(!allowed()){alert("Administrator playlist permission is required to restore the prior queue order.");return;}
        var saved=readUndo();
        if(!saved||!Array.isArray(saved.order)||!saved.order.length){alert("No saved pre-shuffle queue order is available.");return;}
        var beforeCurrent=currentUid();
        if(beforeCurrent===null){alert("CyTube has not identified the currently playing video. No moves were sent.");return;}
        var before=fullQueueOrder();
        if(!before.length||new Set(before).size!==before.length){alert("The live queue is empty or contains duplicate UIDs. Restore was blocked.");return;}
        var savedOrder=saved.order.map(String);
        if(new Set(savedOrder).size!==savedOrder.length){alert("The saved pre-shuffle snapshot contains duplicate UIDs. Restore was blocked.");return;}
        var currentSet=new Set(before),target=savedOrder.filter(function(uid){return currentSet.has(uid);});
        before.forEach(function(uid){if(target.indexOf(uid)===-1)target.push(uid);});
        var moves;
        try{moves=buildMovePlan(before,target);}catch(e){alert(e.message);return;}
        if(!moves.length){window.prompt("DBN V110 UNDO — NO MOVES NEEDED:","The live upcoming queue already matches the saved pre-shuffle order for all remaining videos. No socket requests were sent.");return;}
        var batchCount=Math.ceil(moves.length/10);
        if(!window.confirm([
            "RESTORE THE SAVED PRE-SHUFFLE ORDER?","","Live upcoming videos: "+before.length,
            "Saved videos still present: "+savedOrder.filter(function(uid){return currentSet.has(uid);}).length,
            "Additional live videos to preserve at the end: "+before.filter(function(uid){return savedOrder.indexOf(uid)===-1;}).length,
            "Move requests required: "+moves.length,"Server-confirmed batches: "+batchCount,"",
            "This does not touch the currently playing video.",
            "Every move requires a CyTube server confirmation and a full browser-queue check.",
            "No automatic retries will be performed.","","Proceed with restoring the prior order?"
        ].join("\n")))return;
        if(currentUid()!==String(beforeCurrent)||!exactOrderMatches(fullQueueOrder(),before)||!allowed()||!window.socket||!window.socket.connected){
            alert("The queue, current video, connection, or permission changed during confirmation. No moves were sent.");return;
        }
        applying=true;
        var modal=document.getElementById(C.modal),undoButton=modal?modal.querySelector(".dbn-bs-undo"):null;
        var applyButton=modal?modal.querySelector(".dbn-bs-apply"):null,closeButton=modal?modal.querySelector(".dbn-bs-close"):null;
        if(undoButton)undoButton.disabled=true;if(applyButton)applyButton.disabled=true;if(closeButton)closeButton.disabled=true;
        status("Restoring the saved pre-shuffle order...");
        try{
            var result=await applyOrder(target,beforeCurrent,before,"Undo");
            status("Prior queue order restored • all server and full-queue checks passed.");
            window.prompt("DBN V110 UNDO SUCCEEDED — press Ctrl+A, then Ctrl+C to copy:",[
                "DBN V110 UNDO SUCCEEDED","Server-confirmed move requests: "+result.moveRequests,
                "Verified batches: "+result.batches+"/"+result.batches,"Upcoming queue entries: "+result.queueCount,
                "Final queue matches saved pre-shuffle order for all saved videos still present: true",
                "Newer live videos preserved at end: "+before.filter(function(uid){return savedOrder.indexOf(uid)===-1;}).length,
                "Currently playing UID before/after: "+beforeCurrent+" / "+String(currentUid()),
                "Saved pre-shuffle snapshot preserved: true","No automatic retries were performed."
            ].join("\n"));
        }catch(e){
            status("Undo stopped • inspect the live queue before any further action.");
            var d=e&&e.dbnDetails?e.dbnDetails:{};
            window.prompt("DBN V110 UNDO STOPPED — press Ctrl+A, then Ctrl+C to copy:",[
                "DBN V110 UNDO STOPPED","Failure: "+(e&&e.message?e.message:String(e)),
                "Failed/current batch: "+(d.failedBatch||"preflight"),"Server-confirmed moves: "+(d.serverConfirmedMoves||0),
                "Verified batches: "+(d.verifiedBatches||0)+"/"+(d.totalBatches||batchCount),
                "Upcoming queue entries now: "+(d.liveQueueCount||fullQueueOrder().length),
                "First 15 live UIDs now: "+((d.first15LiveUids||fullQueueOrder().slice(0,15)).join(", ")),
                "Current UID at stop: "+String(currentUid()),"Saved pre-shuffle snapshot preserved: true",
                "No automatic retries were performed. Inspect before retrying."
            ].join("\n"));
        }finally{
            applying=false;if(closeButton)closeButton.disabled=false;
            if(applyButton){applyButton.disabled=!plan;
                applyButton.textContent=plan?"APPLY REVIEWED SHUFFLE (SERVER-VERIFIED BATCH 10)":"CLOSE AND GENERATE A NEW PREVIEW";}
            updateUndoButton();
        }
    }

    async function runProtectedRecoveryPreviewV104() {
        if (diagnosticRunning) return;
        if (!allowed()) { alert("Administrator playlist permission is required."); return; }
        var sock = window.socket, saved = readUndo(), currentAtStart = currentUid();
        if (!sock || !sock.connected || typeof sock.emit !== "function" || typeof sock.on !== "function") { alert("CyTube's main socket is not connected."); return; }
        if (!saved || !Array.isArray(saved.order) || !saved.order.length) { alert("The saved pre-shuffle snapshot is unavailable. No changes were made."); return; }
        if (currentAtStart === null) { alert("CyTube has not identified the current video."); return; }
        diagnosticRunning = true;
        try {
            function removeListener(n,h) { if (typeof sock.off === "function") sock.off(n,h); else if (typeof sock.removeListener === "function") sock.removeListener(n,h); }
            var payload = null, attempts = 0, lastError = null;
            while (attempts < 3 && payload === null) {
                attempts++;
                if (window.socket !== sock || !sock.connected) throw new Error("CyTube disconnected before playlist request " + attempts + ".");
                try {
                    payload = await new Promise(function(resolve,reject) {
                        var done = false, timer = null;
                        function finish(err,data) { if(done)return; done=true; if(timer)window.clearTimeout(timer); removeListener("playlist",onPlaylist); if(err)reject(err); else resolve(data); }
                        function onPlaylist(data) { finish(null,data); }
                        sock.on("playlist",onPlaylist);
                        timer = window.setTimeout(function(){ finish(new Error("No playlist response during attempt " + attempts + " of 3 (15 seconds).")); },15000);
                        try { sock.emit("requestPlaylist"); } catch(e) { finish(e); }
                    });
                } catch(e) { lastError=e; if(attempts===3)throw e; await new Promise(function(resolve){window.setTimeout(resolve,500);}); }
            }
            if (payload === null) throw lastError || new Error("No server playlist response after three attempts.");
            var entries = Array.isArray(payload) ? payload : (payload && Array.isArray(payload.playlist) ? payload.playlist : (payload && Array.isArray(payload.queue) ? payload.queue : (payload && Array.isArray(payload.items) ? payload.items : null)));
            if (!entries) throw new Error("Server response did not contain a readable playlist array.");
            var server = entries.map(function(x){return x && x.uid != null ? String(x.uid) : null;}).filter(function(x){return x !== null;});
            var live = fullQueueOrder().map(String), target = saved.order.map(String), current = String(currentAtStart);
            var aq = window.PL_ACTION_QUEUE || null, idle = !aq || (!aq._lock && (!aq._q || aq._q.length === 0));
            if (currentUid() !== current) throw new Error("Current video changed during inspection.");
            if (!idle) throw new Error("Browser playlist action queue is busy.");
            if (!exactOrderMatches(server,live)) throw new Error("Server playlist and browser queue do not exactly match.");
            if (new Set(server).size !== server.length || new Set(target).size !== target.length) throw new Error("Duplicate UIDs detected.");
            if (server.length !== target.length) throw new Error("Live queue and saved snapshot have different entry counts.");
            var set = new Set(server);
            for (var i=0;i<target.length;i++) if (!set.has(target[i])) throw new Error("Saved UID " + target[i] + " is missing from the live queue.");
            var ti=target.indexOf(current), li=live.indexOf(current);
            if (ti<0 || li<0 || target.filter(function(x){return x===current;}).length!==1 || live.filter(function(x){return x===current;}).length!==1) throw new Error("Current UID is missing or duplicated.");
            // Playback may have advanced since the snapshot. A different current index is
            // expected and is repaired by moving other entries around the protected active UID.
            var activeMatches=0, activeClass=false, activeTitle="not found";
            if (window.jQuery) {
                window.jQuery("#queue > li.queue_entry").each(function(){
                    var $li=window.jQuery(this);
                    if (String($li.data("uid"))===current) {
                        activeMatches++;
                        activeClass=$li.hasClass("queue_active");
                        activeTitle=String(($li.data("media")||{}).title||$li.find(".qe_title").text()||"unknown");
                    }
                });
            }
            // PL_CURRENT and the unique UID in the live/server queue are the authoritative
            // identity checks. The queue_active CSS class is informational only: CyTube may
            // add/remove it asynchronously while playback and playlist DOM updates settle.
            if (live.filter(function(x){return x===current;}).length!==1 ||
                server.filter(function(x){return x===current;}).length!==1 ||
                currentUid()!==current) {
                throw new Error("The current UID is not uniquely present in both live and server queues, or playback changed. Protected recovery blocked.");
            }
            var simulated=live.slice(), moves=[];
            function putFirst(uid) {
                if (uid===current) throw new Error("Current video cannot be a move source.");
                var ix=simulated.indexOf(uid); if(ix<0)throw new Error("Missing prefix UID "+uid+".");
                if(ix===0)return;
                var n=Number(uid); if(!Number.isSafeInteger(n))throw new Error("Invalid numeric UID "+uid+".");
                moves.push({uid:uid,from:n,after:"prepend"}); simulated.splice(ix,1); simulated.unshift(uid);
            }
            function putAfter(uid,anchor) {
                if (uid===current) throw new Error("Current video cannot be a move source.");
                var ix=simulated.indexOf(uid), ai=simulated.indexOf(anchor);
                if(ix<0||ai<0)throw new Error("Missing suffix UID or anchor.");
                if(ix===ai+1)return;
                var n=Number(uid), a=Number(anchor); if(!Number.isSafeInteger(n)||!Number.isSafeInteger(a))throw new Error("Invalid numeric UID or anchor.");
                moves.push({uid:uid,from:n,after:a}); simulated.splice(ix,1); ai=simulated.indexOf(anchor); simulated.splice(ai+1,0,uid);
            }
            for (var p=ti-1;p>=0;p--) putFirst(target[p]);
            var anchor=current;
            for (var j=ti+1;j<target.length;j++) { putAfter(target[j],anchor); anchor=target[j]; }
            if (!exactOrderMatches(simulated,target)) throw new Error("Move simulation did not reproduce the saved order.");
            if (moves.some(function(m){return String(m.from)===current || m.uid===current;})) throw new Error("Current video was included as a move source.");
            if (currentUid()!==current || !exactOrderMatches(fullQueueOrder(),live)) throw new Error("Queue or current video changed during calculation.");
            var out=[
                "DBN V104 PROTECTED RECOVERY PREVIEW — READ ONLY",
                "Channel: "+channelName(),"Live server entries: "+server.length,"Saved snapshot entries: "+target.length,
                "Server and browser exactly match: true","Saved and live UID sets exactly match: true","Duplicate UIDs: 0",
                "Current playing UID: "+current,"Current title: "+activeTitle,
                "Current UID uniquely present in live/server queues: true",
                "Current queue_active CSS marker observed: "+activeClass,
                "Current queue_active DOM matches: "+activeMatches,
                "Current UID index in live queue before recovery: "+li,
                "Current UID index in saved target: "+ti,
                "Current index difference (saved minus live): "+(ti-li),
                "Current video is never a move source: true",
                "Current item is repositioned only by moving other entries around it: true",
                "Current index after simulated recovery: "+ti,
                "Planned move requests: "+moves.length,
                "Prefix moves to prepend: "+moves.filter(function(m){return m.after==="prepend";}).length,
                "Suffix moves anchored after current: "+moves.filter(function(m){return m.after!=="prepend";}).length,
                "Current UID used as a move source: false","Simulated final order exactly matches saved snapshot: true",
                "Playlist request attempts: "+attempts,"Browser action queue idle: true",
                "Read-only: true; moveMedia requests sent: 0","No queue changes were made."
            ];
            if(moves.length){out.push("First 10 moves: "+JSON.stringify(moves.slice(0,10).map(function(m){return {from:m.from,after:m.after};})));out.push("Last 5 moves: "+JSON.stringify(moves.slice(-5).map(function(m){return {from:m.from,after:m.after};})));}
            window.prompt("DBN V104 PROTECTED RECOVERY PREVIEW — press Ctrl+A, then Ctrl+C to copy:",out.join("\n"));
        } catch(e) {
            window.prompt("DBN V104 PROTECTED RECOVERY PREVIEW BLOCKED — press Ctrl+A, then Ctrl+C to copy:","DBN V104 PROTECTED RECOVERY PREVIEW BLOCKED\nReason: "+(e&&e.message?e.message:String(e))+"\nRead-only: true; moveMedia requests sent: 0\nNo queue changes were made.");
        } finally { diagnosticRunning=false; updateUndoButton(); }
    }


    async function runRecoveryStateDiagnosticV104() {
        if (diagnosticRunning) return;
        if (!allowed()) { alert("Administrator playlist permission is required to inspect the queue."); return; }
        var sock=window.socket;
        if (!sock || !sock.connected || typeof sock.emit!=="function" || typeof sock.on!=="function") {
            alert("CyTube's main socket is not connected. No diagnostic request was sent."); return;
        }
        diagnosticRunning=true;
        status("Read-only recovery state inspection • requesting server playlist...");
        function removeListener(name,handler) {
            if (typeof sock.off==="function") sock.off(name,handler);
            else if (typeof sock.removeListener==="function") sock.removeListener(name,handler);
        }
        try {
            var payload=null,lastError=null,attempts=0;
            while(attempts<3 && payload===null) {
                attempts++;
                if(window.socket!==sock || !sock.connected) throw new Error("CyTube disconnected during the diagnostic.");
                try {
                    payload=await new Promise(function(resolve,reject){
                        var done=false,timer=null;
                        function finish(err,data){
                            if(done)return;done=true;
                            if(timer)window.clearTimeout(timer);
                            removeListener("playlist",onPlaylist);
                            if(err)reject(err);else resolve(data);
                        }
                        function onPlaylist(data){finish(null,data);}
                        sock.on("playlist",onPlaylist);
                        timer=window.setTimeout(function(){finish(new Error("No server playlist response on attempt "+attempts+" of 3."));},15000);
                        try{sock.emit("requestPlaylist");}catch(e){finish(e);}
                    });
                } catch(e) {
                    lastError=e;
                    if(attempts===3)throw e;
                    await new Promise(function(resolve){window.setTimeout(resolve,400);});
                }
            }
            if(payload===null)throw lastError||new Error("No server playlist response after three attempts.");
            var entries=Array.isArray(payload)?payload:(payload&&Array.isArray(payload.playlist)?payload.playlist:(payload&&Array.isArray(payload.queue)?payload.queue:(payload&&Array.isArray(payload.items)?payload.items:null)));
            if(!entries)throw new Error("Server response did not contain a readable playlist array.");
            var server=entries.map(function(x){return x&&x.uid!=null?String(x.uid):null;}).filter(function(x){return x!==null;});
            var live=fullQueueOrder().map(String);
            var saved=readUndo(),savedOrder=saved&&Array.isArray(saved.order)?saved.order.map(String):[];
            var checkpointKey=C.undoPrefix+channelName()+":protected-recovery-v101-checkpoint";
            var checkpointRaw=getStore(checkpointKey),checkpoint=null,checkpointOrder=[];
            try{checkpoint=checkpointRaw?JSON.parse(checkpointRaw):null;if(checkpoint&&Array.isArray(checkpoint.order))checkpointOrder=checkpoint.order.map(String);}catch(e){}
            function orderDiff(a,b){
                var n=Math.min(a.length,b.length),first=-1,count=0;
                for(var i=0;i<n;i++)if(a[i]!==b[i]){if(first<0)first=i;count++;}
                if(a.length!==b.length){if(first<0)first=n;count+=Math.abs(a.length-b.length);}
                return {first:first,count:count};
            }
            function missingFrom(a,b){var set=new Set(b);return a.filter(function(x){return !set.has(x);});}
            function duplicates(a){return a.length-new Set(a).size;}
            var sb=orderDiff(server,live),ls=orderDiff(live,savedOrder),lc=orderDiff(live,checkpointOrder);
            var current=currentUid(),title="not found",activeCount=0,activeClass=false;
            if(window.jQuery&&current!==null){
                window.jQuery("#queue > li.queue_entry").each(function(){
                    var $li=window.jQuery(this);
                    if(String($li.data("uid"))===String(current)){
                        activeCount++;activeClass=$li.hasClass("queue_active");
                        title=String(($li.data("media")||{}).title||$li.find(".qe_title").text()||"unknown");
                    }
                });
            }
            var q=window.PL_ACTION_QUEUE||null,idle=!q||(!q._lock&&(!q._q||q._q.length===0));
            var out=[
                "DBN V104 READ-ONLY RECOVERY STATE DIAGNOSTIC",
                "Channel: "+channelName(),
                "Live server entries: "+server.length,
                "Browser queue entries: "+live.length,
                "Server and browser exactly match: "+(sb.count===0),
                "Server/browser first mismatch index: "+sb.first,
                "Server/browser total positions that differ: "+sb.count,
                "Saved original snapshot entries: "+savedOrder.length,
                "Saved original snapshot exists: "+!!(saved&&savedOrder.length),
                "Live vs original snapshot first mismatch index: "+ls.first,
                "Live vs original snapshot total positions that differ: "+ls.count,
                "Live UIDs missing from original snapshot: "+missingFrom(live,savedOrder).length,
                "Original snapshot UIDs missing from live: "+missingFrom(savedOrder,live).length,
                "Original snapshot duplicate UIDs: "+duplicates(savedOrder),
                "V101 pre-recovery checkpoint exists: "+!!(checkpoint&&checkpointOrder.length),
                "V101 checkpoint entries: "+checkpointOrder.length,
                "Live vs V101 checkpoint first mismatch index: "+lc.first,
                "Live vs V101 checkpoint total positions that differ: "+lc.count,
                "Current playing UID: "+String(current),
                "Current title: "+title,
                "Current UID positions server/browser/snapshot/checkpoint: "+[
                    server.indexOf(String(current)),live.indexOf(String(current)),savedOrder.indexOf(String(current)),checkpointOrder.indexOf(String(current))
                ].join(" / "),
                "Current UID occurrences in browser queue: "+live.filter(function(x){return x===String(current);}).length,
                "Current queue_active DOM matches: "+activeCount,
                "Current queue_active CSS marker observed: "+activeClass,
                "Server duplicate UIDs: "+duplicates(server),
                "Browser duplicate UIDs: "+duplicates(live),
                "Browser playlist action queue idle: "+idle,
                "Playlist response attempts: "+attempts,
                "Read-only: true; moveMedia requests sent: 0",
                "No queue changes were made."
            ];
            out.push("Server first 12 UIDs: "+server.slice(0,12).join(", "));
            out.push("Browser first 12 UIDs: "+live.slice(0,12).join(", "));
            out.push("Snapshot first 12 UIDs: "+savedOrder.slice(0,12).join(", "));
            if(checkpointOrder.length)out.push("Checkpoint first 12 UIDs: "+checkpointOrder.slice(0,12).join(", "));
            window.prompt("DBN V104 READ-ONLY RECOVERY STATE DIAGNOSTIC — press Ctrl+A, then Ctrl+C to copy:",out.join("\n"));
        } catch(e) {
            window.prompt("DBN V104 DIAGNOSTIC BLOCKED — press Ctrl+A, then Ctrl+C to copy:",
                "DBN V104 DIAGNOSTIC BLOCKED\nReason: "+(e&&e.message?e.message:String(e))+"\nRead-only: true; moveMedia requests sent: 0\nNo queue changes were made.");
        } finally {
            diagnosticRunning=false;
            updateUndoButton();
        }
    }

    function addButton() {
        if (!allowed()) return false;
        var motd = document.getElementById("motd");
        if (!motd) return false;
        addStyles();
        var button = document.getElementById(C.button);
        if (!button) {
            button = document.createElement("button");
            button.type = "button"; button.id = C.button;
            button.textContent = "DBN TV SHUFFLE";
            button.title = "Open the private DBN Intelligent Broadcast Shuffle";
            button.style.display = "block";
            button.style.margin = "14px auto 4px";
            button.addEventListener("click", openPreview);
            motd.appendChild(button);
        }
        var preview = document.getElementById("dbn-protected-recovery-preview-v104");
        if (!preview) {
            preview = document.createElement("button");
            preview.type = "button";
            preview.id = "dbn-protected-recovery-preview-v104";
            preview.textContent = "DBN PROTECTED RECOVERY PREVIEW V104";
            preview.title = "Read-only recovery calculation; current video is protected";
            preview.style.cssText = "display:block;margin:6px auto 4px;border:1px solid #ff3838;border-radius:5px;padding:6px 11px;color:#fff;background:#190707;box-shadow:0 0 8px rgba(255,0,0,.55);font-weight:900;cursor:pointer";
            preview.addEventListener("click", runProtectedRecoveryPreviewV104);
            if (button.nextSibling) motd.insertBefore(preview,button.nextSibling); else motd.appendChild(preview);
        }
        var diagnostic=document.getElementById("dbn-recovery-state-diagnostic-v104");
        if(!diagnostic){
            diagnostic=document.createElement("button");
            diagnostic.type="button";
            diagnostic.id="dbn-recovery-state-diagnostic-v104";
            diagnostic.textContent="DBN RECOVERY STATE DIAGNOSTIC V104";
            diagnostic.title="Read-only inspection of the live queue and saved recovery snapshots";
            diagnostic.style.cssText="display:block;margin:6px auto 4px;border:1px solid #ff3838;border-radius:5px;padding:7px 12px;color:#fff;background:#190707;box-shadow:0 0 9px rgba(255,0,0,.65);font-weight:900;cursor:pointer";
            diagnostic.addEventListener("click",runRecoveryStateDiagnosticV104);
            if(preview.nextSibling)motd.insertBefore(diagnostic,preview.nextSibling);else motd.appendChild(diagnostic);
        }
        return true;
    }
    function initialize() {
        var attempts = 0;
        var retry = setInterval(function () {
            attempts++;
            if (addButton() || attempts >= 120) clearInterval(retry);
        }, 500);
        addButton();
        if (window.MutationObserver && document.body) {
            var observer = new MutationObserver(function () {
                if (allowed() && !document.getElementById(C.button)) addButton();
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
        readUndo();
        console.log("[DBN Advanced Broadcast Shuffle V117] Full server-verified shuffle initialized; current video protected; 10-move batches with full queue verification.");
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize, { once: true });
    } else {
        initialize();
    }
})();