// App.jsx
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/common/ErrorBoundary';
import LogoutModal from './components/common/LogoutModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Wrapper component to access auth context
const AppContent = () => {
  const { showLogoutModal, closeLogoutModal } = useAuth();
  
  return (
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <LogoutModal isOpen={showLogoutModal} onClose={closeLogoutModal} />
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
