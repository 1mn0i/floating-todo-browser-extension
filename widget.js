
  (function () {
    "use strict";

    if (window.__FT_MOUNTED__) {
      if (window.__FT_API__ && window.__FT_API__.open) { window.__FT_API__.open(); }
      return;
    }

    var KEY = "ft_todos_v1";
    var UI_KEY = "ft_ui_v1";
    var root, list, input, countBadge, clearBtn, emptyEl, footerText, chevBtn, form;
    var items = [];
    var ui = { collapsed: false, x: null, y: null };
    var positioned = false;
    var storageWarning, storageError = false, editingId = null;
    var writeQueue = Promise.resolve();

    function storageGet(key, fallback) {
      try {
        var raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return fallback;
      }
    }
    function showStorageError(failed) {
      storageError = failed;
      if (storageWarning) {
        storageWarning.hidden = !failed;
        storageWarning.textContent = failed ? "保存失败：修改仅暂存在当前页面，请勿刷新。" : "";
      }
    }
    function storageSet(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        showStorageError(true);
        return false;
      }
    }
    function validItems(value) {
      if (!Array.isArray(value)) { return []; }
      var seen = new Set();
      return value.filter(function (item) {
        if (!item || typeof item.id !== "string" || !item.id || seen.has(item.id) ||
            typeof item.text !== "string" || !item.text.trim()) { return false; }
        seen.add(item.id);
        return true;
      }).map(function (item) {
        return { id: item.id, text: item.text.trim().slice(0, 120),
          done: item.done === true, createdAt: Number.isFinite(item.createdAt) ? item.createdAt : 0 };
      });
    }
    function uid() {
      return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    }

    items = validItems(storageGet(KEY, []));
    var storedUi = storageGet(UI_KEY, null);
    if (storedUi && typeof storedUi === "object") {
      ui.collapsed = storedUi.collapsed === true;
      if (Number.isFinite(storedUi.x) && Number.isFinite(storedUi.y)) {
        ui.x = storedUi.x;
        ui.y = storedUi.y;
      }
    }

    var CHECK_ICON = '<svg class="ft-icon ft-check-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>';
    var TRASH_ICON = '<svg class="ft-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>';
    var PLUS_ICON = '<svg class="ft-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
    var CHEV_ICON = '<svg class="ft-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
    var GRIP_ICON = '<svg class="ft-icon ft-grip-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01"/></svg>';

    var css = [
      ":where(#__ft-root),:where(#__ft-root) *{box-sizing:border-box}",
      "#__ft-root{pointer-events:auto;position:fixed;z-index:2147483000;font-family:'Segoe UI','Microsoft YaHei','PingFang SC',sans-serif;opacity:0;transition:opacity .18s ease;color:#33291f}",
      "#__ft-root.ft-ready{opacity:1}",
      ":where(#__ft-root) button{font:inherit;background:none;border:0;color:inherit;cursor:pointer;padding:0}",
      ":where(#__ft-root) input{margin:0;padding:0;border:0;background:none;color:inherit;font:inherit}",
      ":where(#__ft-root) ul{margin:0;padding:0;list-style:none}",
      ":where(#__ft-root) form{margin:0}",
      "#__ft-root button:focus-visible{outline:2px solid #0e7c72;outline-offset:2px}",
      ".ft-card{width:300px;max-width:calc(100vw - 16px);border:1px solid rgba(120,92,52,.20);border-radius:16px;overflow:hidden;background:linear-gradient(160deg,#fffdf7 0%,#fff7e6 100%);box-shadow:0 12px 30px rgba(60,42,20,.20),0 2px 8px rgba(60,42,20,.10);font-size:14px;line-height:1.45;user-select:none;-webkit-user-select:none;transition:box-shadow .2s ease}",
      ".ft-card:hover{box-shadow:0 16px 38px rgba(60,42,20,.24),0 3px 10px rgba(60,42,20,.12)}",
      "#__ft-root.ft-ready .ft-card{animation:ft-in .28s cubic-bezier(.2,.8,.2,1)}",
      "@keyframes ft-in{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}",
      ".ft-header{display:flex;align-items:center;gap:9px;padding:10px 12px;cursor:grab;touch-action:none;background:linear-gradient(90deg,rgba(14,124,114,.08),rgba(232,155,43,.07))}",
      ".ft-header:active{cursor:grabbing}",
      "#__ft-root.ft-dragging .ft-header{cursor:grabbing}",
      ".ft-grip{display:grid;place-items:center;color:rgba(59,47,34,.38)}",
      ".ft-title{display:flex;align-items:center;gap:7px;flex:1;min-width:0}",
      ".ft-dot{width:9px;height:9px;border-radius:50%;background:#e89b2b;box-shadow:0 0 0 4px rgba(232,155,43,.16);flex:none}",
      ".ft-title-text{font-size:14px;font-weight:800;letter-spacing:.01em;white-space:nowrap}",
      ".ft-count{display:inline-grid;place-items:center;min-width:20px;height:20px;padding:0 6px;border-radius:999px;background:#0e7c72;color:#fff;font-size:12px;font-weight:700}",
      ".ft-chev{display:grid;place-items:center;width:28px;height:28px;border-radius:9px;color:rgba(59,47,34,.55)}",
      ".ft-chev:hover{background:rgba(120,92,52,.08);color:#33291f}",
      ".ft-chev svg{transition:transform .22s ease}",
      "#__ft-root:not(.ft-collapsed) .ft-chev svg{transform:rotate(180deg)}",
      ".ft-body{padding:12px}",
      ".ft-form{display:flex;gap:8px;margin-bottom:10px}",
      ".ft-input{flex:1;min-width:0;height:38px;padding:0 12px;border:1px solid rgba(120,92,52,.24);border-radius:10px;background:#fff;color:#33291f;font-size:14px;outline:none;user-select:text;-webkit-user-select:text}",
      ".ft-input::placeholder{color:#b3a48c}",
      ".ft-input:focus{border-color:#0e7c72;box-shadow:0 0 0 3px rgba(14,124,114,.14)}",
      ".ft-add{display:grid;place-items:center;width:38px;height:38px;border-radius:10px;background:#0e7c72;color:#fff;flex:none;transition:background .15s ease}",
      ".ft-add:hover{background:#0a5f58}",
      ".ft-icon{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;display:block}",
      ".ft-list-wrap{max-height:216px;overflow:auto;margin:0 -4px}",
      ".ft-list-wrap::-webkit-scrollbar{width:8px}",
      ".ft-list-wrap::-webkit-scrollbar-thumb{background:rgba(120,92,52,.18);border-radius:8px}",
      ".ft-list{list-style:none}",
      ".ft-item{display:flex;align-items:center;gap:10px;padding:7px 8px;border-radius:10px}",
      ".ft-item:hover{background:rgba(120,92,52,.06)}",
      ".ft-check{display:grid;place-items:center;width:20px;height:20px;border:2px solid rgba(120,92,52,.38);border-radius:7px;background:#fff;flex:none;color:#fff;transition:background .15s ease,border-color .15s ease}",
      ".ft-check:hover{border-color:#0e7c72}",
      ".ft-check .ft-check-ico{opacity:0;transform:scale(.5);transition:opacity .15s ease,transform .15s ease}",
      ".ft-item.done .ft-check{background:#0e7c72;border-color:#0e7c72}",
      ".ft-item.done .ft-check .ft-check-ico{opacity:1;transform:scale(1)}",
      ".ft-text{flex:1;min-width:0;min-height:20px;padding:2px 0;word-break:break-word;user-select:text;-webkit-user-select:text;cursor:text}",
      ".ft-text:hover{color:#0e7c72}",
      ".ft-text-edit{flex:1;min-width:0;height:30px;padding:4px 8px;border:1px solid #0e7c72;border-radius:8px;background:#fff;color:#33291f;font:inherit;line-height:1.35;outline:none;user-select:text;-webkit-user-select:text;box-shadow:0 0 0 3px rgba(14,124,114,.12)}",
      ".ft-item.ft-editing{background:rgba(14,124,114,.06)}",
      ".ft-item.done .ft-text{color:#a18f75;text-decoration:line-through}",
      ".ft-del{display:grid;place-items:center;width:26px;height:26px;border-radius:8px;color:#c2574a;opacity:0;transition:opacity .15s ease,background .15s ease}",
      ".ft-item:hover .ft-del{opacity:1}",
      ".ft-del:hover{background:rgba(194,87,74,.12)}",
      ".ft-empty{padding:18px 8px;text-align:center;color:#a18f75;font-size:13px;display:none}",
      ".ft-footer{display:flex;align-items:center;justify-content:space-between;margin-top:8px;padding-top:10px;border-top:1px solid rgba(120,92,52,.12)}",
      ".ft-summary{font-size:12.5px;color:#8a7a63}",
      ".ft-clear{font-size:12.5px;color:#0e7c72;font-weight:600;padding:4px 6px;border-radius:7px;display:none}",
      ".ft-clear:hover{background:rgba(14,124,114,.08)}",
      "#__ft-root.ft-collapsed .ft-card{width:auto;border-radius:999px}",
      "#__ft-root.ft-collapsed .ft-body{display:none}",
      "#__ft-root.ft-collapsed .ft-header{padding:7px 9px 7px 13px;gap:7px}",
      "#__ft-root.ft-collapsed .ft-grip{display:none}",
      "#__ft-root.ft-collapsed .ft-title-text{font-size:13px}",
      "@media (max-width:480px){.ft-card{width:min(300px,calc(100vw - 16px))}}"
    ].join("\n");

    var style = document.createElement("style");
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);

    root = document.createElement("div");
    root.id = "__ft-root";
    root.setAttribute("role", "region");
    root.setAttribute("aria-label", "悬浮待办");
    root.innerHTML =
      '<div class="ft-card">' +
        '<div class="ft-header">' +
          '<button class="ft-grip" type="button" aria-label="拖动">' + GRIP_ICON + '</button>' +
          '<div class="ft-title"><span class="ft-dot"></span><span class="ft-title-text">待办</span><span class="ft-count">0</span></div>' +
          '<button class="ft-chev" type="button" aria-label="折叠">' + CHEV_ICON + '</button>' +
        '</div>' +
        '<div class="ft-body">' +
          '<form class="ft-form">' +
            '<input class="ft-input" type="text" maxlength="120" placeholder="写下一个待办，回车添加">' +
            '<button class="ft-add" type="submit" aria-label="添加">' + PLUS_ICON + '</button>' +
          '</form>' +
          '<div class="ft-list-wrap"><ul class="ft-list"></ul><div class="ft-empty">暂无待办，先记一件小事吧</div></div>' +
          '<div class="ft-storage-warning" role="status" hidden></div>' +
          '<div class="ft-footer"><span class="ft-summary"></span><button class="ft-clear" type="button">清除已完成</button></div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(root);

    list = root.querySelector(".ft-list");
    input = root.querySelector(".ft-input");
    countBadge = root.querySelector(".ft-count");
    clearBtn = root.querySelector(".ft-clear");
    emptyEl = root.querySelector(".ft-empty");
    footerText = root.querySelector(".ft-summary");
    chevBtn = root.querySelector(".ft-chev");
    form = root.querySelector(".ft-form");
    var header = root.querySelector(".ft-card");
    storageWarning = root.querySelector(".ft-storage-warning");
    showStorageError(storageError);

    // Replay operations against the newest snapshot, rather than saving a stale tab's array.
    // Web Locks serialize cooperating tabs where available.
    var pendingChanges = [];
    function changeItems(change) {
      writeQueue = writeQueue.then(function () {
        function commit() {
          pendingChanges.push(change);
          var latest = validItems(storageGet(KEY, items));
          pendingChanges.forEach(function (apply) { latest = apply(latest); });
          items = latest;
          if (storageSet(KEY, items)) {
            pendingChanges = [];
            showStorageError(false);
          }
          render();
        }
        if (navigator.locks && navigator.locks.request) {
          return navigator.locks.request("ft_todos_v1_write", commit);
        }
        commit();
      }).catch(function () { showStorageError(true); });
      return writeQueue;
    }
    window.addEventListener("storage", function (e) {
      if (e.key === UI_KEY || e.key === null) {
        var latestUi = storageGet(UI_KEY, null);
        if (latestUi && typeof latestUi.collapsed === "boolean" && latestUi.collapsed !== root.classList.contains("ft-collapsed")) {
          root.classList.toggle("ft-collapsed", latestUi.collapsed);
          chevBtn.setAttribute("aria-label", latestUi.collapsed ? "展开" : "折叠");
        }
      }
      if (e.key !== KEY && e.key !== null) { return; }
      items = validItems(storageGet(KEY, []));
      pendingChanges.forEach(function (apply) { items = apply(items); });
      render();
    });
    function saveUi() { storageSet(UI_KEY, ui); }

    function render() {
      // Keep existing nodes: blur must not remove the button receiving the next click.
      var nodes = new Map();
      Array.from(list.children).forEach(function (li) { nodes.set(li.dataset.id, li); });
      var pending = 0;
      var done = 0;
      items.forEach(function (item) {
        if (item.done) { done++; } else { pending++; }

        var existing = nodes.get(item.id);
        if (existing) {
          nodes.delete(item.id);
          existing.classList.toggle("done", item.done);
          existing.querySelector(".ft-check").setAttribute("aria-label", item.done ? "标记未完成" : "标记完成");
          var label = existing.querySelector(".ft-text");
          if (label) {
            label.textContent = item.text;
            label.setAttribute("aria-label", "编辑待办：" + item.text);
          }
          return;
        }
        var li = document.createElement("li");
        li.dataset.id = item.id;
        li.className = "ft-item" + (item.done ? " done" : "");

        var check = document.createElement("button");
        check.type = "button";
        check.className = "ft-check";
        check.setAttribute("aria-label", item.done ? "标记未完成" : "标记完成");
        check.innerHTML = CHECK_ICON;
        check.addEventListener("click", function () { toggleDone(item.id); });

        var text = document.createElement("span");
        text.className = "ft-text";
        text.textContent = item.text;
        text.setAttribute("role", "button");
        text.setAttribute("tabindex", "0");
        text.setAttribute("aria-label", "编辑待办：" + item.text);
        text.addEventListener("click", function () { beginEdit(items.find(function (entry) { return entry.id === item.id; }), li, text); });
        text.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            beginEdit(items.find(function (entry) { return entry.id === item.id; }), li, text);
          }
        });

        var del = document.createElement("button");
        del.type = "button";
        del.className = "ft-del";
        del.setAttribute("aria-label", "删除");
        del.innerHTML = TRASH_ICON;
        del.addEventListener("click", function () { removeItem(item.id); });

        li.appendChild(check);
        li.appendChild(text);
        li.appendChild(del);
        list.appendChild(li);
      });

      nodes.forEach(function (li) { li.remove(); });
      countBadge.textContent = String(pending);
      footerText.textContent = pending ? (pending + " 项待完成") : "全部完成啦";
      emptyEl.style.display = items.length ? "none" : "block";
      clearBtn.style.display = done ? "inline-flex" : "none";
      if (positioned && !drag) { clampToViewport(); }
    }

    function beginEdit(item, li, textEl) {
      if (!item || !textEl || !textEl.parentNode || li.querySelector(".ft-text-edit")) { return; }

      var edit = document.createElement("input");
      edit.type = "text";
      edit.className = "ft-text-edit";
      edit.maxLength = 120;
      edit.value = item.text;
      edit.setAttribute("aria-label", "编辑待办");
      li.classList.add("ft-editing");
      editingId = item.id;

      var finished = false;
      function finish(commit) {
        if (finished) { return; }
        finished = true;
        editingId = null;
        li.classList.remove("ft-editing");
        if (edit.parentNode === li) { li.replaceChild(textEl, edit); }
        if (!commit) {
          render();
          return;
        }

        var value = edit.value.trim();
        if (!value) {
          removeItem(item.id);
          return;
        }
        changeItems(function (latest) {
          return latest.map(function (entry) {
            return entry.id === item.id ? Object.assign({}, entry, { text: value }) : entry;
          });
        });
      }

      var composing = false;
      edit.addEventListener("compositionstart", function () { composing = true; });
      edit.addEventListener("compositionend", function () { composing = false; });
      edit.addEventListener("keydown", function (e) {
        if (composing || e.isComposing || e.keyCode === 229) { return; }
        if (e.key === "Enter") {
          e.preventDefault();
          finish(true);
        } else if (e.key === "Escape") {
          e.preventDefault();
          finish(false);
        }
      });
      edit.addEventListener("blur", function () { finish(true); });

      li.replaceChild(edit, textEl);
      edit.focus();
      edit.select();
    }

    function addItem() {
      var value = input.value.trim();
      if (!value) { return; }
      var added = { id: uid(), text: value, done: false, createdAt: Date.now() };
      input.value = "";
      changeItems(function (latest) {
        return latest.some(function (entry) { return entry.id === added.id; }) ? latest : latest.concat([added]);
      });
      input.focus();
    }

    function toggleDone(id) {
      var current = items.find(function (item) { return item.id === id; });
      if (!current) { return; }
      var done = !current.done;
      changeItems(function (latest) {
        return latest.map(function (item) {
          return item.id === id ? Object.assign({}, item, { done: done }) : item;
        });
      });
    }

    function removeItem(id) {
      changeItems(function (latest) {
        return latest.filter(function (item) { return item.id !== id; });
      });
    }

    function clearCompleted() {
      var ids = new Set(items.filter(function (item) { return item.done; }).map(function (item) { return item.id; }));
      changeItems(function (latest) {
        return latest.filter(function (item) { return !(ids.has(item.id) && item.done); });
      });
    }

    function clampToViewport() {
      var r = root.getBoundingClientRect();
      var maxX = Math.max(0, window.innerWidth - r.width);
      var maxY = Math.max(0, window.innerHeight - r.height);
      var x = Math.min(Math.max(0, r.left), maxX);
      var y = Math.min(Math.max(0, r.top), maxY);
      root.style.left = x + "px";
      root.style.top = y + "px";
      root.style.right = "auto";
      root.style.bottom = "auto";
      ui.x = Math.round(x);
      ui.y = Math.round(y);
    }

    function initPosition() {
      if (ui.x !== null && ui.y !== null) {
        root.style.left = ui.x + "px";
        root.style.top = ui.y + "px";
        root.style.right = "auto";
        root.style.bottom = "auto";
        clampToViewport();
        positioned = true;
      } else {
        root.style.left = "auto";
        root.style.top = "auto";
        root.style.right = "16px";
        root.style.bottom = "16px";
        requestAnimationFrame(function () {
          var r = root.getBoundingClientRect();
          ui.x = Math.max(0, Math.round(window.innerWidth - r.width - 16));
          ui.y = Math.max(0, Math.round(window.innerHeight - r.height - 16));
          root.style.left = ui.x + "px";
          root.style.top = ui.y + "px";
          root.style.right = "auto";
          root.style.bottom = "auto";
          positioned = true;
          saveUi();
        });
      }
    }

    function toggleCollapse(force) {
      var collapsed = (typeof force === "boolean") ? force : !root.classList.contains("ft-collapsed");
      root.classList.toggle("ft-collapsed", collapsed);
      chevBtn.setAttribute("aria-label", collapsed ? "展开" : "折叠");
      ui.collapsed = collapsed;
      clampToViewport();
      saveUi();
      if (!collapsed) {
        requestAnimationFrame(function () { input.focus(); });
      }
    }

    var inputComposing = false;
    input.addEventListener("compositionstart", function () { inputComposing = true; });
    input.addEventListener("compositionend", function () { inputComposing = false; });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!inputComposing) { addItem(); }
    });
    chevBtn.addEventListener("click", function () { toggleCollapse(); });
    clearBtn.addEventListener("click", clearCompleted);
    input.addEventListener("keydown", function (e) {
      if (inputComposing || e.isComposing || e.keyCode === 229) { return; }
      if (e.key === "Escape") { toggleCollapse(true); input.blur(); }
    });

    var drag = null;
    header.addEventListener("pointerdown", function (e) {
      if (e.button !== 0) { return; }
      if (e.target.closest("button,input,.ft-text,.ft-text-edit,form")) { return; }
      if (drag) { return; }
      var rect = root.getBoundingClientRect();
      drag = { pointerId: e.pointerId, sx: e.clientX, sy: e.clientY, x: rect.left, y: rect.top };
      if (header.setPointerCapture) { header.setPointerCapture(e.pointerId); }
      root.classList.add("ft-dragging");
    });
    header.addEventListener("pointermove", function (e) {
      if (!drag || drag.pointerId !== e.pointerId) { return; }
      var r = root.getBoundingClientRect();
      var maxX = Math.max(0, window.innerWidth - r.width);
      var maxY = Math.max(0, window.innerHeight - r.height);
      var x = Math.min(Math.max(0, drag.x + (e.clientX - drag.sx)), maxX);
      var y = Math.min(Math.max(0, drag.y + (e.clientY - drag.sy)), maxY);
      root.style.left = x + "px";
      root.style.top = y + "px";
      root.style.right = "auto";
      root.style.bottom = "auto";
    });
    function endDrag() {
      if (!drag) { return; }
      drag = null;
      root.classList.remove("ft-dragging");
      var r = root.getBoundingClientRect();
      ui.x = Math.round(r.left);
      ui.y = Math.round(r.top);
      saveUi();
    }
    header.addEventListener("pointerup", endDrag);
    header.addEventListener("pointercancel", endDrag);
    header.addEventListener("lostpointercapture", endDrag);
    window.addEventListener("resize", function () {
      if (!positioned) { return; }
      endDrag();
      clampToViewport();
      saveUi();
    });

    render();
    if (ui.collapsed) { root.classList.add("ft-collapsed"); }
    chevBtn.setAttribute("aria-label", ui.collapsed ? "展开" : "折叠");
    initPosition();
    requestAnimationFrame(function () { root.classList.add("ft-ready"); });

    window.__FT_API__ = {
      open: function () { toggleCollapse(false); },
      collapse: function () { toggleCollapse(true); },
      getItems: function () { return items.map(function (item) { return Object.assign({}, item); }); }
    };
    window.__FT_MOUNTED__ = true;
  })();
  