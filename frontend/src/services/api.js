const API_BASE = 'http://localhost:5000/api';

const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('green_gamers_token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || `Request failed with status ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
};

export const api = {
  // Auth
  register: (userData) =>
    fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }).then(handleResponse),

  login: (credentials) =>
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }).then(handleResponse),

  getMe: () =>
    fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  updateProfile: (profileData) =>
    fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    }).then(handleResponse),

  changePassword: (passwords) =>
    fetch(`${API_BASE}/auth/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(passwords),
    }).then(handleResponse),

  // Plants
  getPlants: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/plants${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse);
  },

  getPlantById: (id) =>
    fetch(`${API_BASE}/plants/${id}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  createPlant: (plantData) => {
    const isFormData = plantData instanceof FormData;
    return fetch(`${API_BASE}/plants`, {
      method: 'POST',
      headers: getAuthHeaders(isFormData),
      body: isFormData ? plantData : JSON.stringify(plantData),
    }).then(handleResponse);
  },

  updatePlant: (id, plantData) => {
    const isFormData = plantData instanceof FormData;
    return fetch(`${API_BASE}/plants/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(isFormData),
      body: isFormData ? plantData : JSON.stringify(plantData),
    }).then(handleResponse);
  },

  deletePlant: (id) =>
    fetch(`${API_BASE}/plants/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  // Growth
  addGrowthUpdate: (plantId, growthData) => {
    const isFormData = growthData instanceof FormData;
    return fetch(`${API_BASE}/plants/${plantId}/growth`, {
      method: 'POST',
      headers: getAuthHeaders(isFormData),
      body: isFormData ? growthData : JSON.stringify(growthData),
    }).then(handleResponse);
  },

  getGrowthHistory: (plantId) =>
    fetch(`${API_BASE}/plants/${plantId}/growth`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  // Care
  logCareActivity: (plantId, careData) =>
    fetch(`${API_BASE}/plants/${plantId}/care`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(careData),
    }).then(handleResponse),

  getCareActivities: (plantId) => {
    const endpoint = plantId ? `${API_BASE}/plants/${plantId}/care` : `${API_BASE}/plants/care`;
    return fetch(endpoint, {
      headers: getAuthHeaders(),
    }).then(handleResponse);
  },

  // Challenges
  getChallenges: () =>
    fetch(`${API_BASE}/challenges`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  joinChallenge: (challengeId) =>
    fetch(`${API_BASE}/challenges/${challengeId}/join`, {
      method: 'POST',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  updateChallengeProgress: (challengeId, incrementBy = 1) =>
    fetch(`${API_BASE}/challenges/${challengeId}/progress`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ incrementBy }),
    }).then(handleResponse),

  // Leaderboard
  getLeaderboard: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/leaderboard${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse);
  },

  // Community Feed
  getCommunityFeed: (activityType = 'all') =>
    fetch(`${API_BASE}/community?activityType=${activityType}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  createCommunityPost: (postData) => {
    const isFormData = postData instanceof FormData;
    return fetch(`${API_BASE}/community`, {
      method: 'POST',
      headers: getAuthHeaders(isFormData),
      body: isFormData ? postData : JSON.stringify(postData),
    }).then(handleResponse);
  },

  likePost: (postId) =>
    fetch(`${API_BASE}/community/${postId}/like`, {
      method: 'POST',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  addComment: (postId, text) =>
    fetch(`${API_BASE}/community/${postId}/comment`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ text }),
    }).then(handleResponse),

  sharePost: (postId) =>
    fetch(`${API_BASE}/community/${postId}/share`, {
      method: 'POST',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  // Notifications
  getNotifications: () =>
    fetch(`${API_BASE}/notifications`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  markNotificationRead: (id) =>
    fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  markAllNotificationsRead: () =>
    fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  // Stats & Progress
  getDashboardStats: () =>
    fetch(`${API_BASE}/stats/dashboard`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  getProgressReport: () =>
    fetch(`${API_BASE}/stats/progress-report`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  // Admin
  getAdminOverview: () =>
    fetch(`${API_BASE}/admin/overview`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  getAdminUsers: () =>
    fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  updateUserRole: (id, role) =>
    fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    }).then(handleResponse),

  getAdminPlants: () =>
    fetch(`${API_BASE}/admin/plants`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  createAdminChallenge: (challengeData) =>
    fetch(`${API_BASE}/admin/challenges`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(challengeData),
    }).then(handleResponse),

  deleteAdminChallenge: (id) =>
    fetch(`${API_BASE}/admin/challenges/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  deleteAdminPost: (id) =>
    fetch(`${API_BASE}/admin/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then(handleResponse),
};
