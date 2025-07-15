import * as yup from 'yup';

export interface CollectibleFormInputs {
  title: string;
  description: string;
  redemptionCode: string;
  priority: number;
  tips: string;
  arSpotId?: string;

  imageFile: File | null;

  isEdit: boolean;
  imageRemoved: boolean;
}

const supportedFormats = ['image/jpeg', 'image/png'];

export const collectibleValidationSchema: yup.ObjectSchema<CollectibleFormInputs> = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  redemptionCode: yup.string().required('Redemption code is required'),
  priority: yup.number().min(0, 'Priority must be 0 or greater').required('Priority is required'),
  tips: yup.string().required('Tips are required'),

  arSpotId: yup.string().optional(), // Optional in both create/edit mode

  imageFile: yup
    .mixed<File>()
    .nullable()
    .defined()
    .when(['isEdit', 'imageRemoved'], {
      is: (isEdit: boolean, imageRemoved: boolean) => !isEdit || imageRemoved,
      then: (schema) =>
        schema.required('Image is required').test('fileType', 'Only JPG/PNG allowed', (value) => {
          if (!value) return false;
          return supportedFormats.includes(value.type);
        }),
      otherwise: (schema) => schema.nullable().defined(),
    }),

  isEdit: yup.boolean().required(),
  imageRemoved: yup.boolean().required(),
});
