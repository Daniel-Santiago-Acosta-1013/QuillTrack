import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { DialogCloseButton } from './DialogCloseButton';
import { VisuallyHidden } from '@/components/ui/visually-hidden';

interface BaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  title?: string; // Optional visible title
  accessibilityTitle?: string; // Required for screen readers
}

export function BaseDialog({ 
  open, 
  onOpenChange, 
  children, 
  className,
  title,
  accessibilityTitle = 'Dialog' // Default accessibility title
}: BaseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-[95vw] w-full h-[95vh] overflow-hidden flex flex-col",
        "sm:max-w-[85vw] md:max-w-[75vw] lg:max-w-3xl",
        "p-0",
        className
      )}>
        {title ? (
          <DialogTitle className="sr-only">{title}</DialogTitle>
        ) : (
          <VisuallyHidden>
            <DialogTitle>{accessibilityTitle}</DialogTitle>
          </VisuallyHidden>
        )}
        <DialogCloseButton />
        {children}
      </DialogContent>
    </Dialog>
  );
}