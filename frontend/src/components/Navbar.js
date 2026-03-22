"use client"
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Bell, User, LogOut } from "lucide-react";
import api from "@/axios";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const portalType = pathname.split('/')[1];
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);  
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark as read");
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleSignOut = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = {
    student: [
      { label: "Dashboard", href: "/student" },
      { label: "Search Faculty", href: "/student/search" },
      { label: "Appointments", href: "/student/history" },
      { label: "Tickets", href: "/student/tickets" },
    ],
    faculty: [
      { label: "Dashboard", href: "/faculty" },
      { label: "Schedule", href: "/faculty/schedule" },
      { label: "Appointments", href: "/faculty/list" },
      { label: "Tickets", href: "/faculty/tickets" },
    ],
    admin: [
      { label: "Dashboard", href: "/admin" },
      { label: "Manage Tickets", href: "/admin/tickets" },
      { label: "User Accounts", href: "/admin/users"}
    ]
  };

  const currentLinks = navLinks[portalType] || [];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-[#E0E0E0]/50"
          : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Link href={`/${portalType}`} className="flex items-center gap-3 group">
                <div className="w-9 h-9 bg-[#1F3A5F] rounded-lg flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 group-hover:shadow-md">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_30%,rgba(255,255,255,0.1)_50%,transparent_70%)] animate-shimmer" />
                  <span className="text-white font-bold text-sm z-10">FS</span>
                </div>
                <span className="font-bold text-[#1F3A5F] text-lg tracking-tight hidden sm:block">
                  Faculty Scheduler
                </span>
                <span className="ml-2 px-2 py-0.5 rounded-full bg-[#E8EEF5] text-[#1F3A5F] text-xs font-medium capitalize hidden md:block">
                  {portalType}
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {currentLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                      ? "text-[#1F3A5F] bg-[#F4F7FB]"
                      : "text-[#5A6C7D] hover:text-[#1F3A5F] hover:bg-[#F8FAFC]"
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2 rounded-full text-[#5A6C7D] hover:bg-[#F4F7FB] transition-colors relative"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white border border-[#E0E0E0] rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] z-50 overflow-hidden">

                    {/* Header */}
                    <div className="px-4 py-3 border-b border-[#E0E0E0] bg-[#F7F9FC]">
                      <p className="text-sm font-semibold text-[#1F3A5F]">
                        Notifications
                      </p>
                    </div>

                    {/* Content */}
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-sm text-[#5A6C7D] text-center">
                          You're all caught up ✨
                        </p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={async () => {
                              try {
                                if (!n.isRead) {
                                  await markAsRead(n.id);
                                }
                                setNotifOpen(false);
                                if (n.link) {
                                  router.push(n.link);
                                }
                              } catch (err) {
                                console.error("Notification click failed");
                              }
                            }}
                            className={`px-4 py-3 border-b border-[#E0E0E0] cursor-pointer transition-all ${
                              n.isRead
                                ? "bg-white"
                                : "bg-[#EEF4FF] hover:bg-[#E4EDFF]"
                            }`}
                          >
                           <div className="flex justify-between items-start gap-2">

                            <div>
                              <p className="text-sm font-semibold text-[#1F3A5F]">
                                {n.title}
                              </p>
                              <p className="text-xs text-[#5A6C7D] mt-1">
                                {n.message}
                              </p>
                            </div>

                            {!n.isRead && (
                              <div className="w-2 h-2 mt-1 rounded-full bg-[#4A6FA5] flex-shrink-0" />
                            )}

                          </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={dropdownRef}>
                <div
                  className="w-8 h-8 rounded-full bg-[#E8EEF5] border border-[#C8D3E0] flex items-center justify-center text-[#1F3A5F] shadow-sm cursor-pointer hover:shadow hover:bg-[#DCE3ED] transition-all"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                >
                  <User size={16} />
                </div>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-[#DCE3ED] rounded-xl shadow-lg py-2 z-50 animate-fade-in origin-top-right">
                    <div className="px-4 py-3 border-b border-[#F0F4F8] mb-1">
                      <p className="text-sm font-bold text-[#1F3A5F] truncate">
                        {portalType === 'student' ? 'Ada Lovelace' : portalType === 'faculty' ? 'Dr. Alan Turing' : 'Admin User'}
                      </p>
                      <p className="text-xs text-[#5A6C7D] capitalize mt-0.5">{portalType} Portal</p>
                    </div>

                    {portalType !== 'admin' && (
                      <Link
                        href={`/${portalType}/profile`}
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#1F3A5F] hover:bg-[#F4F7FB] transition-colors"
                      >
                        <User size={16} className="text-[#4A6FA5]" /> My Profile
                      </Link>
                    )}

                    <Link
                      href = "#"
                      onClick={() => handleSignOut()}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors mt-1"
                    >
                      <LogOut size={16} /> Sign Out
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 -mr-2 text-[#5A6C7D] hover:bg-[#F4F7FB] rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#E0E0E0] animate-fade-down shadow-lg absolute top-full left-0 right-0">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {currentLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive
                      ? "text-[#1F3A5F] bg-[#F4F7FB]"
                      : "text-[#5A6C7D] hover:text-[#1F3A5F] hover:bg-[#F8FAFC]"
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>
      <div className="h-16"></div> {/* Spacer to prevent content from going under the fixed navbar */}
    </>
  );
}
