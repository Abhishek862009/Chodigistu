document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('navToggle')?.addEventListener('click', () => {
  const nav = document.querySelector('.nav-links');
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  nav.style.cssText += 'flex-direction:column; position:absolute; right:24px; top:60px; background:#1c1815; border:1px solid var(--line); padding:16px; gap:12px;';
});

function showToast(msg, isErr) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (isErr ? ' err' : '');
  setTimeout(() => t.classList.remove('show'), 3500);
}

/* ---------- Showcase gallery ---------- */
async function loadShowcase() {
  const grid = document.getElementById('galleryGrid');
  const empty = document.getElementById('galleryEmpty');

  if (typeof FIREBASE_NOT_CONFIGURED !== 'undefined' && FIREBASE_NOT_CONFIGURED) {
    empty.style.display = 'block';
    empty.querySelector('strong').textContent = 'Setup baaki hai';
    empty.lastChild.textContent = ' Firebase config abhi jodi nahi gayi hai — README dekhein.';
    return;
  }

  try {
    const snap = await db.collection('photos')
      .where('showcase', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(9)
      .get();

    if (snap.empty) {
      empty.style.display = 'block';
      return;
    }
    grid.innerHTML = '';
    snap.forEach(doc => {
      const p = doc.data();
      const fig = document.createElement('figure');
      fig.innerHTML = `<img src="${p.url}" alt="${(p.categoryName || 'Studio')} photo" loading="lazy">
        <figcaption>${p.categoryName || ''}</figcaption>`;
      grid.appendChild(fig);
    });
  } catch (e) {
    console.error(e);
    empty.style.display = 'block';
    empty.querySelector('strong').textContent = 'Abhi gallery load nahi ho payi';
    empty.lastChild.textContent = ' Thodi der baad page refresh karein.';
  }
}
loadShowcase();

/* ---------- Contact form ---------- */
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const note = document.getElementById('cf-note');
  const btn = document.getElementById('cf-submit');
  note.textContent = '';
  note.className = 'form-note';

  if (typeof FIREBASE_NOT_CONFIGURED !== 'undefined' && FIREBASE_NOT_CONFIGURED) {
    note.textContent = 'Database jud'+'ā abhi baaki hai, isliye query save nahi ho sakegi.';
    note.classList.add('err');
    return;
  }

  const data = {
    name: document.getElementById('cf-name').value.trim(),
    phone: document.getElementById('cf-phone').value.trim(),
    message: document.getElementById('cf-message').value.trim(),
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    status: 'new'
  };

  btn.disabled = true;
  btn.textContent = 'Bhej rahe hain...';
  try {
    await db.collection('queries').add(data);
    note.textContent = 'Dhanyavaad! Hum jald hi sampark karenge.';
    note.classList.add('ok');
    e.target.reset();
  } catch (err) {
    console.error(err);
    note.textContent = 'Kuch gadbad ho gayi, dobara koshish karein.';
    note.classList.add('err');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Query bhejein';
  }
});
