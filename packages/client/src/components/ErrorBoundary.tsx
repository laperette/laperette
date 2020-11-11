import React from "react";
import { FullPageErrorFallback } from "./FullPageErrorCallback";

export class ErrorBoundary extends React.Component<
  any,
  { error: Error | undefined }
> {
  constructor(props: any) {
    super(props);
    this.state = { error: undefined };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return <FullPageErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
