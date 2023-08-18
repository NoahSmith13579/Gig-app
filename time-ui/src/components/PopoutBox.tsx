import Handlers from '../handlers/ViewProjHandlers';

interface PopoutBoxProps {
  title: string;
  body: string;
  onConfirmDelete?(): void;
}

const PopoutBox: React.FC<PopoutBoxProps> = ({
  title,
  body,
  onConfirmDelete,
}) => {
  const {
    handleSetShowPopout,
    handlePopoutClickOutside,
    handlePopoutClickOutsideDelete,
    handleSetShowPopoutDelete,
  } = Handlers();

  const close = () => {
    handleSetShowPopout(false);
  };
  const closeDelete = () => {
    handleSetShowPopoutDelete(false);
  };
  const deleteConfirmClick = () => {
    onConfirmDelete!();
    //window.location.href = '/Gig-app/projects';
  };

  return onConfirmDelete ? (
    <>
      <article className='modal' onClick={handlePopoutClickOutsideDelete}>
        <section className='modal-content'>
          <h1>{title}</h1>
          <hr />
          <p>{body}</p>
          <div className='flex'>
            <button className='m-1' onClick={() => closeDelete}>
              Close
            </button>
            <button
              className='m-1'
              style={{ background: 'red' }}
              onClick={deleteConfirmClick}
            >
              Confirm Delete
            </button>
          </div>
        </section>
      </article>
    </>
  ) : (
    <>
      <article className='modal' onClick={handlePopoutClickOutside}>
        <section className='modal-content'>
          <h1>{title}</h1>
          <hr />
          <p>{body}</p>
          <div className='flex'>
            <button onClick={() => close}>Close</button>
          </div>
        </section>
      </article>
    </>
  );
};

export default PopoutBox;
