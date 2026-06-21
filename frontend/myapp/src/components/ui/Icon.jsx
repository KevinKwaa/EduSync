import {
  LayoutDashboard, Users, BookOpen, Wallet, CalendarCheck, BarChart3,
  Settings, Building2, GraduationCap, Layers, FileText, Plane, Megaphone,
  PanelLeft, Search, Bell, Plus, Calendar, ChevronDown, TrendingUp, Sparkles,
  Sun, Moon, RefreshCw,
} from 'lucide-react';

const MAP = {
  'layout-dashboard': LayoutDashboard,
  'users':            Users,
  'book-open':        BookOpen,
  'wallet':           Wallet,
  'calendar-check':   CalendarCheck,
  'bar-chart-3':      BarChart3,
  'settings':         Settings,
  'building-2':       Building2,
  'graduation-cap':   GraduationCap,
  'layers':           Layers,
  'file-text':        FileText,
  'plane':            Plane,
  'megaphone':        Megaphone,
  'panel-left':       PanelLeft,
  'search':           Search,
  'bell':             Bell,
  'plus':             Plus,
  'calendar':         Calendar,
  'chevron-down':     ChevronDown,
  'trending-up':      TrendingUp,
  'sparkles':         Sparkles,
  'sun':              Sun,
  'moon':             Moon,
  'refresh-cw':       RefreshCw,
};

export function Icon({ name, size = 16, strokeWidth = 1.75, className, style }) {
  const LucideIcon = MAP[name];
  if (!LucideIcon) return null;
  return (
    <LucideIcon
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      style={style}
      aria-hidden="true"
    />
  );
}
