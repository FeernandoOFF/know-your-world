import styles from '../styles/Home.module.css';

import { useState } from 'react';
import Globe from '../components/Globe/index';
import CountryDetails from '../components/CountryDetails';

function Home() {
  const [currentCountry, setCurrentCountry] = useState(null);

  return (
    <div className={styles.main}>
      <Globe
        currentCountry={currentCountry}
        setCurrentCountry={setCurrentCountry}
      />
      {currentCountry && (
        <CountryDetails
          country={currentCountry}
          setCurrentCountry={setCurrentCountry}
        />
      )}
    </div>
  );
}

export default Home;
