"use client"

import React from 'react';
import { Drawer, List, ListItemIcon, ListItemText, Toolbar, Divider, ListItemButton } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SettingsIcon from '@mui/icons-material/Settings';
import Link from 'next/link';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import { useState } from 'react';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, href: '/dashboard' },
  {
    text: 'Products',
    icon: <InventoryIcon />,
    children: [
      { text: 'Movie Tickets', href: '/products/movie-tickets' },
      // Tambahkan sub-menu lain di sini nanti
    ],
  },
  { text: 'Event', icon: <EventIcon />, href: '/dashboard/events' },
  { text: 'Users', icon: <PeopleIcon />, href: '/dashboard/users' },
  { text: 'Transactions', icon: <ReceiptIcon />, href: '/dashboard/orders' },
  { text: 'Settings', icon: <SettingsIcon />, href: '/dashboard/settings' },
];

function Sidebar() {
  const [openProducts, setOpenProducts] = useState(false);

  const handleProductsClick = () => {
    setOpenProducts((prev) => !prev);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => {
          if (item.text === 'Products') {
            return (
              <div key={item.text}>
                <ListItemButton onClick={handleProductsClick} sx={{ cursor: 'pointer' }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                  {openProducts ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openProducts} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children?.map((child) => (
                      <Link key={child.text} href={child.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <ListItemButton sx={{ pl: 4, cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
                          <ListItemText primary={child.text} />
                        </ListItemButton>
                      </Link>
                    ))}
                  </List>
                </Collapse>
              </div>
            );
          }
          return (
            item.href ? (
              <Link key={item.text} href={item.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItemButton sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </Link>
            ) : null
          );
        })}
      </List>
    </Drawer>
  );
}

export default Sidebar;