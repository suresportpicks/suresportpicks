# SureSport Picks - Luxury Sports Analytics Platform

A premium sports analytics and betting insights platform built with React and Node.js.

## 🚀 Features

- **User Authentication & Authorization** - Secure JWT-based authentication
- **Premium Subscription Plans** - Multiple tiers with different access levels
- **Sports Analytics Dashboard** - Real-time sports data and insights
- **Pick Management System** - Expert picks with detailed analytics
- **Admin Panel** - Comprehensive management interface
- **Responsive Design** - Modern UI with Tailwind CSS
- **Email Notifications** - Automated email system

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React Icons
- Recharts
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer
- Helmet (Security)
- Express Rate Limit

## 📦 Project Structure

```
SURESPORTPICKS/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── api/        # API service functions
│   │   └── utils/      # Utility functions
│   ├── public/         # Static assets
│   └── dist/           # Production build
├── backend/            # Node.js backend API
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Utility functions
│   └── server.js       # Main server file
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/suresportpicks/suresportpicks.git
   cd suresportpicks
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   **Backend (.env)**
   ```env
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   MONGODB_URI=mongodb://localhost:27017/suresport-picks
   JWT_SECRET=your-super-secret-jwt-key-here
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=noreply@suresport.com
   PAYMENTS_EMAIL=payments@suresport.com
   ```

   **Frontend (.env)**
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

5. **Start the development servers**
   
   **Backend**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

## 🌐 Production Deployment

### Render Deployment

1. **Prepare Environment Variables**
   - Update `.env.production` files with production values
   - Set `MONGODB_URI` to your production MongoDB connection string
   - Generate a strong `JWT_SECRET` (minimum 32 characters)
   - Configure email settings for production

2. **Build the Application**
   ```bash
   # Frontend
   cd frontend
   npm run build
   
   # Backend
   cd backend
   npm run build
   ```

3. **Deploy to Render**
   - Connect your GitHub repository to Render
   - Create a new Web Service
   - Set build command: `cd backend && npm install`
   - Set start command: `cd backend && npm start`
   - Add environment variables in Render dashboard

### Environment Variables for Production

**Backend Environment Variables:**
- `PORT`: 3001
- `NODE_ENV`: production
- `FRONTEND_URL`: https://your-frontend-domain.com
- `MONGODB_URI`: Your production MongoDB URI
- `JWT_SECRET`: Strong secret key (32+ characters)
- `EMAIL_HOST`: smtp.gmail.com
- `EMAIL_PORT`: 587
- `EMAIL_USER`: Your production email
- `EMAIL_PASS`: Your email app password
- `EMAIL_FROM`: noreply@yourdomain.com
- `PAYMENTS_EMAIL`: payments@yourdomain.com

**Frontend Environment Variables:**
- `VITE_API_URL`: https://your-backend-domain.com/api

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/subscribe` - Subscribe to plan

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/plans` - Get all plans
- `POST /api/admin/plans` - Create new plan
- `PUT /api/admin/plans/:id` - Update plan
- `DELETE /api/admin/plans/:id` - Delete plan

### Picks
- `GET /api/picks` - Get available picks
- `POST /api/admin/picks` - Create new pick
- `PUT /api/admin/picks/:id` - Update pick
- `DELETE /api/admin/picks/:id` - Delete pick

### Live Games
- `GET /api/games/live` - Get current live NBA, WNBA, NCAA men's and women's, NBL, and NFL scores (cached for one minute)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- Environment variable protection

## 🧪 Testing

```bash
# Frontend
cd frontend
npm run lint

# Backend
cd backend
npm test
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support, email support@suresport.com or create an issue in the GitHub repository.

---

**SureSport Picks** - Premium Sports Analytics Platform