import '../docs.css'

import Card from 'react-bootstrap/Card'

import Badge from 'react-bootstrap/Badge'

import React, { useState, useEffect, createRef, useRef, useCallback, useMemo } from 'react';

import axios from 'axios';


import { useSearchParams } from "react-router-dom";




export default function UserResult(props) {
    /**
     **Dichiarazione di tutti gli stati del componente Home
     */
    const [searchParams, setSearchParams] = useSearchParams();
    const [dbData, setdbData] = useState([])

    /**
     * *Funzione che si occupa di riunire tutte le possibili query richieste dall'utente in un unica query composta-
     * * 2 query GET : la prima per ottenere i documenti dell'utente selezionato, la seconda (per ogni documento)-
     * * richiediamo le classi a cui appartiene (ossia i suoi tipi) e li salviamo in tags.
     * !IMPORTANTE: azione eseguita in useEffect([]) prima di andare a fare una qualsiasi ricerca-
     * !dobbiamo controllare che sia stato passato l'id dell'utente da cercare
     * @var query_URL contiene i prefissi necessari 
     * @var SPECIFIC_URL contiene la stringa che descrive la query compelta, la query richiede i document id iu ndeterminato utente
     * filtrando  i valori di owl e prov in quanto non ci interessano.
     * @var myFiles contien i risultati della risposta alla query da parte di GraphDB
     * @var name nome del documento
     * @var tags sono le classi a cui appartiene un determinato documento, permettono di essere a conoscenza di che tipo è un documento
     * @return none; i risultati vengon osalvati nello stato 'dbData' del componente 
     * ? 'encodeURIComponent(query)' codifica la stringa nel formato richiesto da GraphDB
     */
    useEffect(() => {
        let myfiles = []
        if (searchParams !== null) {
            let query_URL = "" +
                "PREFIX dd: <http://www.semanticweb.org/duckydoc#> " +
                "select ?doc ?nomedoc ?user where { " +
                "<http://www.semanticweb.org/duckydoc#" + searchParams.get("id") + "> dd:load ?doc. " +
                "?doc dd:name ?nomedoc.}"
            console.log(query_URL)
            axios.get(`http://localhost:7200/repositories/provaludo?query=` + encodeURIComponent(query_URL))
                .then(async (res) => {
                    console.log(res)
                    for (let i = 0; i < res.data.results.bindings.length; i++) {
                        let name = res.data.results.bindings[i].nomedoc.value
                        let tags = []
                        let SPECIFIC_URL = "" +
                            "PREFIX dd: <http://www.semanticweb.org/duckydoc#>" +
                            "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
                            "PREFIX owl: <http://www.w3.org/2002/07/owl#>" +
                            "PREFIX prov: <http://www.w3.org/ns/prov#>" +
                            "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
                            "select ?name where {" +
                            ' <' + res.data.results.bindings[i].doc.value + '> ' + "rdf:type ?o ." +
                            "?o rdfs:label ?name." +
                            "FILTER (?o != owl:NamedIndividual && ?o != prov:Entity ) .}"

                        const resp = await axios.get(`http://localhost:7200/repositories/provaludo?query=` + encodeURIComponent(SPECIFIC_URL))
                        for (let j = 0; j < resp.data.results.bindings.length; j++) {
                            if (resp.data.results.bindings[j].name["xml:lang"] == 'en') {
                                tags.push(resp.data.results.bindings[j].name.value)

                            }

                        }

                        myfiles.push({ name: name, tags: tags, author: searchParams.get("id") })
                    }
                    setdbData(myfiles)
                })

        } else {
            window.location.replace('http://localhost:3000/');
        }
    }, []);


    /**
     * *Mostra i risultati della ricerca basandosi su dbData
     * ?premendo sul nome dell'autore viene aperta la pagina userResult con il valore dello user
     */
    return (
        <div style={{ width: '80%', margin: 'auto' }} >
            <h1>{searchParams.get("id")}'s Posts</h1>
            {dbData.map((item, index) => (
                <Card key={index} >
                    <Card.Body>
                        <Card.Title>{item.name}</Card.Title>
                        <div className=" btn">
                            <Badge bg="success" onClick={() => { window.location.replace('http://localhost:3000/user/?id=' + item.author); }}>{item.author}</Badge>
                        </div>

                        <h6>
                            {item.tags.map((tag, index) => (
                                <Badge className="m-1" bg="secondary"> {tag} </Badge>
                            ))}
                        </h6>
                    </Card.Body>
                </Card>
            ))
            }


        </ div>

    );
}