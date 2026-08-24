import type { PersonalityRouteId } from "../../model.ts";

export const actThreeRouteSceneIds = {
  zhao: ["zhaoTrail", "zhaoLesson", "zhaoPrice", "zhaoThreshold"],
  ji: ["jiTrail", "jiPromise", "jiBurden", "jiThreshold"],
  su: ["suTrail", "suInscription", "suLineage", "suThreshold"],
  traitor: ["traitorTrail", "traitorKnife", "traitorBargain", "traitorOath"],
} as const satisfies Record<PersonalityRouteId, readonly [string, string, string, string]>;

export const actThreeRouteEntries: Record<PersonalityRouteId, string> = {
  zhao: actThreeRouteSceneIds.zhao[0],
  ji: actThreeRouteSceneIds.ji[0],
  su: actThreeRouteSceneIds.su[0],
  traitor: actThreeRouteSceneIds.traitor[0],
};

