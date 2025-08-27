// src/lib/api.ts
export default function getApiBaseUrl() {
    if (typeof window === "undefined") {
        return process.env.INTERNAL_API_URL!;
    }
    return process.env.NEXT_PUBLIC_API_URL!;
}
