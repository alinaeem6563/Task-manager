export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-medium dark:text-white text-gray-700 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
