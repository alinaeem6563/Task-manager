import "../css/app.css";
import "./bootstrap";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { TaskProvider } from "./hooks/useFormData";


const appName = import.meta.env.VITE_APP_NAME || "Task Manager";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <TaskProvider>
                <App {...props} />
            </TaskProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
