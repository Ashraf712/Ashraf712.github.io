(function(){
  const htmlEl = document.documentElement;
  function setLanguage(lang){
    localStorage.setItem('lang', lang);
    htmlEl.setAttribute('lang', lang);
    htmlEl.setAttribute('dir', lang==='ar'?'rtl':'ltr');
    document.querySelectorAll('[data-en]').forEach(el=>{
      const v = el.getAttribute(lang==='ar'?'data-ar':'data-en') || '';
      if(v) el.textContent = v;
    });
  }
  document.getElementById('enBtn')?.addEventListener('click', ()=>setLanguage('en'));
  document.getElementById('arBtn')?.addEventListener('click', ()=>setLanguage('ar'));
  setLanguage(localStorage.getItem('lang') || 'en');

  const themeToggle = document.getElementById('theme-toggle');
  themeToggle?.addEventListener('click', () => {
    document.documentElement.classList.toggle('theme-light');
    localStorage.setItem('theme', document.documentElement.classList.contains('theme-light') ? 'light' : 'dark');
  });
  (function(){ const saved = localStorage.getItem('theme'); if(saved === 'light') document.documentElement.classList.add('theme-light'); })();

  const nav = document.getElementById('site-nav');
  const navToggle = document.querySelector('.nav-toggle');
  if (nav && navToggle) {
    navToggle.addEventListener('click', () => {
      const expanded = nav.getAttribute('aria-expanded') === 'true';
      nav.setAttribute('aria-expanded', String(!expanded));
      navToggle.setAttribute('aria-expanded', String(!expanded));
    });
  }

  const links = Array.from(document.querySelectorAll('#nav-list a'));
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const id = '#'+entry.target.id;
        links.forEach(a=>a.classList.toggle('active', a.getAttribute('href')===id));
      }
    });
  }, {rootMargin:'-50% 0px -50% 0px', threshold:0});
  sections.forEach(s=> spy.observe(s));

  links.forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if(!id || id === '#') return;
      const el = document.querySelector(id);
      if(el){
        e.preventDefault();
        const y = el.getBoundingClientRect().top + window.pageYOffset - 68;
        window.scrollTo({top: y, behavior: 'smooth'});
      }

      // Close the mobile nav if it is open so the menu hides after navigation
      if (nav && nav.getAttribute('aria-expanded') === 'true') {
        nav.setAttribute('aria-expanded', 'false');
        navToggle?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  const reveals = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){ entry.target.classList.add('in'); revealObs.unobserve(entry.target); }
    });
  }, {threshold:0.1});
  reveals.forEach(el=>revealObs.observe(el));

  document.querySelectorAll('.preset').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const c = btn.getAttribute('data-brand');
      document.documentElement.style.setProperty('--brand', c);
      localStorage.setItem('brand', c);
    });
  });
  const picker = document.getElementById('colorPicker');
  picker?.addEventListener('input', (e)=>{
    const c = e.target.value;
    document.documentElement.style.setProperty('--brand', c);
    localStorage.setItem('brand', c);
  });
  const savedBrand = localStorage.getItem('brand');
  if(savedBrand) document.documentElement.style.setProperty('--brand', savedBrand);

  const search = document.getElementById('project-search');
  function filterProjects() {
    const q = (search?.value || '').toLowerCase().trim();
    document.querySelectorAll('.projects-grid .project').forEach(card => {
      const hay = (card.innerText || '').toLowerCase();
      card.style.display = hay.includes(q) ? '' : 'none';
    });
  }
  search?.addEventListener('input', filterProjects);

  document.getElementById('expandAll')?.addEventListener('click', ()=>{
    document.querySelectorAll('details.project-details').forEach(d => d.open = true);
  });
  document.getElementById('collapseAll')?.addEventListener('click', ()=>{
    document.querySelectorAll('details.project-details').forEach(d => d.open = false);
  });
})();





// Share button logic (append into your existing script.js)
(function(){
  const shareBtn = document.getElementById('shareBtn');
  const shareMenu = document.getElementById('shareMenu');
  const shareWrap = document.getElementById('shareWrap');
  const copyBtn = document.getElementById('copyLink');
  const toast = document.getElementById('shareToast');

  // Title + url to share (adjust if you want a different link)
  const shareData = {
    title: document.title || 'Ashraf — Portfolio',
    text: 'Check out my portfolio — Ashraf Ali Shaik',
    url: window.location.href
  };

  function showToast(msg='Link copied to clipboard'){
    toast.textContent = msg;
    toast.classList.add('visible');
    toast.setAttribute('aria-hidden','false');
    setTimeout(()=>{ toast.classList.remove('visible'); toast.setAttribute('aria-hidden','true'); }, 2000);
  }

  // Web Share API first
  shareBtn?.addEventListener('click', async (e) => {
    // If Web Share available, open native share sheet
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        // Optional: you can show a small confirmation
      } catch (err) {
        // user cancelled or error — silently ignore
      }
      return;
    }

    // Otherwise toggle the fallback menu
    const isOpen = shareMenu.classList.contains('show');
    shareMenu.classList.toggle('show', !isOpen);
    shareBtn.setAttribute('aria-expanded', String(!isOpen));
    shareMenu.setAttribute('aria-hidden', String(isOpen));
  });

  // Close fallback menu on outside click
  document.addEventListener('click', (ev) => {
    if (!shareWrap.contains(ev.target)) {
      shareMenu.classList.remove('show');
      shareBtn.setAttribute('aria-expanded', 'false');
      shareMenu.setAttribute('aria-hidden', 'true');
    }
  });

  // Setup fallback share links (encode)
  const url = encodeURIComponent(shareData.url);
  const text = encodeURIComponent(shareData.text + ' — ' + shareData.title);

  const twitter = document.getElementById('shareTwitter');
  const linkedin = document.getElementById('shareLinkedIn');
  const whatsapp = document.getElementById('shareWhatsApp');
  const email = document.getElementById('shareEmail');

  if (twitter) twitter.href = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
  if (linkedin) linkedin.href = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  if (whatsapp) whatsapp.href = `https://wa.me/?text=${text}%20${url}`;
  if (email) email.href = `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.text + '\n' + shareData.url)}`;

  // Copy-to-clipboard fallback
  copyBtn?.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareData.url);
        showToast('Link copied to clipboard');
      } else {
        // old execCommand fallback
        const el = document.createElement('textarea');
        el.value = shareData.url;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        el.remove();
        showToast('Link copied to clipboard');
      }
    } catch (err) {
      showToast('Could not copy link');
    }
  });

  // keyboard: close menu with ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      shareMenu.classList.remove('show');
      shareBtn.setAttribute('aria-expanded', 'false');
    }
  });
})();












// Inline: second share button (main content)
(function(){
  const btn = document.getElementById('shareMainBtn');
  if(!btn) return;

  const shareData = {
    title: document.title || 'Ashraf — Portfolio',
    text: 'Check out my portfolio — Ashraf Ali Shaik',
    url: window.location.href
  };

  const showToast = (msg='Link copied to clipboard') => {
    // Reuse existing toast if present, else quick fallback
    const toast = document.getElementById('shareToast');
    if (toast) {
      toast.textContent = msg;
      toast.classList.add('visible');
      toast.setAttribute('aria-hidden','false');
      setTimeout(()=>{ toast.classList.remove('visible'); toast.setAttribute('aria-hidden','true'); }, 2000);
      return;
    }
    // small ephemeral fallback
    const t = document.createElement('div');
    t.textContent = msg;
    Object.assign(t.style,{position:'fixed',right:'20px',bottom:'28px',background:'rgba(0,0,0,.8)',color:'#fff',padding:'.4rem .8rem',borderRadius:'999px',zIndex:9999});
    document.body.appendChild(t);
    setTimeout(()=> t.remove(), 2000);
  };

  btn.addEventListener('click', async (e) => {
    // try Web Share API
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // user cancelled or error — continue to fallback
      }
    }

    // fallback: copy link to clipboard
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareData.url);
        showToast('Link copied to clipboard');
      } else {
        const el = document.createElement('textarea');
        el.value = shareData.url;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        el.remove();
        showToast('Link copied to clipboard');
      }
    } catch (err) {
      // If copy failed, open share menu links if a share menu exists
      const menu = document.getElementById('shareMenu');
      if (menu) {
        menu.classList.add('show');
        menu.setAttribute('aria-hidden','false');
        document.getElementById('shareBtn')?.setAttribute('aria-expanded','true');
      } else {
        showToast('Could not copy link');
      }
    }
  });
})();













// // === Portfolio QR Section ===
// (function(){
//   const qrUrl = "https://ashraf712.github.io/";
//   const qrImage = document.getElementById("qrImage");
//   const downloadBtn = document.getElementById("downloadQR");
//   const shareBtn = document.getElementById("shareQR");

//   if (!qrImage) return;

//   // Generate the QR using a reliable Google API (no dependencies)
//   const qrAPI = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrUrl)}&size=200x200`;
//   qrImage.src = qrAPI;
//   downloadBtn.href = qrAPI;

//   // Web Share API logic
//   shareBtn?.addEventListener("click", async () => {
//     try {
//       const blob = await fetch(qrAPI).then(res => res.blob());
//       const file = new File([blob], "Ashraf_QR.png", { type: blob.type });
//       if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
//         await navigator.share({
//           title: "Ashraf Portfolio",
//           text: "Check out Ashraf Ali Shaik’s portfolio",
//           files: [file],
//           url: qrUrl
//         });
//       } else {
//         await navigator.clipboard.writeText(qrUrl);
//         alert("Link copied to clipboard!");
//       }
//     } catch (err) {
//       console.error("Share failed:", err);
//       alert("Could not share QR. Link copied instead!");
//       await navigator.clipboard.writeText(qrUrl);
//     }
//   });
// })();


// QR download helper — use instead of directly linking to external qrAPI
(function(){
  const qrUrl = "https://ashraf712.github.io/";
  const qrAPI = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrUrl)}&size=200x200`;

  const qrImage = document.getElementById("qrImage");
  const downloadBtn = document.getElementById("downloadQR");
  const shareBtn = document.getElementById("shareQR");

  if (!qrImage || !downloadBtn) return;

  // show the QR for preview
  qrImage.src = qrAPI;

  // PREVIEW: keep the href so clicking directly still opens the image in a new tab
  downloadBtn.setAttribute('href', qrAPI);
  downloadBtn.setAttribute('target', '_blank');
  downloadBtn.setAttribute('rel', 'noopener');

  // When user clicks Download, fetch the image blob and trigger client-side download
  downloadBtn.addEventListener('click', async function (e) {
    e.preventDefault(); // prevent default navigation

    // small UI feedback: disable while fetching
    downloadBtn.classList.add('loading');
    downloadBtn.setAttribute('aria-disabled', 'true');

    try {
      const resp = await fetch(qrAPI, { mode: 'cors' });
      if (!resp.ok) throw new Error('Network response was not ok');

      const blob = await resp.blob();
      const filename = 'Ashraf_QR.png';
      const objectUrl = URL.createObjectURL(blob);

      // Create a temporary anchor to trigger download (works across browsers)
      const temp = document.createElement('a');
      temp.href = objectUrl;
      temp.download = filename;
      document.body.appendChild(temp);
      temp.click();
      temp.remove();

      // release memory
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);

    } catch (err) {
      console.error('QR download failed', err);
      // Fallback: open in new tab for user to manually save
      window.open(qrAPI, '_blank', 'noopener');
    } finally {
      downloadBtn.classList.remove('loading');
      downloadBtn.removeAttribute('aria-disabled');
    }
  });

  // Optional: share button (as you already had) - keep as-is
  shareBtn?.addEventListener('click', async () => {
    try {
      const resp = await fetch(qrAPI, { mode: 'cors' });
      const blob = await resp.blob();
      const file = new File([blob], "Ashraf_QR.png", { type: blob.type });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Ashraf Portfolio",
          text: "Check out my portfolio",
          files: [file],
          url: qrUrl
        });
      } else {
        await navigator.clipboard.writeText(qrUrl);
        alert('Link copied to clipboard');
      }
    } catch (err) {
      console.error('Share failed', err);
      try { await navigator.clipboard.writeText(qrUrl); alert('Link copied to clipboard'); }
      catch { alert('Could not share or copy link'); }
    }
  });

})();

