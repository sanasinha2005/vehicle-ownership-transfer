function VehicleCard({
  vehicle,
  onViewDetails,
}) {
  return (
    <div className="vehicle-card">
      <div className="vehicle-card-header">
        <div>
          <h4>{vehicle.vehicleId}</h4>
          <p>{vehicle.registrationNumber}</p>
        </div>

        <span className="badge">
          {vehicle.status}
        </span>
      </div>

      <div className="vehicle-info">
        <div>
          <span>Manufacturer</span>
          <strong>{vehicle.manufacturer}</strong>
        </div>

        <div>
          <span>Model</span>
          <strong>{vehicle.model}</strong>
        </div>

        <div>
          <span>Year</span>
          <strong>{vehicle.year}</strong>
        </div>

        <div>
          <span>Current Owner</span>
          <strong>{vehicle.currentOwner}</strong>
        </div>
      </div>

      <button
        type="button"
        className="details-button"
        onClick={() =>
          onViewDetails(vehicle.vehicleId)
        }
      >
        View Details
      </button>
    </div>
  );
}

export default VehicleCard;