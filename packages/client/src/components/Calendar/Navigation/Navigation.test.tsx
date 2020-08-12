import React from "react";
import { render } from "@testing-library/react";
import { Navigation } from "./Navigation";

describe(Navigation.name, () => {
  it("should display the navigation buttons", async () => {
    const props = {
      decrementMonth: () => {},
      resetToDate: () => {},
      incrementMonth: () => {},
    };

    const { findByText } = render(<Navigation {...props} />);

    const previousButton = await findByText("Previous");
    const todayButton = await findByText("Today");
    const nextButton = await findByText("Next");

    expect(previousButton).toBeInTheDocument();
    expect(todayButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });
});
