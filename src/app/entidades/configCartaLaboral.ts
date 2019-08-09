export class configCartaLaboral{
    
    constructor(
        public urlImagenEncabezado: string,
        public cuerpoCarta: string,
        public nitEmpresa: string,
        public nombreEmpresa: string,
        public imagenFirmaDir: string,
        public imagenPiePagina: string,
        public parrafoOpcional: string,
        public nombreDirectorRH: string,
        public nombreCargoDir: string,
        public CuerpoSalario: string,
        public CuerpoIntegral: string,
        public CuerpoPracticanteUniversitario: string,
        public CuerpoAprendizSena: string,
        public CuerpoSinSalario: string,
        public CuerpoConSalario: string,
        public NotaExpedicion: string,
        public CuerpoFunciones: string
        ){       
    }

    public static fromJson(element: any) {
        
        return new configCartaLaboral(
            element.ImagenEncabezado.Url,
            element.CuerpoCarta,
            element.NitEmpresa,
            element.NombreEmpresa,
            element.ImagenFirmaDirectoraRH.Url,
            element.ImagenPiePagina,
            element.parrafoOpcional,
            element.nombreDirectora,
            element.nombreCargoDir,
            element.cuerpoSalario,
            element.CuerpoIntegral,
            element.CuerpoPracticanteUniversitario,
            element.CuerpoAprendizSena,
            element.CuerpoSinSalario,
            element.CuerpoConSalario,
            element.NotaExpedicion,
            element.CuerpoFunciones

            );
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}