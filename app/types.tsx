export interface FileSystem {
    type: string;
    path: string;
    extension?: string;
    content?: string;
}

export interface LayoutProps {
    pathFragments: string[];
    fileOrDir: FileSystem;
    title?: string;
}