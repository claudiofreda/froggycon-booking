import Markdown from "react-markdown";

export const TermsAndConditions = ({
  termsAndConditions,
}: {
  termsAndConditions: string;
}) => {
  return (
    <div className="markdown">
      <Markdown>{termsAndConditions}</Markdown>
    </div>
  );
};
