import { Outlet } from 'react-router-dom';
import PublicNavigation from './PublicNavigation';
import Footer from './Footer';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <PublicNavigation />
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
