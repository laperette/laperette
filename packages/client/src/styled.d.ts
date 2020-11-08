import "styled-components";
import { theme } from "./contexts/theme";

type MuiTheme = typeof theme;

declare module "styled-components" {
  export interface DefaultTheme extends MuiTheme {}
}
