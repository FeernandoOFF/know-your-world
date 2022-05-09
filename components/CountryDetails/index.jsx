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

const dataLineVariants = {
  hidden: {
    height: '0%',
  },
  show: {
    height: '500px',
    transition: {
      duration: 1,
      staggerChildren: 0.3,
      delay: 2,
      when: 'beforeChildren',
    },
  },
};

const dataItemVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
  },
};

function CountryDetails({ country, setCurrentCountry }) {
  const [data, setData] = useState(null);
  const [countryData, setCountryData] = useState(null);

  useEffect(() => {
    if (!country) return;
    axios(
      'https://en.wikipedia.org/api/rest_v1/page/summary/' + country.name
    ).then(({ data }) => {
      setData(data);
    });

    axios('https://restcountries.com/v2/alpha/' + country.alpha).then(
      ({ data: d }) => {
        setCountryData(d);
        console.log('EXTRA DATA', d);
      }
    );
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
        <div className={styles.dataContainer}>
          <div className={styles.top}>
            <div className={styles.title}>
              <img
                src={data.thumbnail.source}
                alt={data.name}
                width={80}
                height={40}
              />
              <h3> {country.name} </h3>
            </div>
            <button onClick={() => setCurrentCountry(null)}>X</button>
          </div>
          <motion.div variants={dataLineVariants} className={styles.dataLine}>
            <motion.div
              variants={dataItemVariants}
              className={styles.dataItem}
            ></motion.div>
            <motion.div
              variants={dataItemVariants}
              className={styles.dataItem}
            ></motion.div>
            <motion.div
              variants={dataItemVariants}
              className={styles.dataItem}
            ></motion.div>
            <motion.div
              variants={dataItemVariants}
              className={styles.dataItem}
            ></motion.div>
          </motion.div>

          {/* <div className={styles.description}>
            <p>{data.extract} </p>
          </div> */}
          {/* <img src={data.originalimage.source} alt="" /> */}
        </div>
      )}
    </motion.div>
  );
}

export default CountryDetails;
