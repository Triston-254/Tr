import React, { useMemo, useState } from 'react';

const STATUSES = ['Done', 'In Progress', 'Postponed', 'Refined'];

function StatusPill({ status }) {
  const cls =
    status === 'Done'
      ? 'pill pillDone'
      : status === 'In Progress'
        ? 'pill pillProgress'
        : status === 'Postponed'
          ? 'pill pillPostponed'
          : 'pill pillRefined';

  return <span className={cls}>{status}</span>;
}

export default function AdminSubmissions({ submissions, onUpdateStatus, onRefresh, onToast }) {

  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return submissions;
    return submissions.filter((s) => {
      const blob = [
        s.name,
        s.phone,
        s.location,
        s.organization,
        s.feedback,
        s.status,
        s.id,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return blob.includes(q);
    });
  }, [query, submissions]);

  return (
    <div className="page">
      <div className="container">
        <div className="headerRow headerRowBetween">
          <div>
            <h1 className="pageTitle">Submissions</h1>
            <p className="pageSubtitle">Update status.</p>
          </div>
          <div className="badge badgeAdmin">Admin</div>
        </div>

        <div className="toolbar">
          <input
            className="input inputToolbar"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search submissions..."
          />
        </div>

        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Location</th>
                <th>Organization</th>
                <th>Phone</th>
                <th>Feedback</th>
                <th>Status</th>
                <th style={{ width: 180 }}>Update</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td className="mono">{s.id}</td>
                  <td>{s.name || <span className="muted">—</span>}</td>
                  <td>{s.location || <span className="muted">—</span>}</td>
                  <td>{s.organization || <span className="muted">—</span>}</td>
                  <td className="mono">{s.phone || <span className="muted">—</span>}</td>
                  <td className="feedbackCell">
                    <div className="feedbackText">{s.feedback}</div>
                  </td>
                  <td>
                    <StatusPill status={s.status} />
                  </td>
                  <td>
                    <select
                      className="select"
                      value={s.status}
                      onChange={async (e) => {
                        const nextStatus = e.target.value;
                        try {
                          await onUpdateStatus?.(s.id, nextStatus);
                          onToast?.({
                            type: 'success',
                            message: `Status updated to: ${nextStatus}`,
                          });
                        } catch (err) {
                          onToast?.({
                            type: 'error',
                            message: 'Failed to update status',
                          });
                        }
                      }}
                    >
                      {STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                   
                  </td>
                </tr>
              ))}

              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="emptyState">
                    No submissions match your search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

