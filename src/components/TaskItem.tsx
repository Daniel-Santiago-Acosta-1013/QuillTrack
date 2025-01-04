import { Task } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Pencil, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { ConfirmDialog } from './dialogs/ConfirmDialog';
import { useToast } from '@/hooks/use-toast';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();

  const priorityColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
  };

  const handleDelete = () => {
    onDelete(task.id);
    toast({
      title: "Task deleted",
      description: "Your task has been deleted successfully.",
    });
    setShowDeleteConfirm(false);
  };

  const handleToggle = () => {
    onToggle(task.id);
    toast({
      title: task.completed ? "Task uncompleted" : "Task completed",
      description: `Task has been marked as ${task.completed ? 'uncompleted' : 'completed'}.`,
    });
  };

  return (
    <>
      <div className="flex items-center gap-4 p-4 border rounded-lg bg-card">
        <Checkbox
          checked={task.completed}
          onCheckedChange={handleToggle}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`${
                task.completed ? 'line-through text-muted-foreground' : ''
              }`}
            >
              {task.title}
            </span>
            <div
              className={`w-2 h-2 rounded-full ${priorityColors[task. priority]}`}
            />
          </div>
          {task.dueDate && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(task.dueDate), 'PP')}</span>
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {task.labels.map((label) => (
              <Badge key={label} variant="outline">
                {label}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setShowDeleteConfirm(true)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
      />
    </>
  );
}