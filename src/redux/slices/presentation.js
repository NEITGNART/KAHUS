import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  presentations: [],
  groups: [],
  recipients: [],
  isOpenModal: false,
  selectedPresentationId: null,
  selectedRange: null,
  selectEdit: false,
  selectDelete: false,
  selectShare: false,
  selectDuplicate: false,
  selectInvite: false
};

const slice = createSlice({
  name: 'presentation',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PRESENTATIONS
    getPresentationsSuccess(state, action) {
      state.isLoading = false;
      state.presentations = action.payload;
    },

    getMyGroupSuccess(state, action) {
      state.isLoading = false;
      state.groups = action.payload;
    },

    // CREATE PRESENTATION
    createPresentationSuccess(state, action) {
      const newPresentation = action.payload;
      newPresentation.role = 'owner';
      state.isLoading = false;
      state.presentations = [...state.presentations, newPresentation];
    },
    // UPDATE PRESENTATION
    updatePresentationSuccess(state, action) {
      const presentation = action.payload;
      const updatePresentationLocal = state.presentations.map(
        (_presentation) => {
          if (_presentation.id === presentation.id) {
            return presentation;
          }
          return _presentation;
        }
      );
      state.isLoading = false;
      state.presentations = updatePresentationLocal;
    },

    // DELETE PRESENTATION
    deletePresentationSuccess(state, action) {
      const { presentationId } = action.payload;
      state.presentations = state.presentations.filter(
        (presentation) => presentation.id !== presentationId
      );
    },

    // SELECT PRESENTATION
    selectPresentation(state, action) {
      const presentationId = action.payload.id;
      state[`${action.payload.event}`] = true;
      state.isOpenModal = true;
      state.selectedPresentationId = presentationId;
    },

    addRecipients(state, action) {
      state.recipients = action.payload;
    },

    // OPEN MODAL
    openModal(state) {
      state.isOpenModal = true;
    },

    // CLOSE MODAL
    closeModal(state) {
      state.isOpenModal = false;
      state.selectedPresentationId = null;
      state.selectedRange = null;
      state.selectEdit = false;
      state.selectDelete = false;
      state.selectShare = false;
      state.selectDuplicate = false;
      state.selectInvite = false;
      state.recipients = [];
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectPresentation, addRecipients } =
  slice.actions;

// ----------------------------------------------------------------------

export function getPresentations() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/presentation/my-presentations`);
      dispatch(slice.actions.getPresentationsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getPresentationsByGroupId(groupId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(
        `/api/presentation/group-presentation`,
        {
          groupId
        }
      );
      dispatch(slice.actions.getPresentationsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createPresentation(newPresentation) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(
        '/api/presentation/create',
        newPresentation
      );
      dispatch(slice.actions.createPresentationSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updatePresentation(presentationId, updatePresentationLocal) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/presentation/update', {
        id: presentationId,
        title: updatePresentationLocal
      });
      dispatch(
        slice.actions.updatePresentationSuccess(response.data.presentation)
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deletePresentation(presentationId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/presentation/delete', { presentationId });
      dispatch(slice.actions.deletePresentationSuccess({ presentationId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function sharePresentationInGroup(presentationId, groups) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/presentation/share-group', {
        presentationId,
        groups
      });
      const response = await axios.get(`/api/presentation/my-presentations`);
      dispatch(slice.actions.getPresentationsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getAllGroup() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/group/my-group`);
      dispatch(slice.actions.getMyGroupSuccess(response.data.groups));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
