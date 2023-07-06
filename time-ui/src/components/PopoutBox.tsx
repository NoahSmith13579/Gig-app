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
      <div className='modal' onClick={handlePopoutClickOutsideDelete}>
        <div className='modal-content'>
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
        </div>
      </div>
    </>
  ) : (
    <>
      <div className='modal' onClick={handlePopoutClickOutside}>
        <div className='modal-content'>
          <h1>{title}</h1>
          <hr />
          <p>{body}</p>
          <div className='flex'>
            <button onClick={() => close}>Close</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopoutBox;
