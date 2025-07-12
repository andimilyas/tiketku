# 🎟️ TixGo - Aplikasi Pemesanan Tiket Online

TixGo adalah aplikasi web sederhana berbasis Next.js yang memungkinkan pengguna untuk mencari, melihat detail, dan memesan tiket acara seperti konser, seminar, atau bioskop secara online.

Proyek ini merupakan bagian dari Tugas Besar Fullstack Web Programming JIDA 2025 dengan tujuan untuk mengasah keterampilan dalam membangun aplikasi web modern menggunakan Next.js sebagai tech stack utama.

---

## 🚀 Fitur Utama

- 🔍 **Pencarian & Filter Event**
- 📄 **Detail Event**
- 🛒 **Pemesanan Tiket**
- 💳 **Simulasi Pembayaran**
- 🗂️ **Riwayat Pemesanan**
- 🔐 **Autentikasi Login & Register**

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (React-based)
- **Styling:** Tailwind CSS / MUI
- **Backend:** Next.js API Routes
- **Database:** JSON Mock / PostgreSQL
- **Deployment:** Vercel

---

## 📁 Struktur Project (Sederhana)

```
/public
/src
 ├── /components
 ├── /pages
 │    ├── index.tsx
 │    ├── events/index.tsx
 │    ├── events/[id].tsx
 │    ├── cart.tsx
 │    ├── orders.tsx
 │    ├── login.tsx
 │    └── register.tsx
 ├── /styles
 ├── /utils
 └── /api
      ├── events.ts
      ├── orders.ts
      └── auth.ts
```

---

## ⚙️ Cara Menjalankan Project

1. **Clone Repository**
   ```bash
   git clone https://github.com/username/tixgo.git
   cd tixgo
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Jalankan Development Server**
   ```bash
   pnpm run dev
   ```
   Akses di `http://localhost:3000`

---

## 📝 Catatan Perkembangan

- [x] Inisialisasi project Next.js
- [ ] Desain halaman Home
- [ ] Implementasi daftar & detail event
- [ ] Fitur pemesanan & simulasi pembayaran
- [ ] Implementasi autentikasi
- [ ] Riwayat pemesanan

---

## 💡 Rencana Fitur Tambahan (Optional)

- Pencarian event berbasis keyword & lokasi
- Sistem pembayaran menggunakan Midtrans (optional)
- User role: Admin untuk CRUD event

---

## 📄 Lisensi

MIT License © 2025 Andi
