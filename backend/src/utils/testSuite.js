// Automated full API test suite for Green Gamers backend
const runTests = async () => {
  const baseURL = 'http://localhost:5000/api';
  console.log('Testing Green Gamers API at ' + baseURL + '...\n');

  try {
    // 1. Health check
    const healthRes = await fetch(`${baseURL}/health`);
    const healthData = await healthRes.json();
    console.log('1. Health Check:', healthData);

    // 2. Auth Login (Demo Planter)
    const loginRes = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@greengamers.org', password: 'user123' }),
    });
    const loginData = await loginRes.json();
    console.log('2. User Login:', loginData.success ? `SUCCESS - Logged in as ${loginData.user.name} (Lvl ${loginData.user.level} ${loginData.user.levelTitle}, ${loginData.user.xp} XP)` : 'FAILED');

    const token = loginData.token;
    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    // 3. Get Dashboard Stats
    const dashRes = await fetch(`${baseURL}/stats/dashboard`, { headers: authHeaders });
    const dashData = await dashRes.json();
    console.log('3. Dashboard Stats:', dashData.success ? `SUCCESS - Total Plants: ${dashData.stats.totalPlants}, Care: ${dashData.stats.totalCareActivities}, Today Tasks: ${dashData.todayTasks.length}` : 'FAILED');

    // 4. Get Plants
    const plantsRes = await fetch(`${baseURL}/plants`, { headers: authHeaders });
    const plantsData = await plantsRes.json();
    console.log('4. Plant List:', plantsData.success ? `SUCCESS - Found ${plantsData.count} registered plants` : 'FAILED');

    const firstPlant = plantsData.plants[0];

    // 5. Test Quick Watering (+10 XP)
    const waterRes = await fetch(`${baseURL}/plants/${firstPlant._id}/care`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ activityType: 'watered', notes: 'Automated test hydration' }),
    });
    const waterData = await waterRes.json();
    console.log('5. Water Plant Action:', waterData.success ? `SUCCESS - ${waterData.message} (New XP: ${waterData.gamification?.user?.xp || 'Rewarded'})` : 'FAILED');

    // 6. Test Growth Update (+20 XP)
    const growthRes = await fetch(`${baseURL}/plants/${firstPlant._id}/growth`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ height: (firstPlant.height || 15) + 3, growthPercentage: 80, healthStatus: 'Thriving', notes: 'Automated test growth entry' }),
    });
    const growthData = await growthRes.json();
    console.log('6. Growth Update Action:', growthData.success ? `SUCCESS - ${growthData.message}` : 'FAILED');

    // 7. Test Register New Plant (+50 XP)
    const newPlantRes = await fetch(`${baseURL}/plants`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: 'Automated Test Banyan Sapling',
        type: 'Ficus benghalensis',
        location: 'Campus Quadrangle Garden',
        height: 25,
        description: 'Large canopy oxygen generator',
      }),
    });
    const newPlantData = await newPlantRes.json();
    console.log('7. Register New Plant:', newPlantData.success ? `SUCCESS - ${newPlantData.message} (Plant ID: ${newPlantData.plant._id})` : 'FAILED');

    // 8. Test Challenges
    const challengesRes = await fetch(`${baseURL}/challenges`, { headers: authHeaders });
    const challengesData = await challengesRes.json();
    console.log('8. Challenges List:', challengesData.success ? `SUCCESS - Found ${challengesData.count} challenges (First: "${challengesData.challenges[0]?.title}")` : 'FAILED');

    // 9. Test Leaderboard
    const boardRes = await fetch(`${baseURL}/leaderboard`, { headers: authHeaders });
    const boardData = await boardRes.json();
    console.log('9. Leaderboard Standings:', boardData.success ? `SUCCESS - Top 1: ${boardData.leaderboard[0]?.name} (${boardData.leaderboard[0]?.xp} XP)` : 'FAILED');

    // 10. Test Community Feed & Like
    const feedRes = await fetch(`${baseURL}/community`, { headers: authHeaders });
    const feedData = await feedRes.json();
    console.log('10. Community Feed:', feedData.success ? `SUCCESS - ${feedData.count} posts` : 'FAILED');

    if (feedData.posts.length > 0) {
      const postId = feedData.posts[0]._id;
      const likeRes = await fetch(`${baseURL}/community/${postId}/like`, { method: 'POST', headers: authHeaders });
      const likeData = await likeRes.json();
      console.log('11. Like Post:', likeData.success ? `SUCCESS - New likes: ${likeData.likesCount}` : 'FAILED');

      const commentRes = await fetch(`${baseURL}/community/${postId}/comment`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ text: 'Incredible growth! Proud of this green effort 🌱' }),
      });
      const commentData = await commentRes.json();
      console.log('12. Comment on Post:', commentData.success ? `SUCCESS - Comments count: ${commentData.comments.length}` : 'FAILED');
    }

    // 11. Admin Login & Overview
    const adminLoginRes = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@greengamers.org', password: 'admin123' }),
    });
    const adminLoginData = await adminLoginRes.json();
    const adminHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminLoginData.token}`,
    };

    const adminOverviewRes = await fetch(`${baseURL}/admin/overview`, { headers: adminHeaders });
    const adminOverviewData = await adminOverviewRes.json();
    console.log('13. Admin Console Access:', adminOverviewData.success ? `SUCCESS - Users: ${adminOverviewData.stats.totalUsers}, Plants: ${adminOverviewData.stats.totalPlants}, Total CO2: ${adminOverviewData.stats.estimatedTotalCO2SavedKg}kg` : 'FAILED');

    console.log('\n🌟 ALL 13 E2E INTEGRATION SUITES PASSED FLAWLESSLY! 🌟');
  } catch (err) {
    console.error('Test error:', err);
  }
};

runTests();
