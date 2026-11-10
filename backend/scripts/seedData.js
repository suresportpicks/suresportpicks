const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Plan = require('../models/Plan');
const Pick = require('../models/Pick');
const Announcement = require('../models/Announcement');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/suresport');
    console.log('MongoDB connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Plan.deleteMany({});
    await Pick.deleteMany({});
    await Announcement.deleteMany({});

    // Create Plans
    console.log('Creating plans...');
    const plans = await Plan.insertMany([
      {
        name: 'free',
        displayName: 'Free',
        price: 0,
        currency: 'USD',
        duration: 'lifetime',
        features: [
          'Basic picks access',
          'Community forum',
          'Email support'
        ],
        limits: {
          picksPerDay: 3,
          accessLevel: 'basic',
          supportLevel: 'email'
        },
        badge: {
          text: 'Free',
          color: '#6B7280'
        },
        isActive: true,
        isPopular: false,
        description: 'Get started with basic sports analytics',
        order: 1
      },
      {
        name: 'silver',
        displayName: 'Silver',
        price: 10,
        currency: 'USD',
        duration: 'monthly',
        features: [
          'All Free features',
          'Premium picks access',
          'Advanced analytics',
          'ROI tracking',
          'Priority support'
        ],
        limits: {
          picksPerDay: 10,
          accessLevel: 'premium',
          supportLevel: 'priority'
        },
        badge: {
          text: 'Most Popular',
          color: '#C0C0C0'
        },
        isActive: true,
        isPopular: true,
        description: 'Perfect for serious bettors',
        order: 2
      },
      {
        name: 'gold',
        displayName: 'Gold',
        price: 50,
        currency: 'USD',
        duration: 'monthly',
        features: [
          'All Silver features',
          'VIP picks access',
          'Personal analyst',
          'Custom strategies',
          'Phone support',
          'Exclusive insights'
        ],
        limits: {
          picksPerDay: -1, // unlimited
          accessLevel: 'vip',
          supportLevel: 'phone'
        },
        badge: {
          text: 'VIP',
          color: '#FFD700'
        },
        isActive: true,
        isPopular: false,
        description: 'Ultimate sports betting experience',
        order: 3
      }
    ]);

    // Create Admin User
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('Admin123!', 12);
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@suresport.com',
      password: hashedPassword,
      role: 'admin',
      plan: 'gold',
      planExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      isActive: true,
      stats: {
        winRate: 95,
        totalPicks: 500,
        profit: 50000,
        roi: 25.5
      }
    });

    // Create Sample Users
    console.log('Creating sample users...');
    const sampleUsers = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'user',
        plan: 'silver',
        planExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        stats: {
          winRate: 78,
          totalPicks: 45,
          profit: 1250,
          roi: 15.2
        }
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'user',
        plan: 'gold',
        planExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        stats: {
          winRate: 85,
          totalPicks: 67,
          profit: 3400,
          roi: 22.8
        }
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'user',
        plan: 'free',
        isActive: true,
        stats: {
          winRate: 65,
          totalPicks: 12,
          profit: 150,
          roi: 8.5
        }
      }
    ]);

    // Create Sample Picks
    console.log('Creating sample picks...');
    const picks = await Pick.insertMany([
      {
        sport: 'basketball',
        league: 'NBA',
        homeTeam: 'Los Angeles Lakers',
        awayTeam: 'Miami Heat',
        matchDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        predictionType: 'moneyline',
        prediction: 'Los Angeles Lakers',
        odds: 1.85,
        userConfidence: 87,
        aiConfidence: 89,
        stake: 100,
        status: 'active',
        accessLevel: 'basic',
        tags: ['trending', 'high-confidence'],
        analysis: 'Lakers showing strong form at home with LeBron back from injury. Heat struggling on the road.',
        createdBy: adminUser._id
      },
      {
        sport: 'football',
        league: 'NFL',
        homeTeam: 'Kansas City Chiefs',
        awayTeam: 'Buffalo Bills',
        matchDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        predictionType: 'spread',
        prediction: 'Kansas City Chiefs -3.5',
        odds: 1.91,
        userConfidence: 92,
        aiConfidence: 88,
        stake: 200,
        status: 'active',
        accessLevel: 'premium',
        tags: ['playoff-bound', 'high-value'],
        analysis: 'Chiefs at home in primetime. Mahomes has excellent record against Bills defense.',
        createdBy: adminUser._id
      },
      {
        sport: 'basketball',
        league: 'NBA',
        homeTeam: 'Golden State Warriors',
        awayTeam: 'Boston Celtics',
        matchDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        predictionType: 'total',
        prediction: 'Over 225.5',
        odds: 1.95,
        userConfidence: 78,
        aiConfidence: 82,
        stake: 150,
        status: 'won',
        result: 'won',
        actualReturn: 292.5,
        accessLevel: 'basic',
        tags: ['high-scoring'],
        analysis: 'Both teams averaging high scores. Warriors home court advantage.',
        createdBy: adminUser._id
      },
      {
        sport: 'football',
        league: 'NFL',
        homeTeam: 'Dallas Cowboys',
        awayTeam: 'Philadelphia Eagles',
        matchDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        predictionType: 'moneyline',
        prediction: 'Dallas Cowboys',
        odds: 2.10,
        userConfidence: 75,
        aiConfidence: 79,
        stake: 100,
        status: 'lost',
        result: 'lost',
        actualReturn: 0,
        accessLevel: 'premium',
        tags: ['rivalry'],
        analysis: 'Cowboys strong at home but Eagles defense proved too strong.',
        createdBy: adminUser._id
      },
      {
        sport: 'basketball',
        league: 'NBA',
        homeTeam: 'Phoenix Suns',
        awayTeam: 'Denver Nuggets',
        matchDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        predictionType: 'moneyline',
        prediction: 'Phoenix Suns',
        odds: 1.75,
        userConfidence: 95,
        aiConfidence: 93,
        stake: 300,
        status: 'active',
        accessLevel: 'vip',
        tags: ['vip-exclusive', 'high-confidence'],
        analysis: 'Exclusive VIP pick. Suns have perfect matchup against Nuggets weaknesses.',
        createdBy: adminUser._id
      },
      {
        sport: 'football',
        league: 'NFL',
        homeTeam: 'Green Bay Packers',
        awayTeam: 'Minnesota Vikings',
        matchDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        predictionType: 'spread',
        prediction: 'Green Bay Packers -7',
        odds: 1.88,
        userConfidence: 84,
        aiConfidence: 86,
        stake: 175,
        status: 'active',
        accessLevel: 'vip',
        tags: ['division-rivalry', 'weather-factor'],
        analysis: 'Packers excel in cold weather. Vikings struggling with injuries.',
        createdBy: adminUser._id
      }
    ]);

    // Create Sample Announcements
    console.log('Creating sample announcements...');
    const announcements = await Announcement.insertMany([
      {
        title: 'Welcome to SureSport Picks!',
        message: 'Thank you for joining our premium sports analytics platform. Get ready to elevate your betting game with our AI-powered predictions.',
        type: 'success',
        priority: 'high',
        targetAudience: 'all',
        isActive: true,
        isPinned: true,
        createdBy: adminUser._id
      },
      {
        title: 'New NBA Season Analytics Available',
        message: 'Our advanced NBA analytics are now live! Check out the latest player performance metrics and team statistics.',
        type: 'info',
        priority: 'medium',
        targetAudience: 'silver',
        isActive: true,
        isPinned: false,
        createdBy: adminUser._id
      },
      {
        title: 'VIP Exclusive: Playoff Predictions',
        message: 'Exclusive playoff predictions are now available for Gold members. Don\'t miss out on our highest confidence picks!',
        type: 'info',
        priority: 'high',
        targetAudience: 'gold',
        isActive: true,
        isPinned: true,
        createdBy: adminUser._id
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log(`Created ${plans.length} plans`);
    console.log(`Created ${sampleUsers.length + 1} users (including admin)`);
    console.log(`Created ${picks.length} picks`);
    console.log(`Created ${announcements.length} announcements`);
    console.log('\n📧 Admin Login:');
    console.log('Email: admin@suresport.com');
    console.log('Password: Admin123!');
    console.log('\n👤 Sample User Login:');
    console.log('Email: john@example.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run seeding
connectDB().then(seedData);

module.exports = { seedData };