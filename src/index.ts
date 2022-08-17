//Formulario
interface IFormulario{
    logo: IImagen
    fecha: Date
    nombres: string
    apellidos: string
    identidad: string
    antecedentes: IAntecedente[]
    identidadValida(): boolean
}

interface IImagen{
    src: string
    alt: string
}

interface IAntecedente{
    descripcion: string
    presenta: boolean
    especificaciones: string
}

class Formulario implements IFormulario{
    logo: IImagen
    fecha: Date
    nombres: string
    apellidos: string
    identidad: string
    antecedentes: IAntecedente[]

    constructor(logo: IImagen,
        nombres: string,
        apellidos: string,
        identidad: string,
        antecedentes?: IAntecedente[],
        fecha?: Date){
        this.logo = logo
        this.fecha = (fecha) ? fecha : new Date()
        this.nombres = nombres
        this.apellidos = apellidos
        this.identidad = identidad
        this.antecedentes = antecedentes ? antecedentes : []
    }

    identidadValida(): boolean{
        const regex = /\d{4}-\d{4}-\d{5}$/
        return regex.test(this.identidad)
    }
}

const imagenPredeterminada: IImagen = {
    src: "www.google.com",
    alt: "hola"
}

//Registro
interface IRegistro{
    formularios: IFormulario[]
    sucursal: "Tegucigalpa" | "SPS"
    insert(formulario: IFormulario): IFormulario[]
    update(id: string, nombres: string): IFormulario | undefined
    delete(id: string): IFormulario[]
    select(): IFormulario[]
    buscarPorId(id: string): IFormulario | undefined 
    buscarPorFecha(fecha: Date): IFormulario[]
    buscarEmpleadosSintomas(fecha: Date): IFormulario[]
    buscarEmpleadosSintomasSeguidos(fecha: Date): string[]
    buscarEmpleadosIdentidadInvalidad(): IFormulario[]
}

class Registro implements IRegistro{
    formularios: IFormulario[] = []
    sucursal: "Tegucigalpa" | "SPS" = "Tegucigalpa"

    insert(formulario: IFormulario): IFormulario[] {
        this.formularios.push(formulario)
        return this.formularios
    }
    update(id: string, nombres: string): IFormulario | undefined {
         const formulario = this.formularios.find(formulario => formulario.identidad === id)
         if(formulario){
            formulario.nombres = nombres
         }
        return formulario;
    }
    delete(id: string): IFormulario[] {
        return this.formularios.filter(formulario => formulario.identidad !== id)
    }
    select(): IFormulario[] {
        return this.formularios
    }
    
    buscarPorId(id: string): IFormulario | undefined {
        return this.formularios.find(formulario => formulario.identidad === id)
    }

    buscarPorFecha(fecha: Date): IFormulario[]{
        return this.formularios.filter(formulario => formulario.fecha.toDateString() === fecha.toDateString())
    }

    buscarEmpleadosSintomas(fecha: Date): IFormulario[]{
        const fechaActual = this.buscarPorFecha(fecha)
        return  fechaActual.filter(formulario => formulario.antecedentes.filter(antecedente => antecedente.presenta).length >= 2)
    }

    buscarEmpleadosSintomasSeguidos(fecha: Date): string[] {
        const fechaAyer: Date = new Date()
        fechaAyer.setDate(fecha.getDate() - 1)

        const fechaAnteAyer: Date = new Date()
        fechaAnteAyer.setDate(fecha.getDate() - 2)
        
        const resultado = this.formularios.filter(formulario => formulario.fecha >=  fechaAnteAyer && formulario.fecha <= fecha)
        .map(formulario => { 
            return {
                identidad: formulario.identidad, 
                antecedentes: formulario.antecedentes.filter(antecedente => antecedente.presenta).length >=2 
            }
        }).filter(formulario => formulario.antecedentes)

        return resultado.map(formulario => formulario.identidad)
    }

    buscarEmpleadosIdentidadInvalidad(): IFormulario[] { 
        return this.formularios.filter(formulario => !formulario.identidadValida())
    }
}

///Pruebas
const registro: IRegistro = new Registro()

//Generador de formularios automaticos de 11 empleados durante 5 dias, algunos de estos empleados tienen numeros de identidad incorrectos. Los sintomas que presentan se generan de forma aleatoria.
let dias = 0
do{
    let indiceFormulario = 0
    do {
        const formulario: IFormulario = new Formulario(imagenPredeterminada, "Nombres" + indiceFormulario, "Apellidos" + indiceFormulario, "1512-6346-7545" + indiceFormulario)
        formulario.fecha.setDate(new Date().getDate() - dias)
        formulario.antecedentes.push({descripcion: "Enfermedad Base" , presenta: (Math.round(Math.random() -0.4) === 1), especificaciones: "" })
        formulario.antecedentes.push({descripcion: "Dificultad respiratoria" , presenta: (Math.round(Math.random() -0.4) === 1), especificaciones: "" })
        formulario.antecedentes.push({descripcion: "Presenta alguna afección cardiaca" , presenta: (Math.round(Math.random() -0.4) === 1), especificaciones: "" })
        formulario.antecedentes.push({descripcion: "Sistema inmunitario" , presenta: (Math.round(Math.random() -0.4) === 1), especificaciones: "" })
        formulario.antecedentes.push({descripcion: "Obesidad" , presenta: (Math.round(Math.random() -0.4) === 1), especificaciones: "" })
        formulario.antecedentes.push({descripcion: "Diabetes" , presenta: (Math.round(Math.random() -0.4) === 1), especificaciones: "" })
        formulario.antecedentes.push({descripcion: "Dialisis" , presenta: (Math.round(Math.random() -0.4) === 1), especificaciones: "" })
        formulario.antecedentes.push({descripcion: "Hepático" , presenta: (Math.round(Math.random() -0.4) === 1), especificaciones: "" })
        registro.formularios.push(formulario)
        indiceFormulario++
    } while (indiceFormulario < 11)
    dias++
} while(dias < 5)

//buscar por id
console.log(registro.buscarPorId("1512-6346-75451"))

//buscar por fecha
console.log("Empleados que llenaron el formulario el dia de hoy", registro.buscarPorFecha(new Date()))
console.log("Cantidad de empleados que llenaron el formulario el dia de hoy", registro.buscarPorFecha(new Date()).length)

//buscar empleados con más de 2 sintomas
console.log(`Empleados con más de 2 sintomas el dia ${new Date().toLocaleDateString()}`, registro.buscarEmpleadosSintomas(new Date()))
console.log(`Cantidad de empleados con más de 2 sintomas el dia ${new Date().toLocaleDateString()}`, registro.buscarEmpleadosSintomas(new Date()).length)

//Empleados con sintomas durante 3 dias seguidos hasta hoy
console.log("Empleados que durante los últimos 3 días seguidos presentaron más de 2 síntomas ", registro.buscarEmpleadosSintomasSeguidos(new Date()))
console.log("Cantidad de empleados que durante los últimos 3 días seguidos presentaron más de 2 síntomas ", registro.buscarEmpleadosSintomasSeguidos(new Date()).length)

//Empleados con numeros de identidad invalido.
console.log("Formularios que se llenaron con identidad inválida", registro.buscarEmpleadosIdentidadInvalidad())
console.log("Cantidad de formularios que se llenaron con identidad inválida", registro.buscarEmpleadosIdentidadInvalidad().length)