import Typography from "@mui/material/Typography";

import { useExtensions, useContributionsResult } from "chartlets";

function ExtensionsInfo() {
  const extensions = useExtensions();
  const contributionsResult = useContributionsResult();
  if (contributionsResult.status === "ok") {
    return (
      <div style={{ display: "flex", gap: 5 }}>
        {extensions.map((extension, extIndex) => {
          const id = `extensions.${extIndex}`;
          return (
            <Typography
              key={id}
              style={{ padding: 4 }}
              fontSize="small"
            >{`${extension.name}/${extension.version}`}</Typography>
          );
        })}
      </div>
    );
  } else if (contributionsResult.error) {
    return <div>Error: {contributionsResult.error.message}</div>;
  } else if (contributionsResult.status === "pending") {
    return <div>{`Loading extensions...`}</div>;
  }
  return null;
}

export default ExtensionsInfo;
