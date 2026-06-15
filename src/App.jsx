import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes/AppRoutes';
import { AccessibilityMenu } from './components/AccessibilityMenu';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <AccessibilityMenu />
    </AuthProvider>
  );
}

export default App;
