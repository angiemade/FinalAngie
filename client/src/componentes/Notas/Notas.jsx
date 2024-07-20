// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './notas.css';

// const Notas = () => {
//   const [notas, setNotas] = useState([]);
//   const [contenido, setContenido] = useState('');
//   const token = localStorage.getItem('token');
//   const role = localStorage.getItem('role');
//   const navigate = useNavigate();

//   const handleAgregarProductosClick = () => {
//     navigate('/menu');
//   };

//   const handleListadoProductosClick = () => {
//     navigate('/lista');
//   };

//   const handleCerrarSesion = async () => {
//     try {
//       await axios.post('http://localhost:3001/logout');
//       localStorage.removeItem('token');
//       localStorage.removeItem('role');
//       navigate('/');
//     } catch (err) {
//       console.error('Error al cerrar sesión:', err);
//     }
//   };

//   useEffect(() => {
//     axios.get('http://localhost:3001/notas', { headers: { 'Authorization': `Bearer ${token}` } })
//       .then(response => {
//         setNotas(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching notes:', error);
//       });
//   }, [token]);

//   const handleAddNota = () => {
//     axios.post('http://localhost:3001/notas', { contenido }, { headers: { 'Authorization': `Bearer ${token}` } })
//       .then(response => {
//         setNotas([...notas, { contenido, id: response.data.insertId, role_id: role }]);
//         setContenido('');
//       })
//       .catch(error => {
//         console.error('Error adding note:', error);
//       });
//   };

//   return (
//     <div className="container">
//       <div className="header">
//         {role === '1' && ( // Verificar que el rol sea el de admin (asumiendo que el rol admin es '1')
//           <button className="btn btn-secondary me-2" onClick={handleAgregarProductosClick}>
//             Agregar Productos
//           </button>
//         )}
//         <button className="btn btn-secondary me-2" onClick={handleListadoProductosClick}>
//           Listado de Productos
//         </button>
//         <button className="btn btn-secondary me-2" onClick={handleCerrarSesion}>
//           <i className="bi bi-person-fill"></i> Cerrar sesión
//         </button>
//       </div>
//       <div className="nota-container">
//         <textarea className="form-control" value={contenido} onChange={(e) => setContenido(e.target.value)}></textarea>
//         <div>
//           <button className="btn btn-primary" onClick={handleAddNota}>
//             <i className="bi bi-send-fill"></i>
//           </button>
//         </div>
//       </div>
//       <ul className="list-group mt-3">
//         {notas.map(nota => (
//           <li key={nota.id} className="list-group-item">
//             {nota.contenido} <span className="badge bg-secondary">{nota.role}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Notas;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './notas.css';

const Notas = () => {
  const [notas, setNotas] = useState([]);
  const [contenido, setContenido] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleCerrarSesion = async () => {
    try {
      await axios.post('http://localhost:3001/logout');
      localStorage.removeItem('token');
      navigate('/');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  useEffect(() => {
    axios.get('http://localhost:3001/notas', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(response => {
        setNotas(response.data);
      })
      .catch(error => {
        console.error('Error fetching notes:', error);
      });
  }, [token]);

  const handleAddNota = () => {
    axios.post('http://localhost:3001/notas', { contenido }, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(response => {
        setNotas([...notas, { contenido, id: response.data.insertId }]);
        setContenido('');
      })
      .catch(error => {
        console.error('Error adding note:', error);
      });
  };

  return (
    <div className="container">
      <div className="header">
        <button className="btn btn-secondary me-2" onClick={handleCerrarSesion}>
          <i className="bi bi-person-fill"></i> Cerrar sesión
        </button>
      </div>
      <div className="nota-container">
        <textarea className="form-control" value={contenido} onChange={(e) => setContenido(e.target.value)}></textarea>
        <div>
          <button className="btn btn-primary" onClick={handleAddNota}>
            <i className="bi bi-send-fill"></i>
          </button>
        </div>
      </div>
      <ul className="list-group mt-3">
        {notas.map(nota => (
          <li key={nota.id} className="list-group-item">
            {nota.contenido}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notas;
