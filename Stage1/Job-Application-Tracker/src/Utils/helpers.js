export const ROUNDS = [
  'Applied',
  'Screen',
  'Interview',
  'Offer',
  'Rejected'
];

export const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

export const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export const validateApplication = (formData) => {
  const errors = {};

  if (!formData.company.trim()) {
    errors.company = 'Company is required.';
  }

  if (!formData.role.trim()) {
    errors.role = 'Role is required.';
  }

  if (!formData.appliedDate) {
    errors.appliedDate = 'Applied date is required.';
  } else if (formData.appliedDate > getTodayString()) {
    errors.appliedDate = 'Applied date cannot be in the future.';
  }

  if (!formData.jobLink.trim()) {
    errors.jobLink = 'Job link is required.';
  } else if (!isValidUrl(formData.jobLink.trim())) {
    errors.jobLink = 'Enter a valid URL starting with http:// or https://.';
  }

  return errors;
};