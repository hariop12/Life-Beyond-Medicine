# Life Beyond Medicine - Holistic Healing & Wellness

A comprehensive holistic healing and wellness website with full-stack functionality, admin panel, and MongoDB backend.

## Features

- **Home Page**: Beautiful carousel showcasing holistic healing philosophy
- **Professional Services**: 7 different healing services (Naturopath, Yoga, Nutritionist, Sujok, Meditation, Holistic Healer, CPA Counselor)
- **Social Services**: Community services and initiatives
- **Contact & Booking**: Consultation booking form
- **Admin Panel**: Complete management system for bookings and content
- **Backend API**: RESTful API with MongoDB database

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt

## Prerequisites

Before you begin, ensure you have installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (v5 or higher)

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd life-beyond-medicine
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
MONGODB_URI=mongodb://localhost:27017/life-beyond-medicine
PORT=5000
JWT_SECRET=your-secure-jwt-secret-key
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**

```bash
mongod
```

**Mac/Linux:**

```bash
sudo systemctl start mongod
```

Or use MongoDB Compass or MongoDB Atlas (cloud)

### 5. Seed the admin account

```bash
npm run seed-admin
```

This creates the default admin account:

- Username: `admin`
- Password: `admin123`

### 6. Start the server

```bash
npm run server
```

The application will be available at:

- Frontend: `http://localhost:5000`
- API: `http://localhost:5000/api`
- Admin Panel: `http://localhost:5000/admin/login.html`

## Project Structure

```
life-beyond-medicine/
├── admin/                    # Admin panel HTML pages
│   ├── login.html
│   ├── dashboard.html
│   ├── bookings.html
│   ├── content-manager.html
│   ├── settings.html
│   └── system-status.html    # System status page for diagnostics
├── css/                      # Stylesheets
│   ├── style.css            # Global styles
│   ├── home.css
│   ├── about.css
│   ├── service.css
│   ├── contact.css
│   ├── admin.css
│   └── faq.css
├── js/                       # Frontend JavaScript
│   ├── api-config.js        # API configuration
│   ├── contact.js           # Contact form handler
│   ├── script.js            # Main navigation script
│   ├── home.js              # Home page carousel
│   ├── admin-*.js           # Admin panel scripts
│   └── faq.js
├── server/                   # Backend server
│   ├── models/              # Mongoose models
│   │   ├── Admin.js
│   │   ├── Booking.js
│   │   └── Content.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   └── content.js
│   ├── middleware/          # Custom middleware
│   │   └── auth.js
│   └── scripts/            # Utility scripts
│       └── seed-admin.js
├── social/                  # Social services pages
├── index.html               # Home page
├── about.html
├── contact.html
├── naturopath.html
├── yoga.html
├── nutritionist.html
├── sujok.html
├── meditation.html
├── holistic.html
├── counselor.html
├── faq.html
├── server.js               # Express server entry point
├── package.json
├── .env.example
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token
- `PUT /api/auth/change-password` - Change admin password

### Bookings

- `GET /api/bookings` - Get all bookings (Admin only)
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Delete booking
- `GET /api/bookings/stats` - Get booking statistics
- `DELETE /api/bookings/clear-old` - Clear old bookings

### Content Management

- `GET /api/content/:page` - Get page content
- `PUT /api/content/:page` - Update page content

## Admin Panel

Access the admin panel at `/admin/login.html`

**Default Credentials:**

- Username: `admin`
- Password: `admin123`

**Features:**

- Dashboard with booking statistics
- Manage all consultation bookings
- Update website content
- Export bookings to CSV
- Change admin credentials
- System status page for diagnostics

## Usage

### For Users

1. Visit the website and explore services
2. Click "Book Consultation" on any service page
3. Fill out the contact form with your details
4. Submit and wait for confirmation

### For Admins

1. Login to admin panel
2. View and manage all bookings
3. Update booking statuses (Pending → Confirmed → Completed)
4. Export booking data for records
5. Update website content as needed

## Color Scheme

The website uses an Ayurvedic-inspired color palette:

- Primary: `#2d5f3f` (Forest Green)
- Secondary: `#8b6f47` (Earth Brown)
- Accent: `#d4a574` (Golden Sand)
- Background: `#f8f5f0` (Cream)
- Text: `#2c2c2c` (Dark Gray)

## Scripts

- `npm run server` - Start the backend server
- `npm run seed-admin` - Create/reset admin account
- `npm run dev` - Development mode (if using nodemon)
- `npm run test-connection` - Test MongoDB connection

## Deployment

### Deploy to Heroku

1. Create a Heroku app:

```bash
heroku create your-app-name
```

2. Add MongoDB Atlas:

```bash
heroku addons:create mongocloud:free
```

3. Set environment variables:

```bash
heroku config:set JWT_SECRET=your-secret-key
```

4. Deploy:

```bash
git push heroku main
```

### Deploy to Vercel

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy:

```bash
vercel
```

3. Add environment variables in Vercel dashboard

## Database

The application uses MongoDB with three collections:

- **admins**: Admin user accounts
- **bookings**: Consultation booking records
- **contents**: Editable website content

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Input validation and sanitization
- CORS enabled
- Secure HTTP headers

## Troubleshooting

### Issue: Admin Panel Shows All Zeros / No Bookings Appearing

**Symptoms:** Dashboard statistics show 0, bookings page is empty, even after submitting forms.

**Solution:**

1. **Check if backend server is running:**

   ```bash
   npm run dev
   ```

   You should see:

   ```
   🚀 Server is running on port 5000
   ✅ MongoDB connected successfully
   ```

2. **Check if MongoDB is running:**

   ```bash
   # Test connection
   npm run test-connection
   ```

   If it fails:

   - **Windows:** Open Services (services.msc) and start "MongoDB Server"
   - **Mac:** `brew services start mongodb-community`
   - **Linux:** `sudo systemctl start mongod`

3. **Visit System Status Page:**
   Navigate to `/admin/system-status.html` to see detailed diagnostics and get specific fixes for your issue.

4. **Check browser console:**
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Look for failed network requests in Network tab

### Issue: 500 Internal Server Error When Submitting Forms

**Symptoms:** Forms submit but return "Failed to create booking" error.

**Solutions:**

1. **MongoDB not connected:**

   ```bash
   # Check MongoDB status
   mongosh
   # If it fails, MongoDB isn't running
   ```

2. **Check server logs:**
   Look at the terminal where you ran `npm run dev` for error messages.

3. **Verify .env file exists:**

   ```bash
   # Create from example if missing
   cp .env.example .env
   ```

4. **Run seed script:**
   ```bash
   npm run seed-admin
   ```

### Issue: "Cannot read properties of undefined (reading 'request')"

**Symptoms:** JavaScript errors in browser console.

**Solution:**
This means `api-config.js` isn't loaded. Check your HTML files include:

```html
<script src="../js/api-config.js"></script>
<script src="../js/your-other-script.js"></script>
```

The `api-config.js` MUST be loaded before any other scripts that use `window.API`.

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
sudo systemctl status mongod

# View MongoDB logs
tail -f /var/log/mongodb/mongod.log

# Restart MongoDB
sudo systemctl restart mongod

# Or start manually
mongod --dbpath /path/to/data
```

### Port Already in Use

Change the PORT in `.env` file or kill the process:

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Admin Login Not Working

Reset the admin account:

```bash
npm run seed-admin
```

### Content Manager Not Working

**Symptoms:** Dropdown doesn't show pages, changes don't save.

**Solution:**

1. Make sure backend is running
2. Check browser console for API errors
3. Verify MongoDB connection
4. This feature requires active backend connection

### Complete Reset

If nothing works, try a complete reset:

```bash
# Stop the server (Ctrl+C)

# Remove node_modules and reinstall
rm -rf node_modules
npm install

# Make sure .env exists
cp .env.example .env

# Edit .env with correct settings

# Test MongoDB connection
npm run test-connection

# Seed admin
npm run seed-admin

# Start server
npm run dev
```

Then navigate to `/admin/system-status.html` to verify everything is working.

## Quick Reference

### Must-Do Setup Steps

1. ✅ Install Node.js and MongoDB
2. ✅ Run `npm install`
3. ✅ Create `.env` file from `.env.example`
4. ✅ Start MongoDB service
5. ✅ Run `npm run seed-admin`
6. ✅ Run `npm run dev`
7. ✅ Visit `/admin/system-status.html` to verify

### Important Files

- `server.js` - Main backend server
- `.env` - Environment configuration (create from `.env.example`)
- `js/api-config.js` - Frontend API configuration
- `server/routes/*` - API endpoint definitions
- `server/models/*` - MongoDB schema definitions

### Useful Commands

```bash
# Development
npm install              # Install dependencies
npm run dev             # Start dev server with auto-reload
npm run test-connection # Test MongoDB connection

# Database
npm run seed-admin      # Create/reset admin user
mongosh                 # Open MongoDB shell

# Debugging
npm run dev             # Watch server logs
# Open browser DevTools (F12) for frontend errors
```

### Environment Variables

Required in `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/life-beyond-medicine
PORT=5000
JWT_SECRET=your-super-secret-key-change-in-production
```
