"use client";

import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface MenuItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  subItems?: MenuItem[];
}

export default function MenuDropdown({
  item,
  isActive,
  isCollapsed,
}: {
  item: MenuItem;
  isActive: boolean;
  isCollapsed: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between ${isCollapsed ? 'justify-center' : 'space-x-2 px-4'} py-3 rounded-lg transition-colors ${
          isActive
            ? 'bg-purple-500 text-white'
            : 'text-gray-600 hover:bg-purple-50'
        }`}
      >
        <div className="flex items-center">
          <item.icon className="w-5 h-5" />
          {!isCollapsed && <span>{item.text}</span>}
        </div>
        <span className="text-gray-500">
          {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-full bg-white shadow-md rounded-md py-2">
          {item.subItems?.map((subItem) => (
            <Link
              key={subItem.href}
              href={subItem.href}
              className={`block px-4 py-2 text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-colors ${
                isCollapsed ? 'justify-center' : 'flex items-center space-x-2'
              }`}
            >
              <div className="flex items-center">
                <subItem.icon className="w-4 h-4" />
                {!isCollapsed && <span>{subItem.text}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
