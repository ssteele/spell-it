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

  const [frequentlyErroredWords, setFrequentlyErroredWords] = useState([]);

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

      setFrequentlyErroredWords(progressEntries
        .filter((entry) => entry?.isComplete && entry?.errors > 0)
        .sort((a, b) => b?.errors - a?.errors)
      );
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

  const renderFrequentlyErroredWords = () => {
    const words = frequentlyErroredWords.map(({input, errors}) => `${input} (${errors})`);
    return (
      <span>
        {words.join(', ')}
      </span>
    );
  }

  return (
    <>
      <section className="w-9/12 my-8 mx-auto text-lg lg:text-xl lg:w-1/2">
        <h1 className="mb-8 text-2xl lg:mb-12 lg:text-4xl">Report</h1>

        <section className="mt-4 grid grid-cols-2 gap-12">
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

        <section className="mt-4">
          <h2 className="mt-8 font-bold text-xl lg:text-2xl">Average Errors</h2>
          {reportRanges.map((range, idx) => !!range?.avg && (
            <section
              className="mt-4 grid grid-cols-2 gap-12"
              key={idx}
            >
              <label>{range?.label}:</label>
              <span>{Math.round(range?.avg * 1000) / 1000}</span>
            </section>
          ))}
        </section>

        <section className="mt-4">
          <h2 className="mt-8 font-bold text-xl lg:text-2xl">Misspelled Words</h2>
          <section className="mt-4">
            {renderFrequentlyErroredWords()}
          </section>
        </section>
      </section>
    </>
  );
}

export default Report;
