export type TypeRoute = {
    name: string;
    path: string;
    icon?: React.ReactNode
    query?: string;
    children?: TypeRoute[];
}