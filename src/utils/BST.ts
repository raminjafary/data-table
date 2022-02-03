import type { DataTableRow } from "@/types";

class BSTNode {
  public left!: BSTNode | null;
  public right!: BSTNode | null;
  public data!: DataTableRow[];

  constructor() {
    this.data = [];
    this.left = null;
    this.right = null;
  }
}

export default class BST {
  public root!: BSTNode | null;
  static instance: BST | null;

  constructor(public data: DataTableRow[]) {
    if (BST.instance) {
      return BST.instance;
    }
    BST.instance = this;

    this.root = null;

    for (const d of data) {
      this.insert(d);
    }
  }

  insert(data: DataTableRow) {
    if (this.root == null) {
      this.root = new BSTNode();
      this.root.data.push(data);
    } else {
      this.insertNode(this.root, data);
    }
  }

  insertNode(parent: BSTNode, data: DataTableRow) {
    if (data.date < parent.data[0].date) {
      if (parent.left == null) {
        parent.left = new BSTNode();
        parent.left.data.push(data);
      } else {
        this.insertNode(parent.left, data);
      }
    } else if (data.date > parent.data[0].date) {
      if (parent.right == null) {
        parent.right = new BSTNode();
        parent.right.data.push(data);
      } else {
        this.insertNode(parent.right, data);
      }
    } else {
      parent.data.push(data);
    }
  }

  find(node: BSTNode | null = this.root, date: string): DataTableRow[] {
    if (node == null) return [];
    else if (date < node.data[0].date) {
      return this.find(node.left, date);
    } else if (date > node.data[0].date) {
      return this.find(node.right, date);
    } else {
      return node.data;
    }
  }
}
