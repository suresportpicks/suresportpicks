const mongoose = require('mongoose')

const SectionSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  content: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  buttonText: { type: String, default: '' },
  buttonLink: { type: String, default: '' },
  enabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { _id: false })

const HeroSectionSchema = new mongoose.Schema({
  title: { type: String, default: 'Welcome to SureSport Picks' },
  subtitle: { type: String, default: 'Your trusted source for sports insights' },
  description: { type: String, default: 'Get expert analysis and data-driven insights to make informed decisions.' },
  backgroundImage: { type: String, default: '' },
  ctaText: { type: String, default: 'Get Started' },
  ctaLink: { type: String, default: '/register' },
  enabled: { type: Boolean, default: true }
}, { _id: false })

const FeatureSchema = new mongoose.Schema({
  icon: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  enabled: { type: Boolean, default: true }
}, { _id: false })

const TestimonialSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  role: { type: String, default: '' },
  content: { type: String, default: '' },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  avatar: { type: String, default: '' },
  enabled: { type: Boolean, default: true }
}, { _id: false })

const HomepageContentSchema = new mongoose.Schema({
  hero: { type: HeroSectionSchema, default: () => ({}) },
  
  // Custom sections that replace picks and plans
  sections: [SectionSchema],
  
  // Features section
  features: {
    title: { type: String, default: 'Why Choose Us' },
    subtitle: { type: String, default: 'Discover what makes us different' },
    items: [FeatureSchema],
    enabled: { type: Boolean, default: true }
  },
  
  // About section
  about: {
    title: { type: String, default: 'About SureSport Picks' },
    content: { type: String, default: 'We provide comprehensive sports analysis and insights.' },
    imageUrl: { type: String, default: '' },
    enabled: { type: Boolean, default: true }
  },
  
  // Testimonials
  testimonials: {
    title: { type: String, default: 'What Our Users Say' },
    subtitle: { type: String, default: 'Trusted by thousands of sports enthusiasts' },
    items: [TestimonialSchema],
    enabled: { type: Boolean, default: true }
  },
  
  // Contact section
  contact: {
    title: { type: String, default: 'Get In Touch' },
    subtitle: { type: String, default: 'Have questions? We\'re here to help' },
    email: { type: String, default: 'contact@suresportpicks.com' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    enabled: { type: Boolean, default: true }
  },
  
  // SEO settings
  seo: {
    title: { type: String, default: 'SureSport Picks - Expert Sports Analysis' },
    description: { type: String, default: 'Get expert sports analysis and insights from SureSport Picks.' },
    keywords: { type: String, default: 'sports, analysis, picks, betting, insights' }
  },
  
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true })

// Ensure single document in collection
HomepageContentSchema.statics.getSingleton = async function() {
  let doc = await this.findOne()
  if (!doc) {
    doc = await this.create({
      hero: {
        title: 'Welcome to SureSport Picks',
        subtitle: 'Your trusted source for sports insights',
        description: 'Get expert analysis and data-driven insights to make informed decisions.',
        ctaText: 'Get Started',
        ctaLink: '/register'
      },
      sections: [
        {
          title: 'Expert Analysis',
          subtitle: 'Data-Driven Insights',
          content: 'Our team of experts provides comprehensive analysis using advanced statistical models and real-time data.',
          order: 1,
          enabled: true
        },
        {
          title: 'Real-Time Updates',
          subtitle: 'Stay Informed',
          content: 'Get instant updates and notifications about important changes and opportunities.',
          order: 2,
          enabled: true
        }
      ],
      features: {
        title: 'Why Choose Us',
        subtitle: 'Discover what makes us different',
        items: [
          {
            icon: 'BarChart3',
            title: 'Advanced Analytics',
            description: 'Cutting-edge statistical analysis and data modeling',
            enabled: true
          },
          {
            icon: 'Shield',
            title: 'Trusted Platform',
            description: 'Secure and reliable platform with proven track record',
            enabled: true
          },
          {
            icon: 'Clock',
            title: '24/7 Support',
            description: 'Round-the-clock customer support and assistance',
            enabled: true
          }
        ]
      }
    })
  }
  return doc
}

module.exports = mongoose.model('HomepageContent', HomepageContentSchema)