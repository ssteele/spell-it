import { useEffect, useState } from 'react'

import { getUserProgress } from '@/Repositories/Progress';
import { getUsers } from '@/Repositories/User';

export function Report({ db }) {
  const [users, setUsers] = useState([]);

  const [selectedUserId, setSelectedUserId] = useState(() => {
    const stateSelectedUserId = localStorage.getItem('state-selected-report-user-id');
    return stateSelectedUserId ? stateSelectedUserId : '';
  });

  const [reportRanges, setReportRanges] = useState([
    {
      id: 'hour',
      label: 'Hour',
      ms: 3600000,
      avg: null,
    },
    {
      id: 'day',
      label: 'Day',
      ms: 86400000,
      avg: null,
    },
    {
      id: 'week',
      label: 'Week',
      ms: 604800000,
      avg: null,
    },
    {
      id: 'month',
      label: 'Month',
      ms: 2592000000,
      avg: null,
    },
    {
      id: 'year',
      label: 'Year',
      ms: 31557600000,
      avg: null,
    },
    {
      id: 'all',
      label: 'All',
      ms: null,
      avg: null,
    },
  ]);

  useEffect(() => {
    getUsers(db).then((users) => {
      setUsers(users);
    }).catch((error) => {
      console.error('Error getting users:', error);
    });
  }, [db]);

  useEffect(() => {
    const timestamp = Date.now();
    getUserProgress(db, Number(selectedUserId)).then((progressEntries) => {
      setReportRanges(reportRanges.map((range) => {
        range.avg = calculateAverageErrorsForSpan(progressEntries, range?.ms, timestamp);
        return range;
      }));
    }).catch((error) => {
      console.error('Error getting progress:', error);
    });
  }, [selectedUserId]);

  const persistSelectedUserId = (userId) => {
    setSelectedUserId(userId);
    localStorage.setItem('state-selected-report-user-id', userId);
  }

  const calculateAverageErrorsForSpan = (progressEntries, timespan, timestamp) => {
    const entries = progressEntries.filter((entry) => {
      if (!timespan) {
        return true;
      }

      const timeAgo = timestamp - timespan;
      return entry.timestamp > timeAgo;
    });

    const totalErrors = entries.reduce((sum, entry) => sum + entry.errors, 0);
    const attempts = entries.length;
    return attempts ? totalErrors / attempts : null;
  }

  return (
    <>
      <section className="w-1/2 mt-16 mx-auto">
        <h1 className="mb-20 text-6xl lg:mb-12 lg:text-4xl">Report</h1>

        <section className="text-4xl lg:text-2xl">
          <section className="mt-8 lg:mt-4 grid grid-cols-2 gap-12">
            <label htmlFor="selectUserId">User:</label>
            <select
              name="selectUserId"
              id="selectUserId"
              value={selectedUserId}
              onChange={(e) => persistSelectedUserId(e?.target?.value)}
            >
              {!selectedUserId && (
                <option value="0"></option>
              )}

              {users.length && users.map((u, idx) => (
                <option
                  key={idx}
                  value={u?.id}
                >{u?.name}</option>
              ))}
            </select>
          </section>
        </section>

        <section className="text-4xl lg:text-2xl">
          <h2 className="my-20 text-4xl lg:mb-12 lg:text-3xl">Average Errors</h2>
          {reportRanges.map((range, idx) => 
            !!range?.avg && (
              <section
                className="mt-8 lg:mt-4 grid grid-cols-2 gap-12"
                key={idx}
              >
                <label>{range?.label}:</label>
                <span>{range?.avg}</span>
              </section>
            )
          )}
        </section>
      </section>
    </>
  );
}

export default Report;
