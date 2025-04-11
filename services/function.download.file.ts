import {DownloadType} from "@/types/interface.download"

export function download_file(type: DownloadType, path:string){
    const url = `/api/docs/download?path=${encodeURIComponent(path)}`;

    window.open(url, '_blank');
}