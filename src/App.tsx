import { BrowserRouter as Router } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import { IntroProvider } from './context/IntroContext';
import AppRoutes from './routes';

function App() {
  return (
    <Router>
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
