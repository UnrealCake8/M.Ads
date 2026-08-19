(function () {
  var currentScript = document.currentScript;
  var siteId = currentScript && currentScript.getAttribute("data-site");
  var base = currentScript ? new URL(currentScript.src).origin : window.location.origin;

  function postEvent(type, adId, placement) {
    try {
      fetch(base + "/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: type, siteId: siteId, adId: adId, placement: placement || null }),
        keepalive: true
      });
    } catch (_) {}
  }

  function renderAd(ad, placement) {
    return new Promise(function (resolve) {
      var overlay = document.createElement("div");
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:rgba(10,12,16,.82);display:flex;align-items:center;justify-content:center;padding:20px;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;";

      var card = document.createElement("div");
      card.style.cssText = "width:min(92vw,520px);background:#fff;color:#111;border-radius:22px;padding:24px;box-shadow:0 24px 80px rgba(0,0,0,.35);text-align:left;";

      var image = ad.imageUrl ? '<img src="' + ad.imageUrl.replace(/\"/g, "&quot;") + '" alt="" style="width:100%;max-height:260px;object-fit:cover;border-radius:16px;margin-bottom:18px">' : "";
      card.innerHTML = '<div style="font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.55;margin-bottom:10px">Advertisement</div>' + image + '<h2 style="font-size:26px;line-height:1.1;margin:0 0 10px">' + ad.headline + '</h2><p style="font-size:15px;line-height:1.5;margin:0 0 22px;color:#4b5563">' + ad.description + '</p><div style="display:flex;gap:10px;align-items:center;justify-content:space-between"><a target="_blank" rel="noopener noreferrer" href="' + ad.destinationUrl + '" style="display:inline-flex;align-items:center;justify-content:center;padding:11px 16px;border-radius:999px;background:#111;color:#fff;text-decoration:none;font-weight:700">' + ad.buttonLabel + '</a><button type="button" disabled style="border:0;background:transparent;font:inherit;color:#6b7280;cursor:default">Continue in <span data-mads-count>3</span></button></div>';

      overlay.appendChild(card);
      document.body.appendChild(overlay);
      postEvent("impression", ad.id, placement);

      var link = card.querySelector("a");
      if (link) link.addEventListener("click", function () { postEvent("click", ad.id, placement); });

      var count = 3;
      var counter = card.querySelector("[data-mads-count]");
      var timer = setInterval(function () {
        count -= 1;
        if (counter) counter.textContent = String(Math.max(count, 0));
        if (count <= 0) {
          clearInterval(timer);
          var button = card.querySelector("button");
          if (button) {
            button.disabled = false;
            button.style.cursor = "pointer";
            button.style.color = "#111";
            button.innerHTML = "Continue";
            button.addEventListener("click", function () {
              overlay.remove();
              resolve({ shown: true, adId: ad.id });
            }, { once: true });
          }
        }
      }, 1000);
    });
  }

  async function show(options) {
    options = options || {};
    if (!siteId) return { shown: false, reason: "missing_site_id" };
    try {
      var placement = typeof options === "string" ? options : options.placement;
      var url = base + "/api/ad?site=" + encodeURIComponent(siteId);
      if (placement) url += "&placement=" + encodeURIComponent(placement);
      var response = await fetch(url, { cache: "no-store" });
      if (!response.ok || response.status === 204) return { shown: false };
      var payload = await response.json();
      if (!payload || !payload.ad) return { shown: false };
      return await renderAd(payload.ad, placement);
    } catch (_) {
      return { shown: false, reason: "unavailable" };
    }
  }

  window.MAds = { show: show, version: "0.1.0" };
})();
