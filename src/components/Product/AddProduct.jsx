import React, { useState, useEffect } from 'react';
import Layout from '../Layout';
import { toast } from 'react-toastify';
import Loader from '../Loader';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [images, setImages] = useState([]);
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState(0);
    const [stock, setStock] = useState('');
    const [status, setStatus] = useState('in stock');
    const [category, setCategory] = useState('');

    const [isPublished, setIsPublished] = useState(false);
    const navigate = useNavigate();

    // Fetch categories for select
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URI}/seller/categories`, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                const data = await res.json();
                if (data.success) setCategories(data.categories);
            } catch (err) {
                console.log(err);
            }
        };
        fetchCategories();
    }, []);

    const addImageHandler = () => {
        if (!imageUrl) return toast.warn("Add image URL first");
        setImages(prev => [...prev, { url: imageUrl, altText: title || 'Product Image' }]);
        setImageUrl('');
    };

    const removeImageHandler = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!title || !description || !thumbnail || !category || !stock || !price) {
            return toast.warn("Please fill all required fields");
        }

        setLoading(true);
        const payload = {
            title,
            description,
            thumbnail,
            images,
            price: Number(price),
            discount: Number(discount),
            stock: Number(stock),
            status,
            category,

            isPublished
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URI}/product`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                navigate('/products');
                // Reset form
                setTitle('');
                setDescription('');
                setThumbnail('');
                setImages([]);
                setPrice('');
                setDiscount(0);
                setStock('');
                setStatus('in stock');
                setCategory('');

                setIsPublished(false);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <Layout>
            <div className='p-6 bg-gray-900 min-h-screen'>
                <h1 className='text-2xl font-semibold text-gray-100 mb-4'>➕ Add Product</h1>

                <form className='bg-gray-800 p-6 rounded-lg shadow-md space-y-4' onSubmit={submitHandler}>
                    {/* Title */}
                    <div>
                        <label className='text-gray-300 mb-2 block'>Product Title</label>
                        <input
                            type='text'
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder='Enter title'
                            className='w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-200'
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className='text-gray-300 mb-2 block'>Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={4}
                            placeholder='Enter description'
                            className='w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-200'
                        />
                    </div>

                    {/* Thumbnail */}
                    <div>
                        <label className='text-gray-300 mb-2 block'>Thumbnail URL</label>
                        <input
                            type='text'
                            value={thumbnail}
                            onChange={e => setThumbnail(e.target.value)}
                            placeholder='Enter thumbnail URL'
                            className='w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-200'
                        />
                    </div>

                    {/* Images Array */}
                    <div>
                        <label className='text-gray-300 mb-2 block'>Add Product Images</label>
                        <div className='flex gap-2 mb-2'>
                            <input
                                type='text'
                                value={imageUrl}
                                onChange={e => setImageUrl(e.target.value)}
                                placeholder='Image URL'
                                className='flex-1 p-2 rounded-md bg-gray-700 border border-gray-600 text-gray-200'
                            />
                            <button type='button' onClick={addImageHandler} className='px-4 py-2 bg-blue-600 rounded-md'>Add</button>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            {images.map((img, index) => (
                                <div key={index} className='relative'>
                                    <img src={img.url} alt={img.altText} className='w-20 h-20 object-cover rounded-md border border-gray-600' />
                                    <button type='button' onClick={() => removeImageHandler(index)} className='absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center'>×</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price, Discount, Stock */}
                    <div className='flex gap-2'>
                        <input
                            type='number'
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            placeholder='Price'
                            className='flex-1 p-2 rounded-md bg-gray-700 border border-gray-600 text-gray-200'
                        />
                        <input
                            type='number'
                            value={discount}
                            onChange={e => setDiscount(e.target.value)}
                            placeholder='Discount (%)'
                            className='flex-1 p-2 rounded-md bg-gray-700 border border-gray-600 text-gray-200'
                        />
                        <input
                            type='number'
                            value={stock}
                            onChange={e => setStock(e.target.value)}
                            placeholder='Stock'
                            className='flex-1 p-2 rounded-md bg-gray-700 border border-gray-600 text-gray-200'
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className='text-gray-300 mb-2 block'>Status</label>
                        <select value={status} onChange={e => setStatus(e.target.value)} className='w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-200'>
                            <option value='in stock'>In Stock</option>
                            <option value='out of stock'>Out of Stock</option>
                            <option value='limited stock'>Limited Stock</option>
                        </select>
                    </div>

                    {/* Category */}
                    <div>
                        <label className='text-gray-300 mb-2 block'>Category</label>
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-200"
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat.categoryName}>
                                    {cat.categoryName}
                                </option>
                            ))}
                        </select>

                    </div>



                    {/* Published */}
                    <div className='flex items-center gap-3'>
                        <input
                            type='checkbox'
                            checked={isPublished}
                            onChange={() => setIsPublished(!isPublished)}
                            className='h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded'
                        />
                        <label className='text-gray-300'>Published</label>
                    </div>

                    {/* Submit */}
                    <button type='submit' className='w-full bg-orange-600 py-3 rounded-md text-white font-semibold hover:bg-orange-700'>
                        Add Product
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default AddProduct;
