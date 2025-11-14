import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Calendar, School, FileText, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";

type UserProfile = {
  id: string;
  username: string;
  fullName: string;
  role: string;
  photoUrl?: string;
};

export default function Dashboard() {
  const { data: user, isLoading: userLoading } = useQuery<UserProfile>({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
  });

  // Fetch real data
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/tasks', {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });
      if (!response.ok) return [];
      return response.json();
    },
  });

  const { data: schools = [] } = useQuery({
    queryKey: ["/api/schools"],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/schools', {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });
      if (!response.ok) return [];
      return response.json();
    },
  });

  const { data: supervisions = [] } = useQuery({
    queryKey: ['supervisions'],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/supervisions', {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });
      if (!response.ok) return [];
      return response.json();
    },
  });

  const { data: additionalTasks = [] } = useQuery({
    queryKey: ['additional-tasks'],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/additional-tasks', {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });
      if (!response.ok) return [];
      return response.json();
    },
  });

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/events', {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });
      if (!response.ok) return [];
      return response.json();
    },
  });

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: any) => t.completed).length;
  const totalSchools = schools.length;
  
  // Get supervisions this month
  const now = new Date();
  const thisMonth = supervisions.filter((s: any) => {
    const date = new Date(s.date);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    { 
      title: "Total Tugas", 
      value: totalTasks.toString(), 
      icon: ClipboardList, 
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      iconBg: "bg-blue-100 dark:bg-blue-900"
    },
    { 
      title: "Tugas Selesai", 
      value: completedTasks.toString(), 
      icon: CheckCircle2, 
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      iconBg: "bg-green-100 dark:bg-green-900"
    },
    { 
      title: "Sekolah Binaan", 
      value: totalSchools.toString(), 
      icon: School, 
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      iconBg: "bg-purple-100 dark:bg-purple-900"
    },
    { 
      title: "Supervisi Bulan Ini", 
      value: thisMonth.toString(), 
      icon: TrendingUp, 
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      iconBg: "bg-orange-100 dark:bg-orange-900"
    },
  ];

  // Get recent activities (combine all activities)
  const allActivities = [
    ...tasks.slice(0, 3).map((t: any) => ({
      title: t.title,
      date: new Date(t.date).toLocaleDateString('id-ID'),
      category: t.category,
      type: 'task'
    })),
    ...supervisions.slice(0, 2).map((s: any) => ({
      title: `Supervisi ${s.type} - ${s.school || 'Sekolah'}`,
      date: new Date(s.date).toLocaleDateString('id-ID'),
      category: 'Supervisi',
      type: 'supervision'
    })),
    ...additionalTasks.slice(0, 2).map((a: any) => ({
      title: a.name,
      date: new Date(a.date).toLocaleDateString('id-ID'),
      category: 'Tugas Tambahan',
      type: 'additional'
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  // Get upcoming events
  const upcomingEvents = events
    .filter((e: any) => new Date(e.date) >= now)
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header with gradient and profile photo */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
        <div className="relative z-10 flex items-center gap-6">
          <Avatar className="w-20 h-20 border-4 border-white/20">
            <AvatarImage src={user?.photoUrl || undefined} alt={user?.fullName} />
            <AvatarFallback className="text-2xl bg-white/10">
              {user?.fullName ? getInitials(user.fullName) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-2 text-blue-50">
              Selamat datang kembali, <span className="font-semibold">{user?.fullName || 'Pengawas'}</span>! 
            </p>
            <p className="text-sm text-blue-100 mt-1">
              Berikut ringkasan kegiatan Anda hari ini
            </p>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
          <School className="h-full w-full" />
        </div>
      </div>

      {/* Stats Cards with enhanced design */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className={`${stat.bgColor} border-none shadow-sm hover:shadow-md transition-shadow`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {stat.title}
              </CardTitle>
              <div className={`${stat.iconBg} p-2 rounded-lg`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.color}`} data-testid={`stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <CardTitle>Aktivitas Terkini</CardTitle>
              </div>
              <Link href="/tasks">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" data-testid="button-view-all-tasks">
                  Lihat Semua
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {allActivities.length > 0 ? (
              <div className="space-y-4">
                {allActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{activity.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {activity.category}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Belum ada aktivitas</p>
                <Link href="/tasks">
                  <Button variant="ghost" size="sm" className="mt-2">
                    Tambah Tugas Pertama
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="border-b bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <CardTitle>Jadwal Mendatang</CardTitle>
              </div>
              <Link href="/calendar">
                <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700" data-testid="button-view-calendar">
                  Lihat Semua
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event: any, index: number) => (
                  <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(event.date).toLocaleDateString('id-ID', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {event.time}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Belum ada jadwal</p>
                <Link href="/calendar">
                  <Button variant="ghost" size="sm" className="mt-2">
                    Buat Jadwal Baru
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions with colorful buttons */}
      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Tindakan Cepat
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/tasks">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-auto py-4 border-blue-200 hover:bg-blue-50 hover:border-blue-300 dark:border-blue-800 dark:hover:bg-blue-950" 
                data-testid="button-add-task"
              >
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                  <ClipboardList className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Tambah Tugas</div>
                  <div className="text-xs text-muted-foreground">Catat tugas harian</div>
                </div>
              </Button>
            </Link>
            <Link href="/supervisions">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-auto py-4 border-green-200 hover:bg-green-50 hover:border-green-300 dark:border-green-800 dark:hover:bg-green-950" 
                data-testid="button-schedule-visit"
              >
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                  <School className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Supervisi</div>
                  <div className="text-xs text-muted-foreground">Catat hasil supervisi</div>
                </div>
              </Button>
            </Link>
            <Link href="/reports">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-auto py-4 border-purple-200 hover:bg-purple-50 hover:border-purple-300 dark:border-purple-800 dark:hover:bg-purple-950" 
                data-testid="button-create-report"
              >
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Buat Laporan</div>
                  <div className="text-xs text-muted-foreground">Export laporan PDF</div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
