import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { User, InsertUser, Task, InsertTask, Supervision, InsertSupervision, AdditionalTask, InsertAdditionalTask } from '@shared/schema';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, '..', 'local-database.json');

interface School {
  id: string;
  userId: string;
  name: string;
  address: string;
  contact: string;
  principalName?: string | null;
  principalNip?: string | null;
  createdAt: Date;
}

interface Event {
  id: string;
  userId: string;
  schoolId?: string | null;
  title: string;
  date: Date;
  time: string;
  description?: string | null;
  reminded: boolean;
  createdAt: Date;
}

interface LocalDatabase {
  users: User[];
  schools: School[];
  tasks: Task[];
  supervisions: Supervision[];
  additionalTasks: AdditionalTask[];
  events: Event[];
}

class LocalStorage {
  private db: LocalDatabase;

  constructor() {
    this.db = this.loadDatabase();
  }

  private loadDatabase(): LocalDatabase {
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading local database:', error);
    }
    
    return {
      users: [],
      schools: [],
      tasks: [],
      supervisions: [],
      additionalTasks: [],
      events: [],
    };
  }

  private saveDatabase() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2));
    } catch (error) {
      console.error('Error saving local database:', error);
    }
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.db.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.db.users.find(u => u.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: Date.now().toString(),
      ...user,
      role: (user.role || 'pengawas') as 'admin' | 'pengawas',
      nip: user.nip || null,
      rank: user.rank || null,
      officeName: user.officeName || null,
      officeAddress: user.officeAddress || null,
      homeAddress: user.homeAddress || null,
      phone: user.phone || null,
      photoUrl: user.photoUrl || null,
      createdAt: new Date(),
    };
    this.db.users.push(newUser);
    this.saveDatabase();
    return newUser;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const userIndex = this.db.users.findIndex(u => u.id === id);
    if (userIndex === -1) return undefined;
    
    this.db.users[userIndex] = {
      ...this.db.users[userIndex],
      ...updates,
      id, // Ensure id doesn't change
      createdAt: this.db.users[userIndex].createdAt, // Preserve createdAt
    };
    this.saveDatabase();
    return this.db.users[userIndex];
  }

  async getAllUsers(): Promise<User[]> {
    return this.db.users;
  }

  async deleteUser(id: string): Promise<void> {
    this.db.users = this.db.users.filter(u => u.id !== id);
    // Also delete all data related to this user
    this.db.tasks = this.db.tasks.filter(t => t.userId !== id);
    this.db.supervisions = this.db.supervisions.filter(s => s.userId !== id);
    this.db.additionalTasks = this.db.additionalTasks.filter(a => a.userId !== id);
    this.db.schools = this.db.schools.filter(s => s.userId !== id);
    this.db.events = this.db.events.filter(e => e.userId !== id);
    this.saveDatabase();
  }

  // Tasks
  async getTasks(userId: string): Promise<Task[]> {
    return this.db.tasks.filter(t => t.userId === userId);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const newTask: Task = {
      id: Date.now().toString(),
      ...task,
      date: task.date || new Date(),
      description: task.description || null,
      photo1: task.photo1 || null,
      photo2: task.photo2 || null,
      completed: task.completed || false,
      createdAt: new Date(),
    };
    this.db.tasks.push(newTask);
    this.saveDatabase();
    return newTask;
  }

  async deleteTask(id: string): Promise<void> {
    this.db.tasks = this.db.tasks.filter(t => t.id !== id);
    this.saveDatabase();
  }

  // Supervisions
  async getSupervisions(userId: string): Promise<any[]> {
    const supervisions = this.db.supervisions.filter(s => s.userId === userId);
    // Add school data to each supervision
    return supervisions.map(supervision => {
      const school = this.db.schools.find(s => s.id === supervision.schoolId);
      return {
        ...supervision,
        school: school?.name || 'Unknown School',
        teacherName: supervision.teacherName || null,
        teacherNip: supervision.teacherNip || null,
      };
    });
  }

  async createSupervision(supervision: InsertSupervision): Promise<Supervision> {
    const newSupervision: Supervision = {
      id: Date.now().toString(),
      ...supervision,
      date: supervision.date || new Date(),
      teacherName: supervision.teacherName || null,
      teacherNip: supervision.teacherNip || null,
      photo1: supervision.photo1 || null,
      photo2: supervision.photo2 || null,
      recommendations: supervision.recommendations || null,
      createdAt: new Date(),
    };
    this.db.supervisions.push(newSupervision);
    this.saveDatabase();
    return newSupervision;
  }

  async updateSupervision(id: string, supervision: Partial<InsertSupervision>): Promise<Supervision> {
    const index = this.db.supervisions.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Supervision not found');
    this.db.supervisions[index] = { ...this.db.supervisions[index], ...supervision };
    this.saveDatabase();
    return this.db.supervisions[index];
  }

  async deleteSupervision(id: string): Promise<void> {
    this.db.supervisions = this.db.supervisions.filter(s => s.id !== id);
    this.saveDatabase();
  }

  // Additional Tasks
  async getAdditionalTasks(userId: string): Promise<AdditionalTask[]> {
    return this.db.additionalTasks.filter(t => t.userId === userId);
  }

  async createAdditionalTask(task: InsertAdditionalTask): Promise<AdditionalTask> {
    const newTask: AdditionalTask = {
      id: Date.now().toString(),
      ...task,
      date: task.date || new Date(),
      photo1: task.photo1 || null,
      photo2: task.photo2 || null,
      createdAt: new Date(),
    };
    this.db.additionalTasks.push(newTask);
    this.saveDatabase();
    return newTask;
  }

  async updateAdditionalTask(id: string, task: Partial<InsertAdditionalTask>): Promise<AdditionalTask> {
    const index = this.db.additionalTasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Additional task not found');
    this.db.additionalTasks[index] = { ...this.db.additionalTasks[index], ...task };
    this.saveDatabase();
    return this.db.additionalTasks[index];
  }

  async deleteAdditionalTask(id: string): Promise<void> {
    this.db.additionalTasks = this.db.additionalTasks.filter(t => t.id !== id);
    this.saveDatabase();
  }

  // Schools
  async getSchools(userId: string): Promise<School[]> {
    return this.db.schools.filter(s => s.userId === userId);
  }

  async createSchool(school: any): Promise<School> {
    const newSchool: School = {
      id: Date.now().toString(),
      userId: school.userId,
      name: school.name,
      address: school.address,
      contact: school.contact,
      principalName: school.principalName || null,
      principalNip: school.principalNip || null,
      createdAt: new Date(),
    };
    this.db.schools.push(newSchool);
    this.saveDatabase();
    return newSchool;
  }

  async deleteSchool(id: string): Promise<void> {
    this.db.schools = this.db.schools.filter(s => s.id !== id);
    this.saveDatabase();
  }

  // Events
  async getEvents(userId: string): Promise<Event[]> {
    return this.db.events.filter(e => e.userId === userId);
  }

  async createEvent(eventData: any): Promise<Event> {
    const newEvent: Event = {
      id: Date.now().toString(),
      userId: eventData.userId,
      schoolId: eventData.schoolId || null,
      title: eventData.title,
      date: eventData.date || new Date(),
      time: eventData.time,
      description: eventData.description || null,
      reminded: eventData.reminded || false,
      createdAt: new Date(),
    };
    this.db.events.push(newEvent);
    this.saveDatabase();
    return newEvent;
  }

  async deleteEvent(id: string): Promise<void> {
    this.db.events = this.db.events.filter(e => e.id !== id);
    this.saveDatabase();
  }

  // Task update
  async updateTask(id: string, task: any): Promise<any> {
    const index = this.db.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      this.db.tasks[index] = { ...this.db.tasks[index], ...task };
      this.saveDatabase();
      return this.db.tasks[index];
    }
    throw new Error('Task not found');
  }

  // Supervisions by school
  async getSupervisionsBySchool(schoolId: string): Promise<Supervision[]> {
    return this.db.supervisions.filter(s => s.schoolId === schoolId);
  }

  // Reports
  async getMonthlyStats(userId: string, year: number, month: number): Promise<any> {
    return {
      totalTasks: this.db.tasks.filter(t => t.userId === userId).length,
      completedTasks: this.db.tasks.filter(t => t.userId === userId && t.completed).length,
      supervisions: this.db.supervisions.filter(s => s.userId === userId).length,
      additionalTasks: this.db.additionalTasks.filter(t => t.userId === userId).length,
    };
  }

  async getYearlyStats(userId: string, year: number): Promise<any> {
    return {
      totalSupervisions: this.db.supervisions.filter(s => s.userId === userId).length,
      schools: 8,
      monthlyAverage: 10,
      completionRate: 92,
    };
  }
}

export const localStorage = new LocalStorage();
// Auto-detect: use local storage if DATABASE_URL is not configured
export const isLocalStorageEnabled = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('example');
