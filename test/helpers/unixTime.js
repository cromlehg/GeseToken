// Returns the time of the last mined block in seconds
export default function unixTime (date) {
  return (new Date(date)).getTime() / 1000;
}
