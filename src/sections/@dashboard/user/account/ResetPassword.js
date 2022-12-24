import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import axios from '../../../../utils/axios';

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const ChangePassWordSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('New Password is required'),
    confirmNewPassword: Yup.string().oneOf(
      [Yup.ref('newPassword'), null],
      'Passwords must match'
    )
  });

  const defaultValues = {
    newPassword: '',
    confirmNewPassword: ''
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get('token');
  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  const onSubmit = async (data) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      reset();

      await axios.post('/api/account/reset-password', {
        token,
        password: data.newPassword
      });

      enqueueSnackbar('Reset password successfully!');
      // navigate to Login
      navigate('/auth/login', { replace: true });
    } catch (error) {
      enqueueSnackbar(error.message);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">
          <RHFTextField
            name="newPassword"
            type="password"
            label="New Password"
          />

          <RHFTextField
            name="confirmNewPassword"
            type="password"
            label="Confirm New Password"
          />

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Reset Password
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
