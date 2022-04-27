import { useState } from "react";
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"

// Custom CSS
import './addressFormStyles.css';

import { countryList } from "./countriesList"
import { provincesList } from "./provincesList"
import { statesList } from "./statesList"

const AddressForm = ({address, setAddress, validated, setTaxRate, submit}) => {
    const [countries] = useState(countryList);
    const [provinces] = useState(provincesList);
    const [states] = useState(statesList);
    const [selectedCountry, setSelectedCountry] = useState("CA");
    

    const handleChange = (event) => {
        const {name, value} = event.target
        if (name === 'country') {
            setSelectedCountry(value)
        }
        if (name === 'state' && selectedCountry === 'CA' && value !== '') {
            const provData = provinces.find(p => p.name === value)
            setTaxRate(provData.taxRate)
        } else {
            setTaxRate(0)
        }
        setAddress(prevFormData => {
            return {...prevFormData, [name]: value}
        });
    }

    return (
        <Form id='address-form' noValidate validated={validated} onSubmit={submit}>
            <h1>
                Billing Address
            </h1>
            <hr className="mb-5"/>
            <Form.Group className="mb-3">
                <Form.Label>Address Line *</Form.Label>
                <Form.Control 
                    required
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
                <Form.Control.Feedback type="invalid">
                    Please provide an address line.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Row className="mb-3">
                <Form.Group as={Col}>
                    <Form.Label>City *</Form.Label>
                    <Form.Control 
                        required
                        type="text" 
                        placeholder="City"
                        onChange={handleChange}
                        name="city"
                        value={address.city}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please provide a valid city.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Province/State *</Form.Label>
                    <Form.Control
                        as='select'
                        required
                        onChange={handleChange}
                        name="state"
                        value={address.state}
                    >
                        <option key={''} value={''}>--- Choose ---</option>
                        {
                            (() => {
                                if (selectedCountry === 'CA') {
                                    return (provinces.map(p => <option key={p.name} value={p.name}>{p.name}</option>))
                                } else if (selectedCountry === 'US') {
                                    return (states.map(s => <option key={s} value={s}>{s}</option>))
                                } else {
                                    return (<option key={'Other'} value={'Other'}>Other</option>)
                                }
                            })()
                        }
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        Please select a valid province or state.
                    </Form.Control.Feedback>
                </Form.Group>
            </Form.Row>
            <Form.Row className="mb-3">
                <Form.Group as={Col}>
                    <Form.Label>Postal/Zip Code *</Form.Label>
                    <Form.Control 
                        required
                        type="text" 
                        placeholder="Postal/Zip Code"
                        onChange={handleChange}
                        name="postalCode"
                        value={address.postalCode}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please provide a Postal Code or Zip Code.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Country *</Form.Label>
                    <Form.Control
                        as='select'
                        required
                        onChange={handleChange}
                        name="country"
                        value={address.country}
                    >
                        <option key={''} value={''}>--- Choose ---</option>
                        {countries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        Please select a valid Country.
                    </Form.Control.Feedback>
                </Form.Group>
            </Form.Row>
        </Form>
    )
}

export default AddressForm;