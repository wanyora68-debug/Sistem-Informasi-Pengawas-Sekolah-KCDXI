import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export interface MonthlyReportData {
  userName: string;
  period: string;
  totalTasks: number;
  completedTasks: number;
  supervisions: number;
  additionalTasks: number;
}

export interface YearlyReportData {
  userName: string;
  year: string;
  totalSupervisions: number;
  totalTasks: number;
  completedTasks: number;
  schools: number;
  completionRate: number;
}

export function generateMonthlyPDF(data: MonthlyReportData): Buffer {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.text("LAPORAN BULANAN", 105, 20, { align: "center" });
  doc.setFontSize(14);
  doc.text("Pengawas Sekolah", 105, 28, { align: "center" });

  // User info
  doc.setFontSize(11);
  doc.text(`Nama: ${data.userName}`, 20, 45);
  doc.text(`Periode: ${data.period}`, 20, 52);

  // Divider
  doc.setLineWidth(0.5);
  doc.line(20, 60, 190, 60);

  // Statistics
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("RINGKASAN KEGIATAN", 20, 70);

  const statsData = [
    ["Total Tugas", data.totalTasks.toString()],
    ["Tugas Selesai", data.completedTasks.toString()],
    ["Supervisi Dilakukan", data.supervisions.toString()],
    ["Tugas Tambahan", data.additionalTasks.toString()],
    [
      "Tingkat Penyelesaian",
      data.totalTasks > 0
        ? `${Math.round((data.completedTasks / data.totalTasks) * 100)}%`
        : "0%",
    ],
  ];

  autoTable(doc, {
    startY: 75,
    head: [["Kategori", "Jumlah"]],
    body: statsData,
    theme: "grid",
    headStyles: { fillColor: [66, 133, 244] },
  });

  // Footer
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  doc.setFontSize(10);
  doc.text(`Dibuat pada: ${new Date().toLocaleDateString("id-ID")}`, 20, finalY + 20);
  doc.text("designed by @w.yogaswara_kcdXi", 105, 285, { align: "center" });

  return Buffer.from(doc.output("arraybuffer"));
}

export function generateYearlyPDF(data: YearlyReportData): Buffer {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.text("LAPORAN TAHUNAN", 105, 20, { align: "center" });
  doc.setFontSize(14);
  doc.text("Pengawas Sekolah", 105, 28, { align: "center" });

  // User info
  doc.setFontSize(11);
  doc.text(`Nama: ${data.userName}`, 20, 45);
  doc.text(`Tahun: ${data.year}`, 20, 52);

  // Divider
  doc.setLineWidth(0.5);
  doc.line(20, 60, 190, 60);

  // Statistics
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("RINGKASAN TAHUNAN", 20, 70);

  const statsData = [
    ["Total Supervisi", data.totalSupervisions.toString()],
    ["Total Tugas", data.totalTasks.toString()],
    ["Tugas Selesai", data.completedTasks.toString()],
    ["Sekolah Binaan", data.schools.toString()],
    ["Tingkat Penyelesaian", `${data.completionRate}%`],
    [
      "Rata-rata Supervisi/Bulan",
      Math.round(data.totalSupervisions / 12).toString(),
    ],
  ];

  autoTable(doc, {
    startY: 75,
    head: [["Kategori", "Jumlah"]],
    body: statsData,
    theme: "grid",
    headStyles: { fillColor: [66, 133, 244] },
  });

  // Summary
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Kesimpulan:", 20, finalY + 15);
  doc.setFontSize(10);
  
  const summary = [
    `• Total ${data.totalSupervisions} supervisi dilakukan sepanjang tahun ${data.year}`,
    `• Membina ${data.schools} sekolah dengan rata-rata ${Math.round(data.totalSupervisions / 12)} kunjungan per bulan`,
    `• Tingkat penyelesaian tugas mencapai ${data.completionRate}%`,
  ];

  let yPos = finalY + 22;
  summary.forEach((line) => {
    doc.text(line, 20, yPos);
    yPos += 7;
  });

  // Footer
  doc.setFontSize(10);
  doc.text(`Dibuat pada: ${new Date().toLocaleDateString("id-ID")}`, 20, yPos + 10);
  doc.text("designed by @w.yogaswara_kcdXi", 105, 285, { align: "center" });

  return Buffer.from(doc.output("arraybuffer"));
}
