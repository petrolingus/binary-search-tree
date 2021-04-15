export class TreeNode<K, V> {
    key: K;
    value: V;
    right: TreeNode<K, V> | null = null;
    left: TreeNode<K, V> | null = null;

    constructor(key: K, value: V) {
        this.key = key;
        this.value = value;
    }

    isLeave(): boolean {
        return this.right == null && this.left == null;
    }
}
