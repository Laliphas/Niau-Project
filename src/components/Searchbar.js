import React from 'react';
import styles from './styles/searchbar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


const SearchBar = () => {
  <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
  return (
    <div>

      <div className={styles.searchBarContainer}>
        <input type="text" className={styles.searchInput} placeholder="Search for your cosmetics" />
        <button className={styles.searchButton}>
          <FontAwesomeIcon icon={faSearch} color='black' />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;

