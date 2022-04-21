import '../docs.css'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'


import React, { useState, useEffect, createRef, useRef, useCallback, useMemo } from 'react';

import axios from 'axios';













export default function Home() {

    const [user, setuser] = useState("");
    const [school, setschool] = useState("");
    const [dep, setdep] = useState("");
    const [course, setcourse] = useState("");
    const [city, setcity] = useState("");
    const [professor, setprofessor] = useState("");
    const [price, setprice] = useState(0);
    const [reviews, setreviews] = useState(0);



    function userQuery() {
        let query = ""
        if (user != "") {
            query +=
                " ?user dd:load ?doc;" +
                " dd:f_name \"" + user + "\".";
        }
        return query
    }

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

    function courseQuery() {
        let query = ""
        if (course != "") {
            query +=
                " ?doc dd:talks_about ?course." +
                " ?course dd:belongs_to_degree ?degree." +
                " ?course dd:name \"" + course + "\".";
        }
        return query
    }

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


    function compQuery() {

        let query = "" +
            "PREFIX dd: <http://www.semanticweb.org/duckydoc#>" +
            "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
            "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
        let selectQuery = " SELECT ?doc ?nomedoc "
        let whereQuery = "WHERE { ?doc dd:name ?nomedoc. "
        let havingQuery = ""
        let groupbyQuery = ""
        let revsQuery = revQuery(havingQuery, groupbyQuery, selectQuery)
        console.log(query + revsQuery[0] + whereQuery + userQuery() + schoolQuery() + revsQuery[3] + "}" + revsQuery[1] + revsQuery[2]
        )
        axios.get(`http://localhost:7200/repositories/provaludo?query=` + encodeURIComponent(query + revsQuery[0] + whereQuery + userQuery() + schoolQuery() + revsQuery[3] + "}" + revsQuery[1] + revsQuery[2]))
            .then(res => {
                console.log(res)
            })
    }


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
                        <Form.Control value={course} type="text" placeholder="eg. ModSem" onChange={(e) =>
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


                    <Button variant="primary" onClick={
                        () => compQuery()
                    }>
                        Search
                    </Button>
                </Form>
            </Card.Body>
        </Card >;








    return (
        <div>
            {search_sidebar}
        </div>

    );
}