import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';

export function DialogCloseButton() {
  return (
    <DialogClose asChild>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 z-20"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>
    </DialogClose>
  );
}