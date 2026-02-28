"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CardErrorBoundaryProps {
  children: React.ReactNode;
  cardName?: string;
}

interface CardErrorBoundaryState {
  hasError: boolean;
}

export class CardErrorBoundary extends React.Component<
  CardErrorBoundaryProps,
  CardErrorBoundaryState
> {
  constructor(props: CardErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): CardErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error(
      `Error in ${this.props.cardName || "Card"}:`,
      error,
      errorInfo,
    );
  }

  handleRetry = (): void => {
    this.setState({ hasError: false });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">
                  Impossibile caricare{" "}
                  {this.props.cardName || "questo contenuto"}
                </span>
              </div>
              <button
                onClick={this.handleRetry}
                className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Riprova
              </button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
