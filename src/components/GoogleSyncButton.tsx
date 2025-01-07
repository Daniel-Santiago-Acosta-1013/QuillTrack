import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { Cloud } from 'lucide-react';

interface GoogleSyncButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

export function GoogleSyncButton({ variant = 'outline', className }: GoogleSyncButtonProps) {
  const { enableSync, syncEnabled } = useStore();

  const login = useGoogleLogin({
    scope: 'openid email profile https://www.googleapis.com/auth/drive',
    prompt: 'consent',
    include_granted_scopes: true,
    onSuccess: async (response) => {
      try {
        await enableSync(response.access_token);
      } catch (error) {
        console.error('Sync failed:', error);
      }
    },
    onError: (errorResponse) => {
      console.error('Login failed:', errorResponse);
    },
  });

  if (syncEnabled) return null;

  return (
    <Button
      variant={variant}
      onClick={() => login()}
      className={className}
    >
      <Cloud className="h-4 w-4 mr-2" />
      Enable Google Sync
    </Button>
  );
}
