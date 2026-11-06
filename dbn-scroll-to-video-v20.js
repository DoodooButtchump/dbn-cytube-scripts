
/* ==========================================================
   DBN SCROLL TO VIDEO
   Doodoo Buttchump Network
   Version 20 - Normal Flow Navbar Placement

   FEATURES:
   - Button directly below navbar
   - Button sits above MOTD
   - Reserves its own layout space
   - Does not cover dropdown menus or text
   - Preserves DBN red neon / 3D appearance
   - Smooth scroll to video player
   - Loads viewer-count script
   ========================================================== */

(function () {
    "use strict";

    if (window.DBNScrollToVideoV20Loaded) return;
    window.DBNScrollToVideoV20Loaded = true;

    var BUTTON_ID = "dbn-scroll-to-video";
    var SECTION_ID = "dbn-scroll-to-video-v20-section";

    /* ======================================================
       FIND THE OUTER MOTD CONTAINER
       ====================================================== */

    function findMotd() {
        var selectors = [
            "#motdwrap",
            ".motd-container",
            "#motd",
            ".motd"
        ];

        for (var i = 0; i < selectors.length; i++) {
            var element = document.querySelector(selectors[i]);

            if (element && element.parentElement) {
                return element;
            }
        }

        return null;
    }

    /* ======================================================
       CREATE BUTTON SECTION
       ====================================================== */

    function createButton() {
        var motd = findMotd();

        if (!motd) return false;

        var section = document.getElementById(SECTION_ID);

        if (!section) {
            section = document.createElement("div");
            section.id = SECTION_ID;

            section.style.display = "flex";
            section.style.position = "relative";
            section.style.width = "100%";
            section.style.boxSizing = "border-box";
            section.style.justifyContent = "center";
            section.style.alignItems = "center";
            section.style.textAlign = "center";
            section.style.margin = "15px auto 21px";
            section.style.padding = "0";
            section.style.clear = "both";
            section.style.zIndex = "1";

            motd.parentElement.insertBefore(section, motd);
        } else if (section.parentElement !== motd.parentElement) {
            motd.parentElement.insertBefore(section, motd);
        } else if (section.nextElementSibling !== motd) {
            motd.parentElement.insertBefore(section, motd);
        }

        var button = document.getElementById(BUTTON_ID);

        if (!button) {
            button = document.createElement("button");
            button.id = BUTTON_ID;
            button.type = "button";

            button.innerHTML = "👇 SCROLL TO VIDEO 👇";

            button.style.display = "inline-block";
            button.style.position = "relative";
            button.style.boxSizing = "border-box";
            button.style.minWidth = "240px";
            button.style.maxWidth = "95%";
            button.style.padding = "9px 24px";
            button.style.margin = "0";
            button.style.border = "3px solid #ffffff";
            button.style.borderRadius = "9px";

            button.style.background =
                "linear-gradient(180deg, #ff3030 0%, #990000 100%)";

            button.style.color = "#ffffff";
            button.style.fontFamily = "'Metal Mania', cursive";
            button.style.fontSize = "22.5px";
            button.style.fontWeight = "bold";
            button.style.letterSpacing = "1px";
            button.style.textAlign = "center";
            button.style.textShadow =
                "2px 2px 2px #000000, 0 0 8px #ff0000";

            button.style.boxShadow =
                "0 5px 0 #4d0000, 0 0 14px #ff0000";

            button.style.cursor = "pointer";
            button.style.transition =
                "transform 0.15s ease, box-shadow 0.15s ease";

            button.addEventListener("mouseenter", function () {
                button.style.transform = "translateY(-2px)";
                button.style.boxShadow =
                    "0 7px 0 #4d0000, 0 0 22px #ff0000";
            });

            button.addEventListener("mouseleave", function () {
                button.style.transform = "translateY(0)";
                button.style.boxShadow =
                    "0 5px 0 #4d0000, 0 0 14px #ff0000";
            });

            button.addEventListener("mousedown", function () {
                button.style.transform = "translateY(4px)";
                button.style.boxShadow =
                    "0 1px 0 #4d0000, 0 0 12px #ff0000";
            });

            button.addEventListener("mouseup", function () {
                button.style.transform = "translateY(-2px)";
                button.style.boxShadow =
                    "0 7px 0 #4d0000, 0 0 22px #ff0000";
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

            section.appendChild(button);
        } else if (button.parentElement !== section) {
            section.appendChild(button);
        }

        return true;
    }

    /* ======================================================
       INITIALIZE
       ====================================================== */

    function initialize() {
        var attempts = 0;

        var retry = setInterval(function () {
            attempts++;

            if (createButton() || attempts >= 40) {
                clearInterval(retry);
            }
        }, 500);

        createButton();

        window.addEventListener("resize", createButton);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }

    /* ======================================================
       LOAD VIEWER COUNTS VERSION 14
       ====================================================== */

    if (!document.querySelector(
        'script[data-dbn-live-viewers]'
    )) {
        var viewerScript = document.createElement("script");

        viewerScript.src =
            "https://cdn.jsdelivr.net/gh/DoodooButtchump/dbn-cytube-scripts@main/dbn-live-viewer-counts-v14.js";

        viewerScript.setAttribute(
            "data-dbn-live-viewers",
            "true"
        );

        document.body.appendChild(viewerScript);
    }

})();
