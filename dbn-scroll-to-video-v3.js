
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
        button.textContent = "SCROLL TO VIDEO";
        button.title = "Scroll to center the video player";

        // Apply styling directly to the button.
        var styles = {
            "display": "block",
            "visibility": "visible",
            "opacity": "1",
            "position": "relative",
            "float": "none",
            "clear": "both",
            "width": "fit-content",
            "min-width": "320px",
            "max-width": "95%",
            "box-sizing": "border-box",
            "margin": "20px auto 28px auto",
            "padding": "18px 34px",
            "text-align": "center",
            "font-family": "'Metal Mania', fantasy",
            "font-size": "30px",
            "font-weight": "normal",
            "letter-spacing": "3px",
            "line-height": "1.4",
            "color": "#ffffff",
            "background": "linear-gradient(180deg, #650000, #100000)",
            "border": "2px solid #cc0000",
            "border-radius": "30px",
            "box-shadow": "0 0 10px #8b0000, 0 0 24px rgba(220,0,0,0.75), inset 0 0 10px rgba(255,0,0,0.2)",
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
                "linear-gradient(180deg, #a00000, #580000)",
                "important"
            );
            button.style.setProperty(
                "border-color",
                "#ff3333",
                "important"
            );
            button.style.setProperty(
                "box-shadow",
                "0 0 14px #ff0000, 0 0 30px rgba(255,0,0,0.85)",
                "important"
            );
            button.style.setProperty(
                "transform",
                "scale(1.04)",
                "important"
            );
        });

        button.addEventListener("mouseleave", function () {
            button.style.setProperty(
                "background",
                "linear-gradient(180deg, #650000, #100000)",
                "important"
            );
            button.style.setProperty(
                "border-color",
                "#cc0000",
                "important"
            );
            button.style.setProperty(
                "box-shadow",
                "0 0 10px #8b0000, 0 0 24px rgba(220,0,0,0.75), inset 0 0 10px rgba(255,0,0,0.2)",
                "important"
            );
            button.style.setProperty(
                "transform",
                "scale(1)",
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
