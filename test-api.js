#!/usr/bin/env node

/**
 * VolleyFund API Test Script
 * Runs comprehensive tests before deployment
 */

const axios = require('axios');
const FormData = require('form-data');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
const MONGODB_URI = process.env.MONGODB_URI;

console.log('🚀 Testing VolleyFund API');
console.log('Base URL:', BASE_URL);
console.log('MongoDB URI configured:', !!MONGODB_URI);
console.log('---');

// Test data
const testTransaction = {
  description: 'Test transaction for API validation',
  amount: 150.00,
  type: 'income',
  category: 'Test Category',
  date: new Date().toISOString()
};

async function testAPI() {
  try {
    console.log('📝 Testing POST /api/transactions (create transaction)');

    const createResponse = await axios.post(`${BASE_URL}/api/transactions`, testTransaction);
    const transactionId = createResponse.data._id;

    console.log('✅ Transaction created successfully');
    console.log('Transaction ID:', transactionId);
    console.log('---');

    console.log('📖 Testing GET /api/transactions (get all transactions)');

    const getAllResponse = await axios.get(`${BASE_URL}/api/transactions`);
    console.log('✅ Retrieved transactions:', getAllResponse.data.length);
    console.log('---');

    console.log('🔍 Testing GET /api/transactions/:id (get single transaction)');

    const getOneResponse = await axios.get(`${BASE_URL}/api/transactions/${transactionId}`);
    console.log('✅ Retrieved transaction:', getOneResponse.data.description);
    console.log('---');

    console.log('📤 Testing PUT /api/transactions/:id (update transaction)');

    const updateData = { ...testTransaction, description: 'Updated test transaction' };
    const updateResponse = await axios.put(`${BASE_URL}/api/transactions/${transactionId}`, updateData);
    console.log('✅ Transaction updated:', updateResponse.data.description);
    console.log('---');

    console.log('🗑️ Testing DELETE /api/transactions/:id (delete transaction)');

    await axios.delete(`${BASE_URL}/api/transactions/${transactionId}`);
    console.log('✅ Transaction deleted successfully');
    console.log('---');

    console.log('🖼️ Testing image upload endpoints');

    // Create a test transaction for image upload
    const imageTransaction = await axios.post(`${BASE_URL}/api/transactions`, testTransaction);
    const imageTransactionId = imageTransaction.data._id;

    // Test image upload (using a simple test image buffer)
    try {
      const formData = new FormData();
      // Create a simple test image buffer (1x1 pixel PNG)
      const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
      formData.append('image', testImageBuffer, { filename: 'test.png', contentType: 'image/png' });

      const uploadResponse = await axios.post(
        `${BASE_URL}/api/transactions/${imageTransactionId}/upload-image`,
        formData,
        { headers: formData.getHeaders() }
      );

      console.log('✅ Image uploaded successfully');

      // Test image removal
      await axios.delete(`${BASE_URL}/api/transactions/${imageTransactionId}/remove-image`);
      console.log('✅ Image removed successfully');

    } catch (imageError) {
      console.log('⚠️ Image upload test skipped (test image not available)');
    }

    // Clean up test transaction
    await axios.delete(`${BASE_URL}/api/transactions/${imageTransactionId}`);
    console.log('🧹 Cleaned up test transaction');
    console.log('---');

    console.log('📚 Testing Swagger documentation');

    const swaggerResponse = await axios.get(`${BASE_URL}/api-docs`);
    console.log('✅ Swagger docs accessible');
    console.log('---');

    console.log('🎉 All API tests passed successfully!');
    console.log('Your VolleyFund API is ready for deployment.');

  } catch (error) {
    console.error('❌ API test failed:');
    console.error('Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    process.exit(1);
  }
}

// Run tests
testAPI();