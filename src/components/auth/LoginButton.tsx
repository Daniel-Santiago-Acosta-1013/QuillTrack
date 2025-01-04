import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { Chrome } from 'lucide-react';

export function LoginButton() {
  const { setUser, enableSync } = useStore();

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${response.access_token}` },
        }).then(res => res.json());

        setUser({
          id: userInfo.sub,
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
        });

        await enableSync(response.access_token);
      } catch (error) {
        console.error('Login failed:', error);
      }
    },
  });

  return (
    <Button 
      onClick={() => login()} 
      variant="outline"
      className="w-full h-16 space-x-4"
    >
      <Chrome className="h-5 w-5" />
      <div className="text-left">
        <div className="font-semibold">Continue with Google</div>
        <div className="text-xs text-muted-foreground">
          Enable cloud sync
        </div>
      </div>
    </Button>
  );
}