import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="dark text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="DarkBg py-12 bg-neutral-200 dark:bg-neutral-950">
                <div className=" mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8 bg-neutral-200 dark:bg-neutral-950">
                    <div className=" p-4 shadow sm:rounded-lg sm:p-8 bg-neutral-300 dark:bg-neutral-900">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className=" p-4 shadow sm:rounded-lg sm:p-8 bg-neutral-300 dark:bg-neutral-900">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className=" p-4 shadow sm:rounded-lg sm:p-8 bg-neutral-300 dark:bg-neutral-900">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
