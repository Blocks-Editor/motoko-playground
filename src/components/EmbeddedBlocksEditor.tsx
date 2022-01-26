import { BlocksEditor } from "react-blocks-editor";
import { useCallback, useMemo } from "react";

// Special comment prefix for .blocks file
export const BLOCKS_PREFIX = "//@BlocksEditor";

export type EmbeddedBlocksEditorProps = {
  value: string;
  onChange?: (value: string) => void;
};

// const StyledBlocksEditor = styled(BlocksEditor)`
//   height: 100%;
// `;
const StyledBlocksEditor = BlocksEditor;
const blocksEditorStyle = { height: "100%" };

export const EmbeddedBlocksEditor = ({
  value,
  onChange,
}: EmbeddedBlocksEditorProps): JSX.Element => {
  value = value || "";

  // Note: all values are memoized during the first render pass

  const prefixIndex = value.indexOf(BLOCKS_PREFIX);
  const serializedState =
    prefixIndex !== -1
      ? value.substring(prefixIndex + BLOCKS_PREFIX.length).trim()
      : null;

  const familiarity = serializedState ? "familiar" : "none";
  const options = useMemo(
    () => ({
      menu: "hidden",
      theme: "grey",
      familiarity,
    }),
    [
      /* familiarity */
    ]
  );

  const handleStart = useCallback(
    ({ loadState }) => {
      if (serializedState) {
        loadState(JSON.parse(serializedState));
      }
    },
    [
      /* serializedState */
    ]
  );

  const handleSave = useCallback(
    (state) => {
      const generated = state.output.trim();
      const source = JSON.stringify({
        ...state,
        output: undefined,
        name: state.name || undefined,
        description: state.description || undefined,
        readme: state.readme || undefined,
      });
      const blocksData = `${BLOCKS_PREFIX} ${source}`;
      onChange?.(generated ? `${generated}\n\n${blocksData}` : blocksData);
    },
    [
      /* onChange */
    ]
  );

  return (
    <StyledBlocksEditor
      style={blocksEditorStyle}
      options={options}
      onSave={handleSave}
    >
      {handleStart}
    </StyledBlocksEditor>
  );
};
