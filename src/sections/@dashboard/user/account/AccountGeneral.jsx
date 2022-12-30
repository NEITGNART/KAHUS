import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
// form
import { useForm, useFormContext, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import PropTypes from 'prop-types';
import useAuth from '../../../../hooks/useAuth';
// utils
import { fData } from '../../../../utils/formatNumber';
// components
// eslint-disable-next-line import/named
import {
  FormProvider,
  RHFTextField,
  RHFUploadAvatar
} from '../../../../components/hook-form';
import RHFDatePicker from '../../../../components/hook-form/RHFDatePicker';
import axios from '../../../../utils/axios';

// ----------------------------------------------------------------------
AccountGeneral.propTypes = {
  user: PropTypes.object,
  onSubmit: PropTypes.func
};

export default function AccountGeneral({ user, onSubmit, ...other }) {
  const UpdateUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required')
  });

  const defaultValues = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    dob: user?.dob || '',
    avatar: user?.avatar || ''
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'photoURL',
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        );
      }
    },
    [setValue]
  );

  // setValue('firstName', user.firstName);
  // setValue('lastName', user.lastName);
  // setValue('dob', user.dob);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              py: 10,
              px: 3,
              textAlign: 'center',
              height: '100%',
              padding: '5%'
            }}
          >
            <RHFUploadAvatar
              name="photoURL"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.secondary'
                  }}
                >
                  Click to change image or drag and drop
                  <br />
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                </Typography>
              }
              avatarPlaceholder={user?.avatar || ''}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3} alignItems="flex-end">
              <RHFTextField name="firstName" label="First Name" />
              <RHFTextField name="lastName" label="Last Name" />
              <RHFDatePicker name="dob" label="Date of birth" />

              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
