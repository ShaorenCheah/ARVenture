'use client';

import {
  Modal,
  Box,
  Paper,
  Typography,
  Stack,
  IconButton,
  TextField,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect } from 'react';
import { useForm, Controller, useWatch, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { uploadBytes, ref } from 'firebase/storage';

import { db, storage } from '@/lib/firebase';
import {
  ARSpotFormInputs,
  arSpotValidationSchema,
} from './arSpotValidation';

interface ARSpotModalProps {
  open: boolean;
  onClose: () => void;
  reloadSpots: () => void;
  initialData?: Partial<ARSpotFormInputs> & {
    imgURL?: string;
    iconURL?: string;
  };
}

export default function ARSpotModal({
  open,
  onClose,
  reloadSpots,
  initialData,
}: ARSpotModalProps) {
  const isEdit = !!initialData;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ARSpotFormInputs>({
    resolver: yupResolver(arSpotValidationSchema, { context: { isEdit } }),
    defaultValues: {
      id: '',
      name: '',
      description: '',
      address: '',
      arURL: '',
      collectibleId: '',
      collectibleTips: '',
      priority: 1,
      coordinates: { lat: 0, lng: 0 },
      imageFile: null,
      iconFile: null,
      ...initialData,
    },
  });

  const name = useWatch({ control, name: 'name' });

  useEffect(() => {
    if (!isEdit && name) {
      const id = name.toLowerCase().replace(/\s+/g, '_');
      setValue('id', id);
    }
  }, [name, isEdit, setValue]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit: SubmitHandler<ARSpotFormInputs> = async (data) => {
    const { id, imageFile, iconFile } = data;

    try {
      let imgURL = initialData?.imgURL || '';
      let iconURL = initialData?.iconURL || '';

      if (imageFile) {
        const ext = imageFile.name.split('.').pop();
        imgURL = `ar_spots/${id}.${ext}`;
        await uploadBytes(ref(storage, imgURL), imageFile);
      }

      if (iconFile) {
        const ext = iconFile.name.split('.').pop();
        iconURL = `ar_spots/spots_icons/${id}_icon.${ext}`;
        await uploadBytes(ref(storage, iconURL), iconFile);
      }

      await setDoc(doc(db, 'ar_spots', id), {
        name: data.name,
        description: data.description,
        address: data.address,
        arURL: data.arURL,
        collectibleId: data.collectibleId,
        collectibleTips: data.collectibleTips,
        priority: data.priority,
        coordinates: data.coordinates,
        createdAt: serverTimestamp(),
        imgURL,
        iconURL,
      });

      toast.success(`AR Spot ${isEdit ? 'updated' : 'created'} successfully!`);
      reset();
      reloadSpots();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save AR Spot';
      toast.error(message);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          zIndex: 1301,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          px: 2,
          py: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflowY: 'auto',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            maxWidth: 600,
            p: 3,
            borderRadius: 2,
            backgroundColor: 'white',
            position: 'relative',
          }}
        >
          <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 12, right: 12 }}>
            <CloseIcon />
          </IconButton>

          <Typography variant="h5" fontWeight={600} mb={3}>
            {isEdit ? 'Edit' : 'Create'} AR Spot
          </Typography>

          <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
            <Stack spacing={2}>
              {[
                { name: 'id', label: 'Spot ID', disabled: isEdit },
                { name: 'name', label: 'Name' },
                { name: 'description', label: 'Description' },
                { name: 'address', label: 'Address' },
                { name: 'arURL', label: 'AR URL' },
                { name: 'collectibleId', label: 'Collectible ID' },
                { name: 'collectibleTips', label: 'Collectible Tips' },
              ].map(({ name, label, disabled }) => (
                <Controller
                  key={name}
                  name={name as keyof ARSpotFormInputs}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={label}
                      fullWidth
                      disabled={disabled}
                      error={!!errors[name as keyof typeof errors]}
                      helperText={errors[name as keyof typeof errors]?.message}
                    />
                  )}
                />
              ))}

              <Stack direction="row" spacing={2}>
                <Controller
                  name="coordinates.lat"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Latitude"
                      type="number"
                      fullWidth
                      error={!!errors.coordinates?.lat}
                      helperText={errors.coordinates?.lat?.message}
                    />
                  )}
                />
                <Controller
                  name="coordinates.lng"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Longitude"
                      type="number"
                      fullWidth
                      error={!!errors.coordinates?.lng}
                      helperText={errors.coordinates?.lng?.message}
                    />
                  )}
                />
              </Stack>

              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Priority"
                    fullWidth
                    error={!!errors.priority}
                    helperText={errors.priority?.message}
                  />
                )}
              />

              <Controller
                name="imageFile"
                control={control}
                render={({ field: { onChange } }) => (
                  <Box>
                    <Typography variant="body2" fontWeight={500} mb={0.5}>
                      Main Image (.jpg or .png)
                    </Typography>
                    <Box
                      sx={{
                        border: '1px solid rgba(0, 0, 0, 0.23)',
                        borderRadius: 1,
                        px: 1.5,
                        py: 1,
                        backgroundColor: 'background.paper',
                      }}
                    >
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={(e) => {
                          const file = (e.target as HTMLInputElement).files?.[0] || null;
                          onChange(file);
                        }}
                        style={{ width: '100%' }}
                      />
                    </Box>
                    {errors.imageFile && (
                      <Typography variant="caption" color="error" mt={0.5}>
                        {errors.imageFile.message}
                      </Typography>
                    )}
                  </Box>
                )}
              />

              <Controller
                name="iconFile"
                control={control}
                render={({ field: { onChange } }) => (
                  <Box>
                    <Typography variant="body2" fontWeight={500} mt={2} mb={0.5}>
                      Icon Image (.jpg or .png)
                    </Typography>
                    <Box
                      sx={{
                        border: '1px solid rgba(0, 0, 0, 0.23)',
                        borderRadius: 1,
                        px: 1.5,
                        py: 1,
                        backgroundColor: 'background.paper',
                      }}
                    >
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={(e) => {
                          const file = (e.target as HTMLInputElement).files?.[0] || null;
                          onChange(file);
                        }}
                        style={{ width: '100%' }}
                      />
                    </Box>
                    {errors.iconFile && (
                      <Typography variant="caption" color="error" mt={0.5}>
                        {errors.iconFile.message}
                      </Typography>
                    )}
                  </Box>
                )}
              />


              <Stack direction="row" justifyContent="flex-end" spacing={2} pt={2}>
                <Button onClick={handleClose} variant="outlined">
                  Cancel
                </Button>
                <Button type="submit" variant="contained">
                  {isEdit ? 'Update' : 'Create'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Modal>
  );
}
