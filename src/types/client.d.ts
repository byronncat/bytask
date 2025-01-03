declare type NextImage = {
  src: string;
  alt: string;
};

declare type Option = {
  id: number;
  option: React.ReactNode | string;
  value: string | number;
  default?: boolean;
};

declare type HexColor = string;
