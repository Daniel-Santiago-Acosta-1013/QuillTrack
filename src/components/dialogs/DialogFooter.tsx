import { DialogFooter as BaseDialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogFooter({ children, className }: DialogFooterProps) {
  return (
    <BaseDialogFooter className={cn(
      "flex-shrink-0 px-6 py-4 border-t bg-background sticky bottom-0 z-10",
      className
    )}>
      {children}
    </BaseDialogFooter>
  );
}