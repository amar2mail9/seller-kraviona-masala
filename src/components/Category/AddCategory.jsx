import React from 'react';
import Layout from '../Layout';
import { toast } from 'react-toastify';
import Loader from '../Loader';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
  const [imagePreview, setImagePreview] = React.useState(null);
  const [imageUrl, setImageUrl] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [categoryName, setCategoryName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isPublished, setIsPublished] = React.useState(true);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!categoryName || !imageUrl) {
      toast.warn("Please fill all the fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URI}/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        },
        body: JSON.stringify({ categoryName, image: imageUrl, description, isPublished })
      });

      const data = await res.json();
      console.log(data);

      if (data.success) {
        toast.success(data.message);
        setCategoryName('');
        setImageUrl('');
        setImagePreview(null);
        setDescription('');
        navigate('/categories');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <Layout>
      <div className='p-6 bg-gray-900 min-h-screen'>
        <h1 className='text-2xl font-semibold text-gray-100 mb-4'>➕ Add Category</h1>

        <form className='bg-gray-800 p-6 rounded-lg shadow-md space-y-4' onSubmit={submitHandler}>
          {/* Category Name */}
          <div>
            <label className='block text-gray-300 mb-2' htmlFor='categoryName'>Category Name</label>
            <input
              type='text'
              id='categoryName'
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className='w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-200 focus:outline-none focus:border-blue-500'
              placeholder='Enter category name'
            />
          </div>

          {/* Description */}
          <div>
            <label className='block text-gray-300 mb-2' htmlFor='description'>Category Description</label>
            <textarea
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className='w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-200 focus:outline-none focus:border-blue-500'
              placeholder='Enter category description'
            />
          </div>

          {/* Image URL */}
          <div>
            <label className='block text-gray-300 mb-2' htmlFor='categoryImage'>Category Image URL</label>
            <input
              type='text'
              id='categoryImage'
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setImagePreview(e.target.value);
              }}
              className='w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-200 focus:outline-none focus:border-blue-500'
              placeholder='Enter image URL'
            />
          </div>

          {/* Image Preview */}
          <div className='w-[300px] h-[200px] border border-gray-600 rounded-md overflow-hidden flex items-center justify-center bg-gray-700'>
            {imagePreview ? <img src={imagePreview} alt={categoryName} className='object-cover w-full h-full' /> : <p className='text-gray-400'>Paste Link</p>}
          </div>

          {/* Published Toggle */}
          <div className='flex items-center gap-3'>
            <input
              type='checkbox'
              id='isPublished'
              checked={isPublished}
              onChange={() => setIsPublished(!isPublished)}
              className='h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500'
            />
            <label className='text-gray-300' htmlFor='isPublished'>Published</label>
          </div>

          {/* Submit */}
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-orange-600 text-white py-3 rounded-md font-semibold hover:bg-orange-700 transition-all'
          >
            {loading ? 'Adding...' : 'Add Category'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddCategory;
