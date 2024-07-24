"use client";

import { TasksList } from "@/components/TasksList";
import { TasksProvider } from "@/lib/hooks/use-tasks";
import "@copilotkit/react-ui/styles.css";

export default function Home() {
  return (
    <TasksProvider>
      <TasksList />
    </TasksProvider>
  );
}
