export const HeartFill = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.4107 19.9677C7.58942 17.858 2 13.0348 2 8.69444C2 5.82563 4.10526 3.5 7 3.5C8.5 3.5 10 4 12 6C14 4 15.5 3.5 17 3.5C19.8947 3.5 22 5.82563 22 8.69444C22 13.0348 16.4106 17.858 13.5893 19.9677C12.6399 20.6776 11.3601 20.6776 10.4107 19.9677Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.9697 8.46972C16.2626 8.17683 16.7373 8.17683 17.0302 8.46972C17.3231 8.76262 17.3231 9.23738 17.0302 9.53027L11.5302 15.0303C11.2373 15.3232 10.7626 15.3232 10.4697 15.0303L7.46967 12.0303C7.17678 11.7374 7.17678 11.2626 7.46967 10.9697C7.76256 10.6768 8.23732 10.6768 8.53022 10.9697L10.9999 13.4394L15.9697 8.46972Z"
      fill="white"
    />
  </svg>
);

export default HeartFill;
