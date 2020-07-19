import { Platform } from '@remax/types';
import propsAlias, { getAlias } from '../propsAlias';
import * as RuntimeOptions from '../RuntimeOptions';

describe('props alias', () => {
  beforeAll(() => {
    RuntimeOptions.apply({
      platform: Platform.ali,
      hostComponents: {
        foo: {
          alias: {
            camelCase: 'kebab-case',
          },
        },
      },
    });
  });

  afterAll(() => {
    RuntimeOptions.reset();
  });

  it('transform className prop correctly', () => {
    expect(getAlias('className', 'any')).toBe('class');

    expect(
      propsAlias(
        {
          className: 'class-name',
        },
        'any'
      )
    ).toEqual({
      class: 'class-name',
    });
  });

  it('transform style prop correctly', () => {
    expect(
      propsAlias(
        {
          style: {
            color: '#ffffff',
            height: '2px',
            WebkitFlex: 1,
            '--color': 'red',
            '--textColor': 'blue',
            backgroundColor: 'var(--textColor)',
          },
        },
        'any'
      )
    ).toMatchSnapshot();

    expect(
      propsAlias(
        {
          style: null,
        },
        'any'
      )
    ).toMatchSnapshot();
  });

  it('transform props by component type correctly', () => {
    expect(getAlias('prop', 'any')).toBe('prop');

    expect(
      propsAlias(
        {
          bar: 'bar',
          camelCase: 'value',
        },
        'foo'
      )
    ).toEqual({
      bar: 'bar',
      'kebab-case': 'value',
    });
  });

  it('transform platform props', () => {
    expect(getAlias('ali-prop', 'any')).toBe('prop');
  });
});
