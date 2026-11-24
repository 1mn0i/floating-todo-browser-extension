# Floating Todo — Politica de confidențialitate / Privacy Policy / 隐私政策

[Română (UE / GDPR)](#română) · [English](#english) · [中文](#中文)

**Data actualizării / Last updated / 更新日期：2026-11-23**

---

<a id="română"></a>
## Politica de confidențialitate (Română · Conformitate GDPR)

Floating Todo este o extensie de browser care afișează o listă plutitoare de sarcini sincronizată între filele aceluiași browser.

### 1. Date prelucrate
Extensia prelucrează exclusiv textul sarcinilor introduse voluntar de utilizator (inclusiv textul selectat și linkul/titlul paginii sursă salvate doar atunci când apeși explicit meniul contextual „Adaugă în Lista de sarcini”), starea acestora (finalizată/nefinalizată), domeniul/adresa asociată pentru sarcinile de tip „Site” sau „Pagină” și preferințele interfeței (tema luminoasă/întunecată, starea restrânsă, vizibilitatea și poziția pe ecran). Nu colectăm date cu caracter personal identificabile, adrese IP sau identificatori de urmărire.

### 2. Scop și stocare locală / sincronizare opțională
Datele sunt utilizate strict pentru afișarea listei de sarcini, păstrarea istoricului local al sarcinilor finalizate sau șterse, restaurarea preferințelor interfeței, actualizarea contorului de pe pictograma extensiei și sincronizarea între filele aceluiași profil de browser. Implicit, toate datele sunt stocate exclusiv local pe dispozitivul utilizatorului, în `chrome.storage.local`. Dacă activezi explicit opțiunea „Sincronizare dispozitive”, sarcinile active sunt sincronizate prin infrastructura nativă a browserului (`chrome.storage.sync`) asociată contului tău Chrome/Edge, fără a trece prin serverele dezvoltatorului sau ale vreunui terț. Istoricul arhivat, poziția și dimensiunea cardului rămân întotdeauna doar locale.

### 3. Transfer de date și terți
Versiunea curentă nu efectuează cereri de rețea, nu transmite date către dezvoltator sau servere terțe, nu conține reclame, servicii de analiză sau cod executat la distanță și nu vinde date. Interfața utilizează **Closed Shadow DOM** pentru a împiedica scripturile paginilor web vizitate să citească sarcinile tale.

### 4. Accesul la pagini web
Scriptul de conținut rulează exclusiv pentru a randa cardul plutitor al extensiei. Extensia nu citește conținutul paginilor web, istoricul de navigare, parolele, cookie-urile sau datele introduse în formularele site-urilor.

### 5. Păstrarea și ștergerea datelor (Drepturile GDPR)
Deoarece datele rămân exclusiv pe dispozitivul tău local, ai control total în orice moment: poți edita sau șterge sarcinile direct din interfață, poți șterge datele extensiei din setările browserului sau poți dezinstala extensia pentru a elimina complet toate datele stocate.

### 6. Contact și actualizări
Pentru întrebări privind confidențialitatea, ne poți contacta prin adresa de e-mail publicată în pagina dezvoltatorului din Chrome Web Store. Dacă în viitor vom introduce autentificare, plăți sau sincronizare în cloud, vom actualiza în prealabil această politică și informările din magazin.

---

<a id="english"></a>
## Privacy Policy (English)

Floating Todo is a browser extension that displays a shared floating todo card across tabs in the same browser profile.

### Data Processed
The extension only processes task text you actively enter (including selected text and the source page URL/title saved only when you explicitly click the "Add to Floating Todo" context menu), completion status, optional site/page scope keys for Site/Page-scoped tasks, and UI preferences (theme, collapsed state, visibility, and card position). No personal identifiers, analytics, or telemetry are collected.

### Purpose & Storage
This data is used solely to manage your tasks, keep a local archive of cleared or deleted task history, restore UI preferences, update the toolbar badge count, and sync across tabs in the same browser profile. By default, all data is stored strictly locally on your device via `chrome.storage.local`. If you explicitly opt in to "Cross-device sync", your active tasks are synced through your browser's native sync storage (`chrome.storage.sync`) tied to your Chrome/Edge account—still without passing through any developer or third-party servers. Archived history, card position, and size always remain local to each device.

### Data Sharing & Security
The extension makes zero network requests, transmits no data to developer or third-party servers, contains no ads or remote code, and uses a **Closed Shadow DOM** to prevent host websites from reading your cross-site tasks.

### Webpage Access
Content scripts are used strictly to render the floating todo UI. The extension does not read webpage contents, browsing history, passwords, cookies, or website form inputs.

### Retention & Deletion
Data remains in your local browser profile until you delete tasks or uninstall the extension, which completely removes its local storage.

### Contact & Policy Updates
For privacy inquiries, please use the developer contact email listed on the Chrome Web Store. If cloud sync, accounts, or payments are ever introduced, this policy and store disclosures will be updated beforehand.

---

<a id="中文"></a>
## 隐私政策（中文）

Floating Todo 是一个在网页中显示共享待办列表的浏览器扩展。

### 处理的数据
扩展仅处理用户主动输入的待办文字（以及用户主动划词并点击右键“添加到悬浮待办”时保存的来源网页链接与标题）、完成状态、用户选择“本站/本页”作用域时用于匹配的站点或页面标识，以及卡片的界面偏好（主题模式、折叠状态、显隐状态和屏幕位置），不采集任何个人身份或追踪信息。

### 用途与存储
这些数据仅用于提供待办管理、本地归档已清理/已删除的历史待办、恢复界面设置、更新浏览器工具栏角标计数，以及在同一浏览器配置文件的标签页之间同步。默认情况下，所有数据仅保存在本地浏览器的 `chrome.storage.local` 中；仅当用户主动开启「跨设备同步」开关后，活跃待办数据会通过浏览器原生的 `chrome.storage.sync` 随 Chrome/Edge 账号跨设备同步，仍不经过任何开发者或第三方服务器，且历史待办归档、卡片位置与尺寸始终仅保留在当前设备本地。

### 数据传输与共享
当前版本不发起任何网络请求，不向开发者或第三方服务器传输数据，不包含广告、分析追踪或远程执行代码，也不会出售用户数据。扩展界面采用 **Closed Shadow DOM** 封装，避免宿主网页脚本访问用户的待办列表。

### 网页访问
内容脚本仅用于在网页中渲染悬浮待办界面。扩展不读取网页正文、浏览历史、密码、Cookie 或网站表单内容。

### 保留与删除
数据保存在当前浏览器配置文件中，直到用户删除待办或移除扩展。卸载扩展会清除扩展本地存储。

### 联系方式与政策更新
如有隐私问题，请通过发布方在 Chrome Web Store 开发者设置中提供的联系邮箱联系。如果未来增加登录、支付或云同步功能，将在启用相关数据处理前更新本政策和商店披露。
