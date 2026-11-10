/* ==========================================================
   DBN LIVE CHANNEL VIEWER COUNTS
   Doodoo Buttchump Network
   Version 21.0 - Authoritative Server Viewer Count - Overlay Information Order - Now Playing Titles - Exclude Monitor Connection - Visible Connection Diagnostics - Connection Diagnostics - Isolated WebSocket Connections

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
    grid-template-rows:
        minmax(0, 0.9fr)
        auto
        minmax(0, 1.15fr)
        minmax(0, 0.9fr)
        auto !important;
    align-items: center !important;
    justify-items: center !important;
    gap: 3px !important;
    padding: 5px 8px !important;
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
    font-size: clamp(10px, 1.5vw, 17px) !important;
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
    font-size: clamp(9px, 1.1vw, 12px) !important;
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
    font-size: clamp(18px, 2.4vw, 30px) !important;
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
    font-size: clamp(8px, 1vw, 11px) !important;
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
    font-size: clamp(7px, 0.85vw, 9px) !important;
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
    font-size: clamp(7px, 0.95vw, 10px) !important;
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

.motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-status-v6 {
    display: block !important;
    margin-top: 5px !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    color: #ffffff !important;
    -webkit-text-fill-color: #ffffff !important;
    font-size: clamp(7px, 0.85vw, 9px) !important;
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
        gap: 2px !important;
        padding: 3px 5px !important;
        border-width: 1.5px !important;
    }

    .motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-name-v6 {
        font-size: clamp(9px, 2.5vw, 14px) !important;
        letter-spacing: 0.3px !important;
    }

    .motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-live-v6 {
        font-size: 8px !important;
        letter-spacing: 1px !important;
    }

    .motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-live-dot-v6 {
        width: 6px !important;
        height: 6px !important;
        min-width: 6px !important;
        min-height: 6px !important;
    }

    .motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-number-v6 {
        font-size: clamp(16px, 4vw, 25px) !important;
    }

    .motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-label-v6 {
        font-size: 8px !important;
    }

    .motd-banners a.dbn-viewer-banner-v6 .dbn-viewer-status-v6 {
        font-size: 7px !important;
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
        nowPlayingTitle.textContent = "Waiting for room info...";

        nowPlaying.append(nowPlayingLabel, nowPlayingTitle);

        const status = document.createElement("div");
        status.className = "dbn-viewer-status-v6";
        status.textContent = "Hover for viewer count";

        overlay.append(name, live, count, status, nowPlaying);
        link.appendChild(overlay);

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

            nowPlayingTitle.textContent = title || "Nothing playing";
            nowPlayingTitle.title = title || "Nothing playing";
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
   Four independent category carousels.
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
    box-shadow: inset 0 0 18px rgba(255,0,0,.20), 0 0 10px rgba(255,0,0,.75), 0 0 24px rgba(255,0,0,.35) !important;
}
.dbn-carousel-viewport { width:100% !important; overflow:hidden !important; position:relative !important; }
.dbn-carousel-track { display:flex !important; flex-wrap:nowrap !important; align-items:stretch !important; width:max-content !important; will-change:transform; }
.dbn-carousel-set { display:flex !important; flex:0 0 auto !important; flex-wrap:nowrap !important; align-items:stretch !important; gap:${CONFIG.gap}px !important; width:max-content !important; margin:0 !important; padding:0 !important; }
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
  .dbn-carousel-set { gap:12px !important; }
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
        shell.addEventListener("mouseenter", function () { state.paused = true; });
        shell.addEventListener("mouseleave", function () { state.paused = false; });
        shell.addEventListener("focusin", function () { state.paused = true; });
        shell.addEventListener("focusout", function () { state.paused = false; });
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
        if (!reducedMotion && !document.hidden) {
            activeCarousels.forEach(function (state) {
                if (state.paused || !state.setWidth) return;
                state.offset += CONFIG.speed * delta;
                if (state.offset >= state.setWidth) state.offset -= state.setWidth;
                state.track.style.transform = "translate3d(" + (-state.offset) + "px,0,0)";
            });
        }
        rafId = window.requestAnimationFrame(frame);
    }

    function initialize() {
        addCarouselStyles();
        document.querySelectorAll(CONFIG.selector).forEach(makeCarousel);
        if (rafId === null) rafId = window.requestAnimationFrame(frame);
        console.log("[DBN Carousel] Four-category banner carousel initializer ready.");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize, { once: true });
    } else {
        initialize();
    }
})();