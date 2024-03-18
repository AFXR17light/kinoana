export interface source {
    path: string;
    extension?: string;
    content?: string;
    children?: source[];
}

export interface layoutProps {
    pathFragments: string[];
    source?: source;
    title?: string;
}