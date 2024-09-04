import React, { useEffect, useState } from 'react'

const App = () => {
    const [baseUrl] = useState("http://localhost:3001")
    const [contacts, setContacts] = useState(null)

    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")

    useEffect(() => {
        getContacts(`${baseUrl}/contacts`)
    }, [])

    const getContacts = (url, options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }) => {
        fetch(url, options)
            .then((response) => {
                if(response.ok) console.log("Consulta satisfactoria")
                return response.json()
            })
            .then((responseJson) => {
                setContacts(responseJson)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const saveContact = (url, options) => {
        fetch(url, options)
            .then((response) => {
                console.log(response.status)
                return response.json()
            })
            .then((responseJson) => {
                setContacts((prevContacts) => [...prevContacts, responseJson])

                //getContacts(`${baseUrl}/contacts`)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const deleteContact = (url, options, id) => {

        console.log(url)
        fetch(url, options)
            .then((response) => {
                if(response.ok){
                    setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== id))
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }


    const handleSubmit = (e) => {
        e.preventDefault()

        const contact = {
            name: name,
            phone: phone
        }

        const raw = JSON.stringify(contact)

        const options = {
            method: 'POST',
            body: raw,
            headers: {
                'content-type': 'application/json'
            }
        }

        saveContact(`${baseUrl}/contacts`, options)
        setName("")
        setPhone("")

    }

    const handleDelete = (id) => {
        const options = {
            method: 'DELETE',
            headers: {
                'Contact-Type': 'application/json'
            }
        }
        deleteContact(`${baseUrl}/contacts/${id}`, options, id)
    }


    return (
        <div>
            <form onSubmit={handleSubmit} className='w-50 mx-auto my-3 border border-1 p-3'>
                <div className="form-group mb-3">
                    <label htmlFor="name" className="form-label">Name:</label>
                    <input type="text" className='form-control' name="name" id="name" placeholder='Insert Name' value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="phone" className="form-label">Phone:</label>
                    <input type="text" className='form-control' name="phone" id="phone" placeholder='Insert Phone' value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <button className="btn btn-primary btn-sm">Guardar</button>
            </form>

            <ul className="list-group mx-auto w-50 my-3 border border-1 shadow">
                {
                    !!contacts &&
                    contacts.map((contact) => {
                        return (
                            <li key={contact.id} className='list-group-item list-group-item-action d-flex justify-content-between'>
                                <span>Id:{contact.id} - {contact.name}/{contact.phone}</span>
                                <button className="btn" onClick={() => handleDelete(contact.id)}><i className="bi bi-trash"></i></button>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default App