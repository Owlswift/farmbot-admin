// components/Sidebar.tsx
"use client";

import {
  HomeIcon,
  ShoppingCartIcon,
  UsersIcon,
  CubeIcon,
  ChartBarIcon,
  CogIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  ShoppingCartIcon as ShoppingCartIconSolid,
  UsersIcon as UsersIconSolid,
  CubeIcon as CubeIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  CogIcon as CogIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
} from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon, activeIcon: HomeIconSolid },
  {
    name: "Orders",
    href: "/orders",
    icon: ShoppingCartIcon,
    activeIcon: ShoppingCartIconSolid,
    count: 24,
  },
  {
    name: "Products",
    href: "/products",
    icon: CubeIcon,
    activeIcon: CubeIconSolid,
  },
  {
    name: "Customers",
    href: "/customers",
    icon: UsersIcon,
    activeIcon: UsersIconSolid,
  },
  {
    name: "WhatsApp",
    href: "/whatsapp",
    icon: ChatBubbleLeftRightIcon,
    activeIcon: ChatBubbleLeftRightIconSolid,
    badge: "Live",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: ChartBarIcon,
    activeIcon: ChartBarIconSolid,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: CogIcon,
    activeIcon: CogIconSolid,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div className="lg:hidden fixed inset-0 z-40 bg-black/50" />

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-0
        ${collapsed ? "-translate-x-full" : "translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-black border-r border-gray-800">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-gray-900">
                  <div className="w-full h-full rounded-full bg-green-500 animate-ping opacity-75"></div>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">FarmBot Admin</h1>
                <p className="text-xs text-emerald-400">WhatsApp Commerce</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = isActive ? item.activeIcon : item.icon;

              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-3 rounded-xl transition-all duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-r from-green-900/30 to-emerald-900/20 text-green-400 border-l-4 border-green-500"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    }
                  `}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      isActive
                        ? "text-green-400"
                        : "text-gray-500 group-hover:text-gray-300"
                    }`}
                  />
                  <span className="ml-3 font-medium">{item.name}</span>

                  {item.count && (
                    <span className="ml-auto bg-green-500/20 text-green-400 text-xs font-medium px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  )}

                  {item.badge && (
                    <span className="ml-auto bg-emerald-500/20 text-emerald-400 text-xs font-medium px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-medium">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  Admin User
                </p>
                <p className="text-xs text-gray-400 truncate">
                  admin@farmbot.com
                </p>
              </div>
              <button className="text-gray-400 hover:text-white p-1">
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
