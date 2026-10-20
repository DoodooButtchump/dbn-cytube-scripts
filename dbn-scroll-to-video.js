
(function () {
    "use strict";

    var buttonId = "dbn-scroll-to-video";

    function addScrollButton() {
        if (document.getElementById(buttonId)) {
            return true;
        }

        // Find the MOTD container.
        var motd = document.querySelector(
            "#motd, #motdwrap, .motd-container, .motd, " +
            ".motd-rocksalt, .motd-cta-3d"
        );

        if (!motd) {
            return false;
        }

        var button = document.createElement("button");
        button.id = buttonId;
        button.type = "button";
        button.textContent = "SCROLL TO VIDEO";
        button.title = "Scroll to center the video player";

        button.addEventListener("click", function () {
            var video = document.querySelector("#videowrap");

            if (!video) {
                alert("DBN: Could not find the video player.");
                return;
            }

            var rect = video.getBoundingClientRect();
            var targetY = window.scrollY + rect.top +
                rect.height / 2 - window.innerHeight / 2;

            window.scrollTo({
                top: Math.max(0, targetY),
                behavior: "smooth"
            });
        });

        // Place the button before the MOTD's existing content.
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
