import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

function Lista() {
  const [empleadosList, setEmpleados] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const getEmpleados = () => {
    Axios.get("http://localhost:3001/empleados")
      .then((response) => {
        const empleadosConChecked = response.data.map(empleado => ({
          ...empleado,
          checked: JSON.parse(localStorage.getItem(`empleado-${empleado.id}`)) || false // Carga el estado desde localStorage
        }));
        setEmpleados(empleadosConChecked);
      })
      .catch((error) => {
        console.error("Error al obtener los empleados:", error);
      });
  };

  useEffect(() => {
    getEmpleados();
  }, []);

  const handleCheckboxChange = (id) => {
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEmpleados = empleadosList.filter(empleado =>
    empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empleado.edad.toString().includes(searchTerm) ||
    empleado.pais.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empleado.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empleado.años.toString().includes(searchTerm)
  );

  const handlebtnAtrasClick = () => {
    const role = localStorage.getItem('role');
    if (role === '1') { // Supongamos que 1 es admin
      navigate('/home'); // Redirige al componente Home si el rol es admin
    } else if (role === '2') { // Supongamos que 2 es user
      navigate('/homeu'); // Redirige al componente HomeU si el rol es user
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-end mt-2">
        <button className="btn btn-light" onClick={handlebtnAtrasClick}>
          <i className="bi bi-arrow-left-circle-fill" style={{ fontSize: '1.5rem' }}></i>
        </button>
      </div>
      <div className="card text-center mt-4">
        <div className="card-header">
          Gestor de empleados
        </div>
        <div className="card-body">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Buscar empleados por nombre, edad, país, cargo o experiencia"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <table className='table table-striped'>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Check</th>
                <th scope="col">Nombre</th>
                <th scope="col">Edad</th>
                <th scope="col">País</th>
                <th scope="col">Cargo</th>
                <th scope="col">Experiencia</th>
              </tr>
            </thead>
            <tbody>
              {
                filteredEmpleados.map((val) => (
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
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Lista;
