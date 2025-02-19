import { AppSidebar } from "@/Components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/Components/ui/sidebar";
import { usePage } from "@inertiajs/react";
import { LucidePen} from "lucide-react";
import { useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import UpdateProfileInformation from "@/Pages/Profile/Partials/UpdateProfileInformationForm";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <SidebarProvider>
            <AppSidebar />
            <div
                className=" min-h-screen w-full bg-neutral-200
                dark:bg-neutral-950 "
                
            >
                {header && (
                    <header
                        className="dark:bg-neutral-900 flex flex-wrap  max-w-7xl  
                     border-b-white border-b-[1px] border-spacing-x-10 bg-neutral-300 shadow"
                    >
                        <SidebarTrigger />
                        <div className=" px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                        <div className=" ml-auto  px-4 py-6 sm:px-6 lg:px-8">
                            <Popover>
                                <PopoverTrigger className="flex bg-neutral-100 dark:bg-blue-500 dark:text-white rounded-2xl text-black py-2 px-4 text-center">
                                    <LucidePen className="h-4 w-4" />
                                    <p> Customize</p>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <UpdateProfileInformation />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </header>
                )}

                <main className="bg-neutral-200 dark:bg-neutral-950 dark:text-white">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}
