
/* ==================================================
   DBN SCROLL TO VIDEO
   Version 17 - Correct Navbar Placement

   - Places button directly below navbar
   - Preserves original V14 button appearance
   - Relocates existing button if necessary
   - Loads viewer-count V8
   ================================================== */

(function () {
    "use strict";

    /* ==================================================
       PART 1 - SCROLL TO VIDEO BUTTON
    ================================================== */

    var buttonId = "dbn-scroll-to-video";

    function findNavbar() {
        return document.querySelector(
            "nav.navbar, .navbar, #navbar"
        );
    }

    function createScrollButton() {
        var navbar = findNavbar();

        if (!navbar || !navbar.parentNode) {
            return false;
        }

        var button = document.getElementById(buttonId);

        if (!button) {
            button = document.createElement("button");

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
        }

        /*
         * Always position the button immediately
         * after the navbar, never inside the MOTD.
         */

        if (navbar.nextElementSibling !== button) {
            navbar.insertAdjacentElement("afterend", button);
        }

        return true;
    }

    /* Retry while CyTube finishes building the page. */

    var attempts = 0;

    var buttonTimer = setInterval(function () {
        attempts++;

        if (createScrollButton() || attempts >= 40) {
            clearInterval(buttonTimer);
        }
    }, 500);

    /* ==================================================
       PART 2 - LOAD V8 VIEWER COUNTS
    ================================================== */

    if (window.DBNViewerLoaderV17Started) return;

    window.DBNViewerLoaderV17Started = true;

    var script = document.createElement("script");

    script.src =
        "https://cdn.jsdelivr.net/gh/DoodooButtchump/dbn-cytube-scripts@main/dbn-live-viewer-counts-v8.js";

    script.async = true;

    script.onload = function () {
        console.log("[DBN V17] Viewer-count V8 loaded.");
    };

    script.onerror = function () {
        console.error("[DBN V17] Failed to load viewer-count V8.");
    };

    document.head.appendChild(script);

})();
