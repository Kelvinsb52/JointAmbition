import { Link } from 'react-router';
import { useInquiryForm } from '../../hooks/useInquiryForm';

export default function InquiryForm() {
  const { formStatus, fieldErrors, handleFieldInvalid, clearFieldError, handleSubmit } = useInquiryForm();

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <p className="form-required-note full">Fields marked with an asterisk (*) are required.</p>
        <label>
          Name<span aria-hidden="true" className="required-mark"> *</span>
          <input
            name="name"
            type="text"
            placeholder="Your name"
            required
            aria-invalid={fieldErrors.name ? 'true' : undefined}
            aria-describedby={fieldErrors.name ? 'name-error' : undefined}
            onInvalid={handleFieldInvalid('name')}
            onInput={clearFieldError('name')}
          />
          {fieldErrors.name && <span id="name-error" className="field-error">{fieldErrors.name}</span>}
        </label>
        <label>
          Email<span aria-hidden="true" className="required-mark"> *</span>
          <input
            name="email"
            type="email"
            placeholder="Your email"
            required
            aria-invalid={fieldErrors.email ? 'true' : undefined}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            onInvalid={handleFieldInvalid('email')}
            onInput={clearFieldError('email')}
          />
          {fieldErrors.email && <span id="email-error" className="field-error">{fieldErrors.email}</span>}
        </label>
        <label>Business / Venture<input name="business" type="text" placeholder="Business name" /></label>
        <label className="full">Website or Instagram<input name="website" type="text" placeholder="URL or handle" /></label>
        <label className="full">
          What are you building or refining?<span aria-hidden="true" className="required-mark"> *</span>
          <textarea
            name="message"
            placeholder="Tell us about your business, the current challenge, and what you want to change."
            required
            aria-invalid={fieldErrors.message ? 'true' : undefined}
            aria-describedby={['message-hint', fieldErrors.message ? 'message-error' : null].filter(Boolean).join(' ')}
            onInvalid={handleFieldInvalid('message')}
            onInput={clearFieldError('message')}
          />
          <span id="message-hint" className="field-hint">Tell us about your business, the current challenge, and what you want to change.</span>
          {fieldErrors.message && <span id="message-error" className="field-error">{fieldErrors.message}</span>}
        </label>
        <label htmlFor="timeline">Desired Timeline<span aria-hidden="true" className="required-mark"> *</span>
          <span className="select-wrap">
            <select
              id="timeline"
              name="timeline"
              defaultValue=""
              required
              aria-invalid={fieldErrors.timeline ? 'true' : undefined}
              aria-describedby={fieldErrors.timeline ? 'timeline-error' : undefined}
              onInvalid={handleFieldInvalid('timeline')}
              onChange={clearFieldError('timeline')}
            >
              <option value="" disabled>Select a timeline</option>
              <option value="4 weeks or less">4 weeks or less</option>
              <option value="5–8 weeks">5–8 weeks</option>
              <option value="9–12 weeks">9–12 weeks</option>
              <option value="3–6 months">3–6 months</option>
              <option value="More than 6 months">More than 6 months</option>
              <option value="Flexible / Not sure yet">Flexible / Not sure yet</option>
            </select>
          </span>
          {fieldErrors.timeline && <span id="timeline-error" className="field-error">{fieldErrors.timeline}</span>}
        </label>
        <label htmlFor="investment">Estimated Investment<span aria-hidden="true" className="required-mark"> *</span>
          <span className="select-wrap">
            <select
              id="investment"
              name="investment"
              defaultValue=""
              required
              aria-invalid={fieldErrors.investment ? 'true' : undefined}
              aria-describedby={fieldErrors.investment ? 'investment-error' : undefined}
              onInvalid={handleFieldInvalid('investment')}
              onChange={clearFieldError('investment')}
            >
              <option value="" disabled>Select an investment range</option>
              <option value="Up to $5,000">Up to $5,000</option>
              <option value="$5,000–$10,000">$5,000–$10,000</option>
              <option value="$10,000–$20,000">$10,000–$20,000</option>
              <option value="$20,000–$35,000">$20,000–$35,000</option>
              <option value="$35,000–$50,000">$35,000–$50,000</option>
              <option value="$50,000+">$50,000+</option>
              <option value="Not sure yet">Not sure yet</option>
            </select>
          </span>
          {fieldErrors.investment && <span id="investment-error" className="field-error">{fieldErrors.investment}</span>}
        </label>
        <input name="websiteUrl" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: 'none' }} />
      </div>
      <button className="submit" type="submit" disabled={formStatus === 'sending'}>
        {formStatus === 'sending' ? 'Sending...' : 'Begin With Intention'}
      </button>
      <p className="form-privacy-note">
        We&rsquo;ll use the information you provide to evaluate and respond to your inquiry. See our{' '}
        <Link to="/privacy">Privacy Policy</Link> for more information.
      </p>
      <div role="status">
        {formStatus === 'sending' && <p className="form-status">Sending your inquiry…</p>}
        {formStatus === 'success' && <p className="form-status">Thank you. Your inquiry has been sent.</p>}
        {formStatus === 'error' && <p className="form-status">Something went wrong. Please try again.</p>}
      </div>
    </form>
  );
}
