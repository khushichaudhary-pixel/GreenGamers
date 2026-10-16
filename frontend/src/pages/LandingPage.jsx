import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  TrendingUp,
  Droplets,
  Award,
  Trophy,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Globe,
  Flame,
  Leaf,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      {/* 1. HERO SECTION */}
      <section
        style={{
          backgroundColor: '#f8faf9',
          borderBottom: '1px solid #e5e7eb',
          padding: '80px 24px 96px 24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle background decoration elements */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            backgroundColor: 'rgba(5, 150, 105, 0.05)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* Left Text */}
          <div>
            <div className="hero-pill">
              <Sprout size={16} /> Gamified Plantation & Habit Formation Platform
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                fontWeight: 800,
                color: '#0e382c',
                lineHeight: 1.15,
                marginBottom: '20px',
                letterSpacing: '-0.03em',
              }}
            >
              Don't Just Plant It.{' '}
              <span style={{ color: '#059669', display: 'inline-block' }}>Play With It. Grow It.</span>
            </h1>

            <p
              style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#164e3d',
                marginBottom: '12px',
              }}
            >
              Turn plantation into a daily habit with Green Gamers.
            </p>

            <p
              style={{
                fontSize: '1.0625rem',
                color: '#4b5563',
                lineHeight: 1.6,
                marginBottom: '32px',
                maxWidth: '540px',
              }}
            >
              Green Gamers is a professional gamified platform that helps users register trees, track
              growth timelines, maintain watering records, and stay motivated through XP points,
              badges, levels, challenges, and campus leaderboards.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <Link
                to={isAuthenticated ? '/dashboard' : '/register'}
                className="btn btn-primary btn-lg"
              >
                <span>Start Growing</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/leaderboard" className="btn btn-outline btn-lg">
                Explore Green Gamers
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                marginTop: '40px',
                paddingTop: '24px',
                borderTop: '1px solid #e5e7eb',
              }}
            >
              <div>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0e382c' }}>5,420+</span>
                <p style={{ fontSize: '0.8125rem', color: '#6b7280' }}>Plants Registered</p>
              </div>
              <div style={{ width: '1px', height: '32px', backgroundColor: '#e5e7eb' }} />
              <div>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669' }}>32,800+</span>
                <p style={{ fontSize: '0.8125rem', color: '#6b7280' }}>Care Actions Logged</p>
              </div>
              <div style={{ width: '1px', height: '32px', backgroundColor: '#e5e7eb' }} />
              <div>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0e382c' }}>18.4 Tons</span>
                <p style={{ fontSize: '0.8125rem', color: '#6b7280' }}>CO2 Absorption Tracked</p>
              </div>
            </div>
          </div>

          {/* Right Visual Card Showcase */}
          <div style={{ position: 'relative' }}>
            <div
              className="card"
              style={{
                padding: '24px',
                boxShadow: '0 25px 50px -12px rgba(14, 56, 44, 0.15)',
                border: '1px solid #d1fae5',
                backgroundColor: '#ffffff',
              }}
            >
              {/* Card Top */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#ecfdf5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#059669',
                    }}
                  >
                    <Sprout size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0e382c' }}>
                      Krishna Tulsi (Holy Basil)
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                      Planted by Aarav Patel • Day 40
                    </span>
                  </div>
                </div>
                <span className="status-pill status-thriving">Thriving</span>
              </div>

              {/* Plant Image */}
              <div style={{ height: '220px', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80"
                  alt="Holy Basil"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(14, 56, 44, 0.9)',
                    color: '#ffffff',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  Height: 38 cm (+26 cm grown)
                </div>
              </div>

              {/* Live Gamification Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0e382c' }}>
                  Growth Timeline Progress
                </span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#059669' }}>
                  78% Maturity
                </span>
              </div>

              <div
                style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '999px',
                  overflow: 'hidden',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    width: '78%',
                    height: '100%',
                    backgroundColor: '#059669',
                    borderRadius: '999px',
                  }}
                />
              </div>

              {/* Floating Mini Badges */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: '#fef3c7',
                    color: '#b45309',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Sparkles size={12} /> +240 XP Earned
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Droplets size={12} /> 16 Hydrations Logged
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE GREEN GAMING ECOSYSTEM LOOP */}
      <section style={{ padding: '64px 24px', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            The Sustainable Habit Engine
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0e382c', marginTop: '6px', marginBottom: '40px' }}>
            How Green Gamers Sustains The Plantation Loop
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '16px',
            }}
          >
            {[
              { step: '01', title: 'PLANT', desc: 'Adopt or plant saplings', icon: '🌱', xp: '+50 XP' },
              { step: '02', title: 'CARE', desc: 'Water, prune & nourish', icon: '💧', xp: '+10 XP' },
              { step: '03', title: 'TRACK', desc: 'Measure height & logs', icon: '📸', xp: '+20 XP' },
              { step: '04', title: 'EARN', desc: 'Level up & win badges', icon: '⚡', xp: 'Rank Up' },
              { step: '05', title: 'COMPETE', desc: 'Climb the leaderboard', icon: '🏆', xp: 'Top Podium' },
              { step: '06', title: 'GROW', desc: 'Impact real urban flora', icon: '🌳', xp: 'CO2 Offset' },
            ].map((s) => (
              <div
                key={s.step}
                className="card"
                style={{
                  padding: '20px 14px',
                  backgroundColor: '#f8faf9',
                  border: '1px solid #e5e7eb',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{s.icon}</div>
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#9ca3af' }}>STEP {s.step}</span>
                <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0e382c', margin: '2px 0 4px 0' }}>
                  {s.title}
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '10px' }}>{s.desc}</p>
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '999px',
                  }}
                >
                  {s.xp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHY GREEN GAMERS? */}
      <section id="why-us" style={{ padding: '80px 24px', backgroundColor: '#f8faf9', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px auto' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Why Green Gamers?
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0e382c', marginTop: '8px' }}>
              Designed For Real Ecological Longevity
            </h2>
            <p style={{ fontSize: '1rem', color: '#6b7280', marginTop: '12px' }}>
              Most plantation campaigns stop once the tree is put in the dirt. Green Gamers ensures saplings survive into mature, oxygen-producing trees.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              {
                icon: Sprout,
                title: 'Plant & Register',
                desc: 'Catalog your plants with species taxonomy, planting dates, geolocation, initial heights, and baseline health observations.',
              },
              {
                icon: Droplets,
                title: 'Track & Care',
                desc: 'Smart reminders for watering intervals, seasonal fertilization schedules, pruning logs, and verified growth measurements.',
              },
              {
                icon: Award,
                title: 'Play & Earn',
                desc: 'Earn Eco XP for every genuine care activity. Advance through 7 levels from Seedling to Earth Guardian and unlock milestone badges.',
              },
              {
                icon: Trophy,
                title: 'Compete & Inspire',
                desc: 'Join campus 30-day challenges, climb city leaderboards, and share your plantation milestones with a supportive green community.',
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="card card-hover" style={{ padding: '32px 24px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: '#ecfdf5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#059669',
                      marginBottom: '20px',
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0e382c', marginBottom: '10px' }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '80px 24px', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px auto' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Simple 6-Step Workflow
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0e382c', marginTop: '8px' }}>
              How Green Gamers Works
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              { num: '1', title: 'Register your plant', desc: 'Take a photo, select species, and register initial height to claim +50 Welcome XP.' },
              { num: '2', title: 'Care for it daily', desc: 'Log watering, organic fertilization, and health checks to maintain your Green Streak.' },
              { num: '3', title: 'Upload growth updates', desc: 'Log periodic height increases and photo evidence to generate visual growth charts.' },
              { num: '4', title: 'Earn Eco XP points', desc: 'Earn points for continuous actions and advance through official environmental ranks.' },
              { num: '5', title: 'Unlock badges & rewards', desc: 'Earn badges for streaks, biodiversity variety, and sustained tree nurturing.' },
              { num: '6', title: 'Climb the leaderboard', desc: 'Compete with college peers, department teams, and urban planters globally.' },
            ].map((step) => (
              <div
                key={step.num}
                style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '24px',
                  backgroundColor: '#f8faf9',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#059669',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                    flexShrink: 0,
                  }}
                >
                  {step.num}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0e382c', marginBottom: '6px' }}>
                    {step.title}
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. UNITED NATIONS SDG ALIGNMENT */}
      <section id="sdg-impact" style={{ padding: '80px 24px', backgroundColor: '#f0fdf4', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px auto' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Sustainable Development Goals Alignment
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0e382c', marginTop: '8px' }}>
              Aligned With Global Environmental Targets
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
            }}
          >
            {/* SDG 13 */}
            <div
              className="card"
              style={{
                padding: '36px',
                border: '1.5px solid #a7f3d0',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div
                  style={{
                    backgroundColor: '#059669',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                  }}
                >
                  SDG 13
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0e382c' }}>
                    Climate Action
                  </h3>
                  <span style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 600 }}>
                    Target 13.3: Institutional & Human Climate Capacity
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '0.9375rem', color: '#4b5563', lineHeight: 1.6 }}>
                Green Gamers actively calculates and visualizes carbon sequestration per registered tree. By maintaining plant health, users help mitigate urban heat islands and reduce atmospheric carbon levels.
              </p>
            </div>

            {/* SDG 15 */}
            <div
              className="card"
              style={{
                padding: '36px',
                border: '1.5px solid #a7f3d0',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div
                  style={{
                    backgroundColor: '#164e3d',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                  }}
                >
                  SDG 15
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0e382c' }}>
                    Life on Land
                  </h3>
                  <span style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 600 }}>
                    Target 15.2: Sustainable Reforestation & Habitat Care
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '0.9375rem', color: '#4b5563', lineHeight: 1.6 }}>
                Encourages campus biodiversity by rewarding users for planting native species like Neem, Peepal, Banyan, and Tulsi. Empowers educational institutions to measure long-term survival metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CALL TO ACTION */}
      <section
        style={{
          padding: '80px 24px',
          backgroundColor: '#0e382c',
          color: '#ffffff',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(5, 150, 105, 0.3)',
              color: '#6ee7b7',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              marginBottom: '20px',
            }}
          >
            <Sparkles size={14} /> Join 5,000+ Active Planters
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '16px', lineHeight: 1.2 }}>
            Ready To Turn Plantation Into A Rewarding Habit?
          </h2>

          <p style={{ fontSize: '1.125rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '32px' }}>
            Register your first sapling in under 2 minutes and claim your +50 Eco XP welcome bonus today.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Register Your Plant Now
            </Link>
            <Link
              to="/login"
              className="btn btn-outline btn-lg"
              style={{ color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.3)' }}
            >
              Sign In To Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
