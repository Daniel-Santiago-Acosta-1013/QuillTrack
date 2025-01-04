import { Note } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { NoteDetailDialog } from './NoteDetailDialog';
import { ConfirmDialog } from './dialogs/ConfirmDialog';
import { useToast } from '@/hooks/use-toast';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();

  const handleDelete = () => {
    onDelete(note.id);
    toast({
      title: "Note deleted",
      description: "Your note has been deleted successfully.",
    });
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <Card className="h-[280px] relative group hover:shadow-lg transition-shadow flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 flex-shrink-0">
          <CardTitle className="text-lg font-bold truncate pr-2">
            {note.title}
          </CardTitle>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDetail(true)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(note)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0">
          <div className="relative flex-1 min-h-0">
            <div 
              className="absolute inset-0 overflow-hidden"
            >
              <div 
                className="h-full prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: note.content }}
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
            </div>
          </div>
          <div className="mt-4 space-y-2 relative z-10">
            {note.labels.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {note.labels.map((label) => (
                  <Badge key={label} variant="secondary" className="text-xs">
                    {label}
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Updated {format(new Date(note.updatedAt), 'PPp')}
            </p>
          </div>
        </CardContent>
      </Card>

      <NoteDetailDialog
        note={note}
        open={showDetail}
        onOpenChange={setShowDetail}
        onEdit={onEdit}
        onDelete={() => setShowDeleteConfirm(true)}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
      />
    </>
  );
}