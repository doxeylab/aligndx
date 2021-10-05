import React from 'react';
import { mount,  } from 'enzyme';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import FileUploader from '../FileUploader';


afterEach(cleanup);

it("Renders the Analyze Modal Btn Correctly", () => {
    const { findByTestId } = render(<FileUploader />)
    expect(findByTestId("#analyzeModalBtn")).toBeTruthy()
})

Enzyme.configure({ adapter: new Adapter() });
it("Simulates a click", () => {
   
    const wrapper = mount(<FileUploader />)
    const btnTest = wrapper.find("#analyzeModalBtn")
    btnTest.simulate("click")

})