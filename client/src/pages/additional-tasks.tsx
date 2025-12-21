import { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, MapPin, Users, Image as ImageIcon, X, Printer, Trash2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type AdditionalTask = {
  id: string;
  name: string;
  date: string;
  location: string;
  organizer: string;
  description: string;
  photo1?: string | null;
  photo2?: string | null;
};

export default function AdditionalTasksPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    name: "",
    date: "",
    location: "",
    organizer: "",
    description: "",
  });
  const [photo1, setPhoto1] = useState<File | null>(null);
  const [photo2, setPhoto2] = useState<File | null>(null);
  const [photo1Preview, setPhoto1Preview] = useState<string | null>(null);
  const [photo2Preview, setPhoto2Preview] = useState<string | null>(null);
  const photo1InputRef = useRef<HTMLInputElement>(null);
  const photo2InputRef = useRef<HTMLInputElement>(null);

  // Initialize with real tasks
  useEffect(() => {
    const existingData = localStorage.getItem('additional_tasks_data');
    if (!existingData) {
      const year = new Date().getFullYear().toString();
      const month = String(new Date().getMonth() + 1).padStart(2, '0');
      
      const realTasks = [
        {
          id: "real-task-1",
          name: "Rapat Koordinasi Pengawas Sekolah",
          date: `${year}-${month}-15`,
          location: "Kantor Dinas Pendidikan Provinsi Jawa Barat",
          organizer: "Dinas Pendidikan Provinsi Jawa Barat",
          description: "Rapat koordinasi bulanan membahas program supervisi sekolah, evaluasi kinerja pengawas, dan rencana kegiatan bulan berikutnya. Dihadiri oleh seluruh pengawas sekolah wilayah III Garut.",
          photo1: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzNzNkYyIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Rm90byBSYXBhdCBLb29yZGluYXNpPC90ZXh0Pjwvc3ZnPg==",
          photo2: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzE2YTM0YSIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RG9rdW1lbnRhc2kgS2VnaWF0YW48L3RleHQ+PC9zdmc+",
          createdAt: `${year}-${month}-15T10:00:00.000Z`
        },
        {
          id: "real-task-2", 
          name: "Workshop Implementasi Kurikulum Merdeka",
          date: `${year}-${month}-18`,
          location: "LPMP Jawa Barat, Bandung",
          organizer: "LPMP Jawa Barat",
          description: "Workshop pelatihan implementasi kurikulum merdeka untuk pengawas sekolah. Materi meliputi asesmen formatif, pembelajaran berdiferensiasi, dan pengembangan projek penguatan profil pelajar Pancasila.",
          photo1: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1OWUwYiIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+V29ya3Nob3AgS3VyaWt1bHVtPC90ZXh0Pjwvc3ZnPg==",
          createdAt: `${year}-${month}-18T09:00:00.000Z`
        },
        {
          id: "real-task-3",
          name: "Bimbingan Teknis Penyusunan RPS",
          date: `${year}-${month}-22`,
          location: "Hotel Savoy Homann, Bandung",
          organizer: "Balai Diklat Keagamaan",
          description: "Bimbingan teknis penyusunan Rencana Pelaksanaan Supervisi (RPS) untuk meningkatkan kualitas supervisi akademik dan manajerial di sekolah binaan.",
          photo1: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzk0MzNlYSIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+QmltYmluZ2FuIFRla25pczwvdGV4dD48L3N2Zz4=",
          photo2: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VmNDQ0NCIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U2VydGlmaWthdCBQZWxhdGloYW48L3RleHQ+PC9zdmc+",
          createdAt: `${year}-${month}-22T13:00:00.000Z`
        }
      ];
      
      localStorage.setItem('additional_tasks_data', JSON.stringify(realTasks));
      localStorage.setItem('additional_tasks_data_backup', JSON.stringify(realTasks));
      console.log('✅ Created real additional tasks data:', realTasks.length);
    }
  }, []);

  // Fetch tasks from localStorage
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['additional-tasks'],
    queryFn: () => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          let tasksData = localStorage.getItem('additional_tasks_data');
          
          if (!tasksData) {
            const backup = localStorage.getItem('additional_tasks_data_backup');
            if (backup) {
              localStorage.setItem('additional_tasks_data', backup);
              tasksData = backup;
              console.log('🔄 Additional tasks auto-recovered from backup');
            }
          }
          
          if (tasksData) {
            const parsed = JSON.parse(tasksData);
            localStorage.setItem('additional_tasks_data_backup', tasksData);
            localStorage.setItem('additional_tasks_data_timestamp', Date.now().toString());
            return Array.isArray(parsed) ? parsed : [];
          }
        }
        return [];
      } catch (error) {
        console.warn('Error reading additional tasks from localStorage:', error);
        return [];
      }
    },
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  const handleAddTask = async () => {
    try {
      console.log('Submitting additional task:', newTask);
      
      const tasksData = localStorage.getItem('additional_tasks_data');
      const currentTasks = tasksData ? JSON.parse(tasksData) : [];
      
      let photo1Base64 = null;
      let photo2Base64 = null;
      
      if (photo1) {
        photo1Base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(photo1);
        });
      }
      
      if (photo2) {
        photo2Base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(photo2);
        });
      }
      
      const newTaskData = {
        id: Date.now().toString(),
        name: newTask.name,
        date: newTask.date,
        location: newTask.location,
        organizer: newTask.organizer,
        description: newTask.description,
        photo1: photo1Base64,
        photo2: photo2Base64,
        createdAt: new Date().toISOString()
      };
      
      const updatedTasks = [...currentTasks, newTaskData];
      
      localStorage.setItem('additional_tasks_data', JSON.stringify(updatedTasks));
      localStorage.setItem('additional_tasks_data_backup', JSON.stringify(updatedTasks));
      localStorage.setItem('additional_tasks_data_timestamp', Date.now().toString());
      
      queryClient.invalidateQueries({ queryKey: ['additional-tasks'] });
      toast({
        title: "Berhasil",
        description: "Tugas tambahan berhasil ditambahkan",
      });
      setNewTask({ name: "", date: "", location: "", organizer: "", description: "" });
      setPhoto1(null);
      setPhoto2(null);
      setPhoto1Preview(null);
      setPhoto2Preview(null);
      setIsAddDialogOpen(false);
      
    } catch (error) {
      console.error('Error in handleAddTask:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan tugas tambahan",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const tasksData = localStorage.getItem('additional_tasks_data');
      const currentTasks = tasksData ? JSON.parse(tasksData) : [];
      
      const updatedTasks = currentTasks.filter((task: AdditionalTask) => task.id !== id);
      
      localStorage.setItem('additional_tasks_data', JSON.stringify(updatedTasks));
      localStorage.setItem('additional_tasks_data_backup', JSON.stringify(updatedTasks));
      localStorage.setItem('additional_tasks_data_timestamp', Date.now().toString());
      
      queryClient.invalidateQueries({ queryKey: ['additional-tasks'] });
      toast({
        title: "Berhasil",
        description: "Tugas tambahan berhasil dihapus",
      });
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
      
    } catch (error) {
      console.error('Error in handleDeleteTask:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menghapus tugas tambahan",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      handleDeleteTask(taskToDelete);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tugas Tambahan</h1>
          <p className="text-muted-foreground mt-1">Catat kegiatan dan tugas tambahan di luar supervisi</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kegiatan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Tugas Tambahan</DialogTitle>
              <DialogDescription>Catat kegiatan tambahan yang Anda ikuti</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-name">Nama Kegiatan</Label>
                <Input
                  id="task-name"
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  placeholder="Contoh: Rapat Koordinasi"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-date">Tanggal Kegiatan</Label>
                <Input
                  id="task-date"
                  type="date"
                  value={newTask.date}
                  onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-location">Tempat Kegiatan</Label>
                <Input
                  id="task-location"
                  value={newTask.location}
                  onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
                  placeholder="Lokasi kegiatan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-organizer">Penyelenggara Kegiatan</Label>
                <Input
                  id="task-organizer"
                  value={newTask.organizer}
                  onChange={(e) => setNewTask({ ...newTask, organizer: e.target.value })}
                  placeholder="Nama penyelenggara"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-description">Deskripsi atau Hasil Kegiatan</Label>
                <Textarea
                  id="task-description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Catatan hasil atau deskripsi kegiatan"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Upload Foto Kegiatan (Maksimal 2)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      ref={photo1InputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPhoto1(file);
                          const reader = new FileReader();
                          reader.onloadend = () => setPhoto1Preview(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <div
                      onClick={() => photo1InputRef.current?.click()}
                      className="border-2 border-dashed rounded-md p-6 text-center hover:bg-muted cursor-pointer relative"
                    >
                      {photo1Preview ? (
                        <>
                          <img src={photo1Preview} alt="Preview 1" className="w-full h-32 object-cover rounded" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPhoto1(null);
                              setPhoto1Preview(null);
                              if (photo1InputRef.current) photo1InputRef.current.value = '';
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Foto 1</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <input
                      ref={photo2InputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPhoto2(file);
                          const reader = new FileReader();
                          reader.onloadend = () => setPhoto2Preview(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <div
                      onClick={() => photo2InputRef.current?.click()}
                      className="border-2 border-dashed rounded-md p-6 text-center hover:bg-muted cursor-pointer relative"
                    >
                      {photo2Preview ? (
                        <>
                          <img src={photo2Preview} alt="Preview 2" className="w-full h-32 object-cover rounded" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPhoto2(null);
                              setPhoto2Preview(null);
                              if (photo2InputRef.current) photo2InputRef.current.value = '';
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Foto 2</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleAddTask} disabled={!newTask.name || !newTask.date}>
                  Simpan Kegiatan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">Belum ada tugas tambahan</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Catat kegiatan dan tugas tambahan di luar supervisi
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kegiatan Pertama
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task: AdditionalTask) => (
            <Card key={task.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg">{task.name}</CardTitle>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(task.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{task.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{task.organizer}</span>
                      </div>
                      {(task.photo1 || task.photo2) && (
                        <Badge variant="outline">
                          <ImageIcon className="h-3 w-3 mr-1" />
                          {[task.photo1, task.photo2].filter(Boolean).length} foto
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => { setTaskToDelete(task.id); setDeleteDialogOpen(true); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {(task.description || task.photo1 || task.photo2) && (
                <CardContent className="space-y-3">
                  {task.description && (
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  )}
                  {(task.photo1 || task.photo2) && (
                    <div>
                      <p className="text-sm font-medium mb-2">Foto Kegiatan:</p>
                      <div className="grid grid-cols-2 gap-3">
                        {task.photo1 && (
                          <img 
                            src={task.photo1.startsWith('data:') ? task.photo1 : `/uploads/${task.photo1}`} 
                            alt="Foto 1" 
                            className="w-full h-40 object-cover rounded-md border"
                          />
                        )}
                        {task.photo2 && (
                          <img 
                            src={task.photo2.startsWith('data:') ? task.photo2 : `/uploads/${task.photo2}`} 
                            alt="Foto 2" 
                            className="w-full h-40 object-cover rounded-md border"
                          />
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Tugas Tambahan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus tugas tambahan ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}