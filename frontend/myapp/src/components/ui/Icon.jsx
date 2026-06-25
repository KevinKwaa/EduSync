import {
  LayoutDashboard, Users, BookOpen, Wallet, CalendarCheck, BarChart3,
  Settings, Building2, GraduationCap, Layers, FileText, Plane, Megaphone,
  PanelLeft, Search, Bell, Plus, Calendar, ChevronDown, TrendingUp, Sparkles,
  Sun, Moon, RefreshCw,
  Check, X, AlertCircle, TrendingDown, Clock, ChevronRight, ArrowUp, ArrowDown,
  Minus, AlertTriangle, UserCheck, BookCheck, Send, Edit3, Archive,
  Eye, EyeOff, UserPlus, LogOut, ChevronLeft, ArrowRight, Lock, Mail, User,
  Phone, CreditCard, CheckCircle, Home,
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
  'chevron-right':    ChevronRight,
  'chevron-left':     ChevronLeft,
  'trending-up':      TrendingUp,
  'trending-down':    TrendingDown,
  'sparkles':         Sparkles,
  'sun':              Sun,
  'moon':             Moon,
  'refresh-cw':       RefreshCw,
  'check':            Check,
  'check-circle':     CheckCircle,
  'x':                X,
  'alert-circle':     AlertCircle,
  'alert-triangle':   AlertTriangle,
  'clock':            Clock,
  'arrow-up':         ArrowUp,
  'arrow-down':       ArrowDown,
  'arrow-right':      ArrowRight,
  'minus':            Minus,
  'user-check':       UserCheck,
  'user-plus':        UserPlus,
  'book-check':       BookCheck,
  'send':             Send,
  'edit-3':           Edit3,
  'archive':          Archive,
  'eye':              Eye,
  'eye-off':          EyeOff,
  'log-out':          LogOut,
  'lock':             Lock,
  'mail':             Mail,
  'user':             User,
  'phone':            Phone,
  'credit-card':      CreditCard,
  'home':             Home,
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
