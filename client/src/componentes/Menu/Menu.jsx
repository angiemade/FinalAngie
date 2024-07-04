import { useState } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2'


function Menu() {
  //add/agregar
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState();
  const [pais, setPais] = useState("");
  const [cargo, setCargo] = useState("");
  const [años, setAños] = useState();
  const [id, setId] = useState();

  //get/mostrar
  const [empleadosList, setEmpleados] = useState([]);

  //put/update/actualiza
  const [editar, setEditar] = useState(false);

  const putEmpleados = (val) => {
    setEditar(true);
    setNombre(val.nombre);
    setEdad(val.edad);
    setPais(val.pais);
    setCargo(val.cargo);
    setAños(val.años);
    setId(val.id);
  };

  //AGREGA
  const add = () => {
    Axios.post("http://localhost:3001/create", {
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      años: años
    }).then(() => {
      getEmpleados(); //para q se liste cada vez que agregamos 
      //alert("empleado registrado");
      limpiarCampos();
      Swal.fire({
        title: "Registro Exitoso!!",
        html: "El empleado <strong>" + nombre + "</strong> fue registrado con éxito!!",
        icon: "success",
        timer: 3000
      })
    }).catch(function (error) { //si el servidor no esta disponible aparece error
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente más tarde" : JSON.parse(JSON.stringify(error)).message,
      });
    })
  }

  //MOSTRAR
  const getEmpleados = () => {
    Axios.get("http://localhost:3001/empleados").then((response) => {
      setEmpleados(response.data); //trae los datos de la api
    });
  }

  getEmpleados(); /*SOLO LLAMA A LA API*/

  //EDITAR
  const update = () => {
    Axios.put("http://localhost:3001/update", {
      id: id,
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      años: años
    }).then(() => {
      getEmpleados() //para q se liste cada vez que agregamos 
      limpiarCampos()
      Swal.fire({
        title: "Actualizacion Exitosa!!",
        html: "El empleado <strong>" + nombre + "</strong> fue actualizado con éxito!!",
        icon: "success",
        timer: 3000
      })
    }).catch(function (error) { //si el servidor no esta disponible aparece error
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente más tarde" : JSON.parse(JSON.stringify(error)).message,
      });
    });
  }

  //ELIMINAR
  const deleteEmpleados = (val) => {

    Swal.fire({
      title: "Eliminar",
      html: "¿Desea eliminar a <strong>" + val.nombre + "</strong>?",
      buttons: ["no", "si"], //aqui toma el primero como false y al segundo con true
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete/${val.id}`).then(() => {
          getEmpleados() //para q se liste cada vez que agregamos 
          limpiarCampos()
          Swal.fire(
            {
              title: val.nombre + 'fue eliminado',
              icon: 'success',
              timer: 3000
            }
          );
        }).catch(function (error) { //si el servidor no esta disponible aparece error
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No se logro eliminar al empleado",
            footer: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente más tarde" : JSON.parse(JSON.stringify(error)).message,
          });
        })
      }
    });
  }


  //Limpia para seguir editando
  const limpiarCampos = () => {
    setNombre('');
    setEdad('');
    setPais('');
    setCargo('');
    setAños('');
    setEditar(false);
  }



  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">
          Gestor de empleados
        </div>
        <div className="card-body">
          <div className="input-group m-3">
            <span className='input-group-text' id='basic-addon1'>Nombre Completo:</span>
            <input type="text" onChange={(event) => { setNombre(event.target.value) }} className='form-control' value={nombre} placeholder='Ingrese un nombre' aria-label='Username' aria-describedby='basic-addon1' />
          </div>
          <div className="input-group m-3">
            <span className='input-group-text' id='basic-addon1'>Edad:</span>
            <input type="number" onChange={(event) => { setEdad(event.target.value) }} className='form-control' value={edad} placeholder='Ingrese una edad' aria-label='Username' aria-describedby='basic-addon1' />
          </div>
          <div className="input-group m-3">
            <span className='input-group-text' id='basic-addon1'>Pais::</span>
            <input type="text" onChange={(event) => { setPais(event.target.value) }} className='form-control' value={pais} placeholder='Ingrese el pais' aria-label='Username' aria-describedby='basic-addon1' />
          </div>
          <div className="input-group m-3">
            <span className='input-group-text' id='basic-addon1'>Cargo:</span>
            <input type="text" onChange={(event) => { setCargo(event.target.value) }} className='form-control' value={cargo} placeholder='Ingrese el cargo que ocupa' aria-label='Username' aria-describedby='basic-addon1' />
          </div>
          <div className="input-group m-3">
            <span className='input-group-text' id='basic-addon1'>Años:</span>
            <input type="number" onChange={(event) => { setAños(event.target.value) }} className='form-control' value={años} placeholder='Ingrese los años de experiencia' aria-label='Username' aria-describedby='basic-addon1' />
          </div>
        </div>
        <div className="card-footer text-muted">
          {
            editar ?
              <div>
                <button className='btn btn-warning m-2' onClick={update}>ACTUALIZAR </button>
                <button className='btn btn-info m-2' onClick={limpiarCampos}>CANCELAR </button>
              </div>
              : <button className='btn btn-success' onClick={add}>REGISTRAR </button>

          }

        </div>
      </div>
      <table className='table table-striped'>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">nombre</th>
            <th scope="col">edad</th>
            <th scope="col">pais</th>
            <th scope="col">cargo</th>
            <th scope="col">experiencia</th>
            <th scope="col">acciones</th>
          </tr>
        </thead>
        <tbody>
          {
            empleadosList.map((val, key) => {
              {/*cada valor tiene una clave q lo representa*/ }
              return <tr key={val.id}>
                <th>{val.id}</th>
                <td>{val.nombre}</td>
                <td>{val.edad}</td>
                <td>{val.pais}</td>
                <td>{val.cargo}</td>
                <td>{val.años}</td>
                <td><div className="btn-group" role="group" aria-label="Basic mixed styles example">
                  <button type="button" onClick={() => { putEmpleados(val); }} className="btn btn-warning">Editar</button>
                  <button type="button" onClick={() => { deleteEmpleados(val); }} className="btn btn-danger">Eliminar</button>
                </div></td>
              </tr>
              //1:43:31

            })
          }

        </tbody>
      </table>

    </div>
  )
}

export default Menu