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
  isOpenModal: false,
  selectedPresentationId: null,
  selectedRange: null
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

    // CREATE PRESENTATION
    createPresentationSuccess(state, action) {
      const newPresentation = action.payload;
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
      const deletePresentationLocal = state.presentations.filter(
        (presentation) => presentation.id !== presentationId
      );
      state.presentations = deletePresentationLocal;
    },

    // SELECT PRESENTATION
    selectPresentation(state, action) {
      const presentationId = action.payload;
      state.isOpenModal = true;
      state.selectedPresentationId = presentationId;
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
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectPresentation } = slice.actions;

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
