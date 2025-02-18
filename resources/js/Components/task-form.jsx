"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Flag, Tag, Plus, CalendarIcon, Hourglass, X } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Link, useForm, usePage } from "@inertiajs/react";
import TimeIntervalInput from "./TimeIntervalInput";
import TagInput from "./TagInput";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function TaskForm({ handleCloseDialog }) {
    // Initialize form data using useForm (Inertia.js)
    const user = usePage().props.auth.user;
    const { data, setData, errors, post, processing, reset } = useForm({
        user_id: user.id,
        title: "",
        due_date: "",
        estimated_time: "0h0m",
        priority: "",
        tag: "",
        description: "",
        status: "pending",
        sub_task: [],
    });

    // State for dynamic checklist items
    const [checklist, setChecklist] = useState([]);

    // Add a new item to the checklist
    const addChecklistItem = (e) => {
        e.preventDefault();
        setData("sub_task", [...data.sub_task, ""]); //  Add empty item
    };

    // Update a specific checklist item
    const updateChecklistItem = (index, value) => {
        const updated = [...data.sub_task];
        updated[index] = value;
        setData("sub_task", updated); //
    };

    // Remove a specific checklist item
    const removeChecklistItem = (e, index) => {
        e.preventDefault(); // Prevent form submission
        setData(
            "sub_task",
            data.sub_task.filter((_, i) => i !== index)
        ); // Remove checklist item
    };

    // Handle form submission
const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validation
    let newErrors = {};

    if (!data.title.trim()) newErrors.title = "Title is required.";
    if (!data.due_date) newErrors.due_date = "Due date is required.";
    if (!data.priority) newErrors.priority = "Priority must be selected.";
    if (!data.description.trim())
        newErrors.description = "Description is required.";

    // If there are errors, update state and prevent form submission
    if (Object.keys(newErrors).length > 0) {
        toast.error("Please fill in all required fields.");
        return;
    }

    post("/task", {
        onSuccess: () => {
            resetForm();
            handleCloseDialog();
            toast.success("Task added successfully!");
        },
        onError: (errors) => {
            console.error("Failed to add task:", errors);
            toast.error("Failed to add task. Please try again.");
        },
    });
};

    // Function to reset form data
    const resetForm = () => {
        reset();
        setChecklist([]); // Reset checklist state if needed
    };

    // Handle input changes
    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    return (
        <section className="bg-white dark:bg-neutral-950 dark:text-white shadow-none container mx-auto px-4 rounded-lg  max-w-7xl w-full h-screen overflow-hidden">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="w-full flex mt-2 items-center justify-between">
                {/* Mark Completed Button */}
                {/* <Button
                    variant="primary"
                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-3xl"
                >
                    Mark Completed
                </Button> */}

                {/* Close Dialog Button */}
                <Button
                    variant="ghost"
                    onClick={handleCloseDialog}
                    className="text-gray-500 hover:text-gray-700 ml-auto"
                >
                    <X className="border-none hover:bg-transparent" />
                </Button>
            </div>

            <form
                onSubmit={handleSubmit}
                className=" mt-4 pr-5 pl-2 rounded-lg  max-w-full h-[calc(100vh-100px)] overflow-y-auto space-y-6 custom-scrollbar"
            >
              
                <div className="flex flex-wrap items-center gap-4">
                    {/* Title */}
                    <Label className="w-24">
                        Title<span className="text-red-600">*</span>
                    </Label>
                    <Input
                        required={true}
                        placeholder="Enter your task title here!"
                        className="text-2xl  w-full"
                        name="title"
                        value={data.title}
                        onChange={handleChange}
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm">{errors.title}</p>
                    )}
                    <Label className="w-24">
                        Due Date<span className="text-red-600">*</span>
                    </Label>
                    <CalendarIcon className="h-5 w-5 text-gray-500" />
                    <input
                        required={true}
                        type="date"
                        name="due_date"
                        className="flex-1 h-8  dark:border-none dark:bg-neutral-900 rounded-md p-2 
                        "
                        value={data.due_date}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]} // Prevents selecting past dates
                    />
                {errors.due_date && (
                    <p className="text-red-500 text-sm">{errors.due_date}</p>
                )}
                </div>

                {/* Estimated Time */}
                <div className="flex flex-wrap items-center gap-4">
                    <Label className="w-24">
                        Estimate<span className="text-red-600">*</span>
                    </Label>
                    <Hourglass className="h-5 w-5 text-gray-500" />
                    <TimeIntervalInput
                        required={true}
                        name="estimated_time"
                        value={data.estimated_time}
                        onChange={handleChange}
                        className="flex-1  "
                    />
                </div>

                {/* Priority */}
                <div className="flex flex-wrap items-center gap-4">
                    <Label className="w-24">
                        Priority <span className="text-red-600">*</span>
                    </Label>
                    <Flag className="h-5 w-5 text-gray-500" />
                    <select
                        required={true}
                        name="priority"
                        onChange={handleChange}
                        className="h-10 text-sm flex-1 dark:bg-neutral-900  bg-transparent dark:border-none active:ring-0 focus:ring-0 rounded-md p-2"
                    >
                        <option value="">Select Priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                        <option value="Normal">Normal</option>
                    </select>
                </div>

                {/* Tag */}
                <div className="flex flex-wrap items-center gap-4">
                    <Label className="w-24">Tag</Label>
                    <Tag className="h-5 w-5 text-gray-500" />
                    <TagInput
                        name="tag"
                        placeholder="Add custom tag"
                        className="flex-1 border-none"
                        value={data.tag}
                        onChange={(e) => setData("tag", e.target.value)}
                    />
                </div>

                {/* Description */}
                <div className="mt-6">
                    <Label>
                        Description<span className="text-red-600">*</span>
                    </Label>
                    <Textarea
                        required={true}
                        name="description"
                        placeholder="Add description"
                        value={data.description}
                        onChange={handleChange}
                        className="w-full"
                    />
                </div>

                {/* Checklist */}
                <div className="mt-6">
                    <Label>Checklist</Label>
                    {data.sub_task.map((item, index) => (
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
                                className="flex-1"
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
                    {errors.sub_task && (
                        <p className="text-red-500 text-sm">
                            {errors.sub_task}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 mt-6">
                    <Link
                        type="button"
                        variant="secondary"
                        className="px-2 py-2 w-full md:w-auto rounded-md   bg-neutral-700 text-white"
                        onClick={handleCloseDialog}
                    >
                        Cancel
                    </Link>
                    <Button
                        disabled={processing}
                        type="submit"
                        className="w-full md:w-auto"
                    >
                        {processing ? "Processing..." : "Continue"}
                    </Button>
                </div>
            </form>
        </section>
    );
}
