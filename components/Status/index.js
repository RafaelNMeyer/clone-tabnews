import styles from './Status.module.css'

function Status({ isLoading, data }) {
  let updated_at = data ? data.updated_at : "";
  let db_version = data ? data.db_version : "";
  let max_connections = data ? data.max_connections : "";
  let active_connections = data ? data.active_connections : "";
  let updated_at_formatted = new Date(updated_at).toLocaleString("pt-BR");
  return (
    <>
      <div className={styles.container}>
        {!isLoading ?
          <div className={styles.board}>
            <div className={styles.subject}>
              <h1> Status </h1>
              <div className={styles.prop}>
                <div className='field'> Last update:</div>
                <div className='value'> {updated_at_formatted}</div>
              </div>
            </div>
            <div className={styles.subject}>
              <h1> Database </h1>
              <div className={styles.prop}>
                <div className='field'>Database version:</div>
                <div className='value'>{db_version}</div>
              </div>
              <div className={styles.prop}>
                <div className='field'>Max connections:</div>
                <div className='value'>{max_connections}</div>
              </div>
              <div className={styles.prop}>
                <div className='field'>Active connections:</div>
                <div className='value'>{active_connections}</div>
              </div>
            </div>
          </div>
          : <div> Loading... </div>
        }
      </div>
    </>
  )
};

export default Status;
