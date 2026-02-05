import * as MuiIcons from "@mui/icons-material";

interface IconProps {
  iconName?: string;
}

export const Icon = ({ iconName }: IconProps) => {
  if (!iconName) return null;

  const IconComponent = (MuiIcons as Record<string, React.ElementType>)[
    iconName
  ];

  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in @mui/icons-material`);
    return null;
  }

  return <IconComponent />;
};
