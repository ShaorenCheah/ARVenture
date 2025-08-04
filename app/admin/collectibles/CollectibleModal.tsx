'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoIcon from '@mui/icons-material/Photo';
import {
  Modal,
  Box,
  Paper,
  Typography,
  Stack,
  IconButton,
  TextField,
  Button,
  Avatar,
  Chip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

import { createCollectible, updateCollectible } from './collectibleServices';
import { CollectibleFormInputs } from './collectibleValidation';
import { collectibleValidationSchema } from './collectibleValidation';

interface CollectibleModalProps {
  open: boolean;
  onClose: () => void;
  reloadCollectibles: () => void;
  initialData?: Partial<CollectibleFormInputs> & { id?: string; imageURL?: string };
  mode: 'create' | 'edit';
}

const ImagePreview = ({
  imageUrl,
  isExisting,
  onRemove,
}: {
  imageUrl?: string;
  isExisting?: boolean;
  onRemove?: () => void;
}) => {
  if (!imageUrl) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      <Avatar src={imageUrl} sx={{ width: 40, height: 40, borderRadius: 1 }} variant="rounded">
        <PhotoIcon />
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Chip
          label={isExisting ? 'Current Image' : 'New Image'}
          size="small"
          color={isExisting ? 'primary' : 'success'}
          variant="outlined"
        />
      </Box>
      {onRemove && (
        <IconButton size="small" onClick={onRemove} color="error">
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default function CollectibleModal({
  open,
  onClose,
  reloadCollectibles,
  initialData,
  mode,
}: CollectibleModalProps) {
  const isEdit = mode === 'edit';
  const [existingImage, setExistingImage] = useState(initialData?.imageURL || '');
  const [newImagePreview, setNewImagePreview] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CollectibleFormInputs>({
    resolver: yupResolver(collectibleValidationSchema),
    defaultValues: {
      title: '',
      description: '',
      redemptionCode: '',
      priority: 0,
      tips: '',
      arSpotId: '',
      imageFile: null,
      isEdit,
      imageRemoved: false,
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          ...initialData,
          imageFile: null,
          isEdit: true,
          imageRemoved: !initialData.imageURL,
        });
        setExistingImage(initialData.imageURL || '');
        setNewImagePreview('');
      } else {
        reset();
        setExistingImage('');
        setNewImagePreview('');
      }
    }
  }, [initialData, open, reset]);

  const handleImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setNewImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setNewImagePreview('');
    }
  };

  const handleRemoveExistingImage = () => {
    setExistingImage('');
    setValue('imageRemoved', true, { shouldValidate: true });
    setValue('imageFile', null);
  };

  const handleRemoveNewImage = () => {
    setNewImagePreview('');
    setValue('imageFile', null);
  };

  const handleFormSubmit: SubmitHandler<CollectibleFormInputs> = async (data) => {
    try {
      if (isEdit && initialData?.id) {
        await updateCollectible(data, initialData.id, initialData.imageURL);
      } else {
        await createCollectible(data);
      }

      toast.success(`Collectible ${isEdit ? 'updated' : 'created'} successfully!`);
      reset();
      reloadCollectibles();
      onClose(); // Close the modal after successful submission
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save collectible';
      toast.error(message);
    }
  };

  const handleClose = () => {
    // Reset form fields to default values
    reset({
      title: '',
      description: '',
      redemptionCode: '',
      priority: 0,
      tips: '',
      arSpotId: '',
      imageFile: null,
      isEdit: isEdit,
      imageRemoved: false,
    });

    // Reset image preview states
    setExistingImage('');
    setNewImagePreview('');

    // Close the modal
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          py: 4,
          overflowY: 'auto',
        }}
      >
        <Paper sx={{ width: '100%', maxWidth: 500, p: 3, borderRadius: 2, position: 'relative' }}>
          <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 12, right: 12 }}>
            <CloseIcon />
          </IconButton>

          <Typography variant="h5" fontWeight={600} mb={3}>
            {isEdit ? 'Edit' : 'Create'} Collectible
          </Typography>

          <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
            <Stack spacing={2}>
              {['title', 'description', 'redemptionCode', 'tips'].map((fieldName) => (
                <Controller
                  key={fieldName}
                  name={fieldName as keyof CollectibleFormInputs}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                      fullWidth
                      error={!!errors[fieldName as keyof typeof errors]}
                      helperText={errors[fieldName as keyof typeof errors]?.message}
                    />
                  )}
                />
              ))}

              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Priority"
                    type="number"
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
                    <Typography variant="body2" fontWeight={500} mb={1}>
                      Upload Image
                    </Typography>

                    <ImagePreview
                      imageUrl={newImagePreview || existingImage || undefined}
                      onRemove={() => {
                        if (newImagePreview) handleRemoveNewImage();
                        else if (existingImage) handleRemoveExistingImage();
                      }}
                      isExisting={!newImagePreview && !!existingImage}
                    />

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
                          handleImageChange(file);
                        }}
                        style={{ width: '100%' }}
                      />
                    </Box>

                    {isEdit && !newImagePreview && existingImage && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5, display: 'block' }}
                      >
                        Leave empty to keep current image
                      </Typography>
                    )}

                    {errors.imageFile && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {errors.imageFile.message as string}
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
