import {
    ChevronDown,
    ClipboardList,
    Home,
    LogOut,
    Settings,
    User,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@inertiajs/react";
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "./ui/collapsible";
import DarkModeToggle from "./DarkModeToggle";
import NavLink from "./NavLink";
// Menu items.
const items = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "All Tasks",
        url: "/task",
        icon: ClipboardList,
    },
];

export function AppSidebar() {
    return (
        <Sidebar className="border-r-2">
            <SidebarContent className="bg-neutral-300 dark:bg-neutral-900">
                <SidebarGroup>
                    <SidebarGroupLabel>Task Manager</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <NavLink
                                            href={item.url}
                                            active={route().current(item.url)}
                                        >
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="bg-neutral-300 dark:bg-neutral-900  ">
                <Collapsible defaultOpen className="group/collapsible">
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="">
                            <Settings />
                            Settings
                            <ChevronDown className=" ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuButton asChild>
                            <NavLink
                                href="/profile"
                                active={route().current("/profile")}
                            >
                                <User />
                                <span>Profile</span>
                            </NavLink>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild>
                            <NavLink
                                href={route("logout")}
                                method="post"
                                active={route().current("logout")}
                            >
                                <LogOut />
                                <span>Log Out</span>
                            </NavLink>
                        </SidebarMenuButton>
                    </CollapsibleContent>
                </Collapsible>
                <DarkModeToggle />
            </SidebarFooter>
        </Sidebar>
    );
}
