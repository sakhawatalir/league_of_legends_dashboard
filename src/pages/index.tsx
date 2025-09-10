import React from 'react';
import DashboardShell from '../components/Layout/DashboardShell';
import LoLDashboard from '../components/Dashboard/LoLDashboard';

const Home: React.FC = () => {
  return (
    <DashboardShell>
      <LoLDashboard />
    </DashboardShell>
  );
};

export default Home;