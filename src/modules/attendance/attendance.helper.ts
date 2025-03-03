import moment from 'moment';

const getDayRange = (date: Date) => {
  const start = moment(date).startOf('day').toDate();
  const end = moment(date).endOf('day').toDate();

  return { start, end };
};

export const attendanceHelper = { getDayRange };
