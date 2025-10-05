import React from 'react'
import Layout from '../Layout'
import Loader from '../Loader'

function Email() {
    const [emails, setEmails] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)

    React.useEffect(() => {
        const fetchEmails = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URI}/messages`)
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                const data = await response.json()
                setEmails(data.messages)
                console.log(data);
                
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchEmails()
    }, [])
  return (
    <Layout>
        <section className='p-8 w-full h-full overflow-y-auto'>
            <h1 className="text-2xl font-bold mb-4 text-orange-500"> 📧 Emails</h1>
            {loading && <Loader/>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {!loading && !error && (
               <div>
                {emails.length === 0 ? (
                    <p>No emails found.</p>
                ) : (
                    <ul className="space-y-4">
                        {emails.map((email) => {
                            console.log(email.createdAt);
                            const date = new Date(email.createdAt);
                            const formattedDate = date.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            });
                            const date2 = formattedDate;
                            
                            return(

                            <li key={email.id} className="p-4 border border-gray-700 flex items-center w-full h-24 gap-3 rounded-lg">
                                <h2 className="text-xl w-2/12 capitalize text-sky-500 line-clamp-2 h-fit font-semibold">{email.name}</h2>
                                <p className="text-gray-600 w-3/12 h-fit line-clamp-2  ">From: {email.email}</p>
                             
                                <p className="mt-2 w-5/12 h-fit line-clamp-2">{email.message}</p>
                                  <p className="mt-2 text-sm text-gray-400  w-2/12">{date2}</p>
                            </li>
                        )})}
                    </ul>
                )}
               </div>
            )}
        </section>
    </Layout>
  )
}

export default Email