import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { StatCard } from '../components/common/StatCard';
import { ProgressBar } from '../components/common/ProgressBar';
import { LevelBadge } from '../components/common/LevelBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { PlantCard } from '../components/plants/PlantCard';
import { QuickCareModal } from '../components/plants/QuickCareModal';
import { GrowthLogModal } from '../components/plants/GrowthLogModal';
import { CreatePostModal } from '../components/community/CreatePostModal';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  Sprout,
  Droplets,
  TrendingUp,
  Award,
  Sparkles,
  Flame,
  PlusCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  Trophy,
  AlertTriangle,
  Camera,
  Share2,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, refreshUser } = useAuth();
  const { toastSuccess, toastError, toastCelebration } = useToast();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [leaderboardTop, setLeaderboardTop] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedPlantForCare, setSelectedPlantForCare] = useState(null);
  const [selectedPlantForGrowth, setSelectedPlantForGrowth] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);

  // Greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [statsRes, reportRes, boardRes] = await Promise.all([
        api.getDashboardStats(),
        api.getProgressReport(),
        api.getLeaderboard(),
      ]);

      if (statsRes.success) setDashboardData(statsRes);
      if (reportRes.success) setReportData(reportRes);
      if (boardRes.success) setLeaderboardTop(boardRes.leaderboard.slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleTaskAction = async (task) => {
    try {
      if (task.taskType === 'water') {
        const data = await api.logCareActivity(task.plantId, {
          activityType: 'watered',
          notes: `Completed task: ${task.title}`,
        });
        if (data.success) {
          toastSuccess('Watering Logged! 💧', `+10 Eco XP earned for ${task.plantName}`, 10);
          await refreshUser();
          fetchDashboard();
        }
      } else if (task.taskType === 'photo') {
        // Open Growth modal for this plant
        const plantData = await api.getPlantById(task.plantId);
        if (plantData.success) {
          setSelectedPlantForGrowth(plantData.plant);
        }
      } else {
        const data = await api.logCareActivity(task.plantId, {
          activityType: 'checked_health',
          notes: `Health check task completed for ${task.plantName}`,
        });
        if (data.success) {
          toastSuccess('Health Checked! 🌿', `+5 Eco XP earned for ${task.plantName}`, 5);
          await refreshUser();
          fetchDashboard();
        }
      }
    } catch (err) {
      toastError('Task Action Error', err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your Green Gamers sanctuary..." />;
  }

  const stats = dashboardData?.stats || {
    totalPlants: 12,
    plantsGrowing: 10,
    totalCareActivities: 48,
    xp: user?.xp || 1250,
    level: user?.level || 5,
    levelTitle: user?.levelTitle || 'Eco Steward',
    streak: user?.streak || 18,
  };

  const levelInfo = user?.levelInfo || stats.levelInfo || {
    level: 5,
    levelTitle: 'Eco Steward',
    currentXp: 1680,
    minXp: 1400,
    maxXp: 2000,
    progressPercent: 46,
    xpToNextLevel: 320,
  };

  const chartData = reportData?.growthTimeline || [
    { date: 'Wk 1', height: 15, growth: 10 },
    { date: 'Wk 2', height: 22, growth: 25 },
    { date: 'Wk 3', height: 32, growth: 45 },
    { date: 'Wk 4', height: 48, growth: 65 },
    { date: 'Wk 5', height: 65, growth: 78 },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* 1. TOP WELCOME & LEVEL PROGRESS BAR */}
      <div
        className="card"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, #0e382c 0%, #164e3d 100%)',
          color: '#ffffff',
          borderRadius: '20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(5, 150, 105, 0.4)',
                    color: '#6ee7b7',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  {user?.college || 'Green Campus'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f87171', fontWeight: 800, fontSize: '0.8125rem' }}>
                  <Flame size={15} /> {stats.streak} Day Care Streak
                </span>
              </div>

              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                {getGreeting()}, {user?.name || 'Green Gamer'} 🌱
              </h1>
              <p style={{ fontSize: '0.9375rem', color: '#cbd5e1', marginTop: '4px' }}>
                Your plants have offset an estimated <strong style={{ color: '#6ee7b7' }}>{stats.estimatedCO2Kg || '18.4'} kg of CO2</strong> this season.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link to="/plants/add" className="btn btn-primary btn-sm" style={{ padding: '10px 16px' }}>
                <PlusCircle size={16} /> Add Plant
              </Link>
              <button
                onClick={() => setShowCreatePost(true)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '10px 16px' }}
              >
                <Share2 size={16} /> Share Milestone
              </button>
            </div>
          </div>

          {/* XP & Level Progress Bar */}
          <div
            style={{
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, color: '#6ee7b7' }}>
                  Level {levelInfo.level} – {levelInfo.levelTitle}
                </span>
              </div>
              <span style={{ color: '#cbd5e1', fontWeight: 600 }}>
                {levelInfo.currentXp} / {levelInfo.maxXp} Eco XP ({levelInfo.xpToNextLevel} XP to Next Level)
              </span>
            </div>

            <div
              style={{
                width: '100%',
                height: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '999px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${levelInfo.progressPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                  borderRadius: '999px',
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATS CARDS GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
        }}
      >
        <StatCard
          icon={Sprout}
          title="Total Plants"
          value={stats.totalPlants}
          subtitle={`${stats.plantsGrowing} actively growing`}
          badgeText="+2 this month"
          onClick={() => navigate('/plants')}
        />
        <StatCard
          icon={Droplets}
          title="Care Activities"
          value={stats.totalCareActivities}
          subtitle="Watering, pruning & checks"
          badgeText="Healthy Flora"
          color="#059669"
          bgColor="#ecfdf5"
          onClick={() => navigate('/care-tracker')}
        />
        <StatCard
          icon={Sparkles}
          title="Total Eco XP"
          value={stats.xp?.toLocaleString()}
          subtitle={`Level ${stats.level} (${stats.levelTitle})`}
          badgeText="Top 10% Planters"
          color="#d97706"
          bgColor="#fef3c7"
          badgeType="warning"
          onClick={() => navigate('/achievements')}
        />
        <StatCard
          icon={Flame}
          title="Green Streak"
          value={`${stats.streak} Days`}
          subtitle="Consistent daily care logs"
          badgeText="Active Habit"
          color="#dc2626"
          bgColor="#fee2e2"
          onClick={() => navigate('/challenges')}
        />
      </div>

      {/* 3. MAIN CONTENT: 2-COLUMN LAYOUT */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '28px',
        }}
      >
        {/* Left Column: Growth Chart & Recent Plants */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Plant Growth Overview Chart */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0e382c' }}>
                  Plant Growth Overview
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                  Height & maturity progression over time
                </p>
              </div>
              <Link to="/growth-timeline" className="btn btn-outline btn-sm">
                Full Timeline <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ height: '230px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0e382c',
                      color: '#ffffff',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '0.8125rem',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="height"
                    name="Height (cm)"
                    stroke="#059669"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#growthGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Plant Updates */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0e382c' }}>
                  Recent Plant Updates
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                  Latest growth logs and health checks
                </p>
              </div>
              <Link to="/plants" className="btn btn-outline btn-sm">
                View All ({stats.totalPlants})
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {dashboardData?.recentPlants?.length === 0 ? (
                <p style={{ fontSize: '0.875rem', color: '#9ca3af', textAlign: 'center', padding: '20px' }}>
                  No plants registered yet. Click "Add Plant" to get started!
                </p>
              ) : (
                dashboardData?.recentPlants?.map((plant) => (
                  <div
                    key={plant._id}
                    onClick={() => navigate(`/plants/${plant._id}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      backgroundColor: '#f8faf9',
                      borderRadius: '10px',
                      border: '1px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#a7f3d0')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={plant.image}
                        alt={plant.name}
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                        }}
                      />
                      <div>
                        <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0e382c' }}>
                          {plant.name}
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {plant.type} • Height: {plant.height} cm
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      <span
                        className={`status-pill ${
                          plant.healthStatus === 'Healthy' || plant.healthStatus === 'Thriving'
                            ? 'status-healthy'
                            : 'status-needs-care'
                        }`}
                        style={{ fontSize: '0.6875rem' }}
                      >
                        {plant.healthStatus}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>
                        {plant.growthPercentage}% grown
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Today's Tasks, Challenge, Badges & Leaderboard Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Today's Care Tasks */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="#059669" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0e382c' }}>
                  Today's Care Tasks
                </h3>
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  padding: '2px 8px',
                  borderRadius: '999px',
                }}
              >
                {dashboardData?.todayTasks?.length || 0} Pending
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {dashboardData?.todayTasks?.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280', fontSize: '0.875rem' }}>
                  All plants watered and checked for today! Great job 🌱
                </div>
              ) : (
                dashboardData?.todayTasks?.map((task, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      backgroundColor: task.isUrgent ? '#fffbeb' : '#ffffff',
                      border: task.isUrgent ? '1.5px solid #fde68a' : '1px solid #e5e7eb',
                      borderRadius: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={task.plantImage}
                        alt={task.plantName}
                        style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>
                          {task.title}
                        </p>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {task.taskType === 'water'
                            ? `Last watered: ${task.lastWateredHours}h ago`
                            : 'Routine growth tracking'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleTaskAction(task)}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    >
                      {task.taskType === 'water' ? 'Water (+10XP)' : 'Complete (+20XP)'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Current Challenge Card */}
          {dashboardData?.activeChallenge && (
            <div
              className="card"
              style={{
                padding: '24px',
                backgroundColor: '#f0fdf4',
                border: '1.5px solid #a7f3d0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{dashboardData.activeChallenge.icon}</span>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0e382c' }}>
                      {dashboardData.activeChallenge.title}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                      Current Active Challenge
                    </span>
                  </div>
                </div>

                <span
                  style={{
                    backgroundColor: '#fef3c7',
                    color: '#b45309',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                  }}
                >
                  +{dashboardData.activeChallenge.rewardXP} XP
                </span>
              </div>

              <div style={{ margin: '14px 0' }}>
                <ProgressBar
                  value={dashboardData.activeChallenge.progress}
                  max={dashboardData.activeChallenge.target}
                  label="Progress"
                  sublabel={`${dashboardData.activeChallenge.progress} of ${dashboardData.activeChallenge.target} days`}
                  height={8}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link to="/challenges" className="btn btn-primary btn-sm">
                  View Challenges <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}

          {/* Leaderboard Preview Card */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trophy size={18} color="#d97706" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0e382c' }}>
                  Leaderboard Preview
                </h3>
              </div>
              <Link to="/leaderboard" className="btn btn-outline btn-sm">
                Full Board <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {leaderboardTop.map((item, idx) => (
                <div
                  key={item._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    backgroundColor: item._id === user?._id ? '#ecfdf5' : '#ffffff',
                    border: item._id === user?._id ? '1.5px solid #a7f3d0' : '1px solid #f3f4f6',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: idx === 0 ? '#fef3c7' : idx === 1 ? '#f1f5f9' : idx === 2 ? '#ffedd5' : '#f3f4f6',
                        color: idx === 0 ? '#b45309' : idx === 1 ? '#475569' : idx === 2 ? '#9a3412' : '#6b7280',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      #{item.rank}
                    </span>
                    <img
                      src={item.profileImage}
                      alt={item.name}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0e382c' }}>
                        {item.name} {item._id === user?._id && '(You)'}
                      </span>
                      <p style={{ fontSize: '0.6875rem', color: '#6b7280' }}>{item.college?.split(' ')[0]}</p>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#059669' }}>
                    {item.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedPlantForCare && (
        <QuickCareModal
          isOpen={!!selectedPlantForCare}
          onClose={() => setSelectedPlantForCare(null)}
          plant={selectedPlantForCare}
          onCareLogged={() => {
            fetchDashboard();
          }}
        />
      )}

      {selectedPlantForGrowth && (
        <GrowthLogModal
          isOpen={!!selectedPlantForGrowth}
          onClose={() => setSelectedPlantForGrowth(null)}
          plant={selectedPlantForGrowth}
          onGrowthAdded={() => {
            fetchDashboard();
          }}
        />
      )}

      {showCreatePost && (
        <CreatePostModal
          isOpen={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          onPostCreated={() => {
            toastCelebration('Post Shared! 🌍', 'Milestone posted to Green Gamers community!');
          }}
        />
      )}
    </div>
  );
};
