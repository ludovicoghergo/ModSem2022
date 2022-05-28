import '../docs.css'

import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

import React, { useState, useEffect, createRef, useRef, useCallback, useMemo } from 'react';

import axios from 'axios';


import { useSearchParams } from "react-router-dom";




export default function SchoolResult(props) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [dbData, setdbData] = useState([])

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