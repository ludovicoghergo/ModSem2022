import '../docs.css'

import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

import React, { useState, useEffect, createRef, useRef, useCallback, useMemo } from 'react';

import axios from 'axios';


import { useSearchParams } from "react-router-dom";




export default function SchoolResult(props) {
    /**
     **Dichiarazione di tutti gli stati del componente Home
     */
    const [searchParams, setSearchParams] = useSearchParams();
    const [dbData, setdbData] = useState([])

    /**
     * *Funzione che si occupa di ottenere da wikidata il nome, la città, il link al sito web-
     * *e l'anno di creaione di una università.
     * !IMPORTANTE: azione eseguita in useEffect([]) prima di andare a fare una qualsiasi ricerca-
     * !dobbiamo controllare che sia stato passato l'id della scuola da cercare
     * @var query_URL contiene la query federata che accede a wikidata per ottenere le informazioni rigurdante la scuola
     * @var myFiles contien i risultati della risposta alla query da parte di GraphDB
     * @var name nome del documento
     * @var tags sono le classi a cui appartiene un determinato documento, permettono di essere a conoscenza di che tipo è un documento
     * @return none; i risultati vengono salvati nello stato 'dbData' del componente 
     * ? 'encodeURIComponent(query)' codifica la stringa nel formato richiesto da GraphDB
     */
    useEffect(() => {
        if (searchParams !== null) {
            let query = "" +
                "PREFIX wdt:  <http://www.wikidata.org/prop/direct/> " +
                "PREFIX wd:  <http://www.wikidata.org/entity/> " +
                "PREFIX dd: <http://www.semanticweb.org/ludov/ontologies/2022/2/Ludahh#> " +
                "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
                "PREFIX schema: <http://schema.org/> " +
                "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> " +
                "SELECT   ?namecountry ?cityname ?link (year(xsd:dateTime(?year)) as ?birthyear) " +
                "WHERE{ " +
                "SERVICE <https://query.wikidata.org/sparql> { " +
                "?pipp wdt:P31 wd:Q3918. " +
                "?pipp ?label \"" + searchParams.get("name") + "\". " +
                "?pipp wdt:P17 ?country. " +
                "?country ?label ?namecountry. " +
                "?pipp wdt:P131 ?city. " +
                "?city ?label ?cityname. " +
                "?pipp wdt:P856 ?link. " +
                "?pipp wdt:P571 ?year. " +
                "} " +
                "} "
            console.log(query)
            axios.get(`http://localhost:7200/repositories/provaludo?query=` + encodeURIComponent(query))
                .then(async (res) => {
                    console.log(res.data)
                    setdbData(res.data.results.bindings)
                })
        } else {
            window.location.replace('http://localhost:3000/');
        }
    }, []);



    return (
        <div style={{ width: '80%', margin: 'auto' }} >
            <Card >
                <Card.Body>
                    <Card.Title>{searchParams.get("name")}</Card.Title>
                    {dbData?.map((item, index) => (
                        <ListGroup key={index} variant="flush">
                            <ListGroup.Item>Country: {item.namecountry.value}</ListGroup.Item>
                            <ListGroup.Item>City: {item.cityname.value}</ListGroup.Item>
                            <ListGroup.Item>Founded in: {item.birthyear.value}</ListGroup.Item>
                            <ListGroup.Item>Website: {item.link.value}</ListGroup.Item>
                        </ListGroup>
                    ))}
                </Card.Body>
            </Card>
        </ div>

    );
}