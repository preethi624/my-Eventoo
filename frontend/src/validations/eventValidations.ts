import * as Yup from 'yup';

export const eventSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required'),

  category: Yup.string()
    .required('Category is required'),

  description: Yup.string()
    .required('Description is required'),

 date: Yup.date()
  .transform((value, originalValue) => {
    return typeof originalValue === 'number' ? new Date(originalValue) : value;
  })
  .required('Date is required')
  .min(new Date().setHours(0, 0, 0, 0), 'Date cannot be in the past'),


  time: Yup.string()
    .required('Time is required')
    .test('is-future-time', 'You cannot use a past date and time', function (value) {
      const { date } = this.parent;
      if (!date || !value) return true;

      const now = new Date();
      const selectedDate = new Date(date);
      const [hours, minutes] = value.split(':').map(Number);

      selectedDate.setHours(hours, minutes, 0, 0);

      return selectedDate > now;
    }),

  venue: Yup.string()
    .required('Venue is required'),

  capacity: Yup.number()
    .typeError('Capacity must be a number')
    .required('Capacity is required')
    .moreThan(0, 'Capacity must be greater than 0'),

  ticketPrice: Yup.number()
    .typeError('Ticket price must be a number')
    .required('Ticket price is required')
    .min(0, 'Ticket price cannot be negative'),

  images: Yup.mixed()
    .required('Please upload at least one image')
    .test('is-not-empty', 'Please upload at least one image', (value) => {
      return value && value.length > 0;
    }),
});
