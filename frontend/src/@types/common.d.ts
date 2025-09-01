interface Modal {
  open: boolean;
  bodyClass?: string;
  onClose: () => void;
  onEsc: () => void;
  children: any;
  title?: string;
  size?: "full" | "medium" | "small";
}
