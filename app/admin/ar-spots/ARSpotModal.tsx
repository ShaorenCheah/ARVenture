'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Divider,
  CircularProgress,
  Chip,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm, Controller, useWatch, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

import { createARSpot, updateARSpot, fetchAllCollectibles } from './arSpotServices';
import { ARSpotFormInputs, arSpotValidationSchema } from './arSpotValidation';

interface ARSpotModalProps {
  open: boolean;
  onClose: () => void;
  reloadSpots: () => void;
  initialData?: Partial<ARSpotFormInputs> & {
    id?: string;
    imgURL?: string;
    iconURL?: string;
    collectibleImageURL?: string;
    collectibleId?: string;
  };
  mode: 'create' | 'edit';
}

interface ImagePreviewProps {
  imageUrl?: string;
  label: string;
  onRemove?: () => void;
  isExisting?: boolean;
}

interface CollectibleOption {
  id: string;
  title: string;
  description: string;
  redemptionCode: string;
  priority: number;
  imageURL?: string;
  arSpotId?: string;
}

const ImagePreview = ({ imageUrl, label, onRemove, isExisting }: ImagePreviewProps) => {
  if (!imageUrl) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      <Avatar src={imageUrl} sx={{ width: 40, height: 40, borderRadius: 1 }} variant="rounded">
        <PhotoIcon />
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" fontWeight={500}>
          {label}
        </Typography>
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

export default function ARSpotModal({
  open,
  onClose,
  reloadSpots,
  initialData,
  mode,
}: ARSpotModalProps) {
  const isEdit = mode === 'edit';
  const [loadingCollectibles, setLoadingCollectibles] = useState(false);
  const [availableCollectibles, setAvailableCollectibles] = useState<CollectibleOption[]>([]);
  const [selectedCollectible, setSelectedCollectible] = useState<CollectibleOption | null>(null);

  // Track existing and new images
  const [existingImages, setExistingImages] = useState({
    mainImage: initialData?.imgURL || '',
    iconImage: initialData?.iconURL || '',
  });

  const [newImagePreviews, setNewImagePreviews] = useState({
    mainImage: '',
    iconImage: '',
  });

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ARSpotFormInputs>({
    resolver: yupResolver(arSpotValidationSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      arURL: '',
      collectibleId: '',
      hasCollectible: false,
      priority: 0,
      coordinates: { lat: 0, lng: 0 },
      imageFile: null,
      iconFile: null,
      isEdit: mode === 'edit', // make sure to pass this in
      mainImageRemoved: false,
      iconImageRemoved: false,
    },
  });
  const hasCollectible = useWatch({ control, name: 'hasCollectible' });

  // Load available collectibles
  useEffect(() => {
    if (open) {
      loadCollectibles();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (!isEdit) {
      reset({
        name: '',
        description: '',
        address: '',
        arURL: '',
        priority: 0,
        coordinates: { lat: 0, lng: 0 },
        collectibleId: '',
        hasCollectible: false,
        imageFile: null,
        iconFile: null,
        isEdit: false,
        mainImageRemoved: false,
        iconImageRemoved: false,
      });
      setExistingImages({
        mainImage: '',
        iconImage: '',
      });
      setNewImagePreviews({
        mainImage: '',
        iconImage: '',
      });
      setSelectedCollectible(null);
    }
  }, [open, isEdit, reset]);

  const loadCollectibles = async () => {
    setLoadingCollectibles(true);
    try {
      const collectibles = await fetchAllCollectibles();
      setAvailableCollectibles(collectibles);
    } catch (error) {
      console.error('Failed to load collectibles:', error);
      toast.error('Failed to load collectibles');
    } finally {
      setLoadingCollectibles(false);
    }
  };

  // Load initial data when editing
  useEffect(() => {
    if (!isEdit || !initialData || !open || availableCollectibles.length === 0) return;

    reset({
      name: initialData.name || '',
      description: initialData.description || '',
      address: initialData.address || '',
      arURL: initialData.arURL || '',
      priority: initialData.priority || 0,
      coordinates: initialData.coordinates || { lat: 0, lng: 0 },
      collectibleId: initialData.collectibleId || '',
      hasCollectible: !!initialData.collectibleId,
      imageFile: null,
      iconFile: null,
      isEdit: true,
      mainImageRemoved: !initialData.imgURL,
      iconImageRemoved: !initialData.iconURL,
    });

    setExistingImages({
      mainImage: initialData.imgURL || '',
      iconImage: initialData.iconURL || '',
    });

    if (initialData.collectibleId) {
      const collectible = availableCollectibles.find((c) => c.id === initialData.collectibleId);
      if (collectible) {
        setSelectedCollectible(collectible);
      }
    }
  }, [isEdit, initialData, open, availableCollectibles, setValue, reset]);

  const handleClose = () => {
    reset({
      name: '',
      description: '',
      address: '',
      arURL: '',
      collectibleId: '',
      priority: 0,
      coordinates: { lat: 0, lng: 0 },
      imageFile: null,
      iconFile: null,
      hasCollectible: false,
      isEdit: isEdit,
      mainImageRemoved: false,
      iconImageRemoved: false,
    });

    // Reset image states
    setExistingImages({
      mainImage: '',
      iconImage: '',
    });
    setNewImagePreviews({
      mainImage: '',
      iconImage: '',
    });
    setSelectedCollectible(null);

    onClose();
  };

  const handleImageChange = (file: File | null, type: 'mainImage' | 'iconImage') => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewImagePreviews((prev) => ({
          ...prev,
          [type]: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setNewImagePreviews((prev) => ({
        ...prev,
        [type]: '',
      }));
    }
  };

  const handleRemoveExistingImage = (type: 'mainImage' | 'iconImage') => {
    setExistingImages((prev) => ({
      ...prev,
      [type]: '',
    }));

    if (type === 'mainImage') {
      setValue('mainImageRemoved', true, { shouldValidate: true });
      setValue('imageFile', null);
    } else {
      setValue('iconImageRemoved', true, { shouldValidate: true });
      setValue('iconFile', null);
    }
  };

  const handleRemoveNewImage = (type: 'mainImage' | 'iconImage') => {
    setNewImagePreviews((prev) => ({
      ...prev,
      [type]: '',
    }));

    // Clear the file input
    if (type === 'mainImage') {
      setValue('imageFile', null);
    } else {
      setValue('iconFile', null);
    }
  };

  const handleCollectibleSelect = (collectibleId: string) => {
    const collectible = availableCollectibles.find((c) => c.id === collectibleId);
    setSelectedCollectible(collectible || null);
    setValue('collectibleId', collectibleId);
  };

  const handleRemoveCollectible = () => {
    setSelectedCollectible(null);
    setValue('collectibleId', '');
    setValue('hasCollectible', false);
  };

  const renderImageField = (
    fieldName: 'imageFile' | 'iconFile',
    label: string,
    type: 'mainImage' | 'iconImage',
    disabled = false
  ) => (
    <Controller
      name={fieldName}
      control={control}
      render={({ field: { onChange } }) => (
        <Box>
          <Typography variant="body2" fontWeight={500} mb={1}>
            {label}
          </Typography>

          <ImagePreview
            imageUrl={
              newImagePreviews[type] || // show new image first
              existingImages[type] || // fallback to existing
              undefined // nothing
            }
            label={
              newImagePreviews[type]
                ? 'New Image'
                : existingImages[type]
                  ? 'Current Image'
                  : 'No image'
            }
            onRemove={() => {
              if (newImagePreviews[type]) {
                handleRemoveNewImage(type);
              } else if (existingImages[type]) {
                handleRemoveExistingImage(type);
              }
            }}
            isExisting={!newImagePreviews[type] && !!existingImages[type]}
          />

          {/* File input */}
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
                handleImageChange(file, type);
              }}
              style={{ width: '100%' }}
              disabled={disabled}
            />
          </Box>

          {/* Helper text */}
          {isEdit && !newImagePreviews[type] && existingImages[type] && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              Leave empty to keep current image
            </Typography>
          )}

          {/* Error message */}
          {errors[fieldName] && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
              {errors[fieldName]?.message as string}
            </Typography>
          )}
        </Box>
      )}
    />
  );

  const renderCollectibleDetails = () => {
    if (!selectedCollectible) return null;

    return (
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {selectedCollectible.imageURL && (
                <Avatar
                  src={selectedCollectible.imageURL}
                  sx={{ width: 60, height: 60, borderRadius: 1 }}
                  variant="rounded"
                >
                  <PhotoIcon />
                </Avatar>
              )}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={600}>
                  {selectedCollectible.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Code: {selectedCollectible.redemptionCode}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Priority: {selectedCollectible.priority}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="error"
                onClick={handleRemoveCollectible}
                startIcon={<DeleteIcon />}
              >
                Remove
              </Button>
            </Box>
            <Typography variant="body2">{selectedCollectible.description}</Typography>
            {selectedCollectible.arSpotId && (
              <Chip
                label={`Currently assigned to: ${selectedCollectible.arSpotId}`}
                size="small"
                color="warning"
                variant="outlined"
              />
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  };

  const handleFormSubmit: SubmitHandler<ARSpotFormInputs> = async (data) => {
    try {
      if (isEdit && initialData?.id) {
        // Update existing AR Spot
        await updateARSpot(data, initialData.id, {
          imgURL: existingImages.mainImage,
          iconURL: existingImages.iconImage,
        });
      } else {
        // Create new AR Spot
        await createARSpot(data);
      }

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
    <Modal open={open} onClose={handleClose} key={initialData?.id || 'new'}>
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

          <form
            onSubmit={handleSubmit(handleFormSubmit as SubmitHandler<ARSpotFormInputs>)}
            noValidate
          >
            <Stack spacing={2}>
              {/* Basic AR Spot Fields */}
              {[
                { name: 'name', label: 'Name' },
                { name: 'description', label: 'Description' },
                { name: 'address', label: 'Address' },
                { name: 'arURL', label: 'AR URL' },
              ].map(({ name, label }) => (
                <Controller
                  key={name}
                  name={name as keyof ARSpotFormInputs}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={label}
                      fullWidth
                      error={!!errors[name as keyof typeof errors]}
                      helperText={errors[name as keyof typeof errors]?.message}
                    />
                  )}
                />
              ))}

              {/* Coordinates */}
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
                      slotProps={{
                        htmlInput: {
                          step: 0.0001,
                        },
                      }}
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
                      slotProps={{
                        htmlInput: {
                          step: 0.0001,
                        },
                      }}
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

              {/* AR Spot Images */}
              {renderImageField('imageFile', 'Main Image (.jpg or .png)', 'mainImage')}
              {renderImageField('iconFile', 'Icon Image (.jpg or .png)', 'iconImage')}

              <Divider sx={{ my: 2 }} />

              {/* Collectible Toggle */}
              <Controller
                name="hasCollectible"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value || false}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Add Collectible to this AR Spot"
                  />
                )}
              />

              {/* Collectible Section */}
              <Collapse in={hasCollectible}>
                <Accordion elevation={0} sx={{ border: '1px solid rgba(0, 0, 0, 0.12)' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" fontWeight={500}>
                      Collectible Assignment
                      {loadingCollectibles && <CircularProgress size={16} sx={{ ml: 1 }} />}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2}>
                      {/* Collectible Selection */}
                      <FormControl fullWidth>
                        <InputLabel>Select Collectible</InputLabel>
                        <Controller
                          name="collectibleId"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              label="Select Collectible"
                              disabled={loadingCollectibles}
                              error={!!errors.collectibleId}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                handleCollectibleSelect(e.target.value as string);
                              }}
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              {availableCollectibles.map((collectible) => (
                                <MenuItem key={collectible.id} value={collectible.id}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {collectible.imageURL && (
                                      <Avatar
                                        src={collectible.imageURL}
                                        sx={{ width: 24, height: 24 }}
                                      />
                                    )}
                                    <Box>
                                      <Typography variant="body2" fontWeight={500}>
                                        {collectible.title}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {collectible.redemptionCode}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                        {errors.collectibleId && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                            {errors.collectibleId?.message}
                          </Typography>
                        )}
                      </FormControl>

                      {/* Collectible Details Display */}
                      {renderCollectibleDetails()}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </Collapse>

              <Stack direction="row" justifyContent="flex-end" spacing={2} pt={2}>
                <Button onClick={handleClose} variant="outlined">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={loadingCollectibles}>
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
