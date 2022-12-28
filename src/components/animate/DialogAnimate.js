import PropTypes from 'prop-types';
import { AnimatePresence, m } from 'framer-motion';
// @mui
import { Box, Dialog, Paper } from '@mui/material';
//
import { varFade } from './variants';

// ----------------------------------------------------------------------

DialogAnimate.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  sx: PropTypes.object,
  variants: PropTypes.object,
  size: PropTypes.string
};

export default function DialogAnimate({
  open = false,
  variants,
  onClose,
  children,
  size = 'xs',
  sx,
  ...other
}) {
  function createPaperComponent(props) {
    return (
      <Box
        component={m.div}
        {...(variants ||
          varFade({
            distance: 120,
            durationIn: 0.32,
            durationOut: 0.24,
            easeIn: 'easeInOut'
          }).inUp)}
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          onClick={onClose}
          sx={{ width: '100%', height: '100%', position: 'fixed' }}
        />
        <Paper sx={sx} {...props}>
          {props.children}
        </Paper>
      </Box>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          fullWidth
          maxWidth={size}
          open={open}
          onClose={onClose}
          // PaperComponent={(props) => (
          //   <Box
          //     component={m.div}
          //     {...(variants ||
          //       varFade({
          //         distance: 120,
          //         durationIn: 0.32,
          //         durationOut: 0.24,
          //         easeIn: 'easeInOut'
          //       }).inUp)}
          //     sx={{
          //       width: '100%',
          //       height: '100%',
          //       display: 'flex',
          //       alignItems: 'center',
          //       justifyContent: 'center'
          //     }}
          //   >
          //     <Box
          //       onClick={onClose}
          //       sx={{ width: '100%', height: '100%', position: 'fixed' }}
          //     />
          //     <Paper sx={sx} {...props}>
          //       {props.children}
          //     </Paper>
          //   </Box>
          // )}
          // PaperComponent={createPaperComponent()}
          {...other}
        >
          {children}
        </Dialog>
      )}
    </AnimatePresence>
  );
}
