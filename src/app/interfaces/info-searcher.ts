export interface infoSeacher {
    AcreFechCre: string;
    AcreFechMod: string;
    AcreIPCre: string;
    AcreIPMod: string;
    AcreObjCre: string;
    AcreObjMod: string;
    AcreUsuCre: string;
    AcreUsuMod: string;
    AcreditadoIdenti: string;
    AcreditadoNom: string;
    AcreditadoNum: string;
    AcreditadoNumCuen: string;
    Acreditado_Id: string;
    AcreditadosEst: string;
    TipoPersona_Id: string;
}

export interface infoSeachersResponse {
    SDT_Acreditados: infoSeacher[];
}
