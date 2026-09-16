export const ROUNDS = [
  'Applied',
  'Screen',
  'Interview',
  'Offer',
  'Rejected'
];

/**
 * Returns today's date formatted as YYYY-MM-DD in local time.
 */
export const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Calculates days elapsed between an applied date string and today.
 */
export const calculateDaysSinceApplied = (appliedDateString) => {
  if (!appliedDateString) return 0;
  const applied = new Date(`${appliedDateString}T00:00:00`);
  const today = new Date(`${getTodayString()}T00:00:00`);
  const diffTime = today - applied;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

/**
 * Determines whether an application is stale (>14 days and in Applied or Screen).
 */
export const isApplicationStale = (application) => {
  if (!application || !application.appliedDate) return false;
  const days = calculateDaysSinceApplied(application.appliedDate);
  const eligibleRounds = ['Applied', 'Screen'];
  return days > 14 && eligibleRounds.includes(application.round);
};

/**
 * Validates URLs: Must use http/https, parse cleanly, and contain a valid hostname with a dot.
 * Rejects plain words (e.g., 'foo', 'not-a-url', 'http://invalid').
 */
export const isValidUrl = (value) => {
  if (!value || typeof value !== 'string') return false;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    // Hostname must include at least one dot (domain.tld)
    return url.hostname.includes('.') && url.hostname.length > 3;
  } catch {
    return false;
  }
};

/**
 * Single-field validator for real-time correction feedback.
 */
export const validateField = (name, value) => {
  const strVal = typeof value === 'string' ? value.trim() : '';

  switch (name) {
    case 'company':
      if (!strVal) return 'Company name is required.';
      return '';
    case 'role':
      if (!strVal) return 'Job role is required.';
      return '';
    case 'appliedDate':
      if (!value) return 'Applied date is required.';
      if (value > getTodayString()) return 'Applied date cannot be in the future.';
      return '';
    case 'jobLink':
      if (!strVal) return 'Job link is required.';
      if (!isValidUrl(strVal)) return 'Enter a valid URL starting with http:// or https:// (e.g. https://company.com/job).';
      return '';
    default:
      return '';
  }
};

/**
 * Full form validator used on submit.
 */
export const validateApplication = (formData) => {
  const fields = ['company', 'role', 'appliedDate', 'jobLink'];
  const errors = {};

  fields.forEach((field) => {
    const err = validateField(field, formData[field]);
    if (err) errors[field] = err;
  });

  return errors;
};