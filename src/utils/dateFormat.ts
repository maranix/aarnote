/**
 * Format a date to relative time (e.g., "2 hours ago", "3 days ago")
 * @param date - Date string, Date object, or timestamp number
 * @returns Formatted relative time string
 */
export const formatRelativeTime = (date: string | Date | number): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  // Less than a minute
  if (diffInSeconds < 60) {
    return diffInSeconds <= 1 ? 'just now' : `${diffInSeconds} seconds ago`;
  }

  // Less than an hour
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
  }

  // Less than a day
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
  }

  // Less than a week
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
  }

  // Less than a month
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`;
  }

  // Less than a year
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
  }

  // More than a year
  const diffInYears = Math.floor(diffInDays / 365);
  return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
};

/**
 * Format a date to a readable string
 * @param date - Date string, Date object, or timestamp number
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export const formatDate = (date: string | Date | number): string => {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format a date with time
 * @param date - Date string, Date object, or timestamp number
 * @returns Formatted date and time string (e.g., "Jan 15, 2024 at 3:45 PM")
 */
export const formatDateTime = (date: string | Date | number): string => {
  const d = new Date(date);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
};
