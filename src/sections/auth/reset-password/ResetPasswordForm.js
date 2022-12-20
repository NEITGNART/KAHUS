import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import { useSnackbar } from 'notistack';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import axios from '../../../utils/axios';

// ----------------------------------------------------------------------

ResetPasswordForm.propTypes = {
  onSent: PropTypes.func,
  onGetEmail: PropTypes.func
};

export default function ResetPasswordForm({ onSent, onGetEmail }) {
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email must be a valid email address')
      .required('Email is required')
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { email: '' }
  });

  const {
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/account/forgot-password', {
        email: data.email
      });
      if (isMountedRef.current) {
        onSent();
        onGetEmail(data.email);
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="email" label="Email address" />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Reset Password
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
