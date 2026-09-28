/**
 * Versión publicada de los términos de reserva.
 *
 * IMPORTANTE: este contenido es una base comercial editable. La razón social,
 * NIT, domicilio, canales de atención y política definitiva de cancelación,
 * reembolso y depósito deben ser completados y validados por un abogado antes
 * de publicar el sistema en producción. Al modificar el texto, incremente la
 * versión para que las aceptaciones anteriores sigan siendo auditables.
 */
export const RENTAL_TERMS_VERSION = "2026-09-24";
export const RENTAL_TERMS_EFFECTIVE_DATE = "24 de septiembre de 2026";

export const rentalTermsSections = [
    {
        id: "objeto",
        title: "1. Objeto y aceptación",
        paragraphs: [
            "Estos términos y condiciones regulan el acceso a la plataforma RentaMóvil y la reserva y alquiler de vehículos mediante ella. La aceptación de la casilla de autorización, la fecha, la versión y los datos de la reserva seleccionada constituyen evidencia digital de aceptación de este documento.",
            "El cliente declara que los ha leído y comprendido en su totalidad. Si no está de acuerdo con alguna de sus disposiciones, no debe continuar con la reserva ni realizar el pago.",
        ],
    },
    {
        id: "requisitos",
        title: "2. Requisitos del cliente y del conductor",
        paragraphs: [
            "El cliente declara que tiene la edad mínima exigida por la normativa aplicable, que posee licencia de conducción vigente y válida durante todo el período del alquiler, y que cuenta con autorización y capacidad para celebrar este contrato.",
            "Al momento de la entrega deberá presentar los documentos de identidad, licencia y demás requisitos informados en la reserva o en la sucursal. Cualquier conductor adicional deberá ser autorizado previamente por RentaMóvil. La entrega de información falsa, vencida o insuficiente podrá suspender o cancelar el servicio, sin perjuicio de los derechos que correspondan al cliente.",
        ],
    },
    {
        id: "reserva",
        title: "3. Selección, disponibilidad y precio",
        paragraphs: [
            "La reserva representa una solicitud sujeta a verificación de disponibilidad, datos, cobertura elegida y pago. RentaMóvil podrá ofrecer un vehículo equivalente de la misma categoría cuando sea necesario, informando la diferencia de precio, si existe, y obteniendo la aprobación del cliente cuando este cambio afecte de manera sustancial lo contratado.",
            "El total que aparece en la plataforma corresponde a los productos, fechas, sucursales, cobertura y servicios seleccionados. Los impuestos incluidos se identifican expresamente en la pantalla de pago. Peajes, parqueos, multas, consumos y otros cargos de terceros se pagarán por el cliente cuando así lo indique la ley o el servicio prestado.",
        ],
    },
    {
        id: "pago",
        title: "4. Pago, comprobante y activación de la reserva",
        paragraphs: [
            "El pago debe realizarse exclusivamente por los canales y cuentas bancarias habilitados y vigentes mostrados en la plataforma. El cliente debe transferir el valor indicado y registrar un comprobante legible que permita relacionarlo con la reserva.",
            "El envío del comprobante no equivale a aprobación del pago ni confirma por sí solo la reserva. El estado permanece pendiente de revisión hasta que un administrador valide la transferencia. Un pago rechazado, una referencia incorrecta, una diferencia de monto o un comprobante no legible no activará el servicio. El comprobante no debe compartirse con terceros fuera de los canales autorizados.",
        ],
    },
    {
        id: "cambios",
        title: "5. Cambios, cancelación y reembolsos",
        paragraphs: [
            "Las solicitudes de cambio o cancelación deben presentarse por los canales oficiales antes de la fecha y hora de recogida. Se aplicarán las condiciones, plazos, costos y penalidades que se muestren expresamente en la oferta y que el cliente acepte al confirmar la reserva. Si no existe una condición especial visible, RentaMóvil informará el costo aplicable antes de procesar la solicitud.",
            "No procederá un reembolso por servicios ya prestados, gastos ante terceros, daños imputables al cliente o casos previstos en la normativa aplicable, sin perjuicio de los derechos irrenunciables del consumidor y de las reglas específicas de la cobertura elegida.",
        ],
    },
    {
        id: "entrega",
        title: "6. Entrega del vehículo",
        paragraphs: [
            "La entrega se realiza en la sucursal, fecha y franja horaria confirmadas, sujeta a disponibilidad y a la presentación oportuna de los documentos requeridos. El cliente debe recibir y revisar el vehículo antes de retirarse de la sucursal.",
            "La entrega incluye una revisión de apariencia, kilometraje, combustible, accesorios y funcionamiento básico, cuyo resultado se registra en el documento de entrega. Cualquier daño, faltante o defecto que no quede registrado debe comunicarse antes de iniciar la marcha.",
        ],
    },
    {
        id: "deposito",
        title: "7. Depósito de garantía y pagos a terceros",
        paragraphs: [
            "Cuando corresponda, el cliente deberá constituir un depósito o entregar un medio de garantía conforme al monto y mecanismo informados en la reserva o en el contrato de alquiler. Ese depósito es una garantía de cumplimiento y no un pago de la reserva, salvo que se indique expresamente lo contrario.",
            "El depósito se liberará una vez devuelto el vehículo y verificados el estado, la documentación, el combustible, la kilometraje y la ausencia de obligaciones. Si existen daños, multas u otras sumas pendientes, se podrá descontar el importe comprobado, respetando las notificaciones, el proceso y los derechos del cliente.",
        ],
    },
    {
        id: "uso",
        title: "8. Uso permitido y prohibiciones",
        paragraphs: [
            "El vehículo solo podrá utilizarse para desplazamientos lícitos por el conductor autorizado. Quedan prohibidos, entre otros, el uso bajo efectos de alcohol o drogas, carreras, competencias, pruebas de velocidad, conducción fuera de vía, sobrecarga, uso comercial no autorizado, subarriendo, abandono del vehículo, retiro o manipulación del dispositivo GPS y cualquier actividad ilícita.",
            "El conductor debe respetar la normativa de tránsito, las señales, las restricciones de circulación y las órdenes legítimas de la autoridad. El cliente responderá por las consecuencias del uso indebido, sin perjuicio de las coberturas contratadas.",
        ],
    },
    {
        id: "responsabilidad",
        title: "9. Responsabilidad, incidentes y seguros",
        paragraphs: [
            "El cliente debe conducir de manera prudente y comunicar de inmediato a RentaMóvil, a la autoridad competente y, cuando corresponda, a su aseguradora cualquier accidente, robo, daño o incidente. No debe realizar reparaciones ni desplazar el vehículo sin autorización, salvo una medida urgente para evitar un daño mayor.",
            "El cliente será responsable de multas, peajes, parqueos, daños y pérdidas a terceros en la proporción que le corresponda legalmente. La cobertura de seguro elegida opera únicamente dentro de su alcance, límites y deducible; no sustituye las responsabilidades no cubiertas. El resumen de la cobertura seleccionada forma parte de la reserva.",
        ],
    },
    {
        id: "devolucion",
        title: "10. Devolución y extensión",
        paragraphs: [
            "El vehículo debe devolverse en la sucursal, fecha y hora indicadas, con el mismo nivel de combustible, kilometraje, accesorios, documentos y estado de calidad, salvo el desgaste ordinario permitido. La devolución se documentará mediante una inspección y acta de entrega.",
            "Cualquier extensión debe solicitarse antes de la hora de devolución y está sujeta a disponibilidad y a la tarifa vigente. No produce una extensión automática la demora en la devolución. Una devolución tardía o fuera de la sucursal convenida puede generar cobros adicionales y, cuando corresponda, la aplicación de la garantía.",
        ],
    },
    {
        id: "disponibilidad",
        title: "11. Disponibilidad y eventos de fuerza mayor",
        paragraphs: [
            "RentaMóvil podrá modificar o cancelar una reserva por motivos de seguridad, mantenimiento, falta de disponibilidad u otra causa justificada, informando al cliente. En ese caso se gestionará la devolución de los importes correspondientes a servicios no prestados, de acuerdo con la ley y con lo ya consumido por el cliente.",
            "Eventos de fuerza mayor, disturbios, restricciones de circulación, emergencias u otras circunstancias fuera de control razonable pueden modificar fechas, rutas o condiciones. El cliente deberá usar los canales oficiales para recibir instrucciones y opciones.",
        ],
    },
    {
        id: "datos",
        title: "12. Datos personales y comunicaciones",
        paragraphs: [
            "Los datos suministrados se utilizarán para gestionar la reserva, verificar el pago, prestar soporte, cumplir obligaciones legales, prevenir fraude y mantener la seguridad de la plataforma. El tratamiento se realizará conforme a la normativa de protección de datos y a los avisos de privacidad y finalidades que RentaMóvil informará al cliente.",
            "Las comunicaciones operativas —por ejemplo, recordatorios, estado de pago e instrucciones de entrega— podrán realizarse por los canales registrados. El uso comercial de los datos o las comunicaciones de marketing requieren la autorización separada que exija la ley.",
        ],
    },
    {
        id: "derechos",
        title: "13. Propiedad intelectual y límites de responsabilidad",
        paragraphs: [
            "La plataforma, su diseño, textos, logotipos, fotografías y demás componentes se utilizan exclusivamente para facilitar el servicio. El cliente no podrá reproducirlos, modificarlos o explotarlos comercialmente sin autorización previa.",
            "En la medida permitida por la ley, RentaMóvil no responde por daños indirectos o lucro cesante derivados de la utilización de la plataforma. Esta limitación no excluye responsabilidades que no puedan ser excluidas, ni los derechos del consumidor. El cliente debe utilizar el servicio de forma lícita y responsable.",
        ],
    },
    {
        id: "vigencia",
        title: "14. Vigencia, ley aplicable y contacto",
        paragraphs: [
            "Esta versión rige para las reservas iniciadas desde su publicación. Los cambios se publicarán con una nueva versión y fecha; la versión aceptada por cada cliente se conservará con la evidencia de aceptación. No se aplicarán a una reserva ya aceptada modificaciones que afecten derechos adquiridos sin autorización expresa o base legal.",
            "La relación se rige por la legislación colombiana. Cualquier controversia se resolverá por los mecanismos de solución aplicables y por los jueces y tribunales competentes, sin perjuicio de las normas de protección al consumidor. Para consultas, el cliente puede usar los canales oficiales publicados en la plataforma o acudir a la sucursal relacionada con la reserva.",
        ],
    },
];

/**
 * Crea el registro que acompaña la reserva.
 * @returns {{accepted: true, version: string, acceptedAt: string}}
 */
export function createTermsAcceptance() {
    return {
        accepted: true,
        version: RENTAL_TERMS_VERSION,
        acceptedAt: new Date().toISOString(),
    };
}

/**
 * Valida únicamente la forma del registro. En producción, el backend debe
 * volver a validar la versión vigente y asociar la aceptación a la reserva.
 * El servidor debe conservar además su propia fecha de recepción.
 */
export function isValidTermsAcceptance(acceptance) {
    if (
        acceptance?.accepted !== true ||
        acceptance.version !== RENTAL_TERMS_VERSION ||
        typeof acceptance.acceptedAt !== "string"
    ) {
        return false;
    }

    return Number.isFinite(Date.parse(acceptance.acceptedAt));
}
