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
  MenuItem,
  Avatar,
  Chip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

import {
  fetchAvailableRedemptionPairs,
  createRedemptionItem,
  updateRedemptionItem,
  ARSpotCollectibleOption,
  RedemptionItem,
} from './redemptionItemServices';
import {
  RedemptionItemFormInputs,
  redemptionItemValidationSchema,
} from './redemptionItemValidation';

interface RedemptionItemModalProps {
  open: boolean;
  onClose: () => void;
  reloadItems: () => void;
  mode: 'create' | 'edit';
  initialData?: Partial<RedemptionItem> & { id?: string; resolvedImgURL?: string };
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

export default function RedemptionItemModal({
  open,
  onClose,
  reloadItems,
  mode,
  initialData,
}: RedemptionItemModalProps) {
  const isEdit = mode === 'edit';
  const [existingImage, setExistingImage] = useState(initialData?.resolvedImgURL || '');
  const [newImagePreview, setNewImagePreview] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState<ARSpotCollectibleOption[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<RedemptionItemFormInputs>({
    resolver: yupResolver(redemptionItemValidationSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 0,
      stock: 0,
      requiredCollectibleId: '',
      imageFile: null,
      isEdit,
      imageRemoved: false,
    },
  });

  useEffect(() => {
    if (open && !isEdit) {
      fetchAvailableRedemptionPairs()
        .then(setDropdownOptions)
        .catch(() => toast.error('Failed to load collectible options'));
    }
  }, [open, isEdit]);

  useEffect(() => {
    if (initialData && open) {
      reset({
        ...initialData,
        imageFile: null,
        isEdit,
        imageRemoved: !initialData.resolvedImgURL,
      });
      setExistingImage(initialData.resolvedImgURL || '');
      setNewImagePreview('');
    } else if (open && !initialData) {
      reset({
        title: '',
        description: '',
        priority: 0,
        stock: 0,
        requiredCollectibleId: '',
        imageFile: null,
        isEdit: false,
        imageRemoved: false,
      });
      setExistingImage('');
      setNewImagePreview('');
    }
  }, [initialData, open, reset, isEdit]);

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

  const handleFormSubmit: SubmitHandler<RedemptionItemFormInputs> = async (data) => {
    try {
      if (isEdit && initialData?.id) {
        await updateRedemptionItem(initialData.id, data, initialData.resolvedImgURL);
      } else {
        await createRedemptionItem(data);
      }

      toast.success(`Redemption item ${isEdit ? 'updated' : 'created'} successfully`);
      reset();
      reloadItems();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save item';
      toast.error(message);
    }
  };

  const handleClose = () => {
    // Reset form fields to default values
    reset({
      title: '',
      description: '',
      priority: 0,
      stock: 0,
      requiredCollectibleId: '',
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
            {isEdit ? 'Edit' : 'Create'} Redemption Item
          </Typography>

          <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
            <Stack spacing={2}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Title"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
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
                name="stock"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Stock"
                    type="number"
                    fullWidth
                    error={!!errors.stock}
                    helperText={errors.stock?.message}
                  />
                )}
              />
              {!isEdit && (
                <Controller
                  name="requiredCollectibleId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Collectible & AR Spot"
                      select
                      fullWidth
                      disabled={dropdownOptions.length === 0}
                      error={!!errors.requiredCollectibleId}
                      helperText={
                        dropdownOptions.length === 0
                          ? 'No AR Spots with collectibles available'
                          : errors.requiredCollectibleId?.message
                      }
                    >
                      {dropdownOptions.length > 0 ? (
                        dropdownOptions.map((opt) => (
                          <MenuItem key={opt.collectibleId} value={opt.collectibleId}>
                            {opt.label}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="" disabled>
                          No available AR Spot + Collectible pairs
                        </MenuItem>
                      )}
                    </TextField>
                  )}
                />
              )}
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
