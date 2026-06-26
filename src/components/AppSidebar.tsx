import {
  BookOpen,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  CreditCard,
  LayoutGrid,
  LogOut,
  Rocket,
  Settings,
} from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiSlice } from '../Redux/api/apiSlice';
import {
  resetState as resetAuthSlice,
  signout,
} from '../Redux/features/auth/authSlice';
import { resetState as resetFitmentScoreSlice } from '../Redux/features/fitmentScoreSlice';
import { resetState as resetPaymentModal } from '../Redux/features/paymentModalSlice';
import { resetState as resetRegisterSellerModal } from '../Redux/features/registerSellerModalSlice';
import { AppDispatch } from '../Redux/store';

export type SidebarKey =
  | 'dashboard'
  | 'listings'
  | 'migrations'
  | 'billing'
  | 'settings'
  | 'documentation';

interface NavItem {
  key: SidebarKey;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: any;
  to?: string;
  indent?: boolean;
}

const NAV: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', Icon: LayoutGrid, to: '/dashboard' },
  {
    key: 'listings',
    label: 'Listings Readiness',
    Icon: ClipboardList,
    to: '/dashboard?tab=readiness',
    indent: true,
  },
  {
    key: 'migrations',
    label: 'Migrations',
    Icon: Rocket,
    to: '/dashboard?tab=migrations',
    indent: true,
  },
  { key: 'billing', label: 'Billing', Icon: CreditCard, to: '/billing' },
];

const BOTTOM: NavItem[] = [
  { key: 'settings', label: 'Settings', Icon: Settings, to: '/settings' },
  {
    key: 'documentation',
    label: 'Documentation',
    Icon: BookOpen,
    to: '/documentation',
  },
];

const COLLAPSED_W = 64;
const EXPANDED_W = 240;

const AppSidebar = ({ active }: { active: SidebarKey }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('sidebarCollapsed') === 'true',
  );
  const [hovered, setHovered] = useState(false);

  const expanded = !collapsed || hovered;

  const handleLogout = () => {
    dispatch(signout());
    dispatch(resetAuthSlice());
    dispatch(resetPaymentModal());
    dispatch(resetFitmentScoreSlice());
    dispatch(resetRegisterSellerModal());
    dispatch(apiSlice.util.resetApiState());
    navigate('/login');
  };

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebarCollapsed', String(next));
      return next;
    });
    setHovered(false);
  };

  const renderItem = ({ key, label, Icon, to, indent }: NavItem) => {
    const isActive = key === active;
    return (
      <button
        key={key}
        title={!expanded ? label : undefined}
        onClick={() => to && navigate(to)}
        className={`relative flex w-full items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13px] font-medium transition-all duration-150 ${
          expanded ? '' : 'justify-center'
        } ${indent && expanded ? 'pl-7' : ''} ${
          isActive
            ? 'bg-[#1D4ED8]/[0.15] text-[#60A5FA]'
            : 'text-[#64748B] hover:bg-white/[0.04] hover:text-[#CBD5E1]'
        }`}
      >
        {/* Active accent bar */}
        {isActive && (
          <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-[#3B82F6]" />
        )}
        {/* Indent dot for sub-items */}
        {indent && expanded && (
          <span className="mr-0.5 h-1 w-1 shrink-0 rounded-full bg-current opacity-30" />
        )}
        <Icon className="h-[15px] w-[15px] shrink-0" />
        {expanded && <span className="truncate">{label}</span>}
      </button>
    );
  };

  return (
    <>
      {/* In-flow spacer so page content doesn't slide under the fixed sidebar */}
      <div
        aria-hidden
        style={{ width: collapsed ? COLLAPSED_W : EXPANDED_W }}
        className="shrink-0 transition-[width] duration-200"
      />

      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setHovered(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node))
            setHovered(false);
        }}
        style={{ width: expanded ? EXPANDED_W : COLLAPSED_W }}
        className="fixed left-0 top-0 z-[100] flex h-screen flex-col overflow-hidden bg-[#0B1426] shadow-[1px_0_0_0_rgba(255,255,255,0.05)] transition-[width] duration-200"
      >
        {/* ── Logo ───────────────────────────────────────────────── */}
        <div
          className={`flex h-[56px] shrink-0 items-center border-b border-white/[0.05] px-4 ${expanded ? 'gap-2.5' : 'justify-center'}`}
        >
          <img
            src="/logo.png"
            alt="E2T Logo"
            className="h-8 w-8 shrink-0 object-contain"
          />
          {expanded && (
            <div className="flex flex-col min-w-0">
              <span className="truncate text-[13px] font-bold tracking-tight text-white leading-tight">
                eBay2Temu
              </span>
              <span className="truncate text-[10px] text-[#4A6080] leading-tight">
                Migration Platform
              </span>
            </div>
          )}
        </div>

        {/* ── Main navigation ────────────────────────────────────── */}
        <nav className="flex flex-col gap-0.5 px-3 pt-4">
          {expanded && (
            <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#2D4060]">
              Main
            </p>
          )}
          {NAV.map(renderItem)}
        </nav>

        {/* ── Bottom section ─────────────────────────────────────── */}
        <div className="mt-auto flex flex-col gap-0.5 border-t border-white/[0.05] px-3 pb-3 pt-3">
          {expanded && (
            <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#2D4060]">
              Account
            </p>
          )}
          {BOTTOM.map(renderItem)}

          {/* ── Log out ──────────────────────────────────────────── */}
          <button
            onClick={handleLogout}
            title="Log out"
            className={`mt-1 flex w-full items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13px] font-medium text-[#64748B] transition-all duration-150 hover:bg-red-500/[0.08] hover:text-red-400 ${
              expanded ? '' : 'justify-center'
            }`}
          >
            <LogOut className="h-[15px] w-[15px] shrink-0" />
            {expanded && <span className="truncate">Log out</span>}
          </button>

          {/* ── Collapse toggle ───────────────────────────────────── */}
          <button
            onClick={toggle}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13px] font-medium text-[#2D4060] transition-all duration-150 hover:bg-white/[0.04] hover:text-[#64748B] ${
              expanded ? '' : 'justify-center'
            }`}
          >
            {collapsed ? (
              <ChevronsRight className="h-[15px] w-[15px] shrink-0" />
            ) : (
              <ChevronsLeft className="h-[15px] w-[15px] shrink-0" />
            )}
            {expanded && <span className="truncate">Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
