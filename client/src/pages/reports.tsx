import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Calendar, MapPin, Users, Image as ImageIcon, Printer, TrendingUp, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState("semua");
  // Fetch all activities with photos
  const { data: allActivities = [], isLoading } = useQuery({
    queryKey: ['all-activities'],
    queryFn: () => {
      try {
        const activities: any[] = [];
        
        // Get additional tasks
        const additionalTasksData = localStorage.getItem('additional_tasks_data');
        if (additionalTasksData) {
          const additionalTasks = JSON.parse(additionalTasksData);
          additionalTasks.forEach((task: any) => {
            activities.push({
              id: task.id,
              type: 'Tugas Tambahan',
              title: task.name,
              date: task.date,
              location: task.location,
              organizer: task.organizer,
              description: task.description,
              photo1: task.photo1,
              photo2: task.photo2,
              createdAt: task.createdAt
            });
          });
        }
        
        // Get supervisions
        const supervisionsData = localStorage.getItem('supervisions_data');
        if (supervisionsData) {
          const supervisions = JSON.parse(supervisionsData);
          supervisions.forEach((supervision: any) => {
            activities.push({
              id: supervision.id,
              type: 'Supervisi',
              title: `Supervisi ${supervision.school}`,
              date: supervision.date,
              location: supervision.school,
              organizer: 'Pengawas Sekolah',
              description: supervision.findings || supervision.notes,
              photo1: supervision.photo1,
              photo2: supervision.photo2,
              createdAt: supervision.createdAt
            });
          });
        }
        
        // Get tasks
        const tasksData = localStorage.getItem('tasks_data');
        if (tasksData) {
          const tasks = JSON.parse(tasksData);
          tasks.forEach((task: any) => {
            activities.push({
              id: task.id,
              type: 'Tugas Pokok',
              title: task.title,
              date: task.dueDate || task.date,
              location: task.location || 'Sekolah Binaan',
              organizer: 'Pengawas Sekolah',
              description: task.description,
              photo1: task.photo1,
              photo2: task.photo2,
              createdAt: task.createdAt
            });
          });
        }
        
        // Sort by date (newest first)
        return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      } catch (error) {
        console.error('Error loading activities:', error);
        return [];
      }
    },
    refetchInterval: 5000,
  });

  // Filter activities by period
  const getFilteredActivities = (period: string) => {
    if (period === "semua") return allActivities;
    
    if (period === "bulanan") {
      return allActivities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate.getMonth() === selectedMonth && 
               activityDate.getFullYear() === selectedYear;
      });
    }
    
    if (period === "tahunan") {
      return allActivities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate.getFullYear() === selectedYear;
      });
    }
    
    return allActivities;
  };

  // Get months list
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  // Get years list (dinamis: 2 tahun sebelumnya, tahun sekarang, dan 2 tahun ke depan)
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Tugas Tambahan': return 'bg-blue-100 text-blue-800';
      case 'Supervisi': return 'bg-green-100 text-green-800';
      case 'Tugas Pokok': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportPDF = (period: string = "semua") => {
    try {
      const activitiesToExport = getFilteredActivities(period);
      
      // Generate PDF content with filtered data
      const generatePDFContent = () => {
        // Get profile data
        const profileData = localStorage.getItem('profile_data') || localStorage.getItem('user_data');
        const profile = profileData ? JSON.parse(profileData) : null;
        
        // Generate period title
        const getPeriodTitle = () => {
          if (period === "bulanan") {
            return `Periode: ${months[selectedMonth]} ${selectedYear}`;
          } else if (period === "tahunan") {
            return `Periode: Tahun ${selectedYear}`;
          }
          return `Periode: Semua Aktivitas`;
        };
        
        // Generate quality analysis (analisis kualitas kegiatan)
        const generateQualityAnalysis = () => {
          // Calculate quality indicators
          const totalActivities = activitiesToExport.length;
          const activitiesWithPhotos = activitiesToExport.filter(a => a.photo1 || a.photo2).length;
          const activitiesWithDescription = activitiesToExport.filter(a => a.description && a.description.length > 50).length;
          const activitiesThisMonth = activitiesToExport.filter(a => {
            const activityDate = new Date(a.date);
            const currentDate = new Date();
            return activityDate.getMonth() === currentDate.getMonth() && 
                   activityDate.getFullYear() === currentDate.getFullYear();
          }).length;
          
          // Calculate percentages
          const photoDocumentationRate = totalActivities > 0 ? Math.round((activitiesWithPhotos / totalActivities) * 100) : 0;
          const descriptionCompleteness = totalActivities > 0 ? Math.round((activitiesWithDescription / totalActivities) * 100) : 0;
          const activityConsistency = totalActivities > 0 ? Math.min(100, Math.round((activitiesThisMonth / 3) * 100)) : 0; // Target 3 per month
          
          // Overall quality score (average of all indicators)
          const overallQuality = Math.round((photoDocumentationRate + descriptionCompleteness + activityConsistency) / 3);
          
          // Quality level determination
          const getQualityLevel = (score: number) => {
            if (score >= 90) return { level: 'Sangat Baik', color: '#16a34a', bg: '#dcfce7' };
            if (score >= 75) return { level: 'Baik', color: '#2563eb', bg: '#dbeafe' };
            if (score >= 60) return { level: 'Cukup', color: '#d97706', bg: '#fed7aa' };
            return { level: 'Perlu Perbaikan', color: '#dc2626', bg: '#fecaca' };
          };
          
          const qualityInfo = getQualityLevel(overallQuality);
          
          return `
            <div class="quality-analysis">
              <div style="font-size: 14px; font-weight: bold; margin-bottom: 12px; color: #0c4a6e; text-align: center;">
                📊 Analisis Kualitas Kegiatan
              </div>
              
              <div class="quality-grid">
                <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">
                  <h4 style="color: #1f2937; font-size: 12px; font-weight: bold; margin-bottom: 8px;">Indikator Kualitas</h4>
                  <div style="margin-bottom: 6px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
                      <span style="font-size: 10px; color: #374151;">Dokumentasi Foto</span>
                      <span style="font-size: 10px; font-weight: bold; color: ${photoDocumentationRate >= 75 ? '#16a34a' : photoDocumentationRate >= 50 ? '#d97706' : '#dc2626'};">${photoDocumentationRate}%</span>
                    </div>
                    <div style="background: #e5e7eb; height: 4px; border-radius: 2px;">
                      <div style="background: ${photoDocumentationRate >= 75 ? '#16a34a' : photoDocumentationRate >= 50 ? '#d97706' : '#dc2626'}; height: 100%; width: ${photoDocumentationRate}%; border-radius: 2px;"></div>
                    </div>
                  </div>
                  
                  <div style="margin-bottom: 6px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
                      <span style="font-size: 10px; color: #374151;">Kelengkapan Deskripsi</span>
                      <span style="font-size: 10px; font-weight: bold; color: ${descriptionCompleteness >= 75 ? '#16a34a' : descriptionCompleteness >= 50 ? '#d97706' : '#dc2626'};">${descriptionCompleteness}%</span>
                    </div>
                    <div style="background: #e5e7eb; height: 4px; border-radius: 2px;">
                      <div style="background: ${descriptionCompleteness >= 75 ? '#16a34a' : descriptionCompleteness >= 50 ? '#d97706' : '#dc2626'}; height: 100%; width: ${descriptionCompleteness}%; border-radius: 2px;"></div>
                    </div>
                  </div>
                  
                  <div style="margin-bottom: 6px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
                      <span style="font-size: 10px; color: #374151;">Konsistensi Kegiatan</span>
                      <span style="font-size: 10px; font-weight: bold; color: ${activityConsistency >= 75 ? '#16a34a' : activityConsistency >= 50 ? '#d97706' : '#dc2626'};">${activityConsistency}%</span>
                    </div>
                    <div style="background: #e5e7eb; height: 4px; border-radius: 2px;">
                      <div style="background: ${activityConsistency >= 75 ? '#16a34a' : activityConsistency >= 50 ? '#d97706' : '#dc2626'}; height: 100%; width: ${activityConsistency}%; border-radius: 2px;"></div>
                    </div>
                  </div>
                </div>
                
                <div style="background: ${qualityInfo.bg}; padding: 12px; border-radius: 6px; border: 2px solid ${qualityInfo.color}; text-align: center;">
                  <h4 style="color: ${qualityInfo.color}; font-size: 11px; font-weight: bold; margin-bottom: 8px;">Skor Kualitas Keseluruhan</h4>
                  <div style="font-size: 28px; font-weight: bold; color: ${qualityInfo.color}; margin-bottom: 6px;">${overallQuality}%</div>
                  <div style="background: ${qualityInfo.color}; color: white; padding: 4px 8px; border-radius: 15px; font-size: 9px; font-weight: bold; display: inline-block;">
                    ${qualityInfo.level}
                  </div>
                </div>
              </div>
              
              <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">
                <h4 style="color: #1f2937; font-size: 12px; font-weight: bold; margin-bottom: 8px;">📈 Rekomendasi Peningkatan</h4>
                <ul style="margin: 0; padding-left: 15px; font-size: 10px; line-height: 1.4; color: #374151;">
                  ${photoDocumentationRate < 75 ? '<li>Tingkatkan dokumentasi foto untuk setiap kegiatan (target: minimal 1 foto per kegiatan)</li>' : ''}
                  ${descriptionCompleteness < 75 ? '<li>Lengkapi deskripsi kegiatan dengan detail hasil dan manfaat yang diperoleh</li>' : ''}
                  ${activityConsistency < 75 ? '<li>Pertahankan konsistensi pelaksanaan kegiatan (target: minimal 3 kegiatan per bulan)</li>' : ''}
                  ${overallQuality >= 90 ? '<li>Pertahankan kualitas kegiatan yang sangat baik dan jadikan sebagai best practice</li>' : ''}
                  ${overallQuality >= 75 && overallQuality < 90 ? '<li>Tingkatkan aspek yang masih kurang untuk mencapai level "Sangat Baik"</li>' : ''}
                  <li>Lakukan evaluasi berkala untuk memastikan peningkatan kualitas kegiatan secara berkelanjutan</li>
                </ul>
              </div>
            </div>
          `;
        };
        const generateActivitiesSummary = () => {
          const activitiesByType = {
            'Tugas Tambahan': activitiesToExport.filter(a => a.type === 'Tugas Tambahan'),
            'Supervisi': activitiesToExport.filter(a => a.type === 'Supervisi'),
            'Tugas Pokok': activitiesToExport.filter(a => a.type === 'Tugas Pokok')
          };
          
          return Object.entries(activitiesByType).map(([type, activities]) => {
            if (activities.length === 0) return '';
            
            const typeColor = type === 'Tugas Tambahan' ? '#1e40af' : type === 'Supervisi' ? '#166534' : '#7c3aed';
            
            return `
              <div style="margin-bottom: 20px;">
                <h4 style="color: ${typeColor}; font-size: 16px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">
                  ${type} (${activities.length} kegiatan)
                </h4>
                <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
                  ${activities.map(activity => `
                    <li style="margin-bottom: 8px; font-size: 14px;">
                      <strong>${activity.title}</strong> - ${formatDate(activity.date)} di ${activity.location}
                      ${activity.description ? `<br><span style="color: #6b7280; font-size: 13px; font-style: italic;">${activity.description.substring(0, 100)}${activity.description.length > 100 ? '...' : ''}</span>` : ''}
                    </li>
                  `).join('')}
                </ul>
              </div>
            `;
          }).join('');
        };
        
        // Collect all photos (maksimal 6)
        const allPhotos: any[] = [];
        activitiesToExport.forEach(activity => {
          if (activity.photo1) allPhotos.push({ src: activity.photo1, caption: `${activity.title} - Foto 1` });
          if (activity.photo2) allPhotos.push({ src: activity.photo2, caption: `${activity.title} - Foto 2` });
        });
        
        // Limit to 6 photos
        const selectedPhotos = allPhotos.slice(0, 6);
        
        const photosHTML = selectedPhotos.length > 0 ? `
            <div style="margin: 20px 0; page-break-inside: avoid;" class="no-break">
              <div style="font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                Bukti Kegiatan (Dokumentasi Foto)
              </div>
              <div class="photos-grid">
                ${selectedPhotos.map((photo, index) => `
                  <div class="photo-item">
                    <img src="${photo.src}" alt="Foto ${index + 1}" />
                    <p class="photo-caption">
                      Foto ${index + 1}: ${photo.caption.length > 35 ? photo.caption.substring(0, 35) + '...' : photo.caption}
                    </p>
                  </div>
                `).join('')}
              </div>
              ${allPhotos.length > 6 ? `
                <p style="text-align: center; margin-top: 12px; font-size: 10px; color: #6b7280; font-style: italic;">
                  Menampilkan 6 dari ${allPhotos.length} foto dokumentasi kegiatan
                </p>
              ` : ''}
            </div>
        ` : '';
        
        return `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <title>Laporan Aktivitas Pengawas Sekolah</title>
              <style>
                @page {
                  size: A4 portrait;
                  margin: 15mm 20mm 20mm 20mm;
                }
                
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                
                body {
                  font-family: 'Times New Roman', serif;
                  font-size: 12px;
                  line-height: 1.4;
                  color: #333;
                  background: white;
                  max-width: 210mm;
                  margin: 0 auto;
                  padding: 0;
                }
                
                .page-break {
                  page-break-before: always;
                }
                
                .no-break {
                  page-break-inside: avoid;
                }
                
                .header {
                  text-align: center;
                  margin-bottom: 25mm;
                  border-bottom: 3px solid #2563eb;
                  padding-bottom: 20px;
                }
                
                .header h1 {
                  font-size: 18px;
                  font-weight: bold;
                  margin-bottom: 6px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  color: #1f2937;
                  line-height: 1.2;
                }
                
                .header h2 {
                  font-size: 14px;
                  font-weight: normal;
                  color: #6b7280;
                  margin-bottom: 4px;
                  line-height: 1.2;
                }
                
                .header h3 {
                  font-size: 12px;
                  font-weight: 600;
                  color: #1e40af;
                  margin-bottom: 8px;
                }
                
                .summary-section {
                  margin: 15px 0;
                  padding: 12px;
                  background: #f9fafb;
                  border-left: 4px solid #2563eb;
                  border-radius: 4px;
                  page-break-inside: avoid;
                }
                
                .summary-title {
                  font-size: 14px;
                  font-weight: bold;
                  margin-bottom: 12px;
                  color: #1f2937;
                }
                
                .stats-grid {
                  display: grid;
                  grid-template-columns: repeat(3, 1fr);
                  gap: 10px;
                  margin-bottom: 15px;
                }
                
                .stat-item {
                  text-align: center;
                  padding: 10px;
                  background: white;
                  border: 1px solid #e5e7eb;
                  border-radius: 6px;
                  font-size: 11px;
                }
                
                .stat-number {
                  font-size: 20px;
                  font-weight: bold;
                  margin-bottom: 4px;
                  color: #2563eb;
                }
                
                .stat-label {
                  font-size: 10px;
                  text-transform: uppercase;
                  font-weight: 600;
                  color: #6b7280;
                }
                
                .activities-section {
                  margin: 20px 0;
                  page-break-inside: avoid;
                }
                
                .section-title {
                  font-size: 16px;
                  font-weight: bold;
                  margin-bottom: 15px;
                  color: #1f2937;
                  border-bottom: 2px solid #e5e7eb;
                  padding-bottom: 8px;
                }
                
                .signature-section {
                  margin-top: 30px;
                  text-align: right;
                  page-break-inside: avoid;
                }
                
                .signature-date {
                  margin-bottom: 12px;
                  font-size: 12px;
                }
                
                .signature-title {
                  margin-bottom: 60px;
                  font-size: 12px;
                  font-weight: 600;
                }
                
                .signature-name {
                  font-weight: bold;
                  border-bottom: 2px solid #333;
                  display: inline-block;
                  min-width: 200px;
                  text-align: center;
                  padding-bottom: 4px;
                  font-size: 12px;
                }
                
                /* A4 Specific Optimizations */
                .quality-analysis {
                  margin: 15px 0;
                  padding: 15px;
                  background: #f0f9ff;
                  border: 2px solid #0ea5e9;
                  border-radius: 6px;
                  page-break-inside: avoid;
                  font-size: 11px;
                }
                
                .quality-grid {
                  display: grid;
                  grid-template-columns: 1.2fr 0.8fr;
                  gap: 15px;
                  margin-bottom: 15px;
                }
                
                .photos-grid {
                  display: grid;
                  grid-template-columns: repeat(3, 1fr);
                  gap: 10px;
                  margin-top: 15px;
                }
                
                .photo-item {
                  text-align: center;
                  page-break-inside: avoid;
                }
                
                .photo-item img {
                  width: 100%;
                  height: 80px;
                  object-fit: cover;
                  border-radius: 6px;
                  border: 1px solid #e5e7eb;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                
                .photo-caption {
                  font-size: 9px;
                  color: #6b7280;
                  margin-top: 6px;
                  line-height: 1.2;
                  font-weight: 500;
                }
                
                /* Print Optimizations */
                @media print {
                  body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    font-size: 11px;
                  }
                  
                  .no-print {
                    display: none !important;
                  }
                  
                  .page-break {
                    page-break-before: always;
                  }
                  
                  .no-break {
                    page-break-inside: avoid;
                  }
                  
                  .header {
                    margin-bottom: 20px;
                  }
                  
                  .signature-section {
                    margin-top: 25px;
                  }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Laporan Aktivitas Pengawas Sekolah</h1>
                <h2>Dinas Pendidikan Provinsi Jawa Barat</h2>
                <h2>Cabang Dinas Pendidikan Wilayah XI</h2>
                <h2>${getPeriodTitle()}</h2>
                
                <div style="margin-top: 20px; padding: 15px; background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 6px;" class="no-break">
                  <h3 style="font-size: 14px; font-weight: bold; margin-bottom: 12px; color: #1e40af;">Identitas Pengawas</h3>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; text-align: left; font-size: 11px;">
                    <div>
                      <p style="margin: 3px 0;"><strong>Nama:</strong> ${profile?.fullName || 'H. Wawan Yogaswara, S.Pd, M.Pd'}</p>
                      <p style="margin: 3px 0;"><strong>NIP:</strong> ${profile?.nip || '196805301994121001'}</p>
                      <p style="margin: 3px 0;"><strong>Pangkat/Gol:</strong> ${profile?.rank || 'Pembina Tk. I / IV.b'}</p>
                    </div>
                    <div>
                      <p style="margin: 3px 0;"><strong>Jabatan:</strong> ${profile?.position || 'Pengawas Sekolah'}</p>
                      <p style="margin: 3px 0;"><strong>Unit Kerja:</strong> ${profile?.workUnit || 'Cabang Dinas Pendidikan Wilayah XI'}</p>
                      <p style="margin: 3px 0;"><strong>Wilayah Binaan:</strong> ${profile?.area || 'Kabupaten Garut'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="summary-section">
                <div class="summary-title">Ringkasan Statistik Kegiatan</div>
                <div class="stats-grid">
                  <div class="stat-item">
                    <div class="stat-number">${activitiesToExport.filter(a => a.type === 'Tugas Tambahan').length}</div>
                    <div class="stat-label">Tugas Tambahan</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">${activitiesToExport.filter(a => a.type === 'Supervisi').length}</div>
                    <div class="stat-label">Supervisi</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">${activitiesToExport.filter(a => a.type === 'Tugas Pokok').length}</div>
                    <div class="stat-label">Tugas Pokok</div>
                  </div>
                </div>
                <p style="font-size: 12px; color: #6b7280; text-align: center;">
                  Total ${activitiesToExport.length} aktivitas telah didokumentasikan, ${activitiesToExport.filter(a => a.photo1 || a.photo2).length} aktivitas dengan foto
                </p>
              </div>
              
              ${generateQualityAnalysis()}
              
              <div class="activities-section">
                <div class="section-title">Ringkasan Kegiatan</div>
                ${generateActivitiesSummary() || '<p style="text-align: center; color: #6b7280; font-style: italic;">Belum ada aktivitas yang didokumentasikan</p>'}
              </div>
              
              ${photosHTML}
              
              <div class="signature-section">
                <div class="signature-date">Garut, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <div class="signature-title">Pengawas Sekolah,</div>
                <div class="signature-name">${profile?.fullName || 'H. Wawan Yogaswara, S.Pd, M.Pd'}</div>
                <div style="margin-top: 10px; font-size: 12px;">NIP: ${profile?.nip || '196805301994121001'}</div>
                <div style="margin-top: 5px; font-size: 12px;">Pangkat: ${profile?.rank || 'Pembina Tk. I / IV.b'}</div>
              </div>
            </body>
          </html>
        `;
      };
      
      // Create and open PDF in new window
      const pdfContent = generatePDFContent();
      const printWindow = window.open('', '_blank');
      
      if (printWindow) {
        printWindow.document.write(pdfContent);
        printWindow.document.close();
        
        // Auto print after content loads
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 500);
        };
      } else {
        // Fallback: create downloadable HTML file
        const blob = new Blob([pdfContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Laporan_Aktivitas_${period}_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Terjadi kesalahan saat membuat PDF. Silakan coba lagi.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat data aktivitas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Laporan Aktivitas</h1>
          <p className="text-muted-foreground mt-1">Laporan aktivitas dengan filter periode</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="semua" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Semua Aktivitas
          </TabsTrigger>
          <TabsTrigger value="bulanan" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Laporan Bulanan
          </TabsTrigger>
          <TabsTrigger value="tahunan" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Laporan Tahunan
          </TabsTrigger>
        </TabsList>

        {/* Semua Aktivitas Tab */}
        <TabsContent value="semua" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Semua Aktivitas</h2>
              <p className="text-muted-foreground">Seluruh aktivitas yang telah didokumentasikan</p>
            </div>
            <Button onClick={() => handleExportPDF("semua")} className="bg-red-600 hover:bg-red-700">
              <FileText className="h-4 w-4 mr-2" />
              Export ke PDF
            </Button>
          </div>
          {renderActivitiesContent(getFilteredActivities("semua"))}
        </TabsContent>

        {/* Laporan Bulanan Tab */}
        <TabsContent value="bulanan" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Laporan Bulanan</h2>
              <p className="text-muted-foreground">Aktivitas berdasarkan bulan dan tahun</p>
            </div>
            <Button onClick={() => handleExportPDF("bulanan")} className="bg-red-600 hover:bg-red-700">
              <FileText className="h-4 w-4 mr-2" />
              Export PDF Bulanan
            </Button>
          </div>
          
          {/* Month and Year Selectors */}
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Bulan:</label>
              <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Tahun:</label>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {renderActivitiesContent(getFilteredActivities("bulanan"), `${months[selectedMonth]} ${selectedYear}`)}
        </TabsContent>

        {/* Laporan Tahunan Tab */}
        <TabsContent value="tahunan" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Laporan Tahunan</h2>
              <p className="text-muted-foreground">Aktivitas berdasarkan tahun</p>
            </div>
            <Button onClick={() => handleExportPDF("tahunan")} className="bg-red-600 hover:bg-red-700">
              <FileText className="h-4 w-4 mr-2" />
              Export PDF Tahunan
            </Button>
          </div>
          
          {/* Year Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Tahun:</label>
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {renderActivitiesContent(getFilteredActivities("tahunan"), `Tahun ${selectedYear}`)}
        </TabsContent>
      </Tabs>

      {/* Export Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Printer className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Export ke PDF</p>
              <p className="text-sm text-blue-700">
                Pilih tab laporan yang diinginkan, lalu klik tombol "Export ke PDF" untuk membuat laporan lengkap
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Helper function to render activities content
  function renderActivitiesContent(activities: any[], periodTitle?: string) {
    return (
      <>
        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Aktivitas {periodTitle || ""}</CardTitle>
            <CardDescription>Total aktivitas yang telah didokumentasikan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {activities.filter((a: any) => a.type === 'Tugas Tambahan').length}
                </div>
                <div className="text-sm text-blue-600">Tugas Tambahan</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {activities.filter((a: any) => a.type === 'Supervisi').length}
                </div>
                <div className="text-sm text-green-600">Supervisi</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {activities.filter((a: any) => a.type === 'Tugas Pokok').length}
                </div>
                <div className="text-sm text-purple-600">Tugas Pokok</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activities List */}
        {activities.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {periodTitle ? `Belum ada aktivitas untuk ${periodTitle}` : "Belum ada aktivitas"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Aktivitas akan muncul di sini setelah Anda menambahkan tugas, supervisi, atau kegiatan tambahan
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {activities.map((activity: any) => (
              <Card key={`${activity.type}-${activity.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getTypeColor(activity.type)}>
                          {activity.type}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{activity.title}</CardTitle>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(activity.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{activity.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{activity.organizer}</span>
                        </div>
                        {(activity.photo1 || activity.photo2) && (
                          <Badge variant="outline">
                            <ImageIcon className="h-3 w-3 mr-1" />
                            {[activity.photo1, activity.photo2].filter(Boolean).length} foto
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                {(activity.description || activity.photo1 || activity.photo2) && (
                  <CardContent className="space-y-3">
                    {activity.description && (
                      <div>
                        <p className="text-sm font-medium mb-1">Deskripsi:</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                    )}
                    
                    {(activity.photo1 || activity.photo2) && (
                      <div>
                        <p className="text-sm font-medium mb-2">Dokumentasi Foto:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {activity.photo1 && (
                            <div className="space-y-2">
                              <img 
                                src={activity.photo1.startsWith('data:') ? activity.photo1 : `/uploads/${activity.photo1}`} 
                                alt="Foto 1" 
                                className="w-full h-48 object-cover rounded-md border"
                              />
                              <p className="text-xs text-center text-muted-foreground">Foto 1</p>
                            </div>
                          )}
                          {activity.photo2 && (
                            <div className="space-y-2">
                              <img 
                                src={activity.photo2.startsWith('data:') ? activity.photo2 : `/uploads/${activity.photo2}`} 
                                alt="Foto 2" 
                                className="w-full h-48 object-cover rounded-md border"
                              />
                              <p className="text-xs text-center text-muted-foreground">Foto 2</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </>
    );
  }
}