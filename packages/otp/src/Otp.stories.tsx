// Otp.stories.tsx
import React, { useState } from 'react';
import * as OTP from '.';

// Basic CSS styles defined as a string (or you can import from a file if preferred)
const styles = `
  .otp-input {
    width: 48px;
    height: 48px;
    text-align: center;
    font-size: 18px;
    border: 1px solid #ccc;
    border-radius: 6px;
    margin-right: 8px;
  }

  .otp-input:focus {
    outline: 2px solid #0070f3;
  }

  .otp-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }

  .otp-container {
    margin-bottom: 16px;
  }
`;

export default { title: 'OTP Input' };

export const Default = () => {
  const [value, setValue] = useState('');
  return (
    <div>
      <h3>Default OTP</h3>
      <OTP.Root onChange={setValue}>
        <OTP.Input className="otp-input" />
        <OTP.Input className="otp-input" />
        <OTP.Input className="otp-input" />
        <OTP.Input className="otp-input" />
      </OTP.Root>
      <p>Value: {value || '—'}</p>
    </div>
  );
};

export const WithLabel = () => {
  const [value, setValue] = useState('');
  return (
    <div className="otp-container">
      <style>{styles}</style>
      <h3>With Label</h3>
      <OTP.Root onChange={setValue}>
        <OTP.Label className="otp-label">Enter Code</OTP.Label>
        <OTP.Input className="otp-input" />
        <OTP.Input className="otp-input" />
        <OTP.Input className="otp-input" />
        <OTP.Input className="otp-input" />
      </OTP.Root>
      <p>Value: {value || '—'}</p>
    </div>
  );
};

export const AlphanumericWithJoiner = () => {
  const [value, setValue] = useState('');
  return (
    <div className="otp-container">
      <style>{styles}</style>
      <h3>Referral Code (Joiner "-")</h3>
      <OTP.Root onChange={setValue} type="text" joiner="-">
        <OTP.Label className="otp-label">Referral Code</OTP.Label>
        <OTP.Input className="otp-input" />
        <OTP.Input className="otp-input" />
        <OTP.Input className="otp-input" />
        <OTP.Input className="otp-input" />
      </OTP.Root>
      <p>Code: {value || '—'}</p>
    </div>
  );
};

export const NumericWithJoiner = () => {
  const [value, setValue] = useState('');
  return (
    <div className="otp-container">
      <style>{styles}</style>
      <h3>Numeric Code (Joiner "-")</h3>
      <OTP.Root onChange={setValue} type="number" joiner="-">
        <OTP.Label className="otp-label">Numeric Code</OTP.Label>
        <OTP.Input className="otp-input" />
        <OTP.Input className="otp-input" />
        <OTP.Input className="otp-input" />
        <OTP.Input className="otp-input" />
      </OTP.Root>
      <p>Code: {value || '—'}</p>
    </div>
  );
};

export const PasswordType = () => {
  const [value, setValue] = useState('');
  return (
    <div className="otp-container">
      <style>{styles}</style>
      <h3>Password (Masked) OTP</h3>
      <OTP.Root onChange={setValue} type="number" password>
        <OTP.Label className="otp-label">Secure Code</OTP.Label>
        {[...Array(6)].map((_, i) => (
          <OTP.Input key={i} className="otp-input" />
        ))}
      </OTP.Root>
      <p>Code: {value || '—'}</p>
    </div>
  );
};
