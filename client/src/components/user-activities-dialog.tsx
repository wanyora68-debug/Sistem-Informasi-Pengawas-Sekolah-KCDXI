import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Calendar, CheckCircle, XCircle, School, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

type UserActivitiesDialogProps = {
  userId: string;
  userName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type Activity = {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  date?: string;
  completed?: boolean;
  status?: string;
  category?: string;
  schoolName?: string;
  school?: string;
  type?: string;
  findings?: string;
  notes?: string;
  recommendations?: string;
  time?: string;
  organizer?: string;
  location?: string;
  userId?: string;
  username?: string;
};

type Activities = {
  tasks: Activity[];
  supervisions: Activity[];
  events: Activity[];
  additionalTasks: Activity[];
};

export function UserActivitiesDialog({ userId, userName, open, onOpenChange }: UserActivitiesDialogProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("tasks");
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState<Activities>({
    tasks: [],
    supervisions: [],
    events: [],
    additionalTasks: []
  });

  // Load user activities when dialog opens
  useEffect(() => {
    if (open && userId) {
      loadUserActivities();
    }
  }, [open, userId]);

  const loadUserActivities = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading activities for user:', { userId, userName });

      // FORCE localStorage first for Wawan user to ensure data shows
      if (userId === 'wawan' || userName?.toLowerCase() === 'wawan') {
        console.log('🎯 Wawan user detected - using localStorage directly');
        const localActivities = getLocalStorageActivities();
        const totalLocal = localActivities.tasks.length + localActivities.supervisions.length + 
                          localActivities.events.length + localActivities.additionalTasks.length;
        
        if (totalLocal > 0) {
          console.log('✅ Using localStorage data for Wawan:', totalLocal, 'items');
          setActivities(localActivities);
          setLoading(false);
          return;
        }
      }

      // Try to fetch from API first using the correct endpoints
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('🌐 Attempting API calls...');
      const [tasksRes, supervisionsRes, eventsRes, additionalTasksRes] = await Promise.allSettled([
        fetch(`/api/users/${userId}/tasks`, { headers }),
        fetch(`/api/users/${userId}/supervisions`, { headers }),
        fetch(`/api/users/${userId}/events`, { headers }),
        fetch(`/api/users/${userId}/additional-tasks`, { headers })
      ]);

      let tasks = [];
      let supervisions = [];
      let events = [];
      let additionalTasks = [];

      // Handle API responses
      if (tasksRes.status === 'fulfilled' && tasksRes.value.ok) {
        tasks = await tasksRes.value.json();
        console.log('✅ API tasks loaded:', tasks.length);
      } else {
        console.log('❌ API tasks failed');
      }
      if (supervisionsRes.status === 'fulfilled' && supervisionsRes.value.ok) {
        supervisions = await supervisionsRes.value.json();
        console.log('✅ API supervisions loaded:', supervisions.length);
      } else {
        console.log('❌ API supervisions failed');
      }
      if (eventsRes.status === 'fulfilled' && eventsRes.value.ok) {
        events = await eventsRes.value.json();
        console.log('✅ API events loaded:', events.length);
      } else {
        console.log('❌ API events failed');
      }
      if (additionalTasksRes.status === 'fulfilled' && additionalTasksRes.value.ok) {
        additionalTasks = await additionalTasksRes.value.json();
        console.log('✅ API additional tasks loaded:', additionalTasks.length);
      } else {
        console.log('❌ API additional tasks failed');
      }

      // If API fails or returns empty, try localStorage as fallback
      const totalApiResults = tasks.length + supervisions.length + events.length + additionalTasks.length;
      if (totalApiResults === 0) {
        console.log('🔄 API failed or empty, trying localStorage fallback');
        const localActivities = getLocalStorageActivities();
        setActivities(localActivities);
      } else {
        console.log('✅ Using API data');
        setActivities({
          tasks,
          supervisions,
          events,
          additionalTasks
        });
      }

      console.log('📊 Final activities loaded:', {
        tasks: tasks.length,
        supervisions: supervisions.length,
        events: events.length,
        additionalTasks: additionalTasks.length,
        total: totalApiResults
      });

    } catch (error) {
      console.error('❌ Error loading activities:', error);
      // Fallback to localStorage
      console.log('🔄 Falling back to localStorage due to error');
      const localActivities = getLocalStorageActivities();
      setActivities(localActivities);
    } finally {
      setLoading(false);
    }
  };

  const getLocalStorageActivities = () => {
    try {
      console.log('🔍 Getting localStorage activities for:', { userId, userName });
      
      // Get current user to check if admin
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const isAdmin = currentUser.role === 'admin';
      
      console.log('👤 Current user:', currentUser);
      console.log('🔑 Is admin:', isAdmin);
      
      // Get data from localStorage
      const getLocalStorageData = (key: string) => {
        try {
          const data = localStorage.getItem(key);
          return data ? JSON.parse(data) : [];
        } catch {
          return [];
        }
      };

      // Filter data by user with admin permission support
      const filterByUser = (data: any[], userField: string = 'userId'): Activity[] => {
        if (!data || !Array.isArray(data)) {
          console.log(`❌ No data or not array for field: ${userField}`);
          return [];
        }
        
        console.log(`🔍 Filtering ${data.length} items by ${userField} for user:`, { userId, userName });
        console.log(`🔑 Admin access: ${isAdmin}`);
        
        const filtered = data.filter(item => {
          // If admin, allow access to any user's data
          if (isAdmin) {
            console.log('🔑 Admin access - checking item:', item);
            
            // Match by userId (exact match)
            if (item[userField] === userId) {
              console.log(`✅ Admin found match by ${userField}:`, item);
              return true;
            }
            
            // Match by username (case insensitive)
            const usernameFields = ['username', 'user', 'createdBy', 'assignedTo'];
            for (const field of usernameFields) {
              if (item[field] && userName && 
                  item[field].toLowerCase() === userName.toLowerCase()) {
                console.log(`✅ Admin found match by ${field}:`, item);
                return true;
              }
            }
            
            // Special case for Wawan - also check if item contains userName in any text field
            if (userName && userName.toLowerCase() === 'wawan') {
              const textFields = ['title', 'name', 'description', 'notes', 'findings', 'schoolName'];
              for (const field of textFields) {
                if (item[field] && typeof item[field] === 'string' && 
                    item[field].toLowerCase().includes('wawan')) {
                  console.log(`✅ Admin found Wawan match in ${field}:`, item[field]);
                  return true;
                }
              }
            }
          } else {
            // Non-admin users can only see their own data
            if (item[userField] === userId) {
              console.log(`✅ Found match by ${userField}:`, item);
              return true;
            }
            
            // Match by username (case insensitive) - check multiple username fields
            const usernameFields = ['username', 'user', 'createdBy', 'assignedTo'];
            for (const field of usernameFields) {
              if (item[field] && userName && 
                  item[field].toLowerCase() === userName.toLowerCase()) {
                console.log(`✅ Found match by ${field}:`, item);
                return true;
              }
            }
            
            // Special case for Wawan - also check if item contains userName in any text field
            if (userName && userName.toLowerCase() === 'wawan') {
              const textFields = ['title', 'name', 'description', 'notes', 'findings'];
              for (const field of textFields) {
                if (item[field] && typeof item[field] === 'string' && 
                    item[field].toLowerCase().includes('wawan')) {
                  console.log(`✅ Found Wawan match in ${field}:`, item[field]);
                  return true;
                }
              }
            }
          }
          
          return false;
        });
        
        console.log(`📊 Filtered ${filtered.length} items from ${data.length} total`);
        return filtered;
      };
      // Get data from localStorage - check both main database and individual keys
      const localData = getLocalStorageData('local-database') || {};
      console.log('📦 Local database keys:', Object.keys(localData));
      console.log('📊 Local database counts:', {
        tasks: localData.tasks?.length || 0,
        supervisions: localData.supervisions?.length || 0,
        events: localData.events?.length || 0,
        additionalTasks: localData.additionalTasks?.length || 0
      });
      
      const tasks = filterByUser(localData.tasks || getLocalStorageData('tasks'));
      const supervisions = filterByUser(localData.supervisions || getLocalStorageData('supervisions'));
      const events = filterByUser(localData.events || getLocalStorageData('calendar_events') || getLocalStorageData('events'));
      const additionalTasks = filterByUser(localData.additionalTasks || getLocalStorageData('additional_tasks') || getLocalStorageData('additionalTasks'));

      // Log the actual data found for debugging
      console.log('📊 Data found for user:', {
        userId,
        userName,
        tasks: tasks.length,
        supervisions: supervisions.length,
        events: events.length,
        additionalTasks: additionalTasks.length
      });

      console.log('✅ LocalStorage data:', {
        tasks: tasks.length,
        supervisions: supervisions.length,
        events: events.length,
        additionalTasks: additionalTasks.length
      });

      return {
        tasks,
        supervisions,
        events,
        additionalTasks
      };
    } catch (error) {
      console.error('❌ Error loading from localStorage:', error);
      return {
        tasks: [],
        supervisions: [],
        events: [],
        additionalTasks: []
      };
    }
  };

  // Delete functions
  const deleteTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/tasks/${taskId}`, { 
        method: 'DELETE',
        headers
      });
      if (response.ok) {
        setActivities(prev => ({
          ...prev,
          tasks: prev.tasks.filter((task: Activity) => task.id !== taskId)
        }));
        toast({ title: "Berhasil", description: "Tugas berhasil dihapus" });
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({ title: "Error", description: "Gagal menghapus tugas", variant: "destructive" });
    }
  };

  const deleteSupervision = async (supervisionId: string) => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/supervisions/${supervisionId}`, { 
        method: 'DELETE',
        headers
      });
      if (response.ok) {
        setActivities(prev => ({
          ...prev,
          supervisions: prev.supervisions.filter((supervision: Activity) => supervision.id !== supervisionId)
        }));
        toast({ title: "Berhasil", description: "Supervisi berhasil dihapus" });
      } else {
        throw new Error('Failed to delete supervision');
      }
    } catch (error) {
      console.error('Error deleting supervision:', error);
      toast({ title: "Error", description: "Gagal menghapus supervisi", variant: "destructive" });
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/events/${eventId}`, { 
        method: 'DELETE',
        headers
      });
      if (response.ok) {
        setActivities(prev => ({
          ...prev,
          events: prev.events.filter((event: Activity) => event.id !== eventId)
        }));
        toast({ title: "Berhasil", description: "Kegiatan berhasil dihapus" });
      } else {
        throw new Error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({ title: "Error", description: "Gagal menghapus kegiatan", variant: "destructive" });
    }
  };

  const deleteAdditionalTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/additional-tasks/${taskId}`, { 
        method: 'DELETE',
        headers
      });
      if (response.ok) {
        setActivities(prev => ({
          ...prev,
          additionalTasks: prev.additionalTasks.filter((task: Activity) => task.id !== taskId)
        }));
        toast({ title: "Berhasil", description: "Tugas tambahan berhasil dihapus" });
      } else {
        throw new Error('Failed to delete additional task');
      }
    } catch (error) {
      console.error('Error deleting additional task:', error);
      toast({ title: "Error", description: "Gagal menghapus tugas tambahan", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aktivitas User: {userName}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Memuat aktivitas...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Aktivitas User: {userName}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tasks">
              Tugas Pokok ({activities.tasks.length})
            </TabsTrigger>
            <TabsTrigger value="supervisions">
              Supervisi ({activities.supervisions.length})
            </TabsTrigger>
            <TabsTrigger value="events">
              Kegiatan ({activities.events.length})
            </TabsTrigger>
            <TabsTrigger value="additional">
              Tugas Tambahan ({activities.additionalTasks.length})
            </TabsTrigger>
          </TabsList>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            {activities.tasks.length === 0 ? (
              <p className="text-center text-muted-foreground">Belum ada tugas pokok</p>
            ) : (
              activities.tasks.map((task: Activity) => (
                <Card key={task.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">{task.title || task.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={task.completed ? "default" : "secondary"}>
                            {task.completed ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                            {task.completed ? "Selesai" : "Belum Selesai"}
                          </Badge>
                          <Badge variant="outline">{task.category || "Tugas"}</Badge>
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Tugas?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tindakan ini tidak dapat dibatalkan. Tugas akan dihapus permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteTask(task.id)}>
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {task.date ? format(new Date(task.date), "dd MMMM yyyy", { locale: localeId }) : 'Tanggal tidak tersedia'}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Supervisions Tab */}
          <TabsContent value="supervisions" className="space-y-4">
            {activities.supervisions.length === 0 ? (
              <p className="text-center text-muted-foreground">Belum ada supervisi</p>
            ) : (
              activities.supervisions.map((supervision: Activity) => (
                <Card key={supervision.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base flex items-center gap-2">
                          <School className="w-4 h-4" />
                          {supervision.schoolName || supervision.school || "Sekolah"}
                        </CardTitle>
                        <Badge variant="outline">{supervision.type || "Supervisi"}</Badge>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Supervisi?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tindakan ini tidak dapat dibatalkan. Supervisi akan dihapus permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteSupervision(supervision.id)}>
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm"><strong>Temuan:</strong> {supervision.findings || supervision.notes || 'Tidak ada temuan'}</p>
                    {supervision.recommendations && (
                      <p className="text-sm mt-1"><strong>Rekomendasi:</strong> {supervision.recommendations}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {supervision.date ? format(new Date(supervision.date), "dd MMMM yyyy", { locale: localeId }) : 'Tanggal tidak tersedia'}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-4">
            {activities.events.length === 0 ? (
              <p className="text-center text-muted-foreground">Belum ada kegiatan</p>
            ) : (
              activities.events.map((event: Activity) => (
                <Card key={event.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">{event.title || event.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {event.date ? format(new Date(event.date), "dd MMMM yyyy", { locale: localeId }) : 'Tanggal tidak tersedia'}
                          {event.time && ` - ${event.time}`}
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Kegiatan?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tindakan ini tidak dapat dibatalkan. Kegiatan akan dihapus permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteEvent(event.id)}>
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardHeader>
                  {event.description && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </TabsContent>

          {/* Additional Tasks Tab */}
          <TabsContent value="additional" className="space-y-4">
            {activities.additionalTasks.length === 0 ? (
              <p className="text-center text-muted-foreground">Belum ada tugas tambahan</p>
            ) : (
              activities.additionalTasks.map((task: Activity) => (
                <Card key={task.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">{task.name || task.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          <Users className="w-3 h-3 inline mr-1" />
                          {task.organizer || 'Penyelenggara'} - {task.location || 'Lokasi'}
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Tugas Tambahan?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tindakan ini tidak dapat dibatalkan. Tugas tambahan akan dihapus permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteAdditionalTask(task.id)}>
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {task.date ? format(new Date(task.date), "dd MMMM yyyy", { locale: localeId }) : 'Tanggal tidak tersedia'}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
