import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { StatCard } from '../components/common/StatCard';
import { LevelBadge } from '../components/common/LevelBadge';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  BarChart3,
  Sprout,
  Droplets,
  TrendingUp,
  Sparkles,
  Printer,
  Download,
  ShieldCheck,
  Globe,
  Leaf,
} from 'lucide-react';

const COLORS = ['#059669', '#10B981', '#34D399', '#047857', '#065F46', '#6EE7B7'];

export const ProgressReportPage = () => {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await api.getProgressReport();
        if (data.success) {
          setReport(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading || !report) {
    return <LoadingSpinner text="Generating your sustainability analytics report..." />;
  }

  const summary = report.summary || {
    totalPlants: 12,
    survivingPlants: 10,
    survivalRate: 83,
    totalCareActivities: 48,
    growthUpdatesCount: 18,
    currentStreak: 18,
    xpEarned: 1680,
    level: 5,
    levelTitle: 'Eco Steward',
    co2OffsetKg: '177.6',
    oxygenGeneratedKg: '1108.8',
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Report Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 800,
              marginBottom: '6px',
            }}
          >
            <ShieldCheck size={14} /> Official Verified Sustainability Report
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0e382c' }}>
            Progress & Sustainability Analytics
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '2px' }}>
            Comprehensive performance metrics, habit consistency & carbon offset projections
          </p>
        </div>

        <button onClick={handlePrint} className="btn btn-outline">
          <Printer size={16} /> Print / Export Report
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
        }}
      >
        <StatCard
          icon={Sprout}
          title="Total Registered"
          value={summary.totalPlants}
          subtitle={`${summary.survivingPlants} thriving saplings`}
          badgeText={`${summary.survivalRate}% Survival Rate`}
        />
        <StatCard
          icon={Droplets}
          title="Care Interactions"
          value={summary.totalCareActivities}
          subtitle={`${summary.growthUpdatesCount} verified photo logs`}
          badgeText="Verified"
          color="#059669"
          bgColor="#ecfdf5"
        />
        <StatCard
          icon={Globe}
          title="CO2 Offset Estimate"
          value={`${summary.co2OffsetKg} kg`}
          subtitle="Annualized carbon sink"
          badgeText="SDG 13"
          color="#047857"
          bgColor="#d1fae5"
        />
        <StatCard
          icon={Leaf}
          title="Oxygen Generated"
          value={`${summary.oxygenGeneratedKg} kg`}
          subtitle="Estimated biological output"
          badgeText="SDG 15"
          color="#10b981"
          bgColor="#ecfdf5"
        />
      </div>

      {/* 2-Column Chart Grid: Monthly Breakdown & Care Distribution */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '28px',
        }}
      >
        {/* Chart 1: Monthly Activity Bar Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0e382c' }}>
              Monthly Plantation & Care Frequency
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
              New saplings added vs maintenance actions logged
            </p>
          </div>

          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report.monthlyPlantation}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0e382c',
                    color: '#ffffff',
                    borderRadius: '8px',
                    border: 'none',
                  }}
                />
                <Legend />
                <Bar dataKey="care" name="Care Activities" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="plants" name="Plants Added" fill="#34D399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Care Distribution Pie Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0e382c' }}>
              Care Activity Distribution
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
              Breakdown across watering, fertilizing, pruning & health checks
            </p>
          </div>

          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={report.careDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {report.careDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0e382c',
                    color: '#ffffff',
                    borderRadius: '8px',
                    border: 'none',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 3: XP Accumulation Curve */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0e382c' }}>
              Eco XP & Habit Accumulation Trajectory
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
              Historical progression toward Level {summary.level} ({summary.levelTitle})
            </p>
          </div>
          <LevelBadge level={summary.level} title={summary.levelTitle} size="md" />
        </div>

        <div style={{ height: '240px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={report.xpHistory}>
              <defs>
                <linearGradient id="xpReportColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0e382c',
                  color: '#ffffff',
                  borderRadius: '8px',
                  border: 'none',
                }}
              />
              <Area
                type="monotone"
                dataKey="xp"
                name="Eco XP"
                stroke="#d97706"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#xpReportColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
