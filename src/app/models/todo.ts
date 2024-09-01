export interface TodoModel {
    id: number;
    title: string;
    completed: boolean;
    editing?: boolean;
}
// Generar un tipo string con 3 valores posibles, para filtrar por tipo
export type FilterType = 'all' | 'completed' | 'inProgress';