import '../docs.css'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'


import React, { useState, useEffect, createRef, useRef, useCallback, useMemo } from 'react';













export default function Home() {

    const [user, setuser] = useState(null);
    const [school, setschool] = useState(null);
    const [dep, setdep] = useState(null);
    const [course, setcourse] = useState(null);
    const [city, setcity] = useState(null);
    const [professor, setprofessor] = useState(null);
    const [price, setprice] = useState(null);
    const [reviews, setreviews] = useState(null);






    const search_sidebar =
        <Card id="docs_sidebar">
            <Card.Img variant="top" />
            <Card.Body>
                <Card.Title>Search Fields</Card.Title>

                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>User</Form.Label>
                        <Form.Control
                            ref={user} type="text" placeholder="eg.Ludovico" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>School</Form.Label>
                        <Form.Control ref={school} type="text" placeholder="eg.Unito" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Department</Form.Label>
                        <Form.Control ref={dep} type="text" placeholder="eg. Computer Science" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Course</Form.Label>
                        <Form.Control ref={course} type="text" placeholder="eg. ModSem" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>City</Form.Label>
                        <Form.Control ref={city} type="text" placeholder="eg. Turin" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Professor</Form.Label>
                        <Form.Control ref={professor} type="text" placeholder="eg. Dr.Zito" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Price</Form.Label>
                        <Form.Range ref={price} />
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


                    <Button variant="primary" onClick={() => console.log(reviews)}>
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