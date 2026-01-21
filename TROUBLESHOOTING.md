# Backend Troubleshooting Guide

## Current Issue
The Android app shows: `failed to connect to /10.0.2.2 (port 3000)`

This means the backend server is not accessible from the Android emulator.

## Steps to Fix

### 1. Check if MongoDB Compass is Running
- Open MongoDB Compass
- Make sure it's connected to `mongodb://localhost:27017`
- You should see "Connected" status

### 2. Check Backend Server Status
The backend terminal should show:
```
Server running on port 3000
MongoDB Connected
```

If you see an error like `MongoDB Connection Error`, MongoDB is not running.

### 3. If Backend Shows MongoDB Error

**Option A: Start MongoDB via Compass**
- Close and reopen MongoDB Compass
- Wait for it to connect
- Then restart the backend server

**Option B: Start MongoDB Manually**
Open a new terminal and run:
```bash
mongod
```
Keep this terminal running, then restart the backend.

### 4. Restart the Backend
In the backend terminal:
- Press `Ctrl+C` to stop the current server
- Run `npm start` again
- You should see both success messages

### 5. Test from Browser
Open your browser and go to:
```
http://localhost:3000
```
You should see: "Khatabook Backend is running"

If this works, the Android app should connect successfully!

## Alternative: Use MongoDB Atlas (No Local Install)

If MongoDB Compass isn't working, use cloud MongoDB:

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection string
4. Update `D:\Khatabook\backend\server.js` line 18:
   ```javascript
   const MONGODB_URI = 'your-atlas-connection-string-here';
   ```
5. Restart backend with `npm start`
