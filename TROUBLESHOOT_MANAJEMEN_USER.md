# Troubleshooting Manajemen User

## Masalah Umum dan Solusi

### 1. Fitur Tidak Muncul di Halaman Users

**Gejala:**
- Dashboard statistik tidak tampil
- Tombol-tombol aksi tidak ada
- Filter dan pencarian tidak berfungsi

**Penyebab Kemungkinan:**
- File users.tsx tidak ter-update dengan benar
- Import komponen UI hilang
- Error JavaScript yang memblokir rendering

**Solusi:**
```bash
# 1. Periksa console browser untuk error
F12 -> Console

# 2. Restart development server
npm run dev
# atau
yarn dev

# 3. Clear browser cache
Ctrl+Shift+R (hard refresh)

# 4. Periksa file users.tsx
# Pastikan semua import ada:
import { UserActivitiesDialog } from "@/components/user-activities-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
```

### 2. UserActivitiesDialog Tidak Ditemukan

**Gejala:**
- Error: Cannot resolve '@/components/user-activities-dialog'
- Tombol aktivitas tidak berfungsi

**Solusi:**
```bash
# Periksa apakah file ada
ls client/src/components/user-activities-dialog.tsx

# Jika tidak ada, buat file kosong sementara:
touch client/src/components/user-activities-dialog.tsx
```

**Isi file sementara:**
```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type UserActivitiesDialogProps = {
  userId: string;
  userName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UserActivitiesDialog({ open, onOpenChange, userName }: UserActivitiesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Aktivitas User: {userName}</DialogTitle>
        </DialogHeader>
        <p>Fitur ini sedang dalam pengembangan.</p>
      </DialogContent>
    </Dialog>
  );
}
```

### 3. Komponen UI Tidak Ditemukan

**Gejala:**
- Error: Cannot resolve '@/components/ui/checkbox'
- Error: Cannot resolve '@/components/ui/separator'

**Solusi:**
```bash
# Install shadcn/ui components yang hilang
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add separator

# Atau buat manual jika tidak ada shadcn/ui
```

**Checkbox manual:**
```typescript
// client/src/components/ui/checkbox.tsx
import * as React from "react";

export interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, onCheckedChange, disabled, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        disabled={disabled}
        {...props}
      />
    );
  }
);
```

**Separator manual:**
```typescript
// client/src/components/ui/separator.tsx
import * as React from "react";

export const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`border-t border-gray-200 ${className || ''}`}
    {...props}
  />
));
```

### 4. Data User Tidak Tersimpan

**Gejala:**
- User baru tidak muncul setelah ditambah
- Perubahan user tidak tersimpan
- Data hilang setelah refresh

**Solusi:**
```javascript
// Periksa localStorage di browser console
console.log(localStorage.getItem('app_users'));

// Reset data jika corrupt
localStorage.removeItem('app_users');

// Atau set data manual
const defaultUsers = [
  {
    id: '1',
    username: 'admin',
    fullName: 'Administrator',
    role: 'admin',
    status: 'active',
    email: 'admin@disdik.jabar.go.id',
    department: 'Cabang Dinas Pendidikan Wilayah XI',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
localStorage.setItem('app_users', JSON.stringify(defaultUsers));
```

### 5. Toast Notifications Tidak Muncul

**Gejala:**
- Tidak ada feedback setelah aksi
- Error: useToast is not defined

**Solusi:**
```bash
# Install toast component
npx shadcn-ui@latest add toast

# Atau periksa apakah Toaster ada di root component
```

**Manual toast hook:**
```typescript
// client/src/hooks/use-toast.ts
import { useState } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, variant = 'default' }) => {
    const id = Date.now();
    const newToast = { id, title, description, variant };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
    
    // Simple alert fallback
    alert(`${title}: ${description}`);
  };

  return { toast };
}
```

### 6. Styling Tidak Muncul

**Gejala:**
- Layout berantakan
- Komponen tidak ter-style
- Grid tidak responsive

**Solusi:**
```bash
# Periksa Tailwind CSS
npm run build-css

# Atau tambah CSS manual
```

**CSS fallback:**
```css
/* Tambah ke global.css */
.grid { display: grid; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-5 { grid-template-columns: repeat(5, 1fr); }
.gap-4 { gap: 1rem; }
.space-y-4 > * + * { margin-top: 1rem; }
.flex { display: flex; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
```

### 7. TypeScript Errors

**Gejala:**
- Type errors di console
- Build gagal
- IDE menunjukkan error merah

**Solusi:**
```typescript
// Tambah type definitions yang hilang
type User = {
  id: string;
  username: string;
  fullName: string;
  role: string;
  nip?: string;
  rank?: string;
  phone?: string;
  email?: string;
  department?: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
};

// Atau disable TypeScript sementara
// @ts-ignore
```

### 8. Performance Issues

**Gejala:**
- Halaman lambat loading
- UI lag saat typing di search
- Memory usage tinggi

**Solusi:**
```typescript
// Debounce search input
import { useMemo, useState, useCallback } from 'react';
import { debounce } from 'lodash';

const debouncedSearch = useCallback(
  debounce((term: string) => {
    setSearchTerm(term);
  }, 300),
  []
);

// Memoize filtered users
const filteredUsers = useMemo(() => {
  return users.filter(user => {
    // filter logic
  });
}, [users, searchTerm, roleFilter, statusFilter]);
```

### 9. Mobile Responsiveness

**Gejala:**
- Layout rusak di mobile
- Tombol terlalu kecil
- Text terpotong

**Solusi:**
```css
/* Responsive fixes */
@media (max-width: 768px) {
  .grid-cols-5 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .hidden-mobile {
    display: none;
  }
  
  .text-sm-mobile {
    font-size: 0.875rem;
  }
}
```

### 10. API Endpoints Tidak Berfungsi

**Gejala:**
- 404 errors pada API calls
- CORS errors
- 500 internal server errors

**Solusi:**
```javascript
// Periksa API routes ada
ls api/users.js
ls api/users/[id]/activities.js
ls api/users/[id]/reset-password.js

// Test API manual
fetch('/api/users', {
  headers: {
    'Authorization': 'Bearer test-token'
  }
})
.then(res => res.json())
.then(console.log);
```

## Quick Fixes

### Reset Semua Data
```javascript
// Jalankan di browser console
localStorage.clear();
location.reload();
```

### Force Refresh Components
```bash
# Restart dev server
npm run dev

# Clear node_modules jika perlu
rm -rf node_modules
npm install
```

### Bypass TypeScript Errors
```typescript
// Tambah di top file
// @ts-nocheck
```

### Manual Component Test
```javascript
// Test di browser console
console.log('Testing user management features...');

// Test localStorage
const users = JSON.parse(localStorage.getItem('app_users') || '[]');
console.log('Users in storage:', users.length);

// Test user creation
const newUser = {
  id: Date.now().toString(),
  username: 'test',
  fullName: 'Test User',
  role: 'pengawas',
  status: 'active',
  createdAt: new Date().toISOString()
};
console.log('Test user created:', newUser);
```

## Kontak Support

Jika masalah masih berlanjut:

1. **Check Console Errors**: Buka F12 -> Console untuk melihat error detail
2. **Check Network Tab**: Periksa API calls yang gagal
3. **Clear Browser Data**: Hapus cache dan localStorage
4. **Restart Development Server**: Stop dan start ulang npm run dev
5. **Check File Permissions**: Pastikan file dapat dibaca/ditulis

## Logs Debugging

```javascript
// Tambah logging untuk debug
console.log('Current user:', getCurrentUser());
console.log('Users state:', users);
console.log('Selected users:', selectedUsers);
console.log('Filters:', { searchTerm, roleFilter, statusFilter });
```