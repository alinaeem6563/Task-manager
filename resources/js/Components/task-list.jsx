import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight, Flag, Pin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "./ui/checkbox";
import TaskForm from "./task-form";
import { usePage } from "@inertiajs/react";
import { Toaster } from "react-hot-toast";

const TaskList = () => {
    const [pinnedTaskIds, setPinnedTaskIds] = useState([]);
    const [checkedSubTasks, setCheckedSubTasks] = useState({});

    const handleCheckboxClick = (event, subTaskId) => {
        event.stopPropagation(); // Prevents dropdown from closing
        event.preventDefault(); // Ensures checkbox behavior isn't overridden
        setCheckedSubTasks((prev) => ({
            ...prev,
            [subTaskId]: !prev[subTaskId],
        }));
    };

    const togglePin = (taskId) => {
        if (pinnedTaskIds.includes(taskId)) {
            setPinnedTaskIds(pinnedTaskIds.filter((id) => id !== taskId));
        } else {
            setPinnedTaskIds([...pinnedTaskIds, taskId]);
        }
    };
    const { tasks = {} } = usePage().props;

    const TaskSection = ({ title, isOpen, setIsOpen, count, tasks }) => (
        <TableRow>
            <TableCell colSpan={6} className="p-0 ">
                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                    <CollapsibleTrigger className="flex items-center gap-2 w-full p-4  rounded-lg">
                        {isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                        <span className="font-medium">{title}</span>
                        <Badge
                            variant="secondary"
                            className="ml-2 bg-blue-500 hover:bg-blue-500"
                        >
                            {count}
                        </Badge>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        {tasks.map((task) => (
                            <React.Fragment key={task.id}>
                                <Collapsible className="w-full">
                                    <TableRow
                                        className={`dark:hover:bg-muted/50 hover:bg-neutral-300 ml-4 ${
                                            pinnedTaskIds.includes(task.id)
                                                ? "border-blue-500 border rounded"
                                                : ""
                                        }`}
                                    >
                                        <CollapsibleTrigger className="flex  px-0 py-2 text-center sm:w-[150px] md:w-[180px] lg:w-[200px] xl:w-[220px]">
                                            {isOpen ? (
                                                <ChevronDown className="h-4 w-4 mr-2" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4 mr-2" />
                                            )}
                                            <span className="truncate">
                                                {task.title}
                                            </span>
                                        </CollapsibleTrigger>

                                        <TableCell className="px-0 py-2 sm:text-left md:text-center sm:w-[150px] md:w-[180px] lg:w-[200px] xl:w-[220px] truncate">
                                            {task.due_date || "-"}
                                        </TableCell>

                                        <TableCell className="px-0 py-2 sm:text-left md:text-center sm:w-[150px] md:w-[180px] lg:w-[200px] xl:w-[220px] truncate">
                                            <Badge
                                                variant={
                                                    task.priority === "High"
                                                        ? "destructive"
                                                        : "secondary"
                                                }
                                                className={
                                                    task.priority === "High"
                                                        ? "bg-red-100 text-red-600"
                                                        : task.priority ===
                                                          "Medium"
                                                        ? "bg-orange-100 text-orange-600"
                                                        : "bg-green-100 text-green-600"
                                                }
                                            >
                                                <Flag className="h-3 w-3 mr-1" />
                                                {task.priority}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="md:pr-12  py-2 sm:text-left md:text-center sm:w-[150px] md:w-[180px] lg:w-[200px] xl:w-[220px] truncate">
                                            {task.estimated_time || "-"}
                                        </TableCell>

                                        <TableCell className="md:pl-16 py-2 sm:text-left md:text-center sm:w-[150px] md:w-[180px] lg:w-[200px] xl:w-[220px] truncate">
                                            <Button
                                                variant="outline"
                                                className="text-blue-400 border-blue-400 bg-transparent rounded-2xl"
                                                size="sm"
                                            >
                                                {task.tag || "N/A"}
                                            </Button>
                                        </TableCell>

                                        <TableCell className="px-2 py-2 text-right w-[120px] min-w-[120px] max-w-[120px]">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-4 w-4 ml-auto"
                                                onClick={() =>
                                                    togglePin(task.id)
                                                }
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
                                        </TableCell>
                                    </TableRow>

                                    <CollapsibleContent>
                                        {Array.isArray(task.sub_tasks) &&
                                            task.sub_tasks.map(
                                                (subTask, subIndex) => (
                                                    <TableRow
                                                        key={`${task.id}-sub-${
                                                            subTask.id ||
                                                            subIndex
                                                        }`}
                                                        className="bg-muted/20"
                                                    >
                                                        <TableCell
                                                            colSpan={6}
                                                            className="pl-8 py-2 flex items-center"
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                        >
                                                            <Checkbox
                                                                checked={
                                                                    checkedSubTasks[
                                                                        subTask
                                                                            .id
                                                                    ] || false
                                                                }
                                                                onPointerDown={(
                                                                    e
                                                                ) =>
                                                                    e.stopPropagation()
                                                                } // Stops event before it reaches CollapsibleTrigger
                                                                onClick={(e) =>
                                                                    handleCheckboxClick(
                                                                        e,
                                                                        subTask.id
                                                                    )
                                                                }
                                                                className="mr-3 appearance-none checked:bg-blue-600 checked:border-blue-600"
                                                            />
                                                            <p
                                                                className={`truncate ${
                                                                    checkedSubTasks[
                                                                        subTask
                                                                            .id
                                                                    ]
                                                                        ? "line-through"
                                                                        : ""
                                                                }`}
                                                            >
                                                                {subTask.title}
                                                            </p>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                    </CollapsibleContent>
                                </Collapsible>
                            </React.Fragment>
                        ))}
                    </CollapsibleContent>
                </Collapsible>
            </TableCell>
        </TableRow>
    );

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const [isPendingOpen, setIsPendingOpen] = useState(true);
    const [isInProgressOpen, setIsInProgressOpen] = useState(false);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [isDoneOpen, setIsDoneOpen] = useState(false);

    const pendingTasks = tasks?.pending || [];
    const inProgressTasks = tasks?.InProgress || [];
    const reviewTasks = tasks?.review || [];
    const doneTasks = tasks?.completed || [];
    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    // Ref for dialog box
    const dialogRef = useRef(null);

    // Close dialog when clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dialogRef.current &&
                !dialogRef.current.contains(event.target)
            ) {
                setIsDialogOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="overflow-x-hidden">
            <Toaster position="top-center dark" reverseOrder={false} />
            <Table className=" table-auto text-sm w-full max-w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead className="px-4 py-2 text-left">
                            Task
                        </TableHead>
                        <TableHead className="px-4 py-2 text-right">
                            Due Date
                        </TableHead>
                        <TableHead className="px-4 pl-5 text-right">
                            Priority
                        </TableHead>
                        <TableHead className="px-4 text-center">
                            Time Estimate
                        </TableHead>
                        <TableHead className="px-4 py-2 text-right">
                            Tag
                        </TableHead>
                        <TableHead className="px-4 py-2 text-right">
                            Pinned
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TaskSection
                        title="Pending"
                        isOpen={isPendingOpen}
                        setIsOpen={setIsPendingOpen}
                        count={pendingTasks.length}
                        tasks={pendingTasks}
                    />
                    <TaskSection
                        title="In Progress"
                        isOpen={isInProgressOpen}
                        setIsOpen={setIsInProgressOpen}
                        count={inProgressTasks.length}
                        tasks={inProgressTasks}
                    />
                    <TaskSection
                        title="Review"
                        isOpen={isReviewOpen}
                        setIsOpen={setIsReviewOpen}
                        count={reviewTasks.length}
                        tasks={reviewTasks}
                    />
                    <TaskSection
                        title="Done"
                        isOpen={isDoneOpen}
                        setIsOpen={setIsDoneOpen}
                        count={doneTasks.length}
                        tasks={doneTasks}
                    />
                </TableBody>
            </Table>

            <div>
                {/* Button to Open Dialog */}
                <Button
                    className="mt-4 py-2 px-5 rounded-2xl "
                    variant=""
                    onClick={handleOpenDialog}
                >
                    <Plus className="h-4 w-4" />
                    Add new task
                </Button>

                {/* Dialog Box */}
                {isDialogOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <div
                            ref={dialogRef}
                            className=" p-6 rounded-lg shadow-lg w-full max-w-md"
                        >
                            <TaskForm handleCloseDialog={handleCloseDialog} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskList;
