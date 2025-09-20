
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