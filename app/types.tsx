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
    preview?: string;
    childrenDisplay?: string;
}
export interface layoutProps {
    pathFragments: string[];
    source?: source;
    title?: string;
}
export interface calendarEvent {
    start: string;
    end: string;
    lunar?: boolean;
    hat?: string | (string | React.ReactElement)[];
    fx?: string;
}