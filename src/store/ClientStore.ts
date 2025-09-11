"use client";

import {z} from "zod";
import {ClientSchema} from "@/schema/ClientSchema";
import {create} from "zustand";
import {persist} from "zustand/middleware";

interface ClientStoreState {
    client: z.infer<typeof ClientSchema>;

    setClient: (client: z.infer<typeof ClientSchema>) => void;
    clearClient: () => void;
}

export const useClientStore = create<ClientStoreState>()(
    persist(
        (set, get) => ({
            client: { fullName: "", dni: 0, phone: 0, email: "" },

            clearClient(): void {
                set({
                    client: { fullName: "", dni: 0, phone: 0, email: "" },
                });
            },

            setClient(client: z.infer<typeof ClientSchema>): void {
                set({client: client});
            }

        }),
        {
            name: "client-storage",
        }
    )
)