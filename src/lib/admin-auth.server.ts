export function checkPassword(password: string) {
  const expected = process.env["ADMIN_PASSWORD"];
  if (!expected || password !== expected) throw new Error("Invalid admin password");
}

export function makeTrackingId() {
  return `SHU-${Math.floor(1000 + Math.random() * 8999)}`;
}
