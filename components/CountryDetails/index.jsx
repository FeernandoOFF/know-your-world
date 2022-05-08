import { motion } from 'framer-motion';
import styles from './Country.module.css';
import { getSingleCountry, useGetSingleCountry } from '../../utils/api';
import { useEffect, useState } from 'react';
import axios from 'axios';

const descriptionVariants = {
  hidden: {
    x: -300,
    opacity: 0,
  },
  show: {
    x: 0,
    opacity: 1,
  },
};

function CountryDetails({ country, setCurrentCountry }) {
  const [data, setData] = useState(null);
  // const [data, isLoading] = useGetSingleCountry(country.name);
  useEffect(() => {
    axios(
      'https://en.wikipedia.org/api/rest_v1/page/summary/' + country.name
    ).then(({ data }) => {
      setData(data);
    });
  }, [country]);
  return (
    <motion.div
      variants={descriptionVariants}
      transition={{ duration: 1, delay: 1 }}
      initial="hidden"
      animate="show"
      className={styles.container}
    >
      {data && (
        <>
          <div className={styles.title}>
            <img
              src={data.thumbnail.source}
              alt={data.name}
              width={80}
              height={40}
            />
            <h3> {country.name} </h3>
          </div>
          <div className={styles.description}>
            <p>{data.extract} </p>
          </div>
          {/* <img src={data.originalimage.source} alt="" /> */}
        </>
      )}
      <button onClick={() => setCurrentCountry(null)}>Clear</button>
    </motion.div>
  );
}

export default CountryDetails;
