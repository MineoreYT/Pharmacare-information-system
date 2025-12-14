# Pharmacare Information System

A comprehensive Pharmacy Information System (PIS) built with React frontend and Node.js backend, featuring modern UI design and role-based access control.

## Features

- **User Authentication & Authorization**
  - Secure login/registration system
  - Role-based access control (Admin, Pharmacist, Pharmacy Tech, Doctor)
  - JWT token-based authentication

- **Drug Management**
  - Add, edit, and delete drug information
  - Track drug details (name, manufacturer, dosage, price)
  - Search and filter functionality

- **Inventory Management**
  - Real-time inventory tracking
  - Stock level monitoring
  - Expiration date alerts
  - Automatic low stock notifications

- **Prescription Management**
  - Create and manage prescriptions
  - Patient information tracking
  - Prescription history
  - Medication dispensing records

- **Modern UI Design**
  - Clean, professional interface
  - Responsive design for all devices
  - Glass morphism effects
  - Color-coded sections for easy navigation

## Technology Stack

### Frontend
- **React 19.2.3** - Latest React version with security updates
- **Tailwind CSS** - For modern, responsive styling
- **React Router** - For client-side routing
- **Axios** - For API communication

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **SQLite** - Lightweight database
- **Sequelize** - ORM for database operations
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Start the server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will run on `http://localhost:5173`

## User Roles & Permissions

### Admin
- Full access to all features
- User management
- System configuration
- All CRUD operations

### Pharmacist
- Manage drugs and inventory
- Process prescriptions
- Dispense medications
- View reports

### Pharmacy Tech
- View-only access to inventory
- View prescriptions
- Limited drug information access

### Doctor
- View prescriptions only
- Patient prescription history

## Project Structure

```
pharmacare-information-system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # Context providers
│   │   └── assets/         # Static assets
│   ├── public/             # Public files
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/             # Database configuration
│   ├── models/             # Sequelize models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Drugs
- `GET /api/drugs` - Get all drugs
- `POST /api/drugs` - Create new drug
- `PUT /api/drugs/:id` - Update drug
- `DELETE /api/drugs/:id` - Delete drug

### Inventory
- `GET /api/inventory` - Get inventory items
- `POST /api/inventory` - Add inventory item
- `PUT /api/inventory/:id` - Update inventory
- `DELETE /api/inventory/:id` - Remove inventory item

### Prescriptions
- `GET /api/prescriptions` - Get prescriptions
- `POST /api/prescriptions` - Create prescription
- `PUT /api/prescriptions/:id` - Update prescription
- `DELETE /api/prescriptions/:id` - Delete prescription

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- CORS protection
- SQL injection prevention with Sequelize ORM

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.

---

**Note**: This is a demonstration project showcasing modern web development practices with React and Node.js. For production use, additional security measures and testing should be implemented.