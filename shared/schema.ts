import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const roleEnum = pgEnum("role", ["admin", "pengawas"]);
export const taskCategoryEnum = pgEnum("task_category", ["Perencanaan", "Pendampingan", "Pelaporan"]);
export const supervisionTypeEnum = pgEnum("supervision_type", ["Akademik", "Manajerial"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: roleEnum("role").notNull().default("pengawas"),
  nip: text("nip"),
  rank: text("rank"), // Pangkat/Golongan/Ruang
  officeName: text("office_name"), // Nama Kantor
  officeAddress: text("office_address"), // Alamat Kantor
  homeAddress: text("home_address"), // Alamat Rumah
  phone: text("phone"), // Nomor Telepon
  photoUrl: text("photo_url"), // Foto Profil
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const schools = pgTable("schools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  address: text("address").notNull(),
  contact: text("contact").notNull(),
  principalName: text("principal_name"),
  principalNip: text("principal_nip"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSchoolSchema = createInsertSchema(schools).omit({ id: true, createdAt: true });
export type InsertSchool = z.infer<typeof insertSchoolSchema>;
export type School = typeof schools.$inferSelect;

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  category: taskCategoryEnum("category").notNull(),
  description: text("description"),
  completed: boolean("completed").notNull().default(false),
  photo1: text("photo1"),
  photo2: text("photo2"),
  date: timestamp("date").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true, createdAt: true });
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  schoolId: varchar("school_id").references(() => schools.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  description: text("description"),
  reminded: boolean("reminded").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEventSchema = createInsertSchema(events).omit({ id: true, createdAt: true });
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export const supervisions = pgTable("supervisions", {
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
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSupervisionSchema = createInsertSchema(supervisions).omit({ id: true, createdAt: true });
export type InsertSupervision = z.infer<typeof insertSupervisionSchema>;
export type Supervision = typeof supervisions.$inferSelect;

export const additionalTasks = pgTable("additional_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  organizer: text("organizer").notNull(),
  description: text("description").notNull(),
  photo1: text("photo1"),
  photo2: text("photo2"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAdditionalTaskSchema = createInsertSchema(additionalTasks).omit({ id: true, createdAt: true });
export type InsertAdditionalTask = z.infer<typeof insertAdditionalTaskSchema>;
export type AdditionalTask = typeof additionalTasks.$inferSelect;
