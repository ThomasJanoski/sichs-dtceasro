export function entityId(row: Record<string, unknown>): number {
  const id = row['id'] ?? row['idmilitares'] ?? row['idhidrometros'] ?? row['idhidrometro02'];
  if (id !== undefined && id !== null) {
    return Number(id);
  }
  for (const key of Object.keys(row)) {
    if (key.startsWith('id') && row[key] != null) {
      return Number(row[key]);
    }
  }
  return 0;
}
