export type FiltersSearchParams = {
  sprint_ids: string[];
  assignee_ids: string[];
  status: string[];
  column_ids: string[];
  created_at: string[];
};

export function parseFiltersSearchParams(
  filtersSearchParams: string,
): FiltersSearchParams {
  const result: FiltersSearchParams = {
    sprint_ids: [],
    assignee_ids: [],
    status: [],
    column_ids: [],
    created_at: [],
  } as FiltersSearchParams;
  if (!filtersSearchParams) return result;

  const conditions = filtersSearchParams.split(/\s+AND\s+/i);

  for (const cond of conditions) {
    const inMatch = cond.match(/(\w+)\s+IN\s+\(([^)]+)\)/i);
    const eqMatch = cond.match(/(\w+)\s*=\s*([^]+)/);

    if (inMatch) {
      const key: keyof FiltersSearchParams =
        inMatch[1] as keyof FiltersSearchParams;
      const values = inMatch[2]
        .split(",")
        .map((v) => v.trim().replace(/^"(.*)"$/, "$1"));
      result[key] = values;
    } else if (eqMatch) {
      const key: keyof FiltersSearchParams =
        eqMatch[1] as keyof FiltersSearchParams;
      const value = eqMatch[2].trim().replace(/^"(.*)"$/, "$1");
      result[key] = [value];
    }
  }

  return result;
}
