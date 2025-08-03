import { Insertable, Selectable, Updateable } from "kysely";
import { TRunningDistanceId } from "~/data/data.running-distance";

export interface DbShoeDetectionTable {
  id: string;
  gender: string;
  color: string;
  brand: string;
  model: string;
  createdAt: string;
  createdById: string;
  updatedAt: string;
  updatedById: string;
  clientId: string;
  imageName: string;

  event: string;
  eventAt: string;
  distance: TRunningDistanceId;
  distanceNum: number;
  startedAt: string;
  finishedAt: string | null;
  minuteKm: string;
  podium: "YES" | "NO";
  dataStatus: "ORIGINAL" | "EDITED";
  runningNum: string,
}

export type DbShoeDetection = Selectable<DbShoeDetectionTable>;
export type DbNewShoeDetection = Insertable<DbShoeDetectionTable>;
export type DbShoeDetectionUpdate = Updateable<DbShoeDetectionTable>;
