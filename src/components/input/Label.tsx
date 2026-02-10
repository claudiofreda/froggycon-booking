type LabelProps = {
  htmlFor: string;
  text: string;
};

export const Label: React.FC<LabelProps> = ({ htmlFor, text }) => (
  <label className="label" htmlFor={htmlFor}>
    <span className="label-text">{text}</span>
  </label>
);
