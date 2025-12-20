# Quick Start Guide

## 1. Install Everything

```bash
npm install
```

## 2. Start MongoDB

**Windows**: Should start automatically
**Mac**: `brew services start mongodb-community`
**Linux**: `sudo systemctl start mongod`

## 3. Create .env File

Create a file named `.env` in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/life-beyond-medicine
PORT=5000
JWT_SECRET=your-secret-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

## 4. Create Admin User

```bash
npm run seed-admin
```

## 5. Start Server

```bash
npm run dev
```

## 6. Open Application

- **Website**: Open `index.html` in browser
- **Admin**: Open `admin/login.html` (username: `admin`, password: `admin123`)

## Done!

Submit a test booking and check the admin panel to see it appear.

## Still Not Working?

1. Is MongoDB running? Check with: `mongosh`
2. Is the server running? You should see "MongoDB connected successfully"
3. Check browser console (F12) for errors
4. Check server terminal for error messages

See `SETUP.md` for detailed troubleshooting.
