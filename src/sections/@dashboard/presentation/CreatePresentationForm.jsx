import PropTypes from 'prop-types';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Box,
  Stack,
  Button,
  DialogActions,
  Tooltip,
  IconButton
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// redux
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import axios from '../../../utils/axios';
import { useDispatch } from '../../../redux/store';
import {
  createPresentation,
  updatePresentation
} from '../../../redux/slices/presentation';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const getInitialValues = (presentation) => {
  const localPresentation = {
    title: ''
  };
  if (presentation) {
    return merge({}, localPresentation, presentation);
  }
  return localPresentation;
};

// ----------------------------------------------------------------------

CreatePresentationForm.propTypes = {
  presentation: PropTypes.object,
  onCancel: PropTypes.func
};

export default function CreatePresentationForm({ presentation, onCancel }) {
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const isCreating = Object.keys(presentation).length === 0;

  const CreatePresentationSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Name is required!')
  });

  const methods = useForm({
    resolver: yupResolver(CreatePresentationSchema),
    defaultValues: getInitialValues()
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  const values = watch();

  const onSubmit = async () => {
    try {
      if (isCreating) {
        dispatch(
          createPresentation({
            title: values.title
          })
        );
        enqueueSnackbar('Create presentation success!', { variant: 'success' });
      } else {
        dispatch(updatePresentation(presentation.id, values.title));
        enqueueSnackbar('Update presentation success!', { variant: 'success' });
      }
      onCancel();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <RHFTextField name="title" label="Presentation Name" />
      </Stack>

      <DialogActions>
        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cancel
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {isCreating ? 'Create' : 'Save'}
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
