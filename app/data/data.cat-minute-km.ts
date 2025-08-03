const _data = [
    { id: "Unknown", label: "UNKNOWN", min: 0, max: 0 },
    { id: "01_30", label: "0:00 - 3:00", min: 1, max: 3 * 60 },
    { id: "30_35", label: "3:01 - 3:30", min: 3 * 60 + 1, max: 3 * 60 + 30 },
    { id: "35_40", label: "3:31 - 4:00", min: 3 * 60 + 31, max: 4 * 60 },
    { id: "40_45", label: "4:01 - 4:30", min: 4 * 60 + 1, max: 4 * 60 + 30 },
    { id: "45_50", label: "4:31 - 5:00", min: 4 * 60 + 31, max: 5 * 60 },
    { id: "50_55", label: "5:01 - 5:30", min: 5 * 60 + 1, max: 5 * 60 + 30 },
    { id: "55_60", label: "5:31 - 6:00", min: 5 * 60 + 31, max: 6 * 60 },
    { id: "60_65", label: "6:01 - 6:30", min: 6 * 60 + 1, max: 6 * 60 + 30 },
    { id: "65_70", label: "6:31 - 7:00", min: 6 * 60 + 31, max: 7 * 60 },
    { id: "70_75", label: "7:01 - 7:30", min: 7 * 60 + 1, max: 7 * 60 + 30 },
    { id: "75_00", label: "ABOVE 7:31", min: 7 * 60 + 31, max: 100_000_000 },
] as const;

export type TCatMinuteKmId = (typeof _data)[number]["id"];
export type TCatMinuteKm = {
    id: TCatMinuteKmId;
    label: string;
    min: number;
    max: number;
};
export const dataCatMinuteKm: TCatMinuteKm[] = _data as any;
export const getDataCatMinuteKm = (id: TCatMinuteKmId): TCatMinuteKm => {
    return _data.find((i) => i.id == id) ?? ([_data[0]] as any);
};
export const getDataCatMinuteKmBySec = (sec: number): TCatMinuteKm => {
    return _data.find((i) => i.min <= sec && i.max >= sec) ?? getDataCatMinuteKm("Unknown");
};

