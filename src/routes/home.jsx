import '../docs.css'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'

import React, { useState, useEffect, createRef, useRef, useCallback, useMemo } from 'react';

import axios from 'axios';













export default function Home() {
    /**
     **Dichiarazione di tutti gli stati del componente Home
     */
    const [user, setuser] = useState("");
    const [school, setschool] = useState("");
    const [dep, setdep] = useState("");
    const [course, setcourse] = useState("");
    const [city, setcity] = useState("");
    const [professor, setprofessor] = useState("");
    const [price, setprice] = useState(0);
    const [reviews, setreviews] = useState(0);
    const [dbData, setdbData] = useState([])


    /**
     * @var query è il valore della query che conterrà la stringa
     * @var user è il valore associato al textbox 'nome utente' nel form
     * @returns una stringa composta contenente la query in SPARQL per filtrare i documenti in base all'utente
     */
    function userQuery() {
        let query = ""
        if (user != "") {
            query +=
                " ?user dd:load ?doc;" +
                " dd:f_name \"" + user + "\".";
        }
        return query
    }

    /**
     * @var query è il valore della query che conterrà la stringa
     * @var user è il valore associato al textbox 'Scuola'
     * @returns una stringa composta contenente la query in SPARQL  per filtrare i documenti in base alla scuola
     */
    function schoolQuery() {
        let query = ""
        if (school != "") {
            query +=
                " ?doc dd:talks_about ?course." +
                " ?course dd:belongs_to_degree ?degree." +
                " ?degree dd:has_department ?department." +
                " ?department dd:has_school ?school." +
                " ?school dd:name \"" + school + "\".";
        }
        return query
    }

    /**
     * @var query è il valore della query che conterrà la stringa
     * @var dep è il valore associato al textbox 'Department'
     * @returns una stringa composta contenente la query in SPARQL  per filtrare i documenti in base al dipartimento
     */
    function depQuery() {
        let query = ""
        if (dep != "") {
            query +=
                " ?doc dd:talks_about ?course." +
                " ?course dd:belongs_to_degree ?degree." +
                " ?degree dd:has_department ?department." +
                " ?department dd:name \"" + dep + "\".";
        }
        return query
    }

    /**
     * @var query è il valore della query che conterrà la stringa
     * @var city è il valore associato al textbox 'City'
     * @returns una stringa composta contenente la query in SPARQL  per filtrare i documenti in base alla città
     */
    function cityQuery() {
        let query = ""
        if (city != "") {
            query +=
                " ?doc dd:talks_about ?course." +
                " ?course dd:belongs_to_degree ?degree." +
                " ?degree dd:has_department ?department." +
                " ?department dd:has_school ?school." +
                " ?school dd:located_in ?city." +
                " ?city dd:name \"" + city + "\".";
        }
        return query
    }

    /**
     * @var query è il valore della query che conterrà la stringa
     * @var course è il valore associato al textbox 'Course'
     * @returns una stringa composta contenente la query in SPARQL  per filtrare i documenti in base al corso
     */
    function courseQuery() {
        let query = ""
        if (course != "") {
            query +=
                " ?doc dd:talks_about ?course." +
                " ?course dd:belongs_to_degree ?degree." +
                " ?course dd:course_name \"" + course + "\".";
        }
        return query
    }

    /**
     * @var query è il valore della query che conterrà la stringa
     * @var user è il valore associato al textbox 'Professor'
     * @returns una stringa composta contenente la query in SPARQL  per filtrare i documenti in base al professore del corso a cui appartiene il documento
     */
    function professorQuery() {
        let query = ""
        if (professor != "") {
            query +=
                " ?doc dd:talks_about ?course." +
                " ?course dd:belongs_to_degree ?degree." +
                " ?professor dd:teach ?course" +
                " ?professor dd:l_name \"" + professor + "\".";
        }
        return query
    }

    /**
     * @var query è il valore della query che conterrà la stringa
     * @var reviews è il valore associato al radio button'reviews'
     * @returns un'array contenente : stringa composta contenente la query in SPARQL, stringa composta per le istruzioni select, stringa composta per le istruzione having, stringa composta per le istruzione groupby
     * !necessario aggiungere SelectQuery, GroupbyQuery e HavingbyQuery che contengono il valore delle due istruzioni da inserire a fine query
     */
    function revQuery(havingQuery, groupbyQuery, selectQuery) {
        let query = ""
        if (reviews != "") {
            selectQuery += "(AVG(?vote) as ?Average) "
            query +=
                "?rev dd:vote ?vote;" +
                "dd:refer_to ?doc."
            groupbyQuery = 'GROUP BY ?doc ?nomedoc '
            havingQuery = " HAVING (?Average >" + reviews.toString() + " ) "
        }

        return [selectQuery, groupbyQuery, havingQuery, query]
    }


    /**
     * *Funzione che si occupa di riunire tutte le possibili query richieste dall'utente in un unica query composta
     * * 2 query GET : la prima per ottenere i documenti, la seconda (per ogni documento) richiediamo le classi a cui appartiene (ossia i suoi tipi) e li salviamo in tags
     * @var query contiene i prefissi necessari 
     * @var selectQuery contiene la stringa che descrive l'istruzioen select, può essere alterata dalle funzioni (es. revQuery)
     * @var whereQuery contiene la stringa che descrive la testa dell'istruzioen where (a noi è necessario solo IRI del documento, il suo nome e l'autore)
     * @var groupbyQuery contiene la stringa che descrive l'istruzioen groupBY, può essere alterata dalle funzioni (es. revQuery)
     * @var havingQuery contiene la stringa che descrive l'istruzioen Having, può essere alterata dalle funzioni (es. revQuery)
     * @var myFiles contien i risultati della risposta alla query da parte di GraphDB
     * @var name nome del documento
     * @var tags sono le classi a cui appartiene un determinato documento, permettono di essere a conoscenza di che tipo è un documento
     * @return none; i risultati vengon osalvati nello stato 'dbData' del componente 
     */
    const compQuery =
        async () => {
            let query = "" +
                "PREFIX dd: <http://www.semanticweb.org/duckydoc#>" +
                "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
                "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
            let selectQuery = " SELECT ?doc ?nomedoc ?user "
            let whereQuery = "WHERE { " +
                "?doc rdf:type dd:File. " +
                "?doc dd:name ?nomedoc. " +
                "?user dd:load ?doc. "
            let havingQuery = ""
            let groupbyQuery = ""
            let revsQuery = revQuery(havingQuery, groupbyQuery, selectQuery)
            let myfiles = []
            console.log(query + revsQuery[0] + whereQuery + userQuery() + schoolQuery() + cityQuery() + depQuery() + courseQuery() + professorQuery() + revsQuery[3] + "}" + revsQuery[1] + revsQuery[2])
            axios.get(`http://localhost:7200/repositories/provaludo?query=` + encodeURIComponent(query + revsQuery[0] + whereQuery + userQuery() + schoolQuery() + cityQuery() + depQuery() + courseQuery() + professorQuery() + revsQuery[3] + "}" + revsQuery[1] + revsQuery[2]))
                .then(async (res) => {

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
                        let s = res.data.results.bindings[i].user.value
                        s = s.substring(s.indexOf('#') + 1, s.length);
                        for (let j = 0; j < resp.data.results.bindings.length; j++) {
                            if (resp.data.results.bindings[j].name["xml:lang"] == 'en') {
                                tags.push(resp.data.results.bindings[j].name.value)

                            }

                        }

                        myfiles.push({ name: name, tags: tags, author: s })
                    }
                    console.log(myfiles)
                    setdbData(myfiles)
                }


                )
        }

    /**
     * *Contiene il form con i campi di ricerca per i documenti
     */
    const search_sidebar =
        <Card id="docs_sidebar">
            <Card.Img variant="top" />
            <Card.Body>
                <Card.Title>Search Fields</Card.Title>

                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>User</Form.Label>
                        <Form.Control
                            value={user} type="text" placeholder="eg.Ludovico" onChange={(e) =>
                                setuser(e.target.value)
                            } />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>School</Form.Label>
                        <Form.Control value={school} type="text" placeholder="eg.Unito" onChange={(e) =>
                            setschool(e.target.value)
                        } />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Department</Form.Label>
                        <Form.Control value={dep} type="text" placeholder="eg. Computer Science" onChange={(e) =>
                            setdep(e.target.value)
                        } />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Course</Form.Label>
                        <Form.Control value={course} type="text" placeholder="eg. Reti Neurali" onChange={(e) =>
                            setcourse(e.target.value)
                        } />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>City</Form.Label>
                        <Form.Control value={city} type="text" placeholder="eg. Turin" onChange={(e) =>
                            setcity(e.target.value)
                        } />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Professor</Form.Label>
                        <Form.Control value={professor} type="text" placeholder="eg. Dr.Zito" onChange={(e) =>
                            setprofessor(e.target.value)
                        } />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Price</Form.Label>
                        <Form.Range value={price} onChange={(e) =>
                            setprice(e.target.value)
                        } />
                    </Form.Group>


                    <Form.Label>Reviews</Form.Label>
                    <div className="mb-3">

                        <Form.Check
                            onChange={() => setreviews(0)}
                            inline
                            type="radio"
                            label="all"
                            name="groupRev"
                        />

                        <Form.Check
                            onChange={() => setreviews(3)}
                            inline
                            type="radio"
                            label="> 3"
                            name="groupRev"
                        />

                        <Form.Check
                            onChange={() => setreviews(4)}
                            inline
                            type="radio"
                            label="> 4"
                            name="groupRev"
                        />

                    </div>


                    <Button variant="primary" onClick={compQuery}>
                        Search
                    </Button>
                </Form>
            </Card.Body>
        </Card >;

    /**
     * *Mostra i risultati della ricerca basandosi su dbData
     * ?premendo sul nome dell'autore viene aperta la pagina userResult con il valore dello user
     */
    const result_cards =
        <div id="result_side">
            {dbData.map((item, index) => (
                <Card key={index}>
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

        </div>




    return (
        <div class="search_div">
            {search_sidebar}
            {result_cards}
        </div>

    );
}