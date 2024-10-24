import styles from '@/styles/loading.module.css';

export default function Loading() {
  return (
    <div className={styles.loading_back}>
      <div className={styles.lds_ellipsis}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
