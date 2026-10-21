
(function () {
    "use strict";

    var buttonId = "dbn-scroll-to-video";

    function addScrollButton() {
        if (document.getElementById(buttonId)) return true;

        var motd = document.querySelector(
            "#motd, #motdwrap, .motd-container, .motd, " +
            ".motd-rocksalt, .motd-cta-3d"
        );

        if (!motd) return false;

        var button = document.createElement("button");

        button.id = buttonId;
        button.type = "button";
        button.textContent = "👇 SCROLL TO VIDEO 👇";
        button.title = "Scroll to center the video player";

        // 25% smaller than the original v5 dimensions.
        var styles = {
            "display": "block",
            "visibility": "visible",
            "opacity": "1",
            "position": "relative",
            "float": "none",
            "clear": "both",
            "width": "fit-content",
            "min-width": "240px",
            "max-width": "95%",
            "box-sizing": "border-box",
            "margin": "15px auto 21px auto",
            "padding": "12px 26px",
            "text-align": "center",
            "font-family": "'Metal Mania', fantasy",
            "font-size": "22.5px",
            "font-weight": "normal",
            "letter-spacing": "2.25px",
            "line-height": "1.3",
            "color": "#ffffff",
            "background": "linear-gradient(180deg, #b00000 0%, #780000 45%, #3a0000 100%)",
            "border": "1.5px solid #d42a2a",
            "border-radius": "9px",
            "box-shadow": "0 4.5px 0 #280000, 0 6px 10px rgba(0,0,0,0.65), inset 0 1.5px 2px rgba(255,255,255,0.3)",
            "cursor": "pointer",
            "z-index": "auto",
            "transition": "all 0.2s ease-in-out"
        };

        Object.keys(styles).forEach(function (property) {
            button.style.setProperty(
                property,
                styles[property],
                "important"
            );
        });

        button.addEventListener("mouseenter", function () {
            button.style.setProperty(
                "background",
                "linear-gradient(180deg, #d00000, #650000)",
                "important"
            );
            button.style.setProperty(
                "border-color",
                "#ff3333",
                "important"
            );
            button.style.setProperty(
                "box-shadow",
                "0 4.5px 0 #280000, 0 6px 10px rgba(255,0,0,0.45), inset 0 1.5px 2px rgba(255,255,255,0.3)",
                "important"
            );
        });

        button.addEventListener("mouseleave", function () {
            button.style.setProperty(
                "background",
                "linear-gradient(180deg, #b00000 0%, #780000 45%, #3a0000 100%)",
                "important"
            );
            button.style.setProperty(
                "border-color",
                "#d42a2a",
                "important"
            );
            button.style.setProperty(
                "box-shadow",
                "0 4.5px 0 #280000, 0 6px 10px rgba(0,0,0,0.65), inset 0 1.5px 2px rgba(255,255,255,0.3)",
                "important"
            );
        });

        button.addEventListener("click", function () {
            var video = document.querySelector("#videowrap");

            if (!video) {
                alert("DBN: Could not find the video player.");
                return;
            }

            var rect = video.getBoundingClientRect();

            var targetY =
                window.scrollY +
                rect.top +
                rect.height / 2 -
                window.innerHeight / 2;

            window.scrollTo({
                top: Math.max(0, targetY),
                behavior: "smooth"
            });
        });

        motd.insertBefore(button, motd.firstChild);

        return true;
    }

    function start() {
        var attempts = 0;

        var timer = window.setInterval(function () {
            attempts++;

            if (addScrollButton() || attempts >= 20) {
                window.clearInterval(timer);
            }
        }, 500);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }
})();
