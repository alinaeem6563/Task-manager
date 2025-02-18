import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { DatePickerWithPresets } from "@/Components/date-picker";
import { ChevronDown } from "lucide-react";
import ImageUploader from "@/Components/image-uploder";

export default function Task() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Task
                </h2>
            }
        >
            <Head title="Task" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-8 lg:p-10">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Create Task</CardTitle>
                                    <CardDescription>
                                        create new task
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Label htmlFor="title">Title</Label>
                                    <Input name="title" />
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea name="description" />
                                </CardContent>
                                <CardContent>
                                    <div className="flex">
                                        <div>
                                            <Label htmlFor="status">
                                                Status
                                            </Label>

                                            <div>
                                                <DropdownMenu name="status">
                                                    <DropdownMenuTrigger className="border rounded-lg w-full px-2 py-2">
                                                        <span className="flex ml-2 ">
                                                            Status
                                                            <ChevronDown className="ml-auto" />
                                                        </span>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuLabel>
                                                            Status
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem value="Pending">
                                                            Pending
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem value="Pending">
                                                            In-Progress
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem value="Pending">
                                                            Completed
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <Label
                                                htmlFor="dueDate"
                                                className="mr-2"
                                            >
                                                Due Date
                                            </Label>

                                            <div>
                                                <DatePickerWithPresets name="dueDate" />
                                            </div>
                                        </div>
                                        <div className="ml-auto text-center">
                                            <ImageUploader name="image" />
                                            <Label htmFor="image">
                                                Upload Image
                                            </Label>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full">Create</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
