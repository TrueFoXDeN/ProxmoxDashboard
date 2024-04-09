import {TreeNode} from "primeng/api";

export interface ExtendedTreeNode extends TreeNode {
  isOnline: boolean,
  children?: ExtendedTreeNode[]
}
