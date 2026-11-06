
/* ==================================================
   DBN SCROLL TO VIDEO
   Version 19 - Independent Navbar-Safe Placement
   ================================================== */

(function () {
    "use strict";

    if (window.DBNScrollToVideoV19Loaded) return;
    window.DBNScrollToVideoV19Loaded = true;

    var BUTTON_ID = "dbn-scroll-to-video-v19";
    var HOST_ID = "dbn-scroll-to-video-v19-host";

    /* -----------------------------------------------
       FIND THE VISIBLE NAVBAR
    ------------------------------------------------ */

    function findNavbar() {
        var selectors = [
            "#navbar",
            "nav.navbar",
            ".navbar"
        ];

        var candidates = [];

        selectors.forEach(function (selector) {
            document.querySelectorAll(selector).forEach(function (element) {
                var rect = element.getBoundingClientRect();

                if (
                    rect.width > window.innerWidth * 0.5 &&
                    rect.height > 0 &&
                    rect.top < 200 &&
                    rect.bottom > 0
                ) {
                    candidates.push(element);
                }
            });
        });

        if (!candidates.length) return null;

        candidates.sort(function (a, b) {
            return b.getBoundingClientRect().width -
                   a.getBoundingClientRect().width;
        });

        return candidates[0];
    }

    /* -----------------------------------------------
       CREATE THE INDEPENDENT BUTTON CONTAINER
    ------------------------------------------------ */

    function createButton() {
        if (!document.body) return;

        var host = document.getElementById(HOST_ID);

        if (!host) {
            host = document.createElement("div");
            host.id = HOST_ID;

            host.style.position = "absolute";
            host.style.left = "0";
            host.style.width = "100%";
            host.style.display = "flex";
            host.style.justifyContent = "center";
            host.style.alignItems = "center";
            host.style.zIndex = "2147483000";
            host.style.pointerEvents = "none";

            document.body.appendChild(host);
        }

        var button = document.getElementById(BUTTON_ID);

        if (!button) {
            button = document.createElement("button");
            button.id = BUTTON_ID;
            button.type = "button";

            button.innerHTML =
                "👇 SCROLL TO VIDEO 👇";

            button.style.pointerEvents = "auto";
            button.style.cursor = "pointer";
            button.style.display = "inline-block";
            button.style.padding = "9px 24px";
            button.style.margin = "0";
            button.style.border = "3px solid white";
            button.style.borderRadius = "9px";
            button.style.background =
                "linear-gradient(180deg, #ff3030 0%, #990000 100%)";
            button.style.color = "#ffffff";
            button.style.fontFamily = "'Metal Mania', cursive";
            button.style.fontSize = "20px";
            button.style.fontWeight = "bold";
            button.style.letterSpacing = "1px";
            button.style.textShadow =
                "2px 2px 2px #000000, 0 0 8px #ff0000";
            button.style.boxShadow =
                "0 5px 0 #4d0000, 0 0 14px #ff0000";
            button.style.position = "relative";
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
                        block: "start"
                    });
                }
            });

            host.appendChild(button);
        }

        /* -------------------------------------------
           POSITION BELOW THE ACTUAL NAVBAR
        -------------------------------------------- */

        var navbar = findNavbar();
        var topPosition = 80;

        if (navbar) {
            var rect = navbar.getBoundingClientRect();

            topPosition =
                rect.bottom +
                window.scrollY +
                12;
        }

        host.style.top = topPosition + "px";
    }

    /* -----------------------------------------------
       INITIALIZE AND HANDLE RESIZING
    ------------------------------------------------ */

    function initialize() {
        createButton();

        var attempts = 0;

        var retry = setInterval(function () {
            createButton();
            attempts++;

            if (findNavbar() || attempts >= 40) {
                clearInterval(retry);
            }
        }, 500);

        window.addEventListener("resize", createButton);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }

    /* -----------------------------------------------
       LOAD VIEWER COUNTS VERSION 8
    ------------------------------------------------ */

    if (!document.querySelector(
        'script[data-dbn-live-viewers]'
    )) {
        var viewerScript = document.createElement("script");

        viewerScript.src =
            "https://cdn.jsdelivr.net/gh/DoodooButtchump/dbn-cytube-scripts@main/dbn-live-viewer-counts-v8.js";

        viewerScript.setAttribute(
            "data-dbn-live-viewers",
            "true"
        );

        document.body.appendChild(viewerScript);
    }

})();
