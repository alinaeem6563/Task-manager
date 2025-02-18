"use client";
import { Link, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    ArrowLeftCircle,
    Calendar,
    Clock,
    Tag,
    AlertCircle,
    CheckCircle2,
    FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TaskForm from "@/Components/task-form";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useTask } from "@/hooks/useFormData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import EditTask from "./EditTask";

const TaskDetails = () => {
  const { formData, setFormData } = useTask();
      const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [selectedTask, setSelectedTask] = useState(null);
      const user = usePage().props.auth.user;
      const { tasks = {} } = usePage().props;
    const { task } = usePage().props;

    if (!task) {
        return (
            <AuthenticatedLayout>
                <Card className="max-w-lg mx-auto mt-8">
                    <CardContent className="pt-6">
                        <p className="text-red-500 text-center">
                            Task not found.
                        </p>
                    </CardContent>
                </Card>
            </AuthenticatedLayout>
        );
    }

    
const handleMarkCompleted = () => {
    router.put(
        `/task/${task.id}`,
        { status: "completed" },
        {
            onSuccess: () => {
                toast.success("Task marked as completed!");
                router.reload();
            },
            onError: (errors) => {
                console.error("Failed to mark task as completed:", errors);
                toast.error(
                    `Failed to complete task: ${
                        errors?.message || "Unknown error"
                    }`
                );
            },
        }
    );
};

    const priorityColors = {
        low: "bg-green-100 text-green-800",
        medium: "bg-yellow-100 text-yellow-800",
        high: "bg-red-100 text-red-800",
    };

    const statusColors = {
        todo: "bg-gray-100 text-gray-800",
        "in-progress": "bg-blue-100 text-blue-800",
        done: "bg-purple-100 text-purple-800",
    };

    const handleEditClick = (task) => {
        setSelectedTask(task);
        setIsEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
        setSelectedTask(null);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };
    const handleClickOutsideDialog = (e) => {
        // Close dialog only when clicking outside the form container
        if (e.target.id === "dialog-overlay") {
            handleCloseDialog();
        }
    };
    const { csrf_token } = usePage().props;

 const handleDelete = (id) => {
     toast(
         (t) => (
             <div className="p-4">
                 <p className="text-sm font-medium">
                     Are you sure you want to delete this task?
                 </p>
                 <div className="mt-3 flex justify-end space-x-2">
                     <button
                         className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                         onClick={() => {
                             toast.dismiss(t.id);
                             router.delete(route("task.destroy", id), {
                                 preserveScroll: true,
                                 onSuccess: () => {
                                     toast.success(
                                         "Task deleted successfully!"
                                     );
                                     router.visit("/task"); // Redirect after delete
                                     router.reload();
                                 },
                                
                                 onError: (errors) => {
                                     toast.error(
                                         `Failed to delete task: ${
                                             errors?.message || "Unknown error"
                                         }`
                                     );
                                 },
                             });
                         }}
                     >
                         Yes, Delete
                     </button>
                     <button
                         className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
                         onClick={() => toast.dismiss(t.id)}
                     >
                         Cancel
                     </button>
                 </div>
             </div>
         ),
         {
             duration: 5000, // Show for 5 seconds
         }
     );
 };




    return (
        <AuthenticatedLayout
            header={
                <>
                    <h2 className="text-2xl font-semibold leading-tight text-gray-800 dark:text-white">
                        Task Details
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-white">
                        View and manage your task information.
                    </p>
                </>
            }
        >
            <div className="container mx-auto px-4 py-8 bg-neutral-200 dark:bg-neutral-950">
                <Toaster position="top-center" reverseOrder={false} />
                <Link
                    href="/task"
                    className="inline-flex items-center mb-6 text-blue-400 hover:text-blue-500 transition-colors"
                >
                    <ArrowLeftCircle className="mr-2" size={20} />
                    <span>Back to Tasks</span>
                </Link>
                {isDialogOpen && (
                    <div
                        id="dialog-overlay"
                        className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
                        onClick={handleClickOutsideDialog}
                    >
                        <div className="bg-transparent p-6 rounded-lg shadow-lg w-full max-w-md">
                            <TaskForm handleCloseDialog={handleCloseDialog} />
                        </div>
                    </div>
                )}
                <Card className="max-w-3xl mx-auto bg-neutral-300 dark:bg-neutral-900">
                    <CardHeader>
                        <CardTitle className="text-2xl">{task.title}</CardTitle>
                        <CardDescription>Task ID: {task.id}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <Calendar
                                        className="mr-2 text-gray-500"
                                        size={18}
                                    />
                                    <span className="text-sm text-gray-600">
                                        Due Date: {task.due_date}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <Clock
                                        className="mr-2 text-gray-500"
                                        size={18}
                                    />
                                    <span className="text-sm text-gray-600">
                                        Estimated Time: {task.estimated_time}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <AlertCircle
                                        className="mr-2 text-gray-500"
                                        size={18}
                                    />
                                    <span className="text-sm text-gray-600">
                                        Priority:
                                    </span>
                                    <Badge
                                        variant="secondary"
                                        className={`ml-2 ${
                                            priorityColors[
                                                task.priority.toLowerCase()
                                            ]
                                        }`}
                                    >
                                        {task.priority}
                                    </Badge>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <Tag
                                        className="mr-2 text-gray-500"
                                        size={18}
                                    />
                                    <span className="text-sm text-gray-600">
                                        Tag: {task.tag}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle2
                                        className="mr-2 text-gray-500"
                                        size={18}
                                    />
                                    <span className="text-sm text-gray-600">
                                        Status:
                                    </span>
                                    <Badge
                                        variant="secondary"
                                        className={`ml-2 ${
                                            statusColors[
                                                task.status.toLowerCase()
                                            ]
                                        }`}
                                    >
                                        {task.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <div>
                            <h3 className="text-lg font-semibold mb-2 flex items-center">
                                <FileText
                                    className="mr-2 text-gray-500"
                                    size={18}
                                />
                                Description
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                {task.description || "No description provided."}
                            </p>
                        </div>

                        {task.sub_tasks.length > 0 && (
                            <>
                                <Separator className="my-6" />
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">
                                        Sub-Tasks
                                    </h3>
                                    <ul className="space-y-2">
                                        {task.sub_tasks.map((sub) => (
                                            <li
                                                key={sub.id}
                                                className="flex items-center"
                                            >
                                                <CheckCircle2
                                                    className="mr-2 text-green-500"
                                                    size={16}
                                                />
                                                <span>{sub.title}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}

                        <div className="mt-8 flex justify-end space-x-4">
                            <Button
                                variant="outline"
                                onClick={() => handleEditClick(task)}
                            >
                                Edit Task
                            </Button>
                            <Button onClick={handleMarkCompleted}>
                                Complete Task
                            </Button>

                            <Button
                                variant="destructive"
                                onClick={() => handleDelete(task.id)}
                            >
                                Delete
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                {/* Edit Task Dialog */}
                {isEditDialogOpen && selectedTask && (
                    <Dialog
                        open={isEditDialogOpen}
                        onOpenChange={handleCloseEditDialog}
                    >
                        <DialogContent className="bg-transparent p-6 border-none rounded-lg shadow-lg w-full max-w-md">
                            <DialogTitle></DialogTitle>
                            <DialogHeader></DialogHeader>
                            <EditTask
                                task={selectedTask}
                                closeDialog={handleCloseEditDialog}
                                updateTaskStatus={(taskId, newStatus) => {
                                    setSelectedTask((prev) =>
                                        prev.id === taskId
                                            ? { ...prev, status: newStatus }
                                            : prev
                                    );
                                }}
                            />
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default TaskDetails;
