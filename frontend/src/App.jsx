import { useEffect, useState } from 'react';

import Navbar from './components/Navbar';
import VehicleCard from './components/VehicleCard';
import VehicleForm from './components/VehicleForm';
import TransferForm from './components/TransferForm';
import HistoryTimeline from './components/HistoryTimeline';

const API_URL = 'http://localhost:8000';

function App() {
  // =========================
  // Dashboard
  // =========================

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // =========================
  // Register Vehicle
  // =========================

  const [form, setForm] = useState({
    vehicleId: '',
    registrationNumber: '',
    manufacturer: '',
    model: '',
    year: '',
    owner: '',
  });

  const [formMessage, setFormMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Used for the "new vehicle" animation
  const [newVehicleId, setNewVehicleId] = useState(null);

  // =========================
  // Vehicle Details
  // =========================

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState('');

  // =========================
  // Transfer Ownership
  // =========================

  const [transferVehicleId, setTransferVehicleId] = useState(null);
  const [newOwner, setNewOwner] = useState('');
  const [transferMessage, setTransferMessage] = useState('');
  const [transferring, setTransferring] = useState(false);

  // =========================
  // History
  // =========================

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');

  // =========================
  // Fetch all vehicles
  // =========================

  async function fetchVehicles() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/vehicles`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.details ||
            data.error ||
            'Failed to fetch vehicles'
        );
      }

      setVehicles(data);
    } catch (err) {
      console.error('Fetch vehicles error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Load vehicles when app starts
  useEffect(() => {
    fetchVehicles();
  }, []);

  // =========================
  // Register Vehicle
  // =========================

  async function handleSubmit(event) {
  event.preventDefault();

  setSubmitting(true);
  setFormMessage('');

  // =========================
  // Frontend Validation
  // =========================

  const vehicleId = form.vehicleId.trim();
  const registrationNumber = form.registrationNumber.trim();
  const manufacturer = form.manufacturer.trim();
  const model = form.model.trim();
  const owner = form.owner.trim();
  const year = Number(form.year);

  // Required fields
  if (
    !vehicleId ||
    !registrationNumber ||
    !manufacturer ||
    !model ||
    !form.year ||
    !owner
  ) {
    setFormMessage('Error: Please fill in all fields.');
    setSubmitting(false);
    return;
  }

  // Vehicle ID validation
  if (!/^[A-Za-z0-9-]+$/.test(vehicleId)) {
    setFormMessage(
      'Error: Vehicle ID can contain only letters, numbers, and hyphens.'
    );
    setSubmitting(false);
    return;
  }

  // Registration number validation
  if (!/^[A-Za-z0-9 -]+$/.test(registrationNumber)) {
    setFormMessage(
      'Error: Registration number contains invalid characters.'
    );
    setSubmitting(false);
    return;
  }

  // Year validation
  const currentYear = new Date().getFullYear();

  if (year < 1900 || year > currentYear + 1) {
    setFormMessage(
      `Error: Vehicle year must be between 1900 and ${currentYear + 1}.`
    );
    setSubmitting(false);
    return;
  }

  // Owner validation
  if (owner.length < 2) {
    setFormMessage(
      'Error: Owner name must contain at least 2 characters.'
    );
    setSubmitting(false);
    return;
  }

  // =========================
  // Duplicate Vehicle Check
  // =========================

  const duplicateVehicle = vehicles.some(
    (vehicle) =>
      vehicle.vehicleId.toLowerCase() ===
      vehicleId.toLowerCase()
  );

  if (duplicateVehicle) {
    setFormMessage(
      `Error: Vehicle ID "${vehicleId}" already exists.`
    );
    setSubmitting(false);
    return;
  }

  // =========================
  // Duplicate Registration Check
  // =========================

  const duplicateRegistration = vehicles.some(
    (vehicle) =>
      vehicle.registrationNumber.toLowerCase() ===
      registrationNumber.toLowerCase()
  );

  if (duplicateRegistration) {
    setFormMessage(
      `Error: Registration number "${registrationNumber}" already exists.`
    );
    setSubmitting(false);
    return;
  }

  // =========================
  // Send to Backend
  // =========================

  try {
    const response = await fetch(`${API_URL}/vehicles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vehicleId,
        registrationNumber,
        manufacturer,
        model,
        year,
        owner,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.details ||
          data.error ||
          'Failed to register vehicle'
      );
    }

    // Success message
    setFormMessage(
      `Vehicle ${data.vehicleId} registered successfully.`
    );

    // Trigger new-card animation
    setNewVehicleId(data.vehicleId);

    setTimeout(() => {
      setNewVehicleId(null);
    }, 1200);

    // Reset form
    setForm({
      vehicleId: '',
      registrationNumber: '',
      manufacturer: '',
      model: '',
      year: '',
      owner: '',
    });

    // Refresh dashboard
    await fetchVehicles();
  } catch (err) {
    console.error('Create vehicle error:', err);

    setFormMessage(`Error: ${err.message}`);
  } finally {
    setSubmitting(false);
  }
}

  // =========================
  // Open Vehicle Details
  // =========================

  async function handleViewDetails(vehicleId) {
    setDetailsLoading(true);
    setDetailsError('');
    setSelectedVehicle(null);

    setHistory([]);
    setHistoryError('');

    try {
      const [vehicleResponse, historyResponse] =
        await Promise.all([
          fetch(`${API_URL}/vehicles/${vehicleId}`),
          fetch(`${API_URL}/vehicles/${vehicleId}/history`),
        ]);

      const vehicleData = await vehicleResponse.json();
      const historyData = await historyResponse.json();

      if (!vehicleResponse.ok) {
        throw new Error(
          vehicleData.details ||
            vehicleData.error ||
            'Failed to fetch vehicle'
        );
      }

      if (!historyResponse.ok) {
        throw new Error(
          historyData.details ||
            historyData.error ||
            'Failed to fetch vehicle history'
        );
      }

      setSelectedVehicle(vehicleData);
      setHistory(historyData);
    } catch (err) {
      console.error('Vehicle details error:', err);
      setDetailsError(err.message);
    } finally {
      setDetailsLoading(false);
    }
  }

  // =========================
  // Close Vehicle Details
  // =========================

  function handleBackToDashboard() {
    setSelectedVehicle(null);
    setDetailsError('');

    setTransferVehicleId(null);
    setNewOwner('');
    setTransferMessage('');

    setHistory([]);
    setHistoryError('');
  }

  // =========================
  // Transfer Ownership
  // =========================

  async function handleTransfer(event) {
  event.preventDefault();

  if (!selectedVehicle) {
    return;
  }

  // =========================
  // Basic Validation
  // =========================

  const owner = newOwner.trim();

  if (!owner) {
    setTransferMessage(
      'Error: Please enter the new owner.'
    );
    return;
  }

  if (owner.length < 2) {
    setTransferMessage(
      'Error: New owner must contain at least 2 characters.'
    );
    return;
  }

  if (
    owner.toLowerCase() ===
    selectedVehicle.currentOwner.toLowerCase()
  ) {
    setTransferMessage(
      'Error: New owner must be different from the current owner.'
    );
    return;
  }

  // =========================
  // Confirmation
  // =========================

  const confirmed = window.confirm(
    `Transfer ownership of ${selectedVehicle.vehicleId}\n\n` +
      `Current owner: ${selectedVehicle.currentOwner}\n` +
      `New owner: ${owner}\n\n` +
      `This will create a new blockchain transaction. Continue?`
  );

  if (!confirmed) {
    return;
  }

  // =========================
  // Submit Transaction
  // =========================

  setTransferring(true);
  setTransferMessage('');

  try {
    const response = await fetch(
      `${API_URL}/vehicles/${selectedVehicle.vehicleId}/transfer`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newOwner: owner,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.details ||
          data.error ||
          'Failed to transfer ownership'
      );
    }

    setTransferMessage(
      `Ownership transferred successfully to ${data.newOwner}.`
    );

    // Update selected vehicle immediately
    setSelectedVehicle((prev) => ({
      ...prev,
      currentOwner: data.newOwner,
    }));

    // Refresh blockchain history
    await fetchHistory(selectedVehicle.vehicleId);

    // Refresh dashboard
    await fetchVehicles();

    // Reset form
    setNewOwner('');

    // Close transfer form
    setTransferVehicleId(null);
  } catch (err) {
    console.error(
      'Transfer ownership error:',
      err
    );

    setTransferMessage(
      `Error: ${err.message}`
    );
  } finally {
    setTransferring(false);
  }
}

  // =========================
  // Fetch History
  // =========================

  async function fetchHistory(vehicleId) {
    try {
      setHistoryLoading(true);
      setHistoryError('');

      const response = await fetch(
        `${API_URL}/vehicles/${vehicleId}/history`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.details ||
            data.error ||
            'Failed to fetch history'
        );
      }

      setHistory(data);
    } catch (err) {
      console.error('History error:', err);
      setHistoryError(err.message);
    } finally {
      setHistoryLoading(false);
    }
  }

  // =========================
  // Toggle Transfer Form
  // =========================

  function handleToggleTransfer(vehicleId) {
    if (transferVehicleId === vehicleId) {
      setTransferVehicleId(null);
      setTransferMessage('');
      setNewOwner('');
      return;
    }

    setTransferVehicleId(vehicleId);
    setTransferMessage('');
    setNewOwner('');
  }

  // =========================
  // Dashboard
  // =========================

  if (selectedVehicle) {
    return (
      <div className="app">
        <Navbar onDashboard={handleBackToDashboard} />

        <main className="main-content">
          {detailsLoading && (
            <section className="details-page">
              <div className="loading-state">
                Loading vehicle details...
              </div>
            </section>
          )}

          {detailsError && !detailsLoading && (
            <section className="details-page">
              <div className="error-message">
                {detailsError}
              </div>

              <button
                className="details-button"
                onClick={handleBackToDashboard}
              >
                ← Back to Dashboard
              </button>
            </section>
          )}

          {!detailsLoading &&
            !detailsError &&
            selectedVehicle && (
              <section className="details-page">
                {/* Back */}
                <button
                  className="back-button"
                  onClick={handleBackToDashboard}
                >
                  ← Back to Dashboard
                </button>

                {/* Vehicle Hero */}
                <div className="details-hero">
                  <div>
                    <p className="eyebrow">
                      VEHICLE DETAILS
                    </p>

                    <h1>
                      {selectedVehicle.manufacturer}{' '}
                      {selectedVehicle.model}
                    </h1>

                    <p className="details-id">
                      Vehicle ID: {selectedVehicle.vehicleId}
                    </p>
                  </div>

                  <div className="status-badge">
                    {selectedVehicle.status}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="details-grid">
                  <div className="detail-box">
                    <span>Registration Number</span>
                    <strong>
                      {selectedVehicle.registrationNumber}
                    </strong>
                  </div>

                  <div className="detail-box">
                    <span>Manufacturer</span>
                    <strong>
                      {selectedVehicle.manufacturer}
                    </strong>
                  </div>

                  <div className="detail-box">
                    <span>Model</span>
                    <strong>
                      {selectedVehicle.model}
                    </strong>
                  </div>

                  <div className="detail-box">
                    <span>Year</span>
                    <strong>
                      {selectedVehicle.year}
                    </strong>
                  </div>

                  <div className="detail-box">
                    <span>Current Owner</span>
                    <strong>
                      {selectedVehicle.currentOwner}
                    </strong>
                  </div>

                  <div className="detail-box">
                    <span>Created At</span>
                    <strong>
                      {selectedVehicle.createdAt
                        ? new Date(
                            selectedVehicle.createdAt
                          ).toLocaleString()
                        : 'N/A'}
                    </strong>
                  </div>
                </div>

                {/* Ownership Transfer */}
                <section className="details-section">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow">
                        OWNERSHIP
                      </p>

                      <h2>Transfer Ownership</h2>
                    </div>

                    <button
                      className="transfer-button"
                      onClick={() =>
                        handleToggleTransfer(
                          selectedVehicle.vehicleId
                        )
                      }
                    >
                      {transferVehicleId ===
                      selectedVehicle.vehicleId
                        ? 'Cancel'
                        : 'Transfer'}
                    </button>
                  </div>

                  {transferVehicleId ===
                    selectedVehicle.vehicleId && (
                    <TransferForm
                      newOwner={newOwner}
                      setNewOwner={setNewOwner}
                      onSubmit={handleTransfer}
                      transferring={transferring}
                      transferMessage={transferMessage}
                    />
                  )}
                </section>

                {/* History */}
                <section className="details-section">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow">
                        BLOCKCHAIN RECORD
                      </p>

                      <h2>Ownership History</h2>
                    </div>

                    <button
                      className="history-button"
                      onClick={() =>
                        fetchHistory(
                          selectedVehicle.vehicleId
                        )
                      }
                    >
                      Refresh
                    </button>
                  </div>

                  {historyLoading && (
                    <div className="loading-state">
                      Loading history...
                    </div>
                  )}

                  {historyError && (
                    <div className="error-message">
                      {historyError}
                    </div>
                  )}

                  {!historyLoading &&
                    !historyError && (
                      <HistoryTimeline
                        history={history}
                      />
                    )}
                </section>
              </section>
            )}
        </main>
      </div>
    );
  }

  // =========================
  // Dashboard View
  // =========================

  return (
    <div className="app">
      <Navbar onDashboard={handleBackToDashboard} />

      <main className="main-content">
        {/* Hero */}
        <section className="hero">
          <div>
            <p className="eyebrow">
              HYPERLEDGER FABRIC
            </p>

            <h1>
              Vehicle Ownership
              <span> on Blockchain</span>
            </h1>

            <p className="hero-description">
              Securely register vehicles, transfer ownership,
              and maintain a tamper-resistant history of every
              transaction.
            </p>
          </div>

          <div className="network-status">
            <span className="status-dot"></span>
            <span>Fabric Network Connected</span>
          </div>
        </section>

        {/* Statistics */}
        <section className="stats">
          <div className="stat-card">
            <span>Total Vehicles</span>
            <strong>{vehicles.length}</strong>
          </div>

          <div className="stat-card">
            <span>Active Vehicles</span>
            <strong>
              {
                vehicles.filter(
                  (vehicle) => vehicle.status === 'ACTIVE'
                ).length
              }
            </strong>
          </div>

          <div className="stat-card">
            <span>Blockchain Status</span>
            <strong className="stat-online">
              ONLINE
            </strong>
          </div>
        </section>

        {/* Register Vehicle */}
        <section className="form-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                VEHICLE REGISTRY
              </p>

              <h2>Register a Vehicle</h2>

              <p>
                Add a new vehicle to the blockchain ledger.
              </p>
            </div>
          </div>

          <VehicleForm
            form={form}
            setForm={setForm}
            onSubmit={handleSubmit}
            submitting={submitting}
            formMessage={formMessage}
          />
        </section>

        {/* Vehicle List */}
        <section className="vehicles-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                BLOCKCHAIN LEDGER
              </p>

              <h2>Registered Vehicles</h2>
            </div>

            <span className="vehicle-count">
              {vehicles.length} vehicle
              {vehicles.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading && (
            <div className="loading-grid">
              <div className="loading-card"></div>
              <div className="loading-card"></div>
              <div className="loading-card"></div>
            </div>
          )}

          {error && !loading && (
            <div className="error-message">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            vehicles.length === 0 && (
              <div className="empty-state">
                <h3>No vehicles registered</h3>
                <p>
                  Register your first vehicle to see it here.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            vehicles.length > 0 && (
              <div className="vehicle-grid">
                {vehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.vehicleId}
                    vehicle={vehicle}
                    onViewDetails={handleViewDetails}
                    isNew={
                      newVehicleId === vehicle.vehicleId
                    }
                  />
                ))}
              </div>
            )}
        </section>
      </main>
    </div>
  );
}

export default App;