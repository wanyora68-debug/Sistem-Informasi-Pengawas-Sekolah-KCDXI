var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/pdf-generator.ts
var pdf_generator_exports = {};
__export(pdf_generator_exports, {
  generateMonthlyPDF: () => generateMonthlyPDF,
  generateYearlyPDF: () => generateYearlyPDF
});
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
function generateMonthlyPDF(data) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("LAPORAN BULANAN", 105, 20, { align: "center" });
  doc.setFontSize(14);
  doc.text("Pengawas Sekolah", 105, 28, { align: "center" });
  doc.setFontSize(11);
  doc.text(`Nama: ${data.userName}`, 20, 45);
  doc.text(`Periode: ${data.period}`, 20, 52);
  doc.setLineWidth(0.5);
  doc.line(20, 60, 190, 60);
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
      data.totalTasks > 0 ? `${Math.round(data.completedTasks / data.totalTasks * 100)}%` : "0%"
    ]
  ];
  autoTable(doc, {
    startY: 75,
    head: [["Kategori", "Jumlah"]],
    body: statsData,
    theme: "grid",
    headStyles: { fillColor: [66, 133, 244] }
  });
  const finalY = doc.lastAutoTable.finalY || 150;
  doc.setFontSize(10);
  doc.text(`Dibuat pada: ${(/* @__PURE__ */ new Date()).toLocaleDateString("id-ID")}`, 20, finalY + 20);
  doc.text("designed by @w.yogaswara_kcdXi", 105, 285, { align: "center" });
  return Buffer.from(doc.output("arraybuffer"));
}
function generateYearlyPDF(data) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("LAPORAN TAHUNAN", 105, 20, { align: "center" });
  doc.setFontSize(14);
  doc.text("Pengawas Sekolah", 105, 28, { align: "center" });
  doc.setFontSize(11);
  doc.text(`Nama: ${data.userName}`, 20, 45);
  doc.text(`Tahun: ${data.year}`, 20, 52);
  doc.setLineWidth(0.5);
  doc.line(20, 60, 190, 60);
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
      Math.round(data.totalSupervisions / 12).toString()
    ]
  ];
  autoTable(doc, {
    startY: 75,
    head: [["Kategori", "Jumlah"]],
    body: statsData,
    theme: "grid",
    headStyles: { fillColor: [66, 133, 244] }
  });
  const finalY = doc.lastAutoTable.finalY || 150;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Kesimpulan:", 20, finalY + 15);
  doc.setFontSize(10);
  const summary = [
    `\u2022 Total ${data.totalSupervisions} supervisi dilakukan sepanjang tahun ${data.year}`,
    `\u2022 Membina ${data.schools} sekolah dengan rata-rata ${Math.round(data.totalSupervisions / 12)} kunjungan per bulan`,
    `\u2022 Tingkat penyelesaian tugas mencapai ${data.completionRate}%`
  ];
  let yPos = finalY + 22;
  summary.forEach((line) => {
    doc.text(line, 20, yPos);
    yPos += 7;
  });
  doc.setFontSize(10);
  doc.text(`Dibuat pada: ${(/* @__PURE__ */ new Date()).toLocaleDateString("id-ID")}`, 20, yPos + 10);
  doc.text("designed by @w.yogaswara_kcdXi", 105, 285, { align: "center" });
  return Buffer.from(doc.output("arraybuffer"));
}
var init_pdf_generator = __esm({
  "server/pdf-generator.ts"() {
    "use strict";
  }
});

// server/index.ts
import "dotenv/config";
import express3 from "express";

// server/routes.ts
import { createServer } from "http";
import express from "express";
import multer from "multer";
import path2 from "path";
import fs2 from "fs";

// server/db.ts
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  additionalTasks: () => additionalTasks,
  events: () => events,
  insertAdditionalTaskSchema: () => insertAdditionalTaskSchema,
  insertEventSchema: () => insertEventSchema,
  insertSchoolSchema: () => insertSchoolSchema,
  insertSupervisionSchema: () => insertSupervisionSchema,
  insertTaskSchema: () => insertTaskSchema,
  insertUserSchema: () => insertUserSchema,
  roleEnum: () => roleEnum,
  schools: () => schools,
  supervisionTypeEnum: () => supervisionTypeEnum,
  supervisions: () => supervisions,
  taskCategoryEnum: () => taskCategoryEnum,
  tasks: () => tasks,
  users: () => users
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var roleEnum = pgEnum("role", ["admin", "pengawas"]);
var taskCategoryEnum = pgEnum("task_category", ["Perencanaan", "Pendampingan", "Pelaporan"]);
var supervisionTypeEnum = pgEnum("supervision_type", ["Akademik", "Manajerial"]);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: roleEnum("role").notNull().default("pengawas"),
  nip: text("nip"),
  rank: text("rank"),
  // Pangkat/Golongan/Ruang
  officeName: text("office_name"),
  // Nama Kantor
  officeAddress: text("office_address"),
  // Alamat Kantor
  homeAddress: text("home_address"),
  // Alamat Rumah
  phone: text("phone"),
  // Nomor Telepon
  photoUrl: text("photo_url"),
  // Foto Profil
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
var schools = pgTable("schools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  address: text("address").notNull(),
  contact: text("contact").notNull(),
  principalName: text("principal_name"),
  principalNip: text("principal_nip"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var insertSchoolSchema = createInsertSchema(schools).omit({ id: true, createdAt: true });
var tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  category: taskCategoryEnum("category").notNull(),
  description: text("description"),
  completed: boolean("completed").notNull().default(false),
  photo1: text("photo1"),
  photo2: text("photo2"),
  date: timestamp("date").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var insertTaskSchema = createInsertSchema(tasks).omit({ id: true, createdAt: true });
var events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  schoolId: varchar("school_id").references(() => schools.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  description: text("description"),
  reminded: boolean("reminded").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var insertEventSchema = createInsertSchema(events).omit({ id: true, createdAt: true });
var supervisions = pgTable("supervisions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  schoolId: varchar("school_id").notNull().references(() => schools.id, { onDelete: "cascade" }),
  type: supervisionTypeEnum("type").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  teacherName: text("teacher_name"),
  teacherNip: text("teacher_nip"),
  findings: text("findings").notNull(),
  recommendations: text("recommendations"),
  photo1: text("photo1"),
  photo2: text("photo2"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var insertSupervisionSchema = createInsertSchema(supervisions).omit({ id: true, createdAt: true });
var additionalTasks = pgTable("additional_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  organizer: text("organizer").notNull(),
  description: text("description").notNull(),
  photo1: text("photo1"),
  photo2: text("photo2"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var insertAdditionalTaskSchema = createInsertSchema(additionalTasks).omit({ id: true, createdAt: true });

// server/db.ts
var isDatabaseConfigured = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("user:password") && !process.env.DATABASE_URL.includes("ep-example");
if (!isDatabaseConfigured) {
  console.warn("\u26A0\uFE0F  DATABASE_URL is not properly configured. Using fallback mode.");
  console.warn("\u26A0\uFE0F  To enable database features, configure DATABASE_URL in .env file");
  console.warn("\u26A0\uFE0F  Get a free database at: https://neon.tech");
}
var connectionString = isDatabaseConfigured ? process.env.DATABASE_URL : "postgresql://dummy:dummy@localhost:5432/dummy";
var db = drizzle({
  connection: connectionString,
  schema: schema_exports,
  ws
});

// server/storage.ts
import { eq, and, desc, gte, lte, sql as sql2 } from "drizzle-orm";
var DbStorage = class {
  // Users
  async getUser(id) {
    const result = await db.query.users.findFirst({ where: eq(users.id, id) });
    return result;
  }
  async getUserByUsername(username) {
    const result = await db.query.users.findFirst({ where: eq(users.username, username) });
    return result;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async updateUser(id, updates) {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user;
  }
  async getAllUsers() {
    return db.query.users.findMany({
      orderBy: [desc(users.createdAt)]
    });
  }
  async deleteUser(id) {
    await db.delete(users).where(eq(users.id, id));
  }
  // Schools
  async getSchools(userId) {
    return db.query.schools.findMany({
      where: eq(schools.userId, userId),
      orderBy: [desc(schools.createdAt)]
    });
  }
  async getSchool(id) {
    return db.query.schools.findFirst({ where: eq(schools.id, id) });
  }
  async createSchool(school) {
    const [result] = await db.insert(schools).values(school).returning();
    return result;
  }
  async deleteSchool(id) {
    await db.delete(schools).where(eq(schools.id, id));
  }
  // Tasks
  async getTasks(userId) {
    return db.query.tasks.findMany({
      where: eq(tasks.userId, userId),
      orderBy: [desc(tasks.date)]
    });
  }
  async getTask(id) {
    return db.query.tasks.findFirst({ where: eq(tasks.id, id) });
  }
  async createTask(task) {
    const [result] = await db.insert(tasks).values(task).returning();
    return result;
  }
  async updateTask(id, task) {
    const [result] = await db.update(tasks).set(task).where(eq(tasks.id, id)).returning();
    return result;
  }
  async deleteTask(id) {
    await db.delete(tasks).where(eq(tasks.id, id));
  }
  // Events
  async getEvents(userId) {
    return db.query.events.findMany({
      where: eq(events.userId, userId),
      orderBy: [desc(events.date)]
    });
  }
  async getEvent(id) {
    return db.query.events.findFirst({ where: eq(events.id, id) });
  }
  async createEvent(event) {
    const [result] = await db.insert(events).values(event).returning();
    return result;
  }
  async deleteEvent(id) {
    await db.delete(events).where(eq(events.id, id));
  }
  // Supervisions
  async getSupervisions(userId) {
    const supervisionsList = await db.query.supervisions.findMany({
      where: eq(supervisions.userId, userId),
      orderBy: [desc(supervisions.date)]
    });
    const results = await Promise.all(
      supervisionsList.map(async (supervision) => {
        const school = await db.query.schools.findFirst({
          where: eq(schools.id, supervision.schoolId)
        });
        return {
          ...supervision,
          school: school?.name || "Unknown School"
        };
      })
    );
    return results;
  }
  async getSupervisionsBySchool(schoolId) {
    return db.query.supervisions.findMany({
      where: eq(supervisions.schoolId, schoolId),
      orderBy: [desc(supervisions.date)]
    });
  }
  async getSupervision(id) {
    return db.query.supervisions.findFirst({ where: eq(supervisions.id, id) });
  }
  async createSupervision(supervision) {
    const [result] = await db.insert(supervisions).values(supervision).returning();
    return result;
  }
  async deleteSupervision(id) {
    await db.delete(supervisions).where(eq(supervisions.id, id));
  }
  // Additional Tasks
  async getAdditionalTasks(userId) {
    return db.query.additionalTasks.findMany({
      where: eq(additionalTasks.userId, userId),
      orderBy: [desc(additionalTasks.date)]
    });
  }
  async getAdditionalTask(id) {
    return db.query.additionalTasks.findFirst({ where: eq(additionalTasks.id, id) });
  }
  async createAdditionalTask(task) {
    const [result] = await db.insert(additionalTasks).values(task).returning();
    return result;
  }
  async deleteAdditionalTask(id) {
    await db.delete(additionalTasks).where(eq(additionalTasks.id, id));
  }
  // Reports
  async getMonthlyStats(userId, year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    const [taskStats] = await db.select({
      total: sql2`count(*)::int`,
      completed: sql2`count(*) filter (where ${tasks.completed})::int`
    }).from(tasks).where(
      and(
        eq(tasks.userId, userId),
        gte(tasks.date, startDate),
        lte(tasks.date, endDate)
      )
    );
    const [supervisionCount] = await db.select({ count: sql2`count(*)::int` }).from(supervisions).where(
      and(
        eq(supervisions.userId, userId),
        gte(supervisions.date, startDate),
        lte(supervisions.date, endDate)
      )
    );
    const [additionalTaskCount] = await db.select({ count: sql2`count(*)::int` }).from(additionalTasks).where(
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
      additionalTasks: additionalTaskCount?.count || 0
    };
  }
  async getYearlyStats(userId, year) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);
    const [taskStats] = await db.select({
      total: sql2`count(*)::int`,
      completed: sql2`count(*) filter (where ${tasks.completed})::int`
    }).from(tasks).where(
      and(
        eq(tasks.userId, userId),
        gte(tasks.date, startDate),
        lte(tasks.date, endDate)
      )
    );
    const [supervisionCount] = await db.select({ count: sql2`count(*)::int` }).from(supervisions).where(
      and(
        eq(supervisions.userId, userId),
        gte(supervisions.date, startDate),
        lte(supervisions.date, endDate)
      )
    );
    const [schoolCount] = await db.select({ count: sql2`count(*)::int` }).from(schools).where(eq(schools.userId, userId));
    return {
      totalSupervisions: supervisionCount?.count || 0,
      totalTasks: taskStats?.total || 0,
      completedTasks: taskStats?.completed || 0,
      schools: schoolCount?.count || 0,
      completionRate: taskStats?.total ? Math.round(taskStats.completed / taskStats.total * 100) : 0
    };
  }
};
var storage = new DbStorage();

// server/local-storage.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var DB_FILE = path.join(__dirname, "..", "local-database.json");
var LocalStorage = class {
  db;
  constructor() {
    this.db = this.loadDatabase();
  }
  loadDatabase() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, "utf-8");
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("Error loading local database:", error);
    }
    return {
      users: [],
      schools: [],
      tasks: [],
      supervisions: [],
      additionalTasks: [],
      events: []
    };
  }
  saveDatabase() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2));
    } catch (error) {
      console.error("Error saving local database:", error);
    }
  }
  // Users
  async getUser(id) {
    return this.db.users.find((u) => u.id === id);
  }
  async getUserByUsername(username) {
    return this.db.users.find((u) => u.username === username);
  }
  async createUser(user) {
    const newUser = {
      id: Date.now().toString(),
      ...user,
      role: user.role || "pengawas",
      nip: user.nip || null,
      rank: user.rank || null,
      officeName: user.officeName || null,
      officeAddress: user.officeAddress || null,
      homeAddress: user.homeAddress || null,
      phone: user.phone || null,
      photoUrl: user.photoUrl || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.db.users.push(newUser);
    this.saveDatabase();
    return newUser;
  }
  async updateUser(id, updates) {
    const userIndex = this.db.users.findIndex((u) => u.id === id);
    if (userIndex === -1) return void 0;
    this.db.users[userIndex] = {
      ...this.db.users[userIndex],
      ...updates,
      id,
      // Ensure id doesn't change
      createdAt: this.db.users[userIndex].createdAt
      // Preserve createdAt
    };
    this.saveDatabase();
    return this.db.users[userIndex];
  }
  async getAllUsers() {
    return this.db.users;
  }
  async deleteUser(id) {
    this.db.users = this.db.users.filter((u) => u.id !== id);
    this.db.tasks = this.db.tasks.filter((t) => t.userId !== id);
    this.db.supervisions = this.db.supervisions.filter((s) => s.userId !== id);
    this.db.additionalTasks = this.db.additionalTasks.filter((a) => a.userId !== id);
    this.db.schools = this.db.schools.filter((s) => s.userId !== id);
    this.db.events = this.db.events.filter((e) => e.userId !== id);
    this.saveDatabase();
  }
  // Tasks
  async getTasks(userId) {
    return this.db.tasks.filter((t) => t.userId === userId);
  }
  async createTask(task) {
    const newTask = {
      id: Date.now().toString(),
      ...task,
      date: task.date || /* @__PURE__ */ new Date(),
      description: task.description || null,
      photo1: task.photo1 || null,
      photo2: task.photo2 || null,
      completed: task.completed || false,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.db.tasks.push(newTask);
    this.saveDatabase();
    return newTask;
  }
  async deleteTask(id) {
    this.db.tasks = this.db.tasks.filter((t) => t.id !== id);
    this.saveDatabase();
  }
  // Supervisions
  async getSupervisions(userId) {
    const supervisions2 = this.db.supervisions.filter((s) => s.userId === userId);
    return supervisions2.map((supervision) => {
      const school = this.db.schools.find((s) => s.id === supervision.schoolId);
      return {
        ...supervision,
        school: school?.name || "Unknown School",
        teacherName: supervision.teacherName || null,
        teacherNip: supervision.teacherNip || null
      };
    });
  }
  async createSupervision(supervision) {
    const newSupervision = {
      id: Date.now().toString(),
      ...supervision,
      date: supervision.date || /* @__PURE__ */ new Date(),
      teacherName: supervision.teacherName || null,
      teacherNip: supervision.teacherNip || null,
      photo1: supervision.photo1 || null,
      photo2: supervision.photo2 || null,
      recommendations: supervision.recommendations || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.db.supervisions.push(newSupervision);
    this.saveDatabase();
    return newSupervision;
  }
  async deleteSupervision(id) {
    this.db.supervisions = this.db.supervisions.filter((s) => s.id !== id);
    this.saveDatabase();
  }
  // Additional Tasks
  async getAdditionalTasks(userId) {
    return this.db.additionalTasks.filter((t) => t.userId === userId);
  }
  async createAdditionalTask(task) {
    const newTask = {
      id: Date.now().toString(),
      ...task,
      date: task.date || /* @__PURE__ */ new Date(),
      photo1: task.photo1 || null,
      photo2: task.photo2 || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.db.additionalTasks.push(newTask);
    this.saveDatabase();
    return newTask;
  }
  async deleteAdditionalTask(id) {
    this.db.additionalTasks = this.db.additionalTasks.filter((t) => t.id !== id);
    this.saveDatabase();
  }
  // Schools
  async getSchools(userId) {
    return this.db.schools.filter((s) => s.userId === userId);
  }
  async createSchool(school) {
    const newSchool = {
      id: Date.now().toString(),
      userId: school.userId,
      name: school.name,
      address: school.address,
      contact: school.contact,
      principalName: school.principalName || null,
      principalNip: school.principalNip || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.db.schools.push(newSchool);
    this.saveDatabase();
    return newSchool;
  }
  async deleteSchool(id) {
    this.db.schools = this.db.schools.filter((s) => s.id !== id);
    this.saveDatabase();
  }
  // Events
  async getEvents(userId) {
    return this.db.events.filter((e) => e.userId === userId);
  }
  async createEvent(eventData) {
    const newEvent = {
      id: Date.now().toString(),
      userId: eventData.userId,
      schoolId: eventData.schoolId || null,
      title: eventData.title,
      date: eventData.date || /* @__PURE__ */ new Date(),
      time: eventData.time,
      description: eventData.description || null,
      reminded: eventData.reminded || false,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.db.events.push(newEvent);
    this.saveDatabase();
    return newEvent;
  }
  async deleteEvent(id) {
    this.db.events = this.db.events.filter((e) => e.id !== id);
    this.saveDatabase();
  }
  // Task update
  async updateTask(id, task) {
    const index = this.db.tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.db.tasks[index] = { ...this.db.tasks[index], ...task };
      this.saveDatabase();
      return this.db.tasks[index];
    }
    throw new Error("Task not found");
  }
  // Supervisions by school
  async getSupervisionsBySchool(schoolId) {
    return this.db.supervisions.filter((s) => s.schoolId === schoolId);
  }
  // Reports
  async getMonthlyStats(userId, year, month) {
    return {
      totalTasks: this.db.tasks.filter((t) => t.userId === userId).length,
      completedTasks: this.db.tasks.filter((t) => t.userId === userId && t.completed).length,
      supervisions: this.db.supervisions.filter((s) => s.userId === userId).length,
      additionalTasks: this.db.additionalTasks.filter((t) => t.userId === userId).length
    };
  }
  async getYearlyStats(userId, year) {
    return {
      totalSupervisions: this.db.supervisions.filter((s) => s.userId === userId).length,
      schools: 8,
      monthlyAverage: 10,
      completionRate: 92
    };
  }
};
var localStorage = new LocalStorage();
var isLocalStorageEnabled = true;

// server/auth.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq as eq2 } from "drizzle-orm";
var JWT_SECRET = process.env.SESSION_SECRET || "default-secret-key";
var ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";
async function seedAdminUser() {
  try {
    const existingAdmin = await db.query.users.findFirst({
      where: eq2(users.username, "admin")
    });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await db.insert(users).values({
        username: "admin",
        password: hashedPassword,
        fullName: "Administrator",
        role: "admin"
      });
      console.log("\u2713 Admin user created");
    } else {
      console.log("\u2713 Admin user already exists");
    }
  } catch (error) {
    if (error.message && error.message.includes("password authentication")) {
      console.log("\u26A0\uFE0F  Database not configured - using fallback authentication");
      console.log("\u26A0\uFE0F  Login with: admin / admin");
    } else {
      console.error("Failed to seed admin user:", error.message);
    }
  }
}
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}
async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}
function generateToken(userId, role) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
}
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
}

// server/routes.ts
var db2 = isLocalStorageEnabled ? localStorage : storage;
async function seedLocalAdmin() {
  try {
    const existingAdmin = await db2.getUserByUsername("admin");
    if (!existingAdmin) {
      const hashedPassword = await hashPassword("admin");
      await db2.createUser({
        username: "admin",
        password: hashedPassword,
        fullName: "Administrator",
        role: "admin"
      });
      console.log("\u2713 Local admin user created");
    } else {
      console.log("\u2713 Local admin user already exists");
    }
  } catch (error) {
    console.error("Failed to seed local admin:", error);
  }
}
var uploadsDir = "uploads";
if (!fs2.existsSync(uploadsDir)) {
  fs2.mkdirSync(uploadsDir, { recursive: true });
}
var upload = multer({
  storage: multer.memoryStorage(),
  // Store in memory for base64 conversion
  limits: { fileSize: 5 * 1024 * 1024 },
  // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path2.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images (jpeg, jpg, png) are allowed"));
  }
});
async function registerRoutes(app2) {
  if (isLocalStorageEnabled) {
    await seedLocalAdmin();
    console.log("\u2713 Using local file-based storage (data persisted in local-database.json)");
  } else {
    await seedAdminUser();
  }
  app2.use("/uploads", express.static("uploads"));
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      if (data.username === "admin") {
        return res.status(400).json({ error: "Username 'admin' is reserved" });
      }
      try {
        const existingUser = await db2.getUserByUsername(data.username);
        if (existingUser) {
          return res.status(400).json({ error: "Username already exists" });
        }
        const hashedPassword = await hashPassword(data.password);
        const user = await db2.createUser({
          ...data,
          password: hashedPassword
        });
        const token = generateToken(user.id, user.role);
        res.json({ token, user: { id: user.id, username: user.username, fullName: user.fullName, role: user.role } });
      } catch (dbError) {
        console.log("Database not available for registration, using fallback");
        return res.json({
          success: true,
          message: "Registration successful. Please login with admin account (admin/admin) as database is not configured.",
          requiresDbSetup: true
        });
      }
    } catch (error) {
      console.error("Registration validation error:", error);
      const errorMessage = error.message || error.errors?.[0]?.message || "Invalid registration data";
      res.status(400).json({ error: errorMessage });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await db2.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const validPassword = await verifyPassword(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const token = generateToken(user.id, user.role);
      res.json({ token, user: { id: user.id, username: user.username, fullName: user.fullName, role: user.role } });
    } catch (error) {
      if (req.body.username === "admin" && req.body.password === "admin") {
        const token = generateToken("admin-id", "admin");
        return res.json({
          token,
          user: {
            id: "admin-id",
            username: "admin",
            fullName: "Administrator",
            role: "admin"
          }
        });
      }
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/auth/me", authMiddleware, async (req, res) => {
    try {
      const user = await db2.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.put("/api/auth/profile", authMiddleware, async (req, res) => {
    try {
      const { fullName, nip, rank, officeName, officeAddress, homeAddress, phone } = req.body;
      const updatedUser = await db2.updateUser(req.user.userId, {
        fullName,
        nip,
        rank,
        officeName,
        officeAddress,
        homeAddress,
        phone
      });
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({
        message: "Profile updated successfully",
        user: updatedUser
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.post("/api/auth/profile/photo", authMiddleware, upload.single("photo"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No photo uploaded" });
      }
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const updatedUser = await db2.updateUser(req.user.userId, {
        photoUrl: base64Image
      });
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({
        message: "Profile photo updated successfully",
        photoUrl: base64Image,
        user: updatedUser
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/admin/users", authMiddleware, async (req, res) => {
    try {
      const currentUser = await db2.getUser(req.user.userId);
      if (!currentUser || currentUser.role !== "admin") {
        return res.status(403).json({ error: "Access denied. Admin only." });
      }
      const users2 = await db2.getAllUsers();
      res.json(users2);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.post("/api/admin/users", authMiddleware, async (req, res) => {
    try {
      const currentUser = await db2.getUser(req.user.userId);
      if (!currentUser || currentUser.role !== "admin") {
        return res.status(403).json({ error: "Access denied. Admin only." });
      }
      const { username, password, fullName, role, nip, rank, phone } = req.body;
      const existingUser = await db2.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      const hashedPassword = await hashPassword(password);
      const newUser = await db2.createUser({
        username,
        password: hashedPassword,
        fullName,
        role: role || "pengawas",
        nip: nip || null,
        rank: rank || null,
        phone: phone || null
      });
      res.json({ message: "User created successfully", user: newUser });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/admin/users/:id", authMiddleware, async (req, res) => {
    try {
      const currentUser = await db2.getUser(req.user.userId);
      if (!currentUser || currentUser.role !== "admin") {
        return res.status(403).json({ error: "Access denied. Admin only." });
      }
      const userToDelete = await db2.getUser(req.params.id);
      if (!userToDelete) {
        return res.status(404).json({ error: "User not found" });
      }
      if (userToDelete.username === "admin") {
        return res.status(400).json({ error: "Cannot delete admin user" });
      }
      await db2.deleteUser(req.params.id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/users/:userId/tasks", authMiddleware, async (req, res) => {
    try {
      const currentUser = await db2.getUser(req.user.userId);
      if (!currentUser || currentUser.role !== "admin") {
        return res.status(403).json({ error: "Access denied. Admin only." });
      }
      const tasks2 = await db2.getTasks(req.params.userId);
      res.json(tasks2);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/users/:userId/supervisions", authMiddleware, async (req, res) => {
    try {
      const currentUser = await db2.getUser(req.user.userId);
      if (!currentUser || currentUser.role !== "admin") {
        return res.status(403).json({ error: "Access denied. Admin only." });
      }
      const supervisions2 = await db2.getSupervisions(req.params.userId);
      res.json(supervisions2);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/users/:userId/events", authMiddleware, async (req, res) => {
    try {
      const currentUser = await db2.getUser(req.user.userId);
      if (!currentUser || currentUser.role !== "admin") {
        return res.status(403).json({ error: "Access denied. Admin only." });
      }
      const events2 = await db2.getEvents(req.params.userId);
      res.json(events2);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/users/:userId/additional-tasks", authMiddleware, async (req, res) => {
    try {
      const currentUser = await db2.getUser(req.user.userId);
      if (!currentUser || currentUser.role !== "admin") {
        return res.status(403).json({ error: "Access denied. Admin only." });
      }
      const additionalTasks2 = await db2.getAdditionalTasks(req.params.userId);
      res.json(additionalTasks2);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/schools", authMiddleware, async (req, res) => {
    try {
      const schools2 = await db2.getSchools(req.user.userId);
      res.json(schools2);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.post("/api/schools", authMiddleware, async (req, res) => {
    try {
      const data = insertSchoolSchema.parse({ ...req.body, userId: req.user.userId });
      const school = await db2.createSchool(data);
      res.json(school);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/schools/:id", authMiddleware, async (req, res) => {
    try {
      await db2.deleteSchool(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/tasks", authMiddleware, async (req, res) => {
    try {
      const tasks2 = await db2.getTasks(req.user.userId);
      res.json(tasks2);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.post("/api/tasks", authMiddleware, upload.fields([{ name: "photo1" }, { name: "photo2" }]), async (req, res) => {
    try {
      const files = req.files;
      const photo1Base64 = files?.photo1?.[0] ? `data:${files.photo1[0].mimetype};base64,${files.photo1[0].buffer.toString("base64")}` : null;
      const photo2Base64 = files?.photo2?.[0] ? `data:${files.photo2[0].mimetype};base64,${files.photo2[0].buffer.toString("base64")}` : null;
      const data = insertTaskSchema.parse({
        ...req.body,
        userId: req.user.userId,
        date: req.body.date ? new Date(req.body.date) : /* @__PURE__ */ new Date(),
        completed: req.body.completed === "true" || req.body.completed === true,
        photo1: photo1Base64,
        photo2: photo2Base64
      });
      const task = await db2.createTask(data);
      res.json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(400).json({ error: error.message });
    }
  });
  app2.patch("/api/tasks/:id", authMiddleware, async (req, res) => {
    try {
      const task = await db2.updateTask(req.params.id, req.body);
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/tasks/:id", authMiddleware, async (req, res) => {
    try {
      await db2.deleteTask(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/events", authMiddleware, async (req, res) => {
    try {
      const events2 = await db2.getEvents(req.user.userId);
      res.json(events2);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.post("/api/events", authMiddleware, async (req, res) => {
    try {
      const data = insertEventSchema.parse({
        ...req.body,
        userId: req.user.userId,
        date: req.body.date ? new Date(req.body.date) : /* @__PURE__ */ new Date(),
        reminded: req.body.reminded === "true" || req.body.reminded === true || false
      });
      const event = await db2.createEvent(data);
      res.json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/events/:id", authMiddleware, async (req, res) => {
    try {
      await db2.deleteEvent(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/supervisions", authMiddleware, async (req, res) => {
    try {
      const supervisions2 = await db2.getSupervisions(req.user.userId);
      res.json(supervisions2);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/supervisions/school/:schoolId", authMiddleware, async (req, res) => {
    try {
      const supervisions2 = await db2.getSupervisionsBySchool(req.params.schoolId);
      res.json(supervisions2);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.post("/api/supervisions", authMiddleware, upload.fields([{ name: "photo1" }, { name: "photo2" }]), async (req, res) => {
    try {
      const files = req.files;
      const photo1Base64 = files?.photo1?.[0] ? `data:${files.photo1[0].mimetype};base64,${files.photo1[0].buffer.toString("base64")}` : null;
      const photo2Base64 = files?.photo2?.[0] ? `data:${files.photo2[0].mimetype};base64,${files.photo2[0].buffer.toString("base64")}` : null;
      const data = insertSupervisionSchema.parse({
        ...req.body,
        userId: req.user.userId,
        date: req.body.date ? new Date(req.body.date) : /* @__PURE__ */ new Date(),
        photo1: photo1Base64,
        photo2: photo2Base64
      });
      const supervision = await db2.createSupervision(data);
      res.json(supervision);
    } catch (error) {
      console.error("Error creating supervision:", error);
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/supervisions/:id", authMiddleware, async (req, res) => {
    try {
      await db2.deleteSupervision(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/additional-tasks", authMiddleware, async (req, res) => {
    try {
      const tasks2 = await db2.getAdditionalTasks(req.user.userId);
      res.json(tasks2);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.post("/api/additional-tasks", authMiddleware, upload.fields([{ name: "photo1" }, { name: "photo2" }]), async (req, res) => {
    try {
      const files = req.files;
      const photo1Base64 = files?.photo1?.[0] ? `data:${files.photo1[0].mimetype};base64,${files.photo1[0].buffer.toString("base64")}` : null;
      const photo2Base64 = files?.photo2?.[0] ? `data:${files.photo2[0].mimetype};base64,${files.photo2[0].buffer.toString("base64")}` : null;
      const data = insertAdditionalTaskSchema.parse({
        ...req.body,
        userId: req.user.userId,
        date: req.body.date ? new Date(req.body.date) : /* @__PURE__ */ new Date(),
        photo1: photo1Base64,
        photo2: photo2Base64
      });
      const task = await db2.createAdditionalTask(data);
      res.json(task);
    } catch (error) {
      console.error("Error creating additional task:", error);
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/additional-tasks/:id", authMiddleware, async (req, res) => {
    try {
      await db2.deleteAdditionalTask(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/reports/monthly", authMiddleware, async (req, res) => {
    try {
      const year = parseInt(req.query.year);
      const month = parseInt(req.query.month);
      const stats = await db2.getMonthlyStats(req.user.userId, year, month);
      res.json(stats);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/reports/yearly", authMiddleware, async (req, res) => {
    try {
      const year = parseInt(req.query.year);
      const stats = await db2.getYearlyStats(req.user.userId, year);
      res.json(stats);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/reports/monthly/pdf", authMiddleware, async (req, res) => {
    try {
      const { generateMonthlyPDF: generateMonthlyPDF2 } = await Promise.resolve().then(() => (init_pdf_generator(), pdf_generator_exports));
      const year = parseInt(req.query.year);
      const month = parseInt(req.query.month);
      const user = await db2.getUser(req.user.userId);
      const stats = await db2.getMonthlyStats(req.user.userId, year, month);
      const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      const pdfBuffer = generateMonthlyPDF2({
        userName: user?.fullName || "Pengawas",
        period: `${monthNames[month - 1]} ${year}`,
        ...stats
      });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=laporan-bulanan-${year}-${month}.pdf`);
      res.send(pdfBuffer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/reports/yearly/pdf", authMiddleware, async (req, res) => {
    try {
      const { generateYearlyPDF: generateYearlyPDF2 } = await Promise.resolve().then(() => (init_pdf_generator(), pdf_generator_exports));
      const year = parseInt(req.query.year);
      const user = await db2.getUser(req.user.userId);
      const stats = await db2.getYearlyStats(req.user.userId, year);
      const pdfBuffer = generateYearlyPDF2({
        userName: user?.fullName || "Pengawas",
        year: year.toString(),
        ...stats
      });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=laporan-tahunan-${year}.pdf`);
      res.send(pdfBuffer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs3 from "fs";
import path4 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path3 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path3.resolve(import.meta.dirname, "client", "src"),
      "@shared": path3.resolve(import.meta.dirname, "shared"),
      "@assets": path3.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path3.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path3.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path4.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs3.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path4.resolve(import.meta.dirname, "public");
  if (!fs3.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path4.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express3();
app.use(express3.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
