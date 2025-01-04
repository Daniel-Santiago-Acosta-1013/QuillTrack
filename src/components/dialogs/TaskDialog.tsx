import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task } from '@/types';
import { useStore } from '@/store/useStore';
import { BaseDialog } from './BaseDialog';
import { DialogHeader } from './DialogHeader';
import { DialogFooter } from './DialogFooter';
import { useToast } from '@/hooks/use-toast';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
}

export function TaskDialog({ open, onOpenChange, task }: TaskDialogProps) {
  const addTask = useStore((state) => state.addTask);
  const updateTask = useStore((state) => state.updateTask);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: task?.title || '',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    labels: task?.labels.join(', ') || '',
  });

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Required Field",
        description: "Please enter a title for your task.",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.priority) {
      toast({
        title: "Required Field",
        description: "Please select a priority level.",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.dueDate) {
      toast({
        title: "Required Field",
        description: "Please select a due date.",
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
      if (task) {
        updateTask(task.id, {
          ...formData,
          labels,
          dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
          updatedAt: new Date(),
        });
        toast({
          title: "Task updated",
          description: "Your task has been updated successfully.",
        });
      } else {
        addTask({
          id: crypto.randomUUID(),
          ...formData,
          completed: false,
          labels,
          dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Task);
        toast({
          title: "Task created",
          description: "Your task has been created successfully.",
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
        title={task ? 'Edit Task' : 'Create Task'}
        description={task ? 'Update your task details below.' : 'Add a new task to your list. All fields are required.'}
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
              placeholder="Enter task title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority *</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value as Task['priority'] })}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date *</Label>
            <Input
              type="date"
              id="dueDate"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="labels">Labels (comma-separated) *</Label>
            <Input
              id="labels"
              value={formData.labels}
              onChange={(e) => setFormData({ ...formData, labels: e.target.value })}
              placeholder="work, personal, urgent"
              required
              className="w-full"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit">{task ? 'Save Changes' : 'Create Task'}</Button>
        </DialogFooter>
      </form>
    </BaseDialog>
  );
}