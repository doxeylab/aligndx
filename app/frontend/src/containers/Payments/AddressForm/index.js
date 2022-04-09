import { useState } from "react";
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"

// Custom CSS
import './addressFormStyles.css';

import { countryList } from "./countriesList"
import { provincesList } from "./provincesList"
import { statesList } from "./statesList"

const AddressForm = ({address, setAddress}) => {
    const [countries] = useState(countryList);
    const [provinces] = useState(provincesList);
    const [states] = useState(statesList);
    const [selectedCountry, setSelectedCountry] = useState(null);

    const handleChange = (event) => {
        const {name, value, type, checked} = event.target
        if (name === 'country') {
            setSelectedCountry(value)
        }
        setAddress(prevFormData => {
            return {
                ...prevFormData,
                [name]: type === 'checkbox' ? checked : value
            }
        });
    }

    return (
        <Form id='address-form'>
            <h1>
                Billing Address
            </h1>
            <hr className="mb-5"/>
            <Form.Group className="mb-3">
                <Form.Label>Company</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Company"
                    onChange={handleChange}
                    name="company"
                    value={address.company}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Address Line</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Line 1"
                    onChange={handleChange}
                    name="line1"
                    value={address.line1}
                    className='mb-1'
                />
                <Form.Control 
                    type="text" 
                    placeholder="Line 2"
                    onChange={handleChange}
                    name="line2"
                    value={address.line2}
                />
            </Form.Group>
            <Form.Row className="mb-3">
                <Form.Group as={Col}>
                    <Form.Label>City</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="City"
                        onChange={handleChange}
                        name="city"
                        value={address.city}
                    />
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Province/State</Form.Label>
                    <Form.Control
                        as='select'
                        onChange={handleChange}
                        name="state"
                        value={address.state}
                    >
                        <option key={''} value={''}>--- Choose ---</option>
                        {
                            (() => {
                                if (selectedCountry === 'Canada') {
                                    return (provinces.map(p => <option key={p.name} value={p.name}>{p.name}</option>))
                                } else if (selectedCountry === 'USA') {
                                    return (states.map(s => <option key={s} value={s}>{s}</option>))
                                } else {
                                    return (<option key={'Other'} value={'Other'}>Other</option>)
                                }
                            })()
                        }
                    </Form.Control>
                </Form.Group>
            </Form.Row>
            <Form.Row className="mb-3">
                <Form.Group as={Col}>
                    <Form.Label>Postal/Zip Code</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Postal/Zip Code"
                        onChange={handleChange}
                        name="postalCode"
                        value={address.postalCode}
                    />
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        as='select'
                        onChange={handleChange}
                        name="country"
                        value={address.country}
                    >
                        <option key={''} value={''}>--- Choose ---</option>
                        <option key={'Canada'} value={'Canada'}>Canada</option>
                        <option key={'USA'} value={'USA'}>USA</option>
                        {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                    </Form.Control>
                </Form.Group>
            </Form.Row>
        </Form>
    )
}

export default AddressForm;