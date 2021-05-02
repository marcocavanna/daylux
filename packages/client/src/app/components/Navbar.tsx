import * as React from 'react';

import Button from '@appbuckets/react-ui/Button';

import Logo from '../../assets/Logo';
import { useAppContext } from '../context';


const Navbar: React.VFC = () => {

  const {
    setView,
    view
  } = useAppContext();

  const handleToggleView = React.useCallback(
    () => setView(view === 'home' ? 'settings' : 'home'),
    [ view, setView ]
  );

  return (
    <div className={'navbar'}>
      <div className={'navbar-content'}>
        <Logo className={'logo'} />
        <h4>{view === 'settings' ? 'Impostazioni' : 'DayLux'}</h4>
        <Button
          primary
          icon={view === 'settings' ? 'home' : 'cogs'}
          onClick={handleToggleView}
        />
      </div>
    </div>
  );
};

Navbar.displayName = 'Navbar';

export default Navbar;
