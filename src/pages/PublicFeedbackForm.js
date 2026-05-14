import React, { useMemo, useRef, useState } from 'react';
import { collection, doc, setDoc, serverTimestamp, runTransaction, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function PublicFeedbackForm({ onSubmitted }) {
  const initial = useMemo(
    () => ({
      name: '',
      phone: '',
      location: '',
      organization: '',
      feedback: '',
    }),
    []
  );

  const [form, setForm] = useState(initial);
  const [touched, setTouched] = useState({ feedback: false });
  const feedbackRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const feedbackError = form.feedback.trim().length === 0;

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setTouched({ feedback: true });

    if (feedbackError) {
      // focus feedback input when empty
      feedbackRef.current?.focus?.();
      return;
    }

    setLoading(true);

    try {
      console.log('Submitting feedback to Firestore...');
      
      // Use transaction to increment counter and create document with sequential ID
      const counterRef = doc(db, 'counters', 'submissions');
      const newId = await runTransaction(db, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        
        if (!counterDoc.exists()) {
          // Initialize counter if it doesn't exist
          transaction.set(counterRef, { count: 1 });
          return 1;
        }
        
        const currentCount = counterDoc.data().count || 0;
        const newCount = currentCount + 1;
        transaction.update(counterRef, { count: newCount });
        return newCount;
      });

      // Create document with the sequential ID as string
      const docRef = doc(db, 'submissions', String(newId));
      await setDoc(docRef, {
        ...form,
        createdAt: serverTimestamp(),
        status: 'In Progress'
      });
      
      console.log('Feedback submitted successfully with ID:', newId);

      setSubmitted(true);
      // refresh admin list immediately after submit
      await onSubmitted?.();
      setForm(initial);
      setTouched({ feedback: false });
      
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert('Failed to submit feedback: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="headerRow">
          <div>
            <h1 className="pageTitle">Submit Feedback / Complaint</h1>
          </div>
          <div className="badge">Public</div>
        </div>

        {submitted ? (
          <div className="successCard" role="status">
            <div className="successTitle">Thank you!</div>
            <div className="successText">
              Your submission has been captured. We appreciate your feedback and will work on it.
            </div>
            <button
              className="btn btnPrimary"
              type="button"
              onClick={() => setSubmitted(false)}
            >
              Submit another
            </button>
          </div>
        ) : (
          <form className="formCard" onSubmit={onSubmit}>
            <div className="grid2">
              <label className="field">
                <span className="label">Name (Optional)</span>
                <input
                  className="input"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Your name"
                />
              </label>

              <label className="field">
                <span className="label">Phone Number (Optional)</span>
                <input
                  className="input"
                  type="tel"
                  inputMode="numeric"
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="0712345678"
                />
              </label>
            </div>

            <div className="grid2">
              <label className="field">
                <span className="label">Location (Optional)</span>
                <input
                  className="input"
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={onChange}
                  placeholder="City / Area"
                />
              </label>

              <label className="field">
                <span className="label">Organization (Optional)</span>
                <input
                  className="input"
                  type="text"
                  name="organization"
                  value={form.organization}
                  onChange={onChange}
                  placeholder="Company / School"
                />
              </label>
            </div>

            <label className="field">
              <span className="label">
                Feedback / Complaint <span className="required">*</span>
              </span>
              <textarea
                ref={feedbackRef}
                className="textarea"
                name="feedback"
                value={form.feedback}
                onChange={onChange}
                onBlur={() => setTouched((t) => ({ ...t, feedback: true }))}
                placeholder="Write your feedback or complaint here..."
                rows={6}
              />
              {touched.feedback && feedbackError ? (
                <div className="errorText">Feedback/Complaint is required.</div>
              ) : (
                <div className="helpText">Be specific so we can help faster.</div>
              )}
            </label>

            <div className="formActions">
              <button 
                className="btn btnPrimary" 
                type="submit" 
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ animation: 'spin 1s linear infinite' }}
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.3" />
                    <path 
                      d="M12 2C6.48 2 2 6.48 2 12" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}