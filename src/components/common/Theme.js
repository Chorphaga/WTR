// Theme.js - ใส่ใน src/components/common/Theme.js
export class Theme {
  static colors = {
    primary: '#2563eb',
    primaryLight: '#dbeafe', 
    success: '#16a34a',
    successLight: '#dcfce7',
    warning: '#eab308',
    warningLight: '#fef3c0',
    error: '#dc2626',
    errorLight: '#fee2e2',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6', 
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    }
  };

  static spacing = {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px  
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
    xl: '1.5rem',    // 24px
    xxl: '2rem'      // 32px
  };

  static radius = {
    sm: '0.375rem',
    md: '0.5rem', 
    lg: '0.75rem',
    xl: '1rem'
  };

  static shadows = {
    sm: '0 1px 3px rgba(0,0,0,0.1)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
    xl: '0 25px 50px rgba(0,0,0,0.25)'
  };
}