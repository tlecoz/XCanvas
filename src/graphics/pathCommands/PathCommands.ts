

export class PathCommands {


  public static MOVE_TO = 0;
  public static LINE_TO = 1;
  public static QUADRATIC_CURVE_TO = 3;
  public static RECT = 4;
  public static ARC = 5;
  public static ARC_TO = 6;
  public static BEZIER_CURVE_TO = 7;




  private static commandNames: { [key: string]: string };
  private static commandLengths: number[];

  public static get nameById(): { [key: string]: string } {
    if (!PathCommands.commandNames) {
      const c: { [key: string]: string } = PathCommands.commandNames = {};
      c[PathCommands.ARC] = "arc";
      c[PathCommands.RECT] = "rect";
      c[PathCommands.MOVE_TO] = "moveTo";
      c[PathCommands.LINE_TO] = "lineTo";
      c[PathCommands.ARC_TO] = "arcTo";
      c[PathCommands.BEZIER_CURVE_TO] = "bezierCurveTo";
      c[PathCommands.QUADRATIC_CURVE_TO] = "quadraticCurveTo";
    }

    return PathCommands.commandNames;
  }

  public static get lengthById(): number[] {
    if (!PathCommands.commandLengths) {
      const c: number[] = PathCommands.commandLengths = [];
      c[PathCommands.ARC] = 5;
      c[PathCommands.RECT] = 4;
      c[PathCommands.MOVE_TO] = 2;
      c[PathCommands.LINE_TO] = 2;
      c[PathCommands.ARC_TO] = 5;
      c[PathCommands.BEZIER_CURVE_TO] = 6;
      c[PathCommands.QUADRATIC_CURVE_TO] = 4;
    }

    return PathCommands.commandLengths;
  }


}
