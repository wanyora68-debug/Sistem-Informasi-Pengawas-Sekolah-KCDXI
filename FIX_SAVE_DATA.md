# Perbaikan Fitur Simpan Data

## 🔧 Masalah yang Diperbaiki

### Halaman Schools (Sekolah Binaan)
**Masalah:** Tombol "Simpan Sekolah" tidak berfungsi karena tidak mengirim Authorization token

**Solusi:**
1. ✅ Menambahkan `Authorization: Bearer ${token}` di header POST request
2. ✅ Menambahkan `Authorization: Bearer ${token}` di header GET request
3. ✅ Menambahkan `Authorization: Bearer ${token}` di header DELETE request
4. ✅ Menambahkan error handling yang lebih baik

## ✅ Status Semua Halaman

### 1. **Tasks (Tugas Harian)** ✅
- **Status:** Sudah berfungsi dengan baik
- **API:** Menggunakan `tasksApi` dari `api.ts`
- **Auth:** ✅ Token sudah dikirim via `getAuthHeaders()`
- **Create:** ✅ Berfungsi
- **Delete:** ✅ Berfungsi

### 2. **Supervisions (Supervisi)** ✅
- **Status:** Sudah berfungsi dengan baik
- **API:** Menggunakan `supervisionsApi` dari `api.ts`
- **Auth:** ✅ Token sudah dikirim via `getAuthHeaders()`
- **Create:** ✅ Berfungsi
- **Delete:** ✅ Berfungsi

### 3. **Additional Tasks (Tugas Tambahan)** ✅
- **Status:** Sudah berfungsi dengan baik
- **API:** Menggunakan `additionalTasksApi` dari `api.ts`
- **Auth:** ✅ Token sudah dikirim via `getAuthHeaders()`
- **Create:** ✅ Berfungsi
- **Delete:** ✅ Berfungsi

### 4. **Schools (Sekolah Binaan)** ✅ DIPERBAIKI
- **Status:** Sekarang berfungsi dengan baik
- **API:** Menggunakan fetch langsung dengan token
- **Auth:** ✅ Token sekarang dikirim di semua request
- **Create:** ✅ Berfungsi (DIPERBAIKI)
- **Delete:** ✅ Berfungsi (DIPERBAIKI)

## 🔐 Implementasi Authentication

### Helper Function di api.ts:
```typescript
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}
```

### Implementasi di Schools:
```typescript
// GET Schools
const { data: schools = [] } = useQuery<School[]>({
  queryKey: ["/api/schools"],
  queryFn: async () => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch('/api/schools', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
    if (!response.ok) return [];
    return response.json();
  },
});

// POST School
const createSchoolMutation = useMutation({
  mutationFn: async (school: typeof newSchool) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch("/api/schools", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(school),
      credentials: "include",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create school");
    }
    return response.json();
  },
});

// DELETE School
const deleteSchoolMutation = useMutation({
  mutationFn: async (id: string) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`/api/schools/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete school");
    return response.json();
  },
});
```

## 📊 Backend Implementation

### Server Routes (routes.ts):
```typescript
// GET Schools
app.get("/api/schools", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const schools = await db.getSchools(req.user!.userId);
    res.json(schools);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// POST School
app.post("/api/schools", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = insertSchoolSchema.parse({ ...req.body, userId: req.user!.userId });
    const school = await db.createSchool(data);
    res.json(school);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE School
app.delete("/api/schools/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    await db.deleteSchool(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});
```

### Local Storage (local-storage.ts):
```typescript
// Get Schools
async getSchools(userId: string): Promise<School[]> {
  return this.db.schools.filter(s => s.userId === userId);
}

// Create School
async createSchool(school: any): Promise<School> {
  const newSchool: School = {
    id: Date.now().toString(),
    userId: school.userId,
    name: school.name,
    address: school.address,
    contact: school.contact,
    principalName: school.principalName || null,
    principalNip: school.principalNip || null,
    createdAt: new Date(),
  };
  this.db.schools.push(newSchool);
  this.saveDatabase();
  return newSchool;
}

// Delete School
async deleteSchool(id: string): Promise<void> {
  this.db.schools = this.db.schools.filter(s => s.id !== id);
  this.saveDatabase();
}
```

## 🎯 Cara Testing

1. **Login** ke aplikasi dengan admin/admin
2. **Buka halaman Sekolah Binaan**
3. **Klik "Tambah Sekolah"**
4. **Isi form:**
   - Nama Sekolah: SDN 04
   - Alamat: Jl. Test No. 123
   - Kontak: 0812-3456-7890
   - Nama Kepala Sekolah: Test Kepala Sekolah
   - NIP/NUPTK: 123456789
5. **Klik "Simpan Sekolah"**
6. **Cek:** Data sekolah muncul di list
7. **Cek:** File `local-database.json` berisi data sekolah baru

## ✅ Hasil

Semua fitur simpan data di semua halaman sekarang berfungsi dengan baik:
- ✅ Tasks (Tugas Harian)
- ✅ Supervisions (Supervisi)
- ✅ Additional Tasks (Tugas Tambahan)
- ✅ Schools (Sekolah Binaan) - DIPERBAIKI

Data tersimpan permanen di `local-database.json` dan tidak hilang setelah refresh atau restart server!
