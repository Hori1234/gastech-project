import React from 'react';
import { shallow } from 'enzyme';
import { AuthContext } from '../contextConfig';
import NavigationLayout from './NavigationLayout';


const ProvideUser = ({children}) => {
    const user = {
        state: {
            user: {
                id: 1,
                username: 'test',
                role: 'administrator'
            }
        }
    };
    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    );
};


describe('NavigationLayout component', () => {


    it('shall shallow the login page correctly', () => {

        const component = shallow(
            <ProvideUser>
                <NavigationLayout />
            </ProvideUser>
        );
        expect(component).toMatchSnapshot();
    });

    /*
    it('shall have the correct view button href', () => {
        const component = shallow(
            <ProvideUser>
                <NavigationLayout/>
            </ProvideUser>
        );
        const viewButton = component.find('#viewButton > a')[0];
        expect(viewButton.attribs.href).toEqual('/view');

    });

    it('shall have the correct dataButton href', () => {
        const component = shallow(
            <ProvideUser>
                <NavigationLayout/>
            </ProvideUser>
        );
        const dataButton = component.find('#dataButton > a')[0];
        expect(dataButton.attribs.href).toEqual('/data');

    });

    it('shall have the correct monthlyButton href', () => {
        const component = shallow(
            <ProvideUser>
                <NavigationLayout/>
            </ProvideUser>
        );
        const monthlyButton = component.find('#monthlyButton > a')[0];
        expect(monthlyButton.attribs.href).toEqual('/montly');

    });

    it('shall have the correct uploadButton href', () => {
        const component = shallow(
            <ProvideUser>
                <NavigationLayout/>
            </ProvideUser>
        );
        const uploadButton = component.find('#uploadButton > a')[0];
        expect(uploadButton.attribs.href).toEqual('/upload');

    });

    it('shall have the correct planningButton href', () => {
        const component = shallow(
            <ProvideUser>
                <NavigationLayout/>
            </ProvideUser>
        );
        const planningButton = component.find('#planningButton > a')[0];
        expect(planningButton.attribs.href).toEqual('/planning');

    });

    it('shall have the correct accountButton href', () => {
        const component = shallow(
            <ProvideUser>
                <NavigationLayout/>
            </ProvideUser>
        );
        const accountButton = component.find('#accountButton > a')[0];
        expect(accountButton.attribs.href).toEqual('/account');
    });*/
});