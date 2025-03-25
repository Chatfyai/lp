import React from 'react';

interface BenefitCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

const BenefitsCard: React.FC<BenefitCardProps> = ({ title, description, imageUrl }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden mb-4">
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/3 flex-shrink-0">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-48 sm:h-full object-cover"
          />
        </div>
        <div className="p-4 w-full sm:w-2/3">
          <h3 className="text-xl font-semibold text-green-600 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm whitespace-pre-line">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default BenefitsCard; 