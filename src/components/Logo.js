import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import logoIcon from './logo.svg';

// ----------------------------------------------------------------------

export default function Logo({ disabledLink = false, sx }) {
  const theme = useTheme();
  const PRIMARY_LIGHT = theme.palette.primary.light;
  const PRIMARY_MAIN = theme.palette.primary.main;
  const PRIMARY_DARK = theme.palette.primary.dark;

  const logo = (
    <Box sx={{ width: 50, height: 50, ...sx }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 333333 287879"
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
        imageRendering="optimizeQuality"
        fillRule="evenodd"
        clipRule="evenodd"
      >
        <defs>
          <mask id="id0">
            <linearGradient
              id="id1"
              gradientUnits="userSpaceOnUse"
              x1={246054}
              y1={287879}
              x2={246054}
              y2={257576}
            >
              <stop offset={0} stopOpacity={0.2} stopColor="#fff" />
              <stop offset={1} stopOpacity={0.02} stopColor="#fff" />
            </linearGradient>
            <path fill="url(#id1)" d="M196693 257426h98722v30603h-98722z" />
          </mask>
          <mask id="id2">
            <radialGradient
              id="id3"
              gradientUnits="userSpaceOnUse"
              cx={-1213540}
              cy={-1071900}
              r={17594400}
              fx={-1213540}
              fy={-1071900}
            >
              <stop offset={0} stopOpacity={0.102} stopColor="#fff" />
              <stop offset={1} stopOpacity={0} stopColor="#fff" />
              <stop offset={1} stopColor="#fff" />
            </radialGradient>
            <path fill="url(#id3)" d="M-150-150h333633v288179H-150z" />
          </mask>
          <radialGradient
            id="id5"
            gradientUnits="userSpaceOnUse"
            cx={13333.5}
            cy={8636.22}
            r={166667}
            fx={13333.5}
            fy={8636.22}
          >
            <stop offset={0} stopColor="#fff" />
            <stop offset={1} stopColor="#fff" />
            <stop offset={1} stopColor="#fff" />
          </radialGradient>
          <linearGradient
            id="id4"
            gradientUnits="userSpaceOnUse"
            x1={246054}
            y1={287879}
            x2={246054}
            y2={257576}
          >
            <stop offset={0} stopColor="#bf360c" />
            <stop offset={1} stopColor="#bf360c" />
          </linearGradient>
          <style>{'.fil5{fill:#fff;fill-opacity:.2}'}</style>
        </defs>
        <g id="Layer_x0020_1">
          <g id="google-classroom.svg">
            <path fill="#0f9d58" d="M30303 30303h272727v227273H30303z" />
            <path
              d="M227272 151515c9407 0 17046-7639 17046-17045 0-9407-7639-17046-17046-17046-9406 0-17045 7639-17045 17046 0 9406 7639 17045 17045 17045zm0 11364c-18245 0-37879 9659-37879 21654v12437h75758v-12437c0-11995-19634-21654-37879-21654zm-121212-11364c9406 0 17045-7639 17045-17045 0-9407-7639-17046-17045-17046-9407 0-17046 7639-17046 17046 0 9406 7639 17045 17046 17045zm0 11364c-18245 0-37879 9659-37879 21654v12437h75758v-12437c0-11995-19634-21654-37879-21654z"
              fill="#57bb8a"
            />
            <path
              d="M166667 136364c12563 0 22727-10164 22727-22728 0-12563-10164-22727-22727-22727s-22727 10164-22727 22727 10164 22728 22727 22728zm0 15151c-25568 0-53030 13573-53030 30303v15152h106061v-15152c0-16730-27462-30303-53030-30303z"
              fill="#f7f7f7"
            />
            <path fill="#f1f1f1" d="M196970 242424h68182v15152h-68182z" />
            <path
              d="M310606 0H22727C10164 0 0 10164 0 22727v242424c0 12563 10164 22727 22727 22727h287879c12563 0 22727-10164 22727-22727V22727C333333 10164 323169 0 310606 0zm-7576 257576H30302V30304h272728v227272z"
              fill="#f4b400"
            />
            <path
              className="fil5"
              d="M310606 0H22727C10164 0 0 10164 0 22727v1894C0 12058 10164 1894 22727 1894h287879c12563 0 22727 10164 22727 22727v-1894C333333 10164 323169 0 310606 0z"
            />
            <path
              d="M310606 285985H22727C10164 285985 0 275821 0 263258v1894c0 12563 10164 22727 22727 22727h287879c12563 0 22727-10164 22727-22727v-1894c0 12563-10164 22727-22727 22727z"
              fill="#bf360c"
              fillOpacity={0.2}
            />
            <path
              mask="url(#id0)"
              fill="url(#id4)"
              d="M265025 257576h-68182l30303 30303h68119z"
            />
            <path
              fill="#263238"
              fillOpacity={0.2}
              d="M30303 28409h272727v1894H30303z"
            />
            <path className="fil5" d="M30303 257576h272727v1894H30303z" />
            <path
              d="M310606 0H22727C10164 0 0 10164 0 22727v242424c0 12563 10164 22727 22727 22727h287879c12563 0 22727-10164 22727-22727V22727C333333 10164 323169 0 310606 0z"
              mask="url(#id2)"
              fill="url(#id5)"
            />
          </g>
        </g>
      </svg>
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <RouterLink to="/">{logo}</RouterLink>;
}

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object
};
