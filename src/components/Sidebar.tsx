import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PiSidebarSimpleLight } from 'react-icons/pi';
import { LuUserCog, LuUser, LuLogOut } from 'react-icons/lu';
import { SlMenu } from 'react-icons/sl';
import './Sidebar.css';
import logo from '../assets/logo.png';

type SidebarLink = {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  children?: SidebarLink[];
};

type SidebarProps = {
  links: SidebarLink[];
  username?: string;
};

export default function Sidebar({ links, username }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const toggleDropdown = () => setDropdownOpen((open) => !open);
  const closeDropdown = () => setDropdownOpen(false);

  const renderLinks = (links: SidebarLink[]) => (
    <ul className="nav-links">
      {links.map((link, index) => {
        const isActive = location.pathname === link.path || location.pathname.startsWith(`${link.path}/`);
        return (
          <li key={index}>
            <Link
              to={link.path}
              title={link.label}
              className={isActive ? 'active' : ''}
            >
              <span className="link-icon">{link.icon}</span>
              <span className="link-label">{link.label}</span>
            </Link>
            {link.children && renderLinks(link.children)}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-icon" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <SlMenu size={20} /> : <PiSidebarSimpleLight size={20} />}
      </div>

      { !collapsed && (
        <div className="sidebar-header">
          <img src={logo} alt="Logo" className="logo" />
        </div>
      )}

      <div className="sidebar-content">
        {renderLinks(links)}
      </div>

      <div
        className="user-profile"
        onClick={toggleDropdown}
        ref={dropdownRef}
        tabIndex={0}
        role="button"
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
      >
        <div className="user-icon">
          <LuUserCog size={20} />
        </div>
        <span className="username">{username}</span>

        <div className={`profile-dropdown right ${dropdownOpen ? 'open' : ''}`}>
          <div className="arrow-left" />
          <Link to="/profile" className="dropdown-item" onClick={closeDropdown}>
            <LuUser size={18} />
            Profile
          </Link>
          <Link to="/login" className="dropdown-item" onClick={closeDropdown}>
            <LuLogOut size={18} />
            Logout
          </Link>
        </div>
      </div>

      <div className="sidebar-footer">
        <p>&copy; 2024 My Company</p>
      </div>
    </div>
  );
}
