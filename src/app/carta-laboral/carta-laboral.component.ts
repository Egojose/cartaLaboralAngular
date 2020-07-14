import { Component, OnInit } from "@angular/core";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { SPServicio } from "../servicio/sp-servicio";
import { configCartaLaboral } from "../entidades/configCartaLaboral";
import { Empleado } from "../entidades/empleado";
import { PdfMakeWrapper, Txt, Img } from "pdfmake-wrapper";
import * as CryptoJS from "crypto-js";

@Component({
  selector: "app-carta-laboral",
  templateUrl: "./carta-laboral.component.html",
  styleUrls: ["./carta-laboral.component.css"]
})
export class CartaLaboralComponent implements OnInit {
  ObjConfigCL: configCartaLaboral[];
  ObjEmpleado: Empleado[];
  pdfSrc: any;

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private route: ActivatedRoute,
    private servicio: SPServicio
  ) {}

  ngOnInit(): void {
    this.spinnerService.show();
    let id = this.route.snapshot.paramMap.get("id");
    let salario = this.route.snapshot.paramMap.get("salario");
    let funciones = this.route.snapshot.paramMap.get("funciones");
    let dirigidoA = this.route.snapshot.paramMap.get("dirigidoA");
    this.ObtenerConfiguracionCL(id, salario, funciones, dirigidoA);
  }

  ObtenerConfiguracionCL(id, salario, funciones, dirigidoA): any {
    this.servicio
      .consultarConfiguracionCL()
      .then(res => {
        this.ObjConfigCL = configCartaLaboral.fromJsonList(res);
        this.ObtenerEmpleado(
          id,
          salario,
          funciones,
          dirigidoA,
          this.ObjConfigCL[0]
        );
      })
      .catch(error => {
        console.log(error);
      });
  }

  formatDate(date) {
    var d = date,
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  ObtenerEmpleado(
    id: string,
    salario: string,
    funciones: string,
    dirigidoA,
    ObjConfigCL: configCartaLaboral
  ): any {
    this.servicio
      .obtenerUsuario(id)
      .then(async res => {
        this.ObjEmpleado = Empleado.fromJsonList(res);
        if (salario === "true") {
          this.CrearCartaConSalario(
            salario,
            funciones,
            dirigidoA,
            ObjConfigCL,
            this.ObjEmpleado[0]
          );
        } else {
          this.CrearCartaSinSalario(
            salario,
            funciones,
            dirigidoA,
            ObjConfigCL,
            this.ObjEmpleado[0]
          );
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  CrearCartaSinSalario(
    salario: string,
    funciones: string,
    dirigidoA: any,
    ObjConfigCL: configCartaLaboral,
    ObjEmpleado: Empleado
  ): any {}

  async CrearCartaConSalario(
    salario: string,
    funciones: string,
    dirigidoA: any,
    ObjConfigCL: configCartaLaboral,
    ObjEmpleado: Empleado
  ): Promise<any> {
    let fecha = new Date();
    let stringFecha = this.formatDate(fecha);

    // let ObjEmpleado = this.ObjEmpleado[0];
    let nombre =
      ObjEmpleado.nombre2 === ""
        ? ObjEmpleado.nombre1
        : `${ObjEmpleado.nombre1} ${ObjEmpleado.nombre2}`;
    let apellido =
      ObjEmpleado.apellido2 === ""
        ? ObjEmpleado.apellido1
        : `${ObjEmpleado.apellido1} ${ObjEmpleado.apellido2}`;
        let nombreCompleto = `${nombre} ${apellido}`
    // let nombreCompleto = nombre + " " + apellido;
    let cuerpoCarta = ObjConfigCL.CuerpoConSalario;
    cuerpoCarta = cuerpoCarta.replace("{nombre}", nombreCompleto);
    cuerpoCarta = cuerpoCarta.replace("{cedula}", ObjEmpleado.numeroDocumento);
    cuerpoCarta = cuerpoCarta.replace(
      "{nombreEmpresa}",
      ObjConfigCL.nombreEmpresa
    );
    cuerpoCarta = cuerpoCarta.replace(
      "{terminoContrato}",
      ObjEmpleado.terminoContrato
    );
    let fechaInicio = ObjEmpleado.fechaIngreso;
    let dia = fechaInicio.getDate();
    cuerpoCarta = cuerpoCarta.replace("{dia}", dia.toString());
    let mes = "" + (fechaInicio.getMonth() + 1);
    if (mes.length < 2) mes = "0" + mes;
    cuerpoCarta = cuerpoCarta.replace("{mes}", mes.toString());
    let ano = fechaInicio.getFullYear();
    cuerpoCarta = cuerpoCarta.replace("{ano}", ano.toString());
    cuerpoCarta = cuerpoCarta.replace("{cargo}", ObjEmpleado.cargo);
    let SalarioTextoDecript = CryptoJS.AES.decrypt(
      ObjEmpleado.salarioTexto.trim(),
      "12ab".trim()
    ).toString(CryptoJS.enc.Utf8);
    cuerpoCarta = cuerpoCarta.replace("{salarioTexto}",SalarioTextoDecript);
    let SalarioDecript = CryptoJS.AES.decrypt(ObjEmpleado.salario.trim(),"12ab".trim()).toString(CryptoJS.enc.Utf8);
    cuerpoCarta = cuerpoCarta.replace("{salario}",SalarioDecript);
    const pdf = new PdfMakeWrapper();
    pdf.background(
      await new Img("../assets/imagenes/encabezado.jpg").width(630).build()
    );
    pdf.add(
      new Txt(`${ObjEmpleado.sede}, ${stringFecha}`).margin([50, 80, 0, 0]).end
    );
    pdf.add(
      new Txt(ObjConfigCL.nombreEmpresa).bold().margin([100, 70, 0, 0]).end
    );
    pdf.add(new Txt("CERTIFICA").bold().margin([230, 70, 0, 0]).end);
    pdf.add(new Txt(cuerpoCarta).margin([50, 80, 0, 0]).end);
    let notaExpedicion = ObjConfigCL.NotaExpedicion;
    notaExpedicion = notaExpedicion.replace("{dirigidoA}", dirigidoA);
    dia = fecha.getDate();
    notaExpedicion = notaExpedicion.replace("{dia}", dia.toString());
    mes = "" + (fecha.getMonth() + 1);
    if (mes.length < 2) mes = "0" + mes;
    notaExpedicion = notaExpedicion.replace("{mes}", mes.toString());
    ano = fecha.getFullYear();
    notaExpedicion = notaExpedicion.replace("{ano}", ano.toString());
    pdf.add(new Txt(notaExpedicion).margin([50, 100, 0, 0]).end);
    pdf.add(new Txt("Cordialmente,").margin([50, 80, 0, 0]).end);
    pdf.add(
      await new Img(ObjConfigCL.imagenFirmaDir)
        .margin([50, 0, 0, 0])
        .width(130)
        .build()
    );
    pdf.add(
      new Txt("_____________________________").margin([50, -30, 0, 0]).end
    );
    pdf.pageSize("A4");
    pdf.create().open();
  }

  CrearCartaConFunciones() {
    
  }
}
