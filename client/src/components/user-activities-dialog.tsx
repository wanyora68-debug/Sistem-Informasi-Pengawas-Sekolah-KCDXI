import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Calendar, CheckCircle, XCircle, FileText, School, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

type UserActivitiesDialogProps = {
  userId: string;
  userName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UserActivitiesDialog({ userId, userName, open, onOpenChange }: UserActivitiesDialogProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("tasks");

  // Fetch user activities
  const { data: tasks = [], isLoading: tasksLoading } = useQuery<any[]>({
    queryKey: [`/api/users/${userId}/tasks`],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/users/${userId}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch tasks');
      return response.json();
    },
    enabled: open && activeTab === "tasks",
  });

  const { data: supervisions = [], isLoading: supervisionsLoading } = useQuery<any[]>({
    queryKey: [`/api/users/${userId}/supervisions`],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/users/${userId}/supervisions`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch supervisions');
      return response.json();
    },
    enabled: open && activeTab === "supervisions",
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery<any[]>({
    queryKey: [`/api/users/${userId}/events`],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/users/${userId}/events`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch events');
      return response.json();
    },
    enabled: open && activeTab === "events",
  });

  const { data: additionalTasks = [], isLoading: additionalTasksLoading } = useQuery<any[]>({
    queryKey: [`/api/users/${userId}/additional-tasks`],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/users/${userId}/additional-tasks`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch additional tasks');
      return response.json();
    },
    enabled: open && activeTab === "additional",
  });

  // Delete mutations
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete task');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/tasks`] });
      toast({ title: "Berhasil", description: "Tugas berhasil dihapus" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Gagal menghapus tugas", variant: "destructive" });
    },
  });

  const deleteSupervisionMutation = useMutation({
    mutationFn: async (supervisionId: string) => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/supervisions/${supervisionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete supervision');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/supervisions`] });
      toast({ title: "Berhasil", description: "Supervisi berhasil dihapus" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Gagal menghapus supervisi", variant: "destructive" });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete event');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/events`] });
      toast({ title: "Berhasil", description: "Kegiatan berhasil dihapus" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Gagal menghapus kegiatan", variant: "destructive" });
    },
  });

  const deleteAdditionalTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/additional-tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete additional task');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/additional-tasks`] });
      toast({ title: "Berhasil", description: "Tugas tambahan berhasil dihapus" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Gagal menghapus tugas tambahan", variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Aktivitas User: {userName}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tasks">Tugas Pokok</TabsTrigger>
            <TabsTrigger value="supervisions">Supervisi</TabsTrigger>
            <TabsTrigger value="events">Kegiatan</TabsTrigger>
            <TabsTrigger value="additional">Tugas Tambahan</TabsTrigger>
          </TabsList>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            {tasksLoading ? (
              <p className="text-center text-muted-foreground">Memuat...</p>
            ) : tasks.length === 0 ? (
              <p className="text-center text-muted-foreground">Belum ada tugas pokok</p>
            ) : (
              tasks.map((task: any) => (
                <Card key={task.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">{task.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={task.completed ? "default" : "secondary"}>
                            {task.completed ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                            {task.completed ? "Selesai" : "Belum Selesai"}
                          </Badge>
                          <Badge variant="outline">{task.category}</Badge>
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
                            <AlertDialogAction onClick={() => deleteTaskMutation.mutate(task.id)}>
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
                      {format(new Date(task.date), "dd MMMM yyyy", { locale: localeId })}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Supervisions Tab */}
          <TabsContent value="supervisions" className="space-y-4">
            {supervisionsLoading ? (
              <p className="text-center text-muted-foreground">Memuat...</p>
            ) : supervisions.length === 0 ? (
              <p className="text-center text-muted-foreground">Belum ada supervisi</p>
            ) : (
              supervisions.map((supervision: any) => (
                <Card key={supervision.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base flex items-center gap-2">
                          <School className="w-4 h-4" />
                          {supervision.schoolName || "Sekolah"}
                        </CardTitle>
                        <Badge variant="outline">{supervision.type}</Badge>
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
                            <AlertDialogAction onClick={() => deleteSupervisionMutation.mutate(supervision.id)}>
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm"><strong>Temuan:</strong> {supervision.findings}</p>
                    {supervision.recommendations && (
                      <p className="text-sm mt-1"><strong>Rekomendasi:</strong> {supervision.recommendations}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {format(new Date(supervision.date), "dd MMMM yyyy", { locale: localeId })}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-4">
            {eventsLoading ? (
              <p className="text-center text-muted-foreground">Memuat...</p>
            ) : events.length === 0 ? (
              <p className="text-center text-muted-foreground">Belum ada kegiatan</p>
            ) : (
              events.map((event: any) => (
                <Card key={event.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">{event.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {format(new Date(event.date), "dd MMMM yyyy", { locale: localeId })} - {event.time}
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
                            <AlertDialogAction onClick={() => deleteEventMutation.mutate(event.id)}>
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
            {additionalTasksLoading ? (
              <p className="text-center text-muted-foreground">Memuat...</p>
            ) : additionalTasks.length === 0 ? (
              <p className="text-center text-muted-foreground">Belum ada tugas tambahan</p>
            ) : (
              additionalTasks.map((task: any) => (
                <Card key={task.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">{task.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          <Users className="w-3 h-3 inline mr-1" />
                          {task.organizer} - {task.location}
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
                            <AlertDialogAction onClick={() => deleteAdditionalTaskMutation.mutate(task.id)}>
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
                      {format(new Date(task.date), "dd MMMM yyyy", { locale: localeId })}
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
