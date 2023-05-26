import React, { useEffect } from 'react';

const AdScript = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
      atOptions = {
        'key' : 'a289156f19d87329de9aeda95374d485',
        'format' : 'iframe',
        'height' : 600,
        'width' : 160,
        'params' : {}
      };
      document.write('<scr' + 'ipt type="text/javascript" src="http' + (location.protocol === 'https:' ? 's' : '') + '://www.profitabledisplaynetwork.com/a289156f19d87329de9aeda95374d485/invoke.js"></scr' + 'ipt>');
    `;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default AdScript;