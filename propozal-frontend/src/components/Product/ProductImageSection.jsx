import React from 'react';
import { Image } from 'react-bootstrap';

const ProductImageSection = ({ product }) => {
    const mainImage = product.imageUrl || 'https://placehold.co/400x300?text=No+Image';

    return (
        <div className="p-3">
            {/* 메인 이미지 */}
            <Image
                src={mainImage}
                alt={`${product.name} 메인 이미지`}
                fluid
                rounded
                className="mb-3 shadow-sm"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
        </div>
    );
};

export default ProductImageSection;
