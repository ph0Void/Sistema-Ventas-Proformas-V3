import { z } from 'zod';

/**
 * Estado de una acción asíncrona con tipado genérico basado en schema
 */
export interface ActionState<T extends z.ZodType = z.ZodType> {
    success: boolean;
    message?: string;
    fieldErrors?: Partial<Record<keyof z.infer<T>, string[]>>;
}

/**
 * Estado inicial de una acción asíncrona
 */
export const InitialActionState: ActionState = {
    success: false,
};

/**
 * Helper para crear un estado inicial tipado
 */
export function CreateInitialActionState<T extends z.ZodType>(): ActionState<T> {
    return {
        success: false,
    };
}