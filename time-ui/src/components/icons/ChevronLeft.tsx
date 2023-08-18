import IconProps from './IconProps';

const ChevronLeft: React.FC<IconProps> = ({ style, onClick, classNames }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='14'
    height='14'
    fill='none'
    stroke='currentColor'
    strokeLinecap='round'
    strokeLinejoin='round'
    strokeWidth='2'
    className={'feather feather-chevrons-left' + classNames}
    viewBox='0 0 24 24'
    style={style}
    onClick={onClick}
    aria-label='Page to the Left'
  >
    <path d='M11 17L6 12 11 7'></path>
    <path d='M18 17L13 12 18 7'></path>
  </svg>
);

export default ChevronLeft;
