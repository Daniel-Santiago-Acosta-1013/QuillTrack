import { MoonIcon, SunIcon, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SyncStatus } from '@/components/SyncStatus';
import { GoogleSyncButton } from '@/components/GoogleSyncButton';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { WelcomePage } from '@/components/WelcomePage';

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useStore();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!user) {
    return <WelcomePage />;
  }

  const handleLogout = async () => {
    logout(); 
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between">
            <h1 className="text-2xl font-bold">QuillTrack</h1>
            <div className="flex items-center gap-4">
              <GoogleSyncButton className="hidden md:flex" />
              <SyncStatus />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {user && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                  <Avatar>
                    <AvatarImage src={user.picture} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                </>
              )}
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between">
            <h1 className="text-xl font-bold">QuillTrack</h1>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8">
                  <GoogleSyncButton variant="default" className="w-full" />
                  <Separator />
                  <SyncStatus />
                  <Button
                    variant="ghost"
                    className="justify-start w-full"
                    onClick={() => {
                      setTheme(theme === 'light' ? 'dark' : 'light');
                      setOpen(false);
                    }}
                  >
                    {theme === 'light' ? (
                      <>
                        <MoonIcon className="h-5 w-5 mr-2" />
                        Dark Mode
                      </>
                    ) : (
                      <>
                        <SunIcon className="h-5 w-5 mr-2" />
                        Light Mode
                      </>
                    )}
                  </Button>
                  {user && (
                    <>
                      <div className="flex items-center gap-3 px-3">
                        <Avatar>
                          <AvatarImage src={user.picture} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        className="justify-start w-full"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
