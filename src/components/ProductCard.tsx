import React from 'react';

interface ProductCardProps {
  name: string;
  price: string;
  promoPrice?: string;
  image: string;
  href: string;
}

const ProductCard = ({ name, price, promoPrice, image, href }: ProductCardProps) => {
  const hasPromoPrice = promoPrice && promoPrice.trim() !== '';
  
  // Imagem padrão caso a URL seja inválida
  const defaultImage = "/lovable-uploads/fd1285cf-8fdd-4e0e-99f8-0bf38a976c78.png";

  return (
    <a href={href} className="block h-full group">
      <div className="w-full aspect-square bg-white relative rounded-lg overflow-hidden border border-gray-100 shadow-sm transition-all duration-200 group-hover:shadow-md">
        <img 
          src={image || defaultImage} 
          alt={name} 
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
        />
        {hasPromoPrice && (
          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-md">
            OFERTA
          </div>
        )}
      </div>
      <div className="mt-3 text-left px-1">
        <h3 className="font-medium text-base mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">{name}</h3>
        
        {hasPromoPrice ? (
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm line-through">De: {price}</span>
            <div className="font-bold text-green-600 text-lg">
              {promoPrice}
            </div>
          </div>
        ) : (
          <div className="font-bold text-green-600 text-lg">{price}</div>
        )}
      </div>
    </a>
  );
};

export default ProductCard;
