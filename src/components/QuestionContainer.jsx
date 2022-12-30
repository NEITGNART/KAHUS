import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import Iconify from './Iconify';

export default function QuestionContainer() {
  return (
    <Box
      sx={{
        width: 500,
        height: 300
      }}
    >
      <Stack sx={{ height: '100%' }}>
        <Typography align="center">1 / 5</Typography>
        <Stack sx={{ height: '100%' }} direction="row" alignItems="center">
          <IconButton>
            <Iconify icon="ooui:previous-ltr" />
          </IconButton>
          <Typography
            variant="h5"
            sx={{ overflowX: 'hidden' }}
            maxHeight={150}
            overflow="auto"
            align="center"
            color="black"
            paragraph
            flex={1}
          >
            Question content
          </Typography>
          <IconButton>
            <Iconify icon="ooui:previous-rtl" />
          </IconButton>
        </Stack>
        <Typography align="center" paragraph>
          {' '}
          - author -
        </Typography>
        <Button color="primary" sx={{ borderRadius: 28 }} variant="contained">
          Answered
        </Button>
      </Stack>
    </Box>
  );
}
