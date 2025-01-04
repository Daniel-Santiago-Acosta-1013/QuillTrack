import { Note } from '@/types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { BaseDialog } from './dialogs/BaseDialog';
import { DialogHeader as CustomDialogHeader } from './dialogs/DialogHeader';

interface NoteDetailDialogProps {
  note: Note;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function NoteDetailDialog({
  note,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: NoteDetailDialogProps) {
  return (
    <BaseDialog open={open} onOpenChange={onOpenChange}>
      <CustomDialogHeader title={note.title} />

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div 
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />

        <div className="mt-6 space-y-4">
          {note.labels.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {note.labels.map((label) => (
                <Badge key={label} variant="secondary">
                  {label}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="text-sm text-muted-foreground">
            <p>Created: {format(new Date(note.createdAt), 'PPpp')}</p>
            <p>Updated: {format(new Date(note.updatedAt), 'PPpp')}</p>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 px-6 py-4 border-t bg-background flex justify-end gap-2">
        <Button
          variant="ghost"
          onClick={() => {
            onEdit(note);
            onOpenChange(false);
          }}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            onDelete(note.id);
            onOpenChange(false);
          }}
        >
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </BaseDialog>
  );
}