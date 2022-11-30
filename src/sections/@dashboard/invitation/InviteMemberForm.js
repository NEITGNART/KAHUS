import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Box,
  Stack,
  Button,
  TextField,
  DialogActions,
  Autocomplete,
  Chip
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// redux
// components
import { FormProvider } from '../../../components/hook-form';
import axios from '../../../utils/axios';

// ----------------------------------------------------------------------

const TAGS_OPTION = [];

const getInitialValues = () => {
  const localEvent = {
    tags: []
  };
  return localEvent;
};

// ----------------------------------------------------------------------

InviteMemberForm.propTypes = {
  onCancel: PropTypes.func,
  classId: PropTypes.string,
  className: PropTypes.string
};

export default function InviteMemberForm({ onCancel, classId, className }) {
  const { enqueueSnackbar } = useSnackbar();

  const InvitationSchema = Yup.object().shape({
    // title: Yup.string().max(255).required('Title is required'),
    tags: Yup.array().min(1, 'tag is required')
  });

  const methods = useForm({
    resolver: yupResolver(InvitationSchema),
    defaultValues: getInitialValues()
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  const values = watch();

  const onSubmit = async () => {
    try {
      const { tags } = values;
      console.log(tags);
      const inviteMembers = async () => {
        const response = await axios.post(`/api/group/add-member`, {
          groupId: classId,
          groupName: className,
          emails: values.tags
        });
        return response.data;
      };
      inviteMembers()
        .then(() => {
          enqueueSnackbar('Invite success!', { variant: 'success' });
        })
        .catch((err) => {
          console.log(err);
        });
      onCancel();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              multiple
              freeSolo
              onChange={(eventTemp, newValue) => field.onChange(newValue)}
              options={TAGS_OPTION.map((option) => option)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    size="small"
                    label={option}
                  />
                ))
              }
              renderInput={(params) => <TextField label="Emails" {...params} />}
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
          Add
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
