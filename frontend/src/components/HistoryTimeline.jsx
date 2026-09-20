function HistoryTimeline({ history, loading, error }) {
  if (loading) {
    return <p>Loading blockchain history...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!history || history.length === 0) {
    return <p>No ownership history found.</p>;
  }

  return (
    <div className="history-list">
      {history.map((record, index) => {
        let vehicleData = {};

        try {
          vehicleData = JSON.parse(record.value);
        } catch (err) {
          console.error('Invalid history value:', err);
        }

        const timestamp =
          Number(record.timestamp.seconds) * 1000 +
          Math.floor(Number(record.timestamp.nanos) / 1000000);

        return (
          <div
            className="history-item"
            key={record.transactionId}
          >
            <div className="history-dot"></div>

            <div className="history-content">
              <div className="history-title">
                {index === history.length - 1
                  ? 'Vehicle Registered'
                  : 'Ownership Transfer'}
              </div>

              <p>
                Owner:{' '}
                <strong>
                  {vehicleData.currentOwner || 'Unknown'}
                </strong>
              </p>

              <p>Transaction ID:</p>

              <span className="transaction-id">
                {record.transactionId}
              </span>

              <p>
                {new Date(timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default HistoryTimeline;