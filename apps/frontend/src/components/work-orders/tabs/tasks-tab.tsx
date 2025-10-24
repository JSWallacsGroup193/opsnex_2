import { useState } from "react"
import { Check, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import type { Task } from "@/types/view-models/work-order"

interface TasksTabProps {
  tasks: Task[]
  onToggleTask: (taskId: string) => void
  onAddTask: (taskName: string) => void
}

export function TasksTab({ tasks, onToggleTask, onAddTask }: TasksTabProps) {
  const [newTaskName, setNewTaskName] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const completedCount = tasks.filter((t) => t.completed).length
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0

  const handleAddTask = () => {
    if (newTaskName.trim()) {
      onAddTask(newTaskName.trim())
      setNewTaskName("")
      setIsAdding(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-100">Tasks & Checklist</h2>
          <span className="text-slate-400 text-sm">
            {completedCount} of {tasks.length} completed
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-slate-800 rounded-full h-2.5">
            <div
              className="bg-teal-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-slate-400 text-sm mt-2">{Math.round(progress)}% complete</p>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => onToggleTask(task.id)}
                className="data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
              />
              <span className={`flex-1 ${task.completed ? "line-through text-slate-500" : "text-slate-100"}`}>
                {task.name}
              </span>
              {task.completed && task.completedAt && (
                <span className="text-slate-500 text-xs">{new Date(task.completedAt).toLocaleDateString()}</span>
              )}
            </div>
          ))}

          {/* Add Task Form */}
          {isAdding ? (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800 border border-teal-500">
              <Input
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Enter task name..."
                className="bg-slate-900 border-slate-700 text-slate-100"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTask()
                  if (e.key === "Escape") setIsAdding(false)
                }}
                autoFocus
              />
              <Button size="sm" onClick={handleAddTask} className="bg-teal-500 hover:bg-teal-600 text-white">
                <Check className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsAdding(true)}
              className="w-full border-teal-500 text-teal-500 hover:bg-teal-500/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
