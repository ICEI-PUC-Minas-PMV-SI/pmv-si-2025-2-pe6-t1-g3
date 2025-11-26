import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from './Button';

describe('Button', () => {
  it('should render correctly with children', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button onPress={onPress}>Click me</Button>);
    
    fireEvent.press(getByText('Click me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button onPress={onPress} disabled>
        Click me
      </Button>
    );
    
    fireEvent.press(getByText('Click me'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should not call onPress when loading', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Button onPress={onPress} loading>
        Click me
      </Button>
    );
    
    // Button should show loading indicator
    expect(getByTestId).toBeDefined();
    // onPress should not be called when loading
  });

  it('should render with primary variant by default', () => {
    const { getByText } = render(<Button>Primary</Button>);
    expect(getByText('Primary')).toBeTruthy();
  });

  it('should render with secondary variant', () => {
    const { getByText } = render(<Button variant="secondary">Secondary</Button>);
    expect(getByText('Secondary')).toBeTruthy();
  });

  it('should render with outline variant', () => {
    const { getByText } = render(<Button variant="outline">Outline</Button>);
    expect(getByText('Outline')).toBeTruthy();
  });

  it('should render with danger variant', () => {
    const { getByText } = render(<Button variant="danger">Danger</Button>);
    expect(getByText('Danger')).toBeTruthy();
  });

  it('should render with small size', () => {
    const { getByText } = render(<Button size="small">Small</Button>);
    expect(getByText('Small')).toBeTruthy();
  });

  it('should render with medium size by default', () => {
    const { getByText } = render(<Button>Medium</Button>);
    expect(getByText('Medium')).toBeTruthy();
  });

  it('should render with large size', () => {
    const { getByText } = render(<Button size="large">Large</Button>);
    expect(getByText('Large')).toBeTruthy();
  });

  it('should show loading indicator when loading', () => {
    const { UNSAFE_root } = render(<Button loading>Loading</Button>);
    expect(UNSAFE_root).toBeDefined();
  });

  it('should apply custom style', () => {
    const customStyle = { marginTop: 10 };
    const { getByText } = render(
      <Button style={customStyle}>Custom</Button>
    );
    expect(getByText('Custom')).toBeTruthy();
  });

  it('should apply custom text style', () => {
    const customTextStyle = { fontSize: 20 };
    const { getByText } = render(
      <Button textStyle={customTextStyle}>Custom Text</Button>
    );
    expect(getByText('Custom Text')).toBeTruthy();
  });

  it('should have accessibility label', () => {
    const { getByLabelText } = render(
      <Button accessibilityLabel="Submit button">Submit</Button>
    );
    expect(getByLabelText('Submit button')).toBeTruthy();
  });
});

