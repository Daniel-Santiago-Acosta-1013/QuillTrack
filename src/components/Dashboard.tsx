import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore } from '@/store/useStore';
import { NoteCard } from '@/components/NoteCard';
import { TaskItem } from '@/components/TaskItem';
import { Button } from '@/components/ui/button';
import { StickyNote, CheckSquare, Plus } from 'lucide-react';
import { useState } from 'react';
import { NoteDialog } from '@/components/dialogs/NoteDialog';
import { TaskDialog } from '@/components/dialogs/TaskDialog';
import { Note, Task } from '@/types';

export function Dashboard() {
  const { notes, tasks, deleteNote, toggleTaskComplete, deleteTask } = useStore();
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskDialogOpen(true);
  };

  return (
    <>
      <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard-Test</h2>
        <div className="flex gap-4">
          <Button 
            onClick={() => {
              setEditingNote(undefined);
              setNoteDialogOpen(true);
            }}
            className="flex-1 sm:flex-none"
          >
            <StickyNote className="mr-2 h-4 w-4 hidden sm:block" />
            <Plus className="mr-2 h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">New Note</span>
            <span className="sm:hidden">Note</span>
          </Button>
          <Button
            onClick={() => {
              setEditingTask(undefined);
              setTaskDialogOpen(true);
            }}
            className="flex-1 sm:flex-none"
          >
            <CheckSquare className="mr-2 h-4 w-4 hidden sm:block" />
            <Plus className="mr-2 h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">New Task</span>
            <span className="sm:hidden">Task</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="notes" className="space-y-4">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="notes" className="flex-1 sm:flex-none">Notes</TabsTrigger>
          <TabsTrigger value="tasks" className="flex-1 sm:flex-none">Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="notes">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {notes.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No notes yet. Create your first note!
              </div>
            ) : (
              notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={deleteNote}
                />
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="tasks">
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No tasks yet. Create your first task!
              </div>
            ) : (
              tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTaskComplete}
                  onEdit={handleEditTask}
                  onDelete={deleteTask}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      <NoteDialog
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
        note={editingNote}
      />
      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        task={editingTask}
      />
    </>
  );
}