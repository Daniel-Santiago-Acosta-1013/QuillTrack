import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { LoginButton } from '@/components/auth/LoginButton';
import { Save } from 'lucide-react';

export function WelcomePage() {
  const setUser = useStore((state) => state.setUser);

  const continueWithoutGoogle = () => {
    setUser({ id: 'local-user', name: 'Local User', email: 'local@user' });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to QuillTrack</h1>
          <p className="text-muted-foreground">
            Choose how you want to store your notes and tasks
          </p>
        </div>

        <div className="grid gap-6 mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Choose your storage option
              </span>
            </div>
          </div>

          <Button
            onClick={continueWithoutGoogle}
            variant="outline"
            className="w-full h-16 space-x-4"
          >
            <Save className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Save Locally on This Device</div>
              <div className="text-xs text-muted-foreground">
                Data saved only on this device
              </div>
            </div>
          </Button>

          <div className="relative h-16">
            <LoginButton />
            <div className="text-xs text-muted-foreground mt-2 text-center">
              Sync across devices with Google Drive
            </div>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-8">
          You can change your storage method later in settings
        </p>
      </div>
    </div>
  );
}