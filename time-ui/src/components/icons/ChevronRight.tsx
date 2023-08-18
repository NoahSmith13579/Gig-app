import IconProps from './IconProps';

const ChevronRight: React.FC<IconProps> = ({ style, onClick, classNames }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='14'
    height='14'
    fill='none'
    stroke='currentColor'
    strokeLinecap='round'
    strokeLinejoin='round'
    strokeWidth='2'
    className={'feather feather-chevrons-right' + classNames}
    viewBox='0 0 24 24'
    style={style}
    onClick={onClick}
    aria-label='Page to the right'
  >
    <path d='M13 17L18 12 13 7'></path>
    <path d='M6 17L11 12 6 7'></path>
  </svg>
);

export default ChevronRight;
