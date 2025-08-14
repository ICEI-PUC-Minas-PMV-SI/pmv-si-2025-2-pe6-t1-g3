
const Card = ({ children, className = '', padding = 'medium', shadow = 'medium' }) => {
  const paddings = {
    small: 'p-3',
    medium: 'p-6',
    large: 'p-8'
  };

  const shadows = {
    none: '',
    small: 'shadow-sm',
    medium: 'shadow-md',
    large: 'shadow-lg'
  };

  const classes = `bg-white rounded-lg border ${paddings[padding]} ${shadows[shadow]} ${className}`;

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Card;