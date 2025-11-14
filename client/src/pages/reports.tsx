import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileText, Download, Calendar, TrendingUp, ClipboardCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";

export default function ReportsPage() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
  
  const [reportType, setReportType] = useState<"monthly" | "yearly">("monthly");
  const [selectedMonth, setSelectedMonth] = useState(`${currentYear}-${currentMonth}`);
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  // Fetch monthly stats
  const { data: monthlyStats, isLoading: monthlyLoading } = useQuery({
    queryKey: ['monthly-stats', selectedMonth],
    queryFn: async () => {
      const [year, month] = selectedMonth.split('-');
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/reports/monthly?year=${year}&month=${month}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      if (!response.ok) return { totalTasks: 0, completedTasks: 0, supervisions: 0, additionalTasks: 0 };
      return response.json();
    },
    enabled: reportType === 'monthly',
  });

  // Fetch yearly stats
  const { data: yearlyStats, isLoading: yearlyLoading } = useQuery({
    queryKey: ['yearly-stats', selectedYear],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/reports/yearly?year=${selectedYear}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      if (!response.ok) return { totalSupervisions: 0, schools: 0, monthlyAverage: 0, completionRate: 0 };
      return response.json();
    },
    enabled: reportType === 'yearly',
  });

  // Generate month options for the last 12 months
  const generateMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
      options.push({ value, label });
    }
    return options;
  };

  // Generate year options
  const generateYearOptions = () => {
    const options = [];
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
      const year = currentYear - i;
      options.push({ value: year.toString(), label: year.toString() });
    }
    return options;
  };

  const handleExportPDF = async () => {
    const token = localStorage.getItem('auth_token');
    const url = reportType === "monthly"
      ? `/api/reports/monthly/pdf?year=${selectedMonth.split('-')[0]}&month=${selectedMonth.split('-')[1]}`
      : `/api/reports/yearly/pdf?year=${selectedYear}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to generate PDF');
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `laporan-${reportType}-${reportType === 'monthly' ? selectedMonth : selectedYear}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  const handleExportPDFOld = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const stats = reportType === "monthly" ? monthlyStats : yearlyStats;
    const period = reportType === "monthly" 
      ? new Date(selectedMonth).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
      : `Tahun ${selectedYear}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Laporan ${reportType === "monthly" ? "Bulanan" : "Tahunan"} - ${period}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              max-width: 900px;
              margin: 0 auto;
            }
            h1 {
              color: #333;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
            .subtitle {
              color: #666;
              margin-bottom: 30px;
              font-size: 16px;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 20px;
              margin-bottom: 30px;
            }
            .stat-card {
              padding: 20px;
              background: #f9fafb;
              border-radius: 8px;
              border-left: 4px solid #2563eb;
            }
            .stat-label {
              font-size: 14px;
              color: #666;
              margin-bottom: 8px;
            }
            .stat-value {
              font-size: 32px;
              font-weight: bold;
              color: #333;
            }
            .section {
              margin-top: 30px;
              padding: 20px;
              background: #f9fafb;
              border-radius: 8px;
            }
            .section-title {
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 15px;
              font-size: 18px;
            }
            ul {
              list-style: none;
              padding: 0;
            }
            li {
              padding: 8px 0;
              color: #555;
              border-bottom: 1px solid #e5e7eb;
            }
            li:last-child {
              border-bottom: none;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
            @page {
              size: A4;
              margin: 15mm;
            }
            
            @media print {
              body {
                margin: 0;
                padding: 15mm;
                width: 210mm;
                min-height: 297mm;
              }
            }
          </style>
        </head>
        <body>
          <h1>Laporan ${reportType === "monthly" ? "Bulanan" : "Tahunan"}</h1>
          <div class="subtitle">Periode: ${period}</div>
          
          <div class="stats-grid">
            ${reportType === "monthly" ? `
              <div class="stat-card">
                <div class="stat-label">Total Tugas</div>
                <div class="stat-value">${monthlyStats.totalTasks}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Tugas Selesai</div>
                <div class="stat-value">${monthlyStats.completedTasks}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Supervisi</div>
                <div class="stat-value">${monthlyStats.supervisions}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Tugas Tambahan</div>
                <div class="stat-value">${monthlyStats.additionalTasks}</div>
              </div>
            ` : `
              <div class="stat-card">
                <div class="stat-label">Total Supervisi</div>
                <div class="stat-value">${yearlyStats.totalSupervisions}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Sekolah Binaan</div>
                <div class="stat-value">${yearlyStats.schools}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Rata-rata/Bulan</div>
                <div class="stat-value">${yearlyStats.monthlyAverage}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Tingkat Selesai</div>
                <div class="stat-value">${yearlyStats.completionRate}%</div>
              </div>
            `}
          </div>

          <div class="section">
            <div class="section-title">Ringkasan Kegiatan</div>
            <ul>
              ${reportType === "monthly" ? `
                <li>Supervisi akademik dilakukan pada 8 sekolah binaan</li>
                <li>Supervisi manajerial dilakukan pada 4 sekolah binaan</li>
                <li>Tingkat penyelesaian tugas: ${Math.round((monthlyStats.completedTasks / monthlyStats.totalTasks) * 100)}%</li>
                <li>Mengikuti ${monthlyStats.additionalTasks} kegiatan tambahan</li>
              ` : `
                <li>Total ${yearlyStats.totalSupervisions} supervisi dilakukan sepanjang tahun</li>
                <li>Membina ${yearlyStats.schools} sekolah dengan rata-rata ${yearlyStats.monthlyAverage} kunjungan per bulan</li>
                <li>Tingkat penyelesaian tugas mencapai ${yearlyStats.completionRate}%</li>
                <li>Berpartisipasi dalam berbagai kegiatan pengembangan profesional</li>
              `}
            </ul>
          </div>

          <div class="footer">
            Laporan dibuat pada ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const isLoading = reportType === 'monthly' ? monthlyLoading : yearlyLoading;
  const stats = reportType === 'monthly' ? monthlyStats : yearlyStats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Laporan Ringkas</h1>
        <p className="text-muted-foreground mt-1">Buat laporan bulanan dan tahunan</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Laporan</CardTitle>
          <CardDescription>Pilih jenis dan periode laporan yang akan dibuat</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="report-type">Jenis Laporan</Label>
              <Select value={reportType} onValueChange={(value: "monthly" | "yearly") => setReportType(value)}>
                <SelectTrigger id="report-type" data-testid="select-report-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Laporan Bulanan</SelectItem>
                  <SelectItem value="yearly">Laporan Tahunan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {reportType === "monthly" ? (
              <div className="space-y-2">
                <Label htmlFor="report-month">Bulan</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger id="report-month" data-testid="select-report-month">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {generateMonthOptions().map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="report-year">Tahun</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger id="report-year" data-testid="select-report-year">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {generateYearOptions().map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button className="w-full md:w-auto" onClick={handleExportPDF} data-testid="button-export-pdf">
            <Download className="h-4 w-4 mr-2" />
            Ekspor ke PDF
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pratinjau Laporan</CardTitle>
          <CardDescription>
            {reportType === "monthly" ? `Laporan Bulan ${selectedMonth}` : `Laporan Tahun ${selectedYear}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Memuat data...</p>
              </div>
            </div>
          ) : reportType === "monthly" ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ClipboardCheck className="h-4 w-4" />
                    <span>Total Tugas</span>
                  </div>
                  <p className="text-2xl font-bold" data-testid="stat-monthly-total-tasks">{monthlyStats?.totalTasks || 0}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span>Tugas Selesai</span>
                  </div>
                  <p className="text-2xl font-bold" data-testid="stat-monthly-completed-tasks">{monthlyStats?.completedTasks || 0}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>Supervisi</span>
                  </div>
                  <p className="text-2xl font-bold" data-testid="stat-monthly-supervisions">{monthlyStats?.supervisions || 0}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Tugas Tambahan</span>
                  </div>
                  <p className="text-2xl font-bold" data-testid="stat-monthly-additional-tasks">{monthlyStats?.additionalTasks || 0}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="font-semibold">Ringkasan Kegiatan</h3>
                {monthlyStats && monthlyStats.totalTasks > 0 ? (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Total {monthlyStats.totalTasks} tugas tercatat</li>
                    <li>• {monthlyStats.completedTasks} tugas telah diselesaikan</li>
                    <li>• Tingkat penyelesaian tugas: {monthlyStats.totalTasks > 0 ? Math.round((monthlyStats.completedTasks / monthlyStats.totalTasks) * 100) : 0}%</li>
                    <li>• {monthlyStats.supervisions} supervisi dilakukan</li>
                    <li>• Mengikuti {monthlyStats.additionalTasks} kegiatan tambahan</li>
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Belum ada data untuk periode ini</p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>Total Supervisi</span>
                  </div>
                  <p className="text-2xl font-bold" data-testid="stat-yearly-supervisions">{yearlyStats?.totalSupervisions || 0}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ClipboardCheck className="h-4 w-4" />
                    <span>Sekolah Binaan</span>
                  </div>
                  <p className="text-2xl font-bold" data-testid="stat-yearly-schools">{yearlyStats?.schools || 0}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span>Rata-rata/Bulan</span>
                  </div>
                  <p className="text-2xl font-bold" data-testid="stat-yearly-average">{yearlyStats?.monthlyAverage || 0}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Tingkat Selesai</span>
                  </div>
                  <p className="text-2xl font-bold" data-testid="stat-yearly-completion">{yearlyStats?.completionRate || 0}%</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="font-semibold">Ringkasan Tahunan</h3>
                {yearlyStats && yearlyStats.totalSupervisions > 0 ? (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Total {yearlyStats.totalSupervisions} supervisi dilakukan sepanjang tahun</li>
                    <li>• Membina {yearlyStats.schools} sekolah</li>
                    <li>• Rata-rata {yearlyStats.monthlyAverage} kunjungan per bulan</li>
                    <li>• Tingkat penyelesaian tugas mencapai {yearlyStats.completionRate}%</li>
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Belum ada data untuk tahun ini</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
