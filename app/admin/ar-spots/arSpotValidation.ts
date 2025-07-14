import * as yup from 'yup';

export interface ARSpotFormInputs {
  id: string;
  name: string;
  description: string;
  address: string;
  arURL: string;
  collectibleId: string;
  collectibleTips: string;
  priority: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  imageFile?: File | null;
  iconFile?: File | null;
}

const supportedFormats = ['image/jpeg', 'image/png'];

export const arSpotValidationSchema: yup.ObjectSchema<ARSpotFormInputs> = yup.object({
  id: yup.string().required('ID is required'),
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  address: yup.string().required('Address is required'),
  arURL: yup.string().url('Invalid AR URL').required('AR URL is required'),
  collectibleId: yup.string().required('Collectible ID is required'),
  collectibleTips: yup.string().required('Collectible tips are required'),
  priority: yup.number().min(0).required('Priority is required'),
  coordinates: yup.object({
    lat: yup.number().required('Latitude is required'),
    lng: yup.number().required('Longitude is required'),
  }),
  imageFile: yup
    .mixed<File>()
    .nullable()
    .test('required', 'Main image is required', function (value) {
      return !!value || this.options.context?.isEdit;
    })
    .test('fileType', 'Only JPG/PNG allowed', function (value) {
      if (!value) return true;
      return supportedFormats.includes(value.type);
    }),
  iconFile: yup
    .mixed<File>()
    .nullable()
    .test('required', 'Icon is required', function (value) {
      return !!value || this.options.context?.isEdit;
    })
    .test('fileType', 'Only JPG/PNG allowed', function (value) {
      if (!value) return true;
      return supportedFormats.includes(value.type);
    }),
});
