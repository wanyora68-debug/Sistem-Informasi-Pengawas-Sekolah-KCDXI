import { db } from "./db";
import {
  users,
  schools,
  tasks,
  events,
  supervisions,
  additionalTasks,
  type User,
  type InsertUser,
  type School,
  type InsertSchool,
  type Task,
  type InsertTask,
  type Event,
  type InsertEvent,
  type Supervision,
  type InsertSupervision,
  type AdditionalTask,
  type InsertAdditionalTask,
} from "@shared/schema";
import { eq, and, desc, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: string): Promise<void>;

  // Schools
  getSchools(userId: string): Promise<School[]>;
  getSchool(id: string): Promise<School | undefined>;
  createSchool(school: InsertSchool): Promise<School>;
  deleteSchool(id: string): Promise<void>;

  // Tasks
  getTasks(userId: string): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<InsertTask>): Promise<Task>;
  deleteTask(id: string): Promise<void>;

  // Events
  getEvents(userId: string): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  deleteEvent(id: string): Promise<void>;

  // Supervisions
  getSupervisions(userId: string): Promise<Supervision[]>;
  getSupervisionsBySchool(schoolId: string): Promise<Supervision[]>;
  getSupervision(id: string): Promise<Supervision | undefined>;
  createSupervision(supervision: InsertSupervision): Promise<Supervision>;
  updateSupervision(id: string, supervision: Partial<InsertSupervision>): Promise<Supervision>;
  deleteSupervision(id: string): Promise<void>;

  // Additional Tasks
  getAdditionalTasks(userId: string): Promise<AdditionalTask[]>;
  getAdditionalTask(id: string): Promise<AdditionalTask | undefined>;
  createAdditionalTask(task: InsertAdditionalTask): Promise<AdditionalTask>;
  updateAdditionalTask(id: string, task: Partial<InsertAdditionalTask>): Promise<AdditionalTask>;
  deleteAdditionalTask(id: string): Promise<void>;

  // Reports
  getMonthlyStats(userId: string, year: number, month: number): Promise<any>;
  getYearlyStats(userId: string, year: number): Promise<any>;
}

export class DbStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.query.users.findFirst({ where: eq(users.id, id) });
    return result;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.query.users.findFirst({ where: eq(users.username, username) });
    return result;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.query.users.findMany({
      orderBy: [desc(users.createdAt)],
    });
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Schools
  async getSchools(userId: string): Promise<School[]> {
    return db.query.schools.findMany({
      where: eq(schools.userId, userId),
      orderBy: [desc(schools.createdAt)],
    });
  }

  async getSchool(id: string): Promise<School | undefined> {
    return db.query.schools.findFirst({ where: eq(schools.id, id) });
  }

  async createSchool(school: InsertSchool): Promise<School> {
    const [result] = await db.insert(schools).values(school).returning();
    return result;
  }

  async deleteSchool(id: string): Promise<void> {
    await db.delete(schools).where(eq(schools.id, id));
  }

  // Tasks
  async getTasks(userId: string): Promise<Task[]> {
    return db.query.tasks.findMany({
      where: eq(tasks.userId, userId),
      orderBy: [desc(tasks.date)],
    });
  }

  async getTask(id: string): Promise<Task | undefined> {
    return db.query.tasks.findFirst({ where: eq(tasks.id, id) });
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [result] = await db.insert(tasks).values(task).returning();
    return result;
  }

  async updateTask(id: string, task: Partial<InsertTask>): Promise<Task> {
    const [result] = await db.update(tasks).set(task).where(eq(tasks.id, id)).returning();
    return result;
  }

  async deleteTask(id: string): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  // Events
  async getEvents(userId: string): Promise<Event[]> {
    return db.query.events.findMany({
      where: eq(events.userId, userId),
      orderBy: [desc(events.date)],
    });
  }

  async getEvent(id: string): Promise<Event | undefined> {
    return db.query.events.findFirst({ where: eq(events.id, id) });
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [result] = await db.insert(events).values(event).returning();
    return result;
  }

  async deleteEvent(id: string): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  // Supervisions
  async getSupervisions(userId: string): Promise<any[]> {
    const supervisionsList = await db.query.supervisions.findMany({
      where: eq(supervisions.userId, userId),
      orderBy: [desc(supervisions.date)],
    });
    
    // Manually join with schools
    const results = await Promise.all(
      supervisionsList.map(async (supervision) => {
        const school = await db.query.schools.findFirst({
          where: eq(schools.id, supervision.schoolId),
        });
        return {
          ...supervision,
          school: school?.name || 'Unknown School',
        };
      })
    );
    
    return results;
  }

  async getSupervisionsBySchool(schoolId: string): Promise<Supervision[]> {
    return db.query.supervisions.findMany({
      where: eq(supervisions.schoolId, schoolId),
      orderBy: [desc(supervisions.date)],
    });
  }

  async getSupervision(id: string): Promise<Supervision | undefined> {
    return db.query.supervisions.findFirst({ where: eq(supervisions.id, id) });
  }

  async createSupervision(supervision: InsertSupervision): Promise<Supervision> {
    const [result] = await db.insert(supervisions).values(supervision).returning();
    return result;
  }

  async updateSupervision(id: string, supervision: Partial<InsertSupervision>): Promise<Supervision> {
    const [result] = await db.update(supervisions).set(supervision).where(eq(supervisions.id, id)).returning();
    return result;
  }

  async deleteSupervision(id: string): Promise<void> {
    await db.delete(supervisions).where(eq(supervisions.id, id));
  }

  // Additional Tasks
  async getAdditionalTasks(userId: string): Promise<AdditionalTask[]> {
    return db.query.additionalTasks.findMany({
      where: eq(additionalTasks.userId, userId),
      orderBy: [desc(additionalTasks.date)],
    });
  }

  async getAdditionalTask(id: string): Promise<AdditionalTask | undefined> {
    return db.query.additionalTasks.findFirst({ where: eq(additionalTasks.id, id) });
  }

  async createAdditionalTask(task: InsertAdditionalTask): Promise<AdditionalTask> {
    const [result] = await db.insert(additionalTasks).values(task).returning();
    return result;
  }

  async updateAdditionalTask(id: string, task: Partial<InsertAdditionalTask>): Promise<AdditionalTask> {
    try {
      const [result] = await db.update(additionalTasks).set(task).where(eq(additionalTasks.id, id)).returning();
      if (!result) {
        throw new Error('Additional task not found');
      }
      return result;
    } catch (error: any) {
      console.error('Error updating additional task in storage:', error);
      throw error;
    }
  }

  async deleteAdditionalTask(id: string): Promise<void> {
    await db.delete(additionalTasks).where(eq(additionalTasks.id, id));
  }

  // Reports
  async getMonthlyStats(userId: string, year: number, month: number): Promise<any> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const [taskStats] = await db
      .select({
        total: sql<number>`count(*)::int`,
        completed: sql<number>`count(*) filter (where ${tasks.completed})::int`,
      })
      .from(tasks)
      .where(
        and(
          eq(tasks.userId, userId),
          gte(tasks.date, startDate),
          lte(tasks.date, endDate)
        )
      );

    const [supervisionCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(supervisions)
      .where(
        and(
          eq(supervisions.userId, userId),
          gte(supervisions.date, startDate),
          lte(supervisions.date, endDate)
        )
      );

    const [additionalTaskCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(additionalTasks)
      .where(
        and(
          eq(additionalTasks.userId, userId),
          gte(additionalTasks.date, startDate),
          lte(additionalTasks.date, endDate)
        )
      );

    return {
      totalTasks: taskStats?.total || 0,
      completedTasks: taskStats?.completed || 0,
      supervisions: supervisionCount?.count || 0,
      additionalTasks: additionalTaskCount?.count || 0,
    };
  }

  async getYearlyStats(userId: string, year: number): Promise<any> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const [taskStats] = await db
      .select({
        total: sql<number>`count(*)::int`,
        completed: sql<number>`count(*) filter (where ${tasks.completed})::int`,
      })
      .from(tasks)
      .where(
        and(
          eq(tasks.userId, userId),
          gte(tasks.date, startDate),
          lte(tasks.date, endDate)
        )
      );

    const [supervisionCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(supervisions)
      .where(
        and(
          eq(supervisions.userId, userId),
          gte(supervisions.date, startDate),
          lte(supervisions.date, endDate)
        )
      );

    const [schoolCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schools)
      .where(eq(schools.userId, userId));

    return {
      totalSupervisions: supervisionCount?.count || 0,
      totalTasks: taskStats?.total || 0,
      completedTasks: taskStats?.completed || 0,
      schools: schoolCount?.count || 0,
      completionRate: taskStats?.total
        ? Math.round((taskStats.completed / taskStats.total) * 100)
        : 0,
    };
  }
}

export const storage = new DbStorage();
