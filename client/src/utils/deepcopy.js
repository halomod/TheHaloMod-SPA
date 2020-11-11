export default function deepcopy(object) {
  return JSON.parse(JSON.stringify(object));
}
