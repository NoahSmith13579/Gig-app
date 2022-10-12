interface PopoutBoxProps {
    title: string;
    body: string;
    onClick(): void;
    PopOutClickOutside(): void;
    onConfirmDelete?(): void;
}

const PopoutBox: React.FC<PopoutBoxProps> = ({
    title,
    body,
    onClick,
    PopOutClickOutside,
    onConfirmDelete,
}) => {
    return (
        <div className='modal' onClick={PopOutClickOutside}>
            <div className='modal-content'>
                <h1>{title}</h1>
                <hr />
                <p>{body}</p>
                {onConfirmDelete ? (
                    <>
                        <div className='flex'>
                            <button className='m-1' onClick={onClick}>
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
                    <button onClick={onClick}>Close</button>
                )}
            </div>
        </div>
    );
};

export default PopoutBox;
