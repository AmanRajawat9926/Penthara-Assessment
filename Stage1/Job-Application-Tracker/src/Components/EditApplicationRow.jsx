import { useState } from 'react';
import { ROUNDS, getTodayString, validateApplication } from '../Utils/helpers';

function EditApplicationRow({ application, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    company: application.company,
    role: application.role,
    round: application.round,
    appliedDate: application.appliedDate,
    jobLink: application.jobLink
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const validationErrors = validateApplication(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSave({
      ...application,
      company: formData.company.trim(),
      role: formData.role.trim(),
      round: formData.round,
      appliedDate: formData.appliedDate,
      jobLink: formData.jobLink.trim()
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <form className="application-item editing" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
      <div className="edit-grid">
        <div className="form-field">
          <label>Company</label>
          <input
            name="company"
            value={formData.company}
            onChange={handleChange}
            autoFocus
          />
          {errors.company && <p className="error-message">{errors.company}</p>}
        </div>

        <div className="form-field">
          <label>Role</label>
          <input
            name="role"
            value={formData.role}
            onChange={handleChange}
          />
          {errors.role && <p className="error-message">{errors.role}</p>}
        </div>

        <div className="form-field">
          <label>Round</label>
          <select name="round" value={formData.round} onChange={handleChange}>
            {ROUNDS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Applied Date</label>
          <input
            type="date"
            name="appliedDate"
            max={getTodayString()}
            value={formData.appliedDate}
            onChange={handleChange}
          />
          {errors.appliedDate && <p className="error-message">{errors.appliedDate}</p>}
        </div>

        <div className="form-field full-width">
          <label>Job Link</label>
          <input
            type="url"
            name="jobLink"
            value={formData.jobLink}
            onChange={handleChange}
          />
          {errors.jobLink && <p className="error-message">{errors.jobLink}</p>}
        </div>
      </div>

      <div className="item-actions">
        <button type="submit" className="save-button">
          Save 
        </button>
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel 
        </button>
      </div>
    </form>
  );
}

export default EditApplicationRow;