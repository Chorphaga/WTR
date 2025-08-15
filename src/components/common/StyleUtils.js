// StyleUtils.js - ใส่ใน src/components/common/StyleUtils.js
import { Theme } from './Theme';

export class StyleUtils {
  static card(variant = 'default') {
    const base = {
      backgroundColor: 'white',
      borderRadius: Theme.radius.lg,
      boxShadow: Theme.shadows.sm,
      border: `1px solid ${Theme.colors.gray[200]}`,
      overflow: 'hidden'
    };

    const variants = {
      default: base,
      elevated: { ...base, boxShadow: Theme.shadows.md },
      bordered: { ...base, border: `2px solid ${Theme.colors.gray[200]}` }
    };

    return variants[variant];
  }

  static button(variant = 'primary', size = 'md') {
    const base = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: Theme.spacing.sm,
      border: 'none',
      borderRadius: Theme.radius.md,
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.2s ease'
    };

    const sizes = {
      sm: { padding: `${Theme.spacing.sm} ${Theme.spacing.md}`, fontSize: '0.875rem' },
      md: { padding: `${Theme.spacing.md} ${Theme.spacing.lg}`, fontSize: '0.875rem' },
      lg: { padding: `${Theme.spacing.lg} ${Theme.spacing.xl}`, fontSize: '1rem' }
    };

    const variants = {
      primary: {
        backgroundColor: Theme.colors.primary,
        color: 'white'
      },
      success: {
        backgroundColor: Theme.colors.success,
        color: 'white'  
      },
      outline: {
        backgroundColor: 'transparent',
        border: `1px solid ${Theme.colors.gray[300]}`,
        color: Theme.colors.gray[700]
      }
    };

    return { ...base, ...sizes[size], ...variants[variant] };
  }

  static badge(variant = 'default') {
    const base = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: Theme.spacing.xs,
      padding: `${Theme.spacing.xs} ${Theme.spacing.md}`,
      fontSize: '0.75rem',
      fontWeight: '500',
      borderRadius: '9999px'
    };

    const variants = {
      default: { backgroundColor: Theme.colors.gray[100], color: Theme.colors.gray[800] },
      primary: { backgroundColor: Theme.colors.primaryLight, color: Theme.colors.primary },
      success: { backgroundColor: Theme.colors.successLight, color: Theme.colors.success },
      warning: { backgroundColor: Theme.colors.warningLight, color: Theme.colors.warning },
      error: { backgroundColor: Theme.colors.errorLight, color: Theme.colors.error }
    };

    return { ...base, ...variants[variant] };
  }

  static input() {
    return {
      width: '100%',
      padding: `${Theme.spacing.md} ${Theme.spacing.lg}`,
      border: `1px solid ${Theme.colors.gray[300]}`,
      borderRadius: Theme.radius.md,
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'all 0.2s ease',
      backgroundColor: 'white'
    };
  }

  static layout() {
    return {
      container: {
        minHeight: '100vh',
        padding: Theme.spacing.xl,
        backgroundColor: Theme.colors.gray[50],
        fontFamily: 'system-ui, -apple-system, sans-serif'
      },
      header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Theme.spacing.xxl
      },
      section: {
        marginBottom: Theme.spacing.xl
      }
    };
  }
   static typography() {
    return {
      cardTitle: {
        fontSize: '1.125rem',
        fontWeight: 600,
        marginBottom: Theme.spacing.md,
        color: Theme.colors.gray[700]
      }
    };
  }
}