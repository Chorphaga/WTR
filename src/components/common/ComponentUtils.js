// ComponentUtils.js - ใส่ใน src/components/common/ComponentUtils.js
import React from 'react';
import { Theme } from './Theme';
import { StyleUtils } from './StyleUtils';

export const StatCard = ({ icon: Icon, label, value, color = 'primary', ...props }) => {
  const cardStyle = {
    ...StyleUtils.card(),
    padding: Theme.spacing.xl,
    textAlign: 'center'
  };

  const iconStyle = {
    width: '3rem',
    height: '3rem',
    margin: `0 auto ${Theme.spacing.md}`,
    backgroundColor: Theme.colors[color + 'Light'],
    color: Theme.colors[color],
    borderRadius: Theme.radius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div style={cardStyle} {...props}>
      <div style={iconStyle}>
        <Icon size={24} />
      </div>
      <p style={{ 
        fontSize: '0.875rem', 
        color: Theme.colors.gray[600], 
        marginBottom: Theme.spacing.sm 
      }}>
        {label}
      </p>
      <p style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        color: Theme.colors[color] 
      }}>
        {value}
      </p>
    </div>
  );
};

export const StatusBadge = ({ status, ...props }) => {
  const statusMap = {
    'รอชำระ': { variant: 'warning', dot: true },
    'ชำระแล้ว': { variant: 'success', dot: true },
    'ยกเลิก': { variant: 'error', dot: true }
  };

  const config = statusMap[status] || { variant: 'default', dot: false };
  const badgeStyle = StyleUtils.badge(config.variant);

  return (
    <span style={badgeStyle} {...props}>
      {config.dot && (
        <div style={{ 
          width: '0.375rem', 
          height: '0.375rem', 
          backgroundColor: 'currentColor', 
          borderRadius: '50%' 
        }} />
      )}
      {status}
    </span>
  );
};

export const ActionButton = ({ icon: Icon, onClick, variant = 'default', title, ...props }) => {
  const variants = {
    view: { color: Theme.colors.primary, bg: Theme.colors.primaryLight },
    success: { color: Theme.colors.success, bg: Theme.colors.successLight },
    error: { color: Theme.colors.error, bg: Theme.colors.errorLight },
    default: { color: Theme.colors.gray[600], bg: Theme.colors.gray[100] }
  };

  const config = variants[variant];
  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.sm,
    backgroundColor: config.bg,
    color: config.color,
    border: 'none',
    borderRadius: Theme.radius.md,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  return (
    <button 
      style={buttonStyle} 
      onClick={onClick} 
      title={title}
      {...props}
    >
      <Icon size={16} />
    </button>
  );
};

export const FilterTab = ({ active, onClick, icon: Icon, label, count, ...props }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: Theme.spacing.sm,
      padding: `${Theme.spacing.sm} ${Theme.spacing.lg}`,
      fontSize: '0.875rem',
      fontWeight: '500',
      border: '1px solid',
      borderRadius: Theme.radius.md,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: active ? Theme.colors.primary : 'white',
      color: active ? 'white' : Theme.colors.gray[600],
      borderColor: active ? Theme.colors.primary : Theme.colors.gray[300]
    }}
    {...props}
  >
    <Icon size={16} />
    <span>{label}</span>
    <span style={{
      padding: '0.125rem 0.5rem',
      fontSize: '0.75rem',
      borderRadius: '9999px',
      backgroundColor: active ? 'rgba(255,255,255,0.2)' : Theme.colors.gray[100],
      color: active ? 'currentColor' : Theme.colors.gray[600]
    }}>
      {count}
    </span>
  </button>
);