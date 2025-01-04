import { DialogHeader as BaseDialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface DialogHeaderProps {
  title: string;
  description?: string;
}

export function DialogHeader({ title, description }: DialogHeaderProps) {
  return (
    <BaseDialogHeader className="flex-shrink-0 px-6 py-4 border-b bg-background sticky top-0 z-10">
      <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
      {description && (
        <DialogDescription className="mt-1.5">
          {description}
        </DialogDescription>
      )}
    </BaseDialogHeader>
  );
}