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

        // Compact 3D button styling.
        var styles = {
            "display": "block",
            "visibility": "visible",
            "opacity": "1",
            "position": "relative",
            "float": "none",
            "clear": "both",
            "width": "fit-content",
            "min-width": "80px",
            "max-width": "95%",
            "box-sizing": "border-box",
            "margin": "10px auto 14px auto",
            "padding": "4px 9px",
            "text-align": "center",
            "font-family": "'Metal Mania', fantasy",
            "font-size": "12px",
            "font-weight": "normal",
            "letter-spacing": "1px",
            "line-height": "1.2",
            "color": "#ffffff",
            "background": "linear-gradient(180deg, #b00000 0%, #780000 45%, #3a0000 100%)",
            "border": "1px solid #d42a2a",
            "border-radius": "6px",
            "box-shadow": "0 2px 0 #280000, 0 3px 5px rgba(0,0,0,0.65), inset 0 1px 2px rgba(255,255,255,0.3)",
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
                "0 2px 0 #280000, 0 3px 7px rgba(255,0,0,0.45), inset 0 1px 2px rgba(255,255,255,0.3)",
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
                "0 2px 0 #280000, 0 3px 5px rgba(0,0,0,0.65), inset 0 1px 2px rgba(255,255,255,0.3)",
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
