
import React from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../Layout'
import Loader from '../Loader';

const ProductDetails = () => {
    const slug = useParams().slug;
    const [product, setProduct] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URI}/product/${slug}`
                );
                const data = await response.json();
                setProduct(data.product);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    if (loading) <Loader/>
  return (
    <Layout>
        <div className="p-6 bg-gray-900 min-h-screen">
            <h1 className="text-2xl font-semibold text-gray-100 mb-6">📦 Product Details</h1>
            {product ? (
                <div className="bg-gray-800 p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold text-gray-100 mb-4">{product.title}</h2>
                    <p className="text-gray-300 mb-2"><strong>Category:</strong> {product.category}</p>
                    <p className="text-gray-300 mb-2"><strong>Price:</strong> ₹{product.price}</p>
                    <p className="text-gray-300 mb-2"><strong>Discount:</strong> {product.discount}%</p>
                    <p className="text-gray-300 mb-4"><strong>Description:</strong> {product.description}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {product.images && product.images.length > 0 ? (
                            product.images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img.url}
                                    alt={`Product Image ${index + 1}`}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            ))
                        ) : (
                            <p className="text-gray-500">No images available.</p>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-gray-500">Product not found.</p>
            )}  
        </div>
    </Layout>
  )
}

export default ProductDetails