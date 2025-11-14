# Design Guidelines: Aplikasi Manajemen Tugas Pengawas Sekolah

## Design Approach: Material Design System

**Justification**: This productivity application requires a proven, data-dense interface pattern. Material Design provides excellent guidelines for forms, tables, calendars, and data visualization - all critical components for this school supervision management tool. The system's emphasis on clear hierarchy, structured layouts, and intuitive interactions aligns perfectly with the utility-focused nature of task management and reporting.

**Key Principles**:
- Information clarity over visual flourish
- Consistent, predictable interaction patterns
- Efficient data entry and retrieval workflows
- Professional aesthetic suitable for education sector

---

## Typography System

**Font Stack**: 
- Primary: Inter (Google Fonts) - clean, highly legible for forms and data
- Fallback: system-ui, sans-serif

**Hierarchy**:
- **Page Titles**: text-3xl font-bold (Dashboard, Daftar Tugas, Jadwal Kegiatan)
- **Section Headers**: text-xl font-semibold (Tugas Hari Ini, Riwayat Supervisi)
- **Card Titles**: text-lg font-medium (Task names, School names)
- **Body Text**: text-base font-normal (Form labels, descriptions)
- **Metadata/Captions**: text-sm text-gray-600 (Dates, status indicators, photo counts)
- **Buttons**: text-sm font-medium uppercase tracking-wide

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8 consistently
- **Component padding**: p-4 or p-6 for cards/forms
- **Section spacing**: mb-6 or mb-8 between major sections
- **Form field gaps**: gap-4 in form layouts
- **Grid gaps**: gap-6 for card grids

**Page Structure**:
- **Sidebar Navigation** (w-64): Fixed left navigation with all main modules
- **Main Content Area**: max-w-7xl mx-auto px-6 py-8
- **Two-Column Layouts**: For forms with preview (form on left 2/3, summary on right 1/3)
- **Card Grids**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 for task cards and school profiles

---

## Component Library

### Navigation
- **Sidebar**: Vertical navigation with icon + label, active state with subtle background
- **Top Bar**: User profile, notifications, logout in top-right corner
- **Breadcrumbs**: Show current location (Dashboard > Daftar Tugas > Tambah Tugas)

### Forms
- **Input Fields**: Full-width with floating labels, border on focus
- **Dropdowns**: Native select with custom styling for categories (Perencanaan, Pendampingan, Pelaporan)
- **Date Pickers**: Calendar widget for scheduling (Jadwal Kegiatan, Tanggal Kegiatan)
- **Text Areas**: For descriptions and results (Deskripsi/Hasil Kegiatan)
- **File Upload**: Drag-and-drop zone with 2-photo limit indicator, thumbnail previews
- **Checkboxes**: For marking tasks complete (✅ status)

### Data Display
- **Task Cards**: Compact card with title, category badge, date, completion checkbox, action buttons (edit, delete, print)
- **Calendar View**: Month/week view with color-coded event types (Supervisi Akademik vs Manajerial)
- **Tables**: For school profiles list with sortable columns (Nama, Alamat, Kontak, Jumlah Kunjungan)
- **Statistics Cards**: Dashboard metrics (Total Tugas, Sekolah Binaan, Supervisi Bulan Ini) with large numbers
- **Timeline/History**: Vertical timeline for school supervision history

### Actions
- **Primary Buttons**: Solid fill for main actions (Tambah Tugas, Simpan, Cetak, Ekspor PDF)
- **Secondary Buttons**: Outlined for alternative actions (Batal, Lihat Detail)
- **Icon Buttons**: For inline actions (edit, delete, print icons)
- **Floating Action Button**: Bottom-right for quick "Tambah" on mobile

### Overlays
- **Modals**: For forms (Tambah Tugas, Tambah Sekolah) and confirmations (Hapus)
- **Notifications/Snackbar**: Bottom-center for success messages and reminders
- **Photo Viewer**: Full-screen lightbox for uploaded supervision photos

### Special Components
- **Category Badges**: Small colored pills for task types (rounded-full px-3 py-1)
- **Status Indicators**: Icon + text for completion status, report status
- **PDF Export Preview**: Modal showing report layout before download
- **Photo Upload Grid**: 2-slot grid with empty state placeholders

---

## Animations

**Minimal Motion**:
- **None** for page transitions - instant navigation
- **Subtle fade-in** (150ms) for modals and dropdowns only
- **Hover states**: Slight background change on buttons/cards (no movement)
- **Loading spinners**: For PDF generation and data fetching only

---

## Footer

**Credit Display**: Fixed at bottom of all pages
- Text: "designed by @w.yogaswara_kcdXi"
- Style: text-sm text-gray-500 text-center py-4 border-t

---

## Images

**No hero images** - This is a utility application, not a marketing site

**Photo Integration**:
- **Upload Placeholders**: Dashed border boxes (2 slots) showing camera icon and "Upload Foto (Max 2)"
- **Thumbnails**: Small previews (80x80px) in task cards and supervision records
- **Full View**: Click to expand in lightbox overlay

---

## Dashboard Layout

- **Welcome Header**: "Selamat Datang, [Nama Pengawas]" with current date
- **Statistics Row**: 4 metric cards (grid-cols-4) showing key numbers
- **Quick Actions**: Large buttons for common tasks (Tambah Tugas Baru, Lihat Jadwal)
- **Recent Activity**: Table/list of latest 5 tasks and supervisions
- **Upcoming Schedule**: Calendar widget preview with next 3 events