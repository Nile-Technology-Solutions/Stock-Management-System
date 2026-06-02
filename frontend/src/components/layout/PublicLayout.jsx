import { Outlet } from 'react-router-dom';
import PublicNavigation from './PublicNavigation';
import Footer from './Footer';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/20 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-stone-950">
      <PublicNavigation />
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
