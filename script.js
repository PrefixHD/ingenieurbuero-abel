document.documentElement.classList.add('js');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}
menuToggle.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    closeMenu();
    menuToggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
const mobileMenu = window.matchMedia('(max-width:720px)');
mobileMenu.addEventListener('change', () => {
  const focusWasInMenu = navigation.contains(document.activeElement);
  closeMenu();
  if (focusWasInMenu && mobileMenu.matches) menuToggle.focus();
});

// All 14 supplied images are represented in the visible project archive.
const image = (file, caption, alt) => ({src: 'assets/' + file + '.webp', caption, alt});
const galleries = {
  wohnhaus: {title:'Mehrfamilienhaus', images:[
    image('wohnensemble-ansicht-01','Luftansicht / Dach und Garten','Luftansicht eines weißen Mehrfamilienhauses mit begrüntem Flachdach'),
    image('wohnensemble-ansicht-02','Luftansicht / Vorplatz','Mehrfamilienhaus mit Balkonen und großem Vorplatz aus der Luft'),
    image('wohnensemble-ansicht-03','Luftansicht / Balkone','Luftansicht eines Mehrfamilienhauses mit Balkonen und umliegenden Gärten'),
    image('wohnhaus-visualisierung-01','Visualisierung / Eingangsseite','3D-Visualisierung eines weißen Wohnhauses mit Eingang und Stellplätzen'),
    image('wohnhaus-visualisierung-02','Visualisierung / Gartenseite','3D-Visualisierung eines weißen Wohnhauses mit Balkonen und Garten')
  ]},
  doppelhaus: {title:'Doppelhaus', images:[
    image('doppelhaus-visualisierung-01','Visualisierung / Straßenansicht','Weißes Doppelhaus mit dunklem Satteldach in einer 3D-Straßenansicht'),
    image('doppelhaus-visualisierung-02','Visualisierung / Gartenansicht','Doppelhaus mit Terrassen und Garten in einer 3D-Visualisierung')
  ]},
  staffelgeschoss: {title:'Wohnen mit Staffelgeschoss', images:[
    image('staffelgeschoss-visualisierung-01','Visualisierung / Ansicht 01','Wohngebäude mit zurückgesetztem Obergeschoss und Balkonen'),
    image('staffelgeschoss-visualisierung-02','Visualisierung / Ansicht 02','Alternative Visualisierung des Wohngebäudes mit Staffelgeschoss'),
    image('staffelgeschoss-visualisierung-03','Visualisierung / Ansicht 03','Wohngebäude mit Staffelgeschoss aus der Perspektive der Zufahrt')
  ]},
  studien: {title:'Architekturstudien', images:[
    image('modell-fassade','Architekturmodell / Fassade','Architekturmodell mit vertikaler Fassadenstruktur vor schwarzem Hintergrund'),
    image('modell-innenraum','Architekturmodell / Innenraum','Architekturmodell mit Innenräumen, Stützen und Treppen'),
    image('skizze-arkade','Zeichnung / Arkade','Bleistiftskizze eines überdachten Arkadengangs mit Glasfassade'),
    image('skizze-stadtraum','Zeichnung / Stadtraum','Bleistiftskizze eines mehrgeschossigen Gebäudes an einer Straße')
  ]}
};

document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelectorAll('.project-card').forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && !card.dataset.category.split(' ').includes(button.dataset.filter);
  });
  const count = document.querySelectorAll('.project-card:not([hidden])').length;
  document.querySelector('#filter-status').textContent = `${button.textContent}: ${count} ${count === 1 ? 'Projekt' : 'Projekte'} angezeigt.`;
}));

const gallery = document.querySelector('#gallery');
let currentGallery = null, currentIndex = 0;
function renderImage() {
  const group = galleries[currentGallery], selected = group.images[currentIndex];
  const picture = document.querySelector('#gallery-image');
  picture.src = selected.src; picture.alt = selected.alt;
  document.querySelector('#gallery-title').textContent = group.title;
  document.querySelector('#gallery-caption').textContent = `Bild ${currentIndex + 1} von ${group.images.length} — ${selected.caption}`;
}
function stepImage(direction) {
  currentIndex = (currentIndex + direction + galleries[currentGallery].images.length) % galleries[currentGallery].images.length;
  renderImage();
}
document.querySelectorAll('[data-gallery]').forEach(button => button.addEventListener('click', () => {
  currentGallery = button.dataset.gallery; currentIndex = Number(button.dataset.index);
  renderImage(); gallery.showModal(); document.body.classList.add('modal-open');
}));
document.querySelector('#gallery-prev').addEventListener('click', () => stepImage(-1));
document.querySelector('#gallery-next').addEventListener('click', () => stepImage(1));
gallery.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') {event.preventDefault(); stepImage(1);}
  if (event.key === 'ArrowLeft') {event.preventDefault(); stepImage(-1);}
});
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
});
document.querySelector('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const text = ['Projekt- oder Terminanfrage — Ingenieurbüro Abel','',`Name: ${data.get('name')}`,`Unternehmen: ${data.get('company')}`,`E-Mail: ${data.get('email')}`,`Telefon: ${data.get('phone')}`,`Vorhaben: ${data.get('project')}`,`Terminvorschlag: ${data.get('date') || 'Noch offen'}`,'','Beschreibung / Terminvorschläge:',data.get('message'),'','Die Anfrage wurde lokal vorbereitet und noch nicht versendet.','Kontakt: Ingenieurbuero_Abel@t-online.de | 06235 / 920165'].join('\r\n');
  const url = URL.createObjectURL(new Blob(['\uFEFF' + text], {type:'text/plain;charset=utf-8'}));
  const link = document.createElement('a'); link.href = url; link.download = 'Projektanfrage-Abel.txt';
  document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000);
  form.querySelector('.form-status').textContent = 'Die Textdatei wurde zum Download bereitgestellt. Senden Sie „Projektanfrage-Abel.txt“ bitte per E-Mail an Ingenieurbuero_Abel@t-online.de. Ihre Anfrage wurde noch nicht versendet.';
});

const navLinks = [...document.querySelectorAll('nav a')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) navLinks.forEach(link => {
        const active = link.getAttribute('href') === '#' + entry.target.id;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, {rootMargin:'-15% 0px -60% 0px'});
  document.querySelectorAll('section[id]').forEach(section => observer.observe(section));
}

document.querySelector('#contact-form').addEventListener('input', event => {
  event.currentTarget.querySelector('.form-status').textContent = '';
});
