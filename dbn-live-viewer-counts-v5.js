
/* ==========================================================
   DBN LIVE CHANNEL VIEWER COUNTS
   Doodoo Buttchump Network
   Version 5.0 - Full Banner Blood Red Neon Edition

   FEATURES:
   - New independent V5 script
   - Overlay covers 94% of each banner
   - Large black translucent hover panel
   - Bright white channel name
   - Blood-red neon border and glow
   - Animated LIVE NOW indicator
   - Large viewer count
   - Strict text and overlay clipping
   - Forces white/red text against CyTube styles
   - Responsive desktop and mobile sizing
   - CyTube socket connections
   - Detects newly added banners
   ========================================================== */

(function () {
    "use strict";

    if (window.DBNLiveViewerCountsV5Loaded) return;
    window.DBNLiveViewerCountsV5Loaded = true;

    const CONFIG = {
        container: ".motd-banners",
        connectionTimeout: 12000
    };

    const serverCache = new Map();

    /* ======================================================
       1. STYLING
    ====================================================== */

    function addStyles() {
        if (document.getElementById("dbn-viewer-styles-v5")) return;

        const style = document.createElement("style");
        style.id = "dbn-viewer-styles-v5";

        style.textContent = `

.motd-banners a.dbn-viewer-banner {
    position: relative !important;
    display: inline-block !important;
    vertical-align: top !important;
    overflow: hidden !important;
    isolation: isolate !important;
    line-height: 0 !important;
    text-decoration: none !important;
}

.motd-banners a.dbn-viewer-banner img {
    display: block !important;
    max-width: 100% !important;
    height: auto !important;
}

.motd-banners a.dbn-viewer-banner .dbn-viewer-overlay {
    position: absolute !important;

    top: 3% !important;
    left: 3% !important;
    right: 3% !important;
    bottom: 3% !important;

    width: 94% !important;
    height: 94% !important;

    box-sizing: border-box !important;
    min-width: 0 !important;
    max-width: 94% !important;

    z-index: 999 !important;

    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;

    gap: 5px !important;
    padding: 5px 8px !important;

    overflow: hidden !important;

    background: rgba(0, 0, 0, 0.94) !important;

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

.motd-banners a.dbn-viewer-banner:hover .dbn-viewer-overlay,
.motd-banners a.dbn-viewer-banner:focus-visible .dbn-viewer-overlay,
.motd-banners a.dbn-viewer-banner:focus-within .dbn-viewer-overlay {
    opacity: 1 !important;
    visibility: visible !important;
    transform: scale(1) !important;
}

/* FORCE ALL OVERLAY TEXT COLORS */

.motd-banners a.dbn-viewer-banner .dbn-viewer-overlay,
.motd-banners a.dbn-viewer-banner .dbn-viewer-overlay * {
    font-family: Arial, sans-serif !important;
    -webkit-text-fill-color: currentColor !important;
}

/* CHANNEL NAME */

.motd-banners a.dbn-viewer-banner .dbn-viewer-name {
    display: block !important;

    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;

    box-sizing: border-box !important;

    color: #ffffff !important;
    -webkit-text-fill-color: #ffffff !important;

    font-size: clamp(12px, 3.1vw, 21px) !important;
    font-weight: 900 !important;

    letter-spacing: 1px !important;
    line-height: 1.15 !important;

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

/* LIVE NOW */

.motd-banners a.dbn-viewer-banner .dbn-viewer-live {
    display: none;

    align-items: center !important;
    justify-content: center !important;

    gap: 7px !important;

    max-width: 100% !important;
    min-width: 0 !important;

    color: #ff2525 !important;
    -webkit-text-fill-color: #ff2525 !important;

    font-size: clamp(10px, 1.8vw, 13px) !important;
    font-weight: 900 !important;

    letter-spacing: 2px !important;
    line-height: 1.2 !important;

    text-transform: uppercase !important;

    text-shadow:
        0 0 5px #ff0000,
        0 0 12px #ff0000 !important;
}

.motd-banners a.dbn-viewer-banner .dbn-viewer-live-dot {
    display: inline-block !important;

    width: 9px !important;
    height: 9px !important;
    min-width: 9px !important;
    min-height: 9px !important;

    flex-shrink: 0 !important;

    border-radius: 50% !important;

    background: #ff1010 !important;

    box-shadow:
        0 0 5px #ff0000,
        0 0 12px #ff0000 !important;

    animation: dbn-live-pulse-v5 1.1s infinite !important;
}

@keyframes dbn-live-pulse-v5 {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.5;
        transform: scale(0.8);
    }
}

/* VIEWER COUNT */

.motd-banners a.dbn-viewer-banner .dbn-viewer-count {
    display: flex !important;

    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;

    gap: 2px !important;

    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;

    color: #ffffff !important;
    -webkit-text-fill-color: #ffffff !important;

    text-align: center !important;
    line-height: 1 !important;
}

.motd-banners a.dbn-viewer-banner .dbn-viewer-number {
    display: block !important;

    max-width: 100% !important;

    color: #ffffff !important;
    -webkit-text-fill-color: #ffffff !important;

    font-size: clamp(27px, 5vw, 43px) !important;
    font-weight: 900 !important;

    line-height: 1.05 !important;

    text-shadow:
        0 0 5px #ffffff,
        0 0 12px #ff0000,
        0 0 22px #ff0000 !important;
}

.motd-banners a.dbn-viewer-banner .dbn-viewer-label {
    display: block !important;

    max-width: 100% !important;

    color: #ff3030 !important;
    -webkit-text-fill-color: #ff3030 !important;

    font-size: clamp(10px, 1.8vw, 13px) !important;
    font-weight: 900 !important;

    letter-spacing: 2px !important;
    line-height: 1.3 !important;

    text-transform: uppercase !important;

    text-shadow:
        0 0 5px #ff0000,
        0 0 10px #ff0000 !important;
}

/* STATUS MESSAGE */

.motd-banners a.dbn-viewer-banner .dbn-viewer-status {
    max-width: 100% !important;
    min-width: 0 !important;

    color: #ffffff !important;
    -webkit-text-fill-color: #ffffff !important;

    font-size: clamp(8px, 1.4vw, 11px) !important;
    font-weight: bold !important;

    letter-spacing: 1px !important;
    line-height: 1.2 !important;

    text-align: center !important;
    text-transform: uppercase !important;

    overflow-wrap: anywhere !important;

    text-shadow:
        0 0 5px rgba(255,255,255,0.7) !important;
}

/* MOBILE */

@media (max-width: 600px) {

    .motd-banners a.dbn-viewer-banner .dbn-viewer-overlay {
        gap: 3px !important;
        padding: 3px 5px !important;
        border-width: 1.5px !important;
    }

    .motd-banners a.dbn-viewer-banner .dbn-viewer-name {
        font-size: clamp(10px, 3vw, 16px) !important;
        letter-spacing: 0.5px !important;
    }

    .motd-banners a.dbn-viewer-banner .dbn-viewer-live {
        font-size: 9px !important;
        letter-spacing: 1px !important;
    }

    .motd-banners a.dbn-viewer-banner .dbn-viewer-live-dot {
        width: 7px !important;
        height: 7px !important;
        min-width: 7px !important;
        min-height: 7px !important;
    }

    .motd-banners a.dbn-viewer-banner .dbn-viewer-number {
        font-size: clamp(20px, 5vw, 30px) !important;
    }

    .motd-banners a.dbn-viewer-banner .dbn-viewer-label {
        font-size: 9px !important;
    }

    .motd-banners a.dbn-viewer-banner .dbn-viewer-status {
        font-size: 7px !important;
    }
}

@media (prefers-reduced-motion: reduce) {

    .motd-banners a.dbn-viewer-banner .dbn-viewer-overlay {
        transition: none !important;
    }

    .motd-banners a.dbn-viewer-banner .dbn-viewer-live-dot {
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
        if (link.dataset.dbnViewerReadyV5) return;

        link.dataset.dbnViewerReadyV5 = "true";
        link.classList.add("dbn-viewer-banner");

        const overlay = document.createElement("div");
        overlay.className = "dbn-viewer-overlay";

        const name = document.createElement("div");
        name.className = "dbn-viewer-name";
        name.textContent = channel.replace(/-/g, " ");

        const live = document.createElement("div");
        live.className = "dbn-viewer-live";

        const liveDot = document.createElement("span");
        liveDot.className = "dbn-viewer-live-dot";

        const liveText = document.createElement("span");
        liveText.textContent = "LIVE NOW";

        live.append(liveDot, liveText);

        const count = document.createElement("div");
        count.className = "dbn-viewer-count";

        const countNumber = document.createElement("span");
        countNumber.className = "dbn-viewer-number";
        countNumber.textContent = "--";

        const countLabel = document.createElement("span");
        countLabel.className = "dbn-viewer-label";
        countLabel.textContent = "VIEWERS";

        count.append(countNumber, countLabel);

        const status = document.createElement("div");
        status.className = "dbn-viewer-status";
        status.textContent = "Hover for viewer count";

        overlay.append(name, live, count, status);
        link.appendChild(overlay);

        const state = {
            active: false,
            socket: null,
            timer: null,
            generation: 0
        };

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
           4. GET SOCKET SERVER
        ================================================== */

        async function getSocketServer() {
            const cached = serverCache.get(channel);

            if (cached && Date.now() - cached.time < 300000) {
                return cached.url;
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

            const server = data.servers.find(function (item) {
                return item.secure === true;
            });

            if (!server || !server.url) {
                throw new Error("No secure sync server found");
            }

            serverCache.set(channel, {
                url: server.url,
                time: Date.now()
            });

            return server.url;
        }

        /* ==================================================
           5. CONNECT AND RETRIEVE VIEWER COUNT
        ================================================== */

        async function connect() {
            if (state.active) return;

            state.active = true;

            const generation = ++state.generation;

            showStatus("Connecting...");

            if (typeof window.io !== "function") {
                state.active = false;
                showStatus("Socket client unavailable");
                return;
            }

            try {
                const serverURL = await getSocketServer();

                if (
                    !state.active ||
                    generation !== state.generation
                ) return;

                const socket = window.io(serverURL, {
                    transports: ["websocket"],
                    reconnection: false,
                    timeout: CONFIG.connectionTimeout
                });

                state.socket = socket;

                let receivedCount = false;

                function validSession() {
                    return (
                        state.active &&
                        generation === state.generation
                    );
                }

                function updateCount(value) {
                    if (!validSession()) return;

                    let number = null;

                    if (typeof value === "number") {
                        number = value;
                    } else if (
                        value &&
                        typeof value.count === "number"
                    ) {
                        number = value.count;
                    }

                    if (
                        number === null ||
                        !Number.isFinite(number) ||
                        number < 0
                    ) return;

                    receivedCount = true;

                    clearTimeout(state.timer);

                    showCount(number);
                }

                socket.on("connect", function () {
                    if (!validSession()) return;

                    showStatus("Joining channel...");

                    socket.emit("joinChannel", {
                        name: channel
                    });
                });

                socket.on("setPermissions", function () {
                    if (!validSession()) return;

                    showStatus("Connected - retrieving count...");
                });

                socket.on("usercount", updateCount);

                socket.on("userlist", function (users) {
                    if (!validSession()) return;

                    if (Array.isArray(users)) {
                        updateCount(users.length);
                    }
                });

                socket.on("connect_error", function () {
                    if (validSession() && !receivedCount) {
                        showStatus("Connection unavailable");
                    }
                });

                socket.on("disconnect", function () {
                    if (validSession() && !receivedCount) {
                        showStatus("Disconnected");
                    }
                });

                state.timer = setTimeout(function () {
                    if (validSession() && !receivedCount) {
                        showStatus("Count unavailable");
                    }
                }, CONFIG.connectionTimeout);

            } catch (error) {
                if (state.active && generation === state.generation) {
                    showStatus("Unable to retrieve count");
                }
            }
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
            "[DBN V5] Live channel viewer counts initialized."
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
