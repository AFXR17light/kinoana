export interface source {
    path: string;
    extension?: string;
    content?: React.ReactElement;
    frontmatter?: frontmatter;
    children?: source[];
}
export interface frontmatter {
    title?: string;
    date?: string;
    hide?: boolean;
    preview?: string;
    childrenDisplay?: string | string[];
    lang?: string;
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