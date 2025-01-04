import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Cloud, CloudOff } from 'lucide-react';
import { format } from 'date-fns';

export function SyncStatus() {
  const { syncEnabled, lastSync, isSyncing, user, disableSync } = useStore();

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      {syncEnabled ? (
        <>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={disableSync}
            className="text-sm text-muted-foreground"
          >
            <Cloud className="h-4 w-4 mr-1" />
            {isSyncing ? 'Syncing...' : 
              lastSync ? `Last sync: ${format(lastSync, 'HH:mm')}` : 'Synced'}
          </Button>
        </>
      ) : (
        <span className="text-sm text-muted-foreground flex items-center">
          <CloudOff className="h-4 w-4 mr-1" />
          Local Storage
        </span>
      )}
    </div>
  );
}