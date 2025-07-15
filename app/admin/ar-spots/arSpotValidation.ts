import * as yup from 'yup';

export interface ARSpotFormInputs {
  name: string;
  description: string;
  address: string;
  arURL: string;
  collectibleId?: string;
  priority: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  imageFile: File | null;
  iconFile: File | null;
  hasCollectible: boolean;

  isEdit: boolean;
  mainImageRemoved: boolean;
  iconImageRemoved: boolean;
}

const supportedFormats = ['image/jpeg', 'image/png'];

export const arSpotValidationSchema: yup.ObjectSchema<ARSpotFormInputs> = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  address: yup.string().required('Address is required'),
  arURL: yup.string().url('Invalid AR URL').required('AR URL is required'),

  collectibleId: yup.string().when('hasCollectible', {
    is: true,
    then: (schema) => schema.required('Please select a collectible'),
    otherwise: (schema) => schema.optional(),
  }),

  priority: yup.number().min(0).required('Priority is required'),

  coordinates: yup.object({
    lat: yup.number().required('Latitude is required'),
    lng: yup.number().required('Longitude is required'),
  }),

  imageFile: yup
    .mixed<File>()
    .nullable()
    .defined()
    .when(['isEdit', 'mainImageRemoved'], {
      is: (isEdit: boolean, removed: boolean) => !isEdit || removed,
      then: (schema) =>
        schema
          .required('Main image is required')
          .test('fileType', 'Only JPG/PNG allowed', (value) => {
            if (!value) return false;
            return supportedFormats.includes(value.type);
          }),
      otherwise: (schema) => schema.nullable().defined(),
    }),

  iconFile: yup
    .mixed<File>()
    .nullable()
    .defined()
    .when(['isEdit', 'iconImageRemoved'], {
      is: (isEdit: boolean, removed: boolean) => !isEdit || removed,
      then: (schema) =>
        schema.required('Icon is required').test('fileType', 'Only JPG/PNG allowed', (value) => {
          if (!value) return false;
          return supportedFormats.includes(value.type);
        }),
      otherwise: (schema) => schema.nullable().defined(),
    }),

  hasCollectible: yup.boolean().required(),
  isEdit: yup.boolean().required(),
  mainImageRemoved: yup.boolean().required(),
  iconImageRemoved: yup.boolean().required(),
});
