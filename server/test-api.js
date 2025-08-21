const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testing Smart Gym Logger API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check:', health.data);

    // Test user registration
    console.log('\n2. Testing user registration...');
    const testUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123'
    };

    const registerResponse = await axios.post(`${API_BASE}/auth/register`, testUser);
    console.log('✅ Registration successful:', {
      success: registerResponse.data.success,
      user: registerResponse.data.data.user.name,
      hasToken: !!registerResponse.data.data.token
    });

    const token = registerResponse.data.data.token;

    // Test login
    console.log('\n3. Testing user login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful:', {
      success: loginResponse.data.success,
      user: loginResponse.data.data.user.name
    });

    // Test protected endpoint
    console.log('\n4. Testing protected endpoint...');
    const profileResponse = await axios.get(`${API_BASE}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Profile fetch successful:', {
      user: profileResponse.data.data.user.name,
      email: profileResponse.data.data.user.email
    });

    console.log('\n🎉 All tests passed! Your backend is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
  }
}

testAPI();
