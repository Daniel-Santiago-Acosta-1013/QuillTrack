import { ThemeProvider } from 'next-themes';
import { Layout } from '@/components/Layout';
import { WelcomePage } from '@/components/WelcomePage';
import { Dashboard } from '@/components/Dashboard';
import { useStore } from '@/store/useStore';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from '@/components/ui/toaster';

const GOOGLE_CLIENT_ID = '308332127351-2mn2le18or5ia36gmt5102a8s3h981m2.apps.googleusercontent.com';

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