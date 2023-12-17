declare class RestService {
    request(req: any, cb: any): any;
    get(url: string, headers?: any): Promise<any>;
    post(url: string, json: any, headers?: any): Promise<any>;
    put(url: string, json: any, headers?: any): Promise<any>;
    delete(url: string, headers?: any): Promise<any>;
}
export declare const restService: RestService;
export {};
