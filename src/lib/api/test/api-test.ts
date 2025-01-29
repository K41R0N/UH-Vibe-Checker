import axios from 'axios';

async function testAPI() {
  try {
    // Test with a reliable API first
    console.log('Testing connection with a public API...');
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
    console.log('Connection test successful:', response.status === 200);

    // Then try Teleport API
    console.log('\nTesting Teleport API...');
    const teleportResponse = await axios.get('https://api.teleport.org/api/cities/');
    console.log('Teleport API test successful:', teleportResponse.status === 200);

  } catch (error: any) {
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      hostname: error.hostname,
      syscall: error.syscall
    });
  }
}

testAPI(); 