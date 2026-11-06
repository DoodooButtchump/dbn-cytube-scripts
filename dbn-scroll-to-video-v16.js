
/* ==================================================
   DBN SCROLL TO VIDEO
   Version 16 - V7 Viewer Count Loader

   - Preserves the exact V14 scroll button
   - Loads the V7 viewer-count script
   - Uses a fresh loader filename for cache bypass
   ================================================== */

(function () {
    "use strict";

    /* ==================================================
       PART 1 - SCROLL TO VIDEO BUTTON
    ================================================== */

    var buttonId = "dbn-scroll-to-video";

    function findMotd() {
        return document.querySelector(
            ".motd, #motd, .motd-content"
        );
    }

    function createScrollButton() {
        if (document.getElementById(buttonId)) return true;

        var motd = findMotd();

        if (!motd) return false;

        var button = document.createElement("button");

        button.id = buttonId;
        button.type = "button";
        button.textContent = "👇 SCROLL TO VIDEO 👇";

        button.style.cssText = `
            display: block;
            margin: 12px auto 18px auto;
            padding: 12px 24px;
            background: linear-gradient(
                180deg,
                #ff3030 0%,
                #b00000 100%
            );
            color: #ffffff;
            font-family: 'Metal Mania', cursive;
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 2px;
            text-align: center;
            border: 2px solid #ffffff;
            border-radius: 8px;
            box-shadow:
                0 5px 0 #650000,
                0 0 10px #ff0000,
                0 0 20px rgba(255,0,0,0.8);
            cursor: pointer;
            transition:
                transform 0.15s ease,
                box-shadow 0.15s ease;
        `;

        button.addEventListener("mouseenter", function () {
            button.style.transform = "translateY(-2px)";
            button.style.boxShadow =
                "0 7px 0 #650000, 0 0 15px #ff0000, 0 0 25px rgba(255,0,0,0.9)";
        });

        button.addEventListener("mouseleave", function () {
            button.style.transform = "translateY(0)";
            button.style.boxShadow =
                "0 5px 0 #650000, 0 0 10px #ff0000, 0 0 20px rgba(255,0,0,0.8)";
        });

        button.addEventListener("mousedown", function () {
            button.style.transform = "translateY(4px)";
            button.style.boxShadow =
                "0 1px 0 #650000, 0 0 8px #ff0000";
        });

        button.addEventListener("mouseup", function () {
            button.style.transform = "translateY(-2px)";
            button.style.boxShadow =
                "0 7px 0 #650000, 0 0 15px #ff0000, 0 0 25px rgba(255,0,0,0.9)";
        });

        button.addEventListener("click", function () {
            var video = document.querySelector("#videowrap");

            if (video) {
                video.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        });

        motd.appendChild(button);

        return true;
    }

    var attempts = 0;

    var buttonTimer = setInterval(function () {
        attempts++;

        if (createScrollButton() || attempts >= 20) {
            clearInterval(buttonTimer);
        }
    }, 500);

    /* ==================================================
       PART 2 - LOAD V7 VIEWER COUNTS
    ================================================== */

    if (window.DBNViewerLoaderV16Started) return;

    window.DBNViewerLoaderV16Started = true;

    var script = document.createElement("script");

    script.src =
        "https://cdn.jsdelivr.net/gh/DoodooButtchump/dbn-cytube-scripts@main/dbn-live-viewer-counts-v7.js";

    script.async = true;

    script.onload = function () {
        console.log("[DBN V16] Viewer-count V7 loaded.");
    };

    script.onerror = function () {
        console.error("[DBN V16] Failed to load viewer-count V7.");
    };

    document.head.appendChild(script);

})();
