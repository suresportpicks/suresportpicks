# Render Deployment Configuration

## 🌐 Deployment URLs
- **Frontend**: https://suresport-picks-frontend.onrender.com
- **Backend**: https://suresport-picks-backend.onrender.com
- **API Base**: https://suresport-picks-backend.onrender.com/api

## 🔧 Backend Service Configuration
```
Name: suresport-picks-backend
Root Directory: backend
Environment: Node
Build Command: npm install
Start Command: npm start
```

### Environment Variables:
```
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://suresportuser:PASSWORD@cluster0.xxxxx.mongodb.net/suresport-picks?retryWrites=true&w=majority
JWT_SECRET=your-32-character-secret-key
FRONTEND_URL=https://suresport-picks-frontend.onrender.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=noreply@suresport.com
PAYMENTS_EMAIL=payments@suresport.com
TRUST_PROXY=true
```

## 🎨 Frontend Service Configuration
```
Name: suresport-picks-frontend
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

### Environment Variables:
```
VITE_API_URL=https://suresport-picks-backend.onrender.com/api
```

## 🗄️ MongoDB Atlas Configuration
- **Cluster**: suresport-picks
- **Database**: suresport-picks
- **User**: suresportuser
- **Network Access**: 0.0.0.0/0 (Allow from anywhere)

## 🚀 Deployment Commands
Both services auto-deploy when you push to the main branch:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

## 🔍 Monitoring & Logs
- **Backend Logs**: Render Dashboard → suresport-picks-backend → Logs
- **Frontend Logs**: Browser Developer Console
- **Database Logs**: MongoDB Atlas Dashboard

## 🛠️ Troubleshooting
1. **Build Fails**: Check logs in Render dashboard
2. **CORS Errors**: Verify FRONTEND_URL in backend environment
3. **Database Issues**: Check MongoDB Atlas connection and IP whitelist
4. **Email Issues**: Verify Gmail app password and SMTP settings

## 📱 Testing Checklist
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard displays data
- [ ] Admin panel accessible
- [ ] API calls successful
- [ ] Email notifications working

---
**Deployment Date**: $(date)
**Status**: ✅ Ready for Production