import * as React from 'react';


function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      height={'1em'}
      viewBox={'0 0 64 64'}
      width={'1em'}
      xmlns={'http://www.w3.org/2000/svg'}
      {...props}
    >
      <path d={'M43 41V24a11 11 0 00-22 0v17a3.009 3.009 0 00-3 3v2a3.009 3.009 0 003 3h6v9h2v-9h6v13h2V49h6a3.009 3.009 0 003-3v-2a3.009 3.009 0 00-3-3zM23 24a9 9 0 0118 0v17h-4v-8a1 1 0 00-1-1h-3a1.033 1.033 0 00-.71.29l-1.02 1.02-.38-.76A.977.977 0 0030 32h-2a1 1 0 00-1 1v8h-4zm12 10v7h-6v-7h.38l.73 1.45a1 1 0 00.73.54 1.032 1.032 0 00.87-.28l1.7-1.71zm9 12a1 1 0 01-1 1H21a1 1 0 01-1-1v-2a1 1 0 011-1h22a1 1 0 011 1z'} />
      <path d={'M32 18v-2a8.009 8.009 0 00-8 8h2a6.006 6.006 0 016-6zM31 2h2v6h-2zM10.077 11.495l1.414-1.414 4.242 4.242-1.414 1.414zM2 31h6v2H2zM56 31h6v2h-6zM48.257 14.326l4.242-4.242 1.414 1.414-4.242 4.242z'} />
    </svg>
  );
}

const MemoLogo = React.memo(Logo);

export default MemoLogo;
