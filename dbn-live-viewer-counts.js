
/* ==========================================================
   DBN LIVE CHANNEL VIEWER COUNTS
   Doodoo Buttchump Network
   Version 1.1 - Diagnostic Edition

   FEATURES:
   - Detects CyTube channel banners in .motd-banners
   - Creates DBN black / blood-red hover overlays
   - Tests whether the script is loading
   - Reports how many banner sections and links it finds
   - Watches for newly added banners
   ========================================================== */

(function () {
    "use strict";

    if (window.DBNLiveViewerCountsLoaded) return;
    window.DBNLiveViewerCountsLoaded = true;

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
            .dbn-viewer-banner {
                position: relative !important;
                overflow: hidden !important;
            }

            .dbn-viewer-overlay {
                position: absolute;
                inset: 0;
                z-index: 20;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 7px;
                padding: 8px;
                box-sizing: border-box;
                background: rgba(0, 0, 0, 0.93);
                border: 2px solid #ff2020;
                box-shadow:
                    inset 0 0 14px rgba(255, 0, 0, 0.4),
                    0 0 12px rgba(255, 0, 0, 0.8);
                opacity: 0;
                visibility: hidden;
                transition:
                    opacity 0.2s ease,
                    visibility 0.2s ease;
                pointer-events: none;
                text-align: center;
            }

            .dbn-viewer-banner:hover .dbn-viewer-overlay,
            .dbn-viewer-banner:focus-visible .dbn-viewer-overlay,
            .dbn-viewer-banner:focus-within .dbn-viewer-overlay {
                opacity: 1;
                visibility: visible;
            }

            .dbn-viewer-name {
                color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: clamp(11px, 1.2vw, 17px);
                font-weight: 900;
                letter-spacing: 1px;
                text-transform: uppercase;
                text-shadow:
                    0 0 5px #ff0000,
                    0 0 12px #ff0000;
                overflow-wrap: anywhere;
            }

            .dbn-viewer-count {
                color: #ff3030;
                font-family: Arial, sans-serif;
                font-size: clamp(17px, 2vw, 27px);
                font-weight: 900;
                text-shadow:
                    0 0 5px #ff0000,
                    0 0 15px #ff0000;
            }

            .dbn-viewer-status {
                color: #cccccc;
                font-family: Arial, sans-serif;
                font-size: 10px;
                font-weight: bold;
                letter-spacing: 1px;
                text-transform: uppercase;
            }

            @media (max-width: 600px) {
                .dbn-viewer-overlay {
                    gap: 4px;
                    padding: 4px;
                }

                .dbn-viewer-status {
                    font-size: 8px;
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

        const name = document.createElement("div");
        name.className = "dbn-viewer-name";
        name.textContent = channel.replace(/-/g, " ");

        const count = document.createElement("div");
        count.className = "dbn-viewer-count";
        count.textContent = "--";

        const status = document.createElement("div");
        status.className = "dbn-viewer-status";
        status.textContent = "Hover for viewer count";

        overlay.append(name, count, status);
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

            status.textContent = "Currently in chat";
        }

        function showStatus(message) {
            count.textContent = "--";
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
       8. INITIALIZE AND RUN DIAGNOSTIC
    ====================================================== */

    function initialize() {
        addStyles();
        scanBanners();

        /* TEMPORARY DIAGNOSTIC */

        var containers = document.querySelectorAll(".motd-banners");

        var links = document.querySelectorAll(
            ".motd-banners a[href*='cytu.be/r/']"
        );

        alert(
            "[DBN VIEWER TEST]\n\n" +
            "Viewer script loaded successfully.\n\n" +
            "Banner sections found: " + containers.length + "\n" +
            "CyTube banner links found: " + links.length
        );

        /* END TEMPORARY DIAGNOSTIC */

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
