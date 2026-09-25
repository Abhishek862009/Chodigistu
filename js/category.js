document.getElementById('year').textContent = new Date().getFullYear();

const params = new URLSearchParams(window.location.search);
const categoryId = params.get('id');

const spinner = document.getElementById('spinner');
const grid = document.getElementById('photoGrid');
const empty = document.getElementById('catEmpty');
const catNameEl = document.getElementById('catName');
const catCountEl = document.getElementById('catCount');

function showEmpty(title, body) {
  spinner.style.display = 'none';
  empty.style.display = 'block';
  document.getElementById('emptyTitle').textContent = title;
  document.getElementById('emptyBody').textContent = body;
  catNameEl.textContent = 'Chaudhary Digital Studio';
}

async function loadCategory() {
  if (typeof FIREBASE_NOT_CONFIGURED !== 'undefined' && FIREBASE_NOT_CONFIGURED) {
    showEmpty('Setup baaki hai', 'Database abhi connect nahi hui hai.');
    return;
  }
  if (!categoryId) {
    showEmpty('Link adhoora hai', 'Yeh QR code sahi category se link nahi hai.');
    return;
  }

  try {
    const catDoc = await db.collection('categories').doc(categoryId).get();
    if (!catDoc.exists) {
      showEmpty('Yeh category nahi mili', 'Ho sakta hai yeh photos hata di gayi hon.');
      return;
    }
    const cat = catDoc.data();
    catNameEl.textContent = cat.name || 'Photos';
    document.title = (cat.name || 'Photos') + ' — Chaudhary Digital Studio';

    const photosSnap = await db.collection('photos')
      .where('categoryId', '==', categoryId)
      .orderBy('createdAt', 'desc')
      .get();

    spinner.style.display = 'none';

    if (photosSnap.empty) {
      catCountEl.textContent = '0 photos';
      showEmpty('Photos jald hi add ki jayengi', 'Thodi der baad dobara check karein.');
      return;
    }

    catCountEl.textContent = photosSnap.size + ' photos';
    photosSnap.forEach(doc => {
      const p = doc.data();
      const fig = document.createElement('figure');
      fig.innerHTML = `<img src="${p.url}" alt="${cat.name}" loading="lazy">`;
      fig.querySelector('img').addEventListener('click', () => openLightbox(p.url));
      grid.appendChild(fig);
    });
  } catch (e) {
    console.error(e);
    showEmpty('Abhi load nahi ho paya', 'Internet check karke page refresh karein.');
  }
}
loadCategory();

function openLightbox(src) {
  document.getElementById('lbImg').src = src;
  document.getElementById('lightbox').classList.add('open');
}
document.getElementById('lbClose').addEventListener('click', () => {
  document.getElementById('lightbox').classList.remove('open');
});
document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target.id === 'lightbox') e.target.classList.remove('open');
});
