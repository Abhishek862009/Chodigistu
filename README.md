# Chaudhary Digital Studio — Website

Ye ek ready website hai:
- **index.html** — public homepage (gallery, about, contact form)
- **admin.html** — admin panel (login, categories, photo upload, showcase select, QR code, queries)
- **category.html** — QR scan karne par khulne wala page (koi login/password nahi lagta)
- **css/style.css**, **js/*.js** — styling aur logic

Database ke liye **Firebase** use kiya gaya hai (Google ka free-tier backend) kyunki isse aapko
alag se server manage nahi karna padta — sirf ek project banake keys yahan daalni hain.

---

## Step 1 — Firebase project banayein

1. https://console.firebase.google.com par jayein, Google account se login karein.
2. **Add project** par click karein, naam dein (e.g. `chaudhary-digital-studio`), Continue karte jayein.
3. Project ban jaane ke baad, project ke andar:
   - **Build → Authentication** → Get Started → **Sign-in method** tab → **Email/Password** ko enable karein.
   - **Build → Firestore Database** → Create database → **Production mode** → apne nearest region (e.g. `asia-south1`) mein banayein.
   - **Build → Storage** → Get Started → Production mode.

## Step 2 — Admin ka login banayein

1. **Authentication → Users** tab → **Add user**.
2. Ek email aur password dalein (yeh admin panel ke login mein use hoga). Jitne staff ko access dena hai, utne users add kar sakte hain.

## Step 3 — Website ko apni Firebase keys se jodein

1. Firebase console mein, project ke gear icon (⚙️) → **Project settings** → neeche scroll karke **Your apps** section mein **Web (`</>`)** icon par click karke ek web app register karein.
2. Wahan se milne wala `firebaseConfig` object copy karein.
3. Is zip mein `js/firebase-config.js` file kholein aur `firebaseConfig` object ki values (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId) apni values se replace karein.
4. File save karein — bas, website ab aapke database se jud gayi.

## Step 4 — Security rules lagayein (zaroori)

Bina inke, koi bhi bahar se aapka data padh/badal sakta hai. Firebase console mein:

**Firestore Database → Rules** tab mein yeh paste karein:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /categories/{catId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /photos/{photoId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /queries/{queryId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

**Storage → Rules** tab mein yeh paste karein:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /photos/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Isse: koi bhi customer sirf photos dekh sakta hai aur contact form bhar sakta hai, lekin sirf
logged-in admin hi photos upload/delete ya categories manage kar sakta hai. **Publish** dabana na bhoolein.

## Step 5 — Website ko host karein

Sabse aasan tareeka **Firebase Hosting** hai (free hai):

1. Apne computer par [Node.js](https://nodejs.org) install karein.
2. Terminal mein: `npm install -g firebase-tools`
3. Is folder ke andar terminal khol kar: `firebase login`, phir `firebase init hosting` (public directory jab pooche to `.` dalein, single-page app? → No).
4. Phir: `firebase deploy`
5. Aapko ek live link mil jayega (e.g. `https://chaudhary-digital-studio.web.app`) jo mobile aur desktop, dono par chalega.

Iske alawa aap chahen to yeh files kisi bhi normal hosting (Hostinger, GoDaddy, cPanel) par bhi
seedhe upload kar sakte hain — yeh sirf HTML/CSS/JS files hain, koi special server chahiye nahi.

## Kaise use karein

- **Category banayein**: `admin.html` → Login → Categories tab → naam dalke "Category banayein".
- **Photos upload karein**: Photos Upload tab → category chunein → apni photos select karein.
- **QR code**: Categories tab mein har category ke aage "QR code" button — usse PNG download karke
  customer ko WhatsApp/print par de sakte hain. Scan karte hi sirf usi category ki photos khulengi,
  koi password nahi maanga jayega.
- **Homepage showcase**: Homepage Showcase tab mein category chunkar jo photos ghar ke page par
  dikhani hain unke checkbox tick karein.
- **Queries**: Contact form se aayi sabhi enquiries "Contact Queries" tab mein dikhengi.

## Notes

- Jab tak `js/firebase-config.js` mein apni keys nahi daali jayengi, website ek saaf "setup baaki
  hai" message dikhayegi — kahin bhi blank ya tooti hui screen nahi dikhegi.
- Sabhi galtiyon (network error, missing photo, galat link) par user ko samajh aane wala Hindi
  message dikhta hai, technical error nahi.
- Design mobile-first hai — chhoti screen par bhi layout automatically adjust ho jata hai.
