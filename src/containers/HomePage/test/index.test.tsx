import React from 'react';
import { shallow } from 'enzyme';

import { HomePage, mapDispatchToProps } from '../';
import Helloworld from '../../../components/helloworld/index';
import { changeTheme } from '../../ThemeProvider/actions';

describe('<HomePage />', () => {

  it('should render the Helloworld', () => {
    const renderedComponent = shallow(
      <HomePage
        {...{
          locale: 'en',
          theme: 'light'
        } as any}
      />
    );
    expect(renderedComponent.contains(<Helloworld />)).toEqual(true);
  });

  describe('mapDispatchToProps', () => {

    describe('changeTheme', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result.changeTheme).toBeDefined();
      });

      it('should dispatch changeTheme when called', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        const locale = 'light';
        result.changeTheme(locale);
        expect(dispatch).toHaveBeenCalledWith(changeTheme(locale));
      });
    });
  });
});
