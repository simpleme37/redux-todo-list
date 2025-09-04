export const Cancel = ({ color = 'currentColor', size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    color={color}
    fill="none"
  >
    <path
      d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
);

export default Cancel;
