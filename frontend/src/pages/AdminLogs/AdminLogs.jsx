import React, { useState, useEffect } from 'react';
import { HiOutlineClock, HiOutlineUser, HiOutlineDesktopComputer, HiOutlineGlobeAlt } from 'react-icons/hi';
import logsService from '../../services/logsService';
import './AdminLogs.css';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await logsService.getAll();
        setLogs(res.data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p className="loading-text">Cargando registros de auditoría...</p>
      </div>
    );
  }

  return (
    <div className="admin-logs-page" id="admin-logs-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Logs de Acceso</h1>
          <p className="dashboard-subtitle">Auditoría de ingresos y salidas del sistema</p>
        </div>
      </div>

      <div className="logs-container glass-card">
        {logs.length === 0 ? (
          <div className="empty-state">
            <HiOutlineClock className="empty-icon" />
            <h3>No hay registros</h3>
            <p>Aún no se han registrado ingresos al sistema.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Evento</th>
                  <th>IP Address</th>
                  <th>Navegador</th>
                  <th>Fecha y Hora</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} id={`log-row-${log.id}`}>
                    <td className="user-cell">
                      <div className="user-info">
                        <div className="user-avatar">
                          <HiOutlineUser />
                        </div>
                        <div className="user-details">
                          <span className="user-name">
                            {log.usuario ? `${log.usuario.nombres} ${log.usuario.apellidos}` : 'Usuario Eliminado'}
                          </span>
                          <span className="user-email">
                            {log.usuario ? log.usuario.correo : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${log.evento === 'INGRESO' ? 'status-active' : 'status-inactive'}`}>
                        {log.evento}
                      </span>
                    </td>
                    <td className="ip-cell">
                      <HiOutlineGlobeAlt className="cell-icon" />
                      {log.ip}
                    </td>
                    <td className="browser-cell">
                      <div className="browser-info" title={log.navegador}>
                        <HiOutlineDesktopComputer className="cell-icon" />
                        <span className="browser-text">{log.navegador.length > 30 ? log.navegador.substring(0, 30) + '...' : log.navegador}</span>
                      </div>
                    </td>
                    <td className="date-cell">
                      {new Date(log.fecha_hora).toLocaleString('es-BO', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogs;
