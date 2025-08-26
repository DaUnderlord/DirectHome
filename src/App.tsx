import { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import AppRoutes from './routes';
import SplashScreen from './components/UI/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <Router>
      <AuthProvider>
        {/* Keep routes mounted for fast paint; overlay splash fades out */}
        <div className="relative min-h-screen">
          <AppRoutes />
          <SplashScreen show={showSplash} />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;