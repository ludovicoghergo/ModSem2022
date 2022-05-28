


import React, { useState, useEffect, createRef, useRef, useCallback, useMemo } from 'react';

import axios from 'axios';
import Card from 'react-bootstrap/Card'


import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'




export default function Users(props) {
    const [name, setname] = useState("")
    const [dbData, setdbData] = useState([])


    function searchUser() {

        const query = "" +
            "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
            "PREFIX dd: <http://www.semanticweb.org/duckydoc#>" +
            "select ?person ?name where { " +
            "?person rdf:type dd:User;" +
            "dd:f_name ?name;" +
            "dd:fullname ?fullname." +
            "FILTER (strstarts(str(?name),\"" + name + "\"))}"
        console.log(query)
        axios.get(`http://localhost:7200/repositories/provaludo?query=` + encodeURIComponent(query))
            .then(async (res) => {
                console.log(res.data)
                setdbData(res.data.results.bindings)
            })
    }


    return (
        <>
            <Form.Group className="mb-3 mt-5" style={{ display: 'flex', width: '80%', margin: 'auto' }}  >

                <Form.Control
                    type="text" placeholder="Search by Name" value={name} onChange={(e) =>
                        setname(e.target.value)
                    } />
                <Button variant="outline-secondary" onClick={() => searchUser()}>
                    Search
                </Button>
            </Form.Group>
            <div style={{ width: '80%', margin: 'auto' }} >
                {dbData != [] ?
                    <div>
                        {dbData.map((item, index) => (
                            <Card key={index} >
                                <Card.Body>
                                    <Card.Title>{item.name.value}</Card.Title>
                                </Card.Body>
                            </Card>
                        ))} </div>
                    : <></>
                }



            </ div>
        </>
    );
}




















