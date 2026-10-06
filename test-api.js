// Comprehensive end-to-end API test script
const API_BASE = 'http://localhost:5000';

async function runTests() {
  console.log('--- STARTING SMARTASSIST API SUITE TESTS ---');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ FAIL: ${name} ->`, err.message);
      failed++;
    }
  }

  // 1. Health check
  await test('GET /health', async () => {
    const res = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    if (!res.ok || data.status !== 'ok') throw new Error('Health check failed');
  });

  // 2. Auth: Registration
  const testEmail = `student_${Date.now()}@university.edu`;
  let token = '';
  let userId = '';

  await test('POST /auth/signup (Valid Student)', async () => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'password123' })
    });
    const data = await res.json();
    if (res.status !== 201 || !data.token) throw new Error(data.message || 'Signup failed');
    token = data.token;
    userId = data.user.id;
  });

  await test('POST /auth/signup (Duplicate Email)', async () => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'password123' })
    });
    if (res.status !== 409) throw new Error(`Expected 409, got ${res.status}`);
  });

  // 3. Auth: Login
  await test('POST /auth/login (Correct Credentials)', async () => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'password123' })
    });
    const data = await res.json();
    if (res.status !== 200 || !data.token) throw new Error('Login failed');
  });

  await test('POST /auth/login (Wrong Password)', async () => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'wrongpassword' })
    });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  // 4. Auth: Profile & Me
  await test('GET /auth/me', async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.status !== 200 || data.user.email !== testEmail) throw new Error('Get me failed');
  });

  // 5. Chat: Create New Chat
  let chatId = '';
  await test('POST /api/chat/new', async () => {
    const res = await fetch(`${API_BASE}/api/chat/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title: 'Calculus Questions' })
    });
    const data = await res.json();
    if (res.status !== 201 || !data.conversation?._id) throw new Error('Create chat failed');
    chatId = data.conversation._id;
  });

  // 6. Chat: Send Message & Get AI Response with Category
  await test('POST /api/chat/:chatId/message (Academic Category Detection)', async () => {
    const res = await fetch(`${API_BASE}/api/chat/${chatId}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message: 'Explain the fundamental theorem of calculus and derivative' })
    });
    const data = await res.json();
    if (res.status !== 200 || !data.aiMessage || data.aiMessage.category !== 'Academic') {
      throw new Error(`Expected category Academic, got ${data.aiMessage?.category}`);
    }
  });

  // 7. Chat: Send Programming Message
  await test('POST /api/chat/:chatId/message (Programming Category Detection)', async () => {
    const res = await fetch(`${API_BASE}/api/chat/${chatId}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message: 'How do I debug React useEffect state update bug?' })
    });
    const data = await res.json();
    if (res.status !== 200 || !data.aiMessage || data.aiMessage.category !== 'Programming') {
      throw new Error(`Expected category Programming, got ${data.aiMessage?.category}`);
    }
  });

  // 8. Chat: Regenerate Response
  await test('POST /api/chat/:chatId/regenerate', async () => {
    const res = await fetch(`${API_BASE}/api/chat/${chatId}/regenerate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (res.status !== 200 || !data.aiMessage) throw new Error('Regenerate failed');
  });

  // 9. Chat: Rename & Pin
  await test('PUT /api/chat/:chatId (Rename & Pin)', async () => {
    const res = await fetch(`${API_BASE}/api/chat/${chatId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title: 'Mastering Calculus & React', isPinned: true })
    });
    const data = await res.json();
    if (res.status !== 200 || data.conversation.title !== 'Mastering Calculus & React' || !data.conversation.isPinned) {
      throw new Error('Rename/pin failed');
    }
  });

  // 10. Chat: Search
  await test('GET /api/chat/search?q=Calculus', async () => {
    const res = await fetch(`${API_BASE}/api/chat/search?q=Calculus`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.status !== 200 || data.conversations.length === 0) throw new Error('Search failed');
  });

  // 11. User Settings: Update & Fetch
  await test('PUT & GET /api/user/settings', async () => {
    const putRes = await fetch(`${API_BASE}/api/user/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ theme: 'dark', language: 'Spanish' })
    });
    const putData = await putRes.json();
    if (!putRes.ok || putData.preferences.theme !== 'dark') throw new Error('Put settings failed');

    const getRes = await fetch(`${API_BASE}/api/user/settings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const getData = await getRes.json();
    if (!getRes.ok || getData.preferences.language !== 'Spanish') throw new Error('Get settings failed');
  });

  // 12. Admin Stats (Register Admin)
  const adminEmail = `admin_${Date.now()}@smartassist.edu`;
  let adminToken = '';
  await test('POST /auth/signup (Admin User)', async () => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail, password: 'adminpassword123', isAdmin: true })
    });
    const data = await res.json();
    if (res.status !== 201 || !data.user.isAdmin) throw new Error('Admin registration failed');
    adminToken = data.token;
  });

  await test('GET /api/admin/stats (With Admin Privileges)', async () => {
    const res = await fetch(`${API_BASE}/api/admin/stats`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (res.status !== 200 || !data.stats || typeof data.stats.totalConversations !== 'number') {
      throw new Error('Admin stats failed');
    }
  });

  await test('GET /api/admin/stats (Forbidden for Regular Student)', async () => {
    const res = await fetch(`${API_BASE}/api/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.status !== 403) throw new Error(`Expected 403 Forbidden, got ${res.status}`);
  });

  // 13. Guest message quota test
  const guestId = `test_guest_${Date.now()}`;
  await test('Guest limit enforces max 5 queries', async () => {
    for (let i = 1; i <= 5; i++) {
      const gRes = await fetch(`${API_BASE}/api/chat/guest_test/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Guest question ${i}`, guestId })
      });
      if (!gRes.ok) throw new Error(`Guest message ${i} failed unexpectedly`);
    }

    // 6th message should fail with 403 requireSignup
    const gRes6 = await fetch(`${API_BASE}/api/chat/guest_test/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Guest question 6', guestId })
    });
    const gData6 = await gRes6.json();
    if (gRes6.status !== 403 || !gData6.requireSignup) {
      throw new Error(`Expected 403 with requireSignup, got status ${gRes6.status}`);
    }
  });

  console.log(`\n========================================`);
  console.log(`ALL API TESTS COMPLETED: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);
  if (failed > 0) process.exit(1);
}

runTests();
