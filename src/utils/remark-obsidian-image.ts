import { visit } from "unist-util-visit";
import type { Node } from "unist";

export function remarkObsidianImage() {
  return function (tree: Node) {
    visit(tree, "text", (node: any, index: number, parent: any) => {
      if (!parent || !node.value) return;

      const regex = /!\[\[([^\]]+)\]\]/g;
      const newNodes = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(node.value)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          newNodes.push({
            type: "text",
            value: node.value.slice(lastIndex, match.index),
          });
        }

        // Add the image node (transform ![[Pasted image ...]] to ![Pasted image ...](./Pasted image ...))
        const fileName = match[1];
        newNodes.push({
          type: "image",
          url: `./${fileName}`,
          alt: fileName,
        });

        lastIndex = regex.lastIndex;
      }

      if (newNodes.length === 0) return;

      // Add remaining text
      if (lastIndex < node.value.length) {
        newNodes.push({
          type: "text",
          value: node.value.slice(lastIndex),
        });
      }

      // Replace the text node with the new sequence of nodes
      parent.children.splice(index, 1, ...newNodes);

      // Return the new index so we skip over the newly created nodes
      return index + newNodes.length;
    });
  };
}
