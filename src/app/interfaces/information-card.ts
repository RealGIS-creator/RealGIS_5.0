export interface InformationCard {
    AcreditadoIdenti?: string;
    AcreditadoNom?: string;
    AcreditadoNum?: string;
    AcreditadoNumCuen?: string;
    Acreditado_Id?: string;
    AcreditadosEst?: string;
    CuentaAcreditadoEst?: string;
    CuentaAcreditado_Id?: string;
    CuentasCis?: string;
    CuentasDiasMoraGave?: string;
    CuentasSalPro?: string;
    CuentasEst?: string;
    Cuentas_id?: string;
    Correos?: [
        {
            CorreoElec?: string;
            CorreoEst?: string;
            Correo_Id?: string;
            TipoCorreoCod?: string;
            TipoCorreoEst?: string;
            TipoCorreo_Id?: string;
        }
    ]
    Direcciones?: [
        {
            Direccion?: string;
            DireccionEst?: string;
            Direccion_Id?: string;
            DireccionesLugTra?: string;
            GeoDomicilioEst?: string;
            GeoDomicilioLati?: string;
            GeoDomicilioLongi?: string;
            GeoDomicilio_Id?: string;
            TipoDireccionCod?: string;
            TipoDireccionDesc?: string;
            TipoDireccionEst?: string;
            TipoDireccionNom?: string;
            TipoDireccion_Id?: string;
        }
    ],
    FincaDireccion?: string;
    FincaEst?: string;
    FincaFolio?: string;
    Finca_Id?: string;
    PropiedadEst?: string;
    Propiedad_Id?: string;
    Telefonos?: [
        {
            TelefonoEst?: string;
            TelefonoNum?: string;
            TelefonoPre?: string;
            Telefono_Id?: string;
            TipoTelefonoCod?: string;
            TipoTelefonoEst?: string;
            TipoTelefono_Id?: string;
        }
    ],
    TipoCorreoCod?: string;
    TipoCorreoEst?: string;
    TipoCorreo_Id?: string;
    TipoEstrategiaCod?: string;
    TipoEstrategiaEst?: string;
    TipoEstrategiaNom?: string;
    TipoEstrategia_Id?: string;
    TipoPersonaCod?: string;
    TipoPersonaEst?: string;
    TipoPersonaNom?: string;
    TipoPersona_Id?: string;
    TipoPredioCod?: string;
    TipoPredioEst?: string;
    TipoPredioNom?: string;
    TipoPredio_Id?: string;
    TipoProductoCod?: string;
    TipoProductoEst?: string;
    TipoProductoNom?: string;
    TipoProducto_Id?: string;
}

export interface InformationCardObject {
    SDT_TarjetaContacto: InformationCard[];
}