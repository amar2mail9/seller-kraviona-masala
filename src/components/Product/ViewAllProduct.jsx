import React from 'react'
import { FaPlus } from 'react-icons/fa6'
import ProductCard from './ProductCard'
import Layout from '../Layout'

function ViewAllProduct() {
    const [products, setProducts] = React.useState([])
    const [loading, setLoading] = React.useState(false)

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URI}/products`)
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            setProducts(data.products)
            console.log(data);

        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchProducts()
    }, [])
    return (
        <Layout>
            <div>
                <h2> Product</h2>
                <button>
                    <FaPlus /> Add Product
                </button>

            </div>

            {
                /* product grid */

                Array.from({ length: 10 }).map((_, i) => {
                    return <ProductCard key={i} />
                })


            }
        </Layout>
    )
}

export default ViewAllProduct