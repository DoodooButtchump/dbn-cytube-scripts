
(function () {
    "use strict";

    var id = "dbn-scroll-to-video";

    function addButton() {
        if (document.getElementById(id)) return true;

        var motd = document.querySelector(
            "#motd, #motdwrap, .motd-container, .motd, " +
            ".motd-rocksalt, .motd-cta-3d"
        );

        if (!motd) return false;

        var button = document.createElement("button");
        button.id = id;
        button.type = "button";
        button.textContent = "SCROLL TO VIDEO";
        button.addEventListener("click", function () {
            var video = document.querySelector("#videowrap");
            if (!video) {
                alert("DBN: Video player not found.");
                return;
            }

            var r = video.getBoundingClientRect();
            window.scrollTo({
                top: Math.max(0, window.scrollY + r.top +
                    r.height / 2 - window.innerHeight / 2),
                behavior: "smooth"
            });
        });

        motd.insertBefore(button, motd.firstChild);
        return true;
    }

    function start() {
        var attempts = 0;
        var timer = setInterval(function () {
            attempts++;
            if (addButton() || attempts >= 20) {
                clearInterval(timer);
            }
        }, 500);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }
})();
