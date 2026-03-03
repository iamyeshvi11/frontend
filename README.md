# React Frontend - Authentication & Role-Based Dashboard

A modern React application with JWT authentication, role-based routing, and protected dashboards for Admin and Employee users.

## Features

- ✅ JWT Authentication (Login/Register)
- ✅ Role-Based Access Control (Admin/Employee)
- ✅ Protected Routes
- ✅ Sidebar Navigation
- ✅ Responsive Design
- ✅ Modern UI/UX
- ✅ Context API for State Management
- ✅ Axios for API Calls

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Layout.js
│   │   ├── Layout.css
│   │   ├── Sidebar.js
│   │   └── Sidebar.css
│   ├── context/
│   │   └── AuthContext.js        # Authentication state management
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Login.css
│   │   ├── AdminDashboard.js
│   │   ├── EmployeeDashboard.js
│   │   └── Dashboard.css
│   ├── routes/
│   │   └── PrivateRoute.js       # Protected route wrapper
│   ├── services/
│   │   └── authService.js        # API calls for authentication
│   ├── App.js                    # Main app with routing
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The app will open at [http://localhost:3000](http://localhost:3000)

## Configuration

The frontend is configured to proxy API requests to `http://localhost:5000` (backend server).

If your backend runs on a different port, update the `proxy` field in `package.json`:

```json
"proxy": "http://localhost:YOUR_PORT"
```

## Pages & Routes

### Public Routes
- `/login` - Login/Register page

### Protected Routes (Admin)
- `/admin` - Admin dashboard home
- `/admin/users` - User management
- `/admin/reports` - Reports and analytics
- `/admin/settings` - System settings

### Protected Routes (Employee)
- `/employee` - Employee dashboard home
- `/employee/tasks` - Task management
- `/employee/profile` - User profile
- `/employee/requests` - Submit requests

## Features Breakdown

### 1. Authentication System

**AuthContext** (`src/context/AuthContext.js`)
- Manages authentication state globally
- Provides login, register, logout functions
- Stores user data and JWT token
- Checks user roles (admin/employee)

**AuthService** (`src/services/authService.js`)
- Handles API calls for authentication
- Manages JWT token in localStorage
- Axios interceptors for adding auth headers

### 2. Role-Based Access Control

**PrivateRoute** (`src/routes/PrivateRoute.js`)
- Protects routes requiring authentication
- Redirects unauthenticated users to login
- Enforces role-based access
- Auto-redirects users to appropriate dashboard

### 3. Sidebar Navigation

**Sidebar Component** (`src/components/Sidebar.js`)
- Dynamic navigation based on user role
- Admin sees admin routes
- Employee sees employee routes
- User info display
- Logout functionality

### 4. Dashboard Components

**Admin Dashboard:**
- Statistics overview (users, projects, tasks, revenue)
- Recent activity feed
- System status monitor
- User management interface

**Employee Dashboard:**
- Personal task overview
- Task list with priorities
- Quick action buttons
- Announcements
- Profile view

## Usage

### Login Flow

1. User visits `/login`
2. Enters credentials and submits
3. Frontend calls backend API `/api/auth/login`
4. On success:
   - JWT token saved to localStorage
   - User data saved to localStorage
   - AuthContext updates with user info
   - User redirected to role-based dashboard

### Protected Route Access

1. User tries to access protected route (e.g., `/admin`)
2. PrivateRoute checks authentication:
   - Not authenticated → redirect to `/login`
   - Authenticated but wrong role → redirect to correct dashboard
   - Authenticated with correct role → allow access

### Logout

1. User clicks logout button in sidebar
2. AuthContext.logout() called
3. Token and user data removed from localStorage
4. User state cleared
5. Redirect to `/login`

## API Integration

The frontend communicates with the backend API:

```javascript
// Login
POST /api/auth/login
Body: { email, password }

// Register
POST /api/auth/register
Body: { name, email, password, role, department }

// Get current user
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

## Styling

- Modern gradient design
- Responsive layout
- Custom CSS (no external UI library)
- Smooth animations and transitions
- Professional color scheme

## State Management

Uses React Context API for global state:
- **AuthContext**: User authentication state
- Accessible via `useAuth()` hook
- Provides user info, auth functions, role checks

## Local Storage

Data stored in localStorage:
- `token`: JWT authentication token
- `user`: User data (name, email, role, department)

## Security Features

- JWT token stored securely in localStorage
- Axios interceptors add auth headers automatically
- Protected routes prevent unauthorized access
- Role-based access control
- Automatic token validation
- Logout clears all auth data

## Demo Credentials

After starting the backend and registering users, you can use:

**Admin:**
- Email: admin@example.com
- Password: password123

**Employee:**
- Email: employee@example.com
- Password: password123

## Building for Production

```bash
npm run build
```

Creates optimized production build in `build/` folder.

## Available Scripts

- `npm start` - Run development server
- `npm run build` - Create production build
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Backend connection issues
- Ensure backend server is running on port 5000
- Check proxy configuration in package.json

### Authentication not working
- Clear localStorage and try again
- Check browser console for errors
- Verify backend API is responding

### Routes not working
- Make sure React Router is properly configured
- Check that BrowserRouter wraps the app

## Future Enhancements

- [ ] Password reset functionality
- [ ] Email verification
- [ ] User profile editing
- [ ] Real-time notifications
- [ ] Dark mode toggle
- [ ] Advanced search and filters
- [ ] File upload capabilities
- [ ] Dashboard customization

## License

ISC
Configuration
Backend should allow requests from `http://localhost:3000` during development.

### API Endpoints Used
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

## 📄 License

ISC

---

**Happy Coding! 🎉**
