import * as yup from 'yup';

export interface RedemptionItemFormInputs {
  title: string;
  description: string;
  priority: number;
  stock: number;
  requiredCollectibleId: string;

  imageFile: File | null;
  isEdit: boolean;
  imageRemoved: boolean;
}

const supportedFormats = ['image/jpeg', 'image/png'];

export const redemptionItemValidationSchema: yup.ObjectSchema<RedemptionItemFormInputs> =
  yup.object({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    priority: yup
      .number()
      .typeError('Priority must be a number')
      .min(0, 'Priority must be 0 or greater')
      .required('Priority is required'),
    stock: yup
      .number()
      .typeError('Stock must be a number')
      .min(0, 'Stock must be 0 or greater')
      .required('Stock is required'),
    requiredCollectibleId: yup.string().required('You must select a collectible'),

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
