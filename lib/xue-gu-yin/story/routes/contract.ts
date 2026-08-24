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

export const actFourRouteSceneIds = {
  zhao: ["zhaoBloodGate", "zhaoBloodGuard", "zhaoAwakening", "zhaoDuel", "zhaoClaim", "zhaoQiaoDuel"],
  ji: ["jiBloodGate", "jiBloodGuard", "jiRescue", "jiArrayTruth", "jiQiaoDuel", "jiDestroyGu"],
  su: ["suBloodGate", "suBloodGuard", "suCoffin", "suMasterTruth", "suMasterDuel", "suCollapse"],
  traitor: ["traitorControlRoom", "traitorTrapJi", "traitorSacrificeSu", "traitorQiaoTriumph", "traitorZhaoArrives", "traitorBloodTaken"],
} as const satisfies Record<PersonalityRouteId, readonly [string, string, string, string, string, string]>;

export const actFiveRouteSceneIds = {
  zhao: ["zhaoFall", "zhaoEpilogue"],
  ji: ["jiAftermath", "jiEpilogue"],
  su: ["suAftermath", "suEpilogue"],
  traitor: ["traitorDiscarded", "traitorDeath"],
} as const satisfies Record<PersonalityRouteId, readonly [string, string]>;

export const actFourRouteEntries: Record<PersonalityRouteId, string> = {
  zhao: actFourRouteSceneIds.zhao[0],
  ji: actFourRouteSceneIds.ji[0],
  su: actFourRouteSceneIds.su[0],
  traitor: actFourRouteSceneIds.traitor[0],
};
