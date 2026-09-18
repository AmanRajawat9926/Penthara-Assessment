export const ROUNDS = [
  'Applied',
  'Screen',
  'Interview',
  'Offer',
  'Rejected'
];

/**
 * Returns YYYY-MM-DD string for today in local system time.
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
 * Validates URLs strictly: requires http/https, clean parse, valid hostname with TLD.
 */
export const isValidUrl = (value) => {
  if (!value || typeof value !== 'string') return false;
  const trimmed = value.trim();
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    return url.hostname.includes('.') && url.hostname.length > 3;
  } catch {
    return false;
  }
};

/**
 * Ensures job link is a properly formatted URL with protocol for anchor href.
 */
export const formatUrl = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

/**
 * Single-field validation logic with accurate error messages.
 */
export const validateField = (name, value) => {
  const strVal = typeof value === 'string' ? value.trim() : '';
  const today = getTodayString();

  switch (name) {
    case 'company':
      if (!strVal) return 'Company name is required.';
      return '';
    case 'role':
      if (!strVal) return 'Job role is required.';
      return '';
    case 'appliedDate':
      if (!value) return 'Applied date is required.';
      if (value > today) return 'Applied date cannot be in the future.';
      return '';
    case 'jobLink':
      if (!strVal) return 'Job posting link is required.';
      if (!isValidUrl(strVal)) {
        return 'Please enter a valid URL (e.g. https://careers.company.com/job).';
      }
      return '';
    default:
      return '';
  }
};

/**
 * Full form validator. Returns key-value object of errors.
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