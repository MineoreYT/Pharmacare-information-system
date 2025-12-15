# Pharmacy Information System - Startup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 1. Start the Backend Server
```bash
cd server
npm start
```
The server will run on `http://localhost:5000`

### 2. Start the Frontend Client
```bash
cd client
npm run dev
```
The client will run on `http://localhost:5174` (or another port if 5173 is busy)

### 3. Login Credentials

**Admin User:**
- Username: `admin`
- Password: `admin123`
- Role: Admin (Full access)

**Pharmacist User:**
- Username: `pharmacist`
- Password: `pharma123`
- Role: Pharmacist (Drug & inventory management)

## 🔧 System Features

### Dashboard
- Real-time overview of pharmacy operations
- Statistics for drugs, inventory, prescriptions
- Low stock and expiring item alerts

### Drug Management
- Add, edit, and delete drug information
- Search and filter drugs by category, form, etc.
- Manage drug details like dosage, manufacturer, price

### Inventory Management
- Track stock levels and locations
- Set minimum stock thresholds
- Monitor expiration dates
- Batch and lot number tracking

### Prescription Management
- View and manage prescriptions
- Track prescription status
- Patient information management

## 🔐 Role-Based Access Control

- **Admin**: Full system access
- **Pharmacist**: Manage drugs, inventory, dispense medications
- **Pharmacy Tech**: View-only access to inventory and prescriptions
- **Doctor**: View prescriptions only

## 🛠️ Troubleshooting

### Port Already in Use
If you get "EADDRINUSE" error:
```bash
# Kill process on port 5000
taskkill /PID <process_id> /F
# Or use a different port in server/index.js
```

### Database Issues
If you encounter database errors:
```bash
cd server
# Delete the database file to reset
del pharmacy_system.db
# Run the test user creation script
node createTestUser.js
```

### API Connection Issues
- Ensure both server (port 5000) and client (port 5174) are running
- Check that the API base URL in `client/src/context/AuthContext.jsx` matches your server port

## 📱 Access the Application

1. Open your browser and go to `http://localhost:5174`
2. Login with the provided credentials
3. Start managing your pharmacy operations!

## 🎯 Next Steps

1. Add your drug inventory
2. Set up inventory locations and thresholds
3. Configure user roles and permissions
4. Start processing prescriptions

---

**Note**: This system uses SQLite database for easy setup and portability. The database file is located at `server/pharmacy_system.db`.