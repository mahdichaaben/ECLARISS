import React, { useState, useEffect } from 'react';

function TmpFaces({ url, memberName,imageCount}) {
    const [images, setImages] = useState([]);

    useEffect(() => {
        // Fetch the list of image URLs from the server
        const fetchImages = async () => {
            try {
                const response = await fetch(`${url}/tmp_faces_${memberName}/images`);
                if (response.ok) {
                    const imageUrls = await response.json();
                    setImages(imageUrls);
                } else {
                    console.error('Failed to fetch images');
                }
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, [url, memberName,imageCount]);

    return (
        <div className="grid grid-cols-5 gap-4">
            {images.map((image, index) => (
                <div key={index}>
                    <img 
                        src={`${url}/${image}`} 

                        alt={image} 

                        className="object-cover object-center h-20 max-w-full rounded-lg cursor-pointer" 
                    />
                </div>
            ))}
        </div>
    );
}

export default TmpFaces;