import React from 'react';
import Home from './Home';
import { shallow } from 'enzyme';

describe('Home Component', () => {

    it('should render the login page correctly', () => {

        const component = shallow(<Home />);
        expect(component).toMatchSnapshot();
    });

});