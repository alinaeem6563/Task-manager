import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { CalendarDays, CircleCheck, Clock, ListChecks } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import {
    MoreHorizontal,
    Calendar,
    Flag,
    Pin,
    ChevronRight,
} from "lucide-react";

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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import TaskForm from "@/Components/task-form";
import EditTask from "../Task/EditTask";
import toast, { Toaster } from "react-hot-toast";


export default function Dashboard() {
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedTask, setSelectedTask] = React.useState(null);
    const user = usePage().props.auth.user;
    const { tasks = {} } = usePage().props;
    const { totalTasks, completedTasks } = usePage().props;
    const [time, setTime] = useState(new Date());
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        weekday: "long", // "narrow", "short", or "long"
        month: "long", // "narrow", "short", or "long"
        day: "numeric",
    });
    const getGreeting = () => {
        const currentHour = new Date().getHours(); // Get the current hour (0-23)

        if (currentHour >= 5 && currentHour < 12) {
            return "Good Morning";
        } else if (currentHour >= 12 && currentHour < 17) {
            return "Good Afternoon";
        } else if (currentHour >= 17 && currentHour < 21) {
            return "Good Evening";
        } else {
            return "Good Night";
        }
    };
    const [pinnedTaskIds, setPinnedTaskIds] = React.useState([]);

    // Function to handle pinning/unpinning a task
    function Pined(taskId) {
        if (pinnedTaskIds.includes(taskId)) {
            // Unpin the task
            setPinnedTaskIds(pinnedTaskIds.filter((id) => id !== taskId));
        } else {
            // Pin the task
            setPinnedTaskIds([...pinnedTaskIds, taskId]);
        }
    }

    const handleStatusUpdate = (taskId, newStatus) => {
        router.put(
            `/task/${taskId}`,
            { status: newStatus },
            {
                onSuccess: () => {
                    toast.success(`Task status updated to ${newStatus}!`);
                },
                onError: (errors) => {
                    toast.error("Failed to update task status.");
                    console.error("Task update error:", errors);
                },
            }
        );
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
                duration: 5000, // Show for 5 seconds
            }
        );
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000); // Update every second

        return () => clearInterval(timer); // Cleanup on unmount
    }, []);
    return (
        <AuthenticatedLayout
            header={
                <>
                    <h2 className="dark:text-white text-xl font-semibold leading-tight text-gray-800 ">
                        Dashboard
                    </h2>
                    <p className="bodySm">
                        Your main WorkSpace to manage all boards.
                    </p>
                </>
            }
        >
            <Head title="Dashboard" />
            <div className="py-8 bg-neutral-200 dark:bg-neutral-950 min-h-svh  mx-auto max-w-7xl sm:px-2 lg:p-3 ">
                <section className=" rounded-lg h-1/3 overflow-hidden p-6 bg-neutral-300 dark:bg-neutral-900 dark:text-white text-gray-900 ">
                    <Toaster position="top-center" reverseOrder={false} />

                    <div className="flex justify-center ">
                        <div className="flex ">
                            <Clock className="mx-2" />
                            <p>{time.toLocaleTimeString()}</p>
                        </div>
                        <div className="flex mx-2">
                            <CalendarDays />
                            <p>{formattedDate}</p>
                        </div>
                    </div>
                    <div className="flex justify-center my-2">
                        <h1>{getGreeting()},</h1>
                        <h1 className="ml-2">{user.name}</h1>
                    </div>
                    <div className="mx-auto w-2/4 my-3">
                        <div className="rounded-3xl px-2 bg-neutral-200 dark:bg-neutral-800  flex justify-center py-3 w-full">
                            <p className="flex mr-2">
                                <ListChecks className="mr-2" />
                                {totalTasks} tasks total
                            </p>
                            <span>|</span>
                            <p className="flex ml-2">
                                <CircleCheck className="mr-2" />
                                {completedTasks} tasks completed
                            </p>
                        </div>
                    </div>
                </section>
                <section className="my-8 ">
                    <h3 className="titleLg ml-2">My board</h3>
                    {/* Dialog Box */}
                    {isDialogOpen && (
                        <div
                            id="dialog-overlay"
                            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
                            onClick={handleClickOutsideDialog}
                        >
                            <div className="bg-neutral- p-6 rounded-lg shadow-lg w-full max-w-md">
                                <TaskForm
                                    handleCloseDialog={handleCloseDialog}
                                />
                            </div>
                        </div>
                    )}
                    <div className=" ">
                        {/* <div className="">
                            <Card className=" bg-neutral-900 rounded-2xl">
                                <CardContent className="h-32 rounded-t-2xl bg-neutral-900 ">
                                    <p>Card Content</p>
                                </CardContent>
                                <CardFooter className="rounded-b-2xl bg-neutral-700">
                                    <p>Card Footer</p>
                                </CardFooter>
                            </Card>
                        </div> */}

                        {tasks && tasks.length > 0 ? (
                            <div className="grid grid-cols-4 sm:grid-cols-3 gap-3 ">
                                {tasks.map((task) => (
                                    <Card
                                        key={task.id}
                                        className={`dark:bg-neutral-800 bg-muted/40 overflow-hidden cursor-pointer ${
                                            pinnedTaskIds.includes(task.id)
                                                ? "border-blue-500"
                                                : ""
                                        }`}
                                    >
                                        <CardHeader className="p-3 pb-0 rounded-t-2xl bg-neutral-300 dark:bg-neutral-800">
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
                                                                      "Normal" ||
                                                                  task.priority ===
                                                                      "Low"
                                                                ? "bg-green-100 text-green-600"
                                                                : ""
                                                        }
                                                    >
                                                        <Flag className="h-3 w-3 mr-1" />
                                                        {task.priority}
                                                    </Badge>

                                                    {task.tag && (
                                                        <Button
                                                            variant="outline"
                                                            className="text-clip text-blue-400 border-blue-400 bg-transparent rounded-2xl"
                                                            size="sm"
                                                        >
                                                            {task.tag}
                                                        </Button>
                                                    )}
                                                </div>

                                                <Menubar className="bg-transparent border-none">
                                                    <MenubarMenu>
                                                        <MenubarTrigger
                                                            className="
                                                         "
                                                        >
                                                            <MoreHorizontal className="h-4 w-4 " />
                                                        </MenubarTrigger>
                                                        <MenubarContent>
                                                            <MenubarItem>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger className="flex">
                                                                        Status
                                                                        <ChevronRight className="h-4 w-4" />
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent>
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                handleStatusUpdate(
                                                                                    task.id,
                                                                                    "InProgress"
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
                                                                                    "review"
                                                                                )
                                                                            }
                                                                        >
                                                                            Review
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                handleStatusUpdate(
                                                                                    task.id,
                                                                                    "completed"
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
                                            className="p-3 "
                                            onClick={() =>
                                                router.visit(`/task/${task.id}`)
                                            }
                                        >
                                            <p className="line-clamp-2 text-sm text-muted-foreground">
                                                {task.description}
                                            </p>
                                        </CardContent>
                                        <CardFooter className=" items-center gap-2 mt-3 text-sm text-muted-foreground">
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
                                                            ? "fill-blue-500 text-blue-500 "
                                                            : ""
                                                    }`}
                                                />
                                            </Button>
                                        </CardFooter>
                                        <CardFooter
                                            className={`rounded-b-2xl ${
                                                task.status === "pending"
                                                    ? "bg-red-500"
                                                    : task.status ===
                                                      "InProgress"
                                                    ? "bg-yellow-500"
                                                    : task.status === "reviewed"
                                                    ? "bg-neutral-500"
                                                    : task.status ===
                                                      "completed"
                                                    ? "bg-green-500"
                                                    : "bg-gray-300"
                                            }`}
                                        >
                                            <p>{task.status}</p>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">
                                No Tasks Found
                            </p>
                        )}
                    </div>
                </section>
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
}
