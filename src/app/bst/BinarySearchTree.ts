import {TreeNode} from './TreeNode';

export class BinarySearchTree<K, V> {
    private root: TreeNode<K, V> | null = null;

    public insert(key: K, value: V): void {
        let nodePointer = this.root;
        const node = new TreeNode<K, V>(key, value);
        if (nodePointer === null) {
            this.root = node;
        } else {
            while (true) {
                if (key === nodePointer.key) {
                    break;
                } else if (key > nodePointer.key) {
                    if (nodePointer.right === null) {
                        nodePointer.right = node;
                        break;
                    }
                    nodePointer = nodePointer.right;
                } else {
                    if (nodePointer.left == null) {
                        nodePointer.left = node;
                        break;
                    }
                    nodePointer = nodePointer.left;
                }
            }
        }
    }

    public find(key: K): TreeNode<K, V> | null {
        let nodePointer = this.root;
        if (nodePointer === null) {
            return null;
        } else {
            while (true) {
                if (key === nodePointer.key) {
                    return nodePointer;
                } else if (key > nodePointer.key) {
                    if (nodePointer.right === null) {
                        return null;
                    }
                    nodePointer = nodePointer.right;
                } else {
                    if (nodePointer.left == null) {
                        return null;
                    }
                    nodePointer = nodePointer.left;
                }
            }
        }
    }

    public remove(key: K): void {
        let parent: TreeNode<K, V> | null = null;
        let v = this.root;
        while (true) {
            if (v == null) {
                return;
            }
            else if (key < v.key) {
                parent = v;
                v = v.left;
            }
            else if (key > v.key) {
                parent = v;
                v = v.right;
            } else {
                break;
            }
        }

        let result: TreeNode<K, V> | null = null;

        if (v.left == null) {
            result = v.right;
        } else if (v.right == null) {
            result = v.left;
        }
        else {
            let minNodeParent = v;
            let minNode = v.right;
            while (minNode.left != null) {
                minNodeParent = minNode;
                minNode = minNode.left;
            }
            result = v;
            v.key = minNode.key;
            this.replaceChild(minNodeParent, minNode, minNode.right);
        }

        this.replaceChild(parent, v, result);
    }

    private replaceChild(parent: TreeNode<K, V> | null, old: TreeNode<K, V>, newNode: TreeNode<K, V> | null): void {
        if (parent == null) {
            this.root = newNode;
        }
        else if (parent.left === old) {
            parent.left = newNode;
        }
        else if (parent.right === old) {
            parent.right = newNode;
        }
    }

    public getRoot(): TreeNode<K, V> | null {
        return this.root;
    }

    public getNodesArray(): TreeNode<K, V>[] {

        const nodes: TreeNode<K, V>[] = [];
        let cursor = this.root;
        let counter = 0;
        let c = 10000;

        if (cursor == null) {
            return nodes;
        }

        let flag = false;

        while (true) {
            // console.log(counter);
            if (cursor != null) {
                if (counter === nodes.length) {
                    nodes.push(cursor);
                    cursor = cursor.left;
                } else {
                    counter += nodes.length - 1;
                    cursor = cursor.right;
                    flag = true;
                }
                counter++;
            } else {
                counter -= flag ? 2 : 1;
                cursor = nodes[counter];
            }
            if (c-- < 0) {
                break;
            }
            if (counter < 0) {
                break;
            }
        }

        return nodes;
    }

    public getHeight(): number {
        return this.findHeight(this.root);
    }

    private findHeight(node: TreeNode<K, V> | null): number {
        if (node != null) {
            return 1 + Math.max(this.findHeight(node.left), this.findHeight(node.right));
        } else {
            return 0;
        }
    }
}
