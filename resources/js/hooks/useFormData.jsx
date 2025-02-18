"use client";
import { createContext, useContext, useState } from "react";

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [formData, setFormData] = useState({
        user_id: "",
        title: "",
        due_date: "",
        estimated_time: "0h0m",
        priority: "",
        tag: "",
        description: "",
        status: "pending",
        sub_task: [],
    });

    return (
        <TaskContext.Provider value={{ formData, setFormData }}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTask() {
    return useContext(TaskContext);
}
