import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="  flex min-h-screen flex-col items-center bg-neutral-300 dark:bg-neutral-950 pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <img
                        src="./images/logo-light.png"
                        alt="logo"
                        className="block h-14 w-auto dark:hidden "
                    />
                    <img
                        src="./images/logo-dark.png"
                        alt="logo"
                        className="hidden h-14 w-auto dark:block  "
                    />
                </Link>
            </div>

            <div className=" mt-6 w-full overflow-hidden bg-neutral-200 dark:bg-neutral-900 px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
