import { useParams } from 'react-router-dom';

export default function DoctorAppointmentDetailPage() {
  const { id } = useParams();

  return (
    <div className="doctor-appointment-detail">
      <h1>Detalle de la cita #{id}</h1>
      <p>Próximamente: información completa de la cita y actualización de estado.</p>
    </div>
  );
}