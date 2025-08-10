# 🚀 LayoutGod - Complete Server Management Guide

## 🛑 **Step 1: Stop Running Servers (if needed)**

### Method 1: Using Task Manager (Easiest)
1. Press `Ctrl + Shift + Esc` to open Task Manager
2. Go to the "Processes" tab
3. Look for "Node.js" processes
4. Right-click and select "End Task" for each Node.js process

### Method 2: Using PowerShell Commands
```powershell
# Find running processes on ports 3000 and 3001
netstat -ano | findstr ":3000"
netstat -ano | findstr ":3001"

# Stop the processes (replace XXXX with actual Process IDs)
Stop-Process -Id XXXX -Force
Stop-Process -Id YYYY -Force
```

### Method 3: Kill All Node Processes (Nuclear option)
```powershell
Get-Process node | Stop-Process -Force
```

---

## ▶️ **Step 2: Start the Servers**

### Option A: Manual Start (Two separate PowerShell windows) - RECOMMENDED

**Backend Server (Terminal 1):**
1. Open PowerShell as Administrator
2. Run these commands:
```powershell
cd "C:\Users\fortn\layoutgod\server"
npm run dev
```
3. Wait for message: "Server running on port 3001"

**Frontend Client (Terminal 2):**
1. Open another PowerShell window
2. Run these commands:
```powershell
cd "C:\Users\fortn\layoutgod\client"
npm start
```
3. Wait for message: "webpack compiled successfully"
4. Browser should auto-open to `http://localhost:3000`

### Option B: Automated Start (One-click solution)

**From project root directory:**
```powershell
cd "C:\Users\fortn\layoutgod"
npm run dev
```
*Note: This runs both servers in one terminal with concurrently*

### Option C: Using Start-Process (Separate Windows)

**Run these commands from any PowerShell:**
```powershell
# Start backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting LayoutGod Backend...' -ForegroundColor Green; cd 'C:\Users\fortn\layoutgod\server'; npm run dev"

# Start frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting LayoutGod Frontend...' -ForegroundColor Cyan; cd 'C:\Users\fortn\layoutgod\client'; npm start"
```

### Option D: Individual Server Control

**Backend only:**
```powershell
cd "C:\Users\fortn\layoutgod"
npm run server:dev
```

**Frontend only:**
```powershell
cd "C:\Users\fortn\layoutgod"
npm run client:dev
```

---

## 📋 **Step 3: Verify Everything is Running**

### Check URLs:
- ✅ **Frontend**: http://localhost:3000
- ✅ **Backend API**: http://localhost:3001
- ✅ **API Health**: http://localhost:3001/api/health (if available)

### Check Processes:
```powershell
# Verify ports are in use
netstat -ano | findstr ":3000"  # Should show frontend
netstat -ano | findstr ":3001"  # Should show backend

# Check Node processes
Get-Process | Where-Object {$_.ProcessName -eq "node"}
```

### Expected Output:
```
Frontend: Local:            http://localhost:3000
Backend:  Server running on http://localhost:3001
```

---

## 🔧 **Troubleshooting**

### ❌ Error: "Port 3000/3001 is already in use"
```powershell
# Find what's using the port
netstat -ano | findstr ":3000"
netstat -ano | findstr ":3001"

# Kill the specific process (replace XXXX with Process ID)
Stop-Process -Id XXXX -Force

# Or kill all Node processes
Get-Process node | Stop-Process -Force
```

### ❌ Error: "Permission denied" / "Access denied"
- Run PowerShell as Administrator
- Check Windows Defender isn't blocking Node.js
- Ensure no antivirus is interfering

### ❌ Error: "npm command not found"
```powershell
# Check Node.js installation
node --version
npm --version

# If not installed, download from: https://nodejs.org/
```

### ❌ Error: "Module not found" / "Dependencies missing"
```powershell
# Clear npm cache
npm cache clean --force

# Reinstall server dependencies
cd "C:\Users\fortn\layoutgod\server"
npm install

# Reinstall client dependencies
cd "C:\Users\fortn\layoutgod\client"
npm install

# Return to root
cd "C:\Users\fortn\layoutgod"
```

### ❌ Error: "SQLite database locked"
```powershell
# Stop all processes first
Get-Process node | Stop-Process -Force

# Delete any .db-wal or .db-shm files in server/data/
cd "C:\Users\fortn\layoutgod\server"
Remove-Item "data/*.db-wal" -ErrorAction SilentlyContinue
Remove-Item "data/*.db-shm" -ErrorAction SilentlyContinue

# Restart servers
```

### ❌ Frontend shows "Proxy error" / "Cannot reach backend"
- Verify backend is running on port 3001
- Check client/package.json has `"proxy": "http://localhost:3001"`
- Restart both servers

---

## 🎯 **Quick Reference Commands**

| Action | Command | Location |
|--------|---------|----------|
| **Start Both** | `npm run dev` | Root directory |
| **Start Backend Only** | `npm run server:dev` | Root directory |
| **Start Frontend Only** | `npm run client:dev` | Root directory |
| **Stop All Node Processes** | `Get-Process node \| Stop-Process -Force` | Any PowerShell |
| **Check Running Ports** | `netstat -ano \| findstr ":300"` | Any PowerShell |
| **Check Node Processes** | `Get-Process node` | Any PowerShell |
| **Clear NPM Cache** | `npm cache clean --force` | Any directory |
| **Reinstall Dependencies** | `npm install` | server/ or client/ |

---

## 🔄 **Development Workflow**

### Daily Startup:
1. **Morning**: Use Option A (Manual Start) for best visibility
2. **Quick Start**: Use Option C (Start-Process) for one-command startup
3. **Debugging**: Use Option D (Individual) to isolate issues

### During Development:
- Both servers auto-restart on file changes (hot reload)
- Frontend changes appear immediately in browser
- Backend API changes restart server automatically
- Database changes may require manual restart

### End of Session:
- **Method 1**: Close PowerShell windows (Ctrl+C if needed)
- **Method 2**: `Get-Process node | Stop-Process -Force`
- **Method 3**: Task Manager → End Node.js processes

### Fresh Start (if issues):
1. Stop all Node processes
2. Clear npm cache
3. Reinstall dependencies
4. Use Option A (Manual Start)

---

## 📁 **Project Structure Reference**

```
C:\Users\fortn\keyboard-layout-analyzer\
├── client/                 # React frontend (port 3000)
│   ├── src/               # Source files
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   └── node_modules/      # Frontend packages
├── server/                # Node.js backend (port 3001)
│   ├── routes/            # API endpoints
│   ├── data/              # SQLite database
│   ├── package.json       # Backend dependencies
│   └── node_modules/      # Backend packages
├── package.json           # Root scripts (dev, start, etc.)
└── README.md              # Project documentation
```

---

## 🌐 **Available URLs After Startup**

| Service | URL | Description |
|---------|-----|-------------|
| **Main App** | http://localhost:3000 | LayoutGod web interface |
| **API Base** | http://localhost:3001 | Backend API server |
| **Layout Analysis** | http://localhost:3001/api/analyze | POST endpoint for analysis |
| **Layout List** | http://localhost:3001/api/layouts | GET all layouts |
| **Health Check** | http://localhost:3001/health | Server status |

---

## ⚡ **One-Line Quick Start Commands**

Copy and paste these for instant startup:

### Full Startup (Separate Windows):
```powershell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'LayoutGod Backend Starting...' -ForegroundColor Green; cd 'C:\Users\fortn\layoutgod\server'; npm run dev"; Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'LayoutGod Frontend Starting...' -ForegroundColor Cyan; cd 'C:\Users\fortn\keyboard-layout-analyzer\client'; npm start"
```

### Kill All Node Processes:
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Check Status:
```powershell
Write-Host "Node Processes:" -ForegroundColor Yellow; Get-Process node -ErrorAction SilentlyContinue | Select-Object Id, ProcessName; Write-Host "Active Ports:" -ForegroundColor Yellow; netstat -ano | findstr ":300"
```

---

## ✅ **Success Indicators**

When everything is working correctly, you should see:

### Backend Terminal:
```
> keyboard-layout-god-server@1.0.0 dev
> nodemon index.js

[nodemon] starting `node index.js`
Server running on port 3001
Database connected successfully
```

### Frontend Terminal:
```
> keyboard-layout-god-client@1.0.0 start
> react-scripts start

webpack compiled successfully
Local:            http://localhost:3000
```

### Browser:
- Automatically opens to http://localhost:3000
- Shows LayoutGod interface
- No console errors in Developer Tools (F12)

---

**🎉 You're all set! The LayoutGod application should now be running successfully.**

*Last updated: January 2024 | For support: See main README.md*
