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
 * Determines whether an application is considered stale (>14 days and in Applied/Screen).
 */
export const isApplicationStale = (application) => {
  const days = calculateDaysSinceApplied(application.appliedDate);
  const eligibleRounds = ['Applied', 'Screen'];
  return days > 14 && eligibleRounds.includes(application.round);
};

/**
 * Validates URLs starting with http:// or https:// with valid hosts.
 */
export const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Controlled field validation rules for create and edit.
 */
export const validateApplication = (formData) => {
  const errors = {};

  if (!formData.company || !formData.company.trim()) {
    errors.company = 'Company is required.';
  }

  if (!formData.role || !formData.role.trim()) {
    errors.role = 'Role is required.';
  }

  if (!formData.appliedDate) {
    errors.appliedDate = 'Applied date is required.';
  } else if (formData.appliedDate > getTodayString()) {
    errors.appliedDate = 'Applied date cannot be in the future.';
  }

  const trimmedLink = formData.jobLink ? formData.jobLink.trim() : '';
  if (!trimmedLink) {
    errors.jobLink = 'Job link is required.';
  } else if (!isValidUrl(trimmedLink)) {
    errors.jobLink = 'Enter a valid URL starting with http:// or https://.';
  }

  return errors;
};