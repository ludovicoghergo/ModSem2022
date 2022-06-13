


import React, { useState, useEffect, createRef, useRef, useCallback, useMemo } from 'react';

import axios from 'axios';
import Card from 'react-bootstrap/Card'

import Badge from 'react-bootstrap/Badge'


import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'




export default function Professor(props) {
    /**
     **Dichiarazione di tutti gli stati del componente Home
     */
    const [name, setname] = useState("")
    const [dbData, setdbData] = useState([])

    /**
     * *Esegue una ricerca basandosi sul prefisso di un nome di battesimo di un professore
     * @returns i profili dei professori che soddifisnao i requisiti
     * ? 'encodeURIComponent(query)' codifica la stringa nel formato richiesto da GraphDB
     */
    function searchProfessor() {

        const query = "" +
            "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
            "PREFIX dd: <http://www.semanticweb.org/duckydoc#>" +
            "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +

            "SELECT distinct ?person ?fullname ?school " +
            "WHERE{ " +
            "bind( \"No associate\"  as ?default_school) " +
            "?person rdf:type dd:Professor; " +
            "dd:f_name ?name; " +
            "dd:fullname ?fullname. " +
            "OPTIONAL{ " +
            "SELECT ?person ?schoolname " +
            "WHERE{ " +
            "?person dd:works_for ?school. " +
            "?school dd:name ?schoolname. " +
            "} " +
            "group by ?person ?schoolname " +
            "} " +
            "bind(coalesce(?schoolname, ?default_school) as ?school) " +
            "FILTER (strstarts(str(?name),\"" + name + "\"))}"
        console.log(query)
        axios.get(`http://localhost:7200/repositories/provaludo?query=` + encodeURIComponent(query))
            .then(async (res) => {
                console.log(res.data)
                setdbData(res.data.results.bindings)
            })
    }

    /**
     * *contiene una casella di testo dove inserire il nome del professore cercato, seguita da una lista di risultati
     * ?cliccando il nome della scuola verrà aperta una pagina cone le specifiche della scuola (query federata -> SchoolResult)
     */
    return (
        <>
            <Form.Group className="mb-3 mt-5" style={{ display: 'flex', width: '80%', margin: 'auto' }}  >

                <Form.Control
                    type="text" placeholder="Search by Name" value={name} onChange={(e) =>
                        setname(e.target.value)
                    } />
                <Button variant="outline-secondary" onClick={() => searchProfessor()}>
                    Search
                </Button>
            </Form.Group>
            <div style={{ width: '80%', margin: 'auto' }} >
                {dbData != [] ?
                    <div>
                        {dbData.map((item, index) => (
                            <Card key={index} >
                                <Card.Body>
                                    <Card.Title>{item.fullname.value}</Card.Title>
                                    <div className=" btn">
                                        <Badge bg="success" onClick={() => { window.location.replace('http://localhost:3000/school/?name=' + item.school.value); }}>{item.school.value}</Badge>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))} </div>
                    : <></>
                }



            </ div>
        </>
    );
}




















