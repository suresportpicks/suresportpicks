const mongoose = require('mongoose');
require('dotenv').config();

const SupportTicket = require('../models/SupportTicket');

async function cleanupHardcodedResponses() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all tickets with hardcoded responses
    const tickets = await SupportTicket.find({
      'responses.message': 'Admin response added'
    });

    console.log(`Found ${tickets.length} tickets with hardcoded responses`);

    for (const ticket of tickets) {
      console.log(`\nTicket #${ticket.ticketNumber}:`);
      console.log(`Subject: ${ticket.subject}`);
      console.log(`Total responses: ${ticket.responses.length}`);
      
      // Count hardcoded responses
      const hardcodedCount = ticket.responses.filter(r => r.message === 'Admin response added').length;
      console.log(`Hardcoded responses: ${hardcodedCount}`);

      // Option 1: Remove all hardcoded responses
      ticket.responses = ticket.responses.filter(r => r.message !== 'Admin response added');
      
      await ticket.save();
      console.log(`Cleaned up ticket #${ticket.ticketNumber} - removed ${hardcodedCount} hardcoded responses`);
    }

    console.log('\nCleanup completed!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

cleanupHardcodedResponses();