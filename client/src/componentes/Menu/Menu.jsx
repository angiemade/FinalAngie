import { useState, useEffect } from 'react'; // Importación de useEffect
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2';

function Menu() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState();
  const [pais, setPais] = useState("");
  const [cargo, setCargo] = useState("");
  const [años, setAños] = useState();
  const [id, setId] = useState();

  const [empleadosList, setEmpleados] = useState([]);
  const [editar, setEditar] = useState(false);

  const navigate = useNavigate();

  const putEmpleados = (val) => {
    setEditar(true);
    setNombre(val.nombre);
    setEdad(val.edad);
    setPais(val.pais);
    setCargo(val.cargo);
    setAños(val.años);
    setId(val.id);
  };

  const add = () => {
    Axios.post("http://localhost:3001/create", {
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      años: años
    }).then(() => {
      getEmpleados();
      limpiarCampos();
      Swal.fire({
        title: "Registro Exitoso!!",
        html: "El empleado <strong>" + nombre + "</strong> fue registrado con éxito!!",
        icon: "success",
        timer: 3000
      })
    }).catch(function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente más tarde" : JSON.parse(JSON.stringify(error)).message,
      });
    })
  }

  const getEmpleados = () => {
    Axios.get("http://localhost:3001/empleados").then((response) => {
      const empleadosConChecked = response.data.map(empleado => ({
        ...empleado,
        checked: JSON.parse(localStorage.getItem(`empleado-${empleado.id}`)) || false // Carga el estado desde localStorage
      }));
      setEmpleados(empleadosConChecked);
    });
  }

  useEffect(() => {
    getEmpleados(); // Solo llama a la API una vez al montar el componente
  }, []);

  const update = () => {
    Axios.put("http://localhost:3001/update", {
      id: id,
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      años: años
    }).then(() => {
      getEmpleados();
      limpiarCampos();
      Swal.fire({
        title: "Actualizacion Exitosa!!",
        html: "El empleado <strong>" + nombre + "</strong> fue actualizado con éxito!!",
        icon: "success",
        timer: 3000
      })
    }).catch(function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente más tarde" : JSON.parse(JSON.stringify(error)).message,
      });
    });
  }

  const deleteEmpleados = (val) => {
    Swal.fire({
      title: "Eliminar",
      html: "¿Desea eliminar a <strong>" + val.nombre + "</strong>?",
      buttons: ["no", "si"],
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete/${val.id}`).then(() => {
          getEmpleados();
          limpiarCampos();
          Swal.fire(
            {
              title: val.nombre + ' fue eliminado',
              icon: 'success',
              timer: 3000
            }
          );
        }).catch(function (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No se logró eliminar al empleado",
            footer: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente más tarde" : JSON.parse(JSON.stringify(error)).message,
          });
        })
      }
    });
  }

  const limpiarCampos = () => {
    setNombre('');
    setEdad('');
    setPais('');
    setCargo('');
    setAños('');
    setEditar(false);
  }

  const handleCheckboxChange = (id) => { // Nueva función para manejar el checkbox
    setEmpleados(prevState =>
      prevState.map(empleado => {
        if (empleado.id === id) {
          localStorage.setItem(`empleado-${empleado.id}`, JSON.stringify(!empleado.checked)); // Guarda el estado en localStorage
          return { ...empleado, checked: !empleado.checked };
        }
        return empleado;
      })
    );
  };

  const handlebtnAtrasClick = () => {
    const role = localStorage.getItem('role');
    if (role === '1') {
      navigate('/home');
    } else if (role === '2') {
      navigate('/homeu');
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-end mt-2">
        <button className="btn btn-light" onClick={handlebtnAtrasClick}>
          <i className="bi bi-arrow-left-circle-fill" style={{ fontSize: '1.5rem' }}></i>
        </button>
      </div>
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
            <span className='input-group-text' id='basic-addon1'>Pais:</span>
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
            <th scope="col">Check</th> {/* Nueva columna para el checkbox */}
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
              return (
                <tr key={val.id} className={val.checked ? 'text-decoration-line-through' : ''}>
                  <th>{val.id}</th>
                  <td>
                    <input
                      type="checkbox"
                      checked={val.checked}
                      onChange={() => handleCheckboxChange(val.id)}
                    />
                  </td>
                  <td>{val.nombre}</td>
                  <td>{val.edad}</td>
                  <td>{val.pais}</td>
                  <td>{val.cargo}</td>
                  <td>{val.años}</td>
                  <td>
                    <button className="btn btn-warning m-1" onClick={() => { putEmpleados(val) }}>Editar</button>
                    <button className="btn btn-danger m-1" onClick={() => { deleteEmpleados(val) }}>Eliminar</button>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  );
}

export default Menu;
