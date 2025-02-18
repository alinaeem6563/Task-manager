"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function TagInput({ className, ...props }) {
    const [tag, setTag] = React.useState("");
    const [inputValue, setInputValue] = React.useState("");
    const [warning, setWarning] = React.useState("");

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setWarning("");
    };

    const handleInputKeyDown = (e) => {
        if (e.key === "Enter" && inputValue) {
            e.preventDefault();
            if (tag) {
                setWarning("Only one tag is allowed.");
            } else {
                setTag(inputValue.trim());
                setInputValue("");
            }
        }
    };

    const removeTag = () => {
        setTag("");
        setWarning("");
    };

    return (
        <div className={cn("flex flex-col gap-1", className)} {...props}>
            <div className="flex items-center gap-2 p-2 border-none h-8 rounded-md bg-transparent ">
                {tag && (
                    <Button
                        variant="secondary"
                        className="h-6 px-2 text-xs text-blue-500 border border-blue-500 bg-transparent rounded-xl"
                        onClick={removeTag}
                    >
                        {tag}
                        <X className="w-3 h-3 ml-2" />
                    </Button>
                )}
                {!tag && (
                    <Input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        className="h-8  flex-grow dark:border-none shadow-none focus-visible:ring-0"
                        placeholder="Add custom tag"
                    />
                )}
            </div>
            {warning && <p className="text-xs text-red-500">{warning}</p>}
        </div>
    );
}

export default TagInput;
