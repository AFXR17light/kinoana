export interface FileSystem {
    type: string;
    path: string;
    extension?: string;
    fileContent?: string;
    dirContent?: string[];
}

export interface LayoutProps {
    pathFragments: string[];
    fileOrDir: FileSystem;
    title?: string;
}