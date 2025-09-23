import React from 'react';

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  minLength?: number;
  disabled?: boolean;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ value, onChange, minLength = 6, disabled }) => {
  const tooShort = value.length > 0 && value.length < minLength;

  return (
    <div>
      <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        disabled={disabled}
        className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
        placeholder="Enter your password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {tooShort && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400" aria-live="polite">Please enter the full password.</p>
      )}
    </div>
  );
};

export default PasswordField;


