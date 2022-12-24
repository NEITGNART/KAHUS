import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from '@hookform/error-message';
// @mui
import {
  Box,
  Stack,
  Button,
  TextField,
  DialogActions,
  Autocomplete,
  Chip,
  FormHelperText
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// redux
// components
import { useState } from 'react';
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
    tags: Yup.array().min(1, 'Emails is required')
  });

  const methods = useForm({
    resolver: yupResolver(InvitationSchema),
    defaultValues: getInitialValues()
  });

  const {
    register,
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

  const [inputValue, setInputValue] = useState('');
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const [errorEmail, setErrorEmail] = useState(false);

  const onChange = (e, value, field) => {
    // error
    const errorEmailLocal = value.find((email) => !regex.test(email));
    if (errorEmailLocal) {
      // set value displayed in the textbox
      setInputValue(errorEmailLocal);
      setErrorEmail(true);
    } else {
      setErrorEmail(false);
    }
    // Update state
    const emailsValid = value.filter((email) => regex.test(email));
    field.onChange(emailsValid);
  };

  const onDelete = (value, field) => {
    field.onChange(field.value.filter((e) => e !== value));
  };

  const onInputChange = (e, newValue) => {
    setInputValue(newValue);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Controller
          name="tags"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <Autocomplete
                multiple
                onChange={(e, value) => onChange(e, value, field)}
                id="tags-filled"
                value={field.value}
                inputValue={inputValue}
                onInputChange={onInputChange}
                options={[]}
                freeSolo
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                      onDelete={() => onDelete(option, field)}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    label="Emails"
                    {...params}
                    type="email"
                    error={!!error || !!errorEmail}
                    helperText={
                      (error && error?.message) ||
                      (errorEmail && 'Enter a valid email')
                    }
                  />
                )}
              />
            </>
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
