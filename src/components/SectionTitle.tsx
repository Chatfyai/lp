interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

const SectionTitle = ({ title, subtitle }: SectionTitleProps) => {
  return (
    <div className="my-6 relative">
      <div className="flex items-center justify-center w-full">
        <div className="flex-grow h-px bg-green-600"></div>
        <h2 className="text-xl font-bold px-3 text-center text-green-600">
          {title}
        </h2>
        <div className="flex-grow h-px bg-green-600"></div>
      </div>
      {subtitle && (
        <p className="text-sm text-gray-500 mt-1 text-center">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionTitle;
