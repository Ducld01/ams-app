import dayjs from 'dayjs';

export const formatUIDate = (date?: string) => (date ? dayjs(date).format('DD/MM/YYYY') : '');

export const formatDateFromLib = (date?: dayjs.Dayjs) =>
  date ? dayjs(date).format('DD/MM/YYYY') : '';

export const formatDateTime = (dateTimeString?: string) => {
  if (!dateTimeString) {
    return 'Chờ cập nhật';
  }
  const parsedDateTime = new Date(dateTimeString);
  const formattedDate = parsedDateTime.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const hours = (parsedDateTime.getHours() + 7).toString().padStart(2, '0');
  const minutes = parsedDateTime.getMinutes().toString().padStart(2, '0');

  const [date, month, year] = formattedDate.split('/');
  const formattedDateTime = `${hours}h${minutes} ngày ${date}/${month}/${year}`;

  return formattedDateTime;
};
