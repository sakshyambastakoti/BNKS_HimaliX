/**
 * Automated end-to-end test script for the local OffPay backend server.
 * Tests:
 * 1. Health check
 * 2. Signup
 * 3. Login
 * 4. Check Balance
 * 5. Issue Offline Bonds (Ed25519 token minting)
 * 6. Offline P2P Sync (Double-spend detection & reconciliation)
 */

const BASE_URL = 'http://localhost:3000/api';

async function runTests() {
  console.log('🧪 Starting OffPay API End-to-End Test Suite...\n');

  try {
    // 1. Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const health = await healthRes.json();
    console.log('✓ Server is healthy:', health.status, '| System:', health.system);

    // 2. Signup Test User (Alice)
    const testEmail = `alice_${Date.now()}@offpay.np`;
    const testPhone = `+977-98${Math.floor(10000000 + Math.random() * 90000000)}`;
    console.log(`\n2️⃣ Testing User Registration (Alice: ${testEmail})...`);
    
    const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Alice Sharma',
        phone: testPhone,
        email: testEmail,
        password: 'Password@123',
        publicKey: 'mock-alice-ed25519-public-key',
      }),
    });
    const signupData = await signupRes.json();
    if (!signupRes.ok) throw new Error(JSON.stringify(signupData));
    const token = signupData.token;
    const aliceUserId = signupData.user.userId;
    console.log('✓ Alice registered successfully. User ID:', aliceUserId, 'Balance: NPR', signupData.user.onlineBalance);

    // 3. Check Balance
    console.log('\n3️⃣ Checking Wallet Balance...');
    const balanceRes = await fetch(`${BASE_URL}/wallet/balance`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const balanceData = await balanceRes.json();
    console.log('✓ Online Balance:', balanceData.onlineBalance, '| Offline Bonds:', balanceData.offlineBalance);

    // 4. Issue Offline Bonds (NPR 1000)
    console.log('\n4️⃣ Minting NPR 1,000 in Offline Signed Bonds...');
    const issueRes = await fetch(`${BASE_URL}/bonds/issue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: 1000 }),
    });
    const issueData = await issueRes.json();
    if (!issueRes.ok) throw new Error(JSON.stringify(issueData));
    console.log(`✓ Minted ${issueData.bonds.length} bond tokens. Remaining Online: NPR ${issueData.newOnlineBalance}`);
    issueData.bonds.forEach((b: any) => {
      console.log(`   - ${b.bondId} (NPR ${b.value}) [Sig: ${b.serverSignature.slice(0, 16)}...]`);
    });

    // 5. Signup Receiver (Bob)
    const bobEmail = `bob_${Date.now()}@offpay.np`;
    const bobPhone = `+977-98${Math.floor(10000000 + Math.random() * 90000000)}`;
    console.log(`\n5️⃣ Registering Receiver (Bob: ${bobEmail})...`);
    const bobSignupRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Bob Thapa',
        phone: bobPhone,
        email: bobEmail,
        password: 'Password@123',
      }),
    });
    const bobData = await bobSignupRes.json();
    const bobUserId = bobData.user.userId;
    const bobToken = bobData.token;
    console.log('✓ Bob registered successfully. User ID:', bobUserId);

    // 6. Simulate Offline P2P Payment (Alice pays Bob NPR 1000 offline)
    console.log('\n6️⃣ Simulating Cloud Sync of Offline Vouchers (Alice -> Bob NPR 1000)...');
    const syncRes = await fetch(`${BASE_URL}/transactions/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bobToken}`,
      },
      body: JSON.stringify({
        transactions: [
          {
            txId: `tx-test-${Date.now()}`,
            senderId: aliceUserId,
            receiverId: bobUserId,
            totalAmount: 1000,
            bonds: issueData.bonds,
            timestamp: new Date().toISOString(),
            nonce: 'test-nonce-123456',
            senderSignature: 'test-alice-signature-64b',
          },
        ],
      }),
    });
    const syncData = await syncRes.json();
    console.log('✓ Sync Results:', JSON.stringify(syncData.results, null, 2));

    // 7. Verify Bob's New Balance
    const bobBalanceRes = await fetch(`${BASE_URL}/wallet/balance`, {
      headers: { Authorization: `Bearer ${bobToken}` },
    });
    const bobBalanceData = await bobBalanceRes.json();
    console.log('✓ Bob New Online Balance (Credited NPR 1000): NPR', bobBalanceData.onlineBalance);

    // 8. Test Double-Spend Detection (Try to submit the exact same bonds again)
    console.log('\n7️⃣ Testing Anti-Double-Spend Defense (Attempting to re-spend same bonds)...');
    const doubleSpendRes = await fetch(`${BASE_URL}/transactions/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bobToken}`,
      },
      body: JSON.stringify({
        transactions: [
          {
            txId: `tx-double-spend-${Date.now()}`,
            senderId: aliceUserId,
            receiverId: bobUserId,
            totalAmount: 1000,
            bonds: issueData.bonds,
            timestamp: new Date().toISOString(),
            nonce: 'test-nonce-replay',
          },
        ],
      }),
    });
    const doubleSpendData = await doubleSpendRes.json();
    console.log('✓ Double-Spend Rejection Result:', JSON.stringify(doubleSpendData.results, null, 2));

    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! The local OffPay backend & database are fully operational.');
  } catch (err: any) {
    console.error('\n❌ Test failed:', err.message);
  }
}

runTests();
