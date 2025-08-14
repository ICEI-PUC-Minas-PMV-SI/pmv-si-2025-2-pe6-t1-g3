
const Input = ({ 
  label, 
  error, 
  type = 'text', 
  placeholder = '', 
  value, 
  onChange, 
  required = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200';
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300';
  const classes = `${baseClasses} ${errorClasses} ${className}`;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={classes}
        required={required}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;