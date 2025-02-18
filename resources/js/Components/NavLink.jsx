import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ${
                active
                    ? "border-blue-500 text-blue-500 dark:text-blue-400 dark:border-blue-500 focus:border-blue-500"
                    : "border-transparent text-neutral-950 dark:text-white hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 focus:border-blue-500 focus:text-blue-500"
            } ${className}`}
        >
            {children}
        </Link>
    );
}
