export interface AppComponentState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export interface AppComponentProps {
  message: string;
}
