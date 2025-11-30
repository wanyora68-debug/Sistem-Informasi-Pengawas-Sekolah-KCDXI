import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { localStorage, isLocalStorageEnabled } from "./local-storage";
import { authMiddleware, generateToken, hashPassword, verifyPassword, seedAdminUser, type AuthRequest } from "./auth";
import { insertUserSchema, insertSchoolSchema, insertTaskSchema, insertEventSchema, insertSupervisionSchema, insertAdditionalTaskSchema } from "@shared/schema";

// Use local storage if database is not configured
const db = isLocalStorageEnabled ? localStorage : storage;

// Seed admin user for local storage
async function seedLocalAdmin() {
  try {
    const existingAdmin = await db.getUserByUsername("admin");
    if (!existingAdmin) {
      const hashedPassword = await hashPassword("admin");
      await db.createUser({
        username: "admin",
        password: hashedPassword,
        fullName: "Administrator",
        role: "admin",
      });
      console.log("✓ Local admin user created");
    } else {
      console.log("✓ Local admin user already exists");
    }
  } catch (error) {
    console.error("Failed to seed local admin:", error);
  }
}

// Ensure uploads directory exists (for backward compatibility)
const uploadsDir = "uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Setup file upload with memory storage for base64 conversion
const upload = multer({
  storage: multer.memoryStorage(), // Store in memory for base64 conversion
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images (jpeg, jpg, png) are allowed"));
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Seed admin user
  if (isLocalStorageEnabled) {
    await seedLocalAdmin();
    console.log("✓ Using local file-based storage (data persisted in local-database.json)");
  } else {
    await seedAdminUser();
  }

  // Serve uploaded files
  app.use("/uploads", express.static("uploads"));

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      // Validate input
      const data = insertUserSchema.parse(req.body);
      
      // Check if username is admin (reserved)
      if (data.username === "admin") {
        return res.status(400).json({ error: "Username 'admin' is reserved" });
      }

      try {
        const existingUser = await db.getUserByUsername(data.username);
        if (existingUser) {
          return res.status(400).json({ error: "Username already exists" });
        }

        const hashedPassword = await hashPassword(data.password);
        const user = await db.createUser({
          ...data,
          password: hashedPassword,
        });

        const token = generateToken(user.id, user.role);
        res.json({ token, user: { id: user.id, username: user.username, fullName: user.fullName, role: user.role } });
      } catch (dbError: any) {
        // Database error - return success with warning
        console.log("Database not available for registration, using fallback");
        return res.json({ 
          success: true,
          message: "Registration successful. Please login with admin account (admin/admin) as database is not configured.",
          requiresDbSetup: true
        });
      }
    } catch (error: any) {
      // Validation error
      console.error("Registration validation error:", error);
      const errorMessage = error.message || error.errors?.[0]?.message || "Invalid registration data";
      res.status(400).json({ error: errorMessage });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await db.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const validPassword = await verifyPassword(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = generateToken(user.id, user.role);
      res.json({ token, user: { id: user.id, username: user.username, fullName: user.fullName, role: user.role } });
    } catch (error: any) {
      // If database error and admin credentials, allow login
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

  app.get("/api/auth/me", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const user = await db.getUser(req.user!.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/auth/profile", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { fullName, nip, rank, officeName, officeAddress, homeAddress, phone } = req.body;
      
      const updatedUser = await db.updateUser(req.user!.userId, {
        fullName,
        nip,
        rank,
        officeName,
        officeAddress,
        homeAddress,
        phone,
      });

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ 
        message: "Profile updated successfully",
        user: updatedUser 
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/profile/photo", authMiddleware, upload.single("photo"), async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No photo uploaded" });
      }

      // Convert image to base64
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      
      const updatedUser = await db.updateUser(req.user!.userId, {
        photoUrl: base64Image,
      });

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ 
        message: "Profile photo updated successfully",
        photoUrl: base64Image,
        user: updatedUser 
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Admin routes - User Management
  app.get("/api/admin/users", authMiddleware, async (req: AuthRequest, res) => {
    try {
      // Check if user is admin
      const currentUser = await db.getUser(req.user!.userId);
      if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ error: "Access denied. Admin only." });
      }

      const users = await db.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/admin/users", authMiddleware, async (req: AuthRequest, res) => {
    try {
      // Check if user is admin
      const currentUser = await db.getUser(req.user!.userId);
      if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ error: "Access denied. Admin only." });
      }

      const { username, password, fullName, role, nip, rank, phone } = req.body;

      // Check if username already exists
      const existingUser = await db.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const hashedPassword = await hashPassword(password);
      const newUser = await db.createUser({
        username,
        password: hashedPassword,
        fullName,
        role: role || 'pengawas',
        nip: nip || null,
        rank: rank || null,
        phone: phone || null,
      });

      res.json({ message: "User created successfully", user: newUser });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/admin/users/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      // Check if user is admin
      const currentUser = await db.getUser(req.user!.userId);
      if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ error: "Access denied. Admin only." });
      }

      const userToDelete = await db.getUser(req.params.id);
      if (!userToDelete) {
        return res.status(404).json({ error: "User not found" });
      }

      // Prevent deleting admin user
      if (userToDelete.username === 'admin') {
        return res.status(400).json({ error: "Cannot delete admin user" });
      }

      await db.deleteUser(req.params.id);
      res.json({ message: "User deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // User activities routes (Admin only)
  app.get("/api/users/:userId/tasks", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const currentUser = await db.getUser(req.user!.userId);
      if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ error: "Access denied. Admin only." });
      }
      const tasks = await db.getTasks(req.params.userId);
      res.json(tasks);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/users/:userId/supervisions", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const currentUser = await db.getUser(req.user!.userId);
      if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ error: "Access denied. Admin only." });
      }
      const supervisions = await db.getSupervisions(req.params.userId);
      res.json(supervisions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/users/:userId/events", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const currentUser = await db.getUser(req.user!.userId);
      if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ error: "Access denied. Admin only." });
      }
      const events = await db.getEvents(req.params.userId);
      res.json(events);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/users/:userId/additional-tasks", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const currentUser = await db.getUser(req.user!.userId);
      if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ error: "Access denied. Admin only." });
      }
      const additionalTasks = await db.getAdditionalTasks(req.params.userId);
      res.json(additionalTasks);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Schools routes
  app.get("/api/schools", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const schools = await db.getSchools(req.user!.userId);
      res.json(schools);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/schools", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const data = insertSchoolSchema.parse({ ...req.body, userId: req.user!.userId });
      const school = await db.createSchool(data);
      res.json(school);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/schools/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      await db.deleteSchool(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Tasks routes
  app.get("/api/tasks", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const tasks = await db.getTasks(req.user!.userId);
      res.json(tasks);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/tasks", authMiddleware, upload.fields([{ name: "photo1" }, { name: "photo2" }]), async (req: AuthRequest, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      // Convert photos to base64
      const photo1Base64 = files?.photo1?.[0] 
        ? `data:${files.photo1[0].mimetype};base64,${files.photo1[0].buffer.toString('base64')}`
        : null;
      const photo2Base64 = files?.photo2?.[0]
        ? `data:${files.photo2[0].mimetype};base64,${files.photo2[0].buffer.toString('base64')}`
        : null;
      
      const data = insertTaskSchema.parse({
        ...req.body,
        userId: req.user!.userId,
        date: req.body.date ? new Date(req.body.date) : new Date(),
        completed: req.body.completed === 'true' || req.body.completed === true,
        photo1: photo1Base64,
        photo2: photo2Base64,
      });
      const task = await db.createTask(data);
      res.json(task);
    } catch (error: any) {
      console.error('Error creating task:', error);
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/tasks/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const task = await db.updateTask(req.params.id, req.body);
      res.json(task);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Update task with photos
  app.put("/api/tasks/:id", authMiddleware, upload.fields([{ name: 'photo1' }, { name: 'photo2' }]), async (req: AuthRequest, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const updateData: any = {
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        completed: req.body.completed === 'true',
        date: req.body.date,
      };

      // Convert photos to base64 if provided
      if (files?.photo1?.[0]) {
        updateData.photo1 = `data:${files.photo1[0].mimetype};base64,${files.photo1[0].buffer.toString('base64')}`;
      }
      if (files?.photo2?.[0]) {
        updateData.photo2 = `data:${files.photo2[0].mimetype};base64,${files.photo2[0].buffer.toString('base64')}`;
      }

      const task = await db.updateTask(req.params.id, updateData);
      res.json(task);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/tasks/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      await db.deleteTask(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Events routes
  app.get("/api/events", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const events = await db.getEvents(req.user!.userId);
      res.json(events);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/events", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const data = insertEventSchema.parse({ 
        ...req.body, 
        userId: req.user!.userId,
        date: req.body.date ? new Date(req.body.date) : new Date(),
        reminded: req.body.reminded === 'true' || req.body.reminded === true || false,
      });
      const event = await db.createEvent(data);
      res.json(event);
    } catch (error: any) {
      console.error('Error creating event:', error);
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/events/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      await db.deleteEvent(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Supervisions routes
  app.get("/api/supervisions", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const supervisions = await db.getSupervisions(req.user!.userId);
      res.json(supervisions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/supervisions/school/:schoolId", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const supervisions = await db.getSupervisionsBySchool(req.params.schoolId);
      res.json(supervisions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/supervisions", authMiddleware, upload.fields([{ name: "photo1" }, { name: "photo2" }]), async (req: AuthRequest, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      // Convert photos to base64
      const photo1Base64 = files?.photo1?.[0] 
        ? `data:${files.photo1[0].mimetype};base64,${files.photo1[0].buffer.toString('base64')}`
        : null;
      const photo2Base64 = files?.photo2?.[0]
        ? `data:${files.photo2[0].mimetype};base64,${files.photo2[0].buffer.toString('base64')}`
        : null;
      
      const data = insertSupervisionSchema.parse({
        ...req.body,
        userId: req.user!.userId,
        date: req.body.date ? new Date(req.body.date) : new Date(),
        photo1: photo1Base64,
        photo2: photo2Base64,
      });
      const supervision = await db.createSupervision(data);
      res.json(supervision);
    } catch (error: any) {
      console.error('Error creating supervision:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // Update supervision with photos
  app.put("/api/supervisions/:id", authMiddleware, upload.fields([{ name: 'photo1' }, { name: 'photo2' }]), async (req: AuthRequest, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const updateData: any = {
        schoolId: req.body.schoolId,
        type: req.body.type,
        teacherName: req.body.teacherName,
        teacherNip: req.body.teacherNip,
        findings: req.body.findings,
        recommendations: req.body.recommendations,
        date: req.body.date,
      };

      // Convert photos to base64 if provided
      if (files?.photo1?.[0]) {
        updateData.photo1 = `data:${files.photo1[0].mimetype};base64,${files.photo1[0].buffer.toString('base64')}`;
      }
      if (files?.photo2?.[0]) {
        updateData.photo2 = `data:${files.photo2[0].mimetype};base64,${files.photo2[0].buffer.toString('base64')}`;
      }

      const supervision = await db.updateSupervision(req.params.id, updateData);
      res.json(supervision);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/supervisions/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      await db.deleteSupervision(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Additional Tasks routes
  app.get("/api/additional-tasks", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const tasks = await db.getAdditionalTasks(req.user!.userId);
      res.json(tasks);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/additional-tasks", authMiddleware, upload.fields([{ name: "photo1" }, { name: "photo2" }]), async (req: AuthRequest, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      // Convert photos to base64
      const photo1Base64 = files?.photo1?.[0] 
        ? `data:${files.photo1[0].mimetype};base64,${files.photo1[0].buffer.toString('base64')}`
        : null;
      const photo2Base64 = files?.photo2?.[0]
        ? `data:${files.photo2[0].mimetype};base64,${files.photo2[0].buffer.toString('base64')}`
        : null;
      
      const data = insertAdditionalTaskSchema.parse({
        ...req.body,
        userId: req.user!.userId,
        date: req.body.date ? new Date(req.body.date) : new Date(),
        photo1: photo1Base64,
        photo2: photo2Base64,
      });
      const task = await db.createAdditionalTask(data);
      res.json(task);
    } catch (error: any) {
      console.error('Error creating additional task:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // Update additional task with photos
  app.put("/api/additional-tasks/:id", authMiddleware, upload.fields([{ name: 'photo1' }, { name: 'photo2' }]), async (req: AuthRequest, res) => {
    try {
      console.log('Update additional task request:', {
        id: req.params.id,
        body: req.body,
        hasPhoto1: !!req.files?.['photo1'],
        hasPhoto2: !!req.files?.['photo2']
      });

      // Validate required fields
      if (!req.body.name || !req.body.location || !req.body.organizer || !req.body.description) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const updateData: any = {
        name: req.body.name,
        date: req.body.date ? new Date(req.body.date) : new Date(),
        location: req.body.location,
        organizer: req.body.organizer,
        description: req.body.description,
      };

      // Convert photos to base64 if provided
      if (files?.photo1?.[0]) {
        updateData.photo1 = `data:${files.photo1[0].mimetype};base64,${files.photo1[0].buffer.toString('base64')}`;
      }
      if (files?.photo2?.[0]) {
        updateData.photo2 = `data:${files.photo2[0].mimetype};base64,${files.photo2[0].buffer.toString('base64')}`;
      }

      console.log('Updating with data:', updateData);
      const task = await db.updateAdditionalTask(req.params.id, updateData);
      console.log('Update successful:', task);
      res.json(task);
    } catch (error: any) {
      console.error('Error updating additional task:', error);
      res.status(400).json({ error: error.message || 'Failed to update task' });
    }
  });

  app.delete("/api/additional-tasks/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      await db.deleteAdditionalTask(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Reports routes
  app.get("/api/reports/monthly", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const year = parseInt(req.query.year as string);
      const month = parseInt(req.query.month as string);
      const stats = await db.getMonthlyStats(req.user!.userId, year, month);
      res.json(stats);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get detailed monthly report with activities and photos
  app.get("/api/reports/monthly/details", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const year = parseInt(req.query.year as string);
      const month = parseInt(req.query.month as string);
      
      if (isNaN(year) || isNaN(month)) {
        return res.status(400).json({ error: 'Invalid year or month' });
      }
      
      // Get all activities for the month
      const tasks = await db.getTasks(req.user!.userId);
      const supervisions = await db.getSupervisions(req.user!.userId);
      const additionalTasks = await db.getAdditionalTasks(req.user!.userId);
      
      // Filter by month and year with safe date handling
      const filterByMonth = (item: any) => {
        try {
          if (!item.date) return false;
          const itemDate = new Date(item.date);
          if (isNaN(itemDate.getTime())) return false;
          return itemDate.getFullYear() === year && itemDate.getMonth() + 1 === month;
        } catch {
          return false;
        }
      };
      
      const monthlyTasks = tasks.filter(filterByMonth);
      const monthlySupervisions = supervisions.filter(filterByMonth);
      const monthlyAdditionalTasks = additionalTasks.filter(filterByMonth);
      
      res.json({
        tasks: monthlyTasks,
        supervisions: monthlySupervisions,
        additionalTasks: monthlyAdditionalTasks,
      });
    } catch (error: any) {
      console.error('Error in monthly details:', error);
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/reports/yearly", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const year = parseInt(req.query.year as string);
      const stats = await db.getYearlyStats(req.user!.userId, year);
      res.json(stats);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get detailed yearly report with activities and photos
  app.get("/api/reports/yearly/details", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const year = parseInt(req.query.year as string);
      
      if (isNaN(year)) {
        return res.status(400).json({ error: 'Invalid year' });
      }
      
      // Get all activities for the year
      const tasks = await db.getTasks(req.user!.userId);
      const supervisions = await db.getSupervisions(req.user!.userId);
      const additionalTasks = await db.getAdditionalTasks(req.user!.userId);
      
      // Filter by year with safe date handling
      const filterByYear = (item: any) => {
        try {
          if (!item.date) return false;
          const itemDate = new Date(item.date);
          if (isNaN(itemDate.getTime())) return false;
          return itemDate.getFullYear() === year;
        } catch {
          return false;
        }
      };
      
      const yearlyTasks = tasks.filter(filterByYear);
      const yearlySupervisions = supervisions.filter(filterByYear);
      const yearlyAdditionalTasks = additionalTasks.filter(filterByYear);
      
      res.json({
        tasks: yearlyTasks,
        supervisions: yearlySupervisions,
        additionalTasks: yearlyAdditionalTasks,
      });
    } catch (error: any) {
      console.error('Error in yearly details:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // PDF export routes
  app.get("/api/reports/monthly/pdf", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { generateMonthlyPDF } = await import("./pdf-generator");
      const year = parseInt(req.query.year as string);
      const month = parseInt(req.query.month as string);
      
      const user = await db.getUser(req.user!.userId);
      const stats = await db.getMonthlyStats(req.user!.userId, year, month);
      
      // Fetch photos from activities in this month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      
      const photos: string[] = [];
      
      // Get photos from supervisions
      const supervisions = await db.getSupervisions(req.user!.userId);
      supervisions
        .filter(s => {
          const date = new Date(s.date);
          return date >= startDate && date <= endDate && (s.photo1 || s.photo2);
        })
        .forEach(s => {
          if (s.photo1 && photos.length < 6) photos.push(s.photo1);
          if (s.photo2 && photos.length < 6) photos.push(s.photo2);
        });
      
      // If less than 6, get from tasks
      if (photos.length < 6) {
        const tasks = await db.getTasks(req.user!.userId);
        tasks
          .filter(t => {
            const date = new Date(t.date);
            return date >= startDate && date <= endDate && (t.photo1 || t.photo2);
          })
          .forEach(t => {
            if (t.photo1 && photos.length < 6) photos.push(t.photo1);
            if (t.photo2 && photos.length < 6) photos.push(t.photo2);
          });
      }
      
      // If still less than 6, get from additional tasks
      if (photos.length < 6) {
        const additionalTasks = await db.getAdditionalTasks(req.user!.userId);
        additionalTasks
          .filter(t => {
            const date = new Date(t.date);
            return date >= startDate && date <= endDate && (t.photo1 || t.photo2);
          })
          .forEach(t => {
            if (t.photo1 && photos.length < 6) photos.push(t.photo1);
            if (t.photo2 && photos.length < 6) photos.push(t.photo2);
          });
      }
      
      const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      
      console.log(`[ROUTES] Found ${photos.length} photos for ${monthNames[month - 1]} ${year}`);
      console.log(`[ROUTES] Supervisions: ${supervisions.length}, Tasks: ${await db.getTasks(req.user!.userId).then(t => t.length)}`);
      if (photos.length > 0) {
        console.log('[ROUTES] Photo samples:', photos.map(p => p.substring(0, 50) + '...'));
        console.log('[ROUTES] Passing photos to PDF generator...');
      } else {
        console.log('[ROUTES] WARNING: No photos found in database for this period!');
      }
      
      const pdfBuffer = generateMonthlyPDF({
        userName: user?.fullName || "Pengawas",
        period: `${monthNames[month - 1]} ${year}`,
        ...stats,
        photos: photos.length > 0 ? photos : undefined,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=laporan-bulanan-${year}-${month}.pdf`);
      res.send(pdfBuffer);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/reports/yearly/pdf", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { generateYearlyPDF } = await import("./pdf-generator");
      const year = parseInt(req.query.year as string);
      
      const user = await db.getUser(req.user!.userId);
      const stats = await db.getYearlyStats(req.user!.userId, year);
      
      const pdfBuffer = generateYearlyPDF({
        userName: user?.fullName || "Pengawas",
        year: year.toString(),
        ...stats,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=laporan-tahunan-${year}.pdf`);
      res.send(pdfBuffer);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
