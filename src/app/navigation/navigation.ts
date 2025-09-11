import { FuseNavigation } from '@fuse/types';

export const navigationForAdmin: FuseNavigation[] = [
    {
        "id": "CUENTAS",
        "title": "Cuentas",
        "type": "item",
        "icon": "credit_card",
        "hidden": false,
        "url": "/apps/cuentas",
        "openInNewTab": false,
        "children": []
    },
    {
        "id": "MANTENIMIENTO",
        "title": "Mantenimiento",
        "type": "collapsable",
        "icon": "settings",
        "hidden": false,
        "url": null,
        "openInNewTab": false,
        "children": [
            {
                "id": "PARAMETROS",
                "title": "Parámetros",
                "type": "collapsable",
                "icon": null,
                "hidden": false,
                "url": null,
                "openInNewTab": false,
                "children": [
                    {
                        "id": "PARAMETROS-DEBITO",
                        "title": "Débito",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/mantenimiento/parametro/debito",
                        "openInNewTab": false,
                        "children": []
                    },
                    {
                        "id": "PARAMETROS-TIPO-CAMBIO",
                        "title": "Tipo de Cambio",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/mantenimiento/parametro/tipo-cambio",
                        "openInNewTab": false,
                        "children": []
                    }
                ]
            },
            {
                "id": "FERIADOS",
                "title": "Feriados",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/mantenimiento/feriado",
                "openInNewTab": false,
                "children": []
            },
            {
                "id": "PROVEEDOR",
                "title": "Proveedor",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/mantenimiento/proveedor",
                "openInNewTab": false,
                "children": []
            },
            {
                "id": "BANCO",
                "title": "Banco",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/mantenimiento/banco",
                "openInNewTab": false,
                "children": []
            },
            {
                "id": "TIPOCAMBIO",
                "title": "Cambio de Moneda",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/mantenimiento/cambiomoneda",
                "openInNewTab": false,
                "children": []
            }
        ]
    },
    {
        "id": "CONSULTAS",
        "title": "Consultas",
        "type": "collapsable",
        "icon": "tune",
        "hidden": false,
        "url": null,
        "openInNewTab": false,
        "children": [
            {
                "id": "TRANSACCIONESOBSERVADAS",
                "title": "Transacciones Observadas",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/consultas/transacciones-observadas",
                "openInNewTab": false,
                "children": []
            },
            {
                "id": "AUTORIZACIONES",
                "title": "Autorizaciones",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/consultas/autorizaciones",
                "openInNewTab": false,
                "children": []
            },
            {
                "id": "TIPOCAMBIO",
                "title": "Tipo de Cambio",
                "type": "collapsable",
                "icon": null,
                "hidden": false,
                "url": null,
                "openInNewTab": false,
                "children": [
                    {
                        "id": "TRANSACCIONES",
                        "title": "Transacciones",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/consultas/tipo-cambio/transacciones",
                        "openInNewTab": false,
                        "children": []
                    },
                    {
                        "id": "LOGTRANSACCIONES",
                        "title": "Log de Transacciones",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/consultas/tipo-cambio/log-transacciones",
                        "openInNewTab": false,
                        "children": []
                    },
                    {
                        "id": "PRELIQUIDACION",
                        "title": "Pre-Liquidacion",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/consultas/tipo-cambio/pre-liquidacion",
                        "openInNewTab": false,
                        "children": []
                    },
                    {
                        "id": "LIQUIDACIONES",
                        "title": "Liquidaciones",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/consultas/tipo-cambio/liquidaciones",
                        "openInNewTab": false,
                        "children": []
                    },
                    {
                        "id": "CONSULTAS",
                        "title": "Consultas",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/consultas/tipo-cambio/consultas",
                        "openInNewTab": false,
                        "children": []
                    },
                    {
                        "id": "OPERACIONESCAMPANIAS",
                        "title": "Operaciones por campaña",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/consultas/tipo-cambio/ope-campanias",
                        "openInNewTab": false,
                        "children": []
                    }
                ]
            },
            {
                "id": "TOKENIZACION",
                "title": "Tokenización",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/consultas/tokenizacion",
                "openInNewTab": false,
                "children": []
            },
            {
                "id": "SOLICITUDESAHORROSOH",
                "title": "Solicitudes Ahorros Oh!",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/consultas/solicitudes-ahorros-oh",
                "openInNewTab": false,
                "children": []
            }
        ]
    },
    {
        "id": "AJUSTESMASIVOS",
        "title": "Ajustes Masivos",
        "type": "collapsable",
        "icon": "tune",
        "hidden": false,
        "url": null,
        "openInNewTab": false,
        "children": [
            {
                "id": "BLOQUEOS",
                "title": "Bloqueos",
                "type": "collapsable",
                "icon": null,
                "hidden": false,
                "url": null,
                "openInNewTab": false,
                "children": [
                    {
                        "id": "EJECUCIONBLOQUEOS",
                        "title": "Ejecutar Bloqueos",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/ajuste-masivo/ejecucion-bloqueos",
                        "openInNewTab": false,
                        "children": []
                    },
                    {
                        "id": "HISTORIAL",
                        "title": "Historial Bloqueos",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/ajuste-masivo/historial-bloqueos",
                        "openInNewTab": false,
                        "children": []
                    }
                ]
            },
            {
                "id": "SOLICITUDESOH",
                "title": "Solicitudes Oh!",
                "type": "collapsable",
                "icon": null,
                "hidden": false,
                "url": null,
                "openInNewTab": false,
                "children": [
                    {
                        "id": "EJECUCIONSOLICITUDES",
                        "title": "Ejecutar Solicitudes",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/ajuste-masivo/ejecucion-solicitudesoh",
                        "openInNewTab": false,
                        "children": []
                    },
                    {
                        "id": "HISTORIALSOLICITUDES",
                        "title": "Historial Solicitudes",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/ajuste-masivo/historial-solicitudesoh",
                        "openInNewTab": false,
                        "children": []
                    }
                ]
            }
        ]
    }
];

export const navigationForCustomService: FuseNavigation[] = [
    {
        "id": "CUENTAS",
        "title": "Cuentas",
        "type": "item",
        "icon": "credit_card",
        "hidden": false,
        "url": "/apps/cuentas",
        "openInNewTab": false,
        "children": []
    },
    {
        "id": "CONSULTAS",
        "title": "Consultas",
        "type": "collapsable",
        "icon": "tune",
        "hidden": false,
        "url": null,
        "openInNewTab": false,
        "children": [
            {
                "id": "AUTORIZACIONES",
                "title": "Autorizaciones",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/consultas/autorizaciones",
                "openInNewTab": false,
                "children": []
            }

        ]
    }
];

export const navigationForCustomServiceTD: FuseNavigation[] = [
    {
        "id": "CUENTAS",
        "title": "Cuentas",
        "type": "item",
        "icon": "credit_card",
        "hidden": false,
        "url": "/apps/cuentas",
        "openInNewTab": false,
        "children": []
    },
    {
        "id": "CONSULTAS",
        "title": "Consultas",
        "type": "collapsable",
        "icon": "tune",
        "hidden": false,
        "url": null,
        "openInNewTab": false,
        "children": [
            {
                "id": "TRANSACCIONESOBSERVADAS",
                "title": "Transacciones Observadas",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/consultas/transacciones-observadas",
                "openInNewTab": false,
                "children": []
            },
            {
                "id": "AUTORIZACIONES",
                "title": "Autorizaciones",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/consultas/autorizaciones",
                "openInNewTab": false,
                "children": []
            }
        ]
    }
];

export const navigationForQuery: FuseNavigation[] = [
    {
        "id": "CUENTAS",
        "title": "Cuentas",
        "type": "item",
        "icon": "credit_card",
        "hidden": false,
        "url": "/apps/cuentas",
        "openInNewTab": false,
        "children": []
    },
    {
        "id": "CONSULTAS",
        "title": "Consultas",
        "type": "collapsable",
        "icon": "tune",
        "hidden": false,
        "url": null,
        "openInNewTab": false,
        "children": [
            {
                "id": "TRANSACCIONESOBSERVADAS",
                "title": "Transacciones Observadas",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/consultas/transacciones-observadas",
                "openInNewTab": false,
                "children": []
            },
            {
                "id": "AUTORIZACIONES",
                "title": "Autorizaciones",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/consultas/autorizaciones",
                "openInNewTab": false,
                "children": []
            }
        ]
    }
];

export const navigationForFraud: FuseNavigation[] = [
    {
        "id": "CUENTAS",
        "title": "Cuentas",
        "type": "item",
        "icon": "credit_card",
        "hidden": false,
        "url": "/apps/cuentas",
        "openInNewTab": false,
        "children": []
    },
    {
        "id": "CONSULTAS",
        "title": "Consultas",
        "type": "collapsable",
        "icon": "tune",
        "hidden": false,
        "url": null,
        "openInNewTab": false,
        "children": [
            {
                "id": "TRANSACCIONESOBSERVADAS",
                "title": "Transacciones Observadas",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/consultas/transacciones-observadas",
                "openInNewTab": false,
                "children": []
            },
            {
                "id": "AUTORIZACIONES",
                "title": "Autorizaciones",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/consultas/autorizaciones",
                "openInNewTab": false,
                "children": []
            },
            {
                "id": "TOKENIZACION",
                "title": "Tokenización",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/consultas/tokenizacion",
                "openInNewTab": false,
                "children": []
            }
        ]
    },
    {
        "id": "AJUSTESMASIVOS",
        "title": "Ajustes Masivos",
        "type": "collapsable",
        "icon": "tune",
        "hidden": false,
        "url": null,
        "openInNewTab": false,
        "children": [
            {
                "id": "BLOQUEOS",
                "title": "Bloqueos",
                "type": "collapsable",
                "icon": null,
                "hidden": false,
                "url": null,
                "openInNewTab": false,
                "children": [
                    {
                        "id": "EJECUCIONBLOQUEOS",
                        "title": "Ejecutar Bloqueos",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/ajuste-masivo/ejecucion-bloqueos",
                        "openInNewTab": false,
                        "children": []
                    },
                    {
                        "id": "HISTORIAL",
                        "title": "Historial Bloqueos",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/ajuste-masivo/historial-bloqueos",
                        "openInNewTab": false,
                        "children": []
                    }
                ]
            }
        ]
    }
];

export const navigationForAccountingOperation: FuseNavigation[] = [
    {
        "id": "CUENTAS",
        "title": "Cuentas",
        "type": "item",
        "icon": "credit_card",
        "hidden": false,
        "url": "/apps/cuentas",
        "openInNewTab": false,
        "children": []
    },
    {
        "id": "CONSULTAS",
        "title": "Consultas",
        "type": "collapsable",
        "icon": "tune",
        "hidden": false,
        "url": null,
        "openInNewTab": false,
        "children": [
            {
                "id": "TRANSACCIONESOBSERVADAS",
                "title": "Transacciones Observadas",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/consultas/transacciones-observadas",
                "openInNewTab": false,
                "children": []
            },
            {
                "id": "AUTORIZACIONES",
                "title": "Autorizaciones",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/consultas/autorizaciones",
                "openInNewTab": false,
                "children": []
            },
            {
                "id": "TOKENIZACION",
                "title": "Tokenización",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/consultas/tokenizacion",
                "openInNewTab": false,
                "children": []
            }
        ]
    }
];

export const navigationForTesoreria: FuseNavigation[] = [
    {
        "id": "CONSULTAS",
        "title": "Consultas",
        "type": "collapsable",
        "icon": "tune",
        "hidden": false,
        "url": null,
        "openInNewTab": false,
        "children": [
            {
                "id": "TIPOCAMBIO",
                "title": "Tipo de Cambio",
                "type": "collapsable",
                "icon": null,
                "hidden": false,
                "url": null,
                "openInNewTab": false,
                "children": [
                    {
                        "id": "TRANSACCIONES",
                        "title": "Transacciones",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/consultas/tipo-cambio/transacciones",
                        "openInNewTab": false,
                        "children": []
                    },
                ]
            }
        ]
    }
];

export const navigationForPassiveOperating: FuseNavigation[] = [
    {
        "id": "CUENTAS",
        "title": "Cuentas",
        "type": "item",
        "icon": "credit_card",
        "hidden": false,
        "url": "/apps/cuentas",
        "openInNewTab": false,
        "children": []
    },
    {
        "id": "MANTENIMIENTO",
        "title": "Mantenimiento",
        "type": "collapsable",
        "icon": "settings",
        "hidden": false,
        "url": null,
        "openInNewTab": false,
        "children": [
            {
                "id": "PARAMETROS",
                "title": "Parámetros",
                "type": "collapsable",
                "icon": null,
                "hidden": false,
                "url": null,
                "openInNewTab": false,
                "children": [
                    {
                        "id": "PARAMETROS-TIPO-CAMBIO",
                        "title": "Tipo de Cambio",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/mantenimiento/parametro/tipo-cambio",
                        "openInNewTab": false,
                        "children": []
                    }
                ]
            },
            {
                "id": "FERIADOS",
                "title": "Feriados",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/mantenimiento/feriado",
                "openInNewTab": false,
                "children": []
            },
            {
                "id": "PROVEEDOR",
                "title": "Proveedor",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/mantenimiento/proveedor",
                "openInNewTab": false,
                "children": []
            },
            {
                "id": "BANCO",
                "title": "Banco",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/mantenimiento/banco",
                "openInNewTab": false,
                "children": []
            }
        ]
    },
    {
        "id": "CONSULTAS",
        "title": "Consultas",
        "type": "collapsable",
        "icon": "tune",
        "hidden": false,
        "url": null,
        "openInNewTab": false,
        "children": [
            {
                "id": "TRANSACCIONESOBSERVADAS",
                "title": "Transacciones Observadas",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/consultas/transacciones-observadas",
                "openInNewTab": false,
                "children": []
            },
            {
                "id": "AUTORIZACIONES",
                "title": "Autorizaciones",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/consultas/autorizaciones",
                "openInNewTab": false,
                "children": []
            },
            {
                "id": "TIPOCAMBIO",
                "title": "Tipo de Cambio",
                "type": "collapsable",
                "icon": null,
                "hidden": false,
                "url": null,
                "openInNewTab": false,
                "children": [
                    {
                        "id": "TRANSACCIONES",
                        "title": "Transacciones",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/consultas/tipo-cambio/transacciones",
                        "openInNewTab": false,
                        "children": []
                    },
                    {
                        "id": "LOGTRANSACCIONES",
                        "title": "Log de Transacciones",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/consultas/tipo-cambio/log-transacciones",
                        "openInNewTab": false,
                        "children": []
                    },
                    {
                        "id": "PRELIQUIDACION",
                        "title": "Pre-Liquidacion",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/consultas/tipo-cambio/pre-liquidacion",
                        "openInNewTab": false,
                        "children": []
                    },
                    {
                        "id": "LIQUIDACIONES",
                        "title": "Liquidaciones",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/consultas/tipo-cambio/liquidaciones",
                        "openInNewTab": false,
                        "children": []
                    },
                    {
                        "id": "CONSULTAS",
                        "title": "Consultas",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/consultas/tipo-cambio/consultas",
                        "openInNewTab": false,
                        "children": []
                    }
                ]
            }
        ]
    }
];

export const navigationForPlaft: FuseNavigation[] = [
    {
        "id": "CUENTAS",
        "title": "Cuentas",
        "type": "item",
        "icon": "credit_card",
        "hidden": false,
        "url": "/apps/cuentas",
        "openInNewTab": false,
        "children": []
    },
    {
        "id": "CONSULTAS",
        "title": "Consultas",
        "type": "collapsable",
        "icon": "tune",
        "hidden": false,
        "url": null,
        "openInNewTab": false,
        "children": [
            {
                "id": "TRANSACCIONESOBSERVADAS",
                "title": "Transacciones Observadas",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/consultas/transacciones-observadas",
                "openInNewTab": false,
                "children": []
            },
            {
                "id": "AUTORIZACIONES",
                "title": "Autorizaciones",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/consultas/autorizaciones",
                "openInNewTab": false,
                "children": []
            },
            {
                "id": "TIPOCAMBIO",
                "title": "Tipo de Cambio",
                "type": "collapsable",
                "icon": null,
                "hidden": false,
                "url": null,
                "openInNewTab": false,
                "children": [
                    {
                        "id": "TRANSACCIONES",
                        "title": "Transacciones",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/consultas/tipo-cambio/transacciones",
                        "openInNewTab": false,
                        "children": []
                    },
                ]
            }
        ]
    }
];

export const navigationForTi: FuseNavigation[] = [
    {
        "id": "MANTENIMIENTO",
        "title": "Mantenimiento",
        "type": "collapsable",
        "icon": "settings",
        "hidden": false,
        "url": null,
        "openInNewTab": false,
        "children": [
            {
                "id": "PARAMETROS",
                "title": "Parámetros",
                "type": "collapsable",
                "icon": null,
                "hidden": false,
                "url": null,
                "openInNewTab": false,
                "children": [
                    {
                        "id": "PARAMETROS-DEBITO",
                        "title": "Débito",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/mantenimiento/parametro/debito",
                        "openInNewTab": false,
                        "children": []
                    },
                    {
                        "id": "PARAMETROS-TIPO-CAMBIO",
                        "title": "Tipo de Cambio",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/mantenimiento/parametro/tipo-cambio",
                        "openInNewTab": false,
                        "children": []
                    }
                ]
            }
        ]
    }
];

export const navigationForSalesManager: FuseNavigation[] = [
    {
        "id": "CUENTAS",
        "title": "Cuentas",
        "type": "item",
        "icon": "credit_card",
        "hidden": false,
        "url": "/apps/cuentas",
        "openInNewTab": false,
        "children": []
    },
    {
        "id": "CONSULTAS",
        "title": "Consultas",
        "type": "collapsable",
        "icon": "tune",
        "hidden": false,
        "url": null,
        "openInNewTab": false,
        "children": [
            {
                "id": "SOLICITUDESAHORROSOH",
                "title": "Solicitudes Ahorros Oh!",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/consultas/solicitudes-ahorros-oh",
                "openInNewTab": false,
                "children": []
            }
        ]
    },
    {
        "id": "AJUSTESMASIVOS",
        "title": "Ajustes Masivos",
        "type": "collapsable",
        "icon": "tune",
        "hidden": false,
        "url": null,
        "openInNewTab": false,
        "children": [
            {
                "id": "SOLICITUDESOH",
                "title": "Solicitudes Oh!",
                "type": "collapsable",
                "icon": null,
                "hidden": false,
                "url": null,
                "openInNewTab": false,
                "children": [
                    {
                        "id": "EJECUCIONSOLICITUDES",
                        "title": "Ejecutar Solicitudes",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/ajuste-masivo/ejecucion-solicitudesoh",
                        "openInNewTab": false,
                        "children": []
                    },
                    {
                        "id": "HISTORIALSOLICITUDES",
                        "title": "Historial Solicitudes",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/ajuste-masivo/historial-solicitudesoh",
                        "openInNewTab": false,
                        "children": []
                    }
                ]
            }
        ]
    }
];

export const navigationForSales: FuseNavigation[] = [
    {
        "id": "CONSULTAS",
        "title": "Consultas",
        "type": "collapsable",
        "icon": "tune",
        "hidden": false,
        "url": null,
        "openInNewTab": false,
        "children": [
            {
                "id": "SOLICITUDESAHORROSOH",
                "title": "Solicitudes Ahorros Oh!",
                "type": "item",
                "icon": null,
                "hidden": false,
                "url": "/apps/consultas/solicitudes-ahorros-oh",
                "openInNewTab": false,
                "children": []
            }
        ]
    },
    {
        "id": "AJUSTESMASIVOS",
        "title": "Ajustes Masivos",
        "type": "collapsable",
        "icon": "tune",
        "hidden": false,
        "url": null,
        "openInNewTab": false,
        "children": [
            {
                "id": "SOLICITUDESOH",
                "title": "Solicitudes Oh!",
                "type": "collapsable",
                "icon": null,
                "hidden": false,
                "url": null,
                "openInNewTab": false,
                "children": [
                    {
                        "id": "EJECUCIONSOLICITUDES",
                        "title": "Ejecutar Solicitudes",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/ajuste-masivo/ejecucion-solicitudesoh",
                        "openInNewTab": false,
                        "children": []
                    },
                    {
                        "id": "HISTORIALSOLICITUDES",
                        "title": "Historial Solicitudes",
                        "type": "item",
                        "icon": null,
                        "hidden": false,
                        "url": "/apps/ajuste-masivo/historial-solicitudesoh",
                        "openInNewTab": false,
                        "children": []
                    }
                ]
            }
        ]
    }
];