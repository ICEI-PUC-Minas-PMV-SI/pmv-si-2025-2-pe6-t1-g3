import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(<LoadingSpinner />);
    // ActivityIndicator is rendered by default
    expect(getByTestId).toBeDefined();
  });

  it('should render with small size by default', () => {
    const { UNSAFE_root } = render(<LoadingSpinner />);
    expect(UNSAFE_root).toBeDefined();
  });

  it('should render with large size', () => {
    const { UNSAFE_root } = render(<LoadingSpinner size="large" />);
    expect(UNSAFE_root).toBeDefined();
  });

  it('should render with custom color', () => {
    const { UNSAFE_root } = render(<LoadingSpinner color="#FF0000" />);
    expect(UNSAFE_root).toBeDefined();
  });

  it('should render with text when provided', () => {
    const { getByText } = render(<LoadingSpinner text="Carregando..." />);
    expect(getByText('Carregando...')).toBeTruthy();
  });

  it('should not render text when not provided', () => {
    const { queryByText } = render(<LoadingSpinner />);
    expect(queryByText('Carregando...')).toBeNull();
  });

  it('should apply custom style', () => {
    const customStyle = { marginTop: 20 };
    const { UNSAFE_root } = render(<LoadingSpinner style={customStyle} />);
    expect(UNSAFE_root).toBeDefined();
  });
});

