/* ==========================================================
   dynamic-rss.js
   ----------------------------------------------------------
   Fungsi universal untuk load RSS feed ke dalam HTML.
   Semua class bisa ditentukan lewat parameter.

   ----------------------------------------------------------
   CARA PAKAI:
   ----------------------------------------------------------

   1. Siapkan struktur HTML:
      <div class="rss-list">
        <!-- template item -->
        <div class="rss-entry">
          <h3 class="rss-title"></h3>
          <a class="rss-link" target="_blank">Read More</a>
          <p class="rss-desc"></p>
          <small class="rss-date"></small>
        </div>
      </div>

   2. Panggil fetchRSS di script:
      <script src="dynamic-rss.js"></script>
      <script>
        fetchRSS("https://example.com/rss.xml", 
                 "rss-list", "rss-entry", 
                 "rss-title", "rss-desc", "rss-link", "rss-date");
      </script>

   3. Bisa juga pakai <body onload>:
      <body onload="fetchRSS('https://example.com/rss.xml', 
                             'rss-list','rss-entry',
                             'rss-title','rss-desc','rss-link','rss-date')">

   Note:
   - itemClass pertama (misal .rss-entry) akan dijadikan template.
   - Semua item RSS akan meng-clone template itu.
   - Kalau salah satu field (misal date) tidak dipakai, kosongkan param.
   ========================================================== */

async function fetchRSS(url, itemsClass, itemClass, titleClass, descClass, linkClass, dateClass) {
  try {
    const res = await fetch(url);
    const text = await res.text();

    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "application/xml");
    const items = xml.querySelectorAll("item");

    const itemsContainer = document.querySelector("." + itemsClass);
    if (!itemsContainer) return;

    const template = itemsContainer.querySelector("." + itemClass);
    if (!template) return;

    itemsContainer.innerHTML = "";

    items.forEach(item => {
      const clone = template.cloneNode(true);

      const title = item.querySelector("title")?.textContent || "";
      const link = item.querySelector("link")?.textContent || "#";
      const desc = item.querySelector("description")?.textContent || "";
      const pubDate = item.querySelector("pubDate")?.textContent || "";

      if (titleClass) clone.querySelectorAll("." + titleClass).forEach(el => el.textContent = title);
      if (linkClass) clone.querySelectorAll("." + linkClass).forEach(el => el.href = link);
      if (descClass) clone.querySelectorAll("." + descClass).forEach(el => el.innerHTML = desc);
      if (dateClass) clone.querySelectorAll("." + dateClass).forEach(el => el.textContent = pubDate);

      itemsContainer.appendChild(clone);
    });
  } catch (err) {
    // silent fail
  }
}
