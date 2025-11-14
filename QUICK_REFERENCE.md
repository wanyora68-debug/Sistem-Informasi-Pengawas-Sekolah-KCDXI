# ⚡ Quick Reference

Referensi cepat untuk Aplikasi Pengawas Sekolah.

## 🚀 Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Run production build
npm run check        # Type checking
```

### Server Management (PM2)
```bash
pm2 start npm --name "schoolguard" -- start
pm2 stop schoolguard
pm2 restart schoolguard
pm2 logs schoolguard
pm2 status
```

---

## 🔐 Default Credentials

```
Username: admin
Password: admin
```

> ⚠️ Ganti password setelah login pertama!

---

## 📂 Important Files

| File | Purpose |
|------|---------|
| `local-database.json` | Data storage |
| `uploads/` | Uploaded photos |
| `.env` | Environment config |
| `server/index.ts` | Server entry |
| `client/src/main.tsx` | Client entry |

---

## 🌐 URLs

| Page | URL |
|------|-----|
| Login | http://localhost:5000/login |
| Dashboard | http://localhost:5000/ |
| Tugas | http://localhost:5000/tasks |
| Supervisi | http://localhost:5000/supervisions |
| Kegiatan | http://localhost:5000/additional-tasks |
| Kalender | http://localhost:5000/calendar |
| Sekolah | http://localhost:5000/schools |
| Laporan | http://localhost:5000/reports |

---

## 🔧 API Endpoints

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

### Tasks
```
GET    /api/tasks
POST   /api/tasks
DELETE /api/tasks/:id
```

### Supervisions
```
GET    /api/supervisions
POST   /api/supervisions
DELETE /api/supervisions/:id
```

### Additional Tasks
```
GET    /api/additional-tasks
POST   /api/additional-tasks
DELETE /api/additional-tasks/:id
```

### Schools
```
GET    /api/schools
POST   /api/schools
PUT    /api/schools/:id
DELETE /api/schools/:id
```

### Events
```
GET    /api/events
POST   /api/events
DELETE /api/events/:id
```

---

## 🔑 Environment Variables

```env
# Required
NODE_ENV=development|production
SESSION_SECRET=your-secret-key

# Optional
DATABASE_URL=postgresql://...
ADMIN_PASSWORD=admin
```

---

## 📊 Database Schema

### Users
```typescript
{
  id: string
  username: string
  password: string (hashed)
  fullName: string
  role: string
  createdAt: Date
}
```

### Tasks
```typescript
{
  id: string
  userId: string
  title: string
  description: string
  date: Date
  status: string
  photoUrl?: string
  createdAt: Date
}
```

### Supervisions
```typescript
{
  id: string
  userId: string
  schoolId: string
  teacherName: string
  subject: string
  class: string
  notes: string
  date: Date
  photoUrl?: string
  createdAt: Date
}
```

### Schools
```typescript
{
  id: string
  userId: string
  name: string
  address: string
  principalName?: string
  principalNip?: string
  createdAt: Date
}
```

### Events
```typescript
{
  id: string
  userId: string
  title: string
  date: Date
  schoolId?: string
  createdAt: Date
}
```

---

## 🎨 Color Palette

```css
Primary:    hsl(222.2 47.4% 11.2%)
Secondary:  hsl(210 40% 96.1%)
Success:    hsl(142 76% 36%)
Warning:    hsl(38 92% 50%)
Danger:     hsl(0 84% 60%)
Muted:      hsl(210 40% 96.1%)
```

---

## 📱 Breakpoints

```css
sm:  640px   /* Mobile landscape */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
2xl: 1536px  /* Extra large */
```

---

## 🔍 Troubleshooting

### Invalid Token
```bash
# Clear browser localStorage
localStorage.removeItem('auth_token')
# Refresh and login again
```

### Server Not Starting
```bash
# Check port 5000
lsof -i :5000  # Linux/Mac
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # Linux/Mac
taskkill /PID <PID> /F  # Windows
```

### Data Not Saving
```bash
# Check file permissions
ls -la local-database.json

# Check file exists
cat local-database.json

# Restart server
pm2 restart schoolguard
```

### Photos Not Uploading
```bash
# Check uploads folder
ls -la uploads/

# Create if missing
mkdir uploads

# Check permissions
chmod 755 uploads/
```

---

## 📚 Documentation Links

| Document | Description |
|----------|-------------|
| [README.md](README.md) | Main documentation |
| [CARA_PENGGUNAAN.md](CARA_PENGGUNAAN.md) | User guide |
| [QUICK_START.md](QUICK_START.md) | Quick start |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Deployment guide |
| [TESTING_GUIDE.md](TESTING_GUIDE.md) | Testing procedures |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Project overview |
| [CHANGELOG.md](CHANGELOG.md) | Version history |

---

## 🆘 Common Issues

### Issue: "Cannot find module"
```bash
npm install
```

### Issue: "Port already in use"
```bash
# Change port in server/index.ts
const PORT = 5001;
```

### Issue: "Database connection failed"
```bash
# Use local storage (default)
# Or fix DATABASE_URL in .env
```

### Issue: "Build failed"
```bash
npm run check  # Check TypeScript errors
npm install    # Reinstall dependencies
```

---

## 💡 Tips

1. **Backup Data**
   ```bash
   cp local-database.json backup-$(date +%Y%m%d).json
   ```

2. **Clear Cache**
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

3. **Update Dependencies**
   ```bash
   npm update
   npm audit fix
   ```

4. **Check Logs**
   ```bash
   pm2 logs schoolguard --lines 100
   ```

5. **Monitor Performance**
   ```bash
   pm2 monit
   ```

---

## 🔗 Useful Links

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org)
- [Express Docs](https://expressjs.com)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Neon Database](https://neon.tech)

---

## 📞 Support

For issues or questions:
1. Check documentation
2. Check logs
3. Restart server
4. Clear cache
5. Reinstall dependencies

---

**Quick Reference v1.0** | Last Updated: 11 November 2025
