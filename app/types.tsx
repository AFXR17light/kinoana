export interface FileOrDirectory {
    type: string;
    path: string;
    extension?: string;
    content?: string;
}

export interface LayoutProps {
    pathFragments: string[];
    fileOrDir: FileOrDirectory;
    title?: string;
}