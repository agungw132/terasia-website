/* Tera — asisten AI ter.asia. Widget chat melayang + POST /api/tera/chat. */
(function () {
  "use strict";

  var API = "/api/tera/chat";
  var history = [];
  var busy = false;

  var fab = document.createElement("button");
  fab.className = "tera-fab";
  fab.setAttribute("aria-label", "Buka Tera, asisten AI Terasia");
  fab.textContent = "T";

  var panel = document.createElement("div");
  panel.className = "tera-panel";
  panel.innerHTML =
    '<div class="tera-head">' +
    '<div class="tera-avatar">T</div>' +
    '<div><div class="tera-head-name">Tera</div>' +
    '<div class="tera-head-sub">Asisten AI Terasia</div></div>' +
    '<button class="tera-close" aria-label="Tutup">×</button>' +
    "</div>" +
    '<div class="tera-msgs"></div>' +
    '<form class="tera-form">' +
    '<input class="tera-input" type="text" placeholder="Tanya tentang Terasia…" maxlength="2000" autocomplete="off">' +
    '<button class="tera-send" type="submit">Kirim</button>' +
    "</form>";

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  var msgs = panel.querySelector(".tera-msgs");
  var input = panel.querySelector(".tera-input");
  var form = panel.querySelector(".tera-form");
  var send = panel.querySelector(".tera-send");

  function addMsg(cls, text) {
    var el = document.createElement("div");
    el.className = "tera-msg " + cls;
    el.textContent = text;
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    return el;
  }

  function open() {
    panel.classList.add("open");
    if (!msgs.children.length) {
      addMsg("bot", "Halo! Saya Tera, asisten AI Terasia. Tanyakan apa saja tentang " +
        "platform kami — mulai dari cara menghubungkan perangkat sampai analitik data.");
    }
    input.focus();
  }

  function close() { panel.classList.remove("open"); }

  fab.addEventListener("click", function () {
    if (panel.classList.contains("open")) close(); else open();
  });
  panel.querySelector(".tera-close").addEventListener("click", close);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text || busy) return;
    busy = true;
    send.disabled = true;
    addMsg("user", text);
    input.value = "";
    var typing = addMsg("bot typing", "Tera sedang menulis…");

    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, history: history }),
      signal: AbortSignal.timeout(60000),
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        typing.remove();
        if (res.ok && res.j.reply) {
          addMsg("bot", res.j.reply);
          history.push({ role: "user", content: text });
          history.push({ role: "assistant", content: res.j.reply });
          if (history.length > 10) history = history.slice(-10);
        } else {
          addMsg("bot", "Maaf, saya sedang tidak dapat menjawab. Coba lagi sebentar lagi.");
        }
      })
      .catch(function () {
        typing.remove();
        addMsg("bot", "Koneksi terputus. Periksa jaringan Anda dan coba lagi.");
      })
      .finally(function () {
        busy = false;
        send.disabled = false;
        input.focus();
      });
  });
})();
