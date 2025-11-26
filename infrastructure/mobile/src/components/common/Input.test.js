import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Input from './Input';

describe('Input', () => {
  it('should render correctly', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter text" />
    );
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('should render with label', () => {
    const { getByText } = render(<Input label="Email" />);
    expect(getByText('Email')).toBeTruthy();
  });

  it('should show required indicator when required', () => {
    const { getByText } = render(<Input label="Email" required />);
    expect(getByText('*')).toBeTruthy();
  });

  it('should call onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter text" onChangeText={onChangeText} />
    );
    
    fireEvent.changeText(getByPlaceholderText('Enter text'), 'test');
    expect(onChangeText).toHaveBeenCalledWith('test');
  });

  it('should display error message when error is provided', () => {
    const { getByText } = render(
      <Input error="This field is required" />
    );
    expect(getByText('This field is required')).toBeTruthy();
  });

  it('should not display error message when error is not provided', () => {
    const { queryByText } = render(<Input />);
    expect(queryByText('This field is required')).toBeNull();
  });

  it('should use email keyboard type for email input', () => {
    const { getByPlaceholderText } = render(
      <Input type="email" placeholder="Email" />
    );
    const input = getByPlaceholderText('Email');
    expect(input.props.keyboardType).toBe('email-address');
  });

  it('should use numeric keyboard type for numeric input', () => {
    const { getByPlaceholderText } = render(
      <Input type="numeric" placeholder="Number" />
    );
    const input = getByPlaceholderText('Number');
    expect(input.props.keyboardType).toBe('numeric');
  });

  it('should use phone-pad keyboard type for phone input', () => {
    const { getByPlaceholderText } = render(
      <Input type="phone" placeholder="Phone" />
    );
    const input = getByPlaceholderText('Phone');
    expect(input.props.keyboardType).toBe('phone-pad');
  });

  it('should use secure text entry for password input', () => {
    const { getByPlaceholderText } = render(
      <Input type="password" placeholder="Password" />
    );
    const input = getByPlaceholderText('Password');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('should not use secure text entry for non-password input', () => {
    const { getByPlaceholderText } = render(
      <Input type="text" placeholder="Text" />
    );
    const input = getByPlaceholderText('Text');
    expect(input.props.secureTextEntry).toBe(false);
  });

  it('should disable auto-capitalize for email input', () => {
    const { getByPlaceholderText } = render(
      <Input type="email" placeholder="Email" />
    );
    const input = getByPlaceholderText('Email');
    expect(input.props.autoCapitalize).toBe('none');
  });

  it('should disable auto-correct for email and password', () => {
    const { getByPlaceholderText: getEmail } = render(
      <Input type="email" placeholder="Email" />
    );
    const emailInput = getEmail('Email');
    expect(emailInput.props.autoCorrect).toBe(false);

    const { getByPlaceholderText: getPassword } = render(
      <Input type="password" placeholder="Password" />
    );
    const passwordInput = getPassword('Password');
    expect(passwordInput.props.autoCorrect).toBe(false);
  });

  it('should apply custom style', () => {
    const customStyle = { marginTop: 10 };
    const { getByPlaceholderText } = render(
      <Input placeholder="Text" style={customStyle} />
    );
    expect(getByPlaceholderText('Text')).toBeTruthy();
  });

  it('should display value when provided', () => {
    const { getByDisplayValue } = render(
      <Input value="test value" />
    );
    expect(getByDisplayValue('test value')).toBeTruthy();
  });
});

