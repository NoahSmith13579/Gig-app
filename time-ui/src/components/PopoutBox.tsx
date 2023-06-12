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
  const { handleSetShowPopout, handlePopoutClickOutside } = Handlers();

  const close = () => {
    handleSetShowPopout(false);
  };

  return (
    <div className='modal' onClick={handlePopoutClickOutside}>
      <div className='modal-content'>
        <h1>{title}</h1>
        <hr />
        <p>{body}</p>
        {onConfirmDelete ? (
          <>
            <div className='flex'>
              <button className='m-1' onClick={() => close}>
                Close
              </button>
              <button
                className='m-1'
                style={{ background: 'red' }}
                onClick={onConfirmDelete}
              >
                Confirm Delete
              </button>
            </div>
          </>
        ) : (
          <button onClick={() => close}>Close</button>
        )}
      </div>
    </div>
  );
};

export default PopoutBox;
