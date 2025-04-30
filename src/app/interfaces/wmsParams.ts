export interface WmsParams {
    workspace: string;
    layerName: string;
    format?: string;
    transparent?: boolean;
    version?: string;
    srs?: string;
    opacity?: number
}