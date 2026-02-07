// components/Header.tsx
"use client";

import { useState } from "react";
import {
  MagnifyingGlassIcon,
  BellIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

const quickStats = [
  { label: "Today Orders", value: "42", change: "+12%", positive: true },
  { label: "Revenue", value: "₦128K", change: "+8%", positive: true },
  { label: "Customers", value: "1.2K", change: "+5%", positive: true },
];

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [notifications] = useState(3);

  const getPageTitle = () => {
    const map: Record<string, string> = {
      "/": "Dashboard",
      "/orders": "Orders",
      "/products": "Products",
      "/customers": "Customers",
      "/whatsapp": "WhatsApp Messages",
      "/analytics": "Analytics",
      "/settings": "Settings",
    };
    return map[pathname] || "Dashboard";
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-900 text-white"
      >
        {mobileMenuOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left Section */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getPageTitle()}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your farm produce orders from WhatsApp
              </p>
            </div>

            {/* Right Section */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  placeholder="Search orders, customers, products..."
                  className="block w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Quick Stats */}
              <div className="hidden lg:flex items-center space-x-6">
                {quickStats.map((stat) => (
                  <div key={stat.label} className="text-right">
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-lg font-semibold text-gray-900">
                        {stat.value}
                      </p>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          stat.positive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <BellIcon className="h-6 w-6" />
                  {notifications > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {/* Profile */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-medium">A</span>
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-gray-900">
                      Admin User
                    </p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                  <ChevronDownIcon className="hidden lg:block h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
