import { Composition } from "remotion";
import EgocentricPipeline from "./EgocentricPipeline";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="EgocentricPipeline"
        component={EgocentricPipeline}
        durationInFrames={258}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
