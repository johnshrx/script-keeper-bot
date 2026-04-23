export const SCRIPT_PLACEHOLDER = "AQUI VA LA KEY";

import aimPechoJson from "./scripts/aim_pecho.json?raw";
import aimCuelloJson from "./scripts/aim_cuello.json?raw";
import aimDragJson from "./scripts/aim_drag.json?raw";
import aimPechoHologramaJson from "./scripts/aim_pecho_holograma.json?raw";
import aimCuelloHologramaJson from "./scripts/aim_cuello_holograma.json?raw";
import aimDragHologramaJson from "./scripts/aim_drag_holograma.json?raw";

export type ScriptId =
  | "aim_pecho"
  | "aim_cuello"
  | "aim_drag"
  | "aim_pecho_holograma"
  | "aim_cuello_holograma"
  | "aim_drag_holograma";

export const SCRIPTS: { id: ScriptId; label: string; template: string }[] = [
  { id: "aim_pecho", label: "Aim Pecho", template: aimPechoJson },
  { id: "aim_cuello", label: "Aim Cuello", template: aimCuelloJson },
  { id: "aim_drag", label: "Aim Drag", template: aimDragJson },
  { id: "aim_pecho_holograma", label: "Aim Pecho + Holograma", template: aimPechoHologramaJson },
  { id: "aim_cuello_holograma", label: "Aim Cuello + Holograma", template: aimCuelloHologramaJson },
  { id: "aim_drag_holograma", label: "Aim Drag + Holograma", template: aimDragHologramaJson },
];

// Backwards compat
export const SCRIPT_TEMPLATE = aimDragJson;

export const ACCESS_KEYS = ["EASYCHEATSGENERADOR2", "easy21"];
