export const ROUNDS = [
  'Applied',
  'Screen',
  'Interview',
  'Offer',
  'Rejected'
];

/**
 * Formats a Date object or today's date to YYYY-MM-DD in local time.
 */
export const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Calculates days elapsed between an applied date (YYYY-MM-DD) and today.
 * Uses UTC dates to avoid timezone/daylight savings shifts.
 */
export const calculateDaysSinceApplied = (appliedDateString) => {
  if (!appliedDateString) return 0;
  const parts = appliedDateString.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return 0;

  const [year, month, day] = parts;
  const appliedUtc = Date.UTC(year, month - 1, day);

  const now = new Date();
  const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = todayUtc - appliedUtc;
  return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
};

/**
 * Determines whether an application is stale (>14 days in Applied or Screen).
 */
export const isApplicationStale = (application) => {
  if (!application || !application.appliedDate) return false;
  const days = calculateDaysSinceApplied(application.appliedDate);
  const staleEligibleRounds = ['Applied', 'Screen'];
  return days > 14 && staleEligibleRounds.includes(application.round);
};

/**
 * Validates URLs strictly: requires http/https, clean parse, and a valid host with a TLD dot.
 * Rejects plain words (e.g., 'company', 'http://invalid').
 */
export const isValidUrl = (value) => {
  if (!value || typeof value !== 'string') return false;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    return url.hostname.includes('.') && url.hostname.length > 3;
  } catch {
    return false;
  }
};

/**
 * Single-field validation logic. Returns an error string or empty string.
 */
export const validateField = (name, value) => {
  const strVal = typeof value === 'string' ? value.trim() : '';
  const today = getTodayString();

  switch (name) {
    case 'company':
      if (!strVal) return 'Company name is required.';
      if (strVal.length < 2) return 'Company name must be at least 2 characters.';
      return '';
    case 'role':
      if (!strVal) return 'Job role is required.';
      if (strVal.length < 2) return 'Role must be at least 2 characters.';
      return '';
    case 'appliedDate':
      if (!value) return 'Applied date is required.';
      if (value > today) return 'Applied date cannot be in the future.';
      return '';
    case 'jobLink':
      if (!strVal) return 'Job posting link is required.';
      if (!isValidUrl(strVal)) {
        return 'Please enter a valid URL starting with http:// or https:// (e.g. https://careers.job.com/456).';
      }
      return '';
    default:
      return '';
  }
};

/**
 * Full form validator. Returns a map of field name -> error message.
 */
export const validateApplication = (formData) => {
  const fields = ['company', 'role', 'appliedDate', 'jobLink'];
  const errors = {};

  fields.forEach((field) => {
    const errorMsg = validateField(field, formData[field]);
    if (errorMsg) {
      errors[field] = errorMsg;
    }
  });

  return errors;
};