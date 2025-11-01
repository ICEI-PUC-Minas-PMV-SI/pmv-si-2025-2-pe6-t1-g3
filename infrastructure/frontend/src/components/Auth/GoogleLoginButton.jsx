import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ENV } from '../../utils/env';

const SCRIPT_ID = 'google-identity-services';
const SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

const GoogleLoginButton = ({
  onCredential,
  onError = () => {},
  isSubmitting = false,
}) => {
  const buttonRef = useRef(null);
  const hasRenderedButton = useRef(false);
  const [internalError, setInternalError] = useState(null);

  useEffect(() => {
    const clientId = ENV.GOOGLE_CLIENT_ID();
    if (!clientId) {
      const message = 'Login com Google nao esta configurado.';
      setInternalError(message);
      onError?.(message);
      return;
    }

    const renderButton = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) {
        return;
      }

      if (hasRenderedButton.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: ({ credential }) => {
          if (!credential) {
            const message = 'Nao foi possivel obter a credencial do Google.';
            setInternalError(message);
            onError?.(message);
            return;
          }
          setInternalError(null);
          onCredential(credential);
        },
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'filled_black',
        size: 'large',
        shape: 'rectangular',
        text: 'continue_with',
        width: '100%',
      });

      window.google.accounts.id.prompt();
      hasRenderedButton.current = true;
    };

    const existingScript = document.getElementById(SCRIPT_ID);

    if (existingScript) {
      if (window.google && window.google.accounts) {
        renderButton();
      } else {
        existingScript.addEventListener('load', renderButton);
      }

      return () => {
        existingScript.removeEventListener('load', renderButton);
      };
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = renderButton;
    script.onerror = () => {
      const message =
        'Nao foi possivel carregar o Google Identity Services. Tente novamente mais tarde.';
      setInternalError(message);
      onError?.(message);
    };

    document.head.appendChild(script);

    return () => {
      script.removeEventListener('load', renderButton);
    };
  }, [onCredential, onError]);

  return (
    <div className='space-y-2'>
      <div
        ref={buttonRef}
        className={`flex justify-center ${
          isSubmitting ? 'opacity-50 pointer-events-none' : ''
        }`}
      />
      {internalError && (
        <p className='text-xs text-red-600 text-center'>{internalError}</p>
      )}
    </div>
  );
};

GoogleLoginButton.propTypes = {
  onCredential: PropTypes.func.isRequired,
  onError: PropTypes.func,
  isSubmitting: PropTypes.bool,
};

export default GoogleLoginButton;
