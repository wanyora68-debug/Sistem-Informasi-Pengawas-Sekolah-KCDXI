# 📡 API Documentation

Complete API documentation for Aplikasi Pengawas Sekolah.

## 🔐 Authentication

All API endpoints (except auth endpoints) require authentication via JWT token.

### Headers
```http
Authorization: Bearer <token>
Content-Type: application/json
```

---

## 🔑 Auth Endpoints

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "fullName": "string"
}
```

**Response (201):**
```json
{
  "token": "jwt-token-string",
  "user": {
    "id": "string",
    "username": "string",
    "fullName": "string",
    "role": "user"
  }
}
```

**Errors:**
- `400` - Username already exists
- `400` - Username 'admin' is reserved
- `400` - Validation error

---

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "token": "jwt-token-string",
  "user": {
    "id": "string",
    "username": "string",
    "fullName": "string",
    "role": "string"
  }
}
```

**Errors:**
- `401` - Invalid credentials

---

### Get Current User
```http
GET /api/auth/me
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "string",
  "username": "string",
  "fullName": "string",
  "role": "string"
}
```

**Errors:**
- `401` - Unauthorized / Invalid token

---

### Logout
```http
POST /api/auth/logout
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## 📝 Tasks Endpoints

### Get All Tasks
```http
GET /api/tasks
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "string",
    "userId": "string",
    "title": "string",
    "description": "string",
    "date": "2024-01-01T00:00:00.000Z",
    "status": "Selesai" | "Belum Selesai",
    "photoUrl": "string | null",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Create Task
```http
POST /api/tasks
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
title: string
description: string
date: string (ISO date)
status: string
photo: File (optional, max 5MB, jpg/png)
```

**Response (201):**
```json
{
  "id": "string",
  "userId": "string",
  "title": "string",
  "description": "string",
  "date": "2024-01-01T00:00:00.000Z",
  "status": "string",
  "photoUrl": "string | null",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**
- `400` - Validation error
- `401` - Unauthorized
- `413` - File too large

---

### Delete Task
```http
DELETE /api/tasks/:id
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

**Errors:**
- `401` - Unauthorized
- `404` - Task not found

---

## 🏫 Supervisions Endpoints

### Get All Supervisions
```http
GET /api/supervisions
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "string",
    "userId": "string",
    "schoolId": "string",
    "teacherName": "string",
    "subject": "string",
    "class": "string",
    "notes": "string",
    "date": "2024-01-01T00:00:00.000Z",
    "photoUrl": "string | null",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "school": {
      "id": "string",
      "name": "string",
      "address": "string"
    }
  }
]
```

---

### Create Supervision
```http
POST /api/supervisions
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
schoolId: string
teacherName: string
subject: string
class: string
notes: string
date: string (ISO date)
photo: File (optional, max 5MB, jpg/png)
```

**Response (201):**
```json
{
  "id": "string",
  "userId": "string",
  "schoolId": "string",
  "teacherName": "string",
  "subject": "string",
  "class": "string",
  "notes": "string",
  "date": "2024-01-01T00:00:00.000Z",
  "photoUrl": "string | null",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**
- `400` - Validation error
- `401` - Unauthorized
- `413` - File too large

---

### Delete Supervision
```http
DELETE /api/supervisions/:id
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Supervision deleted successfully"
}
```

---

## 📋 Additional Tasks Endpoints

### Get All Additional Tasks
```http
GET /api/additional-tasks
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "string",
    "userId": "string",
    "title": "string",
    "description": "string",
    "date": "2024-01-01T00:00:00.000Z",
    "status": "string",
    "photoUrl": "string | null",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Create Additional Task
```http
POST /api/additional-tasks
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
title: string
description: string
date: string (ISO date)
status: string
photo: File (optional, max 5MB, jpg/png)
```

**Response (201):**
```json
{
  "id": "string",
  "userId": "string",
  "title": "string",
  "description": "string",
  "date": "2024-01-01T00:00:00.000Z",
  "status": "string",
  "photoUrl": "string | null",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Delete Additional Task
```http
DELETE /api/additional-tasks/:id
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Additional task deleted successfully"
}
```

---

## 🏢 Schools Endpoints

### Get All Schools
```http
GET /api/schools
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "string",
    "userId": "string",
    "name": "string",
    "address": "string",
    "principalName": "string | null",
    "principalNip": "string | null",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Create School
```http
POST /api/schools
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "string",
  "address": "string",
  "principalName": "string (optional)",
  "principalNip": "string (optional)"
}
```

**Response (201):**
```json
{
  "id": "string",
  "userId": "string",
  "name": "string",
  "address": "string",
  "principalName": "string | null",
  "principalNip": "string | null",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Update School
```http
PUT /api/schools/:id
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "string",
  "address": "string",
  "principalName": "string (optional)",
  "principalNip": "string (optional)"
}
```

**Response (200):**
```json
{
  "id": "string",
  "userId": "string",
  "name": "string",
  "address": "string",
  "principalName": "string | null",
  "principalNip": "string | null",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Delete School
```http
DELETE /api/schools/:id
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "School deleted successfully"
}
```

---

## 📅 Events Endpoints

### Get All Events
```http
GET /api/events
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "string",
    "userId": "string",
    "title": "string",
    "date": "2024-01-01T00:00:00.000Z",
    "schoolId": "string | null",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "school": {
      "id": "string",
      "name": "string"
    } | null
  }
]
```

---

### Create Event
```http
POST /api/events
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "string",
  "date": "2024-01-01T00:00:00.000Z",
  "schoolId": "string (optional)"
}
```

**Response (201):**
```json
{
  "id": "string",
  "userId": "string",
  "title": "string",
  "date": "2024-01-01T00:00:00.000Z",
  "schoolId": "string | null",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Delete Event
```http
DELETE /api/events/:id
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Event deleted successfully"
}
```

---

## 📊 Statistics Endpoint

### Get Dashboard Stats
```http
GET /api/stats
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "totalTasks": 10,
  "totalSupervisions": 5,
  "totalSchools": 3,
  "totalAdditionalTasks": 7,
  "completedTasks": 8,
  "pendingTasks": 2,
  "monthlyActivity": [
    { "month": "Jan", "tasks": 5, "supervisions": 2 },
    { "month": "Feb", "tasks": 3, "supervisions": 1 }
  ]
}
```

---

## 🖼️ File Upload

### Upload Specifications

**Allowed Formats:**
- JPG / JPEG
- PNG

**Max File Size:** 5MB

**Storage:** `/uploads` directory

**URL Format:** `/uploads/filename.jpg`

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized" | "Invalid token"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 413 Payload Too Large
```json
{
  "error": "File too large"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## 🔒 Security

### JWT Token
- **Algorithm:** HS256
- **Expiry:** 7 days
- **Secret:** From `SESSION_SECRET` env variable

### Password Hashing
- **Algorithm:** bcrypt
- **Rounds:** 10

### File Upload Security
- File type validation
- File size limit
- Secure filename generation
- No script execution

---

## 📝 Notes

1. All dates are in ISO 8601 format
2. All timestamps are UTC
3. File uploads use `multipart/form-data`
4. Other requests use `application/json`
5. Token must be included in Authorization header
6. User can only access their own data

---

## 🧪 Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

### Get Tasks
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Test Task" \
  -F "description=Test Description" \
  -F "date=2024-01-01" \
  -F "status=Belum Selesai" \
  -F "photo=@/path/to/image.jpg"
```

---

## 🔗 Postman Collection

Import this collection to Postman for easy testing:

```json
{
  "info": {
    "name": "School Guard Manager API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\"username\":\"admin\",\"password\":\"admin\"}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000"
    }
  ]
}
```

---

**API Documentation v1.0** | Last Updated: 11 November 2025
