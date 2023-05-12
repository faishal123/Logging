export const renderDebugInfos = (
  debugMode: boolean,
  infos: (string | number | boolean)[]
) => {
  if (debugMode) {
    return (
      <div style={{ background: "white" }}>
        {infos.map((info) => (
          <div>{`${info}`}</div>
        ))}
      </div>
    );
  }
  return null;
};
