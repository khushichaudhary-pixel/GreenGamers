import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Globe, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#0e382c',
        color: '#ffffff',
        padding: '56px 24px 32px 24px',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          paddingBottom: '40px',
        }}
      >
        {/* Col 1: Brand & Mission */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <Sprout size={22} />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800 }}>
              GREEN GAMERS
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '16px' }}>
            Gamified plantation tracking & sustainability platform. Turning plantation from a one-day duty into a lifelong daily habit.
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              backgroundColor: 'rgba(5, 150, 105, 0.25)',
              borderRadius: '8px',
              border: '1px solid rgba(5, 150, 105, 0.4)',
              fontSize: '0.8125rem',
              color: '#6ee7b7',
            }}
          >
            <ShieldCheck size={16} /> College & Hackathon Evaluation Ready
          </div>
        </div>

        {/* Col 2: Platform Links */}
        <div>
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
            Platform Modules
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
            <li>
              <Link to="/plants" style={{ color: '#94a3b8', transition: 'color 0.15s' }}>
                Plant Management & Growth
              </Link>
            </li>
            <li>
              <Link to="/care-tracker" style={{ color: '#94a3b8', transition: 'color 0.15s' }}>
                Watering & Care Tracker
              </Link>
            </li>
            <li>
              <Link to="/challenges" style={{ color: '#94a3b8', transition: 'color 0.15s' }}>
                30-Day Sustainability Challenges
              </Link>
            </li>
            <li>
              <Link to="/leaderboard" style={{ color: '#94a3b8', transition: 'color 0.15s' }}>
                Campus & City Leaderboards
              </Link>
            </li>
            <li>
              <Link to="/progress-report" style={{ color: '#94a3b8', transition: 'color 0.15s' }}>
                CO2 Analytics & Progress Reports
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: SDG Alignments */}
        <div>
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
            United Nations SDG Impact
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>🌍</span>
              <div>
                <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#ffffff' }}>SDG 13: Climate Action</p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Quantifying urban carbon absorption</p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>🌳</span>
              <div>
                <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#ffffff' }}>SDG 15: Life on Land</p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Restoring terrestrial biodiversity</p>
              </div>
            </div>
          </div>
        </div>

        {/* Col 4: Gamification Formula */}
        <div>
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
            The Green Loop
          </h4>
          <p style={{ fontSize: '0.8125rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '12px' }}>
            PLANT → CARE → TRACK → EARN XP → COMPETE → GROW
          </p>
          <div
            style={{
              padding: '12px',
              backgroundColor: 'rgba(5, 150, 105, 0.15)',
              borderRadius: '8px',
              border: '1px solid rgba(5, 150, 105, 0.3)',
              fontSize: '0.75rem',
              color: '#d1fae5',
            }}
          >
            "Don't Just Plant It. Play With It. Grow It."
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.8125rem',
          color: '#94a3b8',
        }}
      >
        <p>© 2026 Green Gamers Platform. Built for Environmental Sustainability & Habit Formation.</p>
        <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          Made with <Heart size={14} color="#10b981" fill="#10b981" /> for Earth
        </p>
      </div>
    </footer>
  );
};
