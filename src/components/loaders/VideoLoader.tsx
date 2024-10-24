import styles from '@/styles/loading.module.css';

function VideoLoader() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className={styles.lds_ellipsis} style={{ top: '0%', left: '0%', transform: 'none' }}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default VideoLoader;
