
/* ==========================================================
   DBN LIVE CHANNEL VIEWER COUNTS
   Doodoo Buttchump Network
   Version 1.2 - Enhanced Neon Hover Edition

   FEATURES:
   - Detects CyTube channel banners in .motd-banners
   - Full-banner black and blood-red hover overlay
   - Glowing channel name and viewer count
   - Pulsing LIVE NOW indicator
   - Smooth fade-in and zoom animation
   - Watches for newly added banners
   - Connects to the channel's CyTube sync server
   ========================================================== */

(function () {
    "use strict";

if (window.DBNLiveViewerCountsV2Loaded) return;
window.DBNLiveViewerCountsV2Loaded = true;

    const CONFIG = {
        container: ".motd-banners",
        connectionTimeout: 12000
    };

    const serverCache = new Map();

    /* ======================================================
       1. DBN CSS STYLING
    ====================================================== */

    function addStyles() {
        if (document.getElementById("dbn-viewer-styles")) return;

        const style = document.createElement("style");
        style.id = "dbn-viewer-styles";

        style.textContent = `

            /* Banner container */

            .dbn-viewer-banner {
                position: relative !important;
                overflow: hidden !important;
                isolation: isolate;
            }

            /* Full-banner hover overlay */

            .dbn-viewer-overlay {
                position: absolute !important;
                inset: 0 !important;
                z-index: 20 !important;

                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                gap: 8px;
                padding: 8px;
                box-sizing: border-box;

                background:
                    linear-gradient(
                        135deg,
                        rgba(0, 0, 0, 0.97),
                        rgba(20, 0, 0, 0.96),
                        rgba(0, 0, 0, 0.97)
                    );

                border: 3px solid #ff1010;

                box-shadow:
                    inset 0 0 18px rgba(255, 0, 0, 0.45),
                    inset 0 0 35px rgba(255, 0, 0, 0.16),
                    0 0 10px rgba(255, 0, 0, 0.95),
                    0 0 22px rgba(255, 0, 0, 0.75),
                    0 0 38px rgba(255, 0, 0, 0.35);

                opacity: 0;
                visibility: hidden;

                transform: scale(1.045);

                transition:
                    opacity 0.28s ease,
                    visibility 0.28s ease,
                    transform 0.28s ease;

                pointer-events: none;
                text-align: center;
            }

            /* Show overlay when hovering or keyboard focusing */

            .dbn-viewer-banner:hover .dbn-viewer-overlay,
            .dbn-viewer-banner:focus-visible .dbn-viewer-overlay,
            .dbn-viewer-banner:focus-within .dbn-viewer-overlay {

                opacity: 1;
                visibility: visible;
                transform: scale(1);
            }

            /* Channel name */

            .dbn-viewer-name {
                color: #ffffff;

                font-family: Arial, sans-serif;
                font-size: clamp(11px, 1.3vw, 18px);
                font-weight: 900;

                letter-spacing: 1.5px;
                line-height: 1.25;

                text-transform: uppercase;
                overflow-wrap: anywhere;

                text-shadow:
                    0 0 4px #ffffff,
                    0 0 8px #ff0000,
                    0 0 16px #ff0000,
                    0 0 25px rgba(255, 0, 0, 0.9);
            }

            /* LIVE NOW indicator */

            .dbn-viewer-live {
                display: none;
                align-items: center;
                justify-content: center;
                gap: 6px;

                color: #ff3030;

                font-family: Arial, sans-serif;
                font-size: 10px;
                font-weight: 900;

                letter-spacing: 2px;
                text-transform: uppercase;

                text-shadow:
                    0 0 5px #ff0000,
                    0 0 12px #ff0000;
            }

            /* Pulsing red live dot */

            .dbn-viewer-live-dot {
                width: 8px;
                height: 8px;
                min-width: 8px;

                display: inline-block;
                border-radius: 50%;

                background: #ff1010;

                box-shadow:
                    0 0 5px #ff0000,
                    0 0 12px #ff0000,
                    0 0 20px #ff0000;

                animation: dbn-live-pulse 1.1s infinite;
            }

            @keyframes dbn-live-pulse {
                0% {
                    opacity: 1;
                    transform: scale(1);
                    box-shadow: 0 0 5px #ff0000, 0 0 12px #ff0000;
                }

                50% {
                    opacity: 0.55;
                    transform: scale(0.78);
                    box-shadow: 0 0 2px #ff0000, 0 0 6px #ff0000;
                }

                100% {
                    opacity: 1;
                    transform: scale(1);
                    box-shadow: 0 0 5px #ff0000, 0 0 12px #ff0000;
                }
            }

            /* Viewer count */

            .dbn-viewer-count {
                color: #ff2525;

                font-family: Arial, sans-serif;
                font-size: clamp(17px, 2.2vw, 30px);
                font-weight: 900;

                line-height: 1.1;
                letter-spacing: 1px;

                text-shadow:
                    0 0 5px #ff0000,
                    0 0 10px #ff0000,
                    0 0 20px #ff0000,
                    0 0 32px rgba(255, 0, 0, 0.9);
            }

            /* Connection and viewer status */

            .dbn-viewer-status {
                color: #eeeeee;

                font-family: Arial, sans-serif;
                font-size: 9px;
                font-weight: bold;

                letter-spacing: 1.5px;
                text-transform: uppercase;

                text-shadow:
                    0 0 5px rgba(255, 255, 255, 0.6);
            }

            /* Smaller banner support */

            @media (max-width: 600px) {

                .dbn-viewer-overlay {
                    gap: 5px;
                    padding: 4px;
                    border-width: 2px;
                }

                .dbn-viewer-name {
                    font-size: clamp(9px, 2.5vw, 14px);
                    letter-spacing: 0.8px;
                }

                .dbn-viewer-live {
                    font-size: 8px;
                    letter-spacing: 1px;
                }

                .dbn-viewer-live-dot {
                    width: 6px;
                    height: 6px;
                    min-width: 6px;
                }

                .dbn-viewer-count {
                    font-size: clamp(14px, 4vw, 22px);
                }

                .dbn-viewer-status {
                    font-size: 7px;
                    letter-spacing: 0.5px;
                }
            }

            /* Respect reduced-motion preferences */

            @media (prefers-reduced-motion: reduce) {
                .dbn-viewer-overlay {
                    transition: none;
                }

                .dbn-viewer-live-dot {
                    animation: none;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /* ======================================================
       2. IDENTIFY CYTUBE CHANNEL FROM BANNER LINK
    ====================================================== */

    function getChannelName(link) {
        try {
            const url = new URL(link.href, location.href);

            if (
                url.hostname !== "cytu.be" &&
                url.hostname !== "www.cytu.be"
            ) {
                return null;
            }

            const match = url.pathname.match(/^\/r\/([^/]+)/i);

            return match ? decodeURIComponent(match[1]) : null;

        } catch (error) {
            return null;
        }
    }

    /* ======================================================
       3. CREATE HOVER OVERLAY
    ====================================================== */

    function createOverlay(link, channel) {
        if (link.dataset.dbnViewerReady) return;

        link.dataset.dbnViewerReady = "true";
        link.classList.add("dbn-viewer-banner");

        const overlay = document.createElement("div");
        overlay.className = "dbn-viewer-overlay";

        /* Channel name */

        const name = document.createElement("div");
        name.className = "dbn-viewer-name";
        name.textContent = channel.replace(/-/g, " ");

        /* LIVE NOW indicator */

        const live = document.createElement("div");
        live.className = "dbn-viewer-live";

        const liveDot = document.createElement("span");
        liveDot.className = "dbn-viewer-live-dot";

        const liveText = document.createElement("span");
        liveText.textContent = "LIVE NOW";

        live.append(liveDot, liveText);

        /* Viewer count */

        const count = document.createElement("div");
        count.className = "dbn-viewer-count";
        count.textContent = "--";

        /* Status */

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

            count.textContent =
                number + (number === 1 ? " VIEWER" : " VIEWERS");

            live.style.display = "flex";
            status.textContent = "Currently in chat";
        }

        function showStatus(message) {
            count.textContent = "--";
            live.style.display = "none";
            status.textContent = message;
        }

        /* ==================================================
           4. GET CYTUBE SOCKET SERVER
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
           6. DISCONNECT WHEN VISITOR LEAVES BANNER
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
       7. SCAN BANNER SECTIONS
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

        /* Watch for banners added after initial page load */

        const observer = new MutationObserver(function () {
            scanBanners();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log(
            "[DBN] Live channel viewer counts initialized."
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
