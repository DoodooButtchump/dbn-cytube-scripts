/* ==========================================================
   DBN INTELLIGENT BROADCAST SHUFFLE
   Version 1.0 - Private administrator broadcast scheduler

   Admin rank 3+ only; requires CyTube playlistmove permission.
   Upcoming queue only; currently playing video is never moved.
   Recognizes SxxExx, Season/Episode and 1x02 episode titles.
   Preserves episode chronology and maximizes show separation.
   Short clips under 5:00 are commercials by default.
   Per-channel manual overrides, preview and undo included.
   ========================================================== */
(function () {
    "use strict";
    if (window.DBNIntelligentBroadcastShuffleV1Loaded) return;
    window.DBNIntelligentBroadcastShuffleV1Loaded = true;

    var C = {
        button: "dbn-broadcast-shuffle-button-v1",
        modal: "dbn-broadcast-shuffle-modal-v1",
        style: "dbn-broadcast-shuffle-style-v1",
        commercialSeconds: 300,
        rankRequired: 3,
        moveTimeout: 5000,
        undoPrefix: "dbnBroadcastShuffleUndoV1:",
        overridePrefix: "dbnBroadcastShuffleOverridesV1:"
    };
    var plan = null;
    var applying = false;
    var undoSnapshot = null;

    function channelName() {
        return window.CHANNEL && CHANNEL.name
            ? String(CHANNEL.name)
            : String(window.location.pathname || "unknown");
    }
    function getStore(key) {
        try { return localStorage.getItem(key); } catch (e) { return null; }
    }
    function setStore(key, value) {
        try { localStorage.setItem(key, value); return true; } catch (e) { return false; }
    }
    function removeStore(key) {
        try { localStorage.removeItem(key); } catch (e) {}
    }
    function allowed() {
        try {
            return !!(window.CLIENT && typeof CLIENT.rank === "number" &&
                CLIENT.rank >= C.rankRequired &&
                typeof window.hasPermission === "function" &&
                window.hasPermission("playlistmove") &&
                window.socket && typeof socket.emit === "function");
        } catch (e) { return false; }
    }
    function parseDuration(value) {
        if (typeof value === "number" && isFinite(value)) return Math.max(0, value);
        if (typeof value !== "string" || !value.trim()) return null;
        var s = value.trim();
        if (/^\d+(?:\.\d+)?$/.test(s)) return Number(s);
        var p = s.split(":");
        if (p.length < 2 || p.length > 3) return null;
        var n = p.map(Number);
        if (n.some(function (v) { return !isFinite(v) || v < 0; })) return null;
        return n.length === 2 ? n[0] * 60 + n[1] : n[0] * 3600 + n[1] * 60 + n[2];
    }
    function queueEntries() {
        if (!window.jQuery) return [];
        var $ = window.jQuery, items = [];
        $("#queue > li.queue_entry").each(function () {
            var li = $(this), media = li.data("media") || {}, uid = li.data("uid");
            if (uid === undefined || uid === null) return;
            items.push({
                uid: String(uid),
                media: media,
                title: String(media.title || li.find(".qe_title").text() || "Untitled video"),
                duration: parseDuration(media.duration),
                element: this
            });
        });
        return items;
    }
    function currentUid() {
        return window.PL_CURRENT === undefined || window.PL_CURRENT === null
            ? null : String(window.PL_CURRENT);
    }
    function upcomingSnapshot() {
        var all = queueEntries(), current = currentUid(), index = -1;
        for (var i = 0; i < all.length; i++) {
            if (all[i].uid === current ||
                (all[i].element.classList && all[i].element.classList.contains("queue_active"))) {
                index = i;
                break;
            }
        }
        if (index < 0) throw new Error("Could not identify the currently playing playlist item. No changes were made.");
        return { currentUid: current, upcoming: all.slice(index + 1) };
    }
    function mediaKey(item) {
        var m = item.media || {};
        return m.type && m.id
            ? String(m.type) + ":" + String(m.id)
            : item.title.toLowerCase() + "|" + String(item.duration);
    }
    function overrides() {
        try {
            var value = JSON.parse(getStore(C.overridePrefix + channelName()) || "{}");
            return value && typeof value === "object" ? value : {};
        } catch (e) { return {}; }
    }
    function saveOverride(item, value) {
        var all = overrides(), key = mediaKey(item);
        if (value === "auto") delete all[key];
        else all[key] = value;
        setStore(C.overridePrefix + channelName(), JSON.stringify(all));
    }
    function cleanShow(value) {
        return String(value || "")
            .replace(/\[[^\]]*(?:480p|720p|1080p|2160p|HD|WEB-DL|WEBRip|DVDRip)[^\]]*\]/ig, " ")
            .replace(/\([^)]*(?:480p|720p|1080p|2160p|HD|WEB-DL|WEBRip|DVDRip)[^)]*\)/ig, " ")
            .replace(/\b(?:480p|720p|1080p|2160p|HDTV|WEB-DL|WEBRip|DVDRip|x264|x265)\b/ig, " ")
            .replace(/[\s._-]+$/g, "").replace(/^[\s._-]+/g, "")
            .replace(/[\s._-]+/g, " ").trim().toLowerCase();
    }
    function episodeInfo(title) {
        var patterns = [
            /\bS(\d{1,2})\s*E(?:P)?\s*(\d{1,3})\b/i,
            /\bSeason\s*(\d{1,2})\s*(?:Episode|Ep\.?)\s*(\d{1,3})\b/i,
            /\b(\d{1,2})x(\d{1,3})\b/i
        ];
        for (var i = 0; i < patterns.length; i++) {
            var match = patterns[i].exec(title);
            if (!match) continue;
            var show = cleanShow(title.slice(0, match.index));
            if (!show) continue;
            return { show: show, season: Number(match[1]), episode: Number(match[2]) };
        }
        return null;
    }
    function classification(item, saved) {
        var override = saved[mediaKey(item)];
        if (override === "commercial") return "commercial";
        if (override === "program") return "program";
        return item.duration !== null && item.duration < C.commercialSeconds
            ? "commercial" : "program";
    }
    function shuffled(items) {
        var a = items.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1)), t = a[i];
            a[i] = a[j]; a[j] = t;
        }
        return a;
    }
    function orderPrograms(programs) {
        var map = Object.create(null), groups = [];
        programs.forEach(function (item, index) {
            var ep = episodeInfo(item.title);
            var key = ep ? "show:" + ep.show : "single:" + item.uid;
            if (!map[key]) {
                map[key] = { key: key, last: -1000000, items: [] };
                groups.push(map[key]);
            }
            item.episode = ep;
            item.originalIndex = index;
            map[key].items.push(item);
        });
        groups.forEach(function (g) {
            g.items.sort(function (a, b) {
                if (a.episode && b.episode) {
                    if (a.episode.season !== b.episode.season) return a.episode.season - b.episode.season;
                    if (a.episode.episode !== b.episode.episode) return a.episode.episode - b.episode.episode;
                }
                return a.originalIndex - b.originalIndex;
            });
        });
        var result = [], previous = null;
        while (true) {
            var remaining = groups.filter(function (g) { return g.items.length; });
            if (!remaining.length) break;
            var candidates = remaining.filter(function (g) { return g.key !== previous; });
            if (!candidates.length) candidates = remaining;
            var oldest = Math.min.apply(null, candidates.map(function (g) { return g.last; }));
            var tied = candidates.filter(function (g) { return g.last === oldest; });
            var chosen = tied[Math.floor(Math.random() * tied.length)];
            result.push(chosen.items.shift());
            chosen.last = result.length;
            previous = chosen.key;
        }
        return result;
    }
    function makePlan(snapshot) {
        var saved = overrides(), programs = [], ads = [];
        snapshot.upcoming.forEach(function (item) {
            item.kind = classification(item, saved);
            (item.kind === "commercial" ? ads : programs).push(item);
        });
        if (programs.length < 2) {
            return {
                currentUid: snapshot.currentUid, source: snapshot.upcoming,
                programs: programs, commercials: ads,
                order: snapshot.upcoming.slice(), buckets: [],
                warning: programs.length === 0
                    ? "No programs detected. Change short clips to PROGRAM, or add longer videos, to create commercial breaks."
                    : "At least two programs are needed to put commercials between programs. No queue changes will be made until there are two."
            };
        }
        var programOrder = orderPrograms(programs);
        var adOrder = shuffled(ads);
        var gaps = programOrder.length - 1, buckets = [];
        for (var i = 0; i < gaps; i++) buckets.push([]);
        adOrder.forEach(function (ad, index) { buckets[index % gaps].push(ad); });
        buckets = buckets.map(shuffled);
        var order = [];
        programOrder.forEach(function (item, index) {
            order.push(item);
            if (index < buckets.length) buckets[index].forEach(function (ad) { order.push(ad); });
        });
        return {
            currentUid: snapshot.currentUid, source: snapshot.upcoming,
            programs: programs, commercials: ads, order: order,
            buckets: buckets, warning: ""
        };
    }
    function addStyles() {
        if (document.getElementById(C.style)) return;
        var style = document.createElement("style");
        style.id = C.style;
        style.textContent = `
#${C.button}{margin-left:7px;border:1px solid #ff3838;border-radius:5px;padding:6px 11px;color:#fff;background:linear-gradient(180deg,#b80000,#4b0000);box-shadow:0 0 9px rgba(255,0,0,.65),inset 0 1px 2px rgba(255,255,255,.15);font-weight:900;letter-spacing:.5px;text-shadow:0 0 5px #f00;cursor:pointer}
#${C.button}:hover{background:linear-gradient(180deg,#e00000,#650000);box-shadow:0 0 15px rgba(255,0,0,.9)}
#${C.modal}{position:fixed;inset:0;z-index:1000000;display:none;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;background:rgba(0,0,0,.82);color:#f4eaea;font-family:Arial,sans-serif}
#${C.modal} .dbn-bs-panel{width:min(920px,96vw);max-height:88vh;display:flex;flex-direction:column;overflow:hidden;border:2px solid #b40000;border-radius:9px;background:#100707;box-shadow:0 0 18px rgba(255,0,0,.55),0 0 45px rgba(0,0,0,.9)}
#${C.modal} .dbn-bs-head{padding:13px 16px;border-bottom:1px solid #651010;background:linear-gradient(90deg,#300707,#120707)}
#${C.modal} .dbn-bs-title{color:#ff4545;font-size:20px;font-weight:900;letter-spacing:1.2px;text-shadow:0 0 8px #f00}
#${C.modal} .dbn-bs-subtitle{margin-top:4px;color:#c9aaaa;font-size:11px;letter-spacing:.7px}
#${C.modal} .dbn-bs-stats{display:flex;flex-wrap:wrap;gap:8px;padding:10px 14px;border-bottom:1px solid #3b1717}
#${C.modal} .dbn-bs-stat{padding:7px 10px;border:1px solid #482020;border-radius:5px;background:#1b0c0c;color:#fff;font-size:12px}
#${C.modal} .dbn-bs-stat strong{color:#ff5555;font-size:16px;margin-right:5px}
#${C.modal} .dbn-bs-warning{margin:10px 14px 0;padding:8px 10px;border-left:3px solid #d68a22;background:#211607;color:#f0d7a9;font-size:12px}
#${C.modal} .dbn-bs-list-wrap{overflow:auto;min-height:120px;padding:8px 14px 14px}
#${C.modal} .dbn-bs-row{display:grid;grid-template-columns:36px minmax(0,1fr) 112px 105px;align-items:center;gap:9px;padding:7px 8px;border-bottom:1px solid #2b1717;background:#160b0b;font-size:12px}
#${C.modal} .dbn-bs-row:nth-child(even){background:#1d0d0d}
#${C.modal} .dbn-bs-index{color:#a77c7c;text-align:right;font-variant-numeric:tabular-nums}
#${C.modal} .dbn-bs-name{min-width:0;overflow-wrap:anywhere;color:#f7eeee}
#${C.modal} .dbn-bs-duration{color:#c9a9a9;text-align:right;white-space:nowrap}
#${C.modal} .dbn-bs-kind{width:100%;padding:5px;border:1px solid #633030;border-radius:4px;background:#0d0808;color:#fff;font-size:11px}
#${C.modal} .dbn-bs-foot{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;padding:12px 14px;border-top:1px solid #651010;background:#160909}
#${C.modal} .dbn-bs-action{border:1px solid #793030;border-radius:5px;padding:8px 12px;background:#2a1111;color:#fff;font-weight:700;cursor:pointer}
#${C.modal} .dbn-bs-action.primary{border-color:#ff3535;background:linear-gradient(180deg,#bd0000,#5a0000);box-shadow:0 0 9px rgba(255,0,0,.45)}
#${C.modal} .dbn-bs-action:disabled{opacity:.45;cursor:not-allowed}
#${C.modal} .dbn-bs-status{margin-right:auto;align-self:center;color:#d7baba;font-size:11px}
@media(max-width:620px){#${C.modal}{padding:5px}#${C.modal} .dbn-bs-row{grid-template-columns:25px minmax(0,1fr) 65px;gap:5px}#${C.modal} .dbn-bs-duration{display:none}#${C.modal} .dbn-bs-kind{grid-column:2/4}}
        `;
        document.head.appendChild(style);
    }
    function timeText(seconds) {
        if (seconds === null || seconds === undefined) return "Unknown";
        var total = Math.floor(seconds), mins = Math.floor(total / 60), sec = total % 60;
        var hrs = Math.floor(mins / 60);
        mins %= 60;
        return hrs ? hrs + ":" + String(mins).padStart(2,"0") + ":" + String(sec).padStart(2,"0")
            : mins + ":" + String(sec).padStart(2,"0");
    }
    function createModal() {
        var old = document.getElementById(C.modal);
        if (old) return old;
        addStyles();
        var modal = document.createElement("div");
        modal.id = C.modal;
        modal.innerHTML = `
<div class="dbn-bs-panel" role="dialog" aria-modal="true" aria-label="DBN Intelligent Broadcast Shuffle">
 <div class="dbn-bs-head"><div class="dbn-bs-title">DBN INTELLIGENT BROADCAST SHUFFLE</div><div class="dbn-bs-subtitle">PRIVATE ADMINISTRATOR BROADCAST CONTROL • UPCOMING QUEUE ONLY</div></div>
 <div class="dbn-bs-stats"></div><div class="dbn-bs-warning" style="display:none"></div><div class="dbn-bs-list-wrap"></div>
 <div class="dbn-bs-foot"><div class="dbn-bs-status">Ready</div><button type="button" class="dbn-bs-action dbn-bs-undo">UNDO LAST SHUFFLE</button><button type="button" class="dbn-bs-action dbn-bs-close">CLOSE</button><button type="button" class="dbn-bs-action primary dbn-bs-apply">APPLY SHUFFLE</button></div>
</div>`;
        modal.addEventListener("click", function (e) { if (e.target === modal) hideModal(); });
        modal.querySelector(".dbn-bs-close").addEventListener("click", hideModal);
        modal.querySelector(".dbn-bs-apply").addEventListener("click", applyPlan);
        modal.querySelector(".dbn-bs-undo").addEventListener("click", undo);
        document.body.appendChild(modal);
        return modal;
    }
    function status(message) {
        var modal = document.getElementById(C.modal);
        if (modal) modal.querySelector(".dbn-bs-status").textContent = message;
    }
    function showModal() {
        createModal().style.display = "flex";
        document.body.style.overflow = "hidden";
    }
    function hideModal() {
        var modal = document.getElementById(C.modal);
        if (modal) modal.style.display = "none";
        document.body.style.overflow = "";
    }
    function readUndo() {
        if (undoSnapshot) return undoSnapshot;
        try {
            var value = JSON.parse(getStore(C.undoPrefix + channelName()) || "null");
            if (value && Array.isArray(value.order)) undoSnapshot = value;
        } catch (e) {}
        return undoSnapshot;
    }
    function updateUndoButton() {
        var modal = document.getElementById(C.modal);
        if (!modal) return;
        modal.querySelector(".dbn-bs-undo").disabled = !readUndo() || applying;
    }
    function renderPlan(p) {
        var modal = createModal(), stats = modal.querySelector(".dbn-bs-stats");
        var list = modal.querySelector(".dbn-bs-list-wrap");
        var warning = modal.querySelector(".dbn-bs-warning");
        var apply = modal.querySelector(".dbn-bs-apply");
        stats.innerHTML = "";
        [
            [p.source.length,"UPCOMING VIDEOS"],
            [p.programs.length,"PROGRAMS"],
            [p.commercials.length,"COMMERCIALS DETECTED"],
            [p.order.length,"ITEMS IN NEW ORDER"]
        ].forEach(function (pair) {
            var box = document.createElement("div"), strong = document.createElement("strong");
            box.className = "dbn-bs-stat"; strong.textContent = pair[0];
            box.appendChild(strong); box.appendChild(document.createTextNode(pair[1])); stats.appendChild(box);
        });
        warning.style.display = p.warning ? "block" : "none";
        warning.textContent = p.warning || "";
        list.innerHTML = "";
        var intro = document.createElement("div");
        intro.style.cssText = "padding:4px 2px 9px;color:#c9aaaa;font-size:11px";
        intro.textContent = "Preview order. Change any classification to override automatic detection for this channel.";
        list.appendChild(intro);
        p.order.forEach(function (item, index) {
            var row = document.createElement("div");
            row.className = "dbn-bs-row";
            var num = document.createElement("div"); num.className = "dbn-bs-index";
            num.textContent = (index + 1) + "."; row.appendChild(num);
            var title = document.createElement("div"); title.className = "dbn-bs-name";
            title.textContent = item.title; title.title = item.title; row.appendChild(title);
            var duration = document.createElement("div"); duration.className = "dbn-bs-duration";
            duration.textContent = timeText(item.duration); row.appendChild(duration);
            var select = document.createElement("select"); select.className = "dbn-bs-kind";
            [["auto","AUTO DETECT"],["program","PROGRAM"],["commercial","COMMERCIAL"]].forEach(function (o) {
                var option = document.createElement("option"); option.value = o[0];
                option.textContent = o[1]; select.appendChild(option);
            });
            var saved = overrides(); select.value = saved[mediaKey(item)] || "auto";
            select.addEventListener("change", function () {
                saveOverride(item, select.value);
                try {
                    plan = makePlan(upcomingSnapshot());
                    renderPlan(plan);
                    status("Classification saved for this channel • preview recalculated");
                } catch (e) { status(e.message); }
            });
            row.appendChild(select); list.appendChild(row);
        });
        apply.disabled = applying || !allowed() || p.order.length < 2 || p.programs.length < 2;
        updateUndoButton();
        status("Preview ready • nothing has been changed");
    }
    function openPreview() {
        if (!allowed()) {
            alert("This private tool is available only to channel administrators with playlist-move permission.");
            return;
        }
        try {
            var snapshot = upcomingSnapshot();
            if (!snapshot.upcoming.length) {
                alert("There are no upcoming videos to shuffle. The currently playing video was left untouched.");
                return;
            }
            plan = makePlan(snapshot);
            renderPlan(plan);
            showModal();
        } catch (e) { alert(e.message || "Unable to analyze the playlist."); }
    }
    function fullQueueOrder() {
        return queueEntries().map(function (item) { return item.uid; });
    }
    function immediatelyAfter(from, after) {
        var order = fullQueueOrder(), a = order.indexOf(String(from)), b = order.indexOf(String(after));
        return a >= 0 && b >= 0 && a === b + 1;
    }
    function waitForMove(from, after, expectedCurrent) {
        return new Promise(function (resolve) {
            var start = Date.now();
            var timer = window.setInterval(function () {
                if (currentUid() !== String(expectedCurrent)) {
                    clearInterval(timer); resolve(false); return;
                }
                if (immediatelyAfter(from, after)) {
                    clearInterval(timer); resolve(true); return;
                }
                if (Date.now() - start > C.moveTimeout) {
                    clearInterval(timer); resolve(false);
                }
            }, 100);
        });
    }
    async function applyOrder(targetUids, expectedCurrent) {
        if (!allowed()) throw new Error("Administrator playlist permission is no longer available.");
        if (currentUid() !== String(expectedCurrent)) throw new Error("The current video changed. No further moves were made.");
        var snapshot = upcomingSnapshot();
        var existing = snapshot.upcoming.map(function (item) { return item.uid; });
        var desired = targetUids.map(String).filter(function (uid) { return existing.indexOf(uid) !== -1; });
        existing.forEach(function (uid) { if (desired.indexOf(uid) === -1) desired.push(uid); });
        var anchor = String(expectedCurrent);
        for (var i = 0; i < desired.length; i++) {
            if (!allowed()) throw new Error("Playlist-move permission was lost. The operation was stopped.");
            if (currentUid() !== String(expectedCurrent)) throw new Error("Playback advanced during the shuffle. Remaining moves were stopped.");
            var uid = desired[i];
            if (!immediatelyAfter(uid, anchor)) {
                window.socket.emit("moveMedia", { from: uid, after: anchor });
                var confirmed = await waitForMove(uid, anchor, expectedCurrent);
                if (!confirmed) throw new Error("CyTube did not confirm moving playlist item " + uid + ". The operation was stopped; inspect the queue before retrying.");
            }
            anchor = uid;
        }
    }
    async function applyPlan() {
        if (applying || !plan) return;
        if (!allowed()) { alert("Administrator playlist permission is required."); return; }
        var fresh;
        try { fresh = upcomingSnapshot(); } catch (e) { alert(e.message); return; }
        if (fresh.currentUid !== String(plan.currentUid)) {
            alert("The currently playing video changed after the preview. Generate a new preview before applying.");
            return;
        }
        if (plan.programs.length < 2) {
            alert("At least two programs are required to create commercial breaks. No changes were made.");
            return;
        }
        var original = fresh.upcoming.map(function (item) { return item.uid; });
        undoSnapshot = { channel: channelName(), currentUid: fresh.currentUid, order: original, savedAt: Date.now() };
        setStore(C.undoPrefix + channelName(), JSON.stringify(undoSnapshot));
        applying = true;
        var modal = createModal();
        modal.querySelector(".dbn-bs-apply").disabled = true;
        modal.querySelector(".dbn-bs-undo").disabled = true;
        modal.querySelector(".dbn-bs-close").disabled = true;
        status("Applying broadcast order...");
        try {
            await applyOrder(plan.order.map(function (item) { return item.uid; }), fresh.currentUid);
            status("Shuffle applied successfully.");
            alert("DBN Intelligent Broadcast Shuffle completed.\n\n" +
                plan.programs.length + " programs and " + plan.commercials.length +
                " commercials processed.\nThe currently playing video was not moved.");
        } catch (e) {
            status("Stopped: " + e.message);
            alert("DBN Broadcast Shuffle stopped.\n\n" + e.message +
                "\n\nThe queue may be partially rearranged. Use UNDO LAST SHUFFLE to restore its previous order.");
        } finally {
            applying = false;
            modal.querySelector(".dbn-bs-close").disabled = false;
            modal.querySelector(".dbn-bs-apply").disabled = !plan || plan.programs.length < 2 || !allowed();
            updateUndoButton();
        }
    }
    async function undo() {
        if (applying) return;
        var saved = readUndo();
        if (!saved || !Array.isArray(saved.order)) {
            alert("There is no saved DBN shuffle order to restore."); return;
        }
        if (!allowed()) { alert("Administrator playlist permission is required."); return; }
        if (currentUid() !== String(saved.currentUid)) {
            alert("The currently playing video has changed since the shuffle. Undo is disabled to protect playback.");
            return;
        }
        if (!confirm("Restore the queue order saved before the last DBN shuffle?\n\nThe currently playing video will remain untouched.")) return;
        applying = true; status("Restoring previous queue order...");
        try {
            await applyOrder(saved.order, saved.currentUid);
            removeStore(C.undoPrefix + channelName());
            undoSnapshot = null;
            status("Previous queue order restored.");
            alert("DBN Broadcast Shuffle: the previous queue order has been restored.");
        } catch (e) {
            status("Undo stopped: " + e.message);
            alert("Undo could not finish.\n\n" + e.message);
        } finally {
            applying = false; updateUndoButton();
        }
    }
    function addButton() {
        if (!allowed()) return false;
        if (document.getElementById(C.button)) return true;
        var native = document.getElementById("shuffleplaylist");
        var target = native && native.parentElement
            ? native.parentElement : document.getElementById("playlistcontrols");
        if (!target) return false;
        addStyles();
        var button = document.createElement("button");
        button.type = "button"; button.id = C.button;
        button.textContent = "DBN TV SHUFFLE";
        button.title = "Open the private DBN Intelligent Broadcast Shuffle";
        button.addEventListener("click", openPreview);
        if (native && native.parentElement === target) native.insertAdjacentElement("afterend", button);
        else target.appendChild(button);
        return true;
    }
    function initialize() {
        var attempts = 0;
        var retry = setInterval(function () {
            attempts++;
            if (addButton() || attempts >= 120) clearInterval(retry);
        }, 500);
        addButton();
        if (window.MutationObserver && document.body) {
            var observer = new MutationObserver(function () {
                if (allowed() && !document.getElementById(C.button)) addButton();
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
        readUndo();
        console.log("[DBN Broadcast Shuffle V1] Administrator-only module initialized.");
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize, { once: true });
    } else {
        initialize();
    }
})();