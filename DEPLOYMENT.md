# Deployment Guide - Render

This guide will help you deploy SureSport Picks to Render for production.

## 🚀 Render Deployment Steps

### 1. Prerequisites
- GitHub repository (✅ Already done)
- Render account
- MongoDB Atlas account (for production database)

### 2. Database Setup (MongoDB Atlas)

1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Create a database user with read/write permissions
4. Whitelist IP addresses (0.0.0.0/0 for Render)
5. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/suresport-picks`

### 3. Backend Deployment on Render

1. **Create Web Service**
   - Go to Render Dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository: `https://github.com/suresportpicks/suresportpicks`

2. **Configure Service**
   - **Name**: `suresport-picks-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Environment Variables**
   Add these environment variables in Render:
   ```
   NODE_ENV=production
   PORT=3001
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/suresport-picks
   JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
   FRONTEND_URL=https://your-frontend-app.onrender.com
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-production-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   EMAIL_FROM=noreply@suresport.com
   PAYMENTS_EMAIL=payments@suresport.com
   TRUST_PROXY=true
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL: `https://your-backend-app.onrender.com`

### 4. Frontend Deployment on Render

1. **Create Static Site**
   - Go to Render Dashboard
   - Click "New" → "Static Site"
   - Connect the same GitHub repository

2. **Configure Static Site**
   - **Name**: `suresport-picks-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

3. **Environment Variables**
   Add this environment variable:
   ```
   VITE_API_URL=https://your-backend-app.onrender.com/api
   ```

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment to complete

### 5. Post-Deployment Configuration

1. **Update Backend CORS**
   - Update `FRONTEND_URL` environment variable in backend service
   - Set it to your frontend URL: `https://your-frontend-app.onrender.com`

2. **Test the Application**
   - Visit your frontend URL
   - Test user registration/login
   - Verify API connectivity
   - Test admin panel functionality

### 6. Custom Domain (Optional)

1. **Backend Custom Domain**
   - In Render backend service settings
   - Add custom domain: `api.yourdomain.com`
   - Update DNS CNAME record

2. **Frontend Custom Domain**
   - In Render static site settings
   - Add custom domain: `yourdomain.com`
   - Update DNS CNAME record

3. **Update Environment Variables**
   - Update `FRONTEND_URL` in backend to use custom domain
   - Update `VITE_API_URL` in frontend to use custom API domain

## 🔧 Environment Variables Reference

### Backend Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3001` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `your-32-char-secret` |
| `FRONTEND_URL` | Frontend domain for CORS | `https://yourdomain.com` |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | SMTP username | `your-email@gmail.com` |
| `EMAIL_PASS` | SMTP password | `your-app-password` |
| `EMAIL_FROM` | From email address | `noreply@yourdomain.com` |
| `PAYMENTS_EMAIL` | Payments email | `payments@yourdomain.com` |

### Frontend Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.yourdomain.com/api` |

## 🔒 Security Checklist

- [ ] Strong JWT secret (32+ characters)
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Environment variables set correctly
- [ ] HTTPS enabled (automatic on Render)
- [ ] CORS configured properly
- [ ] Email credentials secured

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check build logs in Render dashboard
   - Verify Node.js version compatibility
   - Ensure all dependencies are in package.json

2. **Database Connection Issues**
   - Verify MongoDB URI format
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has correct permissions

3. **CORS Errors**
   - Verify `FRONTEND_URL` environment variable
   - Check that frontend URL matches exactly

4. **Email Not Working**
   - Verify Gmail app password (not regular password)
   - Check SMTP settings
   - Ensure 2FA is enabled on Gmail account

### Logs and Monitoring

- **Backend Logs**: Available in Render service dashboard
- **Frontend Logs**: Check browser console for errors
- **Database Logs**: Available in MongoDB Atlas

## 📈 Performance Optimization

1. **Enable Gzip Compression** (automatic on Render)
2. **Use CDN** for static assets
3. **Database Indexing** in MongoDB
4. **Caching Strategy** for API responses

## 🔄 Continuous Deployment

Render automatically deploys when you push to the main branch:

1. Make changes locally
2. Commit and push to GitHub
3. Render automatically rebuilds and deploys
4. Monitor deployment in Render dashboard

---

Your SureSport Picks application is now ready for production! 🎉