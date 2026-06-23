/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArrowLeftRight,
  BookOpen,
  ChevronsLeft,
  ChevronsRight,
  LayoutGrid,
  Settings,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export type SidebarKey = 'dashboard' | 'settings' | 'documentation';

interface NavItem {
  key: SidebarKey;
  label: string;
  Icon: any;
  to?: string;
}

const NAV: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', Icon: LayoutGrid, to: '/dashboard' },
];

const BOTTOM: NavItem[] = [
  { key: 'settings', label: 'Settings', Icon: Settings, to: '/settings' },
  { key: 'documentation', label: 'Documentation', Icon: BookOpen, to: '/documentation' },
];

const COLLAPSED_W = 72;
const EXPANDED_W = 256;

const AppSidebar = ({ active }: { active: SidebarKey }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('sidebarCollapsed') === 'true'
  );
  const [hovered, setHovered] = useState(false);

  // Fully open when pinned-open, or temporarily while hovered/focused.
  const expanded = !collapsed || hovered;

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebarCollapsed', String(next));
      return next;
    });
    setHovered(false);
  };

  const renderItem = ({ key, label, Icon, to }: NavItem) => {
    const isActive = key === active;
    return (
      <button
        key={key}
        title={!expanded ? label : undefined}
        onClick={() => to && navigate(to)}
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium transition ${
          expanded ? '' : 'justify-center'
        } ${
          isActive
            ? 'bg-[#1B2B47] text-white'
            : 'text-[#94A3B8] hover:bg-[#131F36] hover:text-white'
        }`}
      >
        <Icon className="h-[18px] w-[18px] shrink-0" />
        {expanded && <span className="truncate">{label}</span>}
      </button>
    );
  };

  return (
    <>
      {/* In-flow spacer reserves the pinned width so main content aligns;
          the fixed sidebar overlays it when hover-expanded. */}
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
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setHovered(false);
        }}
        style={{ width: expanded ? EXPANDED_W : COLLAPSED_W }}
        className="fixed left-0 top-0 z-[100] flex h-screen flex-col bg-[#0B1426] px-4 py-6 shadow-xl transition-[width] duration-200"
      >
        {/* Logo */}
        <div className={`flex items-center gap-2.5 ${expanded ? 'px-2' : 'justify-center'}`}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1D4ED8]">
            <ArrowLeftRight className="h-5 w-5 text-white" />
          </div>
          {expanded && <span className="truncate text-[19px] font-bold text-white">eBay2Temu</span>}
        </div>

        <nav className="mt-8 flex flex-col gap-1">{NAV.map(renderItem)}</nav>

        <div className="mt-auto flex flex-col gap-1 border-t border-[#1B2B47] pt-4">
          {BOTTOM.map(renderItem)}

          {/* Collapse toggle */}
          <button
            onClick={toggle}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-[#94A3B8] transition hover:bg-[#131F36] hover:text-white ${
              expanded ? '' : 'justify-center'
            }`}
          >
            {collapsed ? (
              <ChevronsRight className="h-[18px] w-[18px] shrink-0" />
            ) : (
              <ChevronsLeft className="h-[18px] w-[18px] shrink-0" />
            )}
            {expanded && <span className="truncate">Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
