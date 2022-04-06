import Form from "react-bootstrap/Form"

const AddressForm = ({address, setAddress}) => {

    function handleChange(event) {
        const {name, value, type, checked} = event.target
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
            <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
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
            <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="City"
                    onChange={handleChange}
                    name="city"
                    value={address.city}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Province/State</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Province or State"
                    onChange={handleChange}
                    name="state"
                    value={address.state}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Postal/Zip Code</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Postal/Zip Code"
                    onChange={handleChange}
                    name="postalCode"
                    value={address.postalCode}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Control as='select'>
                    <option value="US">USA</option>
                    <option value="CA">Canada</option>
                    <option value="OTHER">Other</option>
                </Form.Control>
            </Form.Group>
        </Form>
    )
}

export default AddressForm;