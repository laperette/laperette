import { Box, Button } from "grommet";
import React from "react";
import { Previous, Next } from "grommet-icons";

interface Props {
  decrementMonth: () => void;
  resetToDate: () => void;
  incrementMonth: () => void;
}
export const Navigation: React.FC<Props> = ({
  decrementMonth,
  resetToDate,
  incrementMonth,
}: Props) => {
  return (
    <Box direction="row" role="group">
      <Button
        primary
        label="Previous"
        icon={<Previous />}
        onClick={decrementMonth}
      ></Button>
      <Button primary label="Today" onClick={resetToDate}></Button>
      <Button
        primary
        label="Next"
        icon={<Next />}
        reverse
        onClick={incrementMonth}
      ></Button>
    </Box>
  );
};
