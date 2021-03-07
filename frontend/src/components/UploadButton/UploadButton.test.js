import React from 'react';
import { shallow} from 'enzyme';
import UploadButton from './UploadButton';

describe('UploadButton component', () => {

    it('should render the upload page correctly', () => {

        const component = shallow(<UploadButton />);
        expect(component).toMatchSnapshot();
    });

});
