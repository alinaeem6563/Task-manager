"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function BottomBorderInput({ className, ...props }) {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
        <div className="relative">
            <input
                type="text"
                className={cn(
                    "w-full px-3 py-2 bg-transparent text-foreground",
                    "border-b-2 border-input focus:outline-none transition-colors duration-200",
                    isFocused && "border-primary",
                    className
                )}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
        </div>
    );
}

export default BottomBorderInput;
