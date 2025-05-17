// pages/AdminDashboard/Dashboard.jsx
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import SideBar from '../../component/dashboard/SideBar';
import NavBar from '../../component/dashboard/NavBar';

const { Content } = Layout;

const Dashboard = () => {
  return (
    <Layout style={{ marginLeft:220, background: '#f0f2f5' }}>
     
      <Layout >
        <Content
        >
          <Outlet />
          
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
