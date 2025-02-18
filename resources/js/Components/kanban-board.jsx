import * as React from "react";
import {
    MoreHorizontal,
    Calendar,
    Plus,
    Flag,
    Pin,
    Pen,
    Trash,
    ChevronRight,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/ui/menubar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TaskForm from "./task-form";
import { router, usePage } from "@inertiajs/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import EditTask from "@/Pages/Task/EditTask";

import { toast, Toaster } from "react-hot-toast";

export default function KanbanBoard() {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const { tasks } = usePage().props;
    const [selectedTask, setSelectedTask] = React.useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
    const [pinnedTaskIds, setPinnedTaskIds] = React.useState([]);

    const handleEditClick = (task) => {
        setSelectedTask(task);
        setIsEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
        setSelectedTask(null);
    };

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    function Pined(taskId) {
        if (pinnedTaskIds.includes(taskId)) {
            setPinnedTaskIds(pinnedTaskIds.filter((id) => id !== taskId));
        } else {
            setPinnedTaskIds([...pinnedTaskIds, taskId]);
        }
    }

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
                                router.delete(`/task/${id}`, {
                                    headers: { "X-CSRF-TOKEN": csrf_token },
                                    onSuccess: () => {
                                        toast.success(
                                            "Task deleted successfully!"
                                        );
                                        router.reload({ only: ["tasks"] });
                                    },
                                    onError: (errors) => {
                                        toast.error(
                                            `Failed to delete task: ${
                                                errors?.message ||
                                                "Unknown error"
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
                duration: 5000,
            }
        );
    };

    const handleDeleteAll = (status) => {
        toast(
            (t) => (
                <div className="p-4">
                    <p className="text-sm font-medium">
                        Are you sure you want to delete all tasks with status:{" "}
                        {status}?
                    </p>
                    <div className="mt-3 flex justify-end space-x-2">
                        <button
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => {
                                toast.dismiss(t.id);
                                router.delete(`/task/status/${status}`, {
                                    headers: { "X-CSRF-TOKEN": csrf_token },
                                    onSuccess: () => {
                                        toast.success(
                                            `All tasks with status "${status}" deleted successfully!`
                                        );
                                        router.reload({ only: ["tasks"] });
                                    },
                                    onError: (errors) => {
                                        toast.error(
                                            `Failed to delete tasks: ${
                                                errors?.message ||
                                                "Unknown error"
                                            }`
                                        );
                                    },
                                });
                            }}
                        >
                            Yes, Delete All
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
                duration: 5000,
            }
        );
    };

    const handleStatusUpdate = (taskId, newStatus) => {
        router.put(
            `/task/${taskId}`,
            { status: newStatus },
            {
                onSuccess: () => {
                    toast.success(`Task status updated to ${newStatus}!`);
                    router.reload({ only: ["tasks"] });
                },
                onError: (errors) => {
                    console.error("Failed to update task status:", errors);
                    toast.error(
                        "Failed to update task status. Please try again."
                    );
                },
            }
        );
    };

    const handleClickOutsideDialog = (e) => {
        // Close dialog only when clicking outside the form container
        if (e.target.id === "dialog-overlay") {
            handleCloseDialog();
        }
    };

    const statusColumns = [
        { id: 1, title: "Pending", status: "pending" },
        { id: 2, title: "In Progress", status: "InProgress" },
        { id: 3, title: "Review", status: "review" },
        { id: 4, title: "Completed", status: "completed" },
    ];

    return (
        <div className="py-2">
            <Toaster position="top-center dark" reverseOrder={false} />

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 overflow-x-auto">
                {statusColumns.map((column) => (
                    <div key={column.id} className="w-full">
                        <div className="border-t-2 border-blue-600 rounded flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold ">
                                    {column.title}
                                </h2>
                                {column.count !== undefined && (
                                    <span className="text-sm text-muted-foreground">
                                        2
                                    </span>
                                )}
                            </div>

                            <div>
                                {/* Button to Open Dialog */}
                                <Button
                                    className="h-4 w-4 "
                                    variant="ghost"
                                    onClick={handleOpenDialog}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>

                                {/* Dialog Box */}
                                {isDialogOpen && (
                                    <div
                                        id="dialog-overlay"
                                        className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
                                        onClick={handleClickOutsideDialog}
                                    >
                                        <div className="bg-transparent p-6 rounded-lg  w-full max-w-md">
                                            <TaskForm
                                                handleCloseDialog={
                                                    handleCloseDialog
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <span
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <DropdownMenu className="">
                                    <DropdownMenuTrigger className="">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleDeleteAll(column.status)
                                            }
                                        >
                                            <Trash className="h-3 w-3" />
                                            Delete All
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </span>
                        </div>

                        <div className="space-y-3">
                            {/* Loop through the tasks */}
                            {tasks[column.status]?.length > 0 ? (
                                tasks[column.status].map((task) => (
                                    <Card
                                        key={task.id}
                                        className={`bg-neutral-300 dark:bg-neutral-900 rounded-2xl overflow-hidden cursor-pointer ${
                                            pinnedTaskIds.includes(task.id)
                                                ? "border-blue-500"
                                                : ""
                                        }`}
                                    >
                                        <CardHeader className="p-3 pb-0 rounded-t-2xl bg-neutral-300 dark:bg-neutral-900">
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="flex flex-wrap gap-1">
                                                    <Badge
                                                        className={
                                                            task.priority ===
                                                            "High"
                                                                ? "bg-red-100 text-red-600"
                                                                : task.priority ===
                                                                  "Medium"
                                                                ? "bg-orange-100 text-orange-600"
                                                                : task.priority ===
                                                                  "Normal"
                                                                ? "bg-green-100 text-green-600"
                                                                : task.priority ===
                                                                  "Low"
                                                                ? "bg-green-100 text-green-600"
                                                                : ""
                                                        }
                                                    >
                                                        <Flag className="h-3 w-3 mr-1" />
                                                        {task.priority}
                                                    </Badge>
                                                    <Button
                                                        variant="outline"
                                                        className="text-clip text-blue-400 border-blue-400 bg-transparent rounded-2xl"
                                                        size="sm"
                                                    >
                                                        {task.tag}
                                                    </Button>
                                                </div>

                                                <Menubar className="bg-transparent border-none">
                                                    <MenubarMenu>
                                                        <MenubarTrigger className=" ">
                                                            <MoreHorizontal className="h-4 w-4  " />
                                                        </MenubarTrigger>
                                                        <MenubarContent>
                                                            <MenubarItem>
                                                                <DropdownMenu className="">
                                                                    <DropdownMenuTrigger className="flex">
                                                                        Status
                                                                        <ChevronRight className=" h-4 w-4" />
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent>
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                handleStatusUpdate(
                                                                                    task.id,
                                                                                    "InProgress",
                                                                                    (
                                                                                        newStatus
                                                                                    ) =>
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => ({
                                                                                                ...prev,
                                                                                                status: newStatus,
                                                                                            })
                                                                                        )
                                                                                )
                                                                            }
                                                                        >
                                                                            In
                                                                            Progress
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                handleStatusUpdate(
                                                                                    task.id,
                                                                                    "review",
                                                                                    (
                                                                                        newStatus
                                                                                    ) =>
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => ({
                                                                                                ...prev,
                                                                                                status: newStatus,
                                                                                            })
                                                                                        )
                                                                                )
                                                                            }
                                                                        >
                                                                            Review
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                handleStatusUpdate(
                                                                                    task.id,
                                                                                    "completed",
                                                                                    (
                                                                                        newStatus
                                                                                    ) =>
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => ({
                                                                                                ...prev,
                                                                                                status: newStatus,
                                                                                            })
                                                                                        )
                                                                                )
                                                                            }
                                                                        >
                                                                            Completed
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </MenubarItem>
                                                            <MenubarSeparator />

                                                            <MenubarItem>
                                                                <Pen className="h-3 w-3" />
                                                                <button
                                                                    onClick={() =>
                                                                        handleEditClick(
                                                                            task
                                                                        )
                                                                    }
                                                                >
                                                                    Edit
                                                                </button>
                                                            </MenubarItem>

                                                            <MenubarSeparator />
                                                            <MenubarItem
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        task.id
                                                                    )
                                                                }
                                                            >
                                                                <Trash className="h-3 w-3 " />
                                                                Delete
                                                            </MenubarItem>
                                                        </MenubarContent>
                                                    </MenubarMenu>
                                                </Menubar>
                                            </div>
                                            <h3 className="line-clamp-2 font-medium leading-none">
                                                {task.title}
                                            </h3>
                                        </CardHeader>
                                        <CardContent
                                            className="p-3 bg-neutral-300 dark:bg-neutral-900"
                                            onClick={() =>
                                                router.visit(`/task/${task.id}`)
                                            } //  Navigate to Task Details
                                        >
                                            <p className="line-clamp-2 text-sm text-muted-foreground">
                                                {task.description}
                                            </p>
                                        </CardContent>
                                        <CardFooter className="bg-neutral-300 dark:bg-neutral-900 items-center gap-2 mt-3 text-sm text-muted-foreground rounded-b-2xl">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(
                                                task.created_at
                                            ).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                timeZone: "UTC", // Ensures consistency
                                            })}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-4 w-4 ml-auto"
                                                onClick={() => Pined(task.id)}
                                            >
                                                <Pin
                                                    className={`h-3 w-3 ${
                                                        pinnedTaskIds.includes(
                                                            task.id
                                                        )
                                                            ? "fill-blue-500 text-blue-500"
                                                            : ""
                                                    }`}
                                                />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))
                            ) : (
                                <p>No tasks found.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Task Dialog */}
            {isEditDialogOpen && selectedTask && (
                <Dialog
                    open={isEditDialogOpen}
                    onOpenChange={handleCloseEditDialog}
                >
                    <DialogContent className="bg-transparent shadow-none p-6 border-none rounded-lg  w-full max-w-md">
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
    );
}
