
/* ==========================================================
   DBN LIVE CHANNEL VIEWER COUNTS
   Doodoo Buttchump Network
   Version 9.0 - Automatic Connection Recovery

   Uses V8 for the existing overlays and socket connections.
   Adds up to three automatic retries after a failed attempt.
   ========================================================== */

(function () {
    "use strict";

    if (window.DBNLiveViewerCountsV9Loaded) return;
    window.DBNLiveViewerCountsV9Loaded = true;

    var RETRY_DELAY = 5000;
    var MAX_RETRIES = 3;
    var LINK_SELECTOR =
        ".motd-banners a.dbn-viewer-banner-v6";

    /* ======================================================
       LOAD V8 AS THE BASE OVERLAY AND CONNECTION ENGINE
       ====================================================== */

    function loadV8(callback) {
        if (window.DBNLiveViewerCountsV8Loaded) {
            callback();
            return;
        }

        var existing = document.querySelector(
            'script[data-dbn-v8-core]'
        );

        if (existing) {
            existing.addEventListener("load", callback, {
                once: true
            });
            return;
        }

        var script = document.createElement("script");

        script.src =
            "https://cdn.jsdelivr.net/gh/DoodooButtchump/dbn-cytube-scripts@main/dbn-live-viewer-counts-v8.js";

        script.setAttribute("data-dbn-v8-core", "true");

        script.onload = callback;

        script.onerror = function () {
            console.error("[DBN V9] Unable to load V8 core.");
        };

        document.body.appendChild(script);
    }

    /* ======================================================
       INSTALL AUTOMATIC RETRY HANDLING
       ====================================================== */

    function installRetries() {
        var installed = new WeakSet();

        function installOnBanner(link) {
            if (installed.has(link)) return;

            installed.add(link);

            var state = {
                hovering: false,
                retrying: false,
                retries: 0,
                timer: null
            };

            function getStatus() {
                var status = link.querySelector(
                    ".dbn-viewer-status-v6"
                );

                return status
                    ? status.textContent.trim()
                    : "";
            }

            function isActive() {
                return (
                    state.hovering &&
                    (
                        link.matches(":hover") ||
                        link.contains(document.activeElement)
                    )
                );
            }

            function clearRetry() {
                if (state.timer) {
                    clearTimeout(state.timer);
                    state.timer = null;
                }
            }

            function scheduleRetry() {
                if (!isActive()) return;
                if (state.timer) return;
                if (state.retries >= MAX_RETRIES) return;

                var status = getStatus();

                if (
                    status !== "Connection unavailable" &&
                    status !== "Unable to retrieve count"
                ) {
                    return;
                }

                state.timer = setTimeout(function () {
                    state.timer = null;

                    if (!isActive()) return;
                    if (state.retries >= MAX_RETRIES) return;

                    state.retries++;

                    console.log(
                        "[DBN V9] Retrying viewer count for " +
                        link.href +
                        " (" +
                        state.retries +
                        "/" +
                        MAX_RETRIES +
                        ")"
                    );

                    state.retrying = true;

                    link.dispatchEvent(
                        new PointerEvent("pointerenter", {
                            bubbles: false,
                            cancelable: false,
                            pointerType: "mouse"
                        })
                    );

                    state.retrying = false;

                }, RETRY_DELAY);
            }

            /* New hover starts a fresh retry allowance. */

            link.addEventListener("pointerenter", function () {
                if (state.retrying) return;

                if (!state.hovering) {
                    state.hovering = true;
                    state.retries = 0;
                    clearRetry();
                }
            });

            link.addEventListener("pointerleave", function () {
                state.hovering = false;
                state.retries = 0;
                clearRetry();
            });

            link.addEventListener("focusin", function () {
                state.hovering = true;
            });

            link.addEventListener("focusout", function () {
                setTimeout(function () {
                    if (!link.contains(document.activeElement)) {
                        state.hovering = false;
                        state.retries = 0;
                        clearRetry();
                    }
                }, 150);
            });

            /* Watch the existing V8 status text. */

            var observer = new MutationObserver(function () {
                scheduleRetry();
            });

            var statusElement = link.querySelector(
                ".dbn-viewer-status-v6"
            );

            if (statusElement) {
                observer.observe(statusElement, {
                    childList: true,
                    characterData: true,
                    subtree: true
                });
            }

            /* Also check periodically in case status changes
               before the observer is attached. */

            var checkInterval = setInterval(function () {
                if (!link.isConnected) {
                    clearInterval(checkInterval);
                    clearRetry();
                    observer.disconnect();
                    return;
                }

                scheduleRetry();
            }, 1000);
        }

        function scan() {
            document.querySelectorAll(LINK_SELECTOR).forEach(
                installOnBanner
            );
        }

        scan();

        var pageObserver = new MutationObserver(scan);

        pageObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log(
            "[DBN V9] Automatic viewer-count recovery initialized."
        );
    }

    /* ======================================================
       STARTUP
       ====================================================== */

    function initialize() {
        loadV8(installRetries);
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
