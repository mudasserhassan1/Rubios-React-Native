export function payloadScript(payload) {
  return `
  document.getElementById('payload').value = ${JSON.stringify(payload)};
  true;
  `;
}
export const submitScript = `
document.getElementById('submitButton').click();
true`;
