import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  TagOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import styles from './AppLayout.module.css';

const { Header, Sider, Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Главная',
    },
    {
      key: '/posts',
      icon: <FileTextOutlined />,
      label: 'Посты',
    },
    {
      key: '/authors',
      icon: <UserOutlined />,
      label: 'Авторы',
    },
    {
      key: '/tags',
      icon: <TagOutlined />,
      label: 'Теги',
    },
  ];

  const handleMenuClick = (path: string) => {
    history.push(path);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const userMenu = {
    items: [
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Выйти',
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Layout className={styles.layout}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="dark"
        className={styles.sidebar}
      >
        <div className={styles.container}>{collapsed ? 'AP' : 'Админ-панель'}</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className={styles.btn}
          />
          <Dropdown menu={userMenu} placement="bottomRight">
            <Space className={styles.space}>
              <Avatar icon={<UserOutlined />} />
              <span>Администратор</span>
            </Space>
          </Dropdown>
        </Header>
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
