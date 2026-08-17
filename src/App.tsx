import { BrowserRouter as Router } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import { IntroProvider } from './context/IntroContext';
import ScrollToTop from './components/Layout/ScrollToTop';
import AppRoutes from './routes';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <IntroProvider>
          <div className="relative min-h-screen">
            <AppRoutes />
          </div>
        </IntroProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
