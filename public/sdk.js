(function () {
  var currentScript = document.currentScript;
  var siteId = currentScript && currentScript.getAttribute("data-site");
  var base = currentScript ? new URL(currentScript.src).origin : window.location.origin;

  function escapeHtml(value) {
    return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

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
      var format = ["text", "image", "mixed", "custom"].indexOf(ad.format) >= 0 ? ad.format : "mixed";
      var waitSeconds = Math.max(0, Math.min(30, Number(ad.waitSeconds == null ? 3 : ad.waitSeconds)));
      var overlay = document.createElement("div");
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:radial-gradient(circle at top,rgba(50,55,70,.45),rgba(7,9,13,.94) 55%);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;animation:madsFade .2s ease;";

      var style = document.createElement("style");
      style.textContent = "@keyframes madsFade{from{opacity:0}to{opacity:1}}@keyframes madsPop{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}";
      overlay.appendChild(style);

      var card = document.createElement("div");
      card.style.cssText = "width:min(94vw,620px);overflow:hidden;background:linear-gradient(180deg,#ffffff,#f8fafc);color:#0f172a;border:1px solid rgba(255,255,255,.7);border-radius:28px;box-shadow:0 30px 100px rgba(0,0,0,.45);animation:madsPop .24s ease;text-align:left;";

      var badge = '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px"><span style="display:inline-flex;align-items:center;gap:7px;padding:6px 10px;border-radius:999px;background:#eef2ff;color:#3730a3;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase">M Ads · Advertisement</span><span style="font-size:12px;color:#94a3b8">All-ages ad</span></div>';
      var cta = '<a data-mads-cta target="_blank" rel="noopener noreferrer" href="' + escapeHtml(ad.destinationUrl) + '" style="display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 20px;border-radius:14px;background:#0f172a;color:#fff;text-decoration:none;font-weight:800;box-shadow:0 8px 20px rgba(15,23,42,.18)">' + escapeHtml(ad.buttonLabel || "Learn more") + '</a>';
      var continueLabel = waitSeconds > 0 ? 'Continue in <span data-mads-count>' + waitSeconds + '</span>' : 'Continue';
      var continueButton = '<button data-mads-continue type="button" ' + (waitSeconds > 0 ? 'disabled' : '') + ' style="min-height:46px;border:1px solid #e2e8f0;border-radius:14px;background:#fff;padding:0 17px;font:inherit;font-weight:700;color:' + (waitSeconds > 0 ? '#94a3b8' : '#0f172a') + ';cursor:' + (waitSeconds > 0 ? 'default' : 'pointer') + '">' + continueLabel + '</button>';
      var actions = '<div style="display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap">' + cta + continueButton + '</div>';

      if (format === "text") {
        card.innerHTML = '<div style="padding:30px">' + badge + '<div style="padding:20px 0 24px"><h2 style="font-size:34px;line-height:1.05;margin:0 0 12px;letter-spacing:-.03em">' + escapeHtml(ad.headline) + '</h2>' + (ad.description ? '<p style="font-size:16px;line-height:1.65;margin:0;color:#64748b">' + escapeHtml(ad.description) + '</p>' : '') + '</div>' + actions + '</div>';
      } else if (format === "image") {
        card.innerHTML = '<div style="padding:18px 18px 0">' + badge + '</div><div style="padding:0 18px"><img src="' + escapeHtml(ad.imageUrl) + '" alt="Advertisement" style="display:block;width:100%;max-height:390px;object-fit:cover;border-radius:20px;background:#e5e7eb"></div><div style="padding:18px">' + actions + '</div>';
      } else if (format === "custom") {
        card.innerHTML = '<div style="padding:18px 18px 0">' + badge + '</div><div style="padding:0 18px"><iframe data-mads-custom title="Advertisement" sandbox="allow-scripts allow-forms allow-popups" referrerpolicy="no-referrer" style="display:block;width:100%;height:min(58vh,440px);border:1px solid #e2e8f0;border-radius:20px;background:#fff"></iframe></div><div style="padding:18px;display:flex;justify-content:flex-end">' + continueButton + '</div>';
      } else {
        card.innerHTML = '<div style="position:relative;background:#e5e7eb"><img src="' + escapeHtml(ad.imageUrl) + '" alt="Advertisement" style="display:block;width:100%;height:260px;object-fit:cover"><div style="position:absolute;inset:auto 0 0 0;height:90px;background:linear-gradient(transparent,rgba(0,0,0,.18))"></div></div><div style="padding:24px 24px 22px">' + badge + '<h2 style="font-size:30px;line-height:1.08;margin:0 0 10px;letter-spacing:-.02em">' + escapeHtml(ad.headline) + '</h2>' + (ad.description ? '<p style="font-size:15px;line-height:1.6;margin:0 0 22px;color:#64748b">' + escapeHtml(ad.description) + '</p>' : '<div style="height:10px"></div>') + actions + '</div>';
      }

      overlay.appendChild(card);
      document.body.appendChild(overlay);
      postEvent("impression", ad.id, placement);

      if (format === "custom") {
        var frame = card.querySelector("[data-mads-custom]");
        if (frame) frame.srcdoc = String(ad.customHtml || "");
      }

      var link = card.querySelector("[data-mads-cta]");
      if (link) link.addEventListener("click", function () { postEvent("click", ad.id, placement); });

      var button = card.querySelector("[data-mads-continue]");
      function enableContinue() {
        if (!button) return;
        button.disabled = false;
        button.style.cursor = "pointer";
        button.style.color = "#0f172a";
        button.style.background = "#f8fafc";
        button.innerHTML = "Continue";
      }
      function complete() {
        overlay.remove();
        resolve({ shown: true, adId: ad.id });
      }
      if (button) button.addEventListener("click", function () { if (!button.disabled) complete(); });

      if (waitSeconds <= 0) {
        enableContinue();
      } else {
        var count = waitSeconds;
        var counter = card.querySelector("[data-mads-count]");
        var timer = setInterval(function () {
          count -= 1;
          if (counter) counter.textContent = String(Math.max(count, 0));
          if (count <= 0) { clearInterval(timer); enableContinue(); }
        }, 1000);
      }
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

  window.MAds = { show: show, version: "0.4.0" };
})();
