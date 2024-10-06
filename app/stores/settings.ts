import { proxy } from "@lib/dom";

export const appSettings = proxy({
    theme: "light" as 'light' | 'dark',
    locale: "en" as 'en' | 'es',
    title: "My app",
})