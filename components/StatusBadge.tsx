import React from 'react';
import { CleaningStatus } from '../types';

interface StatusBadgeProps {
  status: CleaningStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusStyles: { [key in CleaningStatus]: { container: string; dot: string } } = {
    [CleaningStatus.ToBeCleaned]: {
      container: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
      dot: 'text-red-500 dark:text-red-400',
    },
    [CleaningStatus.InProgress]: {
      container: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
      dot: 'text-amber-500 dark:text-amber-400',
    },
    [CleaningStatus.Clean]: {
      container: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300',
      dot: 'text-green-500 dark:text-green-400',
    },
  };

  const { container, dot } = statusStyles[status];

  return (
    <span className={`inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium ${container}`}>
      <svg className={`h-1.5 w-1.5`} viewBox="0 0 6 6" aria-hidden="true">
        <circle cx={3} cy={3} r={3} fill="currentColor" className={dot} />
      </svg>
      {status}
    </span>
  );
};