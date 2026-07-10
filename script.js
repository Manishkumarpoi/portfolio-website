document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Typewriter role text ---------------- */
  const roles = [
    'Backend & Full-Stack Engineer',
    '.NET Core / C# Developer',
    'SQL Server & API Specialist',
    'Microservices Enthusiast'
  ];
  const roleEl = document.getElementById('roleText');

  if (roleEl) {
    if (reduceMotion) {
      roleEl.textContent = roles[0];
    } else {
      let roleIndex = 0, charIndex = 0, deleting = false;

      const tick = () => {
        const current = roles[roleIndex];
        if (!deleting) {
          charIndex++;
          roleEl.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            deleting = true;
            setTimeout(tick, 1600);
            return;
          }
        } else {
          charIndex--;
          roleEl.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
          }
        }
        setTimeout(tick, deleting ? 35 : 55);
      };
      tick();
    }
  }

  /* ---------------- Navigation: sidebar + tabs ---------------- */
  const pane = document.getElementById('pane');
  const sections = Array.from(document.querySelectorAll('.block'));
  const treeButtons = Array.from(document.querySelectorAll('.tree-file'));
  const tabButtons = Array.from(document.querySelectorAll('.tab'));
  const sbFile = document.getElementById('sbFile');

  const fileNames = {
    hero: 'hero.tsx', about: 'about.md', skills: 'skills.json',
    experience: 'experience.log', projects: 'projects/',
    education: 'education.yml', contact: 'contact.sh'
  };

  function setActive(id) {
    treeButtons.forEach(b => b.classList.toggle('active', b.dataset.target === id));
    tabButtons.forEach(b => b.classList.toggle('active', b.dataset.target === id));
    if (sbFile && fileNames[id]) sbFile.textContent = fileNames[id];
  }

  function goTo(id) {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  [...treeButtons, ...tabButtons].forEach(btn => {
    btn.addEventListener('click', () => goTo(btn.dataset.target));
  });

  document.querySelectorAll('a[data-target]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      goTo(a.dataset.target);
    });
  });

  /* ---------------- Scroll-driven active state + reveal ---------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { root: pane, threshold: 0.12 });

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { root: pane, threshold: 0, rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(sec => {
    revealObserver.observe(sec);
    activeObserver.observe(sec);
  });

  /* ---------------- Keep active tab scrolled into view on mobile ---------------- */
  const tabbar = document.getElementById('tabbar');
  const spyForTabs = new MutationObserver(() => {
    const active = tabbar.querySelector('.tab.active');
    if (active) active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  });
  tabButtons.forEach(t => spyForTabs.observe(t, { attributes: true, attributeFilter: ['class'] }));
});