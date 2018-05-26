const time = {};

// Takes a unix timestamp and returns a pretty date in the format: Sat, 3 Feb
function getPrettyDate(timestamp) {
  const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];
  const date = new Date(timestamp);

  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
}
time.getPrettyDate = getPrettyDate;

// Takes a unix timestamp and returns the time in the format: 13:00
function getTime(timestamp) {
  const date = new Date(timestamp);
  return `${date.getHours()}:${date.getMinutes()}`;
}
time.getTime = getTime;

export default time;
