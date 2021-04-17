import React from "react";
import SignInComponent from "./SignInComponent";
import {shallow} from "enzyme";

jest.mock('react-router-dom', () => ({
    useLocation: jest.fn().mockReturnValue({
      pathname: '/login',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    }),
    useHistory: jest.fn().mockReturnValue({
      push: jest.fn()
    })
}));

describe("SignInComponent", () => {
  const component = shallow(<SignInComponent/>);

  it("shall render the login page correctly", () => {
    expect(component).toMatchSnapshot();
  });

});
