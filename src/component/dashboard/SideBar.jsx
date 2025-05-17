import React, { useState } from 'react';
import { Layout, Menu, Drawer, Button, Grid, theme } from 'antd';
import {
  AppstoreOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  DashboardOutlined,
  MenuOutlined,
  ShopOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { useLocation, Link } from 'react-router-dom';

const { Sider } = Layout;
const { useBreakpoint } = Grid;

const menuItems = [
  { key: 'overview', icon: <DashboardOutlined />, label: 'Overview', path: '/dashboard' },
  { key: 'product', icon: <ShopOutlined />, label: 'Products', path: '/dashboard/product' },
  { key: 'sales', icon: <DollarOutlined />, label: 'Sales', path: '/dashboard/sales' },
  { key: 'analytics', icon: <BarChartOutlined />, label: 'Analytics', path: '/dashboard/analytics' },
];

const SideBar = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const isSmallScreen = screens.sm && !screens.md;
  const [drawerVisible, setDrawerVisible] = useState(false);
  const location = useLocation();
  const selectedKey = location.pathname.split('/')[2] || 'overview';
  const {
    token: { colorBgContainer, colorPrimary },
  } = theme.useToken();

  const renderMenu = (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      style={{ borderRight: 0 }}
      items={menuItems.map(item => ({
        ...item,
        icon: React.cloneElement(item.icon, { 
          className: 'text-base md:text-lg' 
        }),
        label: <Link to={item.path} className="text-sm md:text-base">{item.label}</Link>,
      }))}
    />
  );

  return (
    <>
      {isMobile ? (
        <>
          <div className="p-3 xs:p-4 shadow-sm bg-white fixed top-0 left-0 w-full z-50 flex items-center">
            <Button
              icon={<MenuOutlined className="text-base md:text-lg" />}
              onClick={() => setDrawerVisible(true)}
              type="text"
              className="w-10 h-10 xs:w-12 xs:h-12 flex items-center justify-center"
            />
            <h1 className="ml-2 text-lg xs:text-xl font-bold" style={{ color: colorPrimary }}>
              POS Dashboard
            </h1>
          </div>
          <Drawer
            title={
              <h2 className="flex items-center" style={{ color: colorPrimary }}>
                <ShopOutlined className="mr-2 text-xl" />
                <span className="text-lg md:text-xl font-bold">POS Dashboard</span>
              </h2>
            }
            placement="left"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            width={isSmallScreen ? 220 : 250}
            className="ant-drawer-mobile"
            bodyStyle={{ padding: 0 }}
            headerStyle={{ 
              borderBottom: '1px solid #f0f0f0',
              padding: '16px 20px'
            }}
          >
            {renderMenu}
          </Drawer>
        </>
      ) : (
        <Sider
          width={screens.lg ? 260 : 220}
          style={{
            background: colorBgContainer,
            borderRight: '1px solid #f0f0f0',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            boxShadow: '2px 0 8px 0 rgba(29, 35, 41, 0.05)'
          }}
          breakpoint="lg"
          collapsedWidth="0"
        >
          <div 
            className="text-lg lg:text-xl font-bold p-4 lg:p-6 border-b border-gray-200 flex items-center"
            style={{ color: colorPrimary }}
          >
            <ShopOutlined className="text-xl lg:text-2xl mr-2 lg:mr-3" />
            <span>POS Dashboard</span>
          </div>
          {renderMenu}
        </Sider>
      )}
    </>
  );
};

export default SideBar;