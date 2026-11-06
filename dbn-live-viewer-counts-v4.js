
/* ==========================================================
   DBN LIVE CHANNEL VIEWER COUNTS
   Doodoo Buttchump Network
   Version 4.0 - Fresh Red Neon Edition

   FEATURES:
   - Full-banner black and blood-red hover overlay
   - White channel name with red neon glow
   - Animated red LIVE NOW indicator
   - Separate viewer number and VIEWERS label
   - Responsive sizing
   - Smooth hover animation
   - CyTube viewer-count connections
   - Detects newly added banners
   ========================================================== */

(function () {
    "use strict";

    if (window.DBNLiveViewerCountsV4Loaded) return;
    window.DBNLiveViewerCountsV4Loaded = true;

    const CONFIG = {
        container: ".motd-banners",
        connectionTimeout: 12000
    };

    const serverCache = new Map();

    /* ======================================================
       1. CSS STYLING
    ====================================================== */

    function addStyles() {
        if (document.getElementById("dbn-viewer-styles-v4")) return;

        const style = document.createElement("style");
        style.id = "dbn-viewer-styles-v4";

        style.textContent = `

.dbn-viewer-banner {
    position: relative !important;
    overflow: hidden !important;
    isolation: isolate !important;
}

.dbn-viewer-overlay {
    position: absolute !important;
    inset: 0 !important;
    z-index: 999 !important;

    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;

    gap: 6px !important;
    padding: 8px !important;
    box-sizing: border-box !important;

    background: rgba(0, 0, 0, 0.91) !important;

    border: 2px solid #ff1717 !important;
    border-radius: 5px !important;

    box-shadow:
        inset 0 0 15px rgba(255, 0, 0, 0.25),
        0 0 8px rgba(255, 0, 0, 0.9),
        0 0 18px rgba(255, 0, 0, 0.5) !important;

    opacity: 0 !important;
    visibility: hidden !important;

    transform: scale(0.97);

    transition:
        opacity 0.25s ease,
        visibility 0.25s ease,
        transform 0.25s ease !important;

    pointer-events: none !important;
    text-align: center !important;
}

.dbn-viewer-banner:hover .dbn-viewer-overlay,
.dbn-viewer-banner:focus-visible .dbn-viewer-overlay,
.dbn-viewer-banner:focus-within .dbn-viewer-overlay {
    opacity: 1 !important;
    visibility: visible !important;
    transform: scale(1) !important;
}

.dbn-viewer-name {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;

    color: #ffffff !important;

    font-family: Arial, sans-serif !important;
    font-size: clamp(11px, 3vw, 17px) !important;
    font-weight: 900 !important;

    letter-spacing: 1px !important;
    line-height: 1.2 !important;

    text-align: center !important;
    text-transform: uppercase !important;

    overflow-wrap: anywhere !important;
    word-break: normal !important;

    text-shadow:
        0 0 4px #ffffff,
        0 0 8px #ff0000,
        0 0 15px #ff0000 !important;
}

.dbn-viewer-live {
    display: none;
    align-items: center !important;
    justify-content: center !important;
    gap: 6px !important;

    color: #ff2525 !important;

    font-family: Arial, sans-serif !important;
    font-size: 10px !important;
    font-weight: 900 !important;

    letter-spacing: 2px !important;
    line-height: 1.2 !important;
    text-transform: uppercase !important;

    text-shadow:
        0 0 5px #ff0000,
        0 0 12px #ff0000 !important;
}

.dbn-viewer-live-dot {
    display: inline-block !important;

    width: 7px !important;
    height: 7px !important;
    min-width: 7px !important;

    border-radius: 50% !important;
    background: #ff1010 !important;

    box-shadow:
        0 0 5px #ff0000,
        0 0 12px #ff0000 !important;

    animation: dbn-live-pulse-v4 1.1s infinite !important;
}

@keyframes dbn-live-pulse-v4 {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.5;
        transform: scale(0.8);
    }
}

.dbn-viewer-count {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;

    gap: 0 !important;
    width: 100% !important;

    color: #ffffff !important;

    font-family: Arial, sans-serif !important;
    text-align: center !important;
    line-height: 1 !important;

    text-shadow: none !important;
}

.dbn-viewer-number {
    display: block !important;

    color: #ffffff !important;

    font-family: Arial, sans-serif !important;
    font-size: clamp(23px, 4vw, 34px) !important;
    font-weight: 900 !important;

    line-height: 1.05 !important;

    text-shadow:
        0 0 5px #ffffff,
        0 0 12px #ff0000,
        0 0 22px #ff0000 !important;
}

.dbn-viewer-label {
    display: block !important;

    color: #ff3030 !important;

    font-family: Arial, sans-serif !important;
    font-size: 10px !important;
    font-weight: 900 !important;

    letter-spacing: 2px !important;
    line-height: 1.4 !important;

    text-transform: uppercase !important;

    text-shadow:
        0 0 5px #ff0000,
        0 0 10px #ff0000 !important;
}

.dbn-viewer-status {
    color: #ffffff !important;

    font-family: Arial, sans-serif !important;
    font-size: 8px !important;
    font-weight: bold !important;

    letter-spacing: 1px !important;
    line-height: 1.2 !important;

    text-align: center !important;
    text-transform: uppercase !important;

    text-shadow: 0 0 5px rgba(255,255,255,0.5) !important;
}

@media (max-width: 600px) {

    .dbn-viewer-overlay {
        gap: 4px !important;
        padding: 5px !important;
        border-width: 1.5px !important;
    }

    .dbn-viewer-name {
        font-size: clamp(10px, 3vw, 14px) !important;
        letter-spacing: 0.5px !important;
    }

    .dbn-viewer-live {
        font-size: 8px !important;
        letter-spacing: 1px !important;
    }

    .dbn-viewer-number {
        font-size: clamp(20px, 5vw, 27px) !important;
    }

    .dbn-viewer-label {
        font-size: 9px !important;
    }

    .dbn-viewer-status {
        font-size: 7px !important;
    }
}

@media (prefers-reduced-motion: reduce) {
    .dbn-viewer-overlay {
        transition: none !important;
    }

    .dbn-viewer-live-dot {
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
        if (link.dataset.dbnViewerReadyV4) return;

        link.dataset.dbnViewerReadyV4 = "true";
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
            "[DBN V4] Live channel viewer counts initialized."
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
