import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Button, DialogActions, DialogTitle, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// redux
// components
import { useSnackbar } from 'notistack';
import { FormProvider } from '../../../components/hook-form';
import ShareGroup from './ShareGroup';
import { closeModal } from '../../../redux/slices/presentation';
import axios from '../../../utils/axios';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

ShareGroupForm.propTypes = {
  onCancel: PropTypes.func,
  contacts: PropTypes.array,
  recipients: PropTypes.array,
  onAddRecipients: PropTypes.func,
  onSummit: PropTypes.func
};

const ShareGroupSchema = Yup.object().shape({
  groups: Yup.array()
    .min(1, 'Please select at least one group')
});

export default function ShareGroupForm({
  onCancel,
  contacts,
  recipients,
  onAddRecipients,
  onSummit
}) {
  const methods = useForm({
    resolver: yupResolver(ShareGroupSchema),
    defaultValues: { groups: [] }
  });

  const { enqueueSnackbar } = useSnackbar();

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  const handleShareGroup = async (data) => {
    try {
      onSummit();
      enqueueSnackbar('Share presentation in group successfully!', {
        variant: 'success'
      });
      onCancel();
      reset();
    } catch (error) {
      enqueueSnackbar('Share presentation in group fail!', {
        variant: 'error'
      });
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(handleShareGroup)}>
      <DialogTitle>Share Presentation in Groups</DialogTitle>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Controller
          name="groups"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <ShareGroup
              recipients={recipients}
              contacts={contacts}
              onAddRecipients={onAddRecipients}
              error={error}
              methods={methods}
            />
          )}
        />
      </Stack>

      <DialogActions>
        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cancel
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Share
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
