const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testTransactionsAPI() {
  try {
    console.log('=== Testing Transactions API ===');
    
    // Step 1: Login to get token
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'john@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received');
    
    // Step 2: Test transactions endpoint
    console.log('2. Fetching transactions...');
    const transactionsResponse = await axios.get(`${BASE_URL}/payments/transactions`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Transactions API response:');
    console.log('Total transactions:', transactionsResponse.data.total);
    console.log('Transactions count:', transactionsResponse.data.transactions.length);
    console.log('Total pages:', transactionsResponse.data.totalPages);
    
    if (transactionsResponse.data.transactions.length > 0) {
      console.log('\n📋 Sample transactions:');
      transactionsResponse.data.transactions.slice(0, 3).forEach((tx, index) => {
        console.log(`${index + 1}. ${tx.type} - $${tx.amount} - ${tx.status} - ${tx.description}`);
      });
    }
    
    // Step 3: Test filtering
    console.log('\n3. Testing filters...');
    
    // Test type filter
    const depositFilter = await axios.get(`${BASE_URL}/payments/transactions?type=deposit`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`✅ Deposit filter: ${depositFilter.data.total} transactions`);
    
    // Test search filter
    const searchFilter = await axios.get(`${BASE_URL}/payments/transactions?search=deposit`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`✅ Search filter: ${searchFilter.data.total} transactions`);
    
    // Test date range filter
    const todayFilter = await axios.get(`${BASE_URL}/payments/transactions?dateRange=today`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`✅ Today filter: ${todayFilter.data.total} transactions`);
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testTransactionsAPI();