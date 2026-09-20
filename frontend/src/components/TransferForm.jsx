function TransferForm({
  newOwner,
  setNewOwner,
  onSubmit,
  transferring,
  transferMessage,
}) {
  function handleChange(event) {
    setNewOwner(event.target.value);
  }

  const isError =
    transferMessage &&
    transferMessage.startsWith('Error:');

  return (
    <form
      className="transfer-form"
      onSubmit={onSubmit}
    >
      <div className="form-group">
        <label htmlFor="newOwner">
          New Owner
        </label>

        <input
          id="newOwner"
          name="newOwner"
          type="text"
          placeholder="Enter new owner name"
          value={newOwner}
          onChange={handleChange}
          disabled={transferring}
          autoComplete="off"
        />
      </div>

      {/* Transaction Progress */}
      {transferring && (
        <div className="transaction-status">
          <div className="transaction-spinner"></div>

          <div>
            <strong>
              Blockchain transaction in progress
            </strong>

            <p>
              Submitting ownership transfer to
              Hyperledger Fabric...
            </p>
          </div>
        </div>
      )}

      {/* Result Message */}
      {transferMessage && !transferring && (
        <div
          className={
            isError
              ? 'form-message form-message-error'
              : 'form-message form-message-success'
          }
        >
          {transferMessage}
        </div>
      )}

      <button
        type="submit"
        className="transfer-button"
        disabled={transferring}
      >
        {transferring
          ? 'Processing Transaction...'
          : 'Confirm Transfer'}
      </button>
    </form>
  );
}

export default TransferForm;