// Quick fix untuk reports.tsx - Copy paste ke browser console
// Jalankan di halaman reports untuk force create data

console.log('🚀 QUICK FIX: Creating data for reports...');

// Create current month data
const currentDate = new Date();
const year = currentDate.getFullYear().toString();
const month = String(currentDate.getMonth() + 1).padStart(2, '0');

// Force create additional tasks
const additionalTasks = [
  {
    id: "quick-task-1",
    name: "Rapat Koordinasi Pengawas Sekolah",
    date: `${year}-${month}-15`,
    location: "Kantor Dinas Pendidikan Provinsi Jawa Barat",
    organizer: "Dinas Pendidikan Provinsi Jawa Barat",
    description: "Rapat koordinasi bulanan membahas program supervisi sekolah, evaluasi kinerja pengawas, dan rencana kegiatan bulan berikutnya.",
    createdAt: `${year}-${month}-15T10:00:00.000Z`
  },
  {
    id: "quick-task-2", 
    name: "Workshop Implementasi Kurikulum Merdeka",
    date: `${year}-${month}-18`,
    location: "LPMP Jawa Barat, Bandung",
    organizer: "LPMP Jawa Barat",
    description: "Workshop pelatihan implementasi kurikulum merdeka untuk pengawas sekolah. Materi meliputi asesmen diagnostik dan pembelajaran berdiferensiasi.",
    createdAt: `${year}-${month}-18T09:00:00.000Z`
  },
  {
    id: "quick-task-3",
    name: "Supervisi Akademik Terpadu",
    date: `${year}-${month}-20`,
    location: "SMKN 4 Garut",
    organizer: "Pengawas Sekolah Wilayah III",
    description: "Kegiatan supervisi akademik terpadu melibatkan beberapa pengawas untuk memberikan pembinaan komprehensif kepada guru-guru.",
    createdAt: `${year}-${month}-20T08:00:00.000Z`
  },
  {
    id: "quick-task-4",
    name: "Bimbingan Teknis Penyusunan RPS",
    date: `${year}-${month}-22`,
    location: "Hotel Savoy Homann, Bandung",
    organizer: "Balai Diklat Keagamaan",
    description: "Bimbingan teknis penyusunan Rencana Pelaksanaan Supervisi (RPS) untuk meningkatkan kualitas supervisi akademik dan manajerial.",
    createdAt: `${year}-${month}-22T13:00:00.000Z`
  },
  {
    id: "quick-task-5",
    name: "Evaluasi Program Sekolah Penggerak",
    date: `${year}-${month}-25`,
    location: "Gedung Sate, Bandung",
    organizer: "Kemendikbudristek",
    description: "Kegiatan evaluasi dan monitoring program sekolah penggerak di wilayah Jawa Barat sebagai evaluator eksternal.",
    createdAt: `${year}-${month}-25T14:00:00.000Z`
  },
  {
    id: "quick-task-6",
    name: "Sosialisasi Asesmen Nasional",
    date: `${year}-${month}-28`,
    location: "Aula LPMP Jawa Barat",
    organizer: "Pusat Asesmen dan Pembelajaran",
    description: "Sosialisasi pelaksanaan Asesmen Nasional tahun 2025, termasuk perubahan kebijakan dan teknis pelaksanaan di sekolah.",
    createdAt: `${year}-${month}-28T10:00:00.000Z`
  }
];

// Create tasks data
const tasks = [
  {
    id: "quick-main-task-1",
    title: "Supervisi Akademik SMKN 1 Garut",
    completed: true,
    date: `${year}-${month}-17`,
    description: "Supervisi pembelajaran mata pelajaran produktif",
    createdAt: `${year}-${month}-17T08:00:00.000Z`
  },
  {
    id: "quick-main-task-2",
    title: "Supervisi Manajerial SMAN 2 Garut",
    completed: true,
    date: `${year}-${month}-21`,
    description: "Supervisi pengelolaan sekolah dan administrasi",
    createdAt: `${year}-${month}-21T09:00:00.000Z`
  },
  {
    id: "quick-main-task-3",
    title: "Monitoring Kurikulum Merdeka",
    completed: false,
    date: `${year}-${month}-24`,
    description: "Monitoring implementasi kurikulum merdeka di sekolah binaan",
    createdAt: `${year}-${month}-24T10:00:00.000Z`
  }
];

// Create supervisions data
const supervisions = [
  {
    id: "quick-supervision-1",
    school: "SMKN 4 Garut",
    type: "Akademik",
    date: `${year}-${month}-16`,
    findings: "Pembelajaran berjalan dengan baik",
    recommendations: "Tingkatkan penggunaan media pembelajaran",
    createdAt: `${year}-${month}-16T09:00:00.000Z`
  },
  {
    id: "quick-supervision-2",
    school: "SMAN 2 Garut",
    type: "Manajerial",
    date: `${year}-${month}-19`,
    findings: "Administrasi sekolah tertib dan lengkap",
    recommendations: "Perbaiki sistem dokumentasi digital",
    createdAt: `${year}-${month}-19T10:00:00.000Z`
  },
  {
    id: "quick-supervision-3",
    school: "SMPN 3 Garut",
    type: "Akademik",
    date: `${year}-${month}-21`,
    findings: "Implementasi kurikulum merdeka berjalan baik",
    recommendations: "Tingkatkan variasi metode pembelajaran",
    createdAt: `${year}-${month}-21T11:00:00.000Z`
  }
];

// FORCE SAVE ALL DATA
localStorage.setItem('additional_tasks_data', JSON.stringify(additionalTasks));
localStorage.setItem('additional_tasks_data_backup', JSON.stringify(additionalTasks));
localStorage.setItem('tasks_data', JSON.stringify(tasks));
localStorage.setItem('tasks_data_backup', JSON.stringify(tasks));
localStorage.setItem('supervisions_data', JSON.stringify(supervisions));
localStorage.setItem('supervisions_data_backup', JSON.stringify(supervisions));

console.log('✅ Data created successfully!');
console.log('📊 Additional Tasks:', additionalTasks.length);
console.log('📊 Tasks:', tasks.length);
console.log('📊 Supervisions:', supervisions.length);
console.log('🔄 Refresh halaman untuk melihat data...');

// Load jsPDF for PDF export
if (typeof window.jsPDF === 'undefined') {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  script.onload = () => {
    console.log('✅ jsPDF loaded for PDF export');
  };
  script.onerror = () => {
    console.log('⚠️ jsPDF failed to load');
  };
  document.head.appendChild(script);
}