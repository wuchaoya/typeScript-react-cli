import { createMemoryHistory } from 'history';
import { fromJS } from 'immutable';
import configureStore from '../../store';

import getInjectors, {
  injectReducerFactory,
} from '../reducerInjectors';
import { Action } from 'redux';
import { IStore } from '../../Interfaces/store';
import { $Call } from 'utility-types';

const initialState = fromJS({ reduced: 'soon' });

const reducer = (state = initialState, action: Action & { payload: any }) => {
  switch (action.type) {
    case 'TEST':
      return state.set('reduced', action.payload);
    default:
      return state;
  }
};

describe('reducer injectors', () => {
  let store: IStore;
  let injectReducer: $Call<typeof injectReducerFactory>;

  describe('getInjectors', () => {
    beforeEach(() => {
      store = configureStore({}, createMemoryHistory());
    });

    it('should return injectors', () => {
      expect(getInjectors(store)).toEqual(expect.objectContaining({
        injectReducer: expect.any(Function)
      }));
    });

    it('should throw if passed invalid store shape', () => {
      Reflect.deleteProperty(store, 'dispatch');

      expect(() => getInjectors(store)).toThrow();
    });
  });

  describe('injectReducer helper', () => {
    beforeEach(() => {
      store = configureStore({}, createMemoryHistory());
      injectReducer = injectReducerFactory(store, true);
    });

    it('should check a store if the second argument is falsy', () => {
      const inject = injectReducerFactory({} as any);

      expect(() => inject('test', reducer)).toThrow();
    });

    it('it should not check a store if the second argument is true', () => {
      Reflect.deleteProperty(store, 'dispatch');

      expect(() => injectReducer('test', reducer)).not.toThrow();
    });

    it('should validate a reducer and reducer\'s key', () => {
      expect(() => injectReducer('', reducer)).toThrow();
      expect(() => injectReducer(1 as any, reducer)).toThrow();
      expect(() => injectReducer(1 as any, 1 as any)).toThrow();
    });

    it('given a store, it should provide a function to inject a reducer', () => {
      injectReducer('test', reducer);

      const actual = store.getState().get('test');
      const expected = initialState;

      expect(actual.toJS()).toEqual(expected.toJS());
    });

    it('should not assign reducer if already existing', () => {
      store.replaceReducer = jest.fn();
      injectReducer('test', reducer);
      injectReducer('test', reducer);

      expect(store.replaceReducer).toHaveBeenCalledTimes(1);
    });

    it('should assign reducer if different implementation for hot reloading', () => {
      store.replaceReducer = jest.fn();
      injectReducer('test', reducer);
      injectReducer('test', (a) => a);

      expect(store.replaceReducer).toHaveBeenCalledTimes(2);
    });
  });
});
