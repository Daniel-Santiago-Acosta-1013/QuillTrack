import { ThemeProvider } from 'next-themes';
import { Layout } from '@/components/Layout';
import { WelcomePage } from '@/components/WelcomePage';
import { Dashboard } from '@/components/Dashboard';
import { useStore } from '@/store/useStore';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from '@/components/ui/toaster';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

function App() {
  const user = useStore((state) => state.user);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {!user ? (
          <WelcomePage />
        ) : (
          <Layout>
            <Dashboard />
          </Layout>
        )}
        <Toaster />
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;