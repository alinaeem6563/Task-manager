"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Flag, CalendarIcon, Hourglass, X, Plus, Tag } from "lucide-react";
import { Label } from "@/components/ui/label";
import { router } from "@inertiajs/react";
import TimeIntervalInput from "@/components/TimeIntervalInput";
import TagInput from "@/components/TagInput";
import { useTask } from "@/hooks/useFormData";
import toast, { Toaster } from "react-hot-toast";

export default function EditTask({ task, closeDialog }) {
    const { formData, setFormData } = useTask(); // Use global state

    useEffect(() => {
        if (task) {
            setFormData({
                user_id: task.user_id,
                title: task.title,
                due_date: task.due_date || "",
                estimated_time: task.estimated_time || "0h0m",
                priority: task.priority || "",
                tag: task.tag || "",
                description: task.description || "",
                status: task.status || "pending",
                sub_task: task.sub_task || [],
            });
        }
    }, [task, setFormData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addChecklistItem = (e) => {
        e.preventDefault();
        setFormData({ ...formData, sub_task: [...formData.sub_task, ""] });
    };

    const updateChecklistItem = (index, value) => {
        const updated = [...formData.sub_task];
        updated[index] = value;
        setFormData({ ...formData, sub_task: updated });
    };

    const removeChecklistItem = (e, index) => {
        e.preventDefault();
        setFormData({
            ...formData,
            sub_task: formData.sub_task.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        router.put(`/task/${task.id}`, formData, {
            onSuccess: () => {
                closeDialog(); // Close after successful update
                toast.success("Task updated successfully!");
            },
            onError: (errors) => {
                console.error("Update failed:", errors);
                toast.error(
                    `Failed to update task: ${
                        errors?.message || "Unknown error"
                    }`
                );
            },
        });
    };

    const handleMarkCompleted = () => {
        const updatedData = { ...formData, status: "completed" };

        router.put(`/task/${task.id}`, updatedData, {
            onSuccess: () => {
                toast.success("Task marked as completed!");
                closeDialog();
            },
            onError: (errors) => {
                console.error("Failed to mark task as completed:", errors);
                toast.error(
                    `Failed to complete task: ${
                        errors?.message || "Unknown error"
                    }`
                );
            },
        });
    };

    return (
        <section
            className="bg-white dark:bg-neutral-950 dark:text-white shadow-none
         container mx-auto px-4 rounded-lg  max-w-7xl w-full h-screen overflow-hidden"
        >
            <Toaster position="top-center" reverseOrder={false} />
            <div className="w-full flex mt-2 items-center justify-between">
                <Button
                    variant="primary"
                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-3xl"
                    onClick={handleMarkCompleted}
                >
                    Mark Completed
                </Button>
                <Button
                    variant="ghost"
                    onClick={closeDialog}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <X className="border-none hover:bg-transparent" />
                </Button>
            </div>

            <form
                onSubmit={handleSubmit}
                className=" mt-4 pr-5 pl-2 rounded-lg max-w-full h-[calc(100vh-100px)] overflow-y-auto space-y-6 custom-scrollbar"
            >
                <div className="flex flex-wrap items-center gap-4">
                    <Label className="w-24">
                        Title<span className="text-red-600">*</span>
                    </Label>
                    <Input
                        placeholder="Task Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="text-2xl w-full  dark:border-none  "
                    />
                    <Label className="w-24">
                        Due Date<span className="text-red-600">*</span>
                    </Label>
                    <CalendarIcon className="h-5 w-5 text-gray-500" />
                    <input
                        type="date"
                        name="due_date"
                        className="flex-1 h-8 bg-transparent dark:bg-neutral-900 dark:border-none border rounded-md p-2"
                        value={formData.due_date}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <Label className="w-24">
                        Estimate<span className="text-red-600">*</span>
                    </Label>
                    <Hourglass className="h-5 w-5 text-gray-500 " />
                    <TimeIntervalInput
                        name="estimated_time"
                        value={formData.estimated_time}
                        onChange={handleChange}
                        className="flex-1"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <Label className="w-24">
                        Priority<span className="text-red-600">*</span>
                    </Label>
                    <Flag className="h-5 w-5 text-gray-500" />
                    <select
                        name="priority"
                        onChange={handleChange}
                        className="h-10 text-sm flex-1 dark:bg-neutral-900  bg-transparent dark:border-none rounded-md p-2"
                        value={formData.priority}
                    >
                        <option value="">Select Priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                        <option value="Normal">Normal</option>
                    </select>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <Label className="w-24">Tag</Label>
                    <Tag className="h-5 w-5 text-gray-500" />
                    <TagInput
                        name="tag"
                        placeholder="Add custom tag"
                        className="flex-1 "
                        value={formData.tag}
                        onChange={(e) =>
                            setFormData({ ...formData, tag: e.target.value })
                        }
                    />
                </div>

                <div className="mt-6">
                    <Label>
                        Description<span className="text-red-600">*</span>
                    </Label>
                    <Textarea
                        name="description"
                        placeholder="Add description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full"
                    />
                </div>

                <div className="mt-6">
                    <Label>Checklist</Label>
                    {formData.sub_task.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 mb-2"
                        >
                            <Input
                                value={item}
                                onChange={(e) =>
                                    updateChecklistItem(index, e.target.value)
                                }
                                placeholder={`Checklist item ${index + 1}`}
                                className="flex-1 "
                            />
                            <Button
                                variant="ghost"
                                onClick={(e) => removeChecklistItem(e, index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button
                        variant="secondary"
                        className="mt-2 h-8 mx-3"
                        onClick={addChecklistItem}
                    >
                        <Plus className="h-4 w-4" /> Add checklist item
                    </Button>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={closeDialog}
                        className="px-2 py-2 w-full md:w-auto rounded-md bg-neutral-700 text-white"
                    >
                        Cancel
                    </Button>
                    <Button type="submit" className="w-full md:w-auto">
                        Update Task
                    </Button>
                </div>
            </form>
        </section>
    );
}
