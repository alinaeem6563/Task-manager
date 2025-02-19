import KanbanBoard from "@/Components/kanban-board";
import NavLink from "@/Components/NavLink";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { LucideAlignStartHorizontal, LucideListChecks } from "lucide-react";
import React from "react";

export default function GridView() {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className=" text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                        Tasks
                    </h2>
                    <div className=" flex items-center">
                        <div className="space-x-8 sm:-my-px sm:ms-10 sm:flex">
                            <NavLink
                                href={route("task.index")}
                                active={route().current("task.index")}
                                className={({ isActive }) =>
                                    `flex items-center space-x-2 ${
                                        isActive
                                            ? "text-blue-500 font-bold dark:text-blue-500"
                                            : "text-gray-500 hover:text-blue-400"
                                    }`
                                }
                            >
                                <LucideAlignStartHorizontal className="h-5 w-5" />
                                <span>Grid View</span>
                            </NavLink>
                        </div>

                        <div className="space-x-8 sm:-my-px sm:ms-10 sm:flex">
                            <NavLink
                                href={route("listView")}
                                active={route().current("listView")}
                                className={({ isActive }) =>
                                    `flex items-center space-x-2 ${
                                        isActive
                                            ? "text-blue-500 font-bold dark:text-blue-500"
                                            : "text-gray-500 hover:text-blue-400"
                                    }`
                                }
                            >
                                <LucideListChecks className="h-5 w-5" />
                                <span>List View</span>
                            </NavLink>
                        </div>
                        {/* filter */}
                        {/* <div className="">
                            <Select className="border-none">
                                <SelectTrigger className="border-none bg-transparent ml-auto">
                                    <ListFilter />
                                    <SelectValue placeholder="Filter" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        value="High"
                                        className="flex items-center gap-2"
                                    >
                                        <Flag className="text-red-600 h-4 w-4" />
                                        <span>High</span>
                                    </SelectItem>
                                    <SelectItem
                                        value="Medium"
                                        className="flex items-center gap-2"
                                    >
                                        <Flag className="text-yellow-600 h-4 w-4" />
                                        <span>Medium</span>
                                    </SelectItem>
                                    <SelectItem
                                        value="Low"
                                        className="flex items-center gap-2"
                                    >
                                        <Flag className="text-green-600 h-4 w-4" />
                                        <span>Low</span>
                                    </SelectItem>
                                    <SelectItem
                                        value="None"
                                        className="flex items-center gap-2"
                                    >
                                        <Ban className="text-gray-600 h-4 w-4" />
                                        <span>None</span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div> */}
                        {/* filter end */}
                    </div>
                </div>
            }
        >
            <Head title="Tasks" />
            <div className="py-12 bg-neutral-200 dark:bg-neutral-950">
                <div className=" max-w-7xl sm:px-8 lg:p-10 bg-neutral-200 dark:bg-neutral-950">
                    <div className=" overflow-hidden g-neutral-200 dark:bg-neutral-950 shadow-sm sm:rounded-lg">
                        <div className=" p-6 text-gray-900 dark:text-white bg-neutral-200 dark:bg-neutral-950">
                            <KanbanBoard />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
