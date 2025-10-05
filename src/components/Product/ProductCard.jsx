import React from 'react'

function ProductCard({thumbnail="https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=",title="untitled",description="no description",price="0"}) {
  return (
    <div className='w-[] border p-4 rounded-lg shadow-md'>
            <img src={thumbnail} alt={title} />
        <h2 className='text-lg font-semibold mb-2'>{title}</h2>
        <p className='text-gray-600 mb-2'>{description}</p>
        <p className='text-orange-500 font-bold'>${price}</p>   
    
    </div>
  )
}

export default ProductCard