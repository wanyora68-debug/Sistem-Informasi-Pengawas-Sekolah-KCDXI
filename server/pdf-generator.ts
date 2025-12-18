import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export interface MonthlyReportData {
  userName: string;
  userNip?: string; // NIP pengawas
  period: string;
  totalTasks: number;
  completedTasks: number;
  supervisions: number;
  additionalTasks: number;
  photos?: string[]; // Array of base64 photo strings
}

export interface YearlyReportData {
  userName: string;
  userNip?: string; // NIP pengawas
  year: string;
  totalSupervisions: number;
  totalTasks: number;
  completedTasks: number;
  schools: number;
  completionRate: number;
  photos?: string[]; // Array of base64 photo strings (max 6)
}

// Helper function to add header
function addHeader(doc: jsPDF, title: string, pageNumber: number) {
  // Header background
  doc.setFillColor(41, 128, 185); // Professional blue
  doc.rect(0, 0, 210, 35, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(title, 105, 15, { align: "center" });
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Dinas Pendidikan Provinsi Jawa Barat", 105, 23, { align: "center" });
  
  // Page number
  doc.setFontSize(9);
  doc.text(`Halaman ${pageNumber}`, 190, 30, { align: "right" });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
}

// Helper function to add footer
function addFooter(doc: jsPDF) {
  const pageHeight = doc.internal.pageSize.height;
  
  // Footer line
  doc.setDrawColor(41, 128, 185);
  doc.setLineWidth(0.5);
  doc.line(20, pageHeight - 20, 190, pageHeight - 20);
  
  // Footer text
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Dibuat pada: ${new Date().toLocaleDateString("id-ID", { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`,
    20,
    pageHeight - 12
  );
  doc.text("Sistem Informasi Pengawas Sekolah", 105, pageHeight - 12, { align: "center" });
  doc.text("designed by @w.yogaswara_kcdXi", 190, pageHeight - 12, { align: "right" });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
}

// Helper function to add cover page
function addCoverPage(doc: jsPDF, title: string, subtitle: string, userName: string, period: string) {
  // Background gradient effect (simulated with rectangles)
  doc.setFillColor(41, 128, 185);
  doc.rect(0, 0, 210, 297, 'F');
  
  doc.setFillColor(52, 152, 219);
  doc.circle(105, 100, 80, 'F');
  
  // White content box
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(30, 80, 150, 140, 5, 5, 'F');
  
  // Title
  doc.setTextColor(41, 128, 185);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(title, 105, 110, { align: "center" });
  
  // Subtitle
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text(subtitle, 105, 125, { align: "center" });
  
  // Divider
  doc.setDrawColor(41, 128, 185);
  doc.setLineWidth(1);
  doc.line(50, 135, 160, 135);
  
  // User info
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Nama Pengawas:", 105, 155, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.text(userName, 105, 165, { align: "center" });
  
  doc.setFont("helvetica", "bold");
  doc.text("Periode:", 105, 180, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.text(period, 105, 190, { align: "center" });
  
  // Footer
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("Dinas Pendidikan Provinsi Jawa Barat", 105, 260, { align: "center" });
  doc.setFontSize(8);
  doc.text("Sistem Informasi Pengawas Sekolah", 105, 270, { align: "center" });
  
  // Reset colors
  doc.setTextColor(0, 0, 0);
}

export function generateMonthlyPDF(data: MonthlyReportData): Buffer {
  const doc = new jsPDF();
  
  // Page 1: Cover Page
  addCoverPage(doc, "LAPORAN BULANAN", "Kegiatan Pengawas Sekolah", data.userName, data.period);
  
  // Page 2: Content
  doc.addPage();
  addHeader(doc, "LAPORAN BULANAN", 2);
  
  // Section: Informasi Umum
  let yPos = 45;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(41, 128, 185);
  doc.text("INFORMASI UMUM", 20, yPos);
  
  // Info box - adjust height based on NIP availability
  const infoBoxHeight = data.userNip ? 35 : 25;
  doc.setFillColor(240, 248, 255);
  doc.roundedRect(20, yPos + 5, 170, infoBoxHeight, 2, 2, 'F');
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", "bold");
  doc.text("Nama Pengawas:", 25, yPos + 13);
  doc.setFont("helvetica", "normal");
  doc.text(data.userName, 85, yPos + 13);
  
  // Add NIP if available
  if (data.userNip) {
    doc.setFont("helvetica", "bold");
    doc.text("NIP:", 25, yPos + 22);
    doc.setFont("helvetica", "normal");
    doc.text(data.userNip, 85, yPos + 22);
    
    doc.setFont("helvetica", "bold");
    doc.text("Periode Laporan:", 25, yPos + 31);
    doc.setFont("helvetica", "normal");
    doc.text(data.period, 85, yPos + 31);
  } else {
    doc.setFont("helvetica", "bold");
    doc.text("Periode Laporan:", 25, yPos + 22);
    doc.setFont("helvetica", "normal");
    doc.text(data.period, 85, yPos + 22);
  }
  
  // Section: Ringkasan Kegiatan
  yPos += data.userNip ? 50 : 40;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(41, 128, 185);
  doc.text("RINGKASAN KEGIATAN", 20, yPos);
  
  const completionRate = data.totalTasks > 0
    ? Math.round((data.completedTasks / data.totalTasks) * 100)
    : 0;
  
  const statsData = [
    ["Total Tugas", data.totalTasks.toString()],
    ["Tugas Selesai", data.completedTasks.toString()],
    ["Tugas Belum Selesai", (data.totalTasks - data.completedTasks).toString()],
    ["Supervisi Dilakukan", data.supervisions.toString()],
    ["Tugas Tambahan", data.additionalTasks.toString()],
    ["Tingkat Penyelesaian", `${completionRate}%`],
  ];

  autoTable(doc, {
    startY: yPos + 5,
    head: [["Kategori", "Jumlah"]],
    body: statsData,
    theme: "striped",
    headStyles: { 
      fillColor: [41, 128, 185],
      fontSize: 11,
      fontStyle: "bold",
      halign: "center"
    },
    bodyStyles: {
      fontSize: 10
    },
    columnStyles: {
      0: { cellWidth: 120, fontStyle: "bold" },
      1: { cellWidth: 50, halign: "center" }
    },
    margin: { left: 20, right: 20 },
  });

  // Performance indicator
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  yPos = finalY + 15;
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(41, 128, 185);
  doc.text("INDIKATOR KINERJA", 20, yPos);
  
  // Performance box
  let performanceColor: [number, number, number];
  let performanceText: string;
  
  if (completionRate >= 90) {
    performanceColor = [46, 204, 113]; // Green
    performanceText = "SANGAT BAIK";
  } else if (completionRate >= 75) {
    performanceColor = [52, 152, 219]; // Blue
    performanceText = "BAIK";
  } else if (completionRate >= 60) {
    performanceColor = [241, 196, 15]; // Yellow
    performanceText = "CUKUP";
  } else {
    performanceColor = [231, 76, 60]; // Red
    performanceText = "PERLU DITINGKATKAN";
  }
  
  doc.setFillColor(performanceColor[0], performanceColor[1], performanceColor[2]);
  doc.roundedRect(20, yPos + 5, 170, 30, 3, 3, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`Tingkat Penyelesaian: ${completionRate}%`, 105, yPos + 18, { align: "center" });
  doc.setFontSize(12);
  doc.text(`Status: ${performanceText}`, 105, yPos + 28, { align: "center" });
  
  // Notes section
  yPos += 45;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(60, 60, 60);
  doc.text("Catatan:", 20, yPos);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const notes = [
    `• Total ${data.supervisions} supervisi telah dilakukan pada periode ${data.period}`,
    `• Dari ${data.totalTasks} tugas, ${data.completedTasks} tugas telah diselesaikan`,
    `• Terdapat ${data.additionalTasks} tugas tambahan yang telah dikerjakan`,
  ];
  
  yPos += 7;
  notes.forEach((note) => {
    doc.text(note, 20, yPos);
    yPos += 6;
  });
  
  // Photos section (if available)
  if (data.photos && data.photos.length > 0) {
    console.log(`[PDF] Adding ${data.photos.length} photos to PDF`);
    
    // Validate and filter photos
    const validPhotos = data.photos.filter(photo => {
      if (!photo || typeof photo !== 'string') {
        console.error('[PDF] Invalid photo: not a string');
        return false;
      }
      if (!photo.startsWith('data:image/')) {
        console.error('[PDF] Invalid photo: missing data:image/ prefix');
        return false;
      }
      return true;
    });
    
    console.log(`[PDF] Valid photos: ${validPhotos.length} out of ${data.photos.length}`);
    
    if (validPhotos.length === 0) {
      console.error('[PDF] No valid photos to display');
      // Continue without photos
    }
    
    // Calculate space needed for photos
    const photosToShow = validPhotos.slice(0, 6);
    const photoWidth = 80;
    const photoHeight = 60;
    const spacing = 10;
    const rows = Math.ceil(photosToShow.length / 2);
    const totalPhotoHeight = (rows * photoHeight) + ((rows - 1) * spacing) + 40; // +40 for title and spacing
    
    // Check if we need a new page (more conservative check)
    if (yPos + totalPhotoHeight > 270) {
      doc.addPage();
      addHeader(doc, "LAPORAN BULANAN", 3);
      yPos = 45;
    } else {
      yPos += 15;
    }
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41, 128, 185);
    doc.text("BUKTI KEGIATAN", 20, yPos);
    
    yPos += 10;
    
    // Display photos in grid (2 columns, max 6 photos)
    const startX = 20;
    
    photosToShow.forEach((photo, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = startX + (col * (photoWidth + spacing));
      const y = yPos + (row * (photoHeight + spacing));
      
      try {
        console.log(`[PDF] Adding photo ${index + 1} at position (${x}, ${y})`);
        doc.addImage(photo, 'JPEG', x, y, photoWidth, photoHeight);
        
        // Add photo number
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Foto ${index + 1}`, x + photoWidth / 2, y + photoHeight + 5, { align: "center" });
        console.log(`[PDF] Successfully added photo ${index + 1}`);
      } catch (error) {
        console.error(`[PDF] Error adding photo ${index + 1}:`, error);
        console.error(`[PDF] Photo prefix: ${photo?.substring(0, 50)}`);
      }
    });
  } else {
    console.log('[PDF] No photos provided for PDF generation');
  }
  
  // Footer
  addFooter(doc);

  return Buffer.from(doc.output("arraybuffer"));
}

export function generateYearlyPDF(data: YearlyReportData): Buffer {
  const doc = new jsPDF();
  
  // Page 1: Cover Page
  addCoverPage(doc, "LAPORAN TAHUNAN", "Kegiatan Pengawas Sekolah", data.userName, `Tahun ${data.year}`);
  
  // Page 2: Content
  doc.addPage();
  addHeader(doc, "LAPORAN TAHUNAN", 2);
  
  // Section: Informasi Umum
  let yPos = 45;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(41, 128, 185);
  doc.text("INFORMASI UMUM", 20, yPos);
  
  // Info box - adjust height based on NIP availability
  const infoBoxHeight = data.userNip ? 35 : 25;
  doc.setFillColor(240, 248, 255);
  doc.roundedRect(20, yPos + 5, 170, infoBoxHeight, 2, 2, 'F');
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", "bold");
  doc.text("Nama Pengawas:", 25, yPos + 13);
  doc.setFont("helvetica", "normal");
  doc.text(data.userName, 85, yPos + 13);
  
  // Add NIP if available
  if (data.userNip) {
    doc.setFont("helvetica", "bold");
    doc.text("NIP:", 25, yPos + 22);
    doc.setFont("helvetica", "normal");
    doc.text(data.userNip, 85, yPos + 22);
    
    doc.setFont("helvetica", "bold");
    doc.text("Tahun Laporan:", 25, yPos + 31);
    doc.setFont("helvetica", "normal");
    doc.text(data.year, 85, yPos + 31);
  } else {
    doc.setFont("helvetica", "bold");
    doc.text("Tahun Laporan:", 25, yPos + 22);
    doc.setFont("helvetica", "normal");
    doc.text(data.year, 85, yPos + 22);
  }
  
  // Section: Ringkasan Tahunan
  yPos += data.userNip ? 50 : 40;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(41, 128, 185);
  doc.text("RINGKASAN KEGIATAN TAHUNAN", 20, yPos);
  
  const avgSupervisionPerMonth = Math.round(data.totalSupervisions / 12);
  const avgSupervisionPerSchool = data.schools > 0 
    ? (data.totalSupervisions / data.schools).toFixed(1)
    : "0";
  
  const statsData = [
    ["Total Supervisi", data.totalSupervisions.toString()],
    ["Total Tugas", data.totalTasks.toString()],
    ["Tugas Selesai", data.completedTasks.toString()],
    ["Tugas Belum Selesai", (data.totalTasks - data.completedTasks).toString()],
    ["Sekolah Binaan", data.schools.toString()],
    ["Tingkat Penyelesaian", `${data.completionRate}%`],
    ["Rata-rata Supervisi/Bulan", avgSupervisionPerMonth.toString()],
    ["Rata-rata Supervisi/Sekolah", avgSupervisionPerSchool],
  ];

  autoTable(doc, {
    startY: yPos + 5,
    head: [["Kategori", "Jumlah"]],
    body: statsData,
    theme: "striped",
    headStyles: { 
      fillColor: [41, 128, 185],
      fontSize: 11,
      fontStyle: "bold",
      halign: "center"
    },
    bodyStyles: {
      fontSize: 10
    },
    columnStyles: {
      0: { cellWidth: 120, fontStyle: "bold" },
      1: { cellWidth: 50, halign: "center" }
    },
    margin: { left: 20, right: 20 },
  });

  // Performance indicator
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  yPos = finalY + 15;
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(41, 128, 185);
  doc.text("INDIKATOR KINERJA TAHUNAN", 20, yPos);
  
  // Performance box
  let performanceColor: [number, number, number];
  let performanceText: string;
  
  if (data.completionRate >= 90) {
    performanceColor = [46, 204, 113]; // Green
    performanceText = "SANGAT BAIK";
  } else if (data.completionRate >= 75) {
    performanceColor = [52, 152, 219]; // Blue
    performanceText = "BAIK";
  } else if (data.completionRate >= 60) {
    performanceColor = [241, 196, 15]; // Yellow
    performanceText = "CUKUP";
  } else {
    performanceColor = [231, 76, 60]; // Red
    performanceText = "PERLU DITINGKATKAN";
  }
  
  doc.setFillColor(performanceColor[0], performanceColor[1], performanceColor[2]);
  doc.roundedRect(20, yPos + 5, 170, 30, 3, 3, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`Tingkat Penyelesaian: ${data.completionRate}%`, 105, yPos + 18, { align: "center" });
  doc.setFontSize(12);
  doc.text(`Status: ${performanceText}`, 105, yPos + 28, { align: "center" });
  
  // Highlights section
  yPos += 45;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(41, 128, 185);
  doc.text("HIGHLIGHTS TAHUN " + data.year, 20, yPos);
  
  // Highlight boxes
  yPos += 10;
  const highlights = [
    { label: "Total Supervisi", value: data.totalSupervisions.toString(), color: [52, 152, 219] },
    { label: "Sekolah Binaan", value: data.schools.toString(), color: [46, 204, 113] },
    { label: "Penyelesaian", value: `${data.completionRate}%`, color: [155, 89, 182] },
  ];
  
  const boxWidth = 50;
  const boxHeight = 35;
  const spacing = 10;
  const startX = 20;
  
  highlights.forEach((highlight, index) => {
    const x = startX + (index * (boxWidth + spacing));
    
    doc.setFillColor(highlight.color[0], highlight.color[1], highlight.color[2]);
    doc.roundedRect(x, yPos, boxWidth, infoBoxHeight, 2, 2, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(highlight.value, x + boxWidth / 2, yPos + 15, { align: "center" });
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(highlight.label, x + boxWidth / 2, yPos + 25, { align: "center" });
  });
  
  // Summary section
  yPos += 50;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(60, 60, 60);
  doc.text("Kesimpulan:", 20, yPos);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const summary = [
    `• Sepanjang tahun ${data.year}, telah dilakukan ${data.totalSupervisions} supervisi`,
    `• Membina ${data.schools} sekolah dengan rata-rata ${avgSupervisionPerMonth} kunjungan per bulan`,
    `• Tingkat penyelesaian tugas mencapai ${data.completionRate}%, menunjukkan kinerja yang ${performanceText.toLowerCase()}`,
    `• Setiap sekolah binaan rata-rata dikunjungi ${avgSupervisionPerSchool} kali dalam setahun`,
  ];
  
  yPos += 7;
  summary.forEach((line) => {
    doc.text(line, 20, yPos);
    yPos += 6;
  });
  
  // Photos section (if available)
  if (data.photos && data.photos.length > 0) {
    console.log(`[PDF] Adding ${data.photos.length} photos to yearly PDF`);
    
    // Validate and filter photos
    const validPhotos = data.photos.filter(photo => {
      if (!photo || typeof photo !== 'string') {
        console.error('[PDF] Invalid photo: not a string');
        return false;
      }
      if (!photo.startsWith('data:image/')) {
        console.error('[PDF] Invalid photo: missing data:image/ prefix');
        return false;
      }
      return true;
    });
    
    console.log(`[PDF] Valid photos: ${validPhotos.length} out of ${data.photos.length}`);
    
    if (validPhotos.length > 0) {
      // Calculate space needed for photos
      const photosToShow = validPhotos.slice(0, 6);
      const photoWidth = 80;
      const photoHeight = 60;
      const spacing = 10;
      const rows = Math.ceil(photosToShow.length / 2);
      const totalPhotoHeight = (rows * photoHeight) + ((rows - 1) * spacing) + 40; // +40 for title and spacing
      
      // Check if we need a new page (more conservative check)
      if (yPos + totalPhotoHeight > 270) {
        doc.addPage();
        addHeader(doc, "LAPORAN TAHUNAN", 3);
        yPos = 45;
      } else {
        yPos += 15;
      }
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(41, 128, 185);
      doc.text("BUKTI KEGIATAN TAHUNAN", 20, yPos);
      
      yPos += 10;
      
      // Display photos in grid (2 columns, max 6 photos)
      const startX = 20;
      
      photosToShow.forEach((photo, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const x = startX + (col * (photoWidth + spacing));
        const y = yPos + (row * (photoHeight + spacing));
        
        try {
          console.log(`[PDF] Adding yearly photo ${index + 1} at position (${x}, ${y})`);
          doc.addImage(photo, 'JPEG', x, y, photoWidth, photoHeight);
          
          // Add photo number
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          doc.text(`Foto ${index + 1}`, x + photoWidth / 2, y + photoHeight + 5, { align: "center" });
          console.log(`[PDF] Successfully added yearly photo ${index + 1}`);
        } catch (error) {
          console.error(`[PDF] Error adding yearly photo ${index + 1}:`, error);
          console.error(`[PDF] Photo prefix: ${photo?.substring(0, 50)}`);
        }
      });
    }
  } else {
    console.log('[PDF] No photos provided for yearly PDF generation');
  }
  
  // Footer
  addFooter(doc);

  return Buffer.from(doc.output("arraybuffer"));
}
