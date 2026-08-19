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
      overlay.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:radial-gradient(circle at top,rgba(50,55,70,.45),rgba(7,9,13,.94) 55%);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;animation:madsFade .2s ease;";

      var style = document.createElement("style");
      style.textContent = "@keyframes madsFade{from{opacity:0}to{opacity:1}}@keyframes madsPop{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}";
      overlay.appendChild(style);

      var card = document.createElement("div");
      card.style.cssText = "width:min(94vw,560px);overflow:hidden;background:linear-gradient(180deg,#ffffff,#f8fafc);color:#0f172a;border:1px solid rgba(255,255,255,.7);border-radius:28px;box-shadow:0 30px 100px rgba(0,0,0,.45);animation:madsPop .24s ease;text-align:left;";

      var image = ad.imageUrl ? '<div style="position:relative;background:#e5e7eb"><img src="' + ad.imageUrl.replace(/\"/g, "&quot;") + '" alt="" style="display:block;width:100%;height:260px;object-fit:cover"><div style="position:absolute;inset:auto 0 0 0;height:90px;background:linear-gradient(transparent,rgba(0,0,0,.18))"></div></div>' : '';
      card.innerHTML = image + '<div style="padding:24px 24px 22px"><div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px"><span style="display:inline-flex;align-items:center;gap:7px;padding:6px 10px;border-radius:999px;background:#eef2ff;color:#3730a3;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase">M Ads · Advertisement</span><span style="font-size:12px;color:#94a3b8">All-ages ad</span></div><h2 style="font-size:30px;line-height:1.08;margin:0 0 10px;letter-spacing:-.02em">' + ad.headline + '</h2><p style="font-size:15px;line-height:1.6;margin:0 0 22px;color:#64748b">' + ad.description + '</p><div style="display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap"><a target="_blank" rel="noopener noreferrer" href="' + ad.destinationUrl + '" style="display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 18px;border-radius:14px;background:#0f172a;color:#fff;text-decoration:none;font-weight:800;box-shadow:0 8px 20px rgba(15,23,42,.18)">' + ad.buttonLabel + '</a><button type="button" disabled style="min-height:44px;border:1px solid #e2e8f0;border-radius:14px;background:#fff;padding:0 16px;font:inherit;font-weight:700;color:#94a3b8;cursor:default">Continue in <span data-mads-count>3</span></button></div></div>';

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
            button.style.color = "#0f172a";
            button.style.background = "#f8fafc";
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

  window.MAds = { show: show, version: "0.2.0" };
})();
