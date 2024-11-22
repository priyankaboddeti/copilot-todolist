"use client" 
import { createContext, useContext, useState, ReactNode } from "react";
import { defaultTasks } from "../default-tasks";
import { Task, TaskStatus } from "../tasks.types";

import { useCopilotReadable,useCopilotAction } from "@copilotkit/react-core";
import ConfirmationDialog from "@/components/ui/confirmationDialog";

let nextId = defaultTasks.length + 1;

type TasksContextType = {
  tasks: Task[];
  addTask: (title: string) => void;
  setTaskStatus: (id: number, status: TaskStatus) => void;
  deleteTask: (id: number) => void;
};

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);

  useCopilotReadable({
    description: "The state of the todo list",
    value: JSON.stringify(tasks)
  });

  useCopilotAction({
    name: "addTask",
    description:"Add a new task to the list",
    parameters:[
      {
        name:"title",
        type:"string",
        description:"The Title of the task",
        required:true,
      },
    ],
    handler:({title})=>{
      addTask(title);
    }
  });

 // Update the deleteTask handler
 useCopilotAction({
  name: "deleteTask",
  description: "Delete a task from the list",
  parameters: [
    {
      name: "id",
      type: "number",
      description: "The id of the task",
      required: true,
    },
  ],
  handler:({id})=>{
    deleteTask(id);
  },
  render: ({args}) => {
    const { id } = args;
    const taskToDelete = tasks.find((task) => task.id === id);

    if (!taskToDelete) {
      console.error("Task not found for deletion:", id);
      return; // Handle potential error: task not found
    }
   
      return   <ConfirmationDialog
      title={taskToDelete.title}
      onConfirm={() => {
        setTasks(tasks.filter((task) => task.id !== id));
        console.log("Task deleted successfully:", id);
      }}
      onCancel={() => {
        console.log("Deletion canceled:", id);
      }}
    />
 
  },
});

  useCopilotAction({
    name: "setTaskStatus",
    description:"Sets the status of a task",
    parameters:[
      {
        name:"id",
        type:"number",
        description:"The id of the task",
        required:true,
      },
      {
        name:"status",
        type:"string",
        description:"The status of the task",
        enum: Object.values(TaskStatus),
        required:true,
      },
    ],
    handler:({id,status})=>{
      setTaskStatus(id,status);
    }
  });

  const addTask = (title: string) => {
    setTasks([...tasks, { id: nextId++, title, status: TaskStatus.todo }]);
  };

  const setTaskStatus = (id: number, status: TaskStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    const taskToDelete = tasks.find((task) => task.id === id);

    if (!taskToDelete) {
      console.error("Task not found for deletion:", id);
      return; // Handle potential error: task not found
    }

    // Render Confirmation Dialog
    return (
      <ConfirmationDialog
        title={taskToDelete.title}
        onConfirm={() => {
          setTasks(tasks.filter((task) => task.id !== id));
          console.log("Task deleted successfully:", id);
        }}
        onCancel={() => {
          console.log("Deletion canceled:", id);
        }}
      />
    );
  };
  
  return (
    <TasksContext.Provider value={{ tasks, addTask, setTaskStatus, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
};
