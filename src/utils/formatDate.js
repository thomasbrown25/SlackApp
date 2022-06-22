import moment from "moment";

function formatDate(date) {
  return new moment(date).format('MMM Do')
}

export default formatDate;
