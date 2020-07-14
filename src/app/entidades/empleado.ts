export class Empleado {
    
    constructor(
        public nombre1: string,
        public nombre2: string,
        public apellido1: string,
        public apellido2: string,
        public tipoDocumento: string,
        public numeroDocumento: string,
        public lugarDocumento: string,        
        public fechaIngreso: Date,
        public cargo: string,
        public tipoContrato: string,
        public salario: string,
        public salarioTexto: string,
        public usuarioId: number,
        public area: string,
        public bonos: string,
        public terminoContrato: string,
        public afp: string,
        public salarioIntegral: string,
        public fechaSalida: Date,
        public carrera: string,
        public universidad: string,
        public sede: string,
        public funciones: string   
        ){       
    }

    public static fromJson(element: any) {
        
        let SegundoNombre = element.SegundoNombre === null? "" : element.SegundoNombre;
        let SegundoApellido = element.SegundoApellido === null? "" : element.SegundoApellido;

        return new Empleado(
            element.PrimerNombre,
            SegundoNombre,
            element.PrimerApellido,
            SegundoApellido,
            element.TipoDocumento,
            element.NumeroDocumento,
            element.lugarExpedicion,           
            new Date(element.FechaIngreso),
            element.Cargo,
            element.TipoContrato,
            element.Salario,
            element.salarioTexto,
            element.usuarioId,
            element.Area,
            element.Bonos,
            element.TerminoContrato,
            element.AFP,
            element.SalarioIntegral,
            new Date(element.FechaSalida),
            element.Carrera,
            element.Universidad,
            element.Sede,
            element.Funciones);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}