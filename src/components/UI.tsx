import React from 'react';
import { Activity } from 'lucide-react';

// --- Badge ---
export const Badge = ({ children, variant = 'default', size = 'md', className = '' }: {
  children: React.ReactNode;
  variant?: 'default' | 'danger' | 'warning' | 'success' | 'info' | 'role';
  size?: 'sm' | 'md';
  className?: string;
}) => {
  const styles = {
    default: 'bg-gray-200 text-gray-600',
    danger: 'bg-critical/10 text-critical border border-critical/20',
    warning: 'bg-pending/10 text-pending border border-pending/20',
    success: 'bg-stable/10 text-stable border border-stable/20',
    info: 'bg-primary-light text-primary border border-primary/20',
    role: 'bg-primary-light text-primary',
  };
  const sizes = { sm: 'px-2 py-0.5 text-[9px]', md: 'px-2.5 py-1 text-[10px]' };
  return (
    <span className={`inline-flex items-center rounded-full font-bold uppercase tracking-[0.05em] ${styles[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

// --- Avatar ---
export const Avatar = ({ name, size = 'md', color = 'primary' }: {
  name: string; size?: 'sm' | 'md' | 'lg'; color?: 'primary' | 'gray';
}) => {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' };
  const colors = {
    primary: 'bg-primary-light text-primary',
    gray: 'bg-gray-200 text-gray-600',
  };
  return (
    <div className={`rounded-full flex items-center justify-center font-serif font-bold shrink-0 ${sizes[size]} ${colors[color]}`}>
      {initials}
    </div>
  );
};

// --- Loading Spinner ---
export const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <Activity className={`${sizes[size]} text-primary animate-pulse`} />
  );
};

// --- Full Page Loading ---
export const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-navy">
    <Spinner size="lg" />
  </div>
);

// --- Toast ---
export const Toast = ({ message, type = 'info', onDismiss }: {
  message: string; type?: 'info' | 'success' | 'error'; onDismiss: () => void;
}) => {
  const styles = {
    info: 'bg-navy text-white',
    success: 'bg-stable text-white',
    error: 'bg-critical text-white',
  };
  React.useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`fixed top-20 right-6 z-200 animate-fadeIn px-5 py-3 rounded-xl shadow-xl font-medium text-sm flex items-center gap-3 max-w-sm ${styles[type]}`}>
      <span className="flex-1">{message}</span>
      <button onClick={onDismiss} className="opacity-70 hover:opacity-100 text-lg leading-none">×</button>
    </div>
  );
};

// --- Empty State ---
export const EmptyState = ({ icon, title, subtitle, action }: {
  icon: React.ReactNode; title: string; subtitle?: string; action?: React.ReactNode;
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
      {icon}
    </div>
    <div>
      <p className="font-semibold text-navy">{title}</p>
      {subtitle && <p className="text-sm text-gray-secondary mt-1 max-w-xs">{subtitle}</p>}
    </div>
    {action}
  </div>
);

// --- Back Button ---
export const BackButton = ({ onClick, label = 'Back' }: { onClick: () => void; label?: string }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 text-sm font-semibold text-gray-secondary hover:text-navy transition-colors group"
  >
    <span className="w-7 h-7 rounded-full border border-gray-border flex items-center justify-center group-hover:border-navy transition-colors">
      ‹
    </span>
    {label}
  </button>
);

// --- Section Header ---
export const SectionHeader = ({ title, subtitle, action }: {
  title: string; subtitle?: string; action?: React.ReactNode;
}) => (
  <div className="flex items-start justify-between mb-6">
    <div>
      <h2 className="text-xl font-serif font-bold text-navy">{title}</h2>
      {subtitle && <p className="text-sm text-gray-secondary mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
);

// --- Search Input ---
export const SearchInput = ({ value, onChange, placeholder = 'Search...' }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-secondary text-sm">🔍</span>
    <input
      type="search"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="pl-9 pr-4 py-2.5 text-sm border border-gray-border rounded-lg bg-white outline-none focus:ring-2 focus:ring-primary/20 w-64"
    />
  </div>
);

// --- Confirmation Modal ---
export const ConfirmModal = ({ title, message, confirmLabel = 'Confirm', danger = false, onConfirm, onCancel }: {
  title: string; message: string; confirmLabel?: string;
  danger?: boolean; onConfirm: () => void; onCancel: () => void;
}) => (
  <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-200 flex items-center justify-center p-6">
    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-fadeIn space-y-6">
      <h3 className="text-xl font-serif font-bold text-navy">{title}</h3>
      <p className="text-sm text-gray-secondary leading-relaxed">{message}</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 btn-ghost border border-gray-border">Cancel</button>
        <button onClick={onConfirm} className={`flex-1 ${danger ? 'btn-danger' : 'btn-primary'}`}>
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);
