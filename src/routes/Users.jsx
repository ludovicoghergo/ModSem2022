


import React, { useState, useEffect, createRef, useRef, useCallback, useMemo } from 'react';

import axios from 'axios';
import Card from 'react-bootstrap/Card'


import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'




export default function Users(props) {
    /**
     **Dichiarazione di tutti gli stati del componente Home
     */
    const [name, setname] = useState("")
    const [dbData, setdbData] = useState([])


    /**
     * *Esegue una ricerca basandosi sul prefisso di un nome di battesimo di un'utente
     * @returns i profili degli utenti che soddifisnao i requisiti
     * ? 'encodeURIComponent(query)' codifica la stringa nel formato richiesto da GraphDB
     */
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
                let s = res.data.results.bindings[0].person.value
                s = s.substring(s.indexOf('#') + 1, s.length);
                console.log(s)
                setdbData(res.data.results.bindings)
            })
    }

    /**
     * *contiene una casella di testo dove inserire il nome dell'utente cercato, seguita da una lista di risultati
     * ?cliccando il nome di un utente verrà aperta una pagina con tutti i documenti caricati dall'utente (UserResult)
     */
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
                            <Card key={index} className="mt-2 mb-2" style={{ cursor: "pointer" }} >
                                <Card.Body onClick={() => { window.location.replace('http://localhost:3000/user/?id=' + item.person.value.substring(item.person.value.indexOf('#') + 1, item.person.value.length)) }}>
                                    <Card.Title>{item.person.value.substring(item.person.value.indexOf('#') + 1, item.person.value.length).replaceAll("_", " ")}</Card.Title>
                                </Card.Body>
                            </Card>
                        ))} </div>
                    : <></>
                }



            </ div>
        </>
    );
}




















