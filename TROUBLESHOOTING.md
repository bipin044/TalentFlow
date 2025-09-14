# White Screen Troubleshooting Guide

## Common Causes and Solutions

### 1. **Browser Cache Issue**
**Solution**: Clear your browser cache and hard refresh
- **Chrome/Edge**: Press `Ctrl + Shift + R` or `F12` → Network tab → Check "Disable cache"
- **Firefox**: Press `Ctrl + Shift + R` or `F12` → Network tab → Check "Disable cache"

### 2. **Development Server Not Running**
**Solution**: Start the development server
```bash
npm run dev
```
The server should start on `http://localhost:8080`

### 3. **JavaScript Errors**
**Solution**: Check browser console for errors
- Press `F12` to open Developer Tools
- Go to Console tab
- Look for any red error messages
- If you see errors, they will help identify the issue

### 4. **Port Already in Use**
**Solution**: Kill any process using port 8080
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID_NUMBER> /F

# Or try a different port
npm run dev -- --port 3000
```

### 5. **Missing Dependencies**
**Solution**: Reinstall dependencies
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### 6. **Build Issues**
**Solution**: Check for build errors
```bash
npm run build
```

## Quick Debugging Steps

### Step 1: Check if the server is running
1. Open terminal/command prompt
2. Run `npm run dev`
3. You should see output like:
   ```
   VITE v5.4.20  ready in 500 ms
   ➜  Local:   http://localhost:8080/
   ➜  Network: http://192.168.x.x:8080/
   ```

### Step 2: Check browser console
1. Open `http://localhost:8080` in your browser
2. Press `F12` to open Developer Tools
3. Go to Console tab
4. Look for any error messages

### Step 3: Check Network tab
1. In Developer Tools, go to Network tab
2. Refresh the page
3. Look for any failed requests (red entries)
4. Check if `main.tsx` and other files are loading

### Step 4: Try a different browser
Sometimes browser extensions or settings can cause issues.

## Current App Status

The application has been enhanced with:
- ✅ Virtualized candidate list (1000+ candidates)
- ✅ Client-side search and filtering
- ✅ Candidate profile pages with timeline
- ✅ Kanban board with drag-and-drop
- ✅ Notes with @mentions functionality
- ✅ All components are properly integrated

## If Still Having Issues

1. **Check the terminal output** when running `npm run dev`
2. **Check browser console** for JavaScript errors
3. **Try incognito/private browsing mode**
4. **Try a different port**: `npm run dev -- --port 3000`
5. **Check if antivirus is blocking the connection**

## Expected Behavior

When working correctly, you should see:
1. Landing page at `http://localhost:8080/`
2. Sign in page at `http://localhost:8080/signin`
3. Dashboard at `http://localhost:8080/dashboard` (after signing in)
4. Candidates page at `http://localhost:8080/dashboard/candidates`

The candidates page should show:
- 1000+ seeded candidates
- Three view modes: Kanban, List, and Grid
- Search and filter functionality
- Drag-and-drop kanban board
- Individual candidate profiles with timelines
