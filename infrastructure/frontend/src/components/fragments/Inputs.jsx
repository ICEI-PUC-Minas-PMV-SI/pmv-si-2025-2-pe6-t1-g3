const Inputs = ({ label, ...rest }) => {
  return (
    <>
      {label && <label>{label}</label>}

      <input {...rest}></input>
    </>
  );
};

export default Inputs;
