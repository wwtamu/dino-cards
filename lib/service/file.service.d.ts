declare class FileService {
    read(path: string): any;
    readAll(path: string, endsWith?: string): any[];
    listDirectories(path: string): string[];
    exists(path: string): boolean;
    createDirectory(path: string): any;
    createFile(path: string, data?: any): any;
    save(path: string, data: any): any;
}
export declare const fileService: FileService;
export {};
