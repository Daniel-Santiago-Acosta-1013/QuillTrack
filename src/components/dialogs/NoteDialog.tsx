import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Note } from '@/types';
import { useStore } from '@/store/useStore';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import { BaseDialog } from './BaseDialog';
import { DialogHeader } from './DialogHeader';
import { DialogFooter } from './DialogFooter';
import { useToast } from '@/hooks/use-toast';

interface NoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note?: Note;
}

export function NoteDialog({ open, onOpenChange, note }: NoteDialogProps) {
  const addNote = useStore((state) => state.addNote);
  const updateNote = useStore((state) => state.updateNote);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: note?.title || '',
    content: note?.content || '',
    labels: note?.labels.join(', ') || '',
  });

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Required Field",
        description: "Please enter a title for your note.",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.content.trim()) {
      toast({
        title: "Required Field",
        description: "Please enter some content for your note.",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.labels.trim()) {
      toast({
        title: "Required Field",
        description: "Please add at least one label.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const labels = formData.labels.split(',').map((label) => label.trim()).filter(Boolean);
    
    try {
      if (note) {
        updateNote(note.id, {
          ...formData,
          labels,
          updatedAt: new Date(),
        });
        toast({
          title: "Note updated",
          description: "Your note has been updated successfully.",
        });
      } else {
        addNote({
          id: crypto.randomUUID(),
          ...formData,
          labels,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Note);
        toast({
          title: "Note created",
          description: "Your note has been created successfully.",
        });
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your request.",
        variant: "destructive",
      });
    }
  };

  return (
    <BaseDialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader
        title={note ? 'Edit Note' : 'Create Note'}
        description={note ? 'Update your note details below.' : 'Add a new note to your collection. All fields are required.'}
      />
      
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full"
              placeholder="Enter note title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <div className="min-h-[200px] border rounded-md">
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="Write your note content here..."
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="labels">Labels (comma-separated) *</Label>
            <Input
              id="labels"
              value={formData.labels}
              onChange={(e) => setFormData({ ...formData, labels: e.target.value })}
              placeholder="work, personal, ideas"
              required
              className="w-full"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit">{note ? 'Save Changes' : 'Create Note'}</Button>
        </DialogFooter>
      </form>
    </BaseDialog>
  );
}