import React from 'react';
import { mount } from 'enzyme';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AnalyzeHomeBtn from '../AnalyzeHomeBtn';
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

afterEach(cleanup);

it("Renders the AnalyzeNow Home Btn Correctly", () => {
    const { findByTestId } = render(<AnalyzeHomeBtn />)
    expect(findByTestId("#analyzeHomeBtnTest")).toBeTruthy()
})

Enzyme.configure({ adapter: new Adapter() });
it("Simulates a click", () => {
    const wrapper = mount(<AnalyzeHomeBtn/>)
    const btnTest = wrapper.find("#analyzeHomeBtnTest")
    btnTest.simulate("click")
})

