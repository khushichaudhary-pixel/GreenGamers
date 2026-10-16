import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '400px',
        width: '100%',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => {
        const isCelebration = toast.type === 'celebration' || toast.xp;
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className="card animate-fade-in"
            style={{
              pointerEvents: 'auto',
              padding: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              backgroundColor: isCelebration ? '#ecfdf5' : isError ? '#fef2f2' : '#ffffff',
              borderColor: isCelebration ? '#a7f3d0' : isError ? '#fecaca' : '#e5e7eb',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ flexShrink: 0, marginTop: '2px' }}>
              {isCelebration ? (
                <div
                  style={{
                    background: '#059669',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Sparkles size={16} />
                </div>
              ) : isError ? (
                <AlertCircle size={22} color="#dc2626" />
              ) : isInfo ? (
                <Info size={22} color="#2563eb" />
              ) : (
                <CheckCircle2 size={22} color="#059669" />
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    color: isError ? '#991b1b' : '#0e382c',
                    margin: 0,
                  }}
                >
                  {toast.title}
                </h4>
                {toast.xp && (
                  <span
                    style={{
                      background: '#10b981',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '999px',
                    }}
                  >
                    +{toast.xp} XP
                  </span>
                )}
              </div>
              {toast.message && (
                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: '#4b5563',
                    marginTop: '4px',
                    lineHeight: 1.4,
                  }}
                >
                  {toast.message}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              style={{
                color: '#9ca3af',
                padding: '2px',
                borderRadius: '4px',
                display: 'flex',
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
