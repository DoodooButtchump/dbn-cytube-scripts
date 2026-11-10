
/* ==========================================================
   DBN INFINITE CHANNEL BANNER CAROUSEL
   Doodoo Buttchump Network
   Version 1.0

   FEATURES:
   - Four separate category carousels
   - Uses ONLY existing channel banner images and links
   - Preserves original banner destinations
   - Seamless infinite horizontal scrolling
   - Five-column desktop sizing
   - Responsive mobile sizing
   - Hover and keyboard-focus pause
   - Manual left/right navigation
   - Blood-red neon DBN appearance
   - Preserves existing viewer-count overlays
   - Does not touch logo, headings, donations or Discord
   ========================================================== */

(function () {
    "use strict";

    if (window.DBNInfiniteBannerCarouselLoaded) return;
    window.DBNInfiniteBannerCarouselLoaded = true;

    const CONFIG = {
        container: ".motd-banners",
        speed: 35,
        copies: 4,
        gap: 16
    };

    function addStyles() {
        if (document.getElementById("dbn-infinite-carousel-css")) return;

        const style = document.createElement("style");
        style.id = "dbn-infinite-carousel-css";

        style.textContent = `

            /* MAIN CAROUSEL SHELL */

            .dbn-carousel-shell {
                position: relative;
                width: 100%;
                max-width: 100%;
                margin: 12px auto 24px;
                padding: 12px 42px;
                box-sizing: border-box;

                background:
                    linear-gradient(
                        180deg,
                        #100000,
                        #050000,
                        #100000
                    );

                border: 2px solid #b00000;

                box-shadow:
                    inset 0 0 15px rgba(255,0,0,.22),
                    0 0 10px rgba(255,0,0,.65),
                    0 0 25px rgba(255,0,0,.3);
            }

            /* VIEWPORT */

            .motd-banners.dbn-carousel-viewport {
                display: block !important;
                position: relative !important;
                width: 100% !important;
                max-width: 100% !important;
                overflow: hidden !important;
                margin: 0 !important;
                padding: 5px 0 !important;
                box-sizing: border-box !important;
            }

            /* MOVING TRACK */

            .dbn-carousel-track {
                display: flex !important;
                flex-wrap: nowrap !important;
                align-items: center !important;
                width: max-content !important;
                gap: 0 !important;
                will-change: transform;
            }

            .dbn-carousel-set {
                display: flex !important;
                flex-wrap: nowrap !important;
                align-items: center !important;
                flex: 0 0 auto !important;
                gap: 16px !important;
                padding-right: 16px !important;
            }

            /* INDIVIDUAL CHANNEL BANNERS */

            .dbn-carousel-set > .column {
                display: flex !important;
                float: none !important;

                flex: 0 0 clamp(150px, 18vw, 230px) !important;

                width: clamp(150px, 18vw, 230px) !important;
                max-width: none !important;

                margin: 0 !important;
                padding: 0 !important;

                box-sizing: border-box !important;
            }

            .dbn-carousel-set > .column > a {
                display: block !important;
                position: relative !important;
                width: 100% !important;
                overflow: hidden !important;

                background: #000 !important;

                border: 2px solid #8b0000 !important;

                box-shadow:
                    0 0 6px rgba(255,0,0,.55),
                    inset 0 0 8px rgba(255,0,0,.2);

                transition:
                    border-color .2s ease,
                    box-shadow .2s ease,
                    transform .2s ease;
            }

            .dbn-carousel-set > .column > a:hover {
                border-color: #ff3030 !important;

                box-shadow:
                    0 0 10px #ff0000,
                    0 0 22px rgba(255,0,0,.85),
                    inset 0 0 12px rgba(255,0,0,.3);

                transform: scale(1.035);
                z-index: 5;
            }

            .dbn-carousel-set .column img {
                display: block !important;
                width: 100% !important;
                height: auto !important;
                max-height: 145px !important;
                object-fit: contain !important;
                margin: 0 !important;
                border: 0 !important;
            }

            /* NAVIGATION ARROWS */

            .dbn-carousel-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                z-index: 50;

                width: 34px;
                height: 52px;

                display: flex;
                align-items: center;
                justify-content: center;

                color: #fff;
                background: #190000;

                border: 2px solid #ff2020;
                border-radius: 5px;

                font-size: 27px;
                font-weight: 900;

                text-shadow:
                    0 0 5px #ff0000,
                    0 0 12px #ff0000;

                box-shadow:
                    0 0 8px #ff0000,
                    inset 0 0 10px rgba(255,0,0,.3);

                cursor: pointer;
                user-select: none;

                transition:
                    background .2s ease,
                    box-shadow .2s ease;
            }

            .dbn-carousel-arrow:hover {
                background: #650000;

                box-shadow:
                    0 0 12px #ff0000,
                    0 0 25px rgba(255,0,0,.8);
            }

            .dbn-carousel-prev {
                left: 5px;
            }

            .dbn-carousel-next {
                right: 5px;
            }

            .dbn-carousel-arrow:focus-visible {
                outline: 2px solid white;
                outline-offset: 3px;
            }

            /* MOBILE */

            @media (max-width: 600px) {

                .dbn-carousel-shell {
                    padding: 10px 34px;
                    margin: 10px auto 18px;
                }

                .dbn-carousel-set {
                    gap: 12px !important;
                    padding-right: 12px !important;
                }

                .dbn-carousel-set > .column {
                    flex-basis: 72vw !important;
                    width: 72vw !important;
                }

                .dbn-carousel-arrow {
                    width: 27px;
                    height: 44px;
                    font-size: 22px;
                }

                .dbn-carousel-set .column img {
                    max-height: 120px !important;
                }
            }

            @media (prefers-reduced-motion: reduce) {
                .dbn-carousel-set > .column > a {
                    transition: none !important;
                }
            }

        `;

        document.head.appendChild(style);
    }

    /* REMOVE VIEWER OVERLAYS FROM DUPLICATE BANNERS.
       The originals retain their existing viewer functionality.
       The existing viewer-count script can initialize the copies. */

    function cleanClone(clone) {
        clone.querySelectorAll(".dbn-viewer-overlay").forEach(
            function (overlay) {
                overlay.remove();
            }
        );

        clone.querySelectorAll("a").forEach(function (link) {
            delete link.dataset.dbnViewerReady;
            link.classList.remove("dbn-viewer-banner");
        });

        return clone;
    }

    /* BUILD ONE CAROUSEL PER EXISTING CATEGORY */

    function buildCarousel(container) {

        if (container.dataset.dbnCarouselReady) return;

        const banners = Array.from(container.children).filter(
            function (element) {
                return (
                    element.classList.contains("column") &&
                    element.querySelector("a[href] img")
                );
            }
        );

        if (!banners.length) return;

        container.dataset.dbnCarouselReady = "true";

        /* Create outer shell */

        const shell = document.createElement("div");
        shell.className = "dbn-carousel-shell";

        /* Navigation buttons */

        const previous = document.createElement("button");
        previous.type = "button";
        previous.className =
            "dbn-carousel-arrow dbn-carousel-prev";
        previous.textContent = "‹";
        previous.setAttribute("aria-label", "Previous channel banners");

        const next = document.createElement("button");
        next.type = "button";
        next.className =
            "dbn-carousel-arrow dbn-carousel-next";
        next.textContent = "›";
        next.setAttribute("aria-label", "Next channel banners");

        shell.append(previous, next);

        container.parentNode.insertBefore(shell, container);
        shell.appendChild(container);

        container.classList.add("dbn-carousel-viewport");

        /* Create moving track */

        const track = document.createElement("div");
        track.className = "dbn-carousel-track";

        const firstSet = document.createElement("div");
        firstSet.className = "dbn-carousel-set";

        /* Move original banners.
           Their original links and viewer overlays remain intact. */

        banners.forEach(function (banner) {
            firstSet.appendChild(banner);
        });

        track.appendChild(firstSet);

        /* Add identical copies for seamless looping */

        for (let i = 1; i < CONFIG.copies; i++) {

            const copy = document.createElement("div");
            copy.className = "dbn-carousel-set";
            copy.setAttribute("aria-hidden", "true");

            banners.forEach(function (banner) {
                copy.appendChild(cleanClone(banner.cloneNode(true)));
            });

            track.appendChild(copy);
        }

        container.appendChild(track);

        /* ANIMATION */

        let offset = 0;
        let cycleWidth = 0;
        let cardStep = 0;
        let lastTime = 0;
        let animationFrame = null;

        function measure() {
            cycleWidth = firstSet.getBoundingClientRect().width;

            const firstCard = firstSet.querySelector(".column");

            if (firstCard) {
                cardStep =
                    firstCard.getBoundingClientRect().width +
                    CONFIG.gap;
            }

            if (cycleWidth > 0) {
                offset %= cycleWidth;
            }
        }

        function updatePosition() {
            track.style.transform =
                "translate3d(" + (-offset) + "px,0,0)";
        }

        function animate(time) {

            if (!lastTime) lastTime = time;

            const delta = Math.min(time - lastTime, 50);
            lastTime = time;

            const paused =
                document.hidden ||
                shell.matches(":hover") ||
                shell.contains(document.activeElement);

            if (!paused && cycleWidth > 0) {

                offset += CONFIG.speed * delta / 1000;
                offset %= cycleWidth;

                updatePosition();
            }

            animationFrame = requestAnimationFrame(animate);
        }

        /* MANUAL NAVIGATION */

        previous.addEventListener("click", function () {

            if (!cycleWidth) return;

            offset = (offset - cardStep + cycleWidth) % cycleWidth;
            updatePosition();
        });

        next.addEventListener("click", function () {

            if (!cycleWidth) return;

            offset = (offset + cardStep) % cycleWidth;
            updatePosition();
        });

        /* RESIZE SUPPORT */

        if (window.ResizeObserver) {

            const resizeObserver = new ResizeObserver(measure);
            resizeObserver.observe(container);

        } else {

            window.addEventListener("resize", measure);
        }

        measure();
        updatePosition();

        animationFrame = requestAnimationFrame(animate);

        console.log(
            "[DBN] Infinite carousel initialized:",
            banners.length,
            "channel banners."
        );
    }

    /* INITIALIZE ALL FOUR EXISTING BANNER GROUPS */

    function initialize() {

        addStyles();

        document.querySelectorAll(CONFIG.container).forEach(
            buildCarousel
        );

        console.log(
            "[DBN] All channel banner carousels initialized."
        );
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
