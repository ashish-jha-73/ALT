function formatPercent(value) {
  return Math.round((value || 0) * 100);
}

function getStatusLabel(status) {
  if (status === 'completed') return 'Completed';
  if (status === 'unlocked') return 'In Progress';
  return 'Locked';
}

function getStatusClass(status) {
  if (status === 'completed') return 'checkpoint-screen__status--completed';
  if (status === 'unlocked') return 'checkpoint-screen__status--unlocked';
  return 'checkpoint-screen__status--locked';
}

export default function CheckpointScreen({ checkpoint, onContinue, loading }) {
  const nodes = checkpoint?.nodes || [];
  const completedCount = Number(checkpoint?.completedCount || nodes.filter((node) => node.status === 'completed').length);
  const totalCount = Number(checkpoint?.totalCount || nodes.length || 1);
  const progressRatio = Math.max(0, Math.min(1, totalCount > 0 ? completedCount / totalCount : 0));

  return (
    <div className="checkpoint-screen anim-fade-in">
      <div className="checkpoint-screen__hero">
        <h2 className="checkpoint-screen__title">Topic Checkpoint Reached</h2>
        <p className="checkpoint-screen__subtitle">
          Nice work. You completed <strong>{checkpoint?.conceptLabel || 'a topic'}</strong>. Here is your current progress matrix.
        </p>
      </div>

      <div className="checkpoint-screen__card">
        <div className="checkpoint-screen__overview">
          <div>
            <p className="checkpoint-screen__label">Topics Completed</p>
            <p className="checkpoint-screen__value">{completedCount} / {totalCount}</p>
          </div>
          <div>
            <p className="checkpoint-screen__label">Overall Completion</p>
            <p className="checkpoint-screen__value">{formatPercent(progressRatio)}%</p>
          </div>
        </div>
        <div className="checkpoint-screen__track" aria-hidden="true">
          <div className="checkpoint-screen__fill" style={{ width: `${formatPercent(progressRatio)}%` }} />
        </div>
      </div>

      <div className="checkpoint-screen__card">
        <h3 className="checkpoint-screen__matrix-title">Progress Matrix</h3>
        <div className="checkpoint-screen__matrix-wrap">
          <table className="checkpoint-screen__matrix">
            <thead>
              <tr>
                <th>Topic</th>
                <th>Status</th>
                <th>Mastery</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map((node) => {
                const masteryPercent = formatPercent(node.mastery || 0);
                return (
                  <tr key={node.id}>
                    <td>{node.label || node.id}</td>
                    <td>
                      <span className={`checkpoint-screen__status ${getStatusClass(node.status)}`}>
                        {getStatusLabel(node.status)}
                      </span>
                    </td>
                    <td>
                      <div className="checkpoint-screen__mastery-cell">
                        <div className="checkpoint-screen__mastery-track" aria-hidden="true">
                          <div className="checkpoint-screen__mastery-fill" style={{ width: `${masteryPercent}%` }} />
                        </div>
                        <span>{masteryPercent}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <button type="button" className="btn-primary" onClick={onContinue} disabled={loading}>
        {loading ? 'Loading Next Question...' : 'Continue To Next Topic'}
      </button>
    </div>
  );
}
