# ✅ Fix: Tombol Edit & Upload Ulang Foto

## 🎯 Yang Sudah Diperbaiki

### 1. ✅ Halaman Tugas Pokok (Tasks)
- Tombol edit sudah berfungsi
- Bisa upload ulang foto 1 dan foto 2
- Foto lama ditampilkan sebagai preview
- Bisa hapus dan ganti foto

### 2. ⏳ Halaman Supervisi (Supervisions)
- Perlu tambah tombol edit
- Perlu tambah dialog edit dengan upload foto

### 3. ⏳ Halaman Tugas Tambahan (Additional Tasks)
- Perlu tambah tombol edit
- Perlu tambah dialog edit dengan upload foto

---

## 🚀 Cara Deploy Perubahan

Setelah semua perbaikan selesai, deploy ke production:

```bash
git add .
git commit -m "Fix: Add edit and re-upload photo feature for all pages"
git push
```

Render akan otomatis redeploy (~3-5 menit).

---

## 📝 Status Perbaikan

- [x] Tugas Pokok - Edit & Upload Foto ✅
- [ ] Supervisi - Edit & Upload Foto (dalam progress)
- [ ] Tugas Tambahan - Edit & Upload Foto (dalam progress)

---

## 🔧 Technical Details

### API Endpoints yang Ditambahkan:

1. **PUT /api/tasks/:id** - Update task dengan foto
2. **PUT /api/supervisions/:id** - Update supervision dengan foto (akan ditambahkan)
3. **PUT /api/additional-tasks/:id** - Update additional task dengan foto (akan ditambahkan)

### Fitur yang Ditambahkan:

- Dialog edit untuk setiap halaman
- Preview foto lama saat edit
- Upload ulang foto (replace)
- Hapus foto individual
- Validasi file (max 5MB, format JPG/PNG)

---

**Status:** Dalam Progress 🔄
**Target:** Semua halaman bisa edit dan upload ulang foto
