import { useState } from 'react';
import { ROUNDS, getTodayString, validateApplication, validateField } from '../Utils/helpers';

const INITIAL_FORM = {
  company: '',
  role: '',
  round: 'Applied',
  appliedDate: getTodayString(),
  jobLink: ''
};

function ApplicationForm({ onAddApplication }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time inline field validation / clearing
    if (errors[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleReset = () => {
    setFormData({ ...INITIAL_FORM, appliedDate: getTodayString() });
    setErrors({});
  };

  const handleSubmit = (event) => {
    if (event) event.preventDefault();

    const validationErrors = validateApplication(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onAddApplication({
      id: crypto.randomUUID(),
      company: formData.company.trim(),
      role: formData.role.trim(),
      round: formData.round,
      appliedDate: formData.appliedDate,
      jobLink: formData.jobLink.trim()
    });

    handleReset();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      handleReset();
    }
  };

  return (
    <form 
      className="application-form card" 
      onSubmit={handleSubmit} 
      onKeyDown={handleKeyDown}
      noValidate
    >
      <h2>Add Application</h2>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="company">Company *</label>
          <input
            id="company"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g. Stripe"
            className={errors.company ? 'input-error' : ''}
          />
          {errors.company && <p className="error-message">{errors.company}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="role">Role *</label>
          <input
            id="role"
            name="role"
            type="text"
            value={formData.role}
            onChange={handleChange}
            placeholder="e.g. Frontend Engineer"
            className={errors.role ? 'input-error' : ''}
          />
          {errors.role && <p className="error-message">{errors.role}</p>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="round">Round</label>
          <select id="round" name="round" value={formData.round} onChange={handleChange}>
            {ROUNDS.map((round) => (
              <option key={round} value={round}>
                {round}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="appliedDate">Applied Date *</label>
          <input
            id="appliedDate"
            name="appliedDate"
            type="date"
            max={getTodayString()}
            value={formData.appliedDate}
            onChange={handleChange}
            className={errors.appliedDate ? 'input-error' : ''}
          />
          {errors.appliedDate && <p className="error-message">{errors.appliedDate}</p>}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="jobLink">Job Link *</label>
        <input
          id="jobLink"
          name="jobLink"
          type="text" /* Changed from type="url" to prevent browser native tooltip intercepts */
          value={formData.jobLink}
          onChange={handleChange}
          placeholder="https://company.com/careers/job-id"
          className={errors.jobLink ? 'input-error' : ''}
        />
        {errors.jobLink && <p className="error-message">{errors.jobLink}</p>}
      </div>

      <div className="form-actions">
        <button type="submit" className="primary-button">
          Add Application
        </button>
        <button type="button" className="cancel-button" onClick={handleReset}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ApplicationForm;