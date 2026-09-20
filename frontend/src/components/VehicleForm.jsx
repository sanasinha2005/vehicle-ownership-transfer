function VehicleForm({
  form,
  setForm,
  onSubmit,
  submitting,
  formMessage,
}) {
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  const isError =
    formMessage && formMessage.startsWith('Error:');

  return (
    <form className="vehicle-form" onSubmit={onSubmit}>
      <div className="form-grid">
        {/* Vehicle ID */}
        <div className="form-group">
          <label htmlFor="vehicleId">
            Vehicle ID
          </label>

          <input
            id="vehicleId"
            name="vehicleId"
            type="text"
            placeholder="e.g. V005"
            value={form.vehicleId}
            onChange={handleChange}
            disabled={submitting}
            autoComplete="off"
          />
        </div>

        {/* Registration Number */}
        <div className="form-group">
          <label htmlFor="registrationNumber">
            Registration Number
          </label>

          <input
            id="registrationNumber"
            name="registrationNumber"
            type="text"
            placeholder="e.g. TN05EF9999"
            value={form.registrationNumber}
            onChange={handleChange}
            disabled={submitting}
            autoComplete="off"
          />
        </div>

        {/* Manufacturer */}
        <div className="form-group">
          <label htmlFor="manufacturer">
            Manufacturer
          </label>

          <input
            id="manufacturer"
            name="manufacturer"
            type="text"
            placeholder="e.g. Hyundai"
            value={form.manufacturer}
            onChange={handleChange}
            disabled={submitting}
            autoComplete="off"
          />
        </div>

        {/* Model */}
        <div className="form-group">
          <label htmlFor="model">
            Model
          </label>

          <input
            id="model"
            name="model"
            type="text"
            placeholder="e.g. Creta"
            value={form.model}
            onChange={handleChange}
            disabled={submitting}
            autoComplete="off"
          />
        </div>

        {/* Year */}
        <div className="form-group">
          <label htmlFor="year">
            Year
          </label>

          <input
            id="year"
            name="year"
            type="number"
            placeholder="e.g. 2025"
            value={form.year}
            onChange={handleChange}
            disabled={submitting}
            min="1900"
            max={new Date().getFullYear() + 1}
          />
        </div>

        {/* Owner */}
        <div className="form-group">
          <label htmlFor="owner">
            Initial Owner
          </label>

          <input
            id="owner"
            name="owner"
            type="text"
            placeholder="e.g. Sana"
            value={form.owner}
            onChange={handleChange}
            disabled={submitting}
            autoComplete="off"
          />
        </div>
      </div>

      {/* Message */}
      {formMessage && (
        <div
          className={
            isError
              ? 'form-message form-message-error'
              : 'form-message form-message-success'
          }
        >
          {formMessage}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="register-button"
        disabled={submitting}
      >
        {submitting
          ? 'Registering...'
          : 'Register Vehicle'}
      </button>
    </form>
  );
}

export default VehicleForm;