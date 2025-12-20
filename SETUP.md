# Life Beyond Medicine - Complete Setup Guide

## Prerequisites

Before starting, ensure you have the following installed:

1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)

## Step-by-Step Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup MongoDB

**Option A: Using Local MongoDB**

1. Install MongoDB Community Edition
2. Start MongoDB service:

   - **Windows**: MongoDB should start automatically as a service
   - **Mac**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

3. Verify MongoDB is running:
   ```bash
   mongosh
   ```
   If you see a MongoDB shell, it's working!

**Option B: Using MongoDB Atlas (Cloud)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

### 3. Configure Environment Variables

1. Copy the `.env.example` file:

   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file:

   ```env
   # For local MongoDB:
   MONGODB_URI=mongodb://localhost:27017/life-beyond-medicine

   # OR for MongoDB Atlas:
   MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/life-beyond-medicine

   PORT=5000
   JWT_SECRET=change-this-to-a-random-string
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

### 4. Create Admin User

```bash
npm run seed-admin
```

You should see:

```
Connected to MongoDB
Default admin created successfully
Username: admin
Password: admin123
```

### 5. Start the Server

```bash
npm run dev
```

You should see:

```
Server running on port 5000
MongoDB connected successfully
```

### 6. Open the Application

1. **Frontend**: Open `index.html` in your browser (or use Live Server extension in VS Code)
2. **Admin Panel**: Navigate to `/admin/login.html`
   - Username: `admin`
   - Password: `admin123`

## Troubleshooting

### Issue: "MongoDB connection failed"

**Solution 1**: Check if MongoDB is running

```bash
# Windows
services.msc
# Look for "MongoDB Server" service

# Mac/Linux
sudo systemctl status mongod
```

**Solution 2**: Verify connection string in `.env`

- Local: `mongodb://localhost:27017/life-beyond-medicine`
- Atlas: Should include username, password, and cluster name

**Solution 3**: Check firewall

- MongoDB uses port 27017
- Ensure it's not blocked by firewall

### Issue: "Cannot read properties of undefined (reading 'request')"

**Solution**: The `api-config.js` file is not loaded. Check that all HTML files include:

```html
<script src="js/api-config.js"></script>
<script src="js/your-other-script.js"></script>
```

### Issue: "500 Internal Server Error" when submitting bookings

**Solutions**:

1. Check server console for detailed error messages
2. Verify MongoDB is connected
3. Check that all required fields are filled in the form
4. Look at browser console for validation errors

### Issue: Admin panel shows all zeros

**Solutions**:

1. Make sure the backend server is running (`npm run dev`)
2. Check that API_BASE_URL in `js/api-config.js` matches your server port
3. Open browser DevTools Console to see any errors
4. Try submitting a test booking first

### Issue: Content Manager not working

**Solution**: This feature requires backend to be running. Make sure:

1. Server is started (`npm run dev`)
2. MongoDB is connected
3. You're logged in to admin panel

## Testing the System

### 1. Test Booking Submission

1. Go to `contact.html`
2. Fill out the form completely
3. Submit
4. Check browser console for success message
5. Check server console for "[Backend]" logs

### 2. Test Admin Panel

1. Login at `/admin/login.html`
2. Go to Dashboard - should show booking count
3. Go to Bookings - should list all submitted bookings
4. Try updating a booking status
5. Test export to CSV

### 3. Check MongoDB Data

```bash
mongosh
use life-beyond-medicine
db.bookings.find()
db.admins.find()
```

## Common Commands

```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Create admin user
npm run seed-admin

# Check if MongoDB is running
mongosh

# View MongoDB data
mongosh
> use life-beyond-medicine
> db.bookings.find().pretty()
```

## Project Structure

```
life-beyond-medicine/
├── admin/                    # Admin panel HTML files
│   ├── login.html
│   ├── dashboard.html
│   ├── bookings.html
│   ├── content-manager.html
│   └── settings.html
├── css/                      # All stylesheets
│   ├── style.css            # Global styles
│   ├── admin.css            # Admin panel styles
│   └── ...
├── js/                       # Frontend JavaScript
│   ├── api-config.js        # API configuration
│   ├── contact.js           # Contact form logic
│   ├── admin-*.js           # Admin panel scripts
│   └── ...
├── server/                   # Backend code
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── middleware/          # Express middleware
│   └── scripts/             # Utility scripts
├── server.js                 # Main server file
├── package.json
└── .env                      # Environment variables (create this!)
```

## Support

If you're still having issues:

1. Check the browser console (F12) for frontend errors
2. Check the terminal/console where server is running for backend errors
3. Verify all dependencies are installed: `npm install`
4. Try deleting `node_modules` and reinstalling: `rm -rf node_modules && npm install`
5. Make sure you're using Node.js v14 or higher: `node --version`

## Production Deployment

See `README.md` for deployment instructions.
