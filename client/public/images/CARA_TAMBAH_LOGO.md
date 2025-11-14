# 🖼️ Cara Menambahkan Logo Disdik Jabar

## Langkah-langkah:

### 1. Simpan Gambar Logo
Simpan gambar logo Disdik Jabar yang sudah diberikan dengan nama:
```
disdik-jabar.png
```

### 2. Copy ke Folder Ini
Copy file `disdik-jabar.png` ke folder:
```
client/public/images/
```

### 3. Struktur File
Setelah dicopy, struktur folder akan seperti ini:
```
client/public/images/
├── disdik-jabar.png     ← Logo Disdik Jabar (TAMBAHKAN INI)
├── cadisdik.jpg         ← Logo Cadisdik (optional)
├── CARA_TAMBAH_LOGO.md  ← File ini
└── README.md            ← Panduan umum
```

### 4. Refresh Browser
Setelah file dicopy, refresh browser untuk melihat logo muncul di halaman login.

---

## Spesifikasi Gambar

### Format yang Didukung:
- PNG (recommended - dengan background transparan)
- JPG/JPEG
- SVG (untuk kualitas terbaik)

### Ukuran Recommended:
- **Desktop:** Logo akan ditampilkan dengan lebar maksimal 384px (w-96)
- **Mobile:** Logo akan ditampilkan dengan lebar maksimal 192px (w-48)
- **Resolusi:** Minimal 800px lebar untuk kualitas terbaik

### Tips:
- Gunakan PNG dengan background transparan untuk hasil terbaik
- Pastikan logo memiliki resolusi tinggi
- File size sebaiknya < 500KB untuk loading cepat

---

## Tampilan di Halaman Login

### Desktop (≥1024px):
```
┌─────────────────────────────────────────────┐
│                                             │
│  ┌─────────────────┐  ┌─────────────────┐   │
│  │                 │  │                 │   │
│  │  LOGO DISDIK    │  │   LOGIN FORM    │   │
│  │  JABAR          │  │                 │   │
│  │  (384px wide)   │  │   Username      │   │
│  │                 │  │   Password      │   │
│  │  Dinas          │  │   [Login]       │   │
│  │  Pendidikan     │  │   [Register]    │   │
│  │  Prov. Jabar    │  │                 │   │
│  │                 │  │                 │   │
│  └─────────────────┘  └─────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

### Mobile (<1024px):
```
┌─────────────────────┐
│                     │
│   [LOGO DISDIK]     │
│   JABAR (192px)     │
│                     │
│  Aplikasi Pengawas  │
│      Sekolah        │
│                     │
│    [Username]       │
│    [Password]       │
│    [Login]          │
│    [Register]       │
│                     │
└─────────────────────┘
```

---

## Fallback System

Jika logo tidak ditemukan, aplikasi akan menampilkan:
- Icon School (fallback icon)
- Background gradient biru-indigo
- Tetap terlihat profesional

---

## Troubleshooting

### Logo tidak muncul?
1. Pastikan nama file: `disdik-jabar.png`
2. Pastikan lokasi: `client/public/images/`
3. Refresh browser (Ctrl + F5)
4. Clear browser cache

### Logo terlalu besar/kecil?
Logo akan otomatis menyesuaikan ukuran:
- Desktop: max 384px lebar
- Mobile: max 192px lebar
- Aspect ratio tetap terjaga

### Logo pecah/blur?
- Gunakan gambar dengan resolusi lebih tinggi
- Minimal 800px lebar
- Format PNG untuk kualitas terbaik

---

**Last Updated:** 11 November 2025  
**Status:** ✅ Ready to use
