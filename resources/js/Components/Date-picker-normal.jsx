"use client";

import * as React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerDemo({ value, onChange }) {
    const [date, setDate] = React.useState(value || null);

    React.useEffect(() => {
        setDate(value);
    }, [value]);

    const handleSelect = (selectedDate) => {
        setDate(selectedDate);
        onChange(selectedDate); // Directly pass selectedDate to onChange
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "hover:bg-transparent w-26 justify-start text-left font-normal border-none",
                        !date && "text-muted-foreground"
                    )}
                >
                    {date ? (
                        format(date, "PPP")
                    ) : (
                        <span className="text-sm">Due Date</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelect} // Handle selection without event object
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
