import React from 'react';
import './css/loading.css';
import styles from './css/loadin.module.css';
import loadingSVG from '../../assets/loading.svg';

interface childProps {
    loading?: boolean
    setLoading?: () => void
}

const Loading: React.FC<childProps> = function (props) {
  const { loading, setLoading } = props;
  if (loading) {
    return (
      <div id={styles.loading}>
        <div id={styles.loadingCenter}>
          <div id={styles.loadingCenterAbsolute}>
            <div id={styles.loadingObject}>
              <img src={loadingSVG} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <div />;
};

export default Loading;
