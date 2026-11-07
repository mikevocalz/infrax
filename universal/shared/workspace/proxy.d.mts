export function allowedProxyPath(path:string,method:string):boolean;
export function forwardWorkspace(request:Request,path:string,options?:{origin?:string;allowedHost?:string;fetchImpl?:typeof fetch}):Promise<Response>;
