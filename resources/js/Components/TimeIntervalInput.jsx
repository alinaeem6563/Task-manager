import React from "react";

const TimeIntervalInput = ({ value = "0h0m", onChange, name, className }) => {
    // Parse a time range value like "1h23m" into hours and minutes
    const parseTimeRange = (timeRange) => {
        const hoursMatch = timeRange?.match(/(\d+)h/);
        const minutesMatch = timeRange?.match(/(\d+)m/);
        return {
            hours: parseInt(hoursMatch?.[1] || 0),
            minutes: parseInt(minutesMatch?.[1] || 0),
        };
    };

    const { hours, minutes } = parseTimeRange(value);

    const handleHoursChange = (event) => {
        const newHours = Math.max(0, parseInt(event.target.value) || 0);
        const newValue = `${newHours}h${minutes}m`;
        onChange({ target: { name, value: newValue } });
    };

    const handleMinutesChange = (event) => {
        const newMinutes = Math.max(
            0,
            Math.min(59, parseInt(event.target.value) || 0)
        );
        const newValue = `${hours}h${newMinutes}m`;
        onChange({ target: { name, value: newValue } });
    };

    return (
        <div
            className={`time-interval-input flex items-center mb-4 gap-2 ${className}`}
        >
            <div>
                <label htmlFor="hours" className="block text-xs">
                    Hours:
                </label>
                <input
                    id="hours"
                    type="number"
                    value={hours}
                    onChange={handleHoursChange}
                    min="0"
                    className="dark:bg-neutral-900 dark:border-none border  rounded h-8 w-[100px]"
                />
            </div>
            <div>
                <label htmlFor="minutes" className="block text-xs">
                    Minutes:
                </label>
                <input
                    id="minutes"
                    type="number"
                    value={minutes}
                    onChange={handleMinutesChange}
                    min="0"
                    max="59"
                    className="dark:bg-neutral-900 dark:border-none border    rounded h-8 w-[65px]"
                />
            </div>
        </div>
    );
};

export default TimeIntervalInput;
