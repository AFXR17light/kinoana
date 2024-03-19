export interface source {
    path: string;
    extension?: string;
    content?: string;
    children?: source[];
}

export interface frontmatter {
    title: string;
    date?: string;
    hide?: number;
    childrenDisplay?: string;
}
export interface layoutProps {
    pathFragments: string[];
    source?: source;
    title?: string;
}