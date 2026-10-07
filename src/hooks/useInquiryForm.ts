import { useState, type FormEvent, type SyntheticEvent } from 'react';

type InquiryField = 'name' | 'email' | 'message' | 'timeline' | 'investment';

// custom, on-brand copy for each required field's native constraint-validation failure
const INQUIRY_FIELD_ERROR_MESSAGES: Record<InquiryField, (validity: ValidityState) => string> = {
  name: () => 'Please enter your name.',
  email: (validity) => (validity.typeMismatch ? 'Please enter a valid email address.' : 'Please enter your email address.'),
  message: () => 'Please tell us about your project.',
  timeline: () => 'Please select a desired timeline.',
  investment: () => 'Please select an estimated investment range.',
};

export function useInquiryForm() {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<InquiryField, string>>>({});

  // hooks into native constraint validation (required/type=email) instead of replacing it: the browser
  // still blocks submission and focuses the first invalid field on its own; this only swaps the native
  // validation bubble for an on-brand inline message associated via aria-describedby
  const handleFieldInvalid = (field: InquiryField) => (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    event.preventDefault();
    // canceling the native "invalid" event (to show our own message instead of the browser's bubble)
    // also opts out of the browser's own auto-focus-first-invalid-field behavior, so it's re-implemented
    // here: :invalid matches every currently-invalid control, in tree order, so the first match during
    // this validation pass is the same field the browser would otherwise have focused
    const field_ = event.currentTarget;
    const isFirstInvalid = field_ === field_.form?.querySelector(':invalid');
    // read the synthetic event's fields before setFieldErrors runs; React may invoke the state updater
    // again later (e.g. Strict Mode's dev-only double-invoke), by which point event.currentTarget is null
    const message = INQUIRY_FIELD_ERROR_MESSAGES[field](field_.validity);
    setFieldErrors((prev) => ({ ...prev, [field]: message }));
    if (isFirstInvalid) field_.focus();
  };

  const clearFieldError = (field: InquiryField) => (
    event: SyntheticEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!event.currentTarget.validity.valid) return;
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus('sending');
    const form = event.currentTarget;
    const formData = new FormData(form);
    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      await response.json().catch(() => null);

      if (response.ok) {
        form.reset();
        setFieldErrors({});
        setFormStatus('success');
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      setFormStatus('error');
      console.error('[Inquiry] status: error - request failed', error);
    }
  };

  return { formStatus, fieldErrors, handleFieldInvalid, clearFieldError, handleSubmit };
}
