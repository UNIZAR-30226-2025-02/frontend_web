import { useEffect } from 'react';

export default function usePreventExit({ onConfirm }) {
  useEffect(() => {
    const handlePopState = () => {
      const confirm = window.confirm("Estas en partida, no puedes abandonar la página hasta que termines la partida.");
      if (confirm) {
        onConfirm();
      } else {
        history.pushState(null, '', location.href);
      }
    };

    // Bloquear con beforeunload
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    history.pushState(null, '', location.href);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [onConfirm]);
}
