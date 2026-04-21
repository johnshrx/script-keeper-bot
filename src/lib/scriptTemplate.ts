export const SCRIPT_PLACEHOLDER = "AQUI VA LA KEY";

import aimPechoJson from "./scripts/aim_pecho.json?raw";
import aimCuelloJson from "./scripts/aim_cuello.json?raw";
import aimDragJson from "./scripts/aim_drag.json?raw";

export type ScriptId = "aim_pecho" | "aim_cuello" | "aim_drag";

export const SCRIPTS: { id: ScriptId; label: string; template: string }[] = [
  { id: "aim_pecho", label: "Aim Pecho", template: aimPechoJson },
  { id: "aim_cuello", label: "Aim Cuello", template: aimCuelloJson },
  { id: "aim_drag", label: "Aim Drag", template: aimDragJson },
];

// Backwards compat
export const SCRIPT_TEMPLATE = aimDragJson;

export const ACCESS_KEYS = ["EASYCHEATSGENERADOR2"];
